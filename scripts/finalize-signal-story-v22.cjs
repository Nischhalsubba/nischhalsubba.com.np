const fs = require('node:fs');
const path = require('node:path');

// Preserve v21 semantics/motion, then refine only the presentation layer.
require('./finalize-signal-story-v21.cjs');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-story-v22] Missing index.html or style.css.');
}

let html = fs.readFileSync(homePath, 'utf8');
let css = fs.readFileSync(stylePath, 'utf8');

if (!html.includes('class="nrs-uploaded-visual"') || !html.includes('data-story="signal"')) {
  throw new Error('[hero-story-v22] Expected v21 hero story markup was not found.');
}

// Add a completely separate orange pixel/noise layer. The portrait image is never edited.
if (!html.includes('class="nrs-pixel-field"')) {
  const pixels = Array.from({ length: 84 }, (_, index) => {
    const x = 4 + ((index * 37 + 11) % 92);
    const y = 5 + ((index * 53 + 7) % 89);
    const size = [1, 1, 1, 2, 2, 3][index % 6];
    const alpha = (0.22 + (index % 7) * 0.075).toFixed(3);
    const delay = ((index % 11) * 0.018).toFixed(3);
    return `<i style="--px-x:${x}%;--px-y:${y}%;--px-size:${size}px;--px-o:${alpha};--px-delay:${delay}s" aria-hidden="true"></i>`;
  }).join('');

  const field = `<div class="nrs-pixel-field" aria-hidden="true"><div class="nrs-pixel-matrix"></div>${pixels}</div>`;
  html = html.replace('<div class="nrs-story-noise"', `${field}\n      <div class="nrs-story-noise"`);
}

// Make hover language deliberately compact. Deeper copy still exists semantically in v21,
// but the visual readout should scan like a designer annotation, not a documentation card.
const titleReplacements = [
  ['Frame the job before the screen.', 'Frame the real job.'],
  ['Model what the system can truthfully allow.', 'Model the system truth.'],
  ['Expose the state that changes the choice.', 'Expose what changes the choice.'],
  ['Make the next move feel inevitable.', 'Make the next action obvious.'],
  ['What survives the reduction is signal.', 'Reduce until confidence remains.']
];
for (const [from, to] of titleReplacements) html = html.replaceAll(from, to);

// v22 owns only its small additive runtime.
html = html.replace(/<!-- nrs-hero-story-v22-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v22-runtime:end -->/g, '');
const runtime = `<!-- nrs-hero-story-v22-runtime:start -->
<script>
(() => {
  const visual = document.querySelector('.nrs-uploaded-hero-v19 .nrs-uploaded-visual');
  if (!visual || visual.dataset.storyV22Bound === 'true') return;
  visual.dataset.storyV22Bound = 'true';

  const field = visual.querySelector('.nrs-pixel-field');
  const nodes = [...visual.querySelectorAll('.nrs-story-node')];
  const gs = window.gsap || null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:800px)').matches;
  const aborter = new AbortController();
  const signal = aborter.signal;
  if (!field) return;

  const opacityByState = { intent: .68, constraint: .55, state: .42, affordance: .26, signal: .075 };

  function setField(state) {
    const opacity = state ? (opacityByState[state] ?? .58) : .58;
    if (!gs || reduced) {
      field.style.opacity = String(opacity);
      return;
    }
    gs.to(field, { autoAlpha: opacity, scale: state === 'signal' ? 1.018 : 1, duration: .34, ease: 'power3.out', overwrite: 'auto' });
  }

  if (gs && !reduced) {
    gs.fromTo(field, { autoAlpha: 0, scale: .97 }, { autoAlpha: .58, scale: 1, duration: .68, ease: 'power3.out', delay: .16 });

    if (desktop) {
      const qx = gs.quickTo(field, 'x', { duration: .48, ease: 'power3.out' });
      const qy = gs.quickTo(field, 'y', { duration: .48, ease: 'power3.out' });
      visual.addEventListener('pointermove', (event) => {
        const rect = visual.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const ny = ((event.clientY - rect.top) / rect.height - .5) * 2;
        qx(nx * 3.5); qy(ny * 2.5);
      }, { signal, passive: true });
      visual.addEventListener('pointerleave', () => { qx(0); qy(0); }, { signal });
    }
  }

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => { if (desktop) setField(node.dataset.story); }, { signal });
    node.addEventListener('focus', () => setField(node.dataset.story), { signal });
    node.addEventListener('mouseleave', () => {
      if (desktop && visual.dataset.storyPinned !== 'true') setField(null);
    }, { signal });
    node.addEventListener('blur', () => {
      if (visual.dataset.storyPinned !== 'true') setField(null);
    }, { signal });
    node.addEventListener('click', () => {
      requestAnimationFrame(() => setField(visual.dataset.storyPinned === 'true' ? visual.dataset.storyActive : null));
    }, { signal });
  });

  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setField(null); }, { signal });
  window.addEventListener('pagehide', () => aborter.abort(), { once: true });
})();
</script>
<!-- nrs-hero-story-v22-runtime:end -->`;
html = html.replace('</body>', `${runtime}\n</body>`);

