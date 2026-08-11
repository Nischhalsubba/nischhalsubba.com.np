/**
 * @fileoverview scripts/preflight-build-scripts.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for preflight build scripts.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * - scripts/ensure-signal-demo-hero-v15.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname);
const extensions = new Set(['.cjs', '.js', '.mjs']);
const files = [];

/**
 * Function contract: collect
 * Purpose: Implements the collect responsibility for this module.
 * Inputs: directory.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
