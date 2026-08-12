/**
 * @fileoverview scripts/run-build-stages.cjs
 * Purpose: Execute named build stages consistently with readable diagnostics and fail-fast process handling.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const { spawnSync } = require('node:child_process');


/**
 * Function contract: runStages
 * Purpose: Execute the ordered build stages sequentially with readable diagnostics and fail immediately when a stage exits unsuccessfully.
 * Inputs: `stages`, `scope`
 * Side effects: spawns child processes; emits diagnostics or changes process failure state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
