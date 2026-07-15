const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function walk(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, files);
    else files.push(absolute);
  }
  return files;
}

function snapshot() {
  if (!fs.existsSync(dist)) throw new Error('dist is missing; run the production build first.');
  const hashes = new Map();
  for (const file of walk(dist).sort()) {
    const relative = path.relative(dist, file).replaceAll(path.sep, '/');
    hashes.set(relative, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
  }
  return hashes;
}

function compare(before, after) {
  const paths = new Set([...before.keys(), ...after.keys()]);
  return [...paths].filter((file) => before.get(file) !== after.get(file)).sort();
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
