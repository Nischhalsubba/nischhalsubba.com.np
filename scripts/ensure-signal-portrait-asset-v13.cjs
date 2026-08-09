const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const distMode = process.argv.includes('--dist');
const base = distMode ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const posterPartsDir = path.join(root, 'assets', 'images', 'signal-demo-poster.parts');
const copiedPartsDir = path.join(base, 'assets', 'images', 'signal-demo-poster.parts');
const posterPath = path.join(base, 'assets', 'images', 'signal-demo-poster.webp');

if (!fs.existsSync(homePath)) throw new Error(`[signal-portrait-v13] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-portrait-v13] Missing ${stylePath}`);
if (!fs.existsSync(posterPartsDir)) throw new Error(`[signal-portrait-v13] Missing exact demo poster parts ${posterPartsDir}`);

const partFiles = fs.readdirSync(posterPartsDir)
  .filter((name) => /^part-\d+\.b64part$/.test(name))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
if (partFiles.length < 2) throw new Error(`[signal-portrait-v13] Expected multiple demo poster chunks, found ${partFiles.length}.`);
const encodedPoster = partFiles
  .map((name) => fs.readFileSync(path.join(posterPartsDir, name), 'utf8'))
  .join('')
  .replace(/\s+/g, '');
const posterBytes = Buffer.from(encodedPoster, 'base64');
if (posterBytes.length < 60000) throw new Error(`[signal-portrait-v13] Reassembled demo poster is suspiciously small (${posterBytes.length} bytes from ${partFiles.length} chunks).`);
if (posterBytes.subarray(0, 4).toString('ascii') !== 'RIFF' || posterBytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('[signal-portrait-v13] Reassembled exact demo poster is not a valid WebP container.');
}
fs.mkdirSync(path.dirname(posterPath), { recursive: true });
fs.writeFileSync(posterPath, posterBytes);
if (distMode && fs.existsSync(copiedPartsDir)) fs.rmSync(copiedPartsDir, { recursive: true, force: true });
const legacyEncoded = path.join(base, 'assets', 'images', 'signal-demo-poster.webp.b64');
if (distMode && fs.existsSync(legacyEncoded)) fs.rmSync(legacyEncoded);

let html = fs.readFileSync(homePath, 'utf8');
const portraitPattern = /(<img class="nrs-signal-portrait[^\"]*" src=")[^"]+("[^>]*>)/g;
const portraitMatches = html.match(portraitPattern) || [];
if (portraitMatches.length !== 2) {
  throw new Error(`[signal-portrait-v13] Expected 2 Signal portrait image elements, found ${portraitMatches.length}.`);
}
html = html.replace(portraitPattern, '$1/assets/images/signal-demo-poster.webp$2');

if (!html.includes('data-signal-legend')) {
  const meta = `<div class="nrs-signal-legend" data-signal-legend aria-label="Signal over Noise visual legend">
    <div><b>orange nodes</b><span>product states</span></div>
    <div><b>white node</b><span>signal / user truth</span></div>
    <div><b>orbit</b><span>feedback + decision loop</span></div>
    <div><b>ghost portrait</b><span>reasoning beneath execution</span></div>
  </div>
  <p class="nrs-signal-hint">Move the pointer for subtle depth. Hover or tap a product-state node. Tap the white signal point to reveal the hidden thesis.</p>`;
  const insertionPoint = /(<div class="nrs-signal-insight"[\s\S]*?<\/div>\s*<\/div>)(?=\s*<div class="agent-hero-foot">)/i;
  if (!insertionPoint.test(html)) {
    throw new Error('[signal-portrait-v13] Signal figure boundary was not found for the demo legend.');
  }
  html = html.replace(insertionPoint, `$1\n${meta}`);
}

fs.writeFileSync(homePath, html, 'utf8');

const result = fs.readFileSync(homePath, 'utf8');
const finalized = result.match(/<img class="nrs-signal-portrait[^\"]*" src="\/assets\/images\/signal-demo-poster\.webp"[^>]*>/g) || [];
if (finalized.length !== 2) {
  throw new Error(`[signal-portrait-v13] Expected 2 finalized exact-demo poster references, found ${finalized.length}.`);
}
for (const required of ['data-signal-legend', 'orange nodes', 'ghost portrait', 'signal / user truth']) {
  if (!result.includes(required)) throw new Error(`[signal-portrait-v13] Missing demo detail: ${required}`);
}

let style = fs.readFileSync(stylePath, 'utf8');
const oldContainment = /\/\* nrs-signal-portrait-v13-containment:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-containment:end \*\//g;
style = style.replace(oldContainment, '');

const start = '/* nrs-signal-portrait-v13-stage-inset:start */';
const end = '/* nrs-signal-portrait-v13-stage-inset:end */';
const marker = /\/\* nrs-signal-portrait-v13-stage-inset:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-stage-inset:end \*\//g;
const inset = `${start}
.agent-portfolio .nrs-signal-figure ~ .agent-hero-foot {
  display: none !important;
}

.agent-portfolio .nrs-signal-portrait--main {
  opacity: 1 !important;
  object-fit: fill !important;
  object-position: 50% 50% !important;
}

.agent-portfolio .nrs-signal-portrait--ghost {
  object-fit: fill !important;
  object-position: 50% 50% !important;
}

.agent-portfolio .nrs-signal-legend,
.agent-portfolio .nrs-signal-hint {
  width: 100%;
  max-width: 31rem;
  margin-inline-start: auto;
}

.agent-portfolio .nrs-signal-legend {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: .55rem;
  padding-top: .75rem;
  color: rgba(242,240,234,.56);
  font: 500 8px/1.35 var(--ap-font-mono);
  letter-spacing: .045em;
  text-transform: uppercase;
}

.agent-portfolio .nrs-signal-legend div {
  min-width: 0;
  padding-top: .45rem;
  border-top: 1px solid rgba(255,255,255,.11);
}

.agent-portfolio .nrs-signal-legend b,
.agent-portfolio .nrs-signal-legend span {
  display: block;
}

.agent-portfolio .nrs-signal-legend b {
  margin-bottom: .18rem;
  color: #ff8446;
  font-weight: 650;
}

.agent-portfolio .nrs-signal-hint {
  margin-top: .55rem;
  margin-bottom: 0;
  color: rgba(242,240,234,.42) !important;
  -webkit-text-fill-color: rgba(242,240,234,.42) !important;
  font: 500 8px/1.5 var(--ap-font-mono);
  letter-spacing: .03em;
}

@media (max-width: 899px) {
  .agent-portfolio .nrs-signal-figure,
  .agent-portfolio .nrs-signal-legend,
  .agent-portfolio .nrs-signal-hint {
    width: min(calc(100% - 32px), 29rem);
    max-width: 29rem;
    margin-inline: auto;
  }

  .agent-portfolio .nrs-signal-legend {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .agent-portfolio .nrs-signal-hint {
    font-size: 7px;
  }
}
${end}`;
style = marker.test(style) ? style.replace(marker, inset) : `${style}\n\n${inset}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

console.log(`[signal-portrait-v13] Exact uploaded demo poster reassembled (${posterBytes.length} bytes from ${partFiles.length} chunks), wired into the final hero, and paired with the demo legend.`);
