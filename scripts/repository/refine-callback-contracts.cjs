const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

/**
 * @fileoverview One-shot callback-documentation cleanup for the deep organization PR.
 * Purpose: Replace every generated inline callback contract with one syntax-aware, context-aware comment whose return description matches the actual callback form.
 * Responsibilities:
 * - Remove only real lexical comments containing `Callback contract:`; never touch comment-like text inside strings, templates, URLs, or regex literals.
 * - Reinsert exactly one semantic comment for each anonymous inline function/callback.
 * - Distinguish expression-bodied callbacks, async callbacks, event handlers, array predicates/transforms, animation frames, and lazy module loaders.
 * - Preserve named function contracts and all executable source text.
 * Execution context: Node.js in a temporary PR-only GitHub Actions workflow.
 * Connected files:
 * - config/repository/code-documentation-policy.json
 * - scripts/repository/audit-code-documentation.cjs
 * Maintenance: Temporary helper; removed before the cleanup commit is published.
 */

const ROOT = path.resolve(__dirname, '../..');
const POLICY = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/repository/code-documentation-policy.json'), 'utf8'));
const FUNCTION_EXTENSIONS = new Set(POLICY.functionExtensions);
const TEMPORARY_PATHS = new Set([
  'scripts/repository/refine-callback-contracts.cjs',
  '.github/workflows/refine-callback-contracts.yml',
]);

/**
 * Returns the final tracked repository paths used to select authored JavaScript/TypeScript files.
 *
 * Inputs: none.
 * Side effects: executes read-only `git ls-files`.
 * Returns: sorted repository-relative tracked paths.
 */
function trackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ls-files failed: ${result.stderr || result.stdout}`);
  return result.stdout.split('\0').filter(Boolean).sort();
}

/**
 * Determines whether a path is outside the authored code-documentation contract.
 *
 * Inputs: repository-relative path.
 * Side effects: none.
 * Returns: true for generated/vendor/workflow or temporary helper paths.
 */
function isExcluded(file) {
  if (TEMPORARY_PATHS.has(file) || POLICY.excludedFiles.includes(file)) return true;
  return POLICY.excludedPrefixes.some((prefix) => file.startsWith(prefix));
}

/**
 * Determines whether a tracked path belongs to an authored code root controlled by the policy.
 *
 * Inputs: repository-relative path.
 * Side effects: none.
 * Returns: true for eligible authored JS/TS files.
 */
function isAuthored(file) {
  if (isExcluded(file)) return false;
  return POLICY.codeRoots.some((root) => file === root || file.startsWith(`${root}/`));
}

/**
 * Chooses the TypeScript compiler parser mode for JavaScript, JSX, TypeScript, or TSX source.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: TypeScript ScriptKind.
 */
function scriptKindFor(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

/**
 * Chooses the lexical language variant so the scanner recognizes real comments without confusing JSX syntax.
 *
 * Inputs: repository-relative file path.
 * Side effects: none.
 * Returns: TypeScript LanguageVariant.
 */
function languageVariantFor(file) {
  return file.endsWith('.jsx') || file.endsWith('.tsx') ? ts.LanguageVariant.JSX : ts.LanguageVariant.Standard;
}

/**
 * Removes only actual multiline comment tokens containing `Callback contract:`.
 *
 * Inputs: file path and complete source text.
 * Side effects: lexes source with the TypeScript scanner.
 * Returns: source with prior generated callback contracts removed while preserving all executable tokens and other comments.
 */
function stripCallbackContracts(file, source) {
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, false, languageVariantFor(file), source);
  const ranges = [];

  while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken) {
    if (scanner.getToken() !== ts.SyntaxKind.MultiLineCommentTrivia) continue;
    const start = scanner.getTokenPos();
    const end = scanner.getTextPos();
    const comment = source.slice(start, end);
    if (!comment.includes('Callback contract:')) continue;

    let removeEnd = end;
    while (removeEnd < source.length && /[ \t]/.test(source[removeEnd])) removeEnd += 1;
    ranges.push([start, removeEnd]);
  }

  let output = source;
  for (const [start, end] of ranges.reverse()) {
    output = output.slice(0, start) + output.slice(end);
  }
  return output;
}

/**
 * Determines whether an AST node is a function-like syntax form.
 *
 * Inputs: TypeScript AST node.
 * Side effects: none.
 * Returns: true for functions, arrows, methods, constructors, getters, and setters.
 */
function isFunctionLike(node) {
  return ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node) || ts.isGetAccessorDeclaration(node) ||
    ts.isSetAccessorDeclaration(node);
}

/**
 * Determines whether a function-like node is anonymous inline behavior rather than a named/assigned function with its own detailed function contract.
 *
 * Inputs: function-like AST node.
 * Side effects: none.
 * Returns: true for inline callbacks/loaders/handlers requiring a compact callback contract.
 */
function isInlineCallback(node) {
  if (node.name) return false;
  if (ts.isConstructorDeclaration(node)) return false;
  const parent = node.parent;
  if (parent && ts.isVariableDeclaration(parent)) return false;
  if (parent && ts.isPropertyAssignment(parent)) return false;
  return true;
}

/**
 * Converts a path/identifier into readable lowercase words for callback descriptions.
 *
 * Inputs: path segment or identifier.
 * Side effects: none.
 * Returns: normalized human-readable phrase.
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
 * Returns the source text of one callback body for semantic inspection.
 *
 * Inputs: callback node and complete source text.
 * Side effects: none.
 * Returns: body source text.
 */
function bodyText(node, source) {
  return node.body ? source.slice(node.body.pos, node.body.end) : '';
}

/**
 * Conservatively summarizes side effects visible in a callback body.
 *
 * Inputs: callback body source text.
 * Side effects: none.
 * Returns: concise side-effect phrase without trailing punctuation.
 */
function sideEffects(text) {
  const effects = [];
  if (/\bimport\s*\(/.test(text)) effects.push('dynamically imports code');
  if (/addEventListener|removeEventListener/.test(text)) effects.push('registers or removes browser listeners');
  if (/\b(document|window)\b|classList|setAttribute|removeAttribute|\.focus\s*\(|innerHTML|textContent|\.inert\b/.test(text)) effects.push('reads or updates DOM/browser state');
  if (/\bfs\.(?:write|append|mkdir|rename|unlink|copy|rm)|writeFile|mkdirSync|renameSync|unlinkSync|copyFile/.test(text)) effects.push('writes filesystem state');
  else if (/\bfs\.(?:read|stat|exists|readdir)|readFile|statSync|existsSync|readdirSync/.test(text)) effects.push('reads filesystem state');
  if (/spawnSync|spawn\s*\(|execSync|execFile/.test(text)) effects.push('spawns child processes');
  if (/\bfetch\s*\(|XMLHttpRequest/.test(text)) effects.push('performs network I/O');
  if (/console\.(?:log|warn|error)|process\.exit|process\.exitCode/.test(text)) effects.push('emits diagnostics or changes process failure state');
  return effects.length ? effects.join('; ') : 'no direct external side effect beyond invoked dependencies';
}

/**
 * Produces a context-aware purpose sentence for an inline callback from its enclosing call and body.
 *
 * Inputs: callback node, parsed source file, source text, and containing file.
 * Side effects: none.
 * Returns: semantic purpose sentence.
 */
function callbackPurpose(node, sourceFile, source, file) {
  const parent = node.parent;
  const text = bodyText(node, source);
  const importMatch = text.match(/import\(\s*['"]([^'"]+)['"]\s*\)/);
  if (importMatch) {
    const feature = humanize(path.posix.basename(importMatch[1]));
    const exportMatch = text.match(/\.then\s*\([^=]*=>\s*[^.]+\.([A-Za-z_$][\w$]*)/);
    return `Lazy-load the ${feature} module${exportMatch ? ` and resolve its \`${exportMatch[1]}\` initializer` : ''}.`;
  }

  if (parent && ts.isCallExpression(parent)) {
    const expression = parent.expression;
    const callText = expression.getText(sourceFile);
    const method = ts.isPropertyAccessExpression(expression) ? expression.name.text : callText;

    if (method === 'addEventListener') {
      const eventName = parent.arguments[0] && ts.isStringLiteralLike(parent.arguments[0]) ? parent.arguments[0].text : 'browser';
      if (/setMenuState/.test(text) && eventName === 'click') return 'Handle the click by preventing conflicting default behavior and toggling the mobile-menu state.';
      if (/trapFocus|Escape|event\.key/.test(text) && /key/.test(eventName)) return `Handle ${eventName} input for Escape/Tab behavior and keyboard focus containment.`;
      const target = ts.isPropertyAccessExpression(expression) ? expression.expression.getText(sourceFile) : 'the target';
      return `Handle the ${eventName} event for \`${target}\` and apply the related local state update.`;
    }
    if (method === 'requestAnimationFrame') {
      if (/\.focus\s*\(/.test(text)) return 'Wait one animation frame for visibility/layout changes before moving keyboard focus.';
      return 'Defer the enclosed DOM update until the next animation frame so browser state settles in a predictable order.';
    }
    if (method === 'then') {
      const parameter = node.parameters[0] ? node.parameters[0].name.getText(sourceFile) : 'value';
      if (ts.isArrowFunction(node) && !ts.isBlock(node.body) && ts.isPropertyAccessExpression(node.body)) {
        return `Select the \`${node.body.name.text}\` export/value from the resolved \`${parameter}\`.`;
      }
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
    if (callText === 'onReady') return `Start the ${humanize(path.basename(file))} module after DOM readiness so required elements exist before initialization.`;
  }

  if (/event\.(?:preventDefault|stopPropagation)/.test(text)) return 'Handle the local browser event, prevent conflicting default/bubbling behavior, then apply the required state change.';
  return 'Perform the local callback step required by the immediately enclosing operation.';
}

/**
 * Builds the callback input field from actual parameter syntax.
 *
 * Inputs: callback node and parsed source file.
 * Side effects: none.
 * Returns: comma-separated parameter names or `none`.
 */
