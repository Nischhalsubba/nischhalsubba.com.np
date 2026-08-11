/**
 * @fileoverview scripts/finalize-hero-ux-remediations-v26.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for finalize hero ux remediations v26.
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
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-ux-v26] Missing index.html or style.css.');
}

const html = fs.readFileSync(homePath, 'utf8');
let css = fs.readFileSync(stylePath, 'utf8');

for (const token of ['nrs-uploaded-hero-v19', 'nrsStoryReadout', 'data-story="choice"', 'nrs-uploaded-thesis']) {
  if (!html.includes(token)) throw new Error(`[hero-ux-v26] Missing expected hero token: ${token}`);
}

const marker = /\/\* nrs-hero-ux-v26:start \*\/[\s\S]*?\/\* nrs-hero-ux-v26:end \*\//g;
css = css.replace(marker, '').trimEnd();

css += `

/* nrs-hero-ux-v26:start */
/* Keep the readout informative without letting it become an invisible hit-area wall. */
.nrs-uploaded-hero-v19 .nrs-story-readout{
  right:-1%!important;
  bottom:18%!important;
  pointer-events:none!important;
}

/* The story kicker is tiny normal text, so preserve the orange hue while meeting WCAG AA in light mode. */
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-story-readout-head{
  color:#b44412!important;
}

/* Preserve the tiny visual nodes while giving mouse, keyboard and touch users a larger target. */
.nrs-uploaded-hero-v19 .nrs-story-node{
  width:44px!important;
  height:44px!important;
}
.nrs-uploaded-hero-v19 .nrs-story-dot{inset:17px!important}

@media(max-width:960px){
  .nrs-uploaded-hero-v19 .nrs-story-readout{
    right:2%!important;
    bottom:20%!important;
  }
}

@media(hover:none),(pointer:coarse){
  .nrs-uploaded-hero-v19 .nrs-story-node{
    width:48px!important;
    height:48px!important;
    touch-action:manipulation!important;
    -webkit-tap-highlight-color:transparent!important;
  }
  .nrs-uploaded-hero-v19 .nrs-story-dot{inset:19px!important}
}

@media(max-width:620px){
  .nrs-uploaded-hero-v19 .nrs-story-readout{
    right:1%!important;
    bottom:24%!important;
    width:min(232px,61%)!important;
    min-height:84px!important;
    padding:12px 13px!important;
  }
  .nrs-uploaded-hero-v19 .nrs-story-readout-head{
    font-size:8.5px!important;
    line-height:1.2!important;
  }
  .nrs-uploaded-hero-v19 .nrs-story-readout strong{
    font-size:12px!important;
    line-height:1.36!important;
  }
  .nrs-uploaded-hero-v19 .nrs-story-readout code{
    font-size:9px!important;
    line-height:1.3!important;
  }
  .nrs-uploaded-hero-v19 .nrs-uploaded-thesis{
    width:48%!important;
    font-size:11px!important;
    line-height:1.52!important;
    letter-spacing:.025em!important;
  }
}

@media(prefers-reduced-motion:reduce){
  .nrs-uploaded-hero-v19 .nrs-story-readout,
  .nrs-uploaded-hero-v19 .nrs-story-dot{
    transition:none!important;
    animation:none!important;
  }
}
/* nrs-hero-ux-v26:end */
`;

fs.writeFileSync(stylePath, css, 'utf8');

for (const check of [
  'nrs-hero-ux-v26:start',
  'pointer-events:none!important',
  'color:#b44412!important',
  'width:48px!important',
  'font-size:11px!important',
  'bottom:24%!important',
]) {
  if (!css.includes(check)) throw new Error(`[hero-ux-v26] Missing generated CSS contract: ${check}`);
}

console.log('[hero-ux-v26] Removed readout hit-area collisions, enforced accessible light-theme readout contrast, enlarged touch targets, and improved mobile story readability.');