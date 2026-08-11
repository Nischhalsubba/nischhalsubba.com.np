/**
 * @fileoverview scripts/enforce-services-template.cjs
 * Purpose: Apply the enforce services template production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
  const next = classes.filter(/** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (name) => !retired.has(name));
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
