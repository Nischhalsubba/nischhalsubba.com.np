/**
 * @fileoverview scripts/remove-signal-hero-legend.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for remove signal hero legend.
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

if (!fs.existsSync(homePath)) {
  throw new Error(`[signal-hero-cleanup] Missing ${homePath}`);
}
if (!fs.existsSync(stylePath)) {
  throw new Error(`[signal-hero-cleanup] Missing ${stylePath}`);
}

let html = fs.readFileSync(homePath, 'utf8');
const legendStart = html.indexOf('<div class="legend" aria-label="Visual legend">');

if (legendStart >= 0) {
  const hintStart = html.indexOf('<p class="hint">', legendStart);
  if (hintStart < 0) {
    throw new Error('[signal-hero-cleanup] Legend found but instruction hint boundary is missing.');
  }

  const hintEnd = html.indexOf('</p>', hintStart);
  if (hintEnd < 0) {
    throw new Error('[signal-hero-cleanup] Instruction hint closing tag is missing.');
  }

  html = html.slice(0, legendStart) + html.slice(hintEnd + 4);
}

if (html.includes('<div class="legend" aria-label="Visual legend">')) {
  throw new Error('[signal-hero-cleanup] Visual legend survived cleanup.');
}
if (html.includes('<p class="hint">Desktop: move the pointer for subtle depth.')) {
  throw new Error('[signal-hero-cleanup] Interaction instruction survived cleanup.');
}

/*
 * Final hero blend layer.
 *
 * The uploaded demo's exact dark poster remains the dark-theme source of truth,
 * but its hard rectangular edge is faded into the page. For the light theme we
 * do not display that black poster surface. Instead, an SVG luminance treatment
 * derives a soft monochrome portrait from the same exact poster while the
 * existing orange orbit/node system remains live above it.
 */
const signalStageOpen = '<div class="stage" id="signalStage" aria-label="Interactive Signal over Noise portrait composition">';
const lightVisual = `<svg class="nrs-light-portrait" viewBox="0 0 1122 1402" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <defs>
    <filter id="nrs-light-poster-ink" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="
        0 0 0 0 0.045
        0 0 0 0 0.043
        0 0 0 0 0.038
        0.2126 0.7152 0.0722 0 0"/>
    </filter>
    <filter id="nrs-light-mask-blur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="78"/>
    </filter>
    <mask id="nrs-light-portrait-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1122" height="1402">
      <ellipse cx="640" cy="625" rx="430" ry="535" fill="#fff" filter="url(#nrs-light-mask-blur)"/>
    </mask>
  </defs>
  <g mask="url(#nrs-light-portrait-mask)">
    <image class="nrs-light-portrait-ghost" href="/assets/images/signal-over-noise-exact.webp" x="-40" y="0" width="1122" height="1402" filter="url(#nrs-light-poster-ink)"/>
    <image class="nrs-light-portrait-main" href="/assets/images/signal-over-noise-exact.webp" x="0" y="0" width="1122" height="1402" filter="url(#nrs-light-poster-ink)"/>
  </g>
</svg><p class="nrs-light-poster-copy" aria-hidden="true">My job is usually the same: find the product logic, expose the important state and make the next decision easier.</p>`;

if (!html.includes('class="nrs-light-portrait"')) {
  if (!html.includes(signalStageOpen)) {
    throw new Error('[signal-hero-blend] Signal stage boundary was not found.');
  }
  html = html.replace(signalStageOpen, `${signalStageOpen}${lightVisual}`);
}

