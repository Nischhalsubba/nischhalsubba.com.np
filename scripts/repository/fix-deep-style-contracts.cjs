const fs = require('node:fs');
const path = require('node:path');

/**
 * @fileoverview Temporary migration helper for path-sensitive stylesheet/runtime consumers.
 * Purpose: Update build scripts that construct source paths from path segments, which literal move rewriting cannot reliably detect.
 * Responsibilities:
 * - Point agent redesign and polish stages at responsibility-named CSS fragments.
 * - Point agent redesign runtime reads at the organized portfolio feature domain.
 * - Point the single-stylesheet compiler at `src/styles/systems/`.
 * - Make CSS architecture validation recursive so nested systems remain governed.
 * - Update lint's combined portfolio-fragment structural check for responsibility names.
 * Execution context: Node.js inside the one-shot deep-organization GitHub Actions workflow before source files move.
 * Connected files:
 * - scripts/agent-redesign.cjs
 * - scripts/agent-redesign-part-1.cjsfrag
 * - scripts/agent-polish.cjs
 * - scripts/compile-single-stylesheet.cjs
 * - scripts/audit-css-architecture.cjs
 * - scripts/lint-project.cjs
 * Maintenance: Temporary migration helper; removed before the migration commit.
 */

const ROOT = path.resolve(__dirname, '../..');

/**
 * Function contract: replaceRequired
 * Purpose: Applies a deterministic exact replacement and refuses to continue when the expected pre-migration contract is absent.
 * Inputs: repository path, exact old text, exact replacement text, and a human-readable replacement label.
 * Side effects: rewrites one tracked text file in place.
 * Returns: no explicit value; throws when the expected source pattern cannot be found.
 */
function replaceRequired(file, before, after, label) {
  const absolute = path.join(ROOT, file);
  let source = fs.readFileSync(absolute, 'utf8');
  if (!source.includes(before)) {
    throw new Error(`[deep-organize] ${label}: expected pattern not found in ${file}`);
  }
  source = source.replace(before, after);
  fs.writeFileSync(absolute, source, 'utf8');
  console.log(`[deep-organize] Patched ${label} in ${file}.`);
}

/**
 * Function contract: patchAgentRedesignWrapper
 * Purpose: Updates direct runtime and compatibility-style paths used after the evaluated redesign source executes.
 * Inputs: none; targets the known agent-redesign wrapper.
 * Side effects: rewrites two path declarations in `scripts/agent-redesign.cjs`.
 * Returns: no explicit value.
 */
function patchAgentRedesignWrapper() {
  replaceRequired(
    'scripts/agent-redesign.cjs',
    "const agentRuntimePath = path.join(dist, 'src', 'scripts', 'features', 'agent-portfolio.js');",
    "const agentRuntimePath = path.join(dist, 'src', 'scripts', 'features', 'portfolio', 'agent-portfolio.js');",
    'agent redesign runtime path',
  );
  replaceRequired(
    'scripts/agent-redesign.cjs',
    "const compatStylePath = path.join(repositoryRoot, 'src', 'styles', 'agent-compat.cssfrag');",
    "const compatStylePath = path.join(repositoryRoot, 'src', 'styles', 'fragments', 'agent', 'compatibility.cssfrag');",
    'agent redesign compatibility stylesheet path',
  );
}

/**
 * Function contract: patchAgentRedesignSourceFragment
 * Purpose: Replaces sequence-generated fragment/runtime paths inside the evaluated redesign source with explicit responsibility-based paths.
 * Inputs: none; targets part 1 of the evaluated redesign source.
 * Side effects: rewrites CSS source and runtime-source declarations in `scripts/agent-redesign-part-1.cjsfrag`.
 * Returns: no explicit value.
 */
function patchAgentRedesignSourceFragment() {
  replaceRequired(
    'scripts/agent-redesign-part-1.cjsfrag',
    "const styleSources = [1, 2, 3].map((part) => path.join(root, 'src', 'styles', `agent-portfolio-${part}.cssfrag`));",
    "const styleSources = [\n  path.join(root, 'src', 'styles', 'fragments', 'agent', 'portfolio-foundation.cssfrag'),\n  path.join(root, 'src', 'styles', 'fragments', 'agent', 'portfolio-components.cssfrag'),\n  path.join(root, 'src', 'styles', 'fragments', 'agent', 'portfolio-finishing.cssfrag'),\n];",
    'agent redesign portfolio fragment paths',
  );
  replaceRequired(
    'scripts/agent-redesign-part-1.cjsfrag',
    "const runtimeSource = path.join(root, 'src', 'scripts', 'features', 'agent-portfolio.js');",
    "const runtimeSource = path.join(root, 'src', 'scripts', 'features', 'portfolio', 'agent-portfolio.js');",
    'agent redesign source runtime path',
  );
}

