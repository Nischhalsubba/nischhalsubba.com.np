const fs = require('node:fs');
const path = require('node:path');
const { verifySource } = require('./verify-signal-demo-source-v14.cjs');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
const posterPath = path.join(base, 'assets', 'images', 'signal-demo-poster-exact.webp');

if (!fs.existsSync(homePath)) throw new Error(`[signal-demo-v15] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-demo-v15] Missing ${stylePath}`);

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
html = html
  .replace(/<!-- nrs-signal-demo-v14-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v14-runtime:end -->/g, '')
  .replace(/<!-- nrs-signal-demo-v15-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v15-runtime:end -->/g, '');

const footIndex = html.indexOf('<div class="agent-hero-foot"');
if (footIndex < 0) throw new Error('[signal-demo-v15] Homepage hero foot boundary not found.');
const figureStart = html.lastIndexOf('<div class="agent-system-figure', footIndex);
if (figureStart < 0) throw new Error('[signal-demo-v15] Homepage hero figure start not found.');
html = `${html.slice(0, figureStart)}${stageMarkup}\n${html.slice(footIndex)}`;

const runtime = `<!-- nrs-signal-demo-v15-runtime:start -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"><\/script>
<script>
(() => {
  const stage = document.querySelector('[data-signal-demo-v14]');
  if (!stage || stage.dataset.runtimeReady === 'true') return;
  stage.dataset.runtimeReady = 'true';

  const poster = stage.querySelector('#nrs-demo-poster');
  const reasoning = stage.querySelector('#nrs-demo-reasoning');
  const signalNode = stage.querySelector('#nrs-demo-signal-node');
  const stateNodes = [...stage.querySelectorAll('.nrs-demo-state-node')];
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

  function fallback(target, values) {
    if (!target) return;
    if (values.opacity !== undefined) target.style.opacity = String(values.opacity);
    if (values.transform !== undefined) target.style.transform = values.transform;
    if (values.filter !== undefined) target.style.filter = values.filter;
  }

  function entrance() {
    activeState = null;
    stateNodes.forEach((node) => node.classList.remove('active'));
    if (hasGSAP) {
      gsap.killTweensOf([poster, reasoning, ...stateNodes, ...stage.querySelectorAll('.nrs-demo-orbit-path'), insightCard, thesis]);
      gsap.set([insightCard, thesis], { autoAlpha: 0 });
      const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      timeline
        .fromTo(poster, { autoAlpha: 0, scale: 1.018 }, { autoAlpha: 1, scale: 1.002, duration: duration(.7) })
        .fromTo(stage.querySelectorAll('.nrs-demo-orbit-path'), { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 }, { strokeDashoffset: 0, autoAlpha: 1, duration: duration(.62) }, '<.08')
        .fromTo(stateNodes, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: duration(.3), stagger: reduced ? 0 : .045 }, '-=.2');
    } else {
      fallback(poster, { opacity: 1 });
      stateNodes.forEach((node) => fallback(node, { opacity: 1 }));
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
    else fallback(insightCard, { opacity: 1, transform: 'translateY(0)' });
  }

  function connect(node) {
    connector.setAttribute('x2', node.dataset.x);
    connector.setAttribute('y2', node.dataset.y);
    if (hasGSAP) gsap.fromTo(connector, { autoAlpha: 0, strokeDashoffset: 4 }, { autoAlpha: 1, strokeDashoffset: 0, duration: duration(