const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath)) throw new Error(`[signal-reference] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-reference] Missing ${stylePath}`);

const html = fs.readFileSync(homePath, 'utf8');
for (const token of ['id="signalStage"', 'id="signalPoster"', 'id="signalReasoning"', 'class="orbit-svg"']) {
  if (!html.includes(token)) throw new Error(`[signal-reference] Required Signal hero token missing: ${token}`);
}

const start = '/* nrs-signal-reference-v2:start */';
const end = '/* nrs-signal-reference-v2:end */';
const marker = /\/\* nrs-signal-reference-v\d+:start \*\/[\s\S]*?\/\* nrs-signal-reference-v\d+:end \*\//g;

const css = `${start}
/* Final visual contract: match the approved dark/light reference instead of rendering a poster card. */
.agent-portfolio .nrs-signal-exact,
.agent-portfolio .nrs-signal-exact .stage,
.agent-portfolio .agent-hero-side {
  background: transparent !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
}
.agent-portfolio .nrs-signal-exact,
.agent-portfolio .nrs-signal-exact .stage {
  overflow: visible !important;
}
.agent-portfolio .nrs-signal-exact .stage {
  isolation: isolate !important;
}

/* Retire the experimental light-theme SVG. The live GSAP layers themselves now carry the portrait. */
.agent-portfolio .nrs-light-portrait,
.agent-portfolio .nrs-light-poster-copy {
  display: none !important;
}

/* Use the clean portrait asset for the animated foreground and ghost layers. */
.agent-portfolio .nrs-signal-exact .poster,
.agent-portfolio .nrs-signal-exact .reasoning {
  display: block !important;
  inset: -8% -9% -7% -7% !important;
  background-image: url('/assets/images/portrait.png') !important;
  background-repeat: no-repeat !important;
  background-position: 58% 49% !important;
  background-size: 86% auto !important;
  pointer-events: none !important;
  transform-origin: 58% 48% !important;
  -webkit-mask-image: radial-gradient(ellipse 58% 61% at 59% 47%, #000 0 48%, rgba(0,0,0,.98) 60%, rgba(0,0,0,.78) 73%, rgba(0,0,0,.35) 87%, transparent 100%) !important;
  mask-image: radial-gradient(ellipse 58% 61% at 59% 47%, #000 0 48%, rgba(0,0,0,.98) 60%, rgba(0,0,0,.78) 73%, rgba(0,0,0,.35) 87%, transparent 100%) !important;
}
.agent-portfolio .nrs-signal-exact .reasoning {
  background-position: 48% 48% !important;
  background-size: 84% auto !important;
  clip-path: none !important;
}

/* Technical grid dissolves into the page instead of defining a rectangular panel. */
.agent-portfolio .nrs-signal-exact .stage::before {
  content: '' !important;
  position: absolute !important;
  inset: 7% 4% 8% 1% !important;
  z-index: 0 !important;
  pointer-events: none !important;
  background-image:
    linear-gradient(rgba(239,106,44,.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(239,106,44,.055) 1px, transparent 1px) !important;
  background-size: 7.25% 5.8% !important;
  opacity: .46 !important;
  -webkit-mask-image: radial-gradient(ellipse 66% 63% at 57% 46%, #000 0 44%, rgba(0,0,0,.8) 66%, transparent 100%) !important;
  mask-image: radial-gradient(ellipse 66% 63% at 57% 46%, #000 0 44%, rgba(0,0,0,.8) 66%, transparent 100%) !important;
}
.agent-portfolio .nrs-signal-exact .stage::after {
  content: none !important;
  display: none !important;
}
.agent-portfolio .nrs-signal-exact .orbit-svg,
.agent-portfolio .nrs-signal-exact .node-layer,
.agent-portfolio .nrs-signal-exact .hidden-thesis,
.agent-portfolio .nrs-signal-exact .insight {
  z-index: 5 !important;
}

/* Dark theme: cinematic monochrome portrait that disappears into the black page. */
html[data-theme='dark'] .agent-portfolio .nrs-signal-exact .poster,
html:not([data-theme='light']) .agent-portfolio .nrs-signal-exact .poster {
  opacity: 1 !important;
  filter: grayscale(.82) sepia(.08) brightness(.86) contrast(1.14) !important;
  mix-blend-mode: normal !important;
}
html[data-theme='dark'] .agent-portfolio .nrs-signal-exact .reasoning,
html:not([data-theme='light']) .agent-portfolio .nrs-signal-exact .reasoning {
  opacity: .14;
  filter: grayscale(1) brightness(.63) contrast(1.28) !important;
  mix-blend-mode: screen !important;
}
html[data-theme='dark'] .agent-portfolio .nrs-signal-exact .stage::before,
html:not([data-theme='light']) .agent-portfolio .nrs-signal-exact .stage::before {
  background-image:
    linear-gradient(rgba(239,106,44,.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(239,106,44,.055) 1px, transparent 1px) !important;
}

/* Light theme: normal portrait tones, faint ghost portrait, no negative effect and no black surface. */
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .poster {
  opacity: 1 !important;
  filter: saturate(.9) contrast(1.02) brightness(1.02) !important;
  mix-blend-mode: multiply !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .reasoning {
  opacity: .075;
  filter: grayscale(1) contrast(.92) brightness(1.28) !important;
  mix-blend-mode: multiply !important;
  transform: translate(-5%, -1%) scale(1.025);
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .stage::before {
  background-image:
    linear-gradient(rgba(17,17,15,.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17,17,15,.045) 1px, transparent 1px) !important;
  opacity: .34 !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .orbit-path {
  stroke: rgba(239,106,44,.5) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .orbit-path.main {
  stroke: rgba(239,106,44,.88) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .connector {
  stroke: rgba(17,17,15,.45) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .node.signal {
  background: #f5f1e8 !important;
  border-color: rgba(17,17,15,.26) !important;
  box-shadow: 0 0 0 4px rgba(245,241,232,.74) !important;
}
html[data-theme='light'] .agent-portfolio .nrs-signal-exact .node.state-node {
  border-color: rgba(239,106,44,.8) !important;
  box-shadow: 0 0 0 3px rgba(239,106,44,.07) !important;
}
html[data-theme='light'] .agent-portfolio .agent-hero-foot {
  border-top-color: rgba(17,17,15,.14) !important;
}

/* Match the approved reference scale: the portrait should feel integrated, not like a small card. */
@media (min-width: 901px) {
  .agent-portfolio .nrs-signal-exact .stage {
    transform: scale(1.06);
    transform-origin: center center;
  }
}
@media (max-width: 900px) {
  .agent-portfolio .nrs-signal-exact .poster,
  .agent-portfolio .nrs-signal-exact .reasoning {
    inset: -5% -6% -4% -5% !important;
    background-size: 88% auto !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

console.log('[signal-reference] Applied the approved seamless dark/light hero portrait treatment.');
