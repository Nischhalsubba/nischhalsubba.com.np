const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

/**
 * @fileoverview scripts/repository/audit-code-documentation.cjs
 * Purpose: Enforce detailed, non-duplicated file and function documentation across authored application and tooling code.
 * Responsibilities:
 * - Require structured file headers with purpose, responsibilities, execution context, connected files, and maintenance guidance.
 * - Parse JavaScript/TypeScript with the TypeScript compiler API so function checks follow real syntax rather than text patterns.
 * - Require exactly one detailed `Function contract` for named/assigned functions and exactly one `Callback contract` for inline callbacks.
 * - Require purpose/input/side-effect/return fields in every function contract and reject duplicate generated contracts.
 * - Exclude generated, vendored, minified, workflow-orchestration, and machine-owned output according to repository policy.
 * Execution context: Node.js during `npm run audit:code-docs` and the repository validation workflows.
 * Connected files:
 * - config/repository/code-documentation-policy.json
 * - package.json
 * - docs/codebase-structure.md
 * Maintenance: Keep checks syntax-aware and strict enough that passing the audit means a maintainer receives one useful contract per executable function.
 */

const ROOT = path.resolve(__dirname, '../..');
const POLICY_PATH = path.join(ROOT, 'config/repository/code-documentation-policy.json');
const FILE_HEADER_FIELDS = [
  '@fileoverview',
  'Purpose:',
  'Responsibilities:',
  'Execution context:',
  'Connected files:',
  'Maintenance:',
];
const FUNCTION_FIELDS = ['Function contract:', 'Purpose:', 'Inputs:', 'Side effects:', 'Returns:'];
const CALLBACK_FIELDS = ['Callback contract:', 'Inputs:', 'Side effects:', 'Returns:'];

/**
 * Function contract: loadPolicy
 * Purpose: Load the repository's authored-code documentation scope and exclusions from the single policy source of truth.
 * Inputs: None; uses the fixed repository-relative policy path.
 * Side effects: Reads one JSON file from the repository filesystem.
 * Returns: Parsed documentation-policy object consumed by the audit.
 */
function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) {
    throw new Error(`Missing code documentation policy: ${path.relative(ROOT, POLICY_PATH)}`);
  }
  return JSON.parse(fs.readFileSync(POLICY_PATH, 'utf8'));
}

/**
 * Function contract: gitTrackedFiles
 * Purpose: Return the Git-tracked repository paths so documentation enforcement follows version-controlled ownership rather than incidental working-tree files.
 * Inputs: None.
 * Side effects: Executes the read-only `git ls-files` command.
 * Returns: Sorted array of repository-relative tracked paths.
 */
function gitTrackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * Function contract: isExcluded
 * Purpose: Determine whether a tracked path belongs to generated/vendor/machine-owned territory excluded from hand-authored documentation requirements.
 * Inputs: `file`, repository-relative path; `policy`, parsed documentation policy.
 * Side effects: None.
 * Returns: Boolean indicating whether the path is excluded.
 */
function isExcluded(file, policy) {
  return policy.excludedPrefixes.some(/** Callback contract: Test the current excluded-prefix rule against the tracked path. Inputs: `prefix`. Side effects: no direct external side effect. Returns: boolean predicate result. */ (prefix) => file.startsWith(prefix)) ||
    policy.excludedFiles.includes(file);
}

/**
 * Function contract: isAuthoredFile
 * Purpose: Determine whether a tracked path falls under an authored-code root governed by the documentation contract.
 * Inputs: `file`, repository-relative path; `policy`, parsed documentation policy.
 * Side effects: None.
 * Returns: Boolean indicating whether the file must be audited.
 */
function isAuthoredFile(file, policy) {
  if (isExcluded(file, policy)) return false;
  return policy.codeRoots.some(/** Callback contract: Test whether the tracked path is the configured authored root or a descendant of it. Inputs: `root`. Side effects: no direct external side effect. Returns: boolean predicate result. */ (root) => file === root || file.startsWith(`${root}/`));
}

