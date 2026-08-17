/**
 * @fileoverview scripts/ensure-hero-system-visual-v28.cjs
 * Purpose: Replace only the homepage hero's right-side visual with the approved portrait systems-map composition while preserving the existing hero copy, navigation, and calls to action.
 * Responsibilities:
 * - Verify the approved right-side reference artwork copied into the build output.
 * - Replace only the generated `.nrs-uploaded-visual` region after all earlier hero composition stages have completed.
 * - Remove retired hero-story inline runtimes that target DOM nodes no longer present.
 * - Append the final responsive visual-shell, particle-canvas, and cursor-orbit styles.
 * Execution context: Final production build stage after the existing hero and case-study refinements have run.
 * Connected files:
 * - scripts/build-dist.cjs
 * - src/scripts/features/motion/hero-system-field.js
 * - assets/images/hero-system-reference-v28.webp
 * Maintenance: Keep the artwork byte/hash contract synchronized with the tracked reference asset. Do not expand this stage into left-side hero copy or navigation ownership.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const artworkPath = path.join(base, 'assets', 'images', 'hero-system-reference-v28.webp');
const expectedBytes = 14572;
const expectedHash = 'b3945e2609330b27f1c9cb5115f6a1c506c243df8093c04f62ffcf9550a7309b';

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-system-v28] Missing generated index.html or style.css.');
}

/**
 * Function contract: verifyArtwork
 * Purpose: Verify that the approved WebP artwork copied into the selected build target matches the immutable reference byte contract.
 * Inputs: None.
 * Side effects: Reads the copied artwork file.
 * Returns: Undefined; throws when the reference asset is missing or does not match the approved bytes.
 */
function verifyArtwork() {
  if (!fs.existsSync(artworkPath)) {
    throw new Error('[hero-system-v28] Missing approved right-side artwork in the selected build target.');
  }
  const artwork = fs.readFileSync(artworkPath);
  const hash = crypto.createHash('sha256').update(artwork).digest('hex');
  if (artwork.length !== expectedBytes || hash !== expectedHash) {
    throw new Error(`[hero-system-v28] Artwork verification failed: ${artwork.length} bytes, ${hash}.`);
  }
  if (artwork.subarray(0, 4).toString('ascii') !== 'RIFF' || artwork.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error('[hero-system-v28] Verified artwork is not a WebP file.');
  }
}

/**
 * Function contract: findClosingDiv
 * Purpose: Find the closing `</div>` paired with a known opening `<div>` without relying on fragile nested-markup regular expressions.
 * Inputs: `html` - complete document; `startIndex` - index of the target opening `<div>`.
 * Side effects: None.
 * Returns: Exclusive character index immediately after the paired closing tag, or -1 when the DOM boundary cannot be resolved.
 */
function findClosingDiv(html, startIndex) {
  const tagPattern = /<\/?div\b[^>]*>/gi;
  tagPattern.lastIndex = startIndex;
  let depth = 0;
  let match = tagPattern.exec(html);
  while (match) {
    const closing = match[0].startsWith('</');
    depth += closing ? -1 : 1;
    if (depth === 0) return tagPattern.lastIndex;
    match = tagPattern.exec(html);
  }
  return -1;
}

verifyArtwork();

let html = fs.readFileSync(homePath, 'utf8');
let css = fs.readFileSync(stylePath, 'utf8');

html = html
  .replace(/<!-- nrs-hero-story-v\d+-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v\d+-runtime:end -->/g, '')
  .replace(/<!-- nrs-signal-demo-v\d+-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v\d+-runtime:end -->/g, '');

const visualStart = html.indexOf('<div class="nrs-uploaded-visual');
if (visualStart < 0) {
  throw new Error('[hero-system-v28] Final homepage right-side hero visual was not found.');
}
const visualEnd = findClosingDiv(html, visualStart);
if (visualEnd < 0) {
  throw new Error('[hero-system-v28] Final homepage right-side hero visual boundary could not be resolved.');
}

