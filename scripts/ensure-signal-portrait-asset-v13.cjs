const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const portraitPath = path.join(base, 'assets', 'images', 'signal-portrait.svg');

if (!fs.existsSync(homePath)) throw new Error(`[signal-portrait-v13] Missing ${homePath}`);
if (!fs.existsSync(portraitPath)) throw new Error(`[signal-portrait-v13] Missing approved portrait asset ${portraitPath}`);

let html = fs.readFileSync(homePath, 'utf8');
const pattern = /(<img class="nrs-signal-portrait[^\"]*" src=")\/assets\/images\/portrait\.png("[^>]*>)/g;
const matches = html.match(pattern) || [];

if (matches.length !== 2) {
  throw new Error(`[signal-portrait-v13] Expected 2 Signal portrait image references, found ${matches.length}.`);
}

html = html.replace(pattern, '$1/assets/images/signal-portrait.svg$2');
fs.writeFileSync(homePath, html, 'utf8');

const result = fs.readFileSync(homePath, 'utf8');
if ((result.match(/\/assets\/images\/signal-portrait\.svg/g) || []).length !== 2) {
  throw new Error('[signal-portrait-v13] Approved portrait references were not finalized.');
}
if (result.includes('nrs-signal-portrait') && result.includes('/assets/images/portrait.png')) {
  throw new Error('[signal-portrait-v13] Stale Signal portrait.png reference remains.');
}

console.log('[signal-portrait-v13] Approved portrait asset wired into final homepage output.');
