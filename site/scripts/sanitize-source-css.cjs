/**
 * @fileoverview scripts/sanitize-source-css.cjs
 * Purpose: Apply the sanitize source css production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const stylePath = path.join(process.cwd(), 'style.css');
const malformedFontFragment = /^\s*\d+(?:;\d+)+&display=swap'\);\s*\r?\n?/m;

if (!fs.existsSync(stylePath)) {
  console.error('[css] style.css was not found.');
  process.exit(1);
}

const source = fs.readFileSync(stylePath, 'utf8');
const cleaned = source.replace(malformedFontFragment, '');

if (cleaned !== source) {
  fs.writeFileSync(stylePath, cleaned, 'utf8');
  console.log('[css] Removed malformed font import fragment from style.css.');
} else {
  console.log('[css] Source stylesheet is already clean.');
}

if (malformedFontFragment.test(cleaned)) {
  console.error('[css] Malformed font import fragment is still present.');
  process.exit(1);
}
