/**
 * @fileoverview scripts/ensure-hero-system-visual-v28.cjs
 * Purpose: Finalize the homepage hero's right-side systems composition around the original portrait while preserving the existing hero copy, navigation, and calls to action.
 * Responsibilities:
 * - Verify the reconstructed original portrait copied into the production output.
 * - Replace only the generated `.nrs-uploaded-visual` region after earlier hero composition stages complete.
 * - Keep the portrait surface transparent so it blends into both light and dark page themes.
 * - Add theme-aware halo, grid, orbit, labels, quote, particle canvas, and cursor response as independent layers around the portrait.
 * Execution context: Final production build stage after the existing hero and case-study refinements have run.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/finalize-signal-reference-visual.cjs
 * - src/scripts/features/motion/hero-system-field.js
 * Maintenance: Keep this stage scoped to the right-side hero visual. The left-side hero content remains owned by earlier canonical hero stages.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const portraitPath = path.join(base, 'assets', 'images', 'hero-portrait-original-v19.webp');
const expectedPortraitBytes = 27932;
const expectedPortraitHash = '6de71f96f93cd310bce284222856df254aa17c89a09b0b3dbcfedb96d6da3c34';

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-system-v28] Missing generated index.html or style.css.');
}

/**
 * Function contract: verifyPortrait
 * Purpose: Prove the production output is using the exact reconstructed original portrait owned by the earlier hero stage.
 * Inputs: None.
 * Side effects: Reads the copied portrait file.
 * Returns: Undefined; throws when the portrait is missing or does not match the expected bytes.
 */
