/**
 * @fileoverview scripts/ensure-mobile-theme-control.cjs
 * Purpose: Ensure redesigned mobile navigation drawers expose the same light/dark appearance control as the rest of the site.
 * Responsibilities:
 * - Walk generated HTML routes in `dist/`.
 * - Add the drawer theme control only to pages using the redesigned portfolio shell.
 * - Keep the transformation idempotent by skipping pages that already contain the control.
 * Execution context: Node.js production build stage run after portfolio markup exists in `dist/`.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/ensure-mobile-drawer-final.cjs
 * - src/scripts/features/system/agent-browser-contract.js
 * - src/styles/fragments/agent/sticky-cascade-lock.cssfrag
 * Maintenance: The current DOM class names are shared compatibility selectors used by later styling and browser checks. Rename those selectors only as a coordinated migration across every consumer.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  throw new Error('[mobile-theme] dist is missing');
}

const files = [];
(
/**
 * Function contract: walk
 * Purpose: Recursively collect generated HTML files beneath the production output directory.
 * Inputs: `directory` - Directory currently being scanned.
 * Side effects: Reads directory entries and appends discovered HTML paths to the shared `files` array.
 * Returns: Nothing.
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

console.log(`[mobile-theme] Added the drawer theme control to ${updated} route(s).`);
