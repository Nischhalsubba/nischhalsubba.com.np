const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const encodedPosterPath = path.join(root, 'assets', 'images', 'signal-demo-poster.webp.b64');
const posterPath = path.join(base, 'assets', 'images', 'signal-demo-poster.webp');

if (!fs.existsSync(homePath)) throw new Error(`[signal-portrait-v13] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-portrait-v13] Missing ${stylePath}`);
if (!fs.existsSync(encodedPosterPath)) throw new Error(`[signal-portrait-v13] Missing exact demo poster source ${encodedPosterPath}`);

const encodedPoster = fs.readFileSync(encodedPosterPath, 'utf8').replace(/\s+/g, '');
const posterBytes = Buffer.from(encodedPoster, 'base64');
if (posterBytes.length < 60000) throw new Error(`[signal-portrait-v13] Decoded demo poster is suspiciously small (${posterBytes.length} bytes).`);
if (posterBytes.subarray(0, 4).toString('ascii') !== 'RIFF' || posterBytes.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('[signal-portrait-v13] Exact demo poster did not decode to a valid WebP container.');
}
fs.mkdirSync(path.dirname(posterPath), { recursive: true });
fs.writeFileSync(posterPath, posterBytes);

let html = fs.readFileSync(homePath, 'utf8');
const portraitPattern = /(<img class="nrs-signal-portrait[^\"]*" src=")[^"]+("[^>]*>)/g;
const portraitMatches = html.match(portraitPattern) || [];
if (portraitMatches.length !== 2) {
  throw new Error(`[signal-portrait-v13] Expected 2 Signal portrait image elements, found ${portraitMatches.length}.`);
}

html = html.replace(portraitPattern, '$1/assets/images/signal-demo-poster.webp$2');
fs.writeFileSync(homePath, html, 'utf8');

const result = fs.readFileSync(homePath, 'utf8');
const finalized = result.match(/<img class="nrs-signal-portrait[^\"]*" src="\/assets\/images\/signal-demo-poster\.webp"[^>]*>/g) || [];
if (finalized.length !== 2) {
  throw new Error(`[signal-portrait-v13] Expected 2 finalized exact-demo poster references, found ${finalized.length}.`);
}

let style = fs.readFileSync(stylePath, 'utf8');
const oldContainment = /\/\* nrs-signal-portrait-v13-containment:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-containment:end \*\//g;
style = style.replace(oldContainment, '');

const start = '/* nrs-signal-portrait-v13-stage-inset:start */';
const end = '/* nrs-signal-portrait-v13-stage-inset:end */';
const marker = /\/\* nrs-signal-portrait-v13-stage-inset:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-stage-inset:end \*\//g;
const inset = `${start}
.agent-portfolio .nrs-signal-figure + .agent-hero-foot {
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

@media (max-width: 899px) {
  .agent-portfolio .nrs-signal-figure {
    width: min(calc(100% - 32px), 29rem);
  }
}
${end}`;
style = marker.test(style) ? style.replace(marker, inset) : `${style}\n\n${inset}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

console.log(`[signal-portrait-v13] Exact uploaded demo poster decoded (${posterBytes.length} bytes) and wired into the final hero.`);
