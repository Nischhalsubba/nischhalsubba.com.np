/**
 * @fileoverview scripts/ensure-agent-mobile-theme-control.cjs
 * Purpose: Apply the ensure agent mobile theme control production transformation or maintenance step while preserving canonical source/build contracts.
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

if (!fs.existsSync(dist)) {
  throw new Error('[agent-mobile-theme] dist is missing');
}

const files = [];
(
/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure agent mobile theme control repository tool.
 * Inputs: `directory`
 * Side effects: reads filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }
})(dist);

const control = '<button class="agent-mobile-theme-toggle" type="button" aria-label="Switch color theme"><span>Appearance</span><span aria-hidden="true">Light / dark</span></button>';
let updated = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('agent-portfolio') || !html.includes('mobile-nav-overlay')) continue;
  if (html.includes('agent-mobile-theme-toggle')) continue;

  const marker = '</nav></div><nav class="nav-wrapper"';
  if (!html.includes(marker)) continue;

  html = html.replace(marker, `</nav>${control}</div><nav class="nav-wrapper"`);
  fs.writeFileSync(file, html, 'utf8');
  updated += 1;
}

console.log(`[agent-mobile-theme] Added the drawer theme control to ${updated} route(s).`);
