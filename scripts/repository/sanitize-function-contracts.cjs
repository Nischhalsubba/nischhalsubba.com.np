const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

/**
 * @fileoverview One-shot exact function-contract sanitizer for the deep organization PR.
 * Purpose: Remove duplicated generated function/callback comments from each function's exact leading trivia and rebuild one semantic contract per executable function.
 * Responsibilities:
 * - Use the TypeScript AST to identify each function and its natural documentation owner.
 * - Remove only `Function contract` and `Callback contract` JSDoc blocks attached to that owner; preserve unrelated authored comments and executable source.
 * - Reinsert one detailed named-function contract or one concise context-aware callback contract.
 * - Classify expression-bodied callbacks from AST syntax so lazy imports, predicates, transforms, and selected exports receive accurate return descriptions.
 * Execution context: Node.js in a temporary PR-only GitHub Actions workflow.
 * Connected files:
 * - scripts/repository/audit-code-documentation.cjs
 * - config/repository/code-documentation-policy.json
 * Maintenance: Temporary migration utility; deleted before the sanitized source commit is published.
 */

const ROOT = path.resolve(__dirname, '../..');
const POLICY = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/repository/code-documentation-policy.json'), 'utf8'));
const FUNCTION_EXTENSIONS = new Set(POLICY.functionExtensions);
const TEMPORARY_PATHS = new Set([
  'scripts/repository/sanitize-function-contracts.cjs',
  '.github/workflows/sanitize-function-contracts.yml',
]);

const PURPOSE_OVERRIDES = new Map(Object.entries({
  getFocusableElements: 'Collect descendants of the supplied overlay that are rendered, visible, and eligible for keyboard focus.',
  setBackgroundInert: 'Apply or restore inert state on background page elements while the mobile navigation overlay is open, preserving any pre-existing inert state.',
  syncOpenState: 'Synchronize menu classes, data attributes, labels, and ARIA state with the requested open/closed value.',
  setMenuState: 'Open or close the mobile navigation, coordinate inert background behavior, and move focus only after the related visibility/layout state is ready.',
  trapFocus: 'Keep Tab and Shift+Tab focus inside the open mobile navigation overlay, including the no-focusable-elements fallback.',
  initMobileMenu: 'Initialize mobile navigation exactly once, establish its accessibility state, and attach the click, keyboard, resize, and navigation listeners that control it.',
  pageSpecificFeatures: 'Select the lazy feature-definition list that applies to the current canonical route.',
  loadAndRunFeatures: 'Load requested feature initializers in parallel, isolate individual module-load failures, then execute every successfully resolved initializer.',
  organizedPageSource: 'Resolve a historical root-compatible HTML filename to its canonical core, project, or service source folder.',
  sourceForRootTarget: 'Resolve a root-compatible target filename through the materialization mapping instead of duplicating source-folder assumptions.',
  walkCssFiles: 'Recursively discover authored CSS files so nested style systems cannot escape architecture validation.',
  relativeStylePath: 'Normalize an absolute stylesheet path into the stable forward-slash form used by CSS policy checks and diagnostics.',
  readCommitted: 'Read the committed compatibility stylesheet when available so build-time working-tree mutations cannot hide CSS architecture regressions.',
  withoutComments: 'Remove CSS block comments before selector/declaration checks so commented examples do not create false policy violations.',
  onReady: 'Run the supplied initializer after DOM readiness, or immediately when document parsing has already completed.',
  runStages: 'Execute the ordered build stages sequentially with readable diagnostics and fail immediately when a stage exits unsuccessfully.',
}));

/**
 * Function contract: trackedFiles
 * Purpose: Return the Git-tracked repository paths used to select authored JavaScript and TypeScript files for sanitation.
 * Inputs: None.
 * Side effects: Executes the read-only `git ls-files` command.
 * Returns: Sorted array of repository-relative tracked paths.
 */
function trackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * Function contract: isExcluded
 * Purpose: Determine whether a tracked path belongs to generated, vendored, workflow, or temporary territory excluded from authored function documentation.
 * Inputs: `file`, repository-relative path.
 * Side effects: None.
 * Returns: Boolean indicating whether the path is excluded.
 */
