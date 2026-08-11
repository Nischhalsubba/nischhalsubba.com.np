/**
 * @fileoverview scripts/enforce-services-template.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for enforce services template.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const file = path.join(targetRoot, 'services.html');

if (!fs.existsSync(file)) throw new Error('Services page is missing.');

let html = fs.readFileSync(file, 'utf8');
const bodyStart = html.indexOf('<body');
const bodyEnd = html.indexOf('>', bodyStart);
if (bodyStart >= 0 && bodyEnd > bodyStart) {
  const tag = html.slice(bodyStart, bodyEnd + 1);
  const match = tag.match(/class="([^"]*)"/);
  const classes = match ? match[1].split(/\s+/).filter(Boolean) : [];
  const retired = new Set(['nrs-service-page', 'nrs-services-redesign', 'nrs-services-index-page', 'nrs-services-page']);
  const next = classes.filter(/** Callback contract: Processes the callback step for classes without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (name) => !retired.has(name));
  for (const name of ['nrs-inner-page', 'nrs-services-v49-page']) if (!next.includes(name)) next.push(name);
  const replacement = match ? tag.replace(match[0], `class="${next.join(' ')}"`) : tag.replace('<body', `<body class="${next.join(' ')}"`);
  html = html.slice(0, bodyStart) + replacement + html.slice(bodyEnd + 1);
}

fs.writeFileSync(file, html, 'utf8');

const errors = [];
for (const marker of ['nrs-services-v49', 'nrs-services-v49-hero', 'nrs-service-index-list', 'nrs-services-v49-process']) {
  if (!html.includes(marker)) errors.push(`Missing marker: ${marker}`);
}
for (const marker of ['nrs-service-card', 'nrs-services-grid', 'nrs-services-redesign', 'nrs-services-index-page', 'nrs-wayfinding']) {
  if (html.includes(marker)) errors.push(`Retired marker remains: ${marker}`);
}
const h1Count = html.split('<h1').length - 1;
if (h1Count !== 1) errors.push(`Expected one H1, found ${h1Count}`);

if (errors.length) {
  console.error('Services template audit failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log('Canonical Services template verified.');
