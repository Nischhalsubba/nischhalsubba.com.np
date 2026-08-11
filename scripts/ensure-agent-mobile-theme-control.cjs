/**
 * @fileoverview scripts/ensure-agent-mobile-theme-control.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure agent mobile theme control.
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

if (!fs.existsSync(dist)) {
  throw new Error('[agent-mobile-theme] dist is missing');
}

const files = [];
(/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
