const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath)) throw new Error(`[signal-portrait-v12] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-portrait-v12] Missing ${stylePath}`);

let html = fs.readFileSync(homePath, 'utf8');

const figureMarkup = `<div class="agent-system-figure nrs-signal-figure" data-signal-portrait>
  <canvas class="agent-three-canvas" aria-hidden="true"></canvas>
  <div class="nrs-signal-portrait-layer" aria-hidden="true">
    <img class="nrs-signal-portrait nrs-signal-portrait--ghost" src="/assets/images/portrait.png" alt="" loading="eager" decoding="async">
    <img class="nrs-signal-portrait nrs-signal-portrait--main" src="/assets/images/portrait.png" alt="" loading="eager" decoding="async">
  </div>
  <svg class="nrs-signal-connectors" viewBox="0 0 100 100" aria-hidden="true">
    <line class="nrs-signal-connector" data-signal-connector x1="22" y1="59" x2="22" y2="59" pathLength="1"></line>
    <circle class="nrs-signal-halo" cx="22" cy="59" r="2.7"></circle>
  </svg>
  <div class="nrs-signal-nodes">
    <button class="nrs-signal-node nrs-signal-node--signal" type="button" data-signal-node="signal" aria-label="Reveal the Signal over Noise design meaning" aria-pressed="false" style="--signal-x:22%;--signal-y:59%"><span>Signal</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="intent" data-signal-x="16" data-signal-y="39" aria-label="Explore intent" aria-pressed="false" style="--signal-x:16%;--signal-y:39%"><span>Intent</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="logic" data-signal-x="79" data-signal-y="25" aria-label="Explore product logic" aria-pressed="false" style="--signal-x:79%;--signal-y:25%"><span>Logic</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="state" data-signal-x="87" data-signal-y="55" aria-label="Explore important state" aria-pressed="false" style="--signal-x:87%;--signal-y:55%"><span>State</span></button>
    <button class="nrs-signal-node" type="button" data-signal-state="decision" data-signal-x="64" data-signal-y="72" aria-label="Explore decision" aria-pressed="false" style="--signal-x:64%;--signal-y:72%"><span>Decision</span></button>
  </div>
  <div class="nrs-signal-thesis" data-signal-thesis aria-hidden="true">
    <small>Hidden design thesis</small>
    <strong>Signal over noise</strong>
    <p>Complexity is useful only when it helps expose the next decision.</p>
  </div>
  <div class="nrs-signal-insight" data-signal-insight role="status" aria-live="polite" aria-hidden="true">
    <small data-signal-kicker>Product state</small>
    <strong data-signal-title>Explore a node</strong>
    <p data-signal-copy>The orange nodes encode the reasoning model behind the visual system.</p>
  </div>
  <p class="agent-system-label nrs-signal-quote">My job is usually the same: <span data-signal-concept="logic">find the product logic</span>, <span data-signal-concept="state">expose the important state</span> and <span data-signal-concept="decision">make the next decision easier</span>.</p>
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
  --nrs-signal-orange: #ff6b2c;
  --nrs-signal-white: #f4f0e8;
  min-height: 24rem;
  background: #080908;
  color: var(--nrs-signal-white);
  isolation: isolate;
}

.agent-portfolio .nrs-signal-figure::before {
  z-index: 0;
  opacity: .42;
}

.agent-portfolio .nrs-signal-figure::after {
  z-index: 4;
  opacity: .28;
}

.agent-portfolio .nrs-signal-figure .agent-three-canvas {
  z-index: 3;
  opacity: .52;
  pointer-events: none;
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
  top: -6%;
  right: -6%;
  width: 91%;
  height: 105%;
  object-fit: cover;
  object-position: 56% 34%;
  transform-origin: 58% 42%;
  will-change: transform, opacity;
  user-select: none;
}

.agent-portfolio .nrs-signal-portrait--main {
  z-index: 2;
  opacity: .72;
  filter: grayscale(1) contrast(1.16) brightness(.72) sepia(.13);
  mix-blend-mode: screen;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 21%, #000 91%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 21%, #000 91%, transparent 100%);
}

.agent-portfolio .nrs-signal-portrait--ghost {
  z-index: 1;
  top: -3%;
  right: 24%;
  width: 88%;
  opacity: .11;
  filter: grayscale(1) contrast(1.4) brightness(.62);
  mix-blend-mode: screen;
  -webkit-mask-image: radial-gradient(circle at 52% 39%, #000 0 25%, rgba(0,0,0,.72) 41%, transparent 68%);
  mask-image: radial-gradient(circle at 52% 39%, #000 0 25%, rgba(0,0,0,.72) 41%, transparent 68%);
}

.agent-portfolio .nrs-signal-connectors {
  position: absolute;
  inset: 0;
  z-index: 7;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}

.agent-portfolio .nrs-signal-connector {
  stroke: rgba(255,107,44,.88);
  stroke-width: .34;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1.4 1.8;
  opacity: 0;
}

.agent-portfolio .nrs-signal-halo {
  fill: none;
  stroke: rgba(244,240,232,.68);
  stroke-width: .3;
  vector-effect: non-scaling-stroke;
  opacity: .55;
}

.agent-portfolio .nrs-signal-nodes {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
}

.agent-portfolio .nrs-signal-node {
  position: absolute;
  left: var(--signal-x);
  top: var(--signal-y);
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: grid;
  place-items: center;
  transform: translate(-50%, -50%);
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent !important;
  color: var(--nrs-signal-white) !important;
  -webkit-text-fill-color: var(--nrs-signal-white) !important;
  pointer-events: auto;
  cursor: pointer;
}

.agent-portfolio .nrs-signal-node::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--nrs-signal-orange);
  box-shadow: 0 0 0 1px rgba(255,107,44,.42), 0 0 18px rgba(255,107,44,.25);
  transition: transform 140ms cubic-bezier(.2,0,0,1), box-shadow 140ms cubic-bezier(.2,0,0,1), opacity 140ms cubic-bezier(.2,0,0,1);
}

.agent-portfolio .nrs-signal-node--signal::before {
  width: 10px;
  height: 10px;
  background: var(--nrs-signal-white);
  box-shadow: 0 0 0 1px rgba(244,240,232,.34), 0 0 20px rgba(244,240,232,.16);
}

.agent-portfolio .nrs-signal-node:hover::before,
.agent-portfolio .nrs-signal-node:focus-visible::before,
.agent-portfolio .nrs-signal-node.is-active::before {
  transform: scale(1.55);
  box-shadow: 0 0 0 7px rgba(255,107,44,.12), 0 0 25px rgba(255,107,44,.36);
}

.agent-portfolio .nrs-signal-node--signal:hover::before,
.agent-portfolio .nrs-signal-node--signal:focus-visible::before,
.agent-portfolio .nrs-signal-node--signal.is-active::before {
  box-shadow: 0 0 0 8px rgba(244,240,232,.08), 0 0 26px rgba(244,240,232,.22);
}

.agent-portfolio .nrs-signal-node:focus-visible {
  outline: 2px solid var(--nrs-signal-white);
  outline-offset: -5px;
}

.agent-portfolio .nrs-signal-node > span {
  position: absolute;
  left: 50%;
  top: calc(100% - 1px);
  transform: translate(-50%, 4px);
  padding: 4px 6px;
  border: 1px solid rgba(244,240,232,.18);
  background: rgba(8,9,8,.86);
  color: #ddd6cb !important;
  -webkit-text-fill-color: #ddd6cb !important;
  font: 650 9px/1 var(--ap-font-mono);
  letter-spacing: .08em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 140ms cubic-bezier(.2,0,0,1), transform 140ms cubic-bezier(.2,0,0,1);
}

.agent-portfolio .nrs-signal-node:hover > span,
.agent-portfolio .nrs-signal-node:focus-visible > span,
.agent-portfolio .nrs-signal-node.is-active > span {
  opacity: 1;
  transform: translate(-50%, 0);
}

.agent-portfolio .nrs-signal-thesis,
.agent-portfolio .nrs-signal-insight {
  position: absolute;
  z-index: 10;
  padding: .7rem .78rem;
  border: 1px solid rgba(244,240,232,.17);
  background: rgba(8,9,8,.76);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.agent-portfolio .nrs-signal-thesis {
  top: 7%;
  left: 5%;
  width: min(47%, 15rem);
  border-left-color: var(--nrs-signal-orange);
}

.agent-portfolio .nrs-signal-insight {
  top: 7%;
  right: 5%;
  width: min(48%, 16rem);
}

.agent-portfolio .nrs-signal-thesis small,
.agent-portfolio .nrs-signal-insight small {
  display: block;
  margin-bottom: .35rem;
  color: #ff8552 !important;
  -webkit-text-fill-color: #ff8552 !important;
  font: 650 .58rem/1.25 var(--ap-font-mono);
  letter-spacing: .1em;
  text-transform: uppercase;
}

.agent-portfolio .nrs-signal-thesis strong,
.agent-portfolio .nrs-signal-insight strong {
  display: block;
  margin-bottom: .35rem;
  color: #f4f0e8 !important;
  -webkit-text-fill-color: #f4f0e8 !important;
  font: 720 .78rem/1.25 var(--ap-font-display);
  letter-spacing: -.015em;
}

.agent-portfolio .nrs-signal-thesis p,
.agent-portfolio .nrs-signal-insight p {
  margin: 0;
  color: #bdb6ab !important;
  -webkit-text-fill-color: #bdb6ab !important;
  font: 500 .62rem/1.45 var(--ap-font-body);
}

.agent-portfolio .nrs-signal-quote {
  z-index: 9;
  max-width: 16rem;
  color: #f4f0e8 !important;
  -webkit-text-fill-color: #f4f0e8 !important;
}

.agent-portfolio .nrs-signal-quote [data-signal-concept] {
  color: inherit !important;
  -webkit-text-fill-color: currentColor !important;
  transition: color 160ms cubic-bezier(.2,0,0,1), -webkit-text-fill-color 160ms cubic-bezier(.2,0,0,1);
}

.agent-portfolio .nrs-signal-quote [data-signal-concept].is-highlighted {
  color: #ff8552 !important;
  -webkit-text-fill-color: #ff8552 !important;
}

.agent-portfolio .nrs-signal-figure.is-reasoning .nrs-signal-portrait--ghost {
  opacity: .28;
}

.agent-portfolio .nrs-signal-figure.is-signal-mode .agent-three-canvas {
  opacity: .16;
}

.agent-portfolio .nrs-signal-figure.is-signal-mode .nrs-signal-portrait--main {
  opacity: .82;
}

.agent-portfolio .nrs-signal-figure.is-signal-mode .nrs-signal-portrait--ghost {
  opacity: .32;
}

.agent-portfolio .nrs-signal-figure.is-signal-mode .nrs-signal-node:not(.nrs-signal-node--signal):not(.is-active) {
  opacity: .48;
}

@media (max-width: 899px) {
  .agent-portfolio .nrs-signal-figure {
    min-height: 25rem;
  }

  .agent-portfolio .nrs-signal-portrait {
    top: -1%;
    right: -20%;
    width: 118%;
    height: 92%;
    object-position: 55% 32%;
  }

  .agent-portfolio .nrs-signal-portrait--ghost {
    right: 16%;
  }

  .agent-portfolio .nrs-signal-node {
    width: 48px;
    height: 48px;
    min-width: 48px;
    min-height: 48px;
  }

  .agent-portfolio .nrs-signal-node > span {
    opacity: .72;
  }

  .agent-portfolio .nrs-signal-insight {
    top: auto;
    right: 5%;
    bottom: 22%;
    width: 70%;
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

console.log('[signal-portrait-v12] Final interactive portrait layer applied to homepage.');
