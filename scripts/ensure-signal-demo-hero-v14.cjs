const fs = require('node:fs');
const path = require('node:path');
const { verifySource } = require('./verify-signal-demo-source-v14.cjs');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const posterPath = path.join(base, 'assets', 'images', 'signal-demo-poster-exact.webp');

if (!fs.existsSync(homePath)) throw new Error(`[signal-demo-v14] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-demo-v14] Missing ${stylePath}`);

const verified = verifySource();
fs.mkdirSync(path.dirname(posterPath), { recursive: true });
fs.writeFileSync(posterPath, verified.poster);

const stageMarkup = `<div class="agent-system-figure nrs-demo-stage" id="nrs-demo-stage" data-signal-demo-v14 aria-label="Interactive Signal over Noise portrait composition">
  <div class="nrs-demo-poster" id="nrs-demo-poster" aria-hidden="true"></div>
  <div class="nrs-demo-reasoning" id="nrs-demo-reasoning" aria-hidden="true"></div>
  <div class="nrs-demo-noise-wash" aria-hidden="true"></div>
  <svg class="nrs-demo-orbit-svg" viewBox="0 0 100 100" aria-hidden="true">
    <ellipse class="nrs-demo-orbit-path nrs-demo-orbit-main" id="nrs-demo-orbit-main" pathLength="1" cx="58" cy="47" rx="35" ry="29" transform="rotate(-9 58 47)"></ellipse>
    <ellipse class="nrs-demo-orbit-path" pathLength="1" cx="55" cy="49" rx="31" ry="34" transform="rotate(31 55 49)"></ellipse>
    <line class="nrs-demo-connector" id="nrs-demo-connector" x1="12" y1="52" x2="12" y2="52"></line>
    <circle class="nrs-demo-signal-halo" id="nrs-demo-signal-halo" cx="12" cy="52" r="2.4"></circle>
  </svg>
  <div class="nrs-demo-node-layer">
    <button class="nrs-demo-node nrs-demo-signal" id="nrs-demo-signal-node" type="button" data-x="12" data-y="52" style="left:12%;top:52%" aria-label="Activate Signal Mode" aria-pressed="false"><span class="nrs-demo-node-label">Signal</span></button>
    <button class="nrs-demo-node nrs-demo-state-node" type="button" data-state="intent" data-x="25" data-y="63" style="left:25%;top:63%" aria-label="Explore intent" aria-pressed="false"><span class="nrs-demo-node-label">Intent</span></button>
    <button class="nrs-demo-node nrs-demo-state-node" type="button" data-state="logic" data-x="83" data-y="28" style="left:83%;top:28%" aria-label="Explore product logic" aria-pressed="false"><span class="nrs-demo-node-label">Logic</span></button>
    <button class="nrs-demo-node nrs-demo-state-node" type="button" data-state="state" data-x="89" data-y="58" style="left:89%;top:58%" aria-label="Explore important state" aria-pressed="false"><span class="nrs-demo-node-label">State</span></button>
    <button class="nrs-demo-node nrs-demo-state-node" type="button" data-state="decision" data-x="62" data-y="69" style="left:62%;top:69%" aria-label="Explore decision" aria-pressed="false"><span class="nrs-demo-node-label">Decision</span></button>
  </div>
  <div class="nrs-demo-hidden-thesis" id="nrs-demo-thesis" aria-hidden="true"><small>hidden design thesis</small><b>Signal over noise</b><p>The white point is the useful truth. Every orbit, state and decision exists to make that signal easier to act on.</p></div>
  <div class="nrs-demo-insight"><div class="nrs-demo-insight-card" id="nrs-demo-insight-card" aria-hidden="true"><small id="nrs-demo-insight-kicker">Product state</small><strong id="nrs-demo-insight-title">Explore a node</strong><p id="nrs-demo-insight-copy">The orange nodes encode the reasoning model behind the visual system.</p></div></div>
</div>
<div class="nrs-demo-legend" data-signal-demo-legend aria-label="Signal over Noise visual legend">
  <div><b>orange nodes</b><br>product states</div>
  <div><b>white node</b><br>signal / user truth</div>
  <div><b>orbit</b><br>feedback + decision loop</div>
  <div><b>ghost portrait</b><br>reasoning beneath execution</div>
</div>
<p class="nrs-demo-hint">Desktop: move the pointer for subtle depth. Mobile: tap nodes. Press Escape to reset the current state.</p>`;