const practiceSection = /<section\b[^>]*aria-labelledby=["']practice-heading["'][^>]*>[\s\S]*?<\/section>/i;
if (!practiceSection.test(html)) {
  throw new Error('[home-habits] Homepage What I bring section was not found.');
}

const habitsSection = `<section class="agent-section agent-section--inverse nrs-home-habits" aria-labelledby="practice-heading"><div class="agent-frame"><header class="agent-section-head nrs-home-habits-head"><span class="agent-kicker">What I bring</span><h2 class="agent-section-title" id="practice-heading">Three habits that keep product decisions useful through implementation.</h2></header><div class="nrs-home-habits-grid"><article class="nrs-home-habit"><span class="agent-meta">01 · Clarity</span><div><h3>Find the real product problem.</h3><p>Clarify the user goal, constraints, important state and decision points before visual polish makes a weak flow look finished.</p></div></article><article class="nrs-home-habit"><span class="agent-meta">02 · Systems</span><div><h3>Reuse decisions, not just components.</h3><p>Build patterns that create consistency while leaving room for workflows that genuinely need to behave differently.</p></div></article><article class="nrs-home-habit"><span class="agent-meta">03 · Delivery</span><div><h3>Close the gap between design and build.</h3><p>Document responsive behavior, states and implementation intent, then stay close enough to QA the real interface.</p></div></article></div></div></section>`;

html = html.replace(practiceSection, habitsSection);

const requiredHabits = [
  '01 · Clarity',
  '02 · Systems',
  '03 · Delivery',
  'Reuse decisions, not just components.',
  'Close the gap between design and build.',
];
for (const token of requiredHabits) {
  if (!html.includes(token)) throw new Error(`[home-habits] Missing required content: ${token}`);
}
if (html.includes('04 · Delivery') || html.includes('03 · Systems')) {
  throw new Error('[home-habits] Legacy numbering survived homepage normalization.');
}
if (!html.includes('class="nrs-light-portrait"')) {
  throw new Error('[signal-hero-blend] Light-theme portrait layer was not installed.');
}

fs.writeFileSync(homePath, html, 'utf8');

const cssStart = '/* nrs-home-habits-fix:start */';
const cssEnd = '/* nrs-home-habits-fix:end */';
const cssMarker = /\/\* nrs-home-habits-fix:start \*\/[\s\S]*?\/\* nrs-home-habits-fix:end \*\//g;
const habitsCss = `${cssStart}
.agent-portfolio .nrs-home-habits {
  padding-block: clamp(4.5rem, 7vw, 7rem) !important;
}
.agent-portfolio .nrs-home-habits-head {
  display: grid !important;
  grid-template-columns: minmax(10rem, .65fr) minmax(0, 1.35fr) !important;
  gap: 1.25rem clamp(2rem, 7vw, 8rem) !important;
  align-items: start !important;
  margin-bottom: clamp(2.5rem, 5vw, 4.5rem) !important;
}
.agent-portfolio .nrs-home-habits-head .agent-section-title {
  max-width: 15ch !important;
  margin: 0 !important;
  text-wrap: balance;
}
.agent-portfolio .nrs-home-habits-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  border-top: 1px solid rgba(247, 242, 232, .34) !important;
  border-bottom: 1px solid rgba(247, 242, 232, .24) !important;
}
.agent-portfolio .nrs-home-habit {
  display: grid !important;
  grid-template-rows: auto 1fr !important;
  gap: clamp(2.75rem, 4vw, 4.75rem) !important;
  min-width: 0 !important;
  min-height: clamp(13rem, 19vw, 17rem) !important;
  padding: 1.35rem clamp(1.25rem, 2.25vw, 2rem) 1.65rem !important;
  border-right: 1px solid rgba(247, 242, 232, .22) !important;
}
.agent-portfolio .nrs-home-habit:first-child {
  padding-left: 0 !important;
}
.agent-portfolio .nrs-home-habit:last-child {
  padding-right: 0 !important;
  border-right: 0 !important;
}
.agent-portfolio .nrs-home-habit h3 {
  max-width: 16ch !important;
  margin: 0 0 .6rem !important;
  color: #f7f2e8 !important;
  font: 700 clamp(1.55rem, 2.3vw, 2.25rem)/.98 var(--ap-font-display) !important;
  letter-spacing: -.045em !important;
  text-wrap: balance;
}
.agent-portfolio .nrs-home-habit p {
  max-width: 36rem !important;
  margin: 0 !important;
  color: #d8d1c5 !important;
  font-size: clamp(.95rem, 1.1vw, 1.05rem) !important;
  line-height: 1.58 !important;
}
.agent-portfolio .nrs-home-habit .agent-meta {
  color: #c7c0b4 !important;
  opacity: 1 !important;
}
@media (max-width: 900px) {
  .agent-portfolio .nrs-home-habits-head {
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 1rem !important;
  }
  .agent-portfolio .nrs-home-habits-head .agent-section-title {
    max-width: 18ch !important;
  }
  .agent-portfolio .nrs-home-habits-grid {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .agent-portfolio .nrs-home-habit,
  .agent-portfolio .nrs-home-habit:first-child,
  .agent-portfolio .nrs-home-habit:last-child {
    min-height: 0 !important;
    padding: 1.25rem 0 1.5rem !important;
    border-right: 0 !important;
    border-bottom: 1px solid rgba(247, 242, 232, .22) !important;
    gap: 2rem !important;
  }
  .agent-portfolio .nrs-home-habit:last-child {
    border-bottom: 0 !important;
  }
}
${cssEnd}`;

const blendStart = '/* nrs-signal-theme-blend-v1:start */';
const blendEnd = '/* nrs-signal-theme-blend-v1:end */';
const blendMarker = /\/\* nrs-signal-theme-blend-v\d+:start \*\/[\s\S]*?\/\* nrs-signal-theme-blend-v\d+:end \*\//g;
const blendCss = `${blendStart}
/* The hero visual is part of the page, not a card. */
.agent-portfolio .agent-hero-side,
.agent-portfolio .nrs-signal-exact,
.agent-portfolio .nrs-signal-exact .stage {
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background-color: transparent !important;
}
.agent-portfolio .nrs-signal-exact {
  overflow: visible !important;
}
.agent-portfolio .nrs-signal-exact .stage {
  overflow: visible !important;
  isolation: isolate !important;
}
.agent-portfolio .nrs-signal-exact .stage::before {
  content: '';
  position: absolute;
  inset: 5% 2%;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(239,106,44,.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(239,106,44,.055) 1px, transparent 1px);
  background-size: 7.5% 6%;
  opacity: .38;
  -webkit-mask-image: radial-gradient(ellipse 72% 68% at 58% 45%, #000 0 44%, rgba(0,0,0,.72) 67%, transparent 100%);
  mask-image: radial-gradient(ellipse 72% 68% at 58% 45%, #000 0 44%, rgba(0,0,0,.72) 67%, transparent 100%);
}
.agent-portfolio .nrs-signal-exact .poster,
.agent-portfolio .nrs-signal-exact .reasoning {
  -webkit-mask-image: radial-gradient(ellipse 78% 76% at 57% 46%, #000 0 50%, rgba(0,0,0,.96) 62%, rgba(0,0,0,.72) 76%, rgba(0,0,0,.28) 90%, transparent 100%) !important;
  mask-image: radial-gradient(ellipse 78% 76% at 57% 46%, #000 0 50%, rgba(0,0,0,.96) 62%, rgba(0,0,0,.72) 76%, rgba(0,0,0,.28) 90%, transparent 100%) !important;
}
.agent-portfolio .nrs-signal-exact .orbit-svg,
.agent-portfolio .nrs-signal-exact .node-layer,
.agent-portfolio .nrs-signal-exact .hidden-thesis,
.agent-portfolio .nrs-signal-exact .insight {
  z-index: 5 !important;
}
.agent-portfolio .nrs-light-portrait,
.agent-portfolio .nrs-light-poster-copy {
  display: none;
}

/* Light theme: use the same approved poster as a luminance source, not a black card. */
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .poster,
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .reasoning,
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .noise-wash {
  display: none !important;
}
html[data-theme='light'] .agent-portfolio .nrs-light-portrait {
  display: block;
  position: absolute;
  inset: -4% -2% -2% -4%;
  z-index: 2;
  width: 106%;
  height: 106%;
  overflow: visible;
  pointer-events: none;
  opacity: .9;
}
html[data-theme='light'] .agent-portfolio .nrs-light-portrait-main {
  opacity: .92;
}
html[data-theme='light'] .agent-portfolio .nrs-light-portrait-ghost {
  opacity: .075;
  transform: translate(-38px, -4px) scale(1.018);
  transform-origin: 55% 45%;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .stage::before {
  background-image:
    linear-gradient(rgba(17,17,15,.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17,17,15,.055) 1px, transparent 1px);
  opacity: .4;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .orbit-path {
  stroke: rgba(239,106,44,.54) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .orbit-path.main {
  stroke: rgba(239,106,44,.82) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .connector {
  stroke: rgba(17,17,15,.52) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .node.signal {
  background: #f5f1e8 !important;
  border-color: rgba(17,17,15,.3) !important;
  box-shadow: 0 0 0 4px rgba(245,241,232,.72) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .node.state-node {
  border-color: rgba(239,106,44,.78) !important;
  box-shadow: 0 0 0 3px rgba(239,106,44,.08) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-light-poster-copy {
  display: block;
  position: absolute;
  left: 8%;
  bottom: 13%;
  z-index: 6;
  width: min(40%, 18rem);
  margin: 0;
  color: rgba(17,17,15,.72) !important;
  -webkit-text-fill-color: rgba(17,17,15,.72) !important;
  font: 650 clamp(.58rem, .72vw, .75rem)/1.55 var(--ap-font-mono);
  letter-spacing: .015em;
  text-transform: uppercase;
  pointer-events: none;
}
html[data-theme='light'] .agent-portfolio .agent-hero-foot {
  border-top-color: rgba(17,17,15,.16) !important;
}

/* Dark theme: soften the remaining poster edge until it disappears into the page. */
html[data-theme='dark'] .agent-portfolio .nrs-signal-exact .stage,
html:not([data-theme='light']) .agent-portfolio .nrs-signal-exact .stage {
  background: transparent !important;
}
html[data-theme='dark'] .agent-portfolio .nrs-signal-exact .poster,
html:not([data-theme='light']) .agent-portfolio .nrs-signal-exact .poster {
  filter: brightness(.98) contrast(1.035) saturate(.94);
}
html[data-theme='dark'] .agent-portfolio .nrs-signal-exact .stage::after,
html:not([data-theme='light']) .agent-portfolio .nrs-signal-exact .stage::after {
  content: '';
  position: absolute;
  inset: -3%;
  z-index: 4;
  pointer-events: none;
  background: radial-gradient(ellipse 64% 62% at 58% 44%, transparent 0 58%, rgba(8,8,8,.08) 72%, rgba(8,8,8,.54) 100%);
  mix-blend-mode: multiply;
}

@media (max-width: 900px) {
  html[data-theme='light'] .agent-portfolio .nrs-light-poster-copy {
    left: 7%;
    bottom: 11%;
    width: 47%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .nrs-light-portrait-ghost {
    transform: none !important;
  }
}
${blendEnd}`;

let css = fs.readFileSync(stylePath, 'utf8');
css = css.replace(cssMarker, '').replace(blendMarker, '').trimEnd();
css += `\n\n${habitsCss}\n\n${blendCss}\n`;
fs.writeFileSync(stylePath, css, 'utf8');

console.log('[signal-hero-cleanup] Removed hero legend/instructions, installed seamless theme-aware portrait blending, and normalized the homepage Three habits section.');
