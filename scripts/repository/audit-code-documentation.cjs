/**
 * @fileoverview scripts/repository/audit-code-documentation.cjs
 * Purpose: Verify that authored source files and meaningful executable units carry useful maintenance documentation without forcing comments onto self-explanatory one-line callbacks.
 * Responsibilities:
 * - Require a structured ownership header near the start of each authored code file.
 * - Parse JavaScript and TypeScript with the compiler API so function checks follow syntax rather than regular-expression guesses.
 * - Require complete function contracts for named declarations, methods, accessors, constructors, and functions assigned to variables or object properties.
 * - Require callback contracts only when an anonymous callback contains enough logic to benefit from an explanation.
 * - Reject missing or duplicate contracts while leaving generated, vendored, minified, workflow, and other excluded output to its owning generator.
 * Execution context: Node.js quality check used by `npm run audit:code-docs` and the repository validation workflow.
 * Connected files:
 * - config/repository/code-documentation-policy.json
 * - package.json
 * - docs/codebase-structure.md
 * Maintenance: Keep this audit focused on useful engineering documentation. Do not make trivial syntax harder to read merely to increase comment counts.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

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
 * Purpose: Read the repository documentation policy used to choose authored files and supported source extensions.
 * Inputs: None.
 * Side effects: Reads `config/repository/code-documentation-policy.json` from disk.
 * Returns: Parsed documentation-policy object.
 */
function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) {
    throw new Error(`Missing code documentation policy: ${path.relative(ROOT, POLICY_PATH)}`);
  }
  return JSON.parse(fs.readFileSync(POLICY_PATH, 'utf8'));
}

/**
 * Function contract: gitTrackedFiles
 * Purpose: Read the exact tracked Git file list so the audit ignores untracked build or editor artifacts.
 * Inputs: None.
 * Side effects: Runs `git ls-files` in the repository root.
 * Returns: Sorted repository-relative tracked file paths.
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
 * Purpose: Determine whether repository policy excludes a tracked file from authored-code documentation checks.
 * Inputs: `file` - repository-relative path; `policy` - parsed documentation policy.
 * Side effects: None.
 * Returns: `true` when the file matches an excluded prefix or exact excluded path.
 */
function isExcluded(file, policy) {
  return policy.excludedPrefixes.some(
    /** Callback contract: Check one excluded path prefix against the current tracked file. Inputs: `prefix`. Side effects: None. Returns: Boolean prefix match. */
    (prefix) => file.startsWith(prefix),
  ) || policy.excludedFiles.includes(file);
}

/**
 * Function contract: isAuthoredFile
 * Purpose: Determine whether a tracked file belongs to an authored code root and is not excluded by repository policy.
 * Inputs: `file` - repository-relative path; `policy` - parsed documentation policy.
 * Side effects: None.
 * Returns: `true` when the file should participate in code-documentation checks.
 */
function isAuthoredFile(file, policy) {
  if (isExcluded(file, policy)) return false;
  return policy.codeRoots.some(
    /** Callback contract: Check whether the current file is the configured code root itself or lives beneath it. Inputs: `root`. Side effects: None. Returns: Boolean ownership match. */
    (root) => file === root || file.startsWith(`${root}/`),
  );
}

/**
 * Function contract: scriptKindFor
 * Purpose: Select the TypeScript compiler parser mode that matches a JavaScript/TypeScript source filename.
 * Inputs: `file` - repository-relative source path.
 * Side effects: None.
 * Returns: TypeScript `ScriptKind` value appropriate for TSX, TS, JSX, or JavaScript.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

/**
 * Function contract: isFunctionNode
 * Purpose: Identify syntax nodes that represent executable JavaScript/TypeScript functions with bodies.
 * Inputs: `node` - TypeScript AST node.
 * Side effects: None.
 * Returns: `true` for declarations, expressions, arrows, methods, constructors, getters, and setters.
 */