/**
 * Function contract: patchAgentPolish
 * Purpose: Points the agent polish stage at the renamed responsibility-based fragment files.
 * Inputs: none; targets the known styleSources block.
 * Side effects: rewrites `scripts/agent-polish.cjs`.
 * Returns: no explicit value.
 */
function patchAgentPolish() {
  replaceRequired(
    'scripts/agent-polish.cjs',
    "const styleSources = [\n  path.join(root, 'src', 'styles', 'agent-polish.cssfrag'),\n  path.join(root, 'src', 'styles', 'agent-responsive-hardening.cssfrag'),\n  path.join(root, 'src', 'styles', 'agent-sticky-cascade-lock.cssfrag'),\n];",
    "const styleSources = [\n  path.join(root, 'src', 'styles', 'fragments', 'agent', 'polish.cssfrag'),\n  path.join(root, 'src', 'styles', 'fragments', 'agent', 'responsive-hardening.cssfrag'),\n  path.join(root, 'src', 'styles', 'fragments', 'agent', 'sticky-cascade-lock.cssfrag'),\n];",
    'agent polish fragment paths',
  );
}

/**
 * Function contract: patchStylesheetCompiler
 * Purpose: Points the production stylesheet compiler at nested reusable CSS systems.
 * Inputs: none; targets the compiler's fragment list.
 * Side effects: rewrites `scripts/compile-single-stylesheet.cjs`.
 * Returns: no explicit value.
 */
function patchStylesheetCompiler() {
  replaceRequired(
    'scripts/compile-single-stylesheet.cjs',
    "const fragmentFiles = [\n  path.join(root, 'src', 'styles', 'inner-page-system.css'),\n  path.join(root, 'src', 'styles', 'case-study-system.css'),\n];",
    "const fragmentFiles = [\n  path.join(root, 'src', 'styles', 'systems', 'inner-pages.css'),\n  path.join(root, 'src', 'styles', 'systems', 'case-study.css'),\n];",
    'single stylesheet system paths',
  );
}

/**
 * Function contract: patchCssArchitectureAudit
 * Purpose: Makes the CSS architecture audit recurse through organized style folders while keeping the canonical global stylesheet exemption exact.
 * Inputs: none; targets the existing flat-directory audit implementation.
 * Side effects: rewrites `scripts/audit-css-architecture.cjs`.
 * Returns: no explicit value.
 */
