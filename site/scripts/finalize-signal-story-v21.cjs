/**
 * @fileoverview scripts/finalize-signal-story-v21.cjs
 * Purpose: Apply the finalize signal story v21 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/finalize-signal-story-v20.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

// Build the semantic story markup first, then upgrade only the motion layer.
require('./finalize-signal-story-v20.cjs');

const rootDir = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(rootDir, 'dist') : rootDir;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-story-v21] Missing index.html or style.css.');
}

let html = fs.readFileSync(homePath, 'utf8');
let css = fs.readFileSync(stylePath, 'utf8');

if (!html.includes('id="nrsStoryReadout"') || !html.includes('data-story="signal"')) {
  throw new Error('[hero-story-v21] v20 story markup is missing.');
}

if (!html.includes('class="nrs-story-noise"')) {
  const specks = Array.from({ length: 30 },  /** Callback contract: Perform the local callback step required by the immediately enclosing finalize signal story v21 repository tool operation. Inputs: `_`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ (_, index) => {
    const x = 8 + ((index * 37) % 85);
    const y = 9 + ((index * 53) % 78);
    const size = 1 + (index % 3);
    const alpha = (0.18 + (index % 5) * 0.09).toFixed(2);
    return `<i style="--noise-x:${x}%;--noise-y:${y}%;--noise-size:${size}px;--noise-o:${alpha}" aria-hidden="true"></i>`;
  }).join('');
  html = html.replace(
    '<svg class="nrs-story-thread"',
    `<div class="nrs-story-noise" aria-hidden="true">${specks}</div>\n      <svg class="nrs-story-thread"`
  );
}

// v21 owns the browser interaction. Keep v20 as the build-time semantic layer only.
html = html.replace(/<!-- nrs-hero-story-v20-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v20-runtime:end -->/g, '');
html = html.replace(/<!-- nrs-hero-story-v21-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v21-runtime:end -->/g, '');

const gsapTag = '<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>';
const runtime = `<!-- nrs-hero-story-v21-runtime:start -->
${gsapTag}
<script>
(() => {
  const visual = document.querySelector('.nrs-uploaded-hero-v19 .nrs-uploaded-visual');
  if (!visual || visual.dataset.storyV21Bound === 'true') return;
  visual.dataset.storyV21Bound = 'true';

  const nodes = [...visual.querySelectorAll('.nrs-story-node')];
  const readout = visual.querySelector('#nrsStoryReadout');
  const step = visual.querySelector('#nrsStoryStep');
  const artifact = visual.querySelector('#nrsStoryArtifact');
  const title = visual.querySelector('#nrsStoryTitle');
  const copy = visual.querySelector('#nrsStoryCopy');
  const rule = visual.querySelector('#nrsStoryRule');
  const progress = visual.querySelector('#nrsStoryProgress');
  const noise = visual.querySelector('.nrs-story-noise');
  const signalNode = visual.querySelector('.nrs-story-signal');
  const portrait = visual.querySelector('.nrs-original-portrait:not(.nrs-original-portrait-ghost)');
  const ghost = visual.querySelector('.nrs-original-portrait-ghost');
  const orbit = visual.querySelector('.nrs-orbit');
  const grid = visual.querySelector('.nrs-visual-grid');
  const aborter = new AbortController();
  const signal = aborter.signal;
  const gs = window.gsap || null;

  const story = {
    intent: {
      step: '01 / DISCOVERY', artifact: 'JTBD',
      title: 'Frame the job before the screen.',
      copy: 'Separate the desired outcome from the interface the person happens to be using.',
      rule: 'job ≠ requested feature', progress: 82,
      ghost: .08, ghostX: 2, grid: .46, noise: .82, orbit: .72, orbitScale: .995, portraitScale: 1
    },
    constraint: {
      step: '02 / SYSTEM', artifact: 'RULE MODEL',
      title: 'Model what the system can truthfully allow.',
      copy: 'Permissions, dependencies, limits and failure paths define the real interaction space.',
      rule: 'possible ≠ permissible', progress: 62,
      ghost: .22, ghostX: -8, grid: .68, noise: .67, orbit: .84, orbitScale: 1.004, portraitScale: 1.002
    },
    state: {
      step: '03 / HIERARCHY', artifact: 'STATE MODEL',
      title: 'Expose the state that changes the choice.',
      copy: 'Loading, empty, partial, blocked and success are different decisions even when the screen is the same.',
      rule: 'same screen ≠ same situation', progress: 40,
      ghost: .29, ghostX: -12, grid: .56, noise: .48, orbit: .9, orbitScale: 1.008, portraitScale: 1.003
    },
    affordance: {
      step: '04 / ACTION', artifact: 'AFFORDANCE',
      title: 'Make the next move feel inevitable.',
      copy: 'Hierarchy should encode consequence and confidence until one action becomes easier than every competing interpretation.',
      rule: 'available ≠ obvious', progress: 18,
      ghost: .13, ghostX: -5, grid: .34, noise: .28, orbit: .94, orbitScale: 1.012, portraitScale: 1.005
    },
    signal: {
      step: 'OUTPUT / SIGNAL', artifact: 'REDUCTION',
      title: 'What survives the reduction is signal.',
      copy: 'The minimum truthful information required for a confident decision.',
      rule: 'noise ↓  ·  confidence ↑', progress: 0,
      ghost: .018, ghostX: 0, grid: .08, noise: .055, orbit: 1, orbitScale: 1.02, portraitScale: 1.009
    }
  };

  const order = ['intent', 'constraint', 'state', 'affordance', 'signal'];
  let pinned = false;
  let resetTimer = 0;
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let desktopMotion = window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:800px)').matches;
  let quick = null;

  function setText(item) {
    step.textContent = item.step;
    artifact.textContent = item.artifact;
    title.textContent = item.title;
    copy.textContent = item.copy;
    rule.textContent = item.rule;
  }

  function setNodeState(key) {
    const activeIndex = order.indexOf(key);
    nodes.forEach((node) => {
      const index = order.indexOf(node.dataset.story);
      node.classList.toggle('is-active', index === activeIndex);
      node.classList.toggle('is-complete', index < activeIndex);
      node.classList.toggle('is-future', index > activeIndex);
    });
  }

  function staticVisual(item) {
    visual.style.setProperty('--story-ghost-alpha', String(item.ghost));
    visual.style.setProperty('--story-ghost-x', item.ghostX + 'px');
    visual.style.setProperty('--story-grid-alpha', String(item.grid));
    visual.style.setProperty('--story-noise-alpha', String(item.noise));
    visual.style.setProperty('--story-orbit-alpha', String(item.orbit));
    visual.style.setProperty('--story-orbit-scale', String(item.orbitScale));
    visual.style.setProperty('--story-portrait-scale', String(item.portraitScale));
    progress.style.setProperty('--story-progress', String(item.progress));
    readout.style.setProperty('--story-readout-alpha', '1');
    readout.style.setProperty('--story-readout-y', '0px');
  }

  function render(key) {
    const item = story[key];
    if (!item) return;
    clearTimeout(resetTimer);
    visual.dataset.storyActive = key;
    setNodeState(key);
    readout.setAttribute('aria-hidden', 'false');

    if (!gs || reduced) {
      setText(item);
      staticVisual(item);
      return;
    }

    gs.killTweensOf([visual, readout, progress, ...nodes]);
    const tl = gs.timeline({ defaults: { ease: 'power3.out', overwrite: 'auto' } });
    tl.to(readout, {
      '--story-readout-alpha': 0,
      '--story-readout-y': '7px',
      duration: .1
    }, 0)
    .add(() => setText(item), .09)
    .to(visual, {
      '--story-ghost-alpha': item.ghost,
      '--story-ghost-x': item.ghostX + 'px',
      '--story-grid-alpha': item.grid,
      '--story-noise-alpha': item.noise,
      '--story-orbit-alpha': item.orbit,
      '--story-orbit-scale': item.orbitScale,
      '--story-portrait-scale': item.portraitScale,
      duration: .42
    }, 0)
    .to(progress, {
      '--story-progress': item.progress,
      duration: .46,
      ease: 'power2.out'
    }, .02)
    .to(nodes, {
      '--story-node-alpha': (index) => {
        const nodeIndex = order.indexOf(nodes[index].dataset.story);
        const activeIndex = order.indexOf(key);
        if (nodeIndex === activeIndex) return 1;
        if (nodeIndex < activeIndex) return .72;
        return key === 'signal' ? .16 : .38;
      },
      duration: .22,
      stagger: .018
    }, .04)
    .to(nodes.filter((node) => node.dataset.story === key), {
      '--story-dot-scale': key === 'signal' ? 2.15 : 1.72,
      duration: .2
    }, .04)
    .to(readout, {
      '--story-readout-alpha': 1,
      '--story-readout-y': '0px',
      duration: .24
    }, .12);

    if (key === 'signal' && signalNode) {
      tl.fromTo(signalNode,
        { '--story-signal-halo': 0 },
        { '--story-signal-halo': 1, duration: .34, ease: 'power3.out' },
        .05
      );
    }
  }

  function reset() {
    if (pinned) return;
    visual.removeAttribute('data-story-active');
    nodes.forEach((node) => node.classList.remove('is-active', 'is-complete', 'is-future'));
    readout.setAttribute('aria-hidden', 'true');

    if (!gs || reduced) {
      visual.style.setProperty('--story-ghost-alpha', '.11');
      visual.style.setProperty('--story-ghost-x', '0px');
      visual.style.setProperty('--story-grid-alpha', '.55');
      visual.style.setProperty('--story-noise-alpha', '.58');
      visual.style.setProperty('--story-orbit-alpha', '1');
      visual.style.setProperty('--story-orbit-scale', '1');
      visual.style.setProperty('--story-portrait-scale', '1');
      progress.style.setProperty('--story-progress', '100');
      readout.style.setProperty('--story-readout-alpha', '0');
      nodes.forEach((node) => {
        node.style.setProperty('--story-node-alpha', '1');
        node.style.setProperty('--story-dot-scale', '1');
      });
      return;
    }

    gs.to(visual, {
      '--story-ghost-alpha': .11,
      '--story-ghost-x': '0px',
      '--story-grid-alpha': .55,
      '--story-noise-alpha': .58,
      '--story-orbit-alpha': 1,
      '--story-orbit-scale': 1,
      '--story-portrait-scale': 1,
      duration: .36,
      ease: 'power3.out',
      overwrite: 'auto'
    });
    gs.to(progress, { '--story-progress': 100, duration: .34, ease: 'power2.out', overwrite: 'auto' });
    gs.to(readout, { '--story-readout-alpha': 0, '--story-readout-y': '8px', duration: .16, overwrite: 'auto' });
    gs.to(nodes, { '--story-node-alpha': 1, '--story-dot-scale': 1, duration: .2, stagger: .012, overwrite: 'auto' });
  }

  function entrance() {
    reset();
    if (!gs || reduced) return;
    gs.set(nodes, { '--story-node-alpha': 0, '--story-dot-scale': .45 });
    gs.set(progress, { '--story-progress': 100 });
    gs.set(visual, {
      '--story-ghost-alpha': 0,
      '--story-grid-alpha': .1,
      '--story-noise-alpha': 0,
      '--story-orbit-alpha': .2,
      '--story-portrait-scale': .992
    });

    const tl = gs.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(visual, {
      '--story-portrait-scale': 1,
      '--story-ghost-alpha': .11,
      '--story-grid-alpha': .55,
      '--story-noise-alpha': .58,
      '--story-orbit-alpha': 1,
      duration: .72
    })
    .to(nodes, {
      '--story-node-alpha': 1,
      '--story-dot-scale': 1,
      duration: .32,
      stagger: .055
    }, '-=.36');
  }

  function bindNode(node) {
    node.addEventListener('mouseenter', () => {
      if (desktopMotion) render(node.dataset.story);
    }, { signal });
    node.addEventListener('mouseleave', () => {
      if (desktopMotion && !pinned) resetTimer = window.setTimeout(reset, 150);
    }, { signal });
    node.addEventListener('focus', () => render(node.dataset.story), { signal });
    node.addEventListener('blur', () => {
      if (!pinned) resetTimer = window.setTimeout(reset, 150);
    }, { signal });
    node.addEventListener('click', (event) => {
      event.preventDefault();
      const same = pinned && visual.dataset.storyActive === node.dataset.story;
      pinned = !same;
      visual.dataset.storyPinned = pinned ? 'true' : 'false';
      if (same) reset(); else render(node.dataset.story);
    }, { signal });
  }

  nodes.forEach(bindNode);
  readout.addEventListener('mouseenter', () => clearTimeout(resetTimer), { signal });
  readout.addEventListener('mouseleave', () => {
    if (!pinned) resetTimer = window.setTimeout(reset, 150);
  }, { signal });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      pinned = false;
      visual.dataset.storyPinned = 'false';
      reset();
    }
  }, { signal });

  if (gs) {
    const mm = gs.matchMedia();
    mm.add({
      desktop: '(hover:hover) and (pointer:fine) and (min-width:800px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      desktopMotion = !!context.conditions.desktop;
      reduced = !!context.conditions.reduceMotion;
      quick = null;

      if (desktopMotion && !reduced) {
        quick = {
          portraitX: gs.quickTo(visual, '--story-portrait-x', { duration: .35, ease: 'power3.out' }),
          portraitY: gs.quickTo(visual, '--story-portrait-y', { duration: .35, ease: 'power3.out' }),
          ghostParallaxX: gs.quickTo(visual, '--story-ghost-parallax-x', { duration: .45, ease: 'power3.out' }),
          ghostY: gs.quickTo(visual, '--story-ghost-y', { duration: .45, ease: 'power3.out' }),
          orbitX: gs.quickTo(visual, '--story-orbit-x', { duration: .4, ease: 'power3.out' }),
          orbitY: gs.quickTo(visual, '--story-orbit-y', { duration: .4, ease: 'power3.out' }),
          gridX: gs.quickTo(visual, '--story-grid-x', { duration: .5, ease: 'power3.out' }),
          gridY: gs.quickTo(visual, '--story-grid-y', { duration: .5, ease: 'power3.out' })
        };
      }
      return () => {
        quick = null;
        gs.killTweensOf([visual, readout, progress, ...nodes]);
      };
    });

    visual.addEventListener('pointermove', (event) => {
      if (!quick || event.pointerType === 'touch') return;
      const rect = visual.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - .5) * 2;
      quick.portraitX(nx * 2);
      quick.portraitY(ny * 2);
      quick.ghostParallaxX(nx * -7);
      quick.ghostY(ny * -5);
      quick.orbitX(nx * 5);
      quick.orbitY(ny * 4);
      quick.gridX(nx * -2.5);
      quick.gridY(ny * -2);
    }, { signal, passive: true });

    visual.addEventListener('pointerleave', () => {
      if (!quick) return;
      quick.portraitX(0); quick.portraitY(0);
      quick.ghostParallaxX(0); quick.ghostY(0);
      quick.orbitX(0); quick.orbitY(0);
      quick.gridX(0); quick.gridY(0);
    }, { signal });

    window.addEventListener('pagehide', () => {
      aborter.abort();
      mm.revert();
    }, { once: true });
  } else {
    window.addEventListener('pagehide', () => aborter.abort(), { once: true });
  }

  // Keep these references explicit: they are the three visual layers the story manipulates.
  void portrait; void ghost; void orbit; void grid; void noise;
  entrance();
})();
</script>
<!-- nrs-hero-story-v21-runtime:end -->`;

if (!html.includes('gsap@3.15.0/dist/gsap.min.js')) {
  html = html.replace('</body>', `${runtime}\n</body>`);
} else {
  html = html.replace('</body>', `${runtime.replace(gsapTag + '\n', '')}\n</body>`);
}

const cssMarker = /\/\* nrs-hero-story-v21:start \*\/[\s\S]*?\/\* nrs-hero-story-v21:end \*\//g;
css = css.replace(cssMarker, '').trimEnd();
css += `

/* nrs-hero-story-v21:start */
.nrs-uploaded-hero-v19 .nrs-uploaded-visual{
  --story-ghost-alpha:.11;--story-ghost-x:0px;--story-ghost-parallax-x:0px;--story-ghost-y:0px;
  --story-grid-alpha:.55;--story-grid-x:0px;--story-grid-y:0px;--story-noise-alpha:.58;
  --story-orbit-alpha:1;--story-orbit-scale:1;--story-orbit-x:0px;--story-orbit-y:0px;
  --story-portrait-scale:1;--story-portrait-x:0px;--story-portrait-y:0px
}
.nrs-uploaded-hero-v19 .nrs-original-portrait:not(.nrs-original-portrait-ghost){transform:translateX(calc(-50% + var(--story-portrait-x))) translateY(var(--story-portrait-y)) scale(var(--story-portrait-scale))!important;will-change:transform!important}
.nrs-uploaded-hero-v19 .nrs-original-portrait-ghost{left:38%!important;opacity:var(--story-ghost-alpha)!important;transform:translateX(calc(-50% + var(--story-ghost-x) + var(--story-ghost-parallax-x))) translateY(var(--story-ghost-y)) scale(.96)!important;will-change:transform,opacity!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-original-portrait-ghost{opacity:var(--story-ghost-alpha)!important}
.nrs-uploaded-hero-v19 .nrs-visual-grid{opacity:var(--story-grid-alpha)!important;transform:translate3d(var(--story-grid-x),var(--story-grid-y),0)!important;will-change:transform,opacity!important}
.nrs-uploaded-hero-v19 .nrs-orbit{opacity:var(--story-orbit-alpha)!important;transform:translate3d(var(--story-orbit-x),var(--story-orbit-y),0) scale(var(--story-orbit-scale))!important;transform-origin:50% 50%!important;will-change:transform,opacity!important}
.nrs-uploaded-hero-v19 .nrs-story-thread-progress{stroke-dashoffset:var(--story-progress,100)!important;transition:none!important;will-change:stroke-dashoffset!important}
.nrs-uploaded-hero-v19 .nrs-story-node{opacity:var(--story-node-alpha,1)!important;will-change:opacity!important}.nrs-uploaded-hero-v19 .nrs-story-node.is-future,.nrs-uploaded-hero-v19 .nrs-story-node.is-complete{opacity:var(--story-node-alpha,1)!important}
.nrs-uploaded-hero-v19 .nrs-story-dot{transform:scale(var(--story-dot-scale,1))!important;transition:box-shadow .18s ease,background .18s ease!important;will-change:transform!important}
.nrs-uploaded-hero-v19 .nrs-story-node:hover .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-node:focus-visible .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-node.is-active .nrs-story-dot{transform:scale(var(--story-dot-scale,1.72))!important}
.nrs-uploaded-hero-v19 .nrs-story-signal .nrs-story-dot{box-shadow:0 0 0 calc(5px + var(--story-signal-halo,0)*5px) color-mix(in srgb,var(--nrs-u-ink) 10%,transparent),0 0 calc(20px + var(--story-signal-halo,0)*20px) color-mix(in srgb,var(--nrs-u-ink) 38%,transparent)!important}
.nrs-uploaded-hero-v19 .nrs-story-readout,.nrs-uploaded-hero-v19 .nrs-story-readout[aria-hidden="true"]{opacity:var(--story-readout-alpha,0)!important;transform:translateY(var(--story-readout-y,8px))!important;transition:none!important;will-change:transform,opacity!important}
.nrs-uploaded-hero-v19 .nrs-story-noise{position:absolute!important;inset:4% 1% 7%!important;z-index:2!important;pointer-events:none!important;opacity:var(--story-noise-alpha)!important;transition:none!important;will-change:opacity!important;mask-image:radial-gradient(ellipse 72% 70% at 52% 48%,#000 0 62%,transparent 100%)!important;-webkit-mask-image:radial-gradient(ellipse 72% 70% at 52% 48%,#000 0 62%,transparent 100%)!important}
.nrs-uploaded-hero-v19 .nrs-story-noise i{position:absolute!important;left:var(--noise-x)!important;top:var(--noise-y)!important;width:var(--noise-size)!important;height:var(--noise-size)!important;border-radius:50%!important;background:var(--nrs-u-orange)!important;opacity:var(--noise-o)!important;box-shadow:0 0 7px color-mix(in srgb,var(--nrs-u-orange) 42%,transparent)!important}
.nrs-uploaded-hero-v19[data-story-active="constraint"] .nrs-original-portrait-ghost,.nrs-uploaded-hero-v19[data-story-active="state"] .nrs-original-portrait-ghost{opacity:var(--story-ghost-alpha)!important;transform:translateX(calc(-50% + var(--story-ghost-x) + var(--story-ghost-parallax-x))) translateY(var(--story-ghost-y)) scale(.96)!important}
.nrs-uploaded-hero-v19[data-story-active="signal"] .nrs-visual-grid{opacity:var(--story-grid-alpha)!important}.nrs-uploaded-hero-v19[data-story-active="signal"] .nrs-orbit{opacity:var(--story-orbit-alpha)!important}
@media(prefers-reduced-motion:reduce){.nrs-uploaded-hero-v19 .nrs-original-portrait,.nrs-uploaded-hero-v19 .nrs-original-portrait-ghost,.nrs-uploaded-hero-v19 .nrs-visual-grid,.nrs-uploaded-hero-v19 .nrs-orbit,.nrs-uploaded-hero-v19 .nrs-story-node,.nrs-uploaded-hero-v19 .nrs-story-readout{will-change:auto!important}}
/* nrs-hero-story-v21:end */\n`;

fs.writeFileSync(homePath, html, 'utf8');
fs.writeFileSync(stylePath, css, 'utf8');

if (!html.includes('nrs-hero-story-v21-runtime:start') || !html.includes('class="nrs-story-noise"') || !css.includes('nrs-hero-story-v21:start')) {
  throw new Error('[hero-story-v21] GSAP story layer verification failed.');
}

console.log('[hero-story-v21] GSAP story motion installed: reasoning surfaces, noise reduces, signal resolves.');