let html = fs.readFileSync(homePath, 'utf8');
html = html.replace(/<div class="nrs-demo-legend"[\s\S]*?<p class="nrs-demo-hint">[\s\S]*?<\/p>\s*/gi, '');

const existingFigure = /<div class="agent-system-figure(?: [^"]*)?"[^>]*>[\s\S]*?<\/div>(?=\s*<div class="agent-hero-foot">)/i;
if (!existingFigure.test(html)) {
  throw new Error('[signal-demo-v14] Homepage hero figure boundary not found. Refusing to guess.');
}
html = html.replace(existingFigure, stageMarkup);

const oldRuntime = /<!-- nrs-signal-demo-v14-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v14-runtime:end -->/g;
html = html.replace(oldRuntime, '');

const runtime = `<!-- nrs-signal-demo-v14-runtime:start -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"><\/script>
<script>
(() => {
  const stage = document.querySelector('[data-signal-demo-v14]');
  if (!stage || stage.dataset.runtimeReady === 'true') return;
  stage.dataset.runtimeReady = 'true';

  const poster = stage.querySelector('#nrs-demo-poster');
  const reasoning = stage.querySelector('#nrs-demo-reasoning');
  const stateNodes = [...stage.querySelectorAll('.nrs-demo-state-node')];
  const signalNode = stage.querySelector('#nrs-demo-signal-node');
  const connector = stage.querySelector('#nrs-demo-connector');
  const signalHalo = stage.querySelector('#nrs-demo-signal-halo');
  const orbitMain = stage.querySelector('#nrs-demo-orbit-main');
  const orbitSvg = stage.querySelector('.nrs-demo-orbit-svg');
  const insightCard = stage.querySelector('#nrs-demo-insight-card');
  const insightKicker = stage.querySelector('#nrs-demo-insight-kicker');
  const insightTitle = stage.querySelector('#nrs-demo-insight-title');
  const insightCopy = stage.querySelector('#nrs-demo-insight-copy');
  const thesis = stage.querySelector('#nrs-demo-thesis');

  const meanings = {
    intent: ['Intent', 'What is the person actually trying to accomplish?', 'The system begins with user intent, not interface decoration.'],
    logic: ['Product logic', 'What rules decide what can happen next?', 'The orbit behaves like a rule system: inputs enter, constraints shape them, decisions leave.'],
    state: ['Important state', 'What does the system need to expose right now?', 'This node deliberately brightens the reasoning layer, because good state is usually discovered before it is displayed.'],
    decision: ['Decision', 'What information makes the next action obvious?', 'The end of the loop is not more data. It is a clearer next move.']
  };

  let activeState = null;
  let signalMode = false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!window.gsap;
  const duration = (seconds) => reduced ? 0.001 : seconds;

  function fallbackTo(target, vars) {
    if (!target) return;
    if (vars.opacity !== undefined) target.style.opacity = String(vars.opacity);
    if (vars.transform !== undefined) target.style.transform = vars.transform;
    if (vars.filter !== undefined) target.style.filter = vars.filter;
  }

  function entrance() {
    activeState = null;
    stateNodes.forEach((node) => node.classList.remove('active'));
    if (hasGSAP) {
      gsap.killTweensOf([poster, reasoning, ...stateNodes, ...stage.querySelectorAll('.nrs-demo-orbit-path'), insightCard, thesis]);
      gsap.set([insightCard, thesis], { autoAlpha: 0 });
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(poster, { autoAlpha: 0, scale: 1.018 }, { autoAlpha: 1, scale: 1.002, duration: duration(.7) })
        .fromTo(stage.querySelectorAll('.nrs-demo-orbit-path'), { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 }, { strokeDashoffset: 0, autoAlpha: 1, duration: duration(.62) }, '<.08')
        .fromTo(stateNodes, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: duration(.3), stagger: reduced ? 0 : .045 }, '-=.2');
    } else {
      fallbackTo(poster, { opacity: 1 });
      stateNodes.forEach((node) => fallbackTo(node, { opacity: 1 }));
    }
  }

  function showInsight(state) {
    const meaning = meanings[state];
    if (!meaning) return;
    insightKicker.textContent = meaning[0];
    insightTitle.textContent = meaning[1];
    insightCopy.textContent = meaning[2];
    insightCard.setAttribute('aria-hidden', 'false');
    if (hasGSAP) gsap.fromTo(insightCard, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: duration(.26), ease: 'power3.out', overwrite: 'auto' });
    else fallbackTo(insightCard, { opacity: 1, transform: 'translateY(0)' });
  }

  function connect(node) {
    connector.setAttribute('x2', node.dataset.x);
    connector.setAttribute('y2', node.dataset.y);
    if (hasGSAP) gsap.fromTo(connector, { autoAlpha: 0, strokeDashoffset: 4 }, { autoAlpha: 1, strokeDashoffset: 0, duration: duration(.24), ease: 'power3.out', overwrite: 'auto' });
    else connector.style.opacity = '1';
  }

  function activateState(node) {
    const state = node.dataset.state;
    activeState = state;
    stateNodes.forEach((item) => {
      const active = item === node;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (hasGSAP) {
      gsap.to(stateNodes, { autoAlpha: .4, scale: .92, duration: duration(.22), ease: 'power2.out', overwrite: 'auto' });
      gsap.to(node, { autoAlpha: 1, scale: 1.34, duration: duration(.2), ease: 'power3.out', overwrite: 'auto' });
      gsap.to(reasoning, { autoAlpha: (state === 'logic' || state === 'state') ? .34 : .18, x: (state === 'logic' || state === 'state') ? -8 : 0, duration: duration(.42), ease: 'power3.out', overwrite: 'auto' });
      gsap.to(orbitMain, { stroke: 'rgba(255,132,70,.98)', duration: duration(.22), overwrite: 'auto' });
    } else reasoning.style.opacity = (state === 'logic' || state === 'state') ? '.34' : '.18';
    connect(node);
    showInsight(state);
  }

  function resetState() {
    activeState = null;
    stateNodes.forEach((node) => {
      node.classList.remove('active');
      node.setAttribute('aria-pressed', 'false');
    });
    insightCard.setAttribute('aria-hidden', 'true');
    if (hasGSAP) {
      gsap.to(stateNodes, { autoAlpha: 1, scale: 1, duration: duration(.2), ease: 'power2.out', overwrite: 'auto' });
      gsap.to(connector, { autoAlpha: 0, duration: duration(.14), overwrite: 'auto' });
      if (!signalMode) gsap.to(reasoning, { autoAlpha: 0, x: 12, duration: duration(.3), overwrite: 'auto' });
      gsap.to(insightCard, { autoAlpha: 0, y: 8, duration: duration(.16), overwrite: 'auto' });
      gsap.to(orbitMain, { stroke: 'rgba(239,106,44,.78)', duration: duration(.2), overwrite: 'auto' });
    } else {
      connector.style.opacity = '0';
      insightCard.style.opacity = '0';
    }
  }

  function setSignal(on) {
    signalMode = on;
    stage.classList.toggle('signal-mode', on);
    signalNode.classList.toggle('active', on);
    signalNode.setAttribute('aria-pressed', on ? 'true' : 'false');
    thesis.setAttribute('aria-hidden', on ? 'false' : 'true');
    if (hasGSAP) {
      gsap.to(poster, { filter: on ? 'brightness(.62) saturate(.62)' : 'brightness(1) saturate(1)', duration: duration(.35), ease: 'power2.out', overwrite: 'auto' });
      gsap.to(stateNodes, { autoAlpha: on ? .78 : 1, duration: duration(.3), overwrite: 'auto' });
      gsap.to(orbitMain, { stroke: on ? 'rgba(255,132,70,1)' : 'rgba(239,106,44,.78)', strokeWidth: on ? .28 : .18, duration: duration(.35), overwrite: 'auto' });
      gsap.to(signalHalo, { autoAlpha: on ? 1 : 0, attr: { r: on ? 4.2 : 2.4 }, duration: duration(.35), ease: 'power3.out', overwrite: 'auto' });
      gsap.to(reasoning, { autoAlpha: on ? .38 : 0, x: on ? -4 : 12, duration: duration(.45), ease: 'power3.out', overwrite: 'auto' });
      if (on) gsap.fromTo(thesis, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: duration(.48), ease: 'power3.out', overwrite: 'auto' });
      else gsap.to(thesis, { y: 10, autoAlpha: 0, duration: duration(.2), overwrite: 'auto' });
    } else {
      thesis.style.opacity = on ? '1' : '0';
      reasoning.style.opacity = on ? '.38' : '0';
    }
  }

  stateNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) activateState(node); });
    node.addEventListener('mouseleave', () => { if (matchMedia('(hover:hover)').matches && !signalMode) resetState(); });
    node.addEventListener('click', () => activateState(node));
  });
  signalNode.addEventListener('click', () => setSignal(!signalMode));

  let posterX, posterY, reasonX, reasonY, orbitX, orbitY;
  if (hasGSAP) {
    posterX = gsap.quickTo(poster, 'x', { duration: .35, ease: 'power3.out' });
    posterY = gsap.quickTo(poster, 'y', { duration: .35, ease: 'power3.out' });
    reasonX = gsap.quickTo(reasoning, 'x', { duration: .45, ease: 'power3.out' });
    reasonY = gsap.quickTo(reasoning, 'y', { duration: .45, ease: 'power3.out' });
    orbitX = gsap.quickTo(orbitSvg, 'x', { duration: .4, ease: 'power3.out' });
    orbitY = gsap.quickTo(orbitSvg, 'y', { duration: .4, ease: 'power3.out' });
  }

  stage.addEventListener('pointermove', (event) => {
    if (reduced || event.pointerType === 'touch' || !matchMedia('(hover:hover)').matches || !hasGSAP) return;
    const rect = stage.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - .5) * 2;
    posterX(nx * 2); posterY(ny * 2); reasonX(12 + nx * -7); reasonY(ny * -5); orbitX(nx * 5); orbitY(ny * 4);
  });

  stage.addEventListener('pointerleave', () => {
    if (!hasGSAP) return;
    posterX(0); posterY(0); reasonX(signalMode ? -4 : 12); reasonY(0); orbitX(0); orbitY(0);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setSignal(false);
      resetState();
    }
  });

  entrance();
})();
<\/script>
<!-- nrs-signal-demo-v14-runtime:end -->`;

