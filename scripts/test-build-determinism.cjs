/**
 * @fileoverview scripts/test-build-determinism.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for test build determinism.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory, files.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, files);
    else files.push(absolute);
  }
  return files;
}

/**
 * Function contract: snapshot
 * Purpose: Implements the snapshot responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function snapshot() {
  if (!fs.existsSync(dist)) throw new Error('dist is missing; run the production build first.');
  const hashes = new Map();
  for (const file of walk(dist).sort()) {
    const relative = path.relative(dist, file).replaceAll(path.sep, '/');
    hashes.set(relative, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
  }
  return hashes;
}

/**
 * Function contract: compare
 * Purpose: Implements the compare responsibility for this module.
 * Inputs: before, after.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function compare(before, after) {
  const paths = new Set([...before.keys(), ...after.keys()]);
  return [...paths].filter(/** Callback contract: Processes the callback step for [...paths] without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (file) => before.get(file) !== after.get(file)).sort();
}

const first = snapshot();
const result = spawnSync('npm', ['run', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

const second = snapshot();
const changed = compare(first, second);
if (changed.length) {
  console.error('[determinism] Repeated builds changed generated output:');
  for (const file of changed) console.error(`- ${file}`);
  process.exit(1);
}

console.log(`[determinism] ${second.size} generated files are byte-stable across repeated builds.`);
