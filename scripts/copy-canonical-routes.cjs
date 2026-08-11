/**
 * @fileoverview scripts/copy-canonical-routes.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for copy canonical routes.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
