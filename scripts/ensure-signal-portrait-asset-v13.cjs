const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const portraitPath = path.join(base, 'assets', 'images', 'signal-approved.webp');

if (!fs.existsSync(homePath)) throw new Error(`[signal-portrait-v13] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-portrait-v13] Missing ${stylePath}`);
if (!fs.existsSync(portraitPath)) throw new Error(`[signal-portrait-v13] Missing approved portrait asset ${portraitPath}`);

let html = fs.readFileSync(homePath, 'utf8');
const pattern = /(<img class="nrs-signal-portrait[^\"]*" src=")\/assets\/images\/portrait\.png("[^>]*>)/g;
const matches = html.match(pattern) || [];

if (matches.length !== 2) {
  throw new Error(`[signal-portrait-v13] Expected 2 Signal portrait image references, found ${matches.length}.`);
}

html = html.replace(pattern, '$1/assets/images/signal-approved.webp$2');
fs.writeFileSync(homePath, html, 'utf8');

const result = fs.readFileSync(homePath, 'utf8');
const finalized = result.match(/<img class="nrs-signal-portrait[^\"]*" src="\/assets\/images\/signal-approved\.webp"[^>]*>/g) || [];
const stale = result.match(/<img class="nrs-signal-portrait[^\"]*" src="\/assets\/images\/portrait\.png"[^>]*>/g) || [];

if (finalized.length !== 2) {
  throw new Error(`[signal-portrait-v13] Expected 2 finalized Signal portrait references, found ${finalized.length}.`);
}
if (stale.length) {
  throw new Error(`[signal-portrait-v13] ${stale.length} stale Signal portrait.png reference(s) remain.`);
}

let style = fs.readFileSync(stylePath, 'utf8');
const oldContainment = /\/\* nrs-signal-portrait-v13-containment:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-containment:end \*\//g;
style = style.replace(oldContainment, '');

const start = '/* nrs-signal-portrait-v13-stage-inset:start */';
const end = '/* nrs-signal-portrait-v13-stage-inset:end */';
const marker = /\/\* nrs-signal-portrait-v13-stage-inset:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-stage-inset:end \*\//g;
const inset = `${start}
@media (max-width: 899px) {
  .agent-portfolio .nrs-signal-figure {
    width: min(calc(100% - 32px), 29rem);
  }
}
${end}`;
style = marker.test(style) ? style.replace(marker, inset) : `${style}\n\n${inset}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

console.log('[signal-portrait-v13] Exact approved Signal portrait asset wired without altering its crop.');
