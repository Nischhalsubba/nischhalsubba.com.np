/**
 * @fileoverview scripts/preflight-build-scripts.cjs
 * Purpose: Generate or assemble preflight build scripts deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * - scripts/build-dist.cjs
 * - scripts/ensure-signal-demo-hero-v15.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname);
const extensions = new Set(['.cjs', '.js', '.mjs']);
const files = [];

/**
 * Function contract: collect
 * Purpose: Return module behavior from the supplied inputs or current preflight build scripts repository tool state.
 * Inputs: `directory`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else if (extensions.has(path.extname(entry.name))) files.push(fullPath);
  }
}

collect(root);
files.sort();

const failures = [];
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures.push({
      file: path.relative(path.resolve(root, '..'), file),
      output: `${result.stdout || ''}${result.stderr || ''}`.trim(),
    });
  }
}

if (failures.length) {
  console.error('[preflight] Build-script syntax validation failed:');
  for (const failure of failures) {
    console.error(`\n- ${failure.file}`);
    console.error(failure.output);
  }
  process.exit(1);
}

console.log(`[preflight] Syntax checked ${files.length} build script(s).`);
