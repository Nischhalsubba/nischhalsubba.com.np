/**
 * @fileoverview scripts/enforce-production-routes.cjs
 * Purpose: Apply the enforce production routes production transformation or maintenance step while preserving canonical source/build contracts.
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
/**
 * Function contract: parseRedirects
 * Purpose: Convert redirects into the structured representation consumed by the enforce production routes repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