function isFunctionNode(node) {
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
 * Purpose: Resolve the maintainer-facing name and comment owner for a function-like AST node.
 * Inputs: `node` - function-like AST node; `sourceFile` - parsed source file.
 * Side effects: None.
 * Returns: Object containing `name`, `owner`, and whether the function is an anonymous inline callback.
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
 * Function contract: callbackNeedsContract
 * Purpose: Decide whether an anonymous callback contains enough logic that a nearby explanation materially improves maintenance.
 * Inputs: `node` - anonymous function or arrow-function AST node; `sourceFile` - parsed source file.
 * Side effects: None.
 * Returns: `true` for block callbacks with multiple statements or callbacks spanning more than five source lines.
 */
function callbackNeedsContract(node, sourceFile) {
  if (!node.body) return false;
  if (ts.isBlock(node.body) && node.body.statements.length > 1) return true;
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line;
  const end = sourceFile.getLineAndCharacterOfPosition(node.end).line;
  return end - start >= 5;
}

/**
 * Function contract: contractCommentsInLeadingTrivia
 * Purpose: Collect JSDoc-style comments immediately preceding the syntax node that owns a documentation contract.
 * Inputs: `source` - complete source text; `owner` - AST node that owns the comment; `sourceFile` - parsed source file.
 * Side effects: None.
 * Returns: Array of leading JSDoc comment blocks.
 */
function contractCommentsInLeadingTrivia(source, owner, sourceFile) {
  const fullStart = owner.getFullStart();
  const start = owner.getStart(sourceFile);
  const trivia = source.slice(fullStart, start);
  return trivia.match(/\/\*\*[\s\S]*?\*\//g) || [];
}

/**
 * Function contract: lineNumberAt
 * Purpose: Convert a source offset into the one-based line number used in audit diagnostics.
 * Inputs: `source` - complete source text; `position` - zero-based source offset.
 * Side effects: None.
 * Returns: One-based line number.
 */
function lineNumberAt(source, position) {
  return source.slice(0, position).split('\n').length;
}

/**
 * Function contract: missingFields
 * Purpose: Identify required documentation fields that are absent from one contract comment.
 * Inputs: `comment` - documentation comment text; `fields` - required field labels.
 * Side effects: None.
 * Returns: Array of missing field labels.
 */
function missingFields(comment, fields) {
  return fields.filter(
    /** Callback contract: Keep one required field when its label is absent from the current comment. Inputs: `field`. Side effects: None. Returns: Boolean indicating a missing documentation label. */
    (field) => !comment.includes(field),
  );
}

/**
 * Function contract: auditContract
 * Purpose: Validate that one function or meaningful callback has exactly one complete documentation contract.
 * Inputs: Object containing function identity, source text, parsed file, expected marker/fields, and the shared failure list.
 * Side effects: Appends human-readable diagnostics to `failures` when documentation is missing, duplicated, or incomplete.
 * Returns: Nothing.
 */
function auditContract({ file, source, sourceFile, identity, marker, fields, failures, node }) {
  const comments = contractCommentsInLeadingTrivia(source, identity.owner, sourceFile);
  const contracts = comments.filter(
    /** Callback contract: Select only leading comments that declare the expected function/callback contract marker. Inputs: `comment`. Side effects: None. Returns: Boolean marker match. */
    (comment) => comment.includes(marker),
  );
  const line = lineNumberAt(source, node.getStart(sourceFile));

  if (contracts.length !== 1) {
    failures.push(`${file}:${line} ${identity.name} requires exactly one ${marker} comment; found ${contracts.length}`);
    return;
  }

  const missing = missingFields(contracts[0], fields);
  if (missing.length) {
    failures.push(`${file}:${line} ${identity.name} contract is missing ${missing.join(', ')}`);
  }
}

/**
 * Function contract: auditFunctions
 * Purpose: Parse one JavaScript/TypeScript source file and validate documentation on named functions plus non-trivial anonymous callbacks.
 * Inputs: `file` - repository-relative source path; `source` - complete UTF-8 source text.
 * Side effects: None.
 * Returns: Array of function-documentation violations for the file.
 */
function auditFunctions(file, source) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKindFor(file));
  const failures = [];

  /**
   * Function contract: visit
   * Purpose: Walk the parsed syntax tree and audit each function-like node that requires a maintenance contract.
   * Inputs: `node` - current TypeScript AST node.
   * Side effects: Appends documentation violations to the enclosing `failures` array.
   * Returns: Nothing.
   */
  function visit(node) {
    if (isFunctionNode(node) && node.body) {
      const identity = functionIdentity(node, sourceFile);
      if (!identity.inline) {
        auditContract({
          file,
          source,
          sourceFile,
          identity,
          marker: 'Function contract:',
          fields: FUNCTION_FIELDS,
          failures,
          node,
        });
      } else if (callbackNeedsContract(node, sourceFile)) {
        auditContract({
          file,
          source,
          sourceFile,
          identity,
          marker: 'Callback contract:',
          fields: CALLBACK_FIELDS,
          failures,
          node,
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return failures;
}

/**
 * Function contract: main
 * Purpose: Audit tracked authored files for required file headers and function contracts, then fail validation with actionable diagnostics when violations remain.
 * Inputs: None.
 * Side effects: Reads tracked source files, writes audit diagnostics to stdout/stderr, and exits with status 1 when violations are present.
 * Returns: Nothing.
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
      const missing = FILE_HEADER_FIELDS.filter(
        /** Callback contract: Keep one required file-header field when it is absent from the configured header search window. Inputs: `field`. Side effects: None. Returns: Boolean indicating a missing header field. */
        (field) => !headerWindow.includes(field),
      );
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

  console.log(`[code-docs] Passed: ${headerCount} authored files have complete structured headers; ${functionFileCount} JS/TS files document all named functions and non-trivial callbacks.`);
}

main();
