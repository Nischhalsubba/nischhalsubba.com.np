/**
 * @fileoverview scripts/copy-canonical-routes.cjs
 * Purpose: Generate or assemble copy canonical routes deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));

if (!fs.existsSync(dist)) throw new Error('dist directory is missing. Run Vite first.');

for (const relative of manifest.html) {
  const source = path.join(root, relative);
  const target = path.join(dist, relative);
  if (!fs.existsSync(source)) throw new Error(`Canonical route source is missing: ${relative}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

console.log(`Copied ${manifest.html.length} canonical HTML routes into dist.`);