function patchCssArchitectureAudit() {
  const file = 'scripts/audit-css-architecture.cjs';
  const absolute = path.join(ROOT, file);
  let source = fs.readFileSync(absolute, 'utf8');
  const start = source.indexOf("const root = path.resolve(__dirname, '..');");
  const end = source.indexOf('if (issues.length) {');
  if (start < 0 || end < 0 || end <= start) {
    throw new Error('[deep-organize] CSS architecture audit: could not locate replaceable implementation block');
  }

  const replacement = `const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'src', 'styles');
const compatibilityRelativePath = 'systems/inner-pages.css';
const globalStylesheetRelativePath = 'style.css';
const issues = [];

/**
 * Function contract: walkCssFiles
 * Purpose: Recursively discovers authored CSS files under the organized style source tree.
 * Inputs: directory path and mutable output collection.
 * Side effects: reads directory metadata; appends discovered CSS paths to the provided collection.
 * Returns: the output collection containing absolute CSS file paths.
 */
function walkCssFiles(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walkCssFiles(full, output);
    else if (entry.isFile() && entry.name.endsWith('.css')) output.push(full);
  }
  return output;
}

/**
 * Function contract: relativeStylePath
 * Purpose: Normalizes an absolute style path into a stable repository-style relative path for policy comparisons and diagnostics.
 * Inputs: absolute CSS file path.
 * Side effects: no external side effects.
 * Returns: forward-slash path relative to src/styles.
 */
function relativeStylePath(file) {
  return path.relative(dir, file).split(path.sep).join('/');
}

/**
 * Function contract: readCommitted
 * Purpose: Reads committed compatibility CSS when available so generated working-tree mutations do not distort architecture checks.
 * Inputs: repository-relative path and fallback absolute path.
 * Side effects: executes git show; may read the fallback file from disk.
 * Returns: committed/fallback CSS text.
 */
function readCommitted(relativePath, fallbackPath) {
  const result = spawnSync('git', ['show', 'HEAD:' + relativePath], {
    cwd: root,
    encoding: 'utf8',
  });
  if (result.status === 0 && result.stdout) return result.stdout;
  return fs.readFileSync(fallbackPath, 'utf8');
}

/**
 * Function contract: withoutComments
 * Purpose: Removes CSS block comments before selector/declaration policy checks.
 * Inputs: complete CSS source text.
 * Side effects: no external side effects.
 * Returns: CSS text without block comments.
 */
function withoutComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

const files = walkCssFiles(dir).sort();
for (const filePath of files) {
  const relativePath = relativeStylePath(filePath);
  const css = relativePath === compatibilityRelativePath
    ? readCommitted('src/styles/' + relativePath, filePath)
    : fs.readFileSync(filePath, 'utf8');
  const declarations = withoutComments(css);
  const importantCount = (declarations.match(/!\s*important\b/gi) || []).length;
  const isGlobalStylesheet = relativePath === globalStylesheetRelativePath;

  if (!isGlobalStylesheet && importantCount) {
    issues.push(relativePath + ': ' + importantCount + ' importance declaration(s) are forbidden');
  }
  if (/@import\s+(?:url\()?['"]?https?:/i.test(declarations)) issues.push(relativePath + ': remote CSS imports are forbidden');
  if (/url\(['"]?data:/i.test(declarations)) issues.push(relativePath + ': inline data URLs are forbidden');

  if (!isGlobalStylesheet && relativePath !== compatibilityRelativePath && /(^|[}\n])\s*(?:html|body|\*)\s*(?:[,>{.:#\[])/m.test(declarations)) {
    issues.push(relativePath + ': global document selectors are forbidden in modular CSS');
  }
}

const relativeFiles = files.map(relativeStylePath);
if (!relativeFiles.includes(globalStylesheetRelativePath)) issues.push(globalStylesheetRelativePath + ': canonical global stylesheet is missing');
if (!relativeFiles.includes(compatibilityRelativePath)) issues.push(compatibilityRelativePath + ': compatibility stylesheet is missing');
if (!files.length) issues.push('No CSS source files found');

`;

  source = source.slice(0, start) + replacement + source.slice(end);
  source = source.replace('${files.length} source stylesheet(s) passed;', '${files.length} recursively discovered source stylesheet(s) passed;');
  fs.writeFileSync(absolute, source, 'utf8');
  console.log('[deep-organize] Patched recursive CSS architecture audit.');
}

/**
 * Function contract: patchLintPortfolioFragments
 * Purpose: Keeps the combined-fragment brace check after sequence-numbered portfolio fragments receive responsibility names.
 * Inputs: none; targets the fragment-selection expression in the project linter.
 * Side effects: rewrites `scripts/lint-project.cjs`.
 * Returns: no explicit value.
 */
function patchLintPortfolioFragments() {
  replaceRequired(
    'scripts/lint-project.cjs',
    "const agentFragments = cssFiles\n  .filter((file) => /^agent-portfolio-\\d+\\.cssfrag$/i.test(path.basename(file)))\n  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));",
    "const portfolioFragmentOrder = [\n  'portfolio-foundation.cssfrag',\n  'portfolio-components.cssfrag',\n  'portfolio-finishing.cssfrag',\n];\nconst agentFragments = portfolioFragmentOrder\n  .map((name) => cssFiles.find((file) => path.basename(file) === name))\n  .filter(Boolean);",
    'portfolio fragment lint ordering',
  );
}

/**
 * Function contract: main
 * Purpose: Applies every path-sensitive style/runtime compatibility patch before the generic migration moves and documents source files.
 * Inputs: none.
 * Side effects: rewrites known build/audit/lint source files in the current checkout.
 * Returns: no explicit value; throws immediately if a known pre-migration contract has drifted.
 */
function main() {
  patchAgentRedesignWrapper();
  patchAgentRedesignSourceFragment();
  patchAgentPolish();
  patchStylesheetCompiler();
  patchCssArchitectureAudit();
  patchLintPortfolioFragments();
  console.log('[deep-organize] Path-sensitive style/runtime contracts updated.');
}

main();
