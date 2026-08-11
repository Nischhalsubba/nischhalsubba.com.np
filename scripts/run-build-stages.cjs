/**
 * @fileoverview scripts/run-build-stages.cjs
 * Purpose: Runs named build/generation stages with consistent logging, error handling, and process execution.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - scripts/repository/apply-deep-organization.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const { spawnSync } = require('node:child_process');

/**
 * Function contract: runStages
 * Purpose: Implements the run stages responsibility for this module.
 * Inputs: stages, scope.
 * Side effects: may emit diagnostics or inspect process state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function runStages(stages, scope) {
  for (const [label, [command, ...args]] of stages) {
    console.log(`\n[${scope}] ${label}`);
    const result = spawnSync(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (result.error) {
      console.error(`[${scope}] Could not start ${label}:`, result.error.message);
      process.exit(1);
    }
    if (result.status !== 0) {
      console.error(`[${scope}] ${label} failed with exit code ${result.status}.`);
      process.exit(result.status || 1);
    }
  }
}

module.exports = { runStages };