function inputSummary(node, sourceFile) {
  if (!node.parameters || !node.parameters.length) return 'none';
  return node.parameters.map((parameter) => `\`${parameter.name.getText(sourceFile)}\``).join(', ');
}

/**
 * Collects return statements owned by one callback while skipping nested functions.
 *
 * Inputs: callback node.
 * Side effects: none.
 * Returns: return statement nodes belonging to this callback only.
 */
function ownReturns(node) {
  const results = [];
  const rootBody = node.body;
  if (!rootBody || !ts.isBlock(rootBody)) return results;

  function visit(current) {
    if (current !== rootBody && isFunctionLike(current)) return;
    if (ts.isReturnStatement(current)) results.push(current);
    ts.forEachChild(current, visit);
  }
  visit(rootBody);
  return results;
}

/**
 * Describes the callback return value accurately for expression-bodied, async, predicate, and side-effect-only callbacks.
 *
 * Inputs: callback node and parsed source file.
 * Side effects: none.
 * Returns: concise return-contract phrase without trailing punctuation.
 */
function returnSummary(node, sourceFile) {
  const asyncCallback = node.modifiers && node.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);

  if (ts.isArrowFunction(node) && !ts.isBlock(node.body)) {
    const expression = node.body;
    const expressionText = expression.getText(sourceFile);
    if (asyncCallback) return 'Promise resolving to the expression result';
    if (ts.isPropertyAccessExpression(expression)) return `the selected \`${expression.name.text}\` value`;
    if (expression.kind === ts.SyntaxKind.NullKeyword) return '`null` as the local fallback value';
    if (expression.kind === ts.SyntaxKind.TrueKeyword || expression.kind === ts.SyntaxKind.FalseKeyword || /(?:===|!==|<=|>=|<|>|&&|\|\||^!)/.test(expressionText)) return 'boolean predicate result';
    if (ts.isCallExpression(expression) && /import\s*\(/.test(expressionText)) return 'Promise for the lazily loaded module/value';
    if (ts.isCallExpression(expression) && ts.isPropertyAccessExpression(expression.expression) && expression.expression.name.text === 'then') return 'transformed Promise/result from the preceding asynchronous value';
    return 'computed expression result consumed by the enclosing operation';
  }

  const returns = ownReturns(node);
  const valued = returns.filter((statement) => statement.expression);
  if (asyncCallback) {
    return valued.length ? 'Promise resolving to the callback result' : 'Promise resolving after the callback side effects complete';
  }
  if (!valued.length) return 'undefined; callback is side-effect-only';

  const texts = valued.map((statement) => statement.expression.getText(sourceFile));
  if (texts.every((text) => /^(?:true|false|!|.*(?:===|!==|<=|>=|<|>|&&|\|\|).*)/.test(text))) return 'boolean predicate/result';
  return 'computed value consumed by the enclosing operation';
}

/**
 * Builds one compact semantic callback contract suitable for local inline context.
 *
 * Inputs: callback node, parsed source file, source text, and containing file.
 * Side effects: none.
 * Returns: inline JSDoc comment text.
 */
function callbackComment(node, sourceFile, source, file) {
  return `/** Callback contract: ${callbackPurpose(node, sourceFile, source, file)} Inputs: ${inputSummary(node, sourceFile)}. Side effects: ${sideEffects(bodyText(node, source))}. Returns: ${returnSummary(node, sourceFile)}. */ `;
}

/**
 * Rebuilds inline callback contracts in one source file after removing all previous generated callback comments.
 *
 * Inputs: repository-relative file path and complete source text.
 * Side effects: parses source through the TypeScript compiler API.
 * Returns: source containing exactly one current callback contract per anonymous inline function.
 */
function rebuildCallbacks(file, source) {
  const clean = stripCallbackContracts(file, source);
  const sourceFile = ts.createSourceFile(file, clean, ts.ScriptTarget.Latest, true, scriptKindFor(file));
  const insertions = [];

  function visit(node) {
    if (isFunctionLike(node) && node.body && isInlineCallback(node)) {
      insertions.push({
        position: node.getStart(sourceFile),
        text: callbackComment(node, sourceFile, clean, file),
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  insertions.sort((a, b) => b.position - a.position);
  let output = clean;
  for (const insertion of insertions) {
    output = output.slice(0, insertion.position) + insertion.text + output.slice(insertion.position);
  }
  return output;
}

/**
 * Runs callback cleanup across every authored JS/TS file and reports deterministic change counts.
 *
 * Inputs: none.
 * Side effects: rewrites authored JS/TS source comments only.
 * Returns: nothing; throws on unreadable source so partial cleanup cannot be published.
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
    const refined = rebuildCallbacks(file, source);
    processed += 1;
    if (source !== refined) {
      fs.writeFileSync(absolute, refined, 'utf8');
      changed += 1;
    }
  }

  console.log(`[callback-docs] Rebuilt inline callback contracts across ${processed} authored JS/TS files; ${changed} file(s) changed.`);
}

main();