const marker = /\/\* nrs-hero-story-v22:start \*\/[\s\S]*?\/\* nrs-hero-story-v22:end \*\//g;
css = css.replace(marker, '').trimEnd();
css += `

/* nrs-hero-story-v22:start */
/* CTA visibility: defeat older global anchor treatments explicitly. */
.nrs-uploaded-hero-v19 .nrs-uploaded-actions{position:relative!important;z-index:20!important;align-items:stretch!important;gap:10px!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn{min-width:184px!important;min-height:50px!important;padding:0 17px!important;opacity:1!important;visibility:visible!important;color:var(--nrs-u-ink)!important;-webkit-text-fill-color:currentColor!important;font:700 10px/1 var(--nrs-u-mono)!important;letter-spacing:.045em!important;overflow:visible!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn,.nrs-uploaded-hero-v19 .nrs-uploaded-btn span{opacity:1!important;visibility:visible!important;color:inherit!important;-webkit-text-fill-color:currentColor!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn-primary{min-width:168px!important;background:var(--nrs-u-primary)!important;border-color:var(--nrs-u-primary)!important;color:var(--nrs-u-primary-ink)!important;-webkit-text-fill-color:var(--nrs-u-primary-ink)!important}
html[data-theme="dark"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn-primary{background:#f7f2e8!important;color:#11110f!important;-webkit-text-fill-color:#11110f!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn-primary{background:#11110f!important;color:#f7f2e8!important;-webkit-text-fill-color:#f7f2e8!important}
html[data-theme="dark"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn:not(.nrs-uploaded-btn-primary){border-color:rgba(247,242,232,.28)!important;color:#f7f2e8!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn:not(.nrs-uploaded-btn-primary){border-color:rgba(17,17,15,.24)!important;color:#11110f!important}

/* Let the visual breathe beyond the portrait footprint without editing the image itself. */
.nrs-uploaded-hero-v19 .nrs-uploaded-visual{width:min(100%,640px)!important;max-width:640px!important;overflow:visible!important}
.nrs-uploaded-hero-v19 .nrs-original-portrait:not(.nrs-original-portrait-ghost){z-index:5!important}
.nrs-uploaded-hero-v19 .nrs-original-portrait-ghost{z-index:1!important}
.nrs-uploaded-hero-v19 .nrs-visual-grid{inset:-3% -9% -3% -10%!important;z-index:0!important;opacity:calc(var(--story-grid-alpha,.55) * .62)!important;background-size:31px 31px!important}

/* Orbit is now a framing device behind the portrait, not a face-obscuring foreground ring. */
.nrs-uploaded-hero-v19 .nrs-orbit{inset:-7% -10% 0 -10%!important;z-index:2!important;opacity:calc(var(--story-orbit-alpha,1) * .56)!important;filter:drop-shadow(0 0 7px color-mix(in srgb,var(--nrs-u-orange) 12%,transparent))!important}
.nrs-uploaded-hero-v19 .nrs-orbit ellipse{stroke-width:.18!important;opacity:.72!important}
.nrs-uploaded-hero-v19 .nrs-orbit ellipse+ellipse{stroke-width:.11!important;opacity:.28!important}
.nrs-uploaded-hero-v19 .nrs-story-thread{inset:-4% -8% 2% -8%!important;z-index:2!important;opacity:.46!important}
.nrs-uploaded-hero-v19 .nrs-story-thread-base{opacity:.48!important}
.nrs-uploaded-hero-v19 .nrs-story-thread-progress{stroke-width:1.15!important}

/* Orange pixel field sampled from the uploaded Signal-over-Noise visual language. */
.nrs-uploaded-hero-v19 .nrs-pixel-field{position:absolute!important;inset:-13% -17% -11% -17%!important;z-index:6!important;pointer-events:none!important;opacity:.58;transform-origin:50% 50%!important;will-change:transform,opacity!important;mask-image:radial-gradient(ellipse 66% 67% at 50% 48%,transparent 0 38%,rgba(0,0,0,.12) 43%,#000 53%,#000 74%,rgba(0,0,0,.45) 87%,transparent 100%)!important;-webkit-mask-image:radial-gradient(ellipse 66% 67% at 50% 48%,transparent 0 38%,rgba(0,0,0,.12) 43%,#000 53%,#000 74%,rgba(0,0,0,.45) 87%,transparent 100%)!important}
.nrs-uploaded-hero-v19 .nrs-pixel-matrix{position:absolute!important;inset:5% 4%!important;background-image:radial-gradient(circle,color-mix(in srgb,var(--nrs-u-orange) 52%,transparent) .72px,transparent .86px)!important;background-size:6px 6px!important;opacity:.28!important;mask-image:radial-gradient(ellipse 62% 61% at 55% 48%,transparent 0 36%,#000 50%,rgba(0,0,0,.72) 72%,transparent 93%)!important;-webkit-mask-image:radial-gradient(ellipse 62% 61% at 55% 48%,transparent 0 36%,#000 50%,rgba(0,0,0,.72) 72%,transparent 93%)!important}
.nrs-uploaded-hero-v19 .nrs-pixel-field i{position:absolute!important;left:var(--px-x)!important;top:var(--px-y)!important;width:var(--px-size)!important;height:var(--px-size)!important;background:var(--nrs-u-orange)!important;opacity:var(--px-o)!important;border-radius:0!important;box-shadow:0 0 7px color-mix(in srgb,var(--nrs-u-orange) 48%,transparent)!important}
.nrs-uploaded-hero-v19 .nrs-story-noise{display:none!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-pixel-field{opacity:.42}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-pixel-matrix{opacity:.18!important}

/* Story controls orbit the portrait instead of sitting across the face. */
.nrs-uploaded-hero-v19 .nrs-story-node{z-index:9!important;width:34px!important;height:34px!important}
.nrs-uploaded-hero-v19 .nrs-story-dot{inset:13px!important;box-shadow:0 0 0 4px color-mix(in srgb,var(--nrs-u-orange) 9%,transparent),0 0 15px color-mix(in srgb,var(--nrs-u-orange) 26%,transparent)!important}
.nrs-uploaded-hero-v19 .nrs-story-intent{left:-1%!important;top:62%!important}
.nrs-uploaded-hero-v19 .nrs-story-constraint{left:42%!important;top:3%!important}
.nrs-uploaded-hero-v19 .nrs-story-state{left:101%!important;top:39%!important}
.nrs-uploaded-hero-v19 .nrs-story-affordance{left:88%!important;top:84%!important}
.nrs-uploaded-hero-v19 .nrs-story-signal{left:2%!important;top:36%!important}
.nrs-uploaded-hero-v19 .nrs-story-state .nrs-story-node-label,.nrs-uploaded-hero-v19 .nrs-story-affordance .nrs-story-node-label{left:auto!important;right:18px!important}
.nrs-uploaded-hero-v19 .nrs-story-node-label{padding:4px 6px!important;font-size:7px!important;background:color-mix(in srgb,var(--nrs-u-page) 92%,transparent)!important;border-color:color-mix(in srgb,var(--nrs-u-ink) 15%,transparent)!important}

/* Hover readout: designer shorthand only. No paragraph card. */
.nrs-uploaded-hero-v19 .nrs-story-readout{right:0!important;bottom:5%!important;width:190px!important;padding:9px 10px!important;border-color:color-mix(in srgb,var(--nrs-u-ink) 16%,transparent)!important;background:color-mix(in srgb,var(--nrs-u-page) 93%,transparent)!important;box-shadow:0 14px 34px rgba(0,0,0,.1)!important}
.nrs-uploaded-hero-v19 .nrs-story-readout-head{margin-bottom:5px!important;font-size:6.5px!important}.nrs-uploaded-hero-v19 #nrsStoryArtifact{display:none!important}
.nrs-uploaded-hero-v19 .nrs-story-readout strong{margin:0!important;font-size:10px!important;line-height:1.3!important;font-weight:720!important}
.nrs-uploaded-hero-v19 .nrs-story-readout p,.nrs-uploaded-hero-v19 .nrs-story-readout code{display:none!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{left:4%!important;bottom:8%!important;width:34%!important;font-size:7.5px!important;opacity:.72!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-meta{left:4%!important;right:2%!important;bottom:-1%!important}

@media(max-width:1100px){
  .nrs-uploaded-hero-v19 .nrs-story-state{left:97%!important}.nrs-uploaded-hero-v19 .nrs-story-intent{left:3%!important}
  .nrs-uploaded-hero-v19 .nrs-pixel-field{inset:-9% -8% -9% -8%!important}
}
@media(max-width:960px){
  .nrs-uploaded-hero-v19 .nrs-uploaded-actions{gap:8px!important}.nrs-uploaded-hero-v19 .nrs-uploaded-btn{min-width:0!important}
  .nrs-uploaded-hero-v19 .nrs-story-readout{right:2%!important;bottom:4%!important;width:176px!important}
  .nrs-uploaded-hero-v19 .nrs-story-intent{left:4%!important}.nrs-uploaded-hero-v19 .nrs-story-state{left:96%!important}
}
@media(max-width:640px){
  .nrs-uploaded-hero-v19 .nrs-pixel-field{inset:-4% -3% -5% -3%!important;opacity:.4!important}
  .nrs-uploaded-hero-v19 .nrs-orbit{inset:-2% -3% 2% -3%!important}
  .nrs-uploaded-hero-v19 .nrs-story-node{width:30px!important;height:30px!important}
  .nrs-uploaded-hero-v19 .nrs-story-dot{inset:11px!important}
  .nrs-uploaded-hero-v19 .nrs-story-readout{left:5%!important;right:5%!important;bottom:4%!important;width:auto!important;max-width:210px!important}
}
@media(prefers-reduced-motion:reduce){.nrs-uploaded-hero-v19 .nrs-pixel-field{will-change:auto!important;transform:none!important}}
/* nrs-hero-story-v22:end */\n`;

fs.writeFileSync(homePath, html, 'utf8');
fs.writeFileSync(stylePath, css, 'utf8');

if (!html.includes('class="nrs-pixel-field"') || !html.includes('nrs-hero-story-v22-runtime:start') || !css.includes('nrs-hero-story-v22:start')) {
  throw new Error('[hero-story-v22] Pixel/story refinement verification failed.');
}

console.log('[hero-story-v22] Refined hero: portrait untouched; orange pixels and story objects live on independent layers around it.');