if (!html.includes('</body>')) throw new Error('[signal-demo-v14] Missing closing body tag.');
html = html.replace('</body>', `${runtime}\n</body>`);
fs.writeFileSync(homePath, html, 'utf8');

let style = fs.readFileSync(stylePath, 'utf8');
style = style
  .replace(/\/\* nrs-signal-portrait-v12:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v12:end \*\//g, '')
  .replace(/\/\* nrs-signal-portrait-v13-stage-inset:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-stage-inset:end \*\//g, '')
  .replace(/\/\* nrs-signal-demo-v14:start \*\/[\s\S]*?\/\* nrs-signal-demo-v14:end \*\//g, '');

const css = `/* nrs-signal-demo-v14:start */
.agent-portfolio .nrs-demo-stage {
  --nrs-demo-orange: #ef6a2c;
  --nrs-demo-orange-2: #ff8a4c;
  --nrs-demo-white: #e9e6df;
  --nrs-demo-ease: cubic-bezier(.2,0,0,1);
  position: relative;
  width: 100%;
  max-width: 31rem;
  min-height: 0 !important;
  margin-inline-start: auto;
  aspect-ratio: 4 / 5 !important;
  border: 1px solid rgba(255,255,255,.13);
  background: #080808;
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 40px 100px rgba(0,0,0,.45);
  color: #f2f0ea;
}
.agent-portfolio .nrs-demo-stage::before,
.agent-portfolio .nrs-demo-stage::after { content: none !important; display: none !important; }
.agent-portfolio .nrs-demo-stage .agent-three-canvas { display: none !important; }
.agent-portfolio .nrs-demo-poster,
.agent-portfolio .nrs-demo-reasoning {
  position: absolute;
  inset: 0;
  background-image: url('/assets/images/signal-demo-poster-exact.webp');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  will-change: transform, filter, opacity;
  pointer-events: none;
}
.agent-portfolio .nrs-demo-poster { z-index: 1; transform: scale(1.002); }
.agent-portfolio .nrs-demo-reasoning {
  z-index: 2;
  opacity: 0;
  clip-path: ellipse(35% 39% at 34% 45%);
  filter: grayscale(1) contrast(1.25) brightness(.82);
  mix-blend-mode: screen;
  transform: translateX(12px) scale(1.015);
}
.agent-portfolio .nrs-demo-noise-wash {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(circle at 14% 52%, transparent 0 3%, rgba(0,0,0,0) 28%), linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,.08));
  opacity: 0;
  transition: opacity .35s var(--nrs-demo-ease);
}
.agent-portfolio .nrs-demo-orbit-svg {
  position: absolute;
  inset: 0;
  z-index: 4;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(239,106,44,.08));
}
.agent-portfolio .nrs-demo-orbit-path { fill: none; stroke: rgba(239,106,44,.58); stroke-width: .23; stroke-linecap: round; stroke-dasharray: 1.7 1.2; vector-effect: non-scaling-stroke; }
.agent-portfolio .nrs-demo-orbit-main { stroke: rgba(239,106,44,.78); stroke-dasharray: none; stroke-width: .18; }
.agent-portfolio .nrs-demo-connector { stroke: rgba(233,230,223,.72); stroke-width: .16; stroke-dasharray: 1.2 .8; opacity: 0; vector-effect: non-scaling-stroke; }
.agent-portfolio .nrs-demo-signal-halo { fill: none; stroke: rgba(233,230,223,.42); stroke-width: .15; opacity: 0; vector-effect: non-scaling-stroke; }
.agent-portfolio .nrs-demo-node-layer { position: absolute; inset: 0; z-index: 6; }
.agent-portfolio .nrs-demo-node {
  position: absolute;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  margin: -22px 0 0 -22px;
  border: 0;
  background: transparent !important;
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 0;
  touch-action: manipulation;
  color: var(--nrs-demo-white) !important;
  -webkit-text-fill-color: var(--nrs-demo-white) !important;
}
.agent-portfolio .nrs-demo-node::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--nrs-demo-orange); box-shadow: 0 0 0 1px rgba(255,160,105,.42), 0 0 18px rgba(239,106,44,.18); transition: box-shadow .18s var(--nrs-demo-ease), background .18s var(--nrs-demo-ease); }
.agent-portfolio .nrs-demo-node::after { content: ''; position: absolute; inset: 10px; border: 1px solid transparent; border-radius: 50%; transition: border-color .18s var(--nrs-demo-ease); }
.agent-portfolio .nrs-demo-node:hover::after,
.agent-portfolio .nrs-demo-node:focus-visible::after { border-color: rgba(239,106,44,.42); }
.agent-portfolio .nrs-demo-node:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.agent-portfolio .nrs-demo-signal::before { width: 10px; height: 10px; background: var(--nrs-demo-white); box-shadow: 0 0 0 1px rgba(255,255,255,.35), 0 0 20px rgba(255,255,255,.18); }
.agent-portfolio .nrs-demo-node.active::before { background: var(--nrs-demo-orange-2); box-shadow: 0 0 0 3px rgba(239,106,44,.14), 0 0 24px rgba(239,106,44,.48); }
.agent-portfolio .nrs-demo-signal.active::before { background: #fff; box-shadow: 0 0 0 5px rgba(255,255,255,.08), 0 0 26px rgba(255,255,255,.38); }
.agent-portfolio .nrs-demo-node-label {
  position: absolute;
  left: 50%;
  top: calc(100% - 1px);
  transform: translateX(-50%) translateY(4px);
  padding: 5px 7px;
  border: 1px solid rgba(255,255,255,.12);
  background: rgba(8,8,8,.88);
  color: #ddd7cd !important;
  -webkit-text-fill-color: #ddd7cd !important;
  border-radius: 6px;
  font: 9px/1 var(--ap-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  letter-spacing: .07em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
}
.agent-portfolio .nrs-demo-node.active .nrs-demo-node-label,
.agent-portfolio .nrs-demo-node:hover .nrs-demo-node-label,
.agent-portfolio .nrs-demo-node:focus-visible .nrs-demo-node-label { opacity: 1; }
.agent-portfolio .nrs-demo-insight { position: absolute; z-index: 8; left: 4.5%; right: 4.5%; bottom: 3.6%; min-height: 82px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; pointer-events: none; }
.agent-portfolio .nrs-demo-insight-card { max-width: 68%; padding: 10px 12px; border-left: 2px solid var(--nrs-demo-orange); background: linear-gradient(90deg, rgba(8,8,8,.9), rgba(8,8,8,.55), transparent); opacity: 0; transform: translateY(8px); }
.agent-portfolio .nrs-demo-insight-card small,
.agent-portfolio .nrs-demo-hidden-thesis small { display: block; color: var(--nrs-demo-orange-2) !important; -webkit-text-fill-color: var(--nrs-demo-orange-2) !important; font: 9px/1.25 var(--ap-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); letter-spacing: .13em; text-transform: uppercase; margin-bottom: 5px; }
.agent-portfolio .nrs-demo-insight-card strong { display: block; color: #f2f0ea !important; -webkit-text-fill-color: #f2f0ea !important; font-size: 14px; line-height: 1.25; letter-spacing: -.02em; }
.agent-portfolio .nrs-demo-insight-card p { margin: 5px 0 0; color: #c5c0b8 !important; -webkit-text-fill-color: #c5c0b8 !important; font-size: 11px; line-height: 1.45; }
.agent-portfolio .nrs-demo-hidden-thesis { position: absolute; z-index: 9; right: 5%; top: 6%; max-width: 44%; padding: 10px 12px; border: 1px solid rgba(255,255,255,.12); background: rgba(8,8,8,.86); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); opacity: 0; visibility: hidden; transform: translateY(10px); pointer-events: none; }
.agent-portfolio .nrs-demo-hidden-thesis b { display: block; color: #f2f0ea !important; -webkit-text-fill-color: #f2f0ea !important; font-size: 15px; letter-spacing: .06em; text-transform: uppercase; }
.agent-portfolio .nrs-demo-hidden-thesis p { margin: 5px 0 0; color: #b8b2aa !important; -webkit-text-fill-color: #b8b2aa !important; font-size: 10px; line-height: 1.5; }
.agent-portfolio .nrs-demo-stage.signal-mode .nrs-demo-noise-wash { opacity: .55; }
.agent-portfolio .nrs-demo-stage ~ .agent-hero-foot { display: none !important; }
.agent-portfolio .nrs-demo-legend,
.agent-portfolio .nrs-demo-hint { width: 100%; max-width: 31rem; margin-inline-start: auto; }
.agent-portfolio .nrs-demo-legend { margin-top: 16px; display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 8px; }
.agent-portfolio .nrs-demo-legend div { padding: 10px 11px; border-top: 1px solid rgba(255,255,255,.12); font: 10px/1.45 var(--ap-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace); color: #9f9a92 !important; -webkit-text-fill-color: #9f9a92 !important; }
.agent-portfolio .nrs-demo-legend b { color: #ddd7cf !important; -webkit-text-fill-color: #ddd7cf !important; font-weight: 600; }
.agent-portfolio .nrs-demo-hint { margin-top: 14px; margin-bottom: 0; color: #8e8982 !important; -webkit-text-fill-color: #8e8982 !important; font-size: 12px; line-height: 1.6; text-align: center; }
@media (max-width: 899px) {
  .agent-portfolio .nrs-demo-stage,
  .agent-portfolio .nrs-demo-legend,
  .agent-portfolio .nrs-demo-hint { width: min(calc(100% - 32px), 29rem); max-width: 29rem; margin-inline: auto; }
  .agent-portfolio .nrs-demo-legend { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .agent-portfolio .nrs-demo-insight-card { max-width: 82%; }
  .agent-portfolio .nrs-demo-hidden-thesis { max-width: 58%; right: 4%; top: 4%; }
  .agent-portfolio .nrs-demo-node { width: 48px; height: 48px; min-width: 48px; min-height: 48px; margin: -24px 0 0 -24px; }
}
@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .nrs-demo-stage *,
  .agent-portfolio .nrs-demo-stage *::before,
  .agent-portfolio .nrs-demo-stage *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
/* nrs-signal-demo-v14:end */`;

style = `${style.trim()}\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const result = fs.readFileSync(homePath, 'utf8');
for (const token of ['data-signal-demo-v14', 'nrs-demo-poster-exact.webp', 'nrs-demo-signal-node', 'nrs-demo-state-node', 'nrs-signal-demo-v14-runtime:start']) {
  if (!result.includes(token)) throw new Error(`[signal-demo-v14] Missing finalized homepage token: ${token}`);
}

console.log(`[signal-demo-v14] Uploaded demo stage installed in homepage hero using verified ${verified.width}x${verified.height} source.`);