/**
 * Function contract: scriptKindFor
 * Purpose: Select the TypeScript parser mode that matches a JavaScript, JSX, TypeScript, or TSX source file.
 * Inputs: `file`, repository-relative source path.
 * Side effects: None.
 * Returns: TypeScript `ScriptKind` used by the compiler parser.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

/**
 * Function contract: isDocumentableFunction
 * Purpose: Identify executable function-like syntax that must carry a detailed documentation contract.
 * Inputs: `node`, TypeScript AST node.
 * Side effects: None.
 * Returns: Boolean for function declarations/expressions, arrows, methods, constructors, getters, and setters with bodies.
 */
function isDocumentableFunction(node) {
  return ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) ||
    ts.isConstructorDeclaration(node) ||
    ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node);
}

/**
 * Function contract: functionIdentity
 * Purpose: Classify a function as named/assigned or inline and select the syntax owner whose leading trivia must contain its contract.
 * Inputs: `node`, function-like AST node; `sourceFile`, parsed TypeScript source file.
 * Side effects: None.
 * Returns: Object containing a readable name, the documentation owner node, and `inline` classification.
 */
function functionIdentity(node, sourceFile) {
  if (node.name && node.name.getText) {
    return { name: node.name.getText(sourceFile), owner: node, inline: false };
  }
  if (ts.isConstructorDeclaration(node)) {
    return { name: 'constructor', owner: node, inline: false };
  }

  const parent = node.parent;
  if (parent && ts.isVariableDeclaration(parent) && parent.name) {
    const owner = parent.parent &&
      ts.isVariableDeclarationList(parent.parent) &&
      parent.parent.declarations.length === 1 &&
      parent.parent.parent
      ? parent.parent.parent
      : parent;
    return { name: parent.name.getText(sourceFile), owner, inline: false };
  }
  if (parent && ts.isPropertyAssignment(parent) && parent.name) {
    return { name: parent.name.getText(sourceFile), owner: parent, inline: false };
  }
  return { name: 'inline callback', owner: node, inline: true };
}

/**
 * Function contract: contractCommentsInLeadingTrivia
 * Purpose: Extract only JSDoc-style comments from the exact leading trivia owned by a function/callback, avoiding unrelated comments elsewhere in the file.
 * Inputs: `source`, complete source text; `owner`, AST node; `sourceFile`, parsed source file.
 * Side effects: None.
 * Returns: Array of JSDoc comment strings immediately leading the documentation owner.
 */
