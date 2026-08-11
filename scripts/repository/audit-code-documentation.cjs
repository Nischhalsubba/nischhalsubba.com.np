const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

/**
 * @fileoverview Enforces the repository's source-documentation contract.
 *
 * Responsibilities:
 * - Verify that authored code files start with a structured purpose/connection header.
 * - Verify that JavaScript and TypeScript function-like nodes have nearby explanatory comments.
 * - Ignore generated, vendored, binary, and machine-owned files that should not be hand-documented.
 * - Fail CI with exact file/line diagnostics so documentation debt cannot silently accumulate.
 *
 * Connected files:
 * - config/repository/code-documentation-policy.json: declares roots, extensions, and exclusions.
 * - scripts/repository/apply-deep-organization.cjs: migration that initially applies the contract.
 * - package.json: exposes this audit through npm scripts and the main validation command.
 *
 * Maintenance notes:
 * - Keep this audit syntax-aware. It uses the existing TypeScript compiler dependency instead of regex-only parsing.
 * - The audit intentionally accepts compact comments for trivial inline callbacks while requiring richer file headers.
 */

const ROOT = path.resolve(__dirname, '../..');
const POLICY_PATH = path.join(ROOT, 'config/repository/code-documentation-policy.json');
const HEADER_MARKER = '@fileoverview';
const FUNCTION_COMMENT_PATTERN = /(?:\/\*\*[\s\S]*?\*\/|\/\*[\s\S]*?\*\/|\/\/[^\n]*)\s*$/;

/**
 * Loads and parses the documentation policy used by this audit.
 *
 * Inputs: none. The policy path is repository-relative and fixed above.
 * Side effects: reads one JSON file from disk.
 * Returns: the parsed policy object.
 */
function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) {
    throw new Error(`Missing code documentation policy: ${path.relative(ROOT, POLICY_PATH)}`);
  }
  return JSON.parse(fs.readFileSync(POLICY_PATH, 'utf8'));
}

/**
 * Returns every Git-tracked path so the audit follows repository ownership rather than filesystem accidents.
 *
 * Inputs: none.
 * Side effects: executes `git ls-files` in the repository root.
 * Returns: sorted repository-relative paths using forward slashes.
 */
function gitTrackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * Determines whether a tracked path belongs to an excluded generated/vendor area.
 *
 * Inputs:
 * - file: repository-relative tracked path.
 * - policy: parsed documentation policy.
 * Side effects: none.
 * Returns: true when the path should not be inspected by this audit.
 */
function isExcluded(file, policy) {
  return policy.excludedPrefixes.some((prefix) => file.startsWith(prefix)) ||
    policy.excludedFiles.includes(file);
}

/**
 * Determines whether a file is inside one of the authored roots controlled by the policy.
 *
 * Inputs:
 * - file: repository-relative tracked path.
 * - policy: parsed documentation policy.
 * Side effects: none.
 * Returns: true for authored files under a configured code root.
 */
function isAuthoredFile(file, policy) {
  if (isExcluded(file, policy)) return false;
  return policy.codeRoots.some((root) => file === root || file.startsWith(`${root}/`));
}

/**
 * Maps a source filename to a TypeScript parser mode that understands its syntax.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: a TypeScript ScriptKind value.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

/**
 * Returns the nearest syntactic owner whose leading comment may document a function expression.
 *
 * Arrow/function expressions assigned to variables are commonly documented above the variable statement,
 * while callbacks are documented immediately before the expression. This helper lets the audit accept both.
 *
 * Inputs: function-like TypeScript AST node.
 * Side effects: none.
 * Returns: node whose start position should also be checked for a documentation comment.
 */
function documentationOwner(node) {
  let current = node;
  while (current.parent) {
    const parent = current.parent;
    if (ts.isVariableDeclaration(parent)) {
      if (parent.parent && ts.isVariableDeclarationList(parent.parent) && parent.parent.parent) {
        return parent.parent.parent;
      }
      return parent;
    }
    if (ts.isPropertyAssignment(parent) || ts.isPropertyDeclaration(parent)) return parent;
    if (ts.isExportAssignment(parent)) return parent;
    break;
  }
  return node;
}

/**
 * Tests whether meaningful explanatory prose appears directly before a syntax position.
 *
 * Inputs:
 * - source: complete source text.
 * - position: zero-based character offset returned by the parser.
 * Side effects: none.
 * Returns: true when a block/JSDoc/line comment immediately precedes the node.
 */
function hasLeadingExplanation(source, position) {
  const prefix = source.slice(Math.max(0, position - 1400), position);
  return FUNCTION_COMMENT_PATTERN.test(prefix);
}

/**
 * Converts a source offset to a one-based line number for actionable CI diagnostics.
 *
 * Inputs: source text and zero-based character offset.
 * Side effects: none.
 * Returns: one-based line number.
 */
function lineNumberAt(source, position) {
  return source.slice(0, position).split('\n').length;
}

/**
 * Identifies function-like AST nodes whose behavior should be documented.
 *
 * Inputs: TypeScript AST node.
 * Side effects: none.
 * Returns: true for functions, methods, constructors, getters, setters, and arrow functions with bodies.
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
 * Walks one JavaScript/TypeScript source file and reports undocumented function-like nodes.
 *
 * Inputs:
 * - file: repository-relative source path.
 * - source: complete source text.
 * Side effects: parses source into a TypeScript AST.
 * Returns: diagnostic strings for every function without nearby explanatory documentation.
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
   * Recursively visits syntax nodes and checks function documentation at the most natural owner position.
   *
   * Inputs: current TypeScript AST node.
   * Side effects: appends human-readable failures to the enclosing `failures` array.
   * Returns: nothing; traversal continues through child nodes.
   */
  function visit(node) {
    if (isDocumentableFunction(node) && node.body) {
      const owner = documentationOwner(node);
      const nodeStart = node.getStart(sourceFile);
      const ownerStart = owner.getStart(sourceFile);
      if (!hasLeadingExplanation(source, nodeStart) && !hasLeadingExplanation(source, ownerStart)) {
        failures.push(`${file}:${lineNumberAt(source, nodeStart)} function/callback is missing an explanatory comment`);
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return failures;
}

/**
 * Runs all header and function checks and exits non-zero when the repository violates its documentation contract.
 *
 * Inputs: none; reads policy and tracked source files from the current checkout.
 * Side effects: reads source files, prints diagnostics, and sets process exit status on failure.
 * Returns: nothing.
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
      if (!headerWindow.includes(HEADER_MARKER)) {
        failures.push(`${file}:1 missing structured ${HEADER_MARKER} header`);
      }
    }

    if (needsFunctions) {
      functionFileCount += 1;
      failures.push(...auditFunctions(file, source));
    }
  }

  if (failures.length > 0) {
    console.error(`[code-docs] ${failures.length} documentation violation(s):`);
    for (const failure of failures.slice(0, 250)) console.error(`- ${failure}`);
    if (failures.length > 250) console.error(`- ...and ${failures.length - 250} more`);
    process.exit(1);
  }

  console.log(`[code-docs] Passed: ${headerCount} authored files have structured headers; ${functionFileCount} JS/TS files have function documentation.`);
}

main();
