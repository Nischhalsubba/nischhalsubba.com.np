/**
 * @fileoverview scripts/enforce-production-routes.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for enforce production routes.
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
const errors = [];

for (const file of manifest.legacy) {
  const target = path.join(dist, file);
  if (fs.existsSync(target)) fs.rmSync(target, { force: true });
}

for (const file of manifest.html) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing canonical source: ${file}`);
  if (!fs.existsSync(path.join(dist, file))) errors.push(`Missing production route: ${file}`);
}

for (const file of manifest.legacy) {
  if (fs.existsSync(path.join(dist, file))) errors.push(`Legacy route survived build: ${file}`);
}

for (const name of ['audit-remediations.css', 'stable-layout.css', 'final-ui-fixes.css', 'layout-integrity.css']) {
  if (fs.existsSync(path.join(dist, name))) errors.push(`Retired stylesheet survived build: ${name}`);
}

/**
 * Function contract: parseRedirects
 * Purpose: Parses parse redirects into the structured form consumed by downstream logic.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function parseRedirects(file) {
  if (!fs.existsSync(file)) return new Map();
  const entries = new Map();
  for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to] = line.split(/\s+/);
    if (from && to) entries.set(from, to);
  }
  return entries;
}

const redirectFile = path.join(root, 'public', '_redirects');
const redirects = parseRedirects(redirectFile);
for (const [from, to] of Object.entries(manifest.redirects)) {
  if (redirects.get(from) !== to) {
    errors.push(`${path.relative(root, redirectFile)}: ${from} must redirect to ${to}`);
  }
}

if (fs.existsSync(path.join(root, '_redirects'))) {
  errors.push('Root _redirects must not exist; public/_redirects is the canonical redirect source.');
}

if (errors.length) {
  console.error('Production route audit failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`Production route audit passed for ${manifest.html.length} canonical routes and ${Object.keys(manifest.redirects).length} legacy redirects.`);