function verifyPortrait() {
  if (!fs.existsSync(portraitPath)) {
    throw new Error('[hero-system-v28] Missing original portrait in the selected build target.');
  }
  const portrait = fs.readFileSync(portraitPath);
  const hash = crypto.createHash('sha256').update(portrait).digest('hex');
  if (portrait.length !== expectedPortraitBytes || hash !== expectedPortraitHash) {
    throw new Error(`[hero-system-v28] Portrait verification failed: ${portrait.length} bytes, ${hash}.`);
  }
  if (portrait.subarray(0, 4).toString('ascii') !== 'RIFF' || portrait.subarray(8, 12).toString('ascii') !== 'WEBP') {
    throw new Error('[hero-system-v28] Verified portrait is not a WebP file.');
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

verifyPortrait();

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

const visualMarkup = `<div class="nrs-uploaded-visual nrs-hero-system-v28" data-hero-system-field role="img" aria-label="Portrait of Nischhal Raj Subba surrounded by a product systems map for systems thinking, rule model, state model and choice architecture">
      <span class="nrs-hero-system-v28__halo" aria-hidden="true"></span>
      <span class="nrs-hero-system-v28__grid" aria-hidden="true"></span>
      <svg class="nrs-hero-system-v28__orbit" viewBox="0 0 100 100" aria-hidden="true">
        <ellipse cx="52" cy="48" rx="34" ry="30" transform="rotate(-12 52 48)"></ellipse>
        <ellipse cx="53" cy="50" rx="29" ry="37" transform="rotate(27 53 50)"></ellipse>
        <path d="M11 58 C25 40 39 31 57 28 C72 26 84 32 94 44"></path>
      </svg>
      <canvas class="nrs-hero-system-v28__particles" data-hero-system-particles aria-hidden="true"></canvas>
      <img class="nrs-hero-system-v28__art nrs-hero-system-v28__portrait" src="/assets/images/hero-portrait-original-v19.webp" alt="" width="540" height="720" decoding="async" fetchpriority="high" aria-hidden="true">
      <span class="nrs-hero-system-v28__label nrs-hero-system-v28__label--systems" aria-hidden="true">Systems thinking</span>
      <span class="nrs-hero-system-v28__label nrs-hero-system-v28__label--rule" aria-hidden="true">Rule model</span>
      <span class="nrs-hero-system-v28__label nrs-hero-system-v28__label--state" aria-hidden="true">State model</span>
      <span class="nrs-hero-system-v28__label nrs-hero-system-v28__label--choice" aria-hidden="true">Choice architecture</span>
      <blockquote class="nrs-hero-system-v28__quote" aria-hidden="true"><span>“</span>Every gap is ambiguity.<br>Good product design closes only<br>the gaps that change the decision.</blockquote>
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
  --nrs-hero-halo-core:rgba(255,96,30,.24);
  --nrs-hero-halo-mid:rgba(255,96,30,.10);
  --nrs-hero-halo-edge:rgba(255,96,30,.035);
  position:relative!important;
  width:min(100%,720px)!important;
  max-width:720px!important;
  aspect-ratio:640/568!important;
  justify-self:end!important;
  overflow:visible!important;
  isolation:isolate!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
  contain:layout;
  cursor:crosshair;
}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28{
  --nrs-hero-halo-core:rgba(239,106,44,.19);
  --nrs-hero-halo-mid:rgba(239,106,44,.075);
  --nrs-hero-halo-edge:rgba(239,106,44,.022);
  background:transparent!important;
  box-shadow:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28::before,
.nrs-uploaded-hero-v19 .nrs-hero-system-v28::after{content:none!important;display:none!important}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__halo{
  position:absolute!important;
  z-index:0!important;
  left:53%!important;
  top:49%!important;
  width:86%!important;
  height:82%!important;
  transform:translate(-50%,-50%)!important;
  border-radius:50%!important;
  background:
    radial-gradient(ellipse 43% 46% at 50% 39%,var(--nrs-hero-halo-core) 0%,var(--nrs-hero-halo-mid) 48%,transparent 78%),
    radial-gradient(ellipse 58% 42% at 48% 68%,var(--nrs-hero-halo-mid) 0%,var(--nrs-hero-halo-edge) 50%,transparent 82%)!important;
  filter:blur(22px)!important;
  opacity:1!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__grid{
  position:absolute!important;
  z-index:1!important;
  inset:5% 3% 7%!important;
  background-image:
    linear-gradient(color-mix(in srgb,var(--nrs-u-ink) 8%,transparent) 1px,transparent 1px),
    linear-gradient(90deg,color-mix(in srgb,var(--nrs-u-ink) 8%,transparent) 1px,transparent 1px)!important;
  background-size:28px 28px!important;
  opacity:.52!important;
  mask-image:radial-gradient(ellipse 69% 72% at 53% 47%,#000 0 36%,rgba(0,0,0,.82) 58%,transparent 94%)!important;
  -webkit-mask-image:radial-gradient(ellipse 69% 72% at 53% 47%,#000 0 36%,rgba(0,0,0,.82) 58%,transparent 94%)!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__orbit{
  position:absolute!important;
  z-index:2!important;
  inset:2% -1% 6% 1%!important;
  width:100%!important;
  height:100%!important;
  overflow:visible!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__orbit ellipse,
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__orbit path{
  fill:none!important;
  stroke:color-mix(in srgb,var(--nrs-u-ink) 22%,transparent)!important;
  stroke-width:.22!important;
  vector-effect:non-scaling-stroke;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__orbit ellipse:first-child{
  stroke:color-mix(in srgb,var(--nrs-u-orange) 48%,transparent)!important;
  stroke-width:.26!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__particles{
  position:absolute!important;
  z-index:3!important;
  inset:0!important;
  display:block!important;
  width:100%!important;
  height:100%!important;
  opacity:.94!important;
  mask-image:radial-gradient(ellipse 72% 76% at 52% 45%,#000 0 46%,rgba(0,0,0,.82) 68%,transparent 97%)!important;
  -webkit-mask-image:radial-gradient(ellipse 72% 76% at 52% 45%,#000 0 46%,rgba(0,0,0,.82) 68%,transparent 97%)!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__portrait{
  position:absolute!important;
  z-index:4!important;
  inset:0!important;
  display:block!important;
  width:100%!important;
  height:100%!important;
  max-width:none!important;
  object-fit:contain!important;
  object-position:center bottom!important;
  transform:none!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
  filter:drop-shadow(0 28px 40px rgba(0,0,0,.22))!important;
  mask-image:linear-gradient(to bottom,#000 0 80%,rgba(0,0,0,.98) 88%,rgba(0,0,0,.48) 96%,transparent 100%)!important;
  -webkit-mask-image:linear-gradient(to bottom,#000 0 80%,rgba(0,0,0,.98) 88%,rgba(0,0,0,.48) 96%,transparent 100%)!important;
  user-select:none!important;
  pointer-events:none!important;
}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-hero-system-v28__portrait{
  filter:drop-shadow(0 26px 42px rgba(65,45,31,.16))!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__label{
  position:absolute!important;
  z-index:6!important;
  max-width:17ch!important;
  color:color-mix(in srgb,var(--nrs-u-soft) 92%,transparent)!important;
  font:600 9px/1.25 var(--nrs-u-mono)!important;
  letter-spacing:.055em!important;
  text-transform:uppercase!important;
  white-space:normal!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__label::before{
  content:""!important;
  display:inline-block!important;
  width:6px!important;
  height:6px!important;
  margin:0 8px 1px 0!important;
  border-radius:50%!important;
  background:var(--nrs-u-orange)!important;
  box-shadow:0 0 14px color-mix(in srgb,var(--nrs-u-orange) 52%,transparent)!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--systems{left:7%!important;top:20%!important}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--rule{right:11%!important;top:13%!important}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--state{right:3%!important;top:47%!important}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--choice{right:5%!important;bottom:19%!important}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__quote{
  position:absolute!important;
  z-index:7!important;
  right:1.5%!important;
  bottom:2%!important;
  width:min(43%,270px)!important;
  margin:0!important;
  padding:18px 18px 20px!important;
  border:1px solid color-mix(in srgb,var(--nrs-u-ink) 27%,transparent)!important;
  background:color-mix(in srgb,var(--nrs-u-page) 78%,transparent)!important;
  color:var(--nrs-u-soft)!important;
  box-shadow:0 18px 46px color-mix(in srgb,#000 12%,transparent)!important;
  backdrop-filter:blur(10px)!important;
  -webkit-backdrop-filter:blur(10px)!important;
  font:400 12px/1.55 var(--nrs-u-sans)!important;
  letter-spacing:0!important;
  text-transform:none!important;
  pointer-events:none!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__quote span{
  display:block!important;
  margin-bottom:8px!important;
  color:var(--nrs-u-orange)!important;
  font:800 21px/1 var(--nrs-u-sans)!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__quote::after{
  content:""!important;
  display:block!important;
  width:36px!important;
  height:2px!important;
  margin-top:14px!important;
  background:var(--nrs-u-orange)!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__cursor{
  position:absolute!important;
  z-index:8!important;
  left:0!important;
  top:0!important;
  width:44px!important;
  height:44px!important;
  margin:-22px 0 0 -22px!important;
  border:1px solid color-mix(in srgb,var(--nrs-u-orange) 72%,transparent)!important;
  border-radius:50%!important;
  background:color-mix(in srgb,var(--nrs-u-orange) 2%,transparent)!important;
  box-shadow:0 0 0 1px color-mix(in srgb,var(--nrs-u-orange) 9%,transparent),0 0 22px color-mix(in srgb,var(--nrs-u-orange) 10%,transparent)!important;
  opacity:0;
  transform:translate3d(-80px,-80px,0) scale(.58);
  transform-origin:50% 50%!important;
  will-change:transform,opacity;
  pointer-events:none!important;
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
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__portrait{object-position:center bottom!important}
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__quote{right:1%!important;bottom:1%!important;width:46%!important;padding:12px!important;font-size:9px!important}
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__label{font-size:7px!important;opacity:.82!important}
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--systems{left:3%!important;top:19%!important}
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--rule{right:4%!important;top:12%!important}
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--state{right:0!important;top:45%!important}
  .nrs-uploaded-hero-v19 .nrs-hero-system-v28__label--choice{display:none!important}
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
  'hero-portrait-original-v19.webp',
  'nrs-hero-system-v28__halo',
  'data-hero-system-particles',
  'nrs-hero-system-v28:start',
]) {
  const target = token.endsWith(':start') ? css : html;
  if (!target.includes(token)) throw new Error(`[hero-system-v28] Missing final contract token: ${token}.`);
}

console.log('[hero-system-v28] Installed the original portrait with theme-blended halo, systems overlays and interactive particle surface without changing hero copy or navigation.');
