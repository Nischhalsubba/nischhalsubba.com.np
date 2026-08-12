/**
 * @fileoverview scripts/ensure-signal-portrait-interaction-v12.cjs
 * Purpose: Apply the ensure signal portrait interaction v12 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath)) throw new Error(`[signal-portrait-v12] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-portrait-v12] Missing ${stylePath}`);

let html = fs.readFileSync(homePath, 'utf8');

const figureMarkup = `<div class="agent-system-figure nrs-signal-figure" data-signal-portrait aria-label="Interactive Signal over Noise portrait composition">
  <div class="nrs-signal-portrait-layer" aria-hidden="true">
    <img class="nrs-signal-portrait nrs-signal-portrait--main" src="/assets/images/portrait.png" alt="" loading="eager" decoding="async">
    <img class="nrs-signal-portrait nrs-signal-portrait--ghost" src="/assets/images/portrait.png" alt="" loading="eager" decoding="async">
  </div>
  <div class="nrs-signal-noise" aria-hidden="true"></div>
  <svg class="nrs-signal-orbit" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <ellipse class="nrs-signal-orbit-path nrs-signal-orbit-path--main" data-signal-orbit-main pathLength="1" cx="58" cy="47" rx="35" ry="29" transform="rotate(-9 58 47)"></ellipse>
    <ellipse class="nrs-signal-orbit-path" pathLength="1" cx="55" cy="49" rx="31" ry="34" transform="rotate(31 55 49)"></ellipse>
    <line class="nrs-signal-connector" data-signal-connector x1="12" y1="52" x2="12" y2="52" pathLength="1"></line>
    <circle class="nrs-signal-halo" data-signal-halo cx="12" cy="52" r="2.4"></circle>
  </svg>
  <div class="nrs-signal-nodes">
    <button class="nrs-signal-node nrs-signal-node--signal" type="button" data-signal-node="signal" data-signal-x="12" data-signal-y="52" aria-label="Activate Signal Mode" aria-pressed="false" style="left:12%;top:52%"><span>Signal</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="intent" data-signal-x="25" data-signal-y="63" aria-label="Explore intent" aria-pressed="false" style="left:25%;top:63%"><span>Intent</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="logic" data-signal-x="83" data-signal-y="28" aria-label="Explore product logic" aria-pressed="false" style="left:83%;top:28%"><span>Logic</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="state" data-signal-x="89" data-signal-y="58" aria-label="Explore important state" aria-pressed="false" style="left:89%;top:58%"><span>State</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="decision" data-signal-x="62" data-signal-y="69" aria-label="Explore decision" aria-pressed="false" style="left:62%;top:69%"><span>Decision</span></button>
  </div>
  <div class="nrs-signal-thesis" data-signal-thesis aria-hidden="true">
    <small>Hidden design thesis</small>
    <strong>Signal over noise</strong>
    <p>The white point is the useful truth. Every orbit, state and decision exists to make that signal easier to act on.</p>
  </div>
  <div class="nrs-signal-insight" data-signal-insight role="status" aria-live="polite" aria-hidden="true">
    <small data-signal-kicker>Product state</small>
    <strong data-signal-title>Explore a node</strong>
    <p data-signal-copy>The orange nodes encode the reasoning model behind the visual system.</p>
  </div>
</div>`;

if (!html.includes('data-signal-portrait')) {
  const figurePattern = /<div class="agent-system-figure">[\s\S]*?<\/div>(?=<div class="agent-hero-foot">)/i;
  if (!figurePattern.test(html)) {
    throw new Error('[signal-portrait-v12] Final homepage design figure was not found. Refusing to guess at production markup.');
  }
  html = html.replace(figurePattern, figureMarkup);
  fs.writeFileSync(homePath, html, 'utf8');
}

let style = fs.readFileSync(stylePath, 'utf8');
const start = '/* nrs-signal-portrait-v12:start */';
const end = '/* nrs-signal-portrait-v12:end */';
const marker = /\/\* nrs-signal-portrait-v12:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v12:end \*\//g;
const css = `${start}
.agent-portfolio .nrs-signal-figure {
  --nrs-signal-orange: #ef6a2c;
  --nrs-signal-orange-2: #ff8446;
  --nrs-signal-white: #f1ebdd;
  position: relative;
  width: 100%;
  max-width: 31rem;
  min-height: 0 !important;
  aspect-ratio: 4 / 5 !important;
  margin-inline-start: auto;
  border: 1px solid rgba(255,255,255,.13);
  background: #080808;
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 40px 100px rgba(0,0,0,.45);
  color: var(--nrs-signal-white);
}

.agent-portfolio .nrs-signal-figure::before,
.agent-portfolio .nrs-signal-figure::after {
  content: none !important;
  display: none !important;
}

.agent-portfolio .nrs-signal-figure .agent-three-canvas {
  display: none !important;
}

.agent-portfolio .nrs-signal-portrait-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.agent-portfolio .nrs-signal-portrait {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
  transform-origin: center;
  user-select: none;
  will-change: transform, filter, opacity;
}

.agent-portfolio .nrs-signal-portrait--main {
  z-index: 1;
  opacity: .98;
  filter: none;
  mix-blend-mode: normal;
  transform: scale(1.002);
}

.agent-portfolio .nrs-signal-portrait--ghost {
  z-index: 2;
  opacity: 0;
  clip-path: ellipse(35% 39% at 34% 45%);
  filter: grayscale(1) contrast(1.25) brightness(.82);
  mix-blend-mode: screen;
  transform: translateX(12px) scale(1.015);
  pointer-events: none;
}

.agent-portfolio .nrs-signal-noise {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(circle at 14% 52%, transparent 0 3%, rgba(0,0,0,0) 28%), linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,.08));
  opacity: 0;
  transition: opacity .35s cubic-bezier(.2,0,0,1);
}

.agent-portfolio .nrs-signal-orbit {
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(239,106,44,.08));
  will-change: transform;
}

.agent-portfolio .nrs-signal-orbit-path {
  fill: none;
  stroke: rgba(239,106,44,.58);
  stroke-width: .23;
  stroke-linecap: round;
  stroke-dasharray: 1.7 1.2;
  vector-effect: non-scaling-stroke;
}

.agent-portfolio .nrs-signal-orbit-path--main {
  stroke: rgba(239,106,44,.78);
  stroke-width: .18;
  stroke-dasharray: none;
}

.agent-portfolio .nrs-signal-connector {
  stroke: rgba(233,230,223,.72);
  stroke-width: .16;
  stroke-dasharray: 1.2 .8;
  vector-effect: non-scaling-stroke;
  opacity: 0;
}

.agent-portfolio .nrs-signal-halo {
  fill: none;
  stroke: rgba(233,230,223,.42);
  stroke-width: .15;
  vector-effect: non-scaling-stroke;
  opacity: 0;
}

.agent-portfolio .nrs-signal-nodes {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}

.agent-portfolio .nrs-signal-node {
  position: absolute;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  margin: -22px 0 0 -22px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent !important;
  color: var(--nrs-signal-white) !important;
  -webkit-text-fill-color: var(--nrs-signal-white) !important;
  cursor: pointer;
  touch-action: manipulation;
  pointer-events: auto;
}

.agent-portfolio .nrs-signal-node::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--nrs-signal-orange);
  box-shadow: 0 0 0 1px rgba(255,160,105,.42), 0 0 18px rgba(239,106,44,.18);
  transition: box-shadow .18s cubic-bezier(.2,0,0,1), background-color .18s cubic-bezier(.2,0,0,1);
}

.agent-portfolio .nrs-signal-node::after {
  content: '';
  position: absolute;
  inset: 10px;
  border: 1px solid transparent;
  border-radius: 50%;
  transition: border-color .18s cubic-bezier(.2,0,0,1);
}

.agent-portfolio .nrs-signal-node:hover::after,
.agent-portfolio .nrs-signal-node:focus-visible::after {
  border-color: rgba(239,106,44,.42);
}

.agent-portfolio .nrs-signal-node:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.agent-portfolio .nrs-signal-node--signal::before {
  width: 10px;
  height: 10px;
  background: var(--nrs-signal-white);
  box-shadow: 0 0 0 1px rgba(255,255,255,.35), 0 0 20px rgba(255,255,255,.18);
}

.agent-portfolio .nrs-signal-node.is-active::before {
  background: var(--nrs-signal-orange-2);
  box-shadow: 0 0 0 3px rgba(239,106,44,.14), 0 0 24px rgba(239,106,44,.48);
}

.agent-portfolio .nrs-signal-node--signal.is-active::before {
  background: #fff;
  box-shadow: 0 0 0 5px rgba(255,255,255,.08), 0 0 26px rgba(255,255,255,.38);
}

.agent-portfolio .nrs-signal-node > span {
  position: absolute;
  left: 50%;
  top: calc(100% - 1px);
  transform: translateX(-50%) translateY(4px);
  padding: 5px 7px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 6px;
  background: rgba(8,8,8,.88);
  color: #ddd7cd !important;
  -webkit-text-fill-color: #ddd7cd !important;
  font: 9px/1 var(--ap-font-mono);
  letter-spacing: .07em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
}

.agent-portfolio .nrs-signal-node.is-active > span,
.agent-portfolio .nrs-signal-node:hover > span,
.agent-portfolio .nrs-signal-node:focus-visible > span {
  opacity: 1;
}

.agent-portfolio .nrs-signal-insight {
  position: absolute;
  z-index: 8;
  left: 4.5%;
  bottom: 3.6%;
  width: 68%;
  max-width: 68%;
  padding: 10px 12px;
  border: 0;
  border-left: 2px solid var(--nrs-signal-orange);
  background: linear-gradient(90deg, rgba(8,8,8,.9), rgba(8,8,8,.55), transparent);
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  pointer-events: none;
}

.agent-portfolio .nrs-signal-thesis {
  position: absolute;
  z-index: 9;
  right: 5%;
  top: 6%;
  width: 44%;
  max-width: 44%;
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(8,8,8,.86);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  pointer-events: none;
}

.agent-portfolio .nrs-signal-insight small,
.agent-portfolio .nrs-signal-thesis small {
  display: block;
  margin-bottom: 5px;
  color: var(--nrs-signal-orange-2) !important;
  -webkit-text-fill-color: var(--nrs-signal-orange-2) !important;
  font: 9px/1.25 var(--ap-font-mono);
  letter-spacing: .13em;
  text-transform: uppercase;
}

.agent-portfolio .nrs-signal-insight strong,
.agent-portfolio .nrs-signal-thesis strong {
  display: block;
  color: var(--nrs-signal-white) !important;
  -webkit-text-fill-color: var(--nrs-signal-white) !important;
  font: 700 14px/1.25 var(--ap-font-display);
  letter-spacing: -.02em;
}

.agent-portfolio .nrs-signal-thesis strong {
  font-size: 15px;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.agent-portfolio .nrs-signal-insight p,
.agent-portfolio .nrs-signal-thesis p {
  margin: 5px 0 0;
  color: #c5c0b8 !important;
  -webkit-text-fill-color: #c5c0b8 !important;
  font: 11px/1.45 var(--ap-font-body);
}

.agent-portfolio .nrs-signal-thesis p {
  color: #b8b2aa !important;
  -webkit-text-fill-color: #b8b2aa !important;
  font-size: 10px;
  line-height: 1.5;
}

.agent-portfolio .nrs-signal-figure.is-signal-mode .nrs-signal-noise {
  opacity: .55;
}

@media (max-width: 899px) {
  .agent-portfolio .nrs-signal-figure {
    width: min(100%, 29rem);
    max-width: 29rem;
    margin-inline: auto;
  }

  .agent-portfolio .nrs-signal-node {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
    margin: -24px 0 0 -24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .nrs-signal-figure *,
  .agent-portfolio .nrs-signal-figure *::before,
  .agent-portfolio .nrs-signal-figure *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
${end}`;

style = marker.test(style) ? style.replace(marker, css) : `${style}\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const result = fs.readFileSync(homePath, 'utf8');
for (const token of ['data-signal-portrait', 'data-signal-node="signal"', 'data-signal-state="logic"', 'Signal over noise']) {
  if (!result.includes(token)) throw new Error(`[signal-portrait-v12] Missing homepage token: ${token}`);
}

console.log('[signal-portrait-v12] Approved Signal demo composition applied to homepage.');
