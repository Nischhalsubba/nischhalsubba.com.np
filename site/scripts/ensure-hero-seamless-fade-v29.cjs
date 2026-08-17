/**
 * @fileoverview scripts/ensure-hero-seamless-fade-v29.cjs
 * Purpose: Finish the homepage hero portrait system with a progressive edge fade that dissolves the right-side visual into the active page theme.
 * Responsibilities:
 * - Keep the verified original portrait asset unchanged.
 * - Fade the portrait, grid, orbit, and particle layers gradually toward transparent at the outer edge.
 * - Add a theme-aware page-color wash above the visual layers so dark and light themes blend without a visible rectangular boundary.
 * - Preserve labels, quote card, cursor response, hero copy, navigation, and calls to action.
 * Execution context: Final production build stage immediately after the right-side hero systems visual is installed.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/ensure-hero-system-visual-v28.cjs
 * Maintenance: Keep this stage presentation-only. Do not replace, recolor, retouch, or regenerate the portrait asset here.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(stylePath)) {
  throw new Error('[hero-seamless-v29] Missing style.css in the selected build target.');
}

let css = fs.readFileSync(stylePath, 'utf8');

if (!css.includes('nrs-hero-system-v28:start') || !css.includes('nrs-hero-system-v28__portrait')) {
  throw new Error('[hero-seamless-v29] The right-side hero systems visual must be installed before the seamless fade stage.');
}

const marker = /\/\* nrs-hero-seamless-fade-v29:start \*\/[\s\S]*?\/\* nrs-hero-seamless-fade-v29:end \*\//g;
css = css.replace(marker, '').trimEnd();

css += `

/* nrs-hero-seamless-fade-v29:start */
.nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28{
  --nrs-hero-atmosphere-mask:radial-gradient(ellipse 76% 84% at 52% 45%,#000 0 38%,rgba(0,0,0,.98) 49%,rgba(0,0,0,.88) 60%,rgba(0,0,0,.70) 70%,rgba(0,0,0,.48) 79%,rgba(0,0,0,.27) 87%,rgba(0,0,0,.10) 94%,transparent 100%);
  --nrs-hero-portrait-mask:radial-gradient(ellipse 67% 88% at 52% 47%,#000 0 56%,rgba(0,0,0,.98) 64%,rgba(0,0,0,.88) 71%,rgba(0,0,0,.72) 78%,rgba(0,0,0,.50) 85%,rgba(0,0,0,.28) 91%,rgba(0,0,0,.10) 96%,transparent 100%);
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__grid,
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__orbit,
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__particles{
  mask-image:var(--nrs-hero-atmosphere-mask)!important;
  -webkit-mask-image:var(--nrs-hero-atmosphere-mask)!important;
}
.nrs-uploaded-hero-v19 .nrs-hero-system-v28__portrait{
  mask-image:var(--nrs-hero-portrait-mask)!important;
  -webkit-mask-image:var(--nrs-hero-portrait-mask)!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28::after{
  content:""!important;
  display:block!important;
  position:absolute!important;
  z-index:5!important;
  inset:-1.5%!important;
  pointer-events:none!important;
  background:radial-gradient(ellipse 73% 84% at 52% 45%,
    transparent 0 48%,
    color-mix(in srgb,var(--nrs-u-page) 3%,transparent) 56%,
    color-mix(in srgb,var(--nrs-u-page) 10%,transparent) 64%,
    color-mix(in srgb,var(--nrs-u-page) 24%,transparent) 72%,
    color-mix(in srgb,var(--nrs-u-page) 44%,transparent) 80%,
    color-mix(in srgb,var(--nrs-u-page) 66%,transparent) 87%,
    color-mix(in srgb,var(--nrs-u-page) 86%,transparent) 94%,
    var(--nrs-u-page) 100%)!important;
}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28::after{
  background:radial-gradient(ellipse 73% 84% at 52% 45%,
    transparent 0 48%,
    color-mix(in srgb,var(--nrs-u-page) 4%,transparent) 56%,
    color-mix(in srgb,var(--nrs-u-page) 13%,transparent) 64%,
    color-mix(in srgb,var(--nrs-u-page) 29%,transparent) 72%,
    color-mix(in srgb,var(--nrs-u-page) 51%,transparent) 80%,
    color-mix(in srgb,var(--nrs-u-page) 72%,transparent) 87%,
    color-mix(in srgb,var(--nrs-u-page) 90%,transparent) 94%,
    var(--nrs-u-page) 100%)!important;
}
@media(max-width:620px){
  .nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28{
    --nrs-hero-atmosphere-mask:radial-gradient(ellipse 88% 92% at 52% 45%,#000 0 44%,rgba(0,0,0,.96) 58%,rgba(0,0,0,.78) 70%,rgba(0,0,0,.50) 82%,rgba(0,0,0,.22) 91%,transparent 100%);
    --nrs-hero-portrait-mask:radial-gradient(ellipse 82% 96% at 52% 48%,#000 0 62%,rgba(0,0,0,.96) 72%,rgba(0,0,0,.72) 82%,rgba(0,0,0,.38) 90%,rgba(0,0,0,.12) 96%,transparent 100%);
  }
  .nrs-uploaded-hero-v19 .nrs-uploaded-visual.nrs-hero-system-v28::after{
    inset:-1%!important;
    background:radial-gradient(ellipse 88% 94% at 52% 46%,transparent 0 56%,color-mix(in srgb,var(--nrs-u-page) 8%,transparent) 66%,color-mix(in srgb,var(--nrs-u-page) 28%,transparent) 78%,color-mix(in srgb,var(--nrs-u-page) 62%,transparent) 89%,var(--nrs-u-page) 100%)!important;
  }
}
/* nrs-hero-seamless-fade-v29:end */
`;

fs.writeFileSync(stylePath, css, 'utf8');

for (const token of [
  'nrs-hero-seamless-fade-v29:start',
  '--nrs-hero-atmosphere-mask',
  '--nrs-hero-portrait-mask',
  'var(--nrs-u-page) 100%',
]) {
  if (!css.includes(token)) throw new Error(`[hero-seamless-v29] Missing final contract token: ${token}.`);
}

console.log('[hero-seamless-v29] Applied progressive theme-aware edge fading around the original hero portrait and systems field.');