function isExcluded(file) {
  if (TEMPORARY_PATHS.has(file) || POLICY.excludedFiles.includes(file)) return true;
  return POLICY.excludedPrefixes.some(/** Callback contract: Test whether the current exclusion prefix owns the tracked path. Inputs: `prefix`. Side effects: none. Returns: boolean predicate result. */ (prefix) => file.startsWith(prefix));
}

/**
 * Function contract: isAuthored
 * Purpose: Determine whether a tracked path falls under an authored-code root governed by the repository documentation contract.
 * Inputs: `file`, repository-relative path.
 * Side effects: None.
 * Returns: Boolean indicating whether the file should be sanitized.
 */
function isAuthored(file) {
  if (isExcluded(file)) return false;
  return POLICY.codeRoots.some(/** Callback contract: Test whether the path equals or descends from the current authored-code root. Inputs: `root`. Side effects: none. Returns: boolean predicate result. */ (root) => file === root || file.startsWith(`${root}/`));
}

/**
 * Function contract: scriptKindFor
 * Purpose: Select the TypeScript compiler parser mode matching the source extension.
 * Inputs: `file`, repository-relative JS/JSX/TS/TSX path.
 * Side effects: None.
 * Returns: TypeScript `ScriptKind` value.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

/**
 * Function contract: isFunctionLike
 * Purpose: Identify executable function-like syntax requiring a documentation contract.
 * Inputs: `node`, TypeScript AST node.
 * Side effects: None.
 * Returns: Boolean for declarations, expressions, arrows, methods, constructors, getters, and setters.
 */
function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node);
}

/**
 * Function contract: functionIdentity
 * Purpose: Classify one function as named/assigned or inline and select the syntax owner whose leading trivia should hold its contract.
 * Inputs: `node`, function-like AST node; `sourceFile`, parsed source file.
 * Side effects: None.
 * Returns: Object containing `name`, documentation `owner`, and `inline` classification.
 */
