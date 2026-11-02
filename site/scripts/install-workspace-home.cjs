/**
 * @fileoverview Install the approved November 2026 workspace homepage after historical transformations.
 * Purpose: Publish the self-contained homepage without altering retained case studies, blog or contact API.
 * Responsibilities: Keep the approved homepage, dependency paths and retained routes coherent.
 * Execution context: Node build command, after the legacy multi-page pipeline.
 * Connected files: src/workspace-home, package.json, scripts/audit-workspace-home.cjs.
 * Maintenance: This final installer supersedes earlier homepage composition stages. It is idempotent.
 */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src/workspace-home');
const dist = path.join(root, 'dist');
if (!fs.existsSync(path.join(dist, 'project-yarsha.html'))) throw new Error('Build retained routes before installing the homepage.');
fs.cpSync(source, path.join(dist, 'workspace-home'), { recursive: true });
fs.copyFileSync(path.join(source, 'index.html'), path.join(dist, 'index.html'));
// Keep historical home aliases on the approved homepage while preserving canonical route behavior.
for (const alias of ['home.html', 'home-v2.html']) {
  if (fs.existsSync(path.join(dist, alias))) fs.copyFileSync(path.join(source, 'index.html'), path.join(dist, alias));
}
console.log('[workspace-home] Installed approved homepage and local assets.');
