/**
 * @fileoverview scripts/sanitize-source-css.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for sanitize source css.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/generate-source.cjs
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
