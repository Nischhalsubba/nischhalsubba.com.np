/**
 * @fileoverview scripts/clean-vite-public-output.cjs
 * Purpose: Apply the clean vite public output production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/repository/generate-file-catalog.cjs
 * - src/compat/README.md
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