function contractCommentsInLeadingTrivia(source, owner, sourceFile) {
  const fullStart = owner.getFullStart();
  const start = owner.getStart(sourceFile);
  const trivia = source.slice(fullStart, start);
  return trivia.match(/\/\*\*[\s\S]*?\*\//g) || [];
}

/**
 * Function contract: lineNumberAt
 * Purpose: Convert a zero-based source offset to a one-based line number for actionable CI diagnostics.
 * Inputs: `source`, complete source text; `position`, zero-based character offset.
 * Side effects: None.
 * Returns: One-based source line number.
 */
function lineNumberAt(source, position) {
  return source.slice(0, position).split('\n').length;
}

/**
 * Function contract: missingFields
 * Purpose: Identify required documentation fields absent from one contract comment.
 * Inputs: `comment`, JSDoc contract text; `fields`, required marker/field list.
 * Side effects: None.
 * Returns: Array of missing field labels.
 */
function missingFields(comment, fields) {
  return fields.filter(/** Callback contract: Keep only required documentation fields that do not occur in the contract comment. Inputs: `field`. Side effects: no direct external side effect. Returns: boolean predicate result. */ (field) => !comment.includes(field));
}

/**
 * Function contract: auditFunctions
 * Purpose: Parse one JavaScript/TypeScript source file and enforce one complete, non-duplicated contract for every function and callback.
 * Inputs: `file`, repository-relative source path; `source`, complete source text.
 * Side effects: Parses source into a TypeScript AST; does not modify files.
 * Returns: Array of human-readable documentation violations with file/line locations.
 */
function auditFunctions(file, source) {
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    scriptKindFor(file),
  );
  const failures = [];

  /**
   * Function contract: visit
   * Purpose: Recursively inspect every syntax node and validate the exact leading contract attached to each function-like node.
   * Inputs: `node`, current TypeScript AST node.
   * Side effects: Appends diagnostics to the enclosing `failures` array.
   * Returns: Undefined; traversal proceeds through child nodes.
   */
  function visit(node) {
    if (isDocumentableFunction(node) && node.body) {
      const identity = functionIdentity(node, sourceFile);
      const comments = contractCommentsInLeadingTrivia(source, identity.owner, sourceFile);
      const marker = identity.inline ? 'Callback contract:' : 'Function contract:';
      const fields = identity.inline ? CALLBACK_FIELDS : FUNCTION_FIELDS;
      const contracts = comments.filter(/** Callback contract: Keep only leading JSDoc comments containing the contract marker required for this function classification. Inputs: `comment`. Side effects: no direct external side effect. Returns: boolean predicate result. */ (comment) => comment.includes(marker));
      const line = lineNumberAt(source, node.getStart(sourceFile));

      if (contracts.length !== 1) {
        failures.push(`${file}:${line} ${identity.name} requires exactly one ${marker} comment; found ${contracts.length}`);
      } else {
        const missing = missingFields(contracts[0], fields);
        if (missing.length) {
          failures.push(`${file}:${line} ${identity.name} contract is missing ${missing.join(', ')}`);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return failures;
}

/**
 * Function contract: main
 * Purpose: Run file-header and function-contract checks across every tracked authored source file and fail CI on any documentation debt.
 * Inputs: None; reads repository policy, Git index, and authored source files.
 * Side effects: Reads files, prints diagnostics, and exits non-zero on violations.
 * Returns: Undefined.
 */
function main() {
  const policy = loadPolicy();
  const tracked = gitTrackedFiles();
  const failures = [];
  let headerCount = 0;
  let functionFileCount = 0;

  for (const file of tracked) {
    if (!isAuthoredFile(file, policy)) continue;
    const extension = path.extname(file).toLowerCase();
    const needsHeader = policy.headerExtensions.includes(extension) || policy.headerBasenames.includes(path.basename(file));
    const needsFunctions = policy.functionExtensions.includes(extension);
    if (!needsHeader && !needsFunctions) continue;

    const absolute = path.join(ROOT, file);
    const source = fs.readFileSync(absolute, 'utf8');

    if (needsHeader) {
      headerCount += 1;
      const headerWindow = source.slice(0, policy.headerSearchCharacters);
      const missing = FILE_HEADER_FIELDS.filter(/** Callback contract: Keep only structured file-header fields absent from the configured header search window. Inputs: `field`. Side effects: no direct external side effect. Returns: boolean predicate result. */ (field) => !headerWindow.includes(field));
      if (missing.length) {
        failures.push(`${file}:1 file header is missing ${missing.join(', ')}`);
      }
    }

    if (needsFunctions) {
      functionFileCount += 1;
      failures.push(...auditFunctions(file, source));
    }
  }

  if (failures.length) {
    console.error(`[code-docs] ${failures.length} documentation violation(s):`);
    for (const failure of failures.slice(0, 300)) console.error(`- ${failure}`);
    if (failures.length > 300) console.error(`- ...and ${failures.length - 300} more`);
    process.exit(1);
  }

  console.log(`[code-docs] Passed: ${headerCount} authored files have complete structured headers; ${functionFileCount} JS/TS files have exactly one complete contract per function/callback.`);
}

main();
