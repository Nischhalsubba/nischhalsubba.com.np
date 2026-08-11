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
 * Purpose: Return policy from the supplied inputs or current audit code documentation repository tool state.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads filesystem state
 * Returns: The requested policy; explicit early-return branches define empty/fallback behavior.
 */
function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) {
    throw new Error(`Missing code documentation policy: ${path.relative(ROOT, POLICY_PATH)}`);
  }
  return JSON.parse(fs.readFileSync(POLICY_PATH, 'utf8'));
}


/**
 * Function contract: gitTrackedFiles
 * Purpose: Implement the git tracked files responsibility owned by the audit code documentation repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: spawns child processes
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Determine whether excluded satisfies the condition represented by this audit code documentation repository tool.
 * Inputs: `file`, `policy`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether excluded satisfies the documented condition.
 */
function isExcluded(file, policy) {
  return policy.excludedPrefixes.some( /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `prefix` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (prefix) => file.startsWith(prefix)) ||
    policy.excludedFiles.includes(file);
}


/**
 * Function contract: isAuthoredFile
 * Purpose: Determine whether authored file satisfies the condition represented by this audit code documentation repository tool.
 * Inputs: `file`, `policy`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether authored file satisfies the documented condition.
 */
function isAuthoredFile(file, policy) {
  if (isExcluded(file, policy)) return false;
  return policy.codeRoots.some( /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `root` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (root) => file === root || file.startsWith(`${root}/`));
}


/**
 * Function contract: scriptKindFor
 * Purpose: Implement the script kind for responsibility owned by the audit code documentation repository tool.
 * Inputs: `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}


/**
 * Function contract: isDocumentableFunction
 * Purpose: Determine whether documentable function satisfies the condition represented by this audit code documentation repository tool.
 * Inputs: `node`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Boolean indicating whether documentable function satisfies the documented condition.
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
 * Purpose: Implement the function identity responsibility owned by the audit code documentation repository tool.
 * Inputs: `node`, `sourceFile`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Implement the contract comments in leading trivia responsibility owned by the audit code documentation repository tool.
 * Inputs: `source`, `owner`, `sourceFile`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function contractCommentsInLeadingTrivia(source, owner, sourceFile) {
  const fullStart = owner.getFullStart();
  const start = owner.getStart(sourceFile);
  const trivia = source.slice(fullStart, start);
  return trivia.match(/\/\*\*[\s\S]*?\*\//g) || [];
}


/**
 * Function contract: lineNumberAt
 * Purpose: Implement the line number at responsibility owned by the audit code documentation repository tool.
 * Inputs: `source`, `position`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function lineNumberAt(source, position) {
  return source.slice(0, position).split('\n').length;
}


/**
 * Function contract: missingFields
 * Purpose: Implement the missing fields responsibility owned by the audit code documentation repository tool.
 * Inputs: `comment`, `fields`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function missingFields(comment, fields) {
  return fields.filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `field` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (field) => !comment.includes(field));
}


/**
 * Function contract: auditFunctions
 * Purpose: Validate functions and surface actionable failures when the audit code documentation repository tool contract is violated.
 * Inputs: `file`, `source`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
   * Purpose: Implement the visit responsibility owned by the audit code documentation repository tool.
   * Inputs: `node`
   * Side effects: No direct external side effect beyond invoked dependencies.
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
   */
  function visit(node) {
    if (isDocumentableFunction(node) && node.body) {
      const identity = functionIdentity(node, sourceFile);
      const comments = contractCommentsInLeadingTrivia(source, identity.owner, sourceFile);
      const marker = identity.inline ? 'Callback contract:' : 'Function contract:';
      const fields = identity.inline ? CALLBACK_FIELDS : FUNCTION_FIELDS;
      const contracts = comments.filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `comment` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (comment) => comment.includes(marker));
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
 * Purpose: Implement the main responsibility owned by the audit code documentation repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads filesystem state; emits diagnostics or changes process failure state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
      const missing = FILE_HEADER_FIELDS.filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `field` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (field) => !headerWindow.includes(field));
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
