const fs = require('node:fs');
const path = require('node:path');

/**
 * @fileoverview Temporary migration helper for path-sensitive stylesheet/runtime consumers.
 * Purpose: Update build scripts that construct source paths from path segments, which literal move rewriting cannot reliably detect.
 * Responsibilities:
 * - Point agent redesign and polish stages at responsibility-named CSS fragments.
 * - Point agent redesign runtime reads at the organized portfolio feature domain.
 * - Point the single-stylesheet compiler at `src/styles/systems/`.
 * - Update lint's combined portfolio-fragment structural check for responsibility names.
 * Execution context: Node.js inside the one-shot deep-organization GitHub Actions workflow before source files move.
 * Connected files:
 * - scripts/agent-redesign.cjs
 * - scripts/agent-redesign-part-1.cjsfrag
 * - scripts/agent-polish.cjs
 * - scripts/compile-single-stylesheet.cjs
 * - scripts/lint-project.cjs
 * Maintenance: Temporary migration helper; removed before the migration commit. The recursive CSS architecture audit is maintained as normal reviewed source, not generated here.
 */

const ROOT = path.resolve(__dirname, '../..');

/**
 * Function contract: replaceRequired
 * Purpose: Apply one deterministic exact replacement and fail immediately when the expected pre-migration contract has drifted.
 * Inputs: repository path, exact old text, exact replacement text, and a human-readable label.
 * Side effects: Rewrites one tracked text file in place.
 * Returns: No explicit value; throws when the expected source pattern is absent.
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
 * Purpose: Update direct runtime and compatibility-style paths used after the evaluated redesign source executes.
 * Inputs: None; targets the known agent-redesign wrapper.
 * Side effects: Rewrites two path declarations in `scripts/agent-redesign.cjs`.
 * Returns: No explicit value.
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
 * Purpose: Replace sequence-generated fragment/runtime paths inside the evaluated redesign source with explicit responsibility-based paths.
 * Inputs: None; targets part 1 of the evaluated redesign source.
 * Side effects: Rewrites CSS and runtime source declarations in `scripts/agent-redesign-part-1.cjsfrag`.
 * Returns: No explicit value.
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
 * Purpose: Point the agent polish stage at the renamed responsibility-based fragment files.
 * Inputs: None; targets the known `styleSources` block.
 * Side effects: Rewrites `scripts/agent-polish.cjs`.
 * Returns: No explicit value.
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
 * Purpose: Point the production stylesheet compiler at nested reusable CSS systems.
 * Inputs: None; targets the compiler's fragment list.
 * Side effects: Rewrites `scripts/compile-single-stylesheet.cjs`.
 * Returns: No explicit value.
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
 * Function contract: patchLintPortfolioFragments
 * Purpose: Keep the combined-fragment structural check after sequence-numbered portfolio fragments receive responsibility names.
 * Inputs: None; targets the fragment-selection expression in the project linter.
 * Side effects: Rewrites `scripts/lint-project.cjs`.
 * Returns: No explicit value.
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
 * Purpose: Apply every remaining path-sensitive style/runtime compatibility patch before the generic migration moves and documents source files.
 * Inputs: None.
 * Side effects: Rewrites known build/lint source files in the current checkout.
 * Returns: No explicit value; throws immediately if a known pre-migration contract has drifted.
 */
function main() {
  patchAgentRedesignWrapper();
  patchAgentRedesignSourceFragment();
  patchAgentPolish();
  patchStylesheetCompiler();
  patchLintPortfolioFragments();
  console.log('[deep-organize] Path-sensitive style/runtime contracts updated.');
}

main();