const visualMarkup = `<div class="nrs-uploaded-visual nrs-hero-system-v28" data-hero-system-field aria-label="Portrait of Nischhal Raj Subba with a product systems map showing systems thinking, rule model, state model and choice architecture">
      <img class="nrs-hero-system-v28__art" src="/assets/images/hero-system-reference-v28.webp" alt="" width="640" height="568" decoding="async" fetchpriority="high" aria-hidden="true">
      <canvas class="nrs-hero-system-v28__particles" data-hero-system-particles aria-hidden="true"></canvas>
      <span class="nrs-hero-system-v28__cursor" data-hero-system-cursor aria-hidden="true"></span>
    </div>`;

html = html.slice(0, visualStart) + visualMarkup + html.slice(visualEnd);
fs.writeFileSync(homePath, html, 'utf8');

const marker = /\/\* nrs-hero-system-v28:start \*\/[\s\S]*?\/\* nrs-hero-system-v28:end \*\//g;
const retiredStoryCss = /\/\* nrs-hero-story-v\d+:start \*\/[\s\S]*?\/\* nrs-hero-story-v\d+:end \*\//g;
const retiredHeroUxCss = /\/\* nrs-hero-ux-v26:start \*\/[\s\S]*?\/\* nrs-hero-ux-v26:end \*\//g;
css = css.replace(marker, '').replace(retiredStoryCss, '').replace(retiredHeroUxCss, '').trimEnd();

css += `

/* nrs-hero-system-v28:start */
.nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28{
  position:relative!important;
  width:min(100%,720px)!important;
  max-width:720px!important;
  aspect-ratio:640/568!important;
  justify-self:end!important;
  overflow:hidden!important;
  isolation:isolate!important;
  background:#050706!important;
  border:0!important;
  box-shadow:none!important;
  contain:layout paint;
  cursor:crosshair;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28::before,
.nrs-uploaded-hero-v19 .nrs-hero-system-v28::after{content:none!important;display:none!important}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__art{
  position:absolute!important;
  z-index:1!important;
  inset:0!important;
  display:block!important;
  width:100%!important;
  height:100%!important;
  max-width:none!important;
  object-fit:cover!important;
  object-position:center!important;
  transform:none!important;
  filter:none!important;
  opacity:1!important;
  user-select:none!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__particles{
  position:absolute!important;
  z-index:3!important;
  inset:0!important;
  display:block!important;
  width:100%!important;
  height:100%!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__cursor{
  position:absolute!important;
  z-index:4!important;
  left:0!important;
  top:0!important;
  width:44px!important;
  height:44px!important;
  margin:-22px 0 0 -22px!important;
  border:1px solid rgba(255,90,0,.72)!important;
  border-radius:50%!important;
  background:rgba(255,90,0,.018)!important;
  box-shadow:0 0 0 1px rgba(255,90,0,.08),0 0 22px rgba(255,90,0,.08)!important;
  opacity:0;
  transform:translate3d(-80px,-80px,0) scale(.58);
  transform-origin:50% 50%!important;
  will-change:transform,opacity;
  pointer-events:none!important;
}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-hero-system-v28{
  background:#050706!important;
  box-shadow:0 22px 56px rgba(17,17,15,.12)!important;
}
@media(max-width:960px){
  .nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28{
    width:min(100%,720px)!important;
    max-width:720px!important;
    justify-self:center!important;
    margin-inline:auto!important;
  }
}
@media(max-width:620px){
  .nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28{
    width:calc(100% + 8px)!important;
    margin-inline:-4px!important;
    cursor:default;
  }
}
@media(any-hover:none),(any-pointer:coarse){
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28{cursor:default}
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__cursor{display:none!important}
}
@media(prefers-reduced-motion:reduce){
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__cursor{display:none!important}
}
/* nrs-hero-system-v28:end */
`;

fs.writeFileSync(stylePath, css, 'utf8');

for (const token of [
  'data-hero-system-field',
  'hero-system-reference-v28.webp',
  'data-hero-system-particles',
  'nrs-hero-system-v28:start',
]) {
  const target = token.endsWith(':start') ? css : html;
  if (!target.includes(token)) throw new Error(`[hero-system-v28] Missing final contract token: ${token}.`);
}

console.log('[hero-system-v28] Installed the approved right-side systems portrait and interactive particle surface without changing the hero copy or navigation.');
