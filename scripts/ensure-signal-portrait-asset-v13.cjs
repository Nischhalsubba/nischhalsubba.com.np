const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const distMode = process.argv.includes('--dist');
const base = distMode ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const posterPartsDir = path.join(root, 'assets', 'images', 'signal-demo-poster-v4.parts');
const posterPath = path.join(base, 'assets', 'images', 'signal-demo-poster.webp');
const EXPECTED_POSTER_BYTES = 65112;
const EXPECTED_POSTER_SHA256 = '0ad9e8d745adb38217dd9c148860e27ef8d118531fd31d96362ce0987513bae6';
const EXPECTED_PARTS = [
  ['part-00.b64part', 20000, '869a076d3b463d2823fca6d0073cfa2eeaf8ba61aacfb26ea9c51de739074d96'],
  ['part-01a.b64part', 5000, 'cc254ea7188655a80fb7bec8ee5306bddb4a81e5c95bec5b1965703059c97cea'],
  ['part-01b.b64part', 5000, '176038e88f3f2ea45bf8237c6d4ee2a8d9104f223af8fb55c4db1140f33ab279'],
  ['part-01c.b64part', 5000, 'dd21a44ff88e972eadaf954f7d6af38febd5b14e2a00d8b8d96cf6ea9cc2cf0e'],
  ['part-01d.b64part', 5000, 'ccf74dc825122fe9d1384ce5d541a6df9e30ab6d0a565b15afb0b7190e641d58'],
  ['part-02.b64part', 20000, '0867cb199892652ad88595dbda25495b676098aa171263dea2726d85ed5538ac'],
  ['part-03a.b64part', 5000, '0bbbf59bfc74bb919de9e9573c38f440d98cacf3f4cf689e02f3b82eb1731463'],
  ['part-03b.b64part', 5000, 'cc7331f1330dc36cef196c2c516d3d72492b9542f1540bc493e9a27732775d7e'],
  ['part-03c.b64part', 5000, '86b4085bf87a3f104508f484f0dfde87c264463497d1da916a9a0bc9cc229861'],
  ['part-03d.b64part', 5000, '4322b74815e268bdc3d24e16a14f6a6ef950cbde173c413eee259dcc3c40f60b'],
  ['part-04a.b64part', 5000, 'cdb80dc1ae132b463a9c0472680cc4288f2819e0ee1e4b1bc800b66a73e24848'],
  ['part-04b.b64part', 1816, '03750b04c44530bddc52e676252573c1f2aeae8209d2be4d8883e4f1c04c7a7b'],
];

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

if (!fs.existsSync(homePath)) throw new Error(`[signal-portrait-v13] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-portrait-v13] Missing ${stylePath}`);
if (!fs.existsSync(posterPartsDir)) throw new Error(`[signal-portrait-v13] Missing exact demo poster parts ${posterPartsDir}`);

const discoveredParts = fs.readdirSync(posterPartsDir)
  .filter((name) => name.endsWith('.b64part'))
  .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const expectedNames = EXPECTED_PARTS.map(([name]) => name).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
if (JSON.stringify(discoveredParts) !== JSON.stringify(expectedNames)) {
  throw new Error(`[signal-portrait-v13] Exact poster segment set mismatch. Expected ${expectedNames.join(', ')}, found ${discoveredParts.join(', ')}.`);
}

const encodedParts = EXPECTED_PARTS.map(([name, expectedChars, expectedHash]) => {
  const normalized = fs.readFileSync(path.join(posterPartsDir, name), 'utf8').replace(/\s+/g, '');
  if (normalized.length !== expectedChars) {
    throw new Error(`[signal-portrait-v13] ${name} character count mismatch. Expected ${expectedChars}, found ${normalized.length}.`);
  }
  const actualHash = sha256(normalized);
  if (actualHash !== expectedHash) {
    throw new Error(`[signal-portrait-v13] ${name} checksum mismatch. Expected ${expectedHash}, found ${actualHash}.`);
  }
  return normalized;
});

const encodedPoster = encodedParts.join('');
const posterBytes = Buffer.from(encodedPoster, 'base64');
if (posterBytes.length !== EXPECTED_POSTER_BYTES) {
  throw new Error(`[signal-portrait-v13] Exact demo poster byte count mismatch. Expected ${EXPECTED_POSTER_BYTES}, found ${posterBytes.length}.`);
}
const posterHash = sha256(posterBytes);
if (posterHash !== EXPECTED_POSTER_SHA256) {
  throw new Error(`[signal-portrait-v13] Exact demo poster checksum mismatch. Expected ${EXPECTED_POSTER_SHA256}, found ${posterHash}.`);
}
if (posterBytes.subarray(0, 4).toString('ascii') !== 'RIFF' || posterBytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('[signal-portrait-v13] Reassembled exact demo poster is not a valid WebP container.');
}
fs.mkdirSync(path.dirname(posterPath), { recursive: true });
fs.writeFileSync(posterPath, posterBytes);

if (distMode) {
  for (const transientPath of [
    path.join(base, 'assets', 'images', 'signal-demo-poster-v2.parts'),
    path.join(base, 'assets', 'images', 'signal-demo-poster-v3.parts'),
    path.join(base, 'assets', 'images', 'signal-demo-poster-v4.parts'),
    path.join(base, 'assets', 'images', 'signal-demo-poster.parts'),
    path.join(base, 'assets', 'images', 'signal-demo-poster.webp.b64'),
  ]) {
    if (fs.existsSync(transientPath)) fs.rmSync(transientPath, { recursive: true, force: true });
  }
}

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

console.log(`[signal-portrait-v13] Exact demo poster verified: ${posterBytes.length} bytes, SHA-256 ${posterHash}; final hero and legend wired.`);