function functionIdentity(node, sourceFile) {
  if (node.name && node.name.getText) return { name: node.name.getText(sourceFile), owner: node, inline: false };
  if (ts.isConstructorDeclaration(node)) return { name: 'constructor', owner: node, inline: false };

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
 * Function contract: contractRangesFromTrivia
 * Purpose: Locate generated contract JSDoc blocks only inside the exact leading trivia owned by a function or callback.
 * Inputs: `source`, complete source text; `owner`, documentation owner AST node; `sourceFile`, parsed source file.
 * Side effects: None.
 * Returns: Absolute source ranges for contract comments that can be safely removed without touching strings, templates, regex literals, or unrelated comments.
 */
function contractRangesFromTrivia(source, owner, sourceFile) {
  const fullStart = owner.getFullStart();
  const start = owner.getStart(sourceFile);
  const trivia = source.slice(fullStart, start);
  const ranges = [];
  const pattern = /\/\*\*[\s\S]*?\*\//g;
  let match;

  while ((match = pattern.exec(trivia))) {
    if (!match[0].includes('Function contract:') && !match[0].includes('Callback contract:')) continue;
    ranges.push([fullStart + match.index, fullStart + match.index + match[0].length]);
  }
  return ranges;
}

/**
 * Function contract: stripAttachedContracts
 * Purpose: Remove every generated contract attached to a function/callback while preserving all other source text and comments.
 * Inputs: `file`, repository-relative source path; `source`, complete source text.
 * Side effects: Parses source with the TypeScript compiler API.
 * Returns: Source text with all attached function/callback contract blocks removed.
 */
function stripAttachedContracts(file, source) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKindFor(file));
  const ranges = [];

  /** Callback contract: Traverse syntax nodes and collect safe contract-comment removal ranges for every executable function owner. Inputs: `node`. Side effects: appends source ranges to the local collection. Returns: undefined; traversal is side-effect-only. */
  function visit(node) {
    if (isFunctionLike(node) && node.body) {
      const identity = functionIdentity(node, sourceFile);
      ranges.push(...contractRangesFromTrivia(source, identity.owner, sourceFile));
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  const unique = [...new Map(ranges.map(/** Callback contract: Key each removal range by its stable start/end pair so duplicate AST references cannot remove the same source twice. Inputs: `range`. Side effects: none. Returns: `[key, range]` entry consumed by `Map`. */ (range) => [`${range[0]}:${range[1]}`, range])).values()];
  unique.sort(/** Callback contract: Order removal ranges from highest to lowest source offset so earlier offsets remain stable during string surgery. Inputs: `a`, `b`. Side effects: none. Returns: numeric sort comparison. */ (a, b) => b[0] - a[0]);

  let output = source;
  for (const [start, end] of unique) output = output.slice(0, start) + output.slice(end);
  return output;
}

/**
 * Function contract: humanize
 * Purpose: Convert a code identifier or filename into readable words for generated documentation prose.
 * Inputs: `value`, identifier/path segment.
 * Side effects: None.
 * Returns: Normalized lowercase phrase.
 */
function humanize(value) {
  return String(value)
    .replace(/\.[^.]+$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Function contract: moduleSubject
 * Purpose: Describe the owning module in concise prose used by generated function purposes.
 * Inputs: `file`, repository-relative source path.
 * Side effects: None.
 * Returns: Human-readable module subject phrase.
 */
function moduleSubject(file) {
  const base = humanize(path.basename(file));
  if (file.startsWith('src/scripts/features/')) return `${base} browser feature`;
  if (file.startsWith('src/scripts/entrypoints/')) return `${base} runtime entrypoint`;
  if (file.startsWith('scripts/')) return `${base} repository tool`;
  if (file.startsWith('tests/')) return `${base} quality check`;
  if (file.startsWith('api/') || file.startsWith('functions/api/')) return `${base} API handler`;
  return `${base} module`;
}

/**
 * Function contract: splitFunctionName
 * Purpose: Split a camelCase/PascalCase function name into an action verb and readable object phrase.
 * Inputs: `name`, function identifier.
 * Side effects: None.
 * Returns: `{ verb, object }` used by semantic purpose generation.
 */
function splitFunctionName(name) {
  const words = humanize(name).split(' ').filter(Boolean);
  return { verb: words.shift() || '', object: words.join(' ') || 'module behavior' };
}

/**
 * Function contract: namedPurpose
 * Purpose: Generate an intent-focused purpose sentence for a named function using curated overrides, naming verbs, and module context.
 * Inputs: `name`, function identifier; `file`, containing repository path.
 * Side effects: None.
 * Returns: Concrete function-purpose sentence.
 */
function namedPurpose(name, file) {
  if (PURPOSE_OVERRIDES.has(name)) return PURPOSE_OVERRIDES.get(name);
  const { verb, object } = splitFunctionName(name);
  const subject = moduleSubject(file);

  if (['init', 'initialize', 'setup', 'mount'].includes(verb)) return `Initialize ${object} for the ${subject}, including the listeners/state needed for safe runtime use.`;
  if (['get', 'read', 'load', 'fetch', 'collect', 'list', 'select'].includes(verb)) return `Return ${object} from the supplied inputs or current ${subject} state.`;
  if (['find', 'locate', 'resolve'].includes(verb)) return `Resolve ${object} from the supplied inputs and current ${subject} context.`;
  if (['is', 'has', 'can', 'should'].includes(verb)) return `Determine whether ${object} satisfies the condition represented by this ${subject}.`;
  if (['set', 'sync', 'toggle'].includes(verb)) return `Synchronize ${object} with the requested state while preserving related ${subject} invariants.`;
  if (['apply', 'update', 'ensure', 'enforce', 'normalize', 'polish', 'finalize', 'configure', 'restore', 'repair'].includes(verb)) return `Apply ${object} consistently while preserving the surrounding ${subject} contract.`;
  if (['create', 'build', 'generate', 'compose', 'compile', 'make'].includes(verb)) return `Build ${object} from the supplied inputs in the form expected by downstream ${subject} consumers.`;
  if (['audit', 'validate', 'verify', 'check', 'test'].includes(verb)) return `Validate ${object} and surface actionable failures when the ${subject} contract is violated.`;
  if (['remove', 'delete', 'clean', 'strip'].includes(verb)) return `Remove ${object} without disturbing required surrounding ${subject} state.`;
  if (['parse', 'extract'].includes(verb)) return `Convert ${object} into the structured representation consumed by the ${subject}.`;
  if (['handle', 'on'].includes(verb)) return `Handle ${object} and coordinate the resulting ${subject} state changes.`;
  if (['run', 'execute'].includes(verb)) return `Execute ${object} in the required order and propagate failures through the ${subject} contract.`;
  return `Implement the ${humanize(name)} responsibility owned by the ${subject}.`;
}

/**
 * Function contract: inputSummary
 * Purpose: Describe parsed function parameters without pretending unknown domain semantics.
 * Inputs: `node`, function AST node; `sourceFile`, parsed source file.
 * Side effects: None.
 * Returns: Readable parameter list or explicit no-argument statement.
 */
function inputSummary(node, sourceFile) {
  if (!node.parameters || !node.parameters.length) return 'None; derives required state from its enclosing module/runtime context.';
  return node.parameters.map(/** Callback contract: Format one parsed parameter name for the generated Inputs field. Inputs: `parameter`. Side effects: none. Returns: formatted parameter label. */ (parameter) => `\`${parameter.name.getText(sourceFile)}\``).join(', ');
}

/**
 * Function contract: functionBodyText
 * Purpose: Return the exact body source for side-effect and return-contract inspection.
 * Inputs: `node`, function AST node; `source`, complete source text.
 * Side effects: None.
 * Returns: Function body source text or empty string.
 */
function functionBodyText(node, source) {
  return node.body ? source.slice(node.body.pos, node.body.end) : '';
}

/**
 * Function contract: sideEffectSummary
 * Purpose: Conservatively summarize externally observable side-effect categories visible in a function body.
 * Inputs: `text`, function body source.
 * Side effects: None; inspection only.
 * Returns: Semicolon-separated side-effect description.
 */
function sideEffectSummary(text) {
  const effects = [];
  if (/\bimport\s*\(/.test(text)) effects.push('dynamically imports code');
  if (/addEventListener|removeEventListener/.test(text)) effects.push('registers or removes browser listeners');
  if (/\b(document|window)\b|classList|setAttribute|removeAttribute|\.focus\s*\(|innerHTML|textContent|\.inert\b/.test(text)) effects.push('reads or updates DOM/browser state');
  if (/\bfs\.(?:write|append|mkdir|rename|unlink|copy|rm)|writeFile|mkdirSync|renameSync|unlinkSync|copyFile/.test(text)) effects.push('writes filesystem state');
  else if (/\bfs\.(?:read|stat|exists|readdir)|readFile|statSync|existsSync|readdirSync/.test(text)) effects.push('reads filesystem state');
  if (/spawnSync|spawn\s*\(|execSync|execFile/.test(text)) effects.push('spawns child processes');
  if (/\bfetch\s*\(|XMLHttpRequest/.test(text)) effects.push('performs network I/O');
  if (/console\.(?:log|warn|error)|process\.exit|process\.exitCode/.test(text)) effects.push('emits diagnostics or changes process failure state');
  return effects.length ? effects.join('; ') : 'No direct external side effect beyond invoked dependencies.';
}

/**
 * Function contract: ownReturns
 * Purpose: Collect return statements belonging to one block-bodied function while skipping nested functions.
 * Inputs: `node`, function AST node.
 * Side effects: None.
 * Returns: Array of return statement nodes owned by this function.
 */
function ownReturns(node) {
  const results = [];
  const rootBody = node.body;
  if (!rootBody || !ts.isBlock(rootBody)) return results;

  /** Callback contract: Traverse this function body, collecting owned return statements while refusing to descend into nested functions. Inputs: `current`. Side effects: appends return nodes to local collection. Returns: undefined; traversal is side-effect-only. */
  function visit(current) {
    if (current !== rootBody && isFunctionLike(current)) return;
    if (ts.isReturnStatement(current)) results.push(current);
    ts.forEachChild(current, visit);
  }
  visit(rootBody);
  return results;
}

/**
 * Function contract: isBooleanExpression
 * Purpose: Determine whether an expression AST has inherently boolean semantics without being confused by arrow tokens inside nested callbacks.
 * Inputs: `expression`, TypeScript expression node.
 * Side effects: None.
 * Returns: Boolean indicating predicate/logical/comparison syntax.
 */
function isBooleanExpression(expression) {
  if (ts.isPrefixUnaryExpression(expression) && expression.operator === ts.SyntaxKind.ExclamationToken) return true;
  if (!ts.isBinaryExpression(expression)) return false;
  const booleanOperators = new Set([
    ts.SyntaxKind.EqualsEqualsToken,
    ts.SyntaxKind.EqualsEqualsEqualsToken,
    ts.SyntaxKind.ExclamationEqualsToken,
    ts.SyntaxKind.ExclamationEqualsEqualsToken,
    ts.SyntaxKind.LessThanToken,
    ts.SyntaxKind.LessThanEqualsToken,
    ts.SyntaxKind.GreaterThanToken,
    ts.SyntaxKind.GreaterThanEqualsToken,
    ts.SyntaxKind.AmpersandAmpersandToken,
    ts.SyntaxKind.BarBarToken,
  ]);
  return booleanOperators.has(expression.operatorToken.kind);
}

/**
 * Function contract: returnSummary
 * Purpose: Describe a function's return contract from AST syntax, including expression-bodied arrows and async behavior.
 * Inputs: `node`, function AST node; `name`, named-function identifier or empty string for callbacks; `sourceFile`, parsed source file; `callbackMethod`, enclosing collection/promise/event method when known.
 * Side effects: None.
 * Returns: Human-readable return-contract sentence.
 */
function returnSummary(node, name, sourceFile, callbackMethod = '') {
  const asyncFunction = node.modifiers && node.modifiers.some(/** Callback contract: Test whether the current modifier marks this function as async. Inputs: `modifier`. Side effects: none. Returns: boolean predicate result. */ (modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);

  if (callbackMethod === 'filter' || callbackMethod === 'some' || callbackMethod === 'every' || callbackMethod === 'find') return 'Boolean predicate result consumed by the enclosing collection lookup/filter.';
  if (callbackMethod === 'forEach' || callbackMethod === 'addEventListener' || callbackMethod === 'requestAnimationFrame') return 'Undefined; this callback is side-effect-only.';

  if (ts.isArrowFunction(node) && !ts.isBlock(node.body)) {
    const expression = node.body;
    if (asyncFunction) return 'Promise resolving to the expression result.';
    if (ts.isCallExpression(expression) && expression.expression.kind === ts.SyntaxKind.ImportKeyword) return 'Promise for the lazily loaded module.';
    if (ts.isCallExpression(expression) && ts.isPropertyAccessExpression(expression.expression) && expression.expression.name.text === 'then') return 'Transformed Promise/result from the preceding asynchronous value.';
    if (ts.isPropertyAccessExpression(expression)) return `The selected \`${expression.name.text}\` value.`;
    if (isBooleanExpression(expression)) return 'Boolean predicate result.';
    return 'Computed expression result consumed by the enclosing operation.';
  }

  const returns = ownReturns(node);
  const valued = returns.filter(/** Callback contract: Keep only owned return statements that return an explicit value. Inputs: `statement`. Side effects: none. Returns: boolean predicate result. */ (statement) => Boolean(statement.expression));
  if (asyncFunction) return valued.length ? 'Promise resolving to the computed function result.' : 'Promise resolving after the documented asynchronous side effects complete.';
  if (!valued.length) return 'Undefined; the function exists for the documented side effects, validation, or orchestration.';

  const { verb, object } = splitFunctionName(name || '');
  if (['is', 'has', 'can', 'should'].includes(verb)) return `Boolean indicating whether ${object} satisfies the documented condition.`;
  if (['get', 'read', 'load', 'fetch', 'find', 'locate', 'resolve', 'collect', 'list', 'select'].includes(verb)) return `The requested ${object}; explicit early-return branches define empty/fallback behavior.`;
  return 'Computed result consumed by the caller; explicit early-return branches define fallback behavior.';
}

/**
 * Function contract: callbackMethod
 * Purpose: Identify the enclosing call method for an inline callback so purpose and return documentation can reflect event, collection, promise, or animation semantics.
 * Inputs: `node`, inline callback AST node; `sourceFile`, parsed source file.
 * Side effects: None.
 * Returns: Method/call name such as `filter`, `then`, `addEventListener`, `requestAnimationFrame`, or empty string.
 */
function callbackMethod(node, sourceFile) {
  const parent = node.parent;
  if (!parent || !ts.isCallExpression(parent)) return '';
  const expression = parent.expression;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
  return expression.getText(sourceFile);
}

/**
 * Function contract: callbackPurpose
 * Purpose: Generate a context-aware purpose sentence for an inline callback from its enclosing API and body semantics.
 * Inputs: `node`, callback AST node; `sourceFile`, parsed source file; `source`, complete source text; `file`, containing path.
 * Side effects: None.
 * Returns: Semantic callback-purpose sentence.
 */
function callbackPurpose(node, sourceFile, source, file) {
  const method = callbackMethod(node, sourceFile);
  const text = functionBodyText(node, source);
  const importMatch = text.match(/import\(\s*['"]([^'"]+)['"]\s*\)/);
  if (importMatch) {
    const feature = humanize(path.posix.basename(importMatch[1]));
    const exportMatch = text.match(/\.then\s*\([^=]*=>\s*[^.]+\.([A-Za-z_$][\w$]*)/);
    return `Lazy-load the ${feature} module${exportMatch ? ` and resolve its \`${exportMatch[1]}\` initializer` : ''}.`;
  }

  const parent = node.parent;
  if (parent && ts.isCallExpression(parent)) {
    const expression = parent.expression;
    if (method === 'addEventListener') {
      const eventName = parent.arguments[0] && ts.isStringLiteralLike(parent.arguments[0]) ? parent.arguments[0].text : 'browser';
      if (/setMenuState/.test(text) && eventName === 'click') return 'Handle the click by preventing conflicting default behavior and toggling the mobile-menu state.';
      if (/trapFocus|Escape|event\.key/.test(text) && /key/.test(eventName)) return `Handle ${eventName} input for Escape/Tab behavior and keyboard focus containment.`;
      const target = ts.isPropertyAccessExpression(expression) ? expression.expression.getText(sourceFile) : 'the event target';
      return `Handle the ${eventName} event for \`${target}\` and apply the related local state update.`;
    }
    if (method === 'requestAnimationFrame') {
      if (/\.focus\s*\(/.test(text)) return 'Wait one animation frame for visibility/layout changes before moving keyboard focus.';
      return 'Defer the enclosed DOM update until the next animation frame so browser state settles in a predictable order.';
    }
    if (method === 'then') {
      if (ts.isArrowFunction(node) && !ts.isBlock(node.body) && ts.isPropertyAccessExpression(node.body)) return `Select the \`${node.body.name.text}\` export/value from the resolved promise value.`;
      return 'Transform the resolved promise value into the result required by the next asynchronous step.';
    }
    if (method === 'catch') return 'Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy.';
    if (method === 'filter') {
      if (/getComputedStyle|getBoundingClientRect|visibility|display/.test(text)) return 'Keep only elements that are rendered, visible, and eligible for the enclosing focus/layout operation.';
      return 'Decide whether the current item remains in the filtered result consumed by the enclosing operation.';
    }
    if (method === 'map') return 'Transform the current item into the representation consumed by the enclosing collection operation.';
    if (method === 'forEach') {
      if (/\.inert|wasInert/.test(text)) return 'Apply or restore inert state for the current background element while preserving its previous value.';
      return 'Apply the enclosing side-effect operation to the current collection item.';
    }
    if (method === 'find') return 'Identify whether the current item matches the lookup condition for the enclosing search.';
    if (method === 'some') return 'Evaluate whether the current item satisfies the enclosing existential condition.';
    if (method === 'every') return 'Evaluate whether the current item satisfies the enclosing all-items condition.';
    if (method === 'sort') return 'Compare two items and return their deterministic ordering for the enclosing sort.';
    if (method === 'reduce') return 'Fold the current item into the accumulator used by the enclosing reduction.';
    if (method === 'onReady') return `Start the ${moduleSubject(file)} after DOM readiness so required elements exist before initialization.`;
  }
  return `Perform the local callback step required by the immediately enclosing ${moduleSubject(file)} operation.`;
}

/**
 * Function contract: namedComment
 * Purpose: Build one detailed named-function contract containing the required purpose, input, side-effect, and return fields.
 * Inputs: `node`, function AST node; `name`, function identifier; `sourceFile`, parsed source file; `source`, complete text; `file`, containing path; `indent`, owner indentation.
 * Side effects: None.
 * Returns: Formatted JSDoc contract followed by owner indentation.
 */
function namedComment(node, name, sourceFile, source, file, indent) {
  const lines = [
    '/**',
    ` * Function contract: ${name}`,
    ` * Purpose: ${namedPurpose(name, file)}`,
    ` * Inputs: ${inputSummary(node, sourceFile)}`,
    ` * Side effects: ${sideEffectSummary(functionBodyText(node, source))}`,
    ` * Returns: ${returnSummary(node, name, sourceFile)}`,
    ' */',
    '',
  ];
  return lines.map(/** Callback contract: Prefix subsequent JSDoc lines with the function owner's existing indentation. Inputs: `line`, `index`. Side effects: none. Returns: indented documentation line. */ (line, index) => index === 0 ? line : `${indent}${line}`).join('\n');
}

/**
 * Function contract: callbackComment
 * Purpose: Build one concise inline callback contract whose purpose and return behavior reflect the enclosing API.
 * Inputs: `node`, callback AST node; `sourceFile`, parsed source file; `source`, complete text; `file`, containing path.
 * Side effects: None.
 * Returns: Single-line JSDoc callback contract.
 */
function callbackComment(node, sourceFile, source, file) {
  const method = callbackMethod(node, sourceFile);
  return `/** Callback contract: ${callbackPurpose(node, sourceFile, source, file)} Inputs: ${inputSummary(node, sourceFile)} Side effects: ${sideEffectSummary(functionBodyText(node, source))} Returns: ${returnSummary(node, '', sourceFile, method)} */ `;
}

/**
 * Function contract: rebuildContracts
 * Purpose: Parse one cleaned source file and insert exactly one current detailed contract for every named function and inline callback.
 * Inputs: `file`, repository-relative path; `source`, source text with attached generated contracts removed.
 * Side effects: Parses source with the TypeScript compiler API.
 * Returns: Source text with one contract inserted at every function's natural documentation owner.
 */
function rebuildContracts(file, source) {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKindFor(file));
  const insertions = [];
  const seen = new Set();

  /** Callback contract: Traverse parsed syntax and collect one documentation insertion for each executable function owner. Inputs: `node`. Side effects: appends insertion records to the local collection. Returns: undefined; traversal is side-effect-only. */
  function visit(node) {
    if (isFunctionLike(node) && node.body) {
      const identity = functionIdentity(node, sourceFile);
      const position = identity.owner.getStart(sourceFile);
      const key = `${position}:${identity.name}:${identity.inline}`;
      if (!seen.has(key)) {
        seen.add(key);
        const lineStart = source.lastIndexOf('\n', position - 1) + 1;
        const indent = source.slice(lineStart, position).match(/^\s*/)?.[0] || '';
        insertions.push({
          position,
          text: identity.inline
            ? callbackComment(node, sourceFile, source, file)
            : namedComment(node, identity.name, sourceFile, source, file, indent),
        });
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  insertions.sort(/** Callback contract: Order documentation insertions from highest to lowest source offset so earlier positions remain stable during string insertion. Inputs: `a`, `b`. Side effects: none. Returns: numeric sort comparison. */ (a, b) => b.position - a.position);
  let output = source;
  for (const insertion of insertions) output = output.slice(0, insertion.position) + insertion.text + output.slice(insertion.position);
  return output;
}

/**
 * Function contract: main
 * Purpose: Sanitize every tracked authored JS/TS source file to exactly one function/callback contract before the permanent audit validates the result.
 * Inputs: None.
 * Side effects: Rewrites documentation comments in authored JS/TS files and prints deterministic change counts.
 * Returns: Undefined.
 */
function main() {
  let processed = 0;
  let changed = 0;

  for (const file of trackedFiles()) {
    const extension = path.extname(file).toLowerCase();
    if (!FUNCTION_EXTENSIONS.has(extension) || !isAuthored(file)) continue;
    const absolute = path.join(ROOT, file);
    if (!fs.existsSync(absolute) || fs.statSync(absolute).size > 2 * 1024 * 1024) continue;

    const source = fs.readFileSync(absolute, 'utf8');
    const cleaned = stripAttachedContracts(file, source);
    const rebuilt = rebuildContracts(file, cleaned);
    processed += 1;
    if (rebuilt !== source) {
      fs.writeFileSync(absolute, rebuilt, 'utf8');
      changed += 1;
    }
  }

  console.log(`[function-contracts] Sanitized ${processed} authored JS/TS files; ${changed} file(s) changed.`);
}

main();
