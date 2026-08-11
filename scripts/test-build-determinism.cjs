/**
 * @fileoverview scripts/test-build-determinism.cjs
 * Purpose: Validate test build determinism and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the test build determinism repository tool.
 * Inputs: `directory`: input consumed by this operation; `files`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Implement the snapshot responsibility owned by the test build determinism repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Implement the compare responsibility owned by the test build determinism repository tool.
 * Inputs: `before`: input consumed by this operation; `after`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function compare(before, after) {
  const paths = new Set([...before.keys(), ...after.keys()]);
  return [...paths].filter(/** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (file) => before.get(file) !== after.get(file)).sort();
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
