/**
 * @fileoverview scripts/repository/audit-code-documentation.cjs
 * Purpose: Enforce structured file and function documentation across authored application and tooling code.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

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
/**
 * Function contract: loadPolicy
 * Purpose: Return policy from the supplied inputs or current audit code documentation repository tool state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads repository/filesystem state.
 * Returns: The requested policy; early-return/empty-state behavior follows the explicit branches in this function.
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
/**
 * Function contract: gitTrackedFiles
 * Purpose: Implements the git tracked files responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: gitTrackedFiles
 * Purpose: Implement the git tracked files responsibility owned by the audit code documentation repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: spawns child processes.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
/**
 * Function contract: isExcluded
 * Purpose: Implements the is excluded responsibility for this module.
 * Inputs: file, policy.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: isExcluded
 * Purpose: Determine whether excluded satisfies the condition represented by this audit code documentation repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed; `policy`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether excluded satisfies the documented condition.
 */
function isExcluded(file, policy) {
  return policy.excludedPrefixes.some(/** Callback contract: Processes the callback step for policy.excluded prefixes without leaking orchestration details to the caller. Inputs: prefix. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Evaluate whether the current item satisfies the condition needed for the enclosing existential check. Inputs: `prefix`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (prefix) => file.startsWith(prefix)) ||
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
/**
 * Function contract: isAuthoredFile
 * Purpose: Implements the is authored file responsibility for this module.
 * Inputs: file, policy.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: isAuthoredFile
 * Purpose: Determine whether authored file satisfies the condition represented by this audit code documentation repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed; `policy`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether authored file satisfies the documented condition.
 */
function isAuthoredFile(file, policy) {
  if (isExcluded(file, policy)) return false;
  return policy.codeRoots.some(/** Callback contract: Processes the callback step for policy.code roots without leaking orchestration details to the caller. Inputs: root. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Evaluate whether the current item satisfies the condition needed for the enclosing existential check. Inputs: `root`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (root) => file === root || file.startsWith(`${root}/`));
}

/**
 * Maps a source filename to a TypeScript parser mode that understands its syntax.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: a TypeScript ScriptKind value.
 */
/**
 * Function contract: scriptKindFor
 * Purpose: Implements the script kind for responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: scriptKindFor
 * Purpose: Implement the script kind for responsibility owned by the audit code documentation repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
/**
 * Function contract: documentationOwner
 * Purpose: Implements the documentation owner responsibility for this module.
 * Inputs: node.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: documentationOwner
 * Purpose: Implement the documentation owner responsibility owned by the audit code documentation repository tool.
 * Inputs: `node`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
/**
 * Function contract: hasLeadingExplanation
 * Purpose: Implements the has leading explanation responsibility for this module.
 * Inputs: source, position.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: hasLeadingExplanation
 * Purpose: Determine whether leading explanation satisfies the condition represented by this audit code documentation repository tool.
 * Inputs: `source`: source text or source object being processed; `position`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether leading explanation satisfies the documented condition.
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
/**
 * Function contract: lineNumberAt
 * Purpose: Implements the line number at responsibility for this module.
 * Inputs: source, position.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: lineNumberAt
 * Purpose: Implement the line number at responsibility owned by the audit code documentation repository tool.
 * Inputs: `source`: source text or source object being processed; `position`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
/**
 * Function contract: isDocumentableFunction
 * Purpose: Implements the is documentable function responsibility for this module.
 * Inputs: node.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: isDocumentableFunction
 * Purpose: Determine whether documentable function satisfies the condition represented by this audit code documentation repository tool.
 * Inputs: `node`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
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
 * Walks one JavaScript/TypeScript source file and reports undocumented function-like nodes.
 *
 * Inputs:
 * - file: repository-relative source path.
 * - source: complete source text.
 * Side effects: parses source into a TypeScript AST.
 * Returns: diagnostic strings for every function without nearby explanatory documentation.
 */
/**
 * Function contract: auditFunctions
 * Purpose: Validates audit functions and reports violations instead of silently accepting invalid state.
 * Inputs: file, source.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: auditFunctions
 * Purpose: Validate functions and surface actionable failures when the audit code documentation repository tool contract is violated.
 * Inputs: `file`: repository-relative or absolute file path being processed; `source`: source text or source object being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
  /**
   * Function contract: visit
   * Purpose: Implements the visit responsibility for this module.
   * Inputs: node.
   * Side effects: no obvious external side effect beyond invoked dependencies.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: visit
   * Purpose: Implement the visit responsibility owned by the audit code documentation repository tool.
   * Inputs: `node`: input consumed by this operation
   * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
/**
 * Function contract: main
 * Purpose: Implements the main responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state; may emit diagnostics or inspect process state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: main
 * Purpose: Implement the main responsibility owned by the audit code documentation repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads repository/filesystem state; emits diagnostics or changes process failure state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
