/**
 * @fileoverview scripts/finalize-signal-story-v20.cjs
 * Purpose: Apply the finalize signal story v20 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-story-v20] Missing index.html or style.css.');
}

let html = fs.readFileSync(homePath, 'utf8');
let css = fs.readFileSync(stylePath, 'utf8');

const oldStory = `<span class="nrs-node nrs-node-a" aria-hidden="true"></span>
      <span class="nrs-node nrs-node-b" aria-hidden="true"></span>
      <span class="nrs-node nrs-node-c" aria-hidden="true"></span>
      <div class="nrs-meaning nrs-meaning-understand"><span>01</span><strong>Understand</strong><small>Find the real user problem.</small></div>
      <div class="nrs-meaning nrs-meaning-structure"><span>02</span><strong>Structure</strong><small>Turn logic into states and flows.</small></div>
      <div class="nrs-meaning nrs-meaning-handoff"><span>03</span><strong>Build-ready</strong><small>Make implementation intent explicit.</small></div>
      <p class="nrs-uploaded-thesis">My job is usually the same: find the product logic, expose the important state and make the next decision easier.</p>
      <div class="nrs-uploaded-meta" aria-hidden="true"><span>6+ years</span><span>SaaS · Web3 · Fintech</span><span>Design · Implementation</span></div>`;

const story = `<svg class="nrs-story-thread" viewBox="0 0 100 100" aria-hidden="true">
        <path class="nrs-story-thread-base" pathLength="100" d="M18 61 C25 48 37 31 52 25 C68 19 83 29 84 45 C85 60 74 72 61 77 C45 84 27 76 18 61" />
        <path class="nrs-story-thread-progress" id="nrsStoryProgress" pathLength="100" d="M18 61 C25 48 37 31 52 25 C68 19 83 29 84 45 C85 60 74 72 61 77 C45 84 27 76 18 61" />
      </svg>
      <button class="nrs-story-node nrs-story-intent" type="button" data-story="intent" aria-label="Intent: frame the job before the screen"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">01 / Intent</span></button>
      <button class="nrs-story-node nrs-story-constraint" type="button" data-story="constraint" aria-label="Constraint: model what the system can promise"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">02 / Constraint</span></button>
      <button class="nrs-story-node nrs-story-state" type="button" data-story="state" aria-label="State: expose what changes the choice"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">03 / State</span></button>
      <button class="nrs-story-node nrs-story-affordance" type="button" data-story="affordance" aria-label="Affordance: make the next move obvious"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">04 / Affordance</span></button>
      <button class="nrs-story-node nrs-story-signal" type="button" data-story="signal" aria-label="Signal: the useful truth that survives reduction"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">Signal</span></button>
      <div class="nrs-story-readout" id="nrsStoryReadout" aria-live="polite" aria-hidden="true">
        <div class="nrs-story-readout-head"><span id="nrsStoryStep">01 / DISCOVERY</span><span id="nrsStoryArtifact">JTBD</span></div>
        <strong id="nrsStoryTitle">Frame the job before the screen.</strong>
        <p id="nrsStoryCopy">Separate the desired outcome from the interface the person happens to be using.</p>
        <code id="nrsStoryRule">intent → outcome</code>
      </div>
      <p class="nrs-uploaded-thesis">The interface is the visible consequence of decisions made underneath.</p>
      <div class="nrs-uploaded-meta" aria-hidden="true"><span>Problem framing</span><span>State models</span><span>Interaction logic</span></div>`;

if (html.includes(oldStory)) {
  html = html.replace(oldStory, story);
} else if (!html.includes('id="nrsStoryReadout"')) {
  throw new Error('[hero-story-v20] The v19 visual story anchor was not found.');
}

html = html.replace(/<!-- nrs-hero-story-v20-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v20-runtime:end -->/g, '');
const runtime = `<!-- nrs-hero-story-v20-runtime:start -->
<script>
(() => {
  const root = document.querySelector('.nrs-uploaded-hero-v19 .nrs-uploaded-visual');
  if (!root || root.dataset.storyBound === 'true') return;
  root.dataset.storyBound = 'true';

  const nodes = [...root.querySelectorAll('.nrs-story-node')];
  const readout = root.querySelector('#nrsStoryReadout');
  const step = root.querySelector('#nrsStoryStep');
  const artifact = root.querySelector('#nrsStoryArtifact');
  const title = root.querySelector('#nrsStoryTitle');
  const copy = root.querySelector('#nrsStoryCopy');
  const rule = root.querySelector('#nrsStoryRule');
  const progress = root.querySelector('#nrsStoryProgress');
  let pinned = false;
  let resetTimer = 0;

  const story = {
    intent: {
      step: '01 / DISCOVERY', artifact: 'JTBD',
      title: 'Frame the job before the screen.',
      copy: 'Separate the desired outcome from the interface the person happens to be using.',
      rule: 'intent → outcome', progress: 82
    },
    constraint: {
      step: '02 / SYSTEM', artifact: 'RULE MODEL',
      title: 'Model what the system can actually promise.',
      copy: 'Permissions, dependencies, limits and failure paths define the real interaction space.',
      rule: 'rules → boundaries', progress: 62
    },
    state: {
      step: '03 / HIERARCHY', artifact: 'STATE MODEL',
      title: 'Expose the state that changes the choice.',
      copy: 'Priority follows consequence and immediacy, not the amount of data available.',
      rule: 'state → priority', progress: 40
    },
    affordance: {
      step: '04 / ACTION', artifact: 'AFFORDANCE',
      title: 'Make the next move feel inevitable.',
      copy: 'Clarity is earned when one action becomes easier than every competing interpretation.',
      rule: 'priority → action', progress: 18
    },
    signal: {
      step: 'OUTPUT / SIGNAL', artifact: 'REDUCTION',
      title: 'What survives the reduction is signal.',
      copy: 'The smallest truthful set of information needed for a confident decision.',
      rule: 'noise ↓  /  confidence ↑', progress: 0
    }
  };

  const order = ['intent', 'constraint', 'state', 'affordance', 'signal'];

  function render(key) {
    const item = story[key];
    if (!item) return;
    clearTimeout(resetTimer);
    root.dataset.storyActive = key;
    step.textContent = item.step;
    artifact.textContent = item.artifact;
    title.textContent = item.title;
    copy.textContent = item.copy;
    rule.textContent = item.rule;
    readout.setAttribute('aria-hidden', 'false');
    progress.style.strokeDashoffset = String(item.progress);
    const activeIndex = order.indexOf(key);
    nodes.forEach((node) => {
      const index = order.indexOf(node.dataset.story);
      node.classList.toggle('is-active', index === activeIndex);
      node.classList.toggle('is-complete', index < activeIndex);
      node.classList.toggle('is-future', index > activeIndex);
    });
    if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.gsap.fromTo(readout, {y: 8, autoAlpha: 0}, {y: 0, autoAlpha: 1, duration: .24, ease: 'power3.out', overwrite: 'auto'});
    }
  }

  function reset() {
    if (pinned) return;
    root.removeAttribute('data-story-active');
    readout.setAttribute('aria-hidden', 'true');
    progress.style.strokeDashoffset = '100';
    nodes.forEach((node) => node.classList.remove('is-active', 'is-complete', 'is-future'));
  }

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => render(node.dataset.story));
    node.addEventListener('focus', () => render(node.dataset.story));
    node.addEventListener('mouseleave', () => {
      if (!pinned) resetTimer = window.setTimeout(reset, 140);
    });
    node.addEventListener('blur', () => {
      if (!pinned) resetTimer = window.setTimeout(reset, 140);
    });
    node.addEventListener('click', (event) => {
      event.preventDefault();
      const same = pinned && root.dataset.storyActive === node.dataset.story;
      pinned = !same;
      root.dataset.storyPinned = pinned ? 'true' : 'false';
      if (same) reset(); else render(node.dataset.story);
    });
  });

  readout.addEventListener('mouseenter', () => clearTimeout(resetTimer));
  readout.addEventListener('mouseleave', () => {
    if (!pinned) resetTimer = window.setTimeout(reset, 140);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      pinned = false;
      root.dataset.storyPinned = 'false';
      reset();
    }
  });
  reset();
})();
</script>
<!-- nrs-hero-story-v20-runtime:end -->`;

html = html.replace('</body>', `${runtime}\n</body>`);

const cssMarker = /\/\* nrs-hero-story-v20:start \*\/[\s\S]*?\/\* nrs-hero-story-v20:end \*\//g;
css = css.replace(cssMarker, '').trimEnd();
css += `

/* nrs-hero-story-v20:start */
.nrs-uploaded-hero-v19 .nrs-story-thread{position:absolute!important;inset:5% 0 7% 0!important;z-index:4!important;width:100%!important;height:100%!important;overflow:visible!important;pointer-events:none!important}
.nrs-uploaded-hero-v19 .nrs-story-thread path{fill:none!important;vector-effect:non-scaling-stroke!important}.nrs-uploaded-hero-v19 .nrs-story-thread-base{stroke:color-mix(in srgb,var(--nrs-u-ink) 13%,transparent)!important;stroke-width:1!important;stroke-dasharray:2 6!important}.nrs-uploaded-hero-v19 .nrs-story-thread-progress{stroke:var(--nrs-u-orange)!important;stroke-width:1.5!important;stroke-dasharray:100!important;stroke-dashoffset:100;transition:stroke-dashoffset .42s cubic-bezier(.2,0,0,1)!important;filter:drop-shadow(0 0 6px color-mix(in srgb,var(--nrs-u-orange) 46%,transparent))!important}
.nrs-uploaded-hero-v19 .nrs-story-node{position:absolute!important;z-index:8!important;width:16px!important;height:16px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:var(--nrs-u-ink)!important;cursor:pointer!important;appearance:none!important;outline:none!important;transform:translate(-50%,-50%)!important}.nrs-uploaded-hero-v19 .nrs-story-dot{position:absolute!important;inset:4px!important;border-radius:50%!important;background:var(--nrs-u-orange)!important;box-shadow:0 0 0 5px color-mix(in srgb,var(--nrs-u-orange) 10%,transparent),0 0 18px color-mix(in srgb,var(--nrs-u-orange) 35%,transparent)!important;transition:transform .18s cubic-bezier(.2,0,0,1),background .18s ease,box-shadow .18s ease!important}.nrs-uploaded-hero-v19 .nrs-story-node:hover .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-node:focus-visible .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-node.is-active .nrs-story-dot{transform:scale(1.75)!important;box-shadow:0 0 0 7px color-mix(in srgb,var(--nrs-u-orange) 13%,transparent),0 0 28px color-mix(in srgb,var(--nrs-u-orange) 55%,transparent)!important}.nrs-uploaded-hero-v19 .nrs-story-node.is-future{opacity:.4!important}.nrs-uploaded-hero-v19 .nrs-story-node.is-complete .nrs-story-dot{box-shadow:0 0 0 4px color-mix(in srgb,var(--nrs-u-orange) 8%,transparent)!important}
.nrs-uploaded-hero-v19 .nrs-story-node-label{position:absolute!important;left:18px!important;top:50%!important;transform:translateY(-50%) translateX(-4px)!important;width:max-content!important;padding:5px 7px!important;border:1px solid var(--nrs-u-line)!important;background:color-mix(in srgb,var(--nrs-u-page) 88%,transparent)!important;backdrop-filter:blur(9px)!important;color:var(--nrs-u-soft)!important;font:700 8px/1 var(--nrs-u-mono)!important;letter-spacing:.06em!important;text-transform:uppercase!important;opacity:0!important;pointer-events:none!important;transition:opacity .14s ease,transform .18s cubic-bezier(.2,0,0,1)!important}.nrs-uploaded-hero-v19 .nrs-story-node:hover .nrs-story-node-label,.nrs-uploaded-hero-v19 .nrs-story-node:focus-visible .nrs-story-node-label,.nrs-uploaded-hero-v19 .nrs-story-node.is-active .nrs-story-node-label{opacity:1!important;transform:translateY(-50%) translateX(0)!important}
.nrs-uploaded-hero-v19 .nrs-story-intent{left:18%!important;top:61%!important}.nrs-uploaded-hero-v19 .nrs-story-constraint{left:53%!important;top:24%!important}.nrs-uploaded-hero-v19 .nrs-story-state{left:84%!important;top:45%!important}.nrs-uploaded-hero-v19 .nrs-story-affordance{left:61%!important;top:78%!important}.nrs-uploaded-hero-v19 .nrs-story-signal{left:14%!important;top:39%!important}.nrs-uploaded-hero-v19 .nrs-story-signal .nrs-story-dot{background:var(--nrs-u-ink)!important;box-shadow:0 0 0 5px color-mix(in srgb,var(--nrs-u-ink) 10%,transparent),0 0 20px color-mix(in srgb,var(--nrs-u-ink) 35%,transparent)!important}.nrs-uploaded-hero-v19[data-story-active="signal"] .nrs-story-signal .nrs-story-dot{box-shadow:0 0 0 8px color-mix(in srgb,var(--nrs-u-ink) 13%,transparent),0 0 34px color-mix(in srgb,var(--nrs-u-ink) 55%,transparent)!important}
.nrs-uploaded-hero-v19 .nrs-story-readout{position:absolute!important;z-index:10!important;right:-3%!important;bottom:3%!important;width:min(255px,46%)!important;padding:13px 14px 12px!important;border:1px solid var(--nrs-u-line)!important;background:color-mix(in srgb,var(--nrs-u-page) 89%,transparent)!important;backdrop-filter:blur(16px)!important;box-shadow:0 18px 50px rgba(0,0,0,.14)!important;opacity:1!important;transform:translateY(0)!important;transition:opacity .16s ease,transform .22s cubic-bezier(.2,0,0,1)!important}.nrs-uploaded-hero-v19 .nrs-story-readout[aria-hidden="true"]{opacity:0!important;transform:translateY(8px)!important;pointer-events:none!important}.nrs-uploaded-hero-v19 .nrs-story-readout-head{display:flex!important;justify-content:space-between!important;gap:12px!important;margin-bottom:9px!important;color:var(--nrs-u-orange)!important;font:700 7px/1 var(--nrs-u-mono)!important;letter-spacing:.08em!important;text-transform:uppercase!important}.nrs-uploaded-hero-v19 .nrs-story-readout strong{display:block!important;margin:0 0 7px!important;color:var(--nrs-u-ink)!important;font:750 12px/1.28 var(--nrs-u-sans)!important;letter-spacing:-.01em!important}.nrs-uploaded-hero-v19 .nrs-story-readout p{margin:0 0 9px!important;color:var(--nrs-u-soft)!important;font:500 9px/1.5 var(--nrs-u-sans)!important}.nrs-uploaded-hero-v19 .nrs-story-readout code{display:block!important;padding-top:8px!important;border-top:1px solid var(--nrs-u-line)!important;color:var(--nrs-u-soft)!important;font:700 8px/1.2 var(--nrs-u-mono)!important;letter-spacing:.04em!important;text-transform:uppercase!important}
.nrs-uploaded-hero-v19[data-story-active="constraint"] .nrs-original-portrait-ghost,.nrs-uploaded-hero-v19[data-story-active="state"] .nrs-original-portrait-ghost{opacity:.18!important;transform:translateX(-50%) scale(.965)!important}.nrs-uploaded-hero-v19[data-story-active="signal"] .nrs-visual-grid{opacity:.23!important}.nrs-uploaded-hero-v19[data-story-active="signal"] .nrs-orbit ellipse{stroke:color-mix(in srgb,var(--nrs-u-orange) 96%,transparent)!important;stroke-width:.34!important}.nrs-uploaded-hero-v19[data-story-active] .nrs-uploaded-thesis{opacity:.28!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{left:7%!important;bottom:9%!important;width:34%!important;font-size:8px!important;line-height:1.5!important;transition:opacity .2s ease!important}.nrs-uploaded-hero-v19 .nrs-uploaded-meta{bottom:0!important}
@media(max-width:960px){.nrs-uploaded-hero-v19 .nrs-story-readout{right:1%!important;bottom:2%!important;width:46%!important}.nrs-uploaded-hero-v19 .nrs-story-node-label{display:none!important}.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{width:38%!important}}
@media(max-width:640px){.nrs-uploaded-hero-v19 .nrs-story-readout{left:4%!important;right:4%!important;bottom:2%!important;width:auto!important}.nrs-uploaded-hero-v19 .nrs-uploaded-thesis,.nrs-uploaded-hero-v19 .nrs-uploaded-meta{display:none!important}.nrs-uploaded-hero-v19 .nrs-story-thread{inset:2% 0 5%!important}.nrs-uploaded-hero-v19 .nrs-story-node{transform:translate(-50%,-50%) scale(.9)!important}}
@media(prefers-reduced-motion:reduce){.nrs-uploaded-hero-v19 .nrs-story-thread-progress,.nrs-uploaded-hero-v19 .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-node-label,.nrs-uploaded-hero-v19 .nrs-story-readout{transition:none!important}}
/* nrs-hero-story-v20:end */\n`;

fs.writeFileSync(homePath, html, 'utf8');
fs.writeFileSync(stylePath, css, 'utf8');

if (!html.includes('data-story="intent"') || !html.includes('OUTPUT / SIGNAL') || !css.includes('nrs-hero-story-v20:start')) {
  throw new Error('[hero-story-v20] Story layer verification failed.');
}

console.log('[hero-story-v20] Added a designer-readable reasoning loop: intent → constraints → state → affordance → signal.');
