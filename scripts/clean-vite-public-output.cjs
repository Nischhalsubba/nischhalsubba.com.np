/**
 * @fileoverview scripts/clean-vite-public-output.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for clean vite public output.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - scripts/build-dist.cjs
 * - scripts/repository/generate-file-catalog.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));

const remove = [
  ...manifest.legacy,
  'audit-remediations.css',
  'stable-layout.css',
  'final-ui-fixes.css',
  'layout-integrity.css',
  'detail-navigation.js',
  'seo-enhancements.js',
];

for (const relative of remove) {
  const target = path.join(dist, relative);
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

console.log('Removed retired public pages and patch assets from dist.');
