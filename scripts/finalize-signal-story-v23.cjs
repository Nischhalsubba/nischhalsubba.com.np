/**
 * @fileoverview scripts/finalize-signal-story-v23.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for finalize signal story v23.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/finalize-signal-reference-visual.cjs
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

// v20 gives us the accessible story anchors. v23 replaces its presentation/runtime wholesale.
require('./finalize-signal-story-v20.cjs');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-story-v23] Missing index.html or style.css.');
}

let html = fs.readFileSync(homePath, 'utf8');
let css = fs.readFileSync(stylePath, 'utf8');

if (!html.includes('class="nrs-uploaded-visual"') || !html.includes('id="nrsStoryReadout"')) {
  throw new Error('[hero-story-v23] Expected v20 hero story anchors were not found.');
}

html = html
  .replace(/<!-- nrs-hero-story-v20-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v20-runtime:end -->/g, '')
  .replace(/<!-- nrs-hero-story-v21-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v21-runtime:end -->/g, '')
  .replace(/<!-- nrs-hero-story-v22-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v22-runtime:end -->/g, '')
  .replace(/<!-- nrs-hero-story-v23-runtime:start -->[\s\S]*?<!-- nrs-hero-story-v23-runtime:end -->/g, '');

const storyStart = html.indexOf('<svg class="nrs-story-thread"');
const thesisStart = storyStart >= 0 ? html.indexOf('<p class="nrs-uploaded-thesis">', storyStart) : -1;
const hasV23Story = html.includes('class="nrs-decision-field"') && html.includes('data-story="problem"');
if ((storyStart < 0 || thesisStart < 0) && !hasV23Story) {
  throw new Error('[hero-story-v23] Story block boundaries were not found.');
}

const pixels = Array.from({ length: 62 }, /** Callback contract: Processes the callback step for array without leaking orchestration details to the caller. Inputs: _, index. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (_, index) => {
  const x = 3 + ((index * 47 + 13) % 94);
  const y = 5 + ((index * 61 + 17) % 90);
  const size = [1, 1, 1, 2, 2, 3][index % 6];
  const alpha = (0.16 + (index % 7) * 0.065).toFixed(3);
  return `<i style="--field-x:${x}%;--field-y:${y}%;--field-size:${size}px;--field-alpha:${alpha}" aria-hidden="true"></i>`;
}).join('');

const storyMarkup = `<div class="nrs-decision-field" aria-hidden="true">
        <svg class="nrs-decision-arcs" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <path class="nrs-field-arc nrs-field-arc-a" data-arc="problem" pathLength="100" d="M18 66 C10 50 16 31 33 20 C46 12 61 13 72 18" />
          <path class="nrs-field-arc nrs-field-arc-b" data-arc="rules" pathLength="100" d="M78 22 C91 32 94 49 88 63 C83 75 73 82 61 86" />
          <path class="nrs-field-arc nrs-field-arc-c" data-arc="state" pathLength="100" d="M55 88 C40 91 25 84 17 72" />
          <path class="nrs-field-arc nrs-field-arc-signal" data-arc="signal" pathLength="100" d="M12 59 C9 52 10 44 13 37" />
        </svg>
        <div class="nrs-field-pixels">${pixels}</div>
      </div>
      <button class="nrs-story-node nrs-story-problem" type="button" data-story="problem" aria-label="Problem frame: separate the job from the request"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">01 / Problem</span></button>
      <button class="nrs-story-node nrs-story-rules" type="button" data-story="rules" aria-label="Rule model: find what the product can actually promise"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">02 / Rules</span></button>
      <button class="nrs-story-node nrs-story-state" type="button" data-story="state" aria-label="State model: expose the condition that changes the choice"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">03 / State</span></button>
      <button class="nrs-story-node nrs-story-choice" type="button" data-story="choice" aria-label="Choice architecture: make consequence visible before action"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">04 / Choice</span></button>
      <button class="nrs-story-node nrs-story-signal" type="button" data-story="signal" aria-label="Signal: remove everything that does not change the decision"><span class="nrs-story-dot"></span><span class="nrs-story-node-label">Signal</span></button>
      <div class="nrs-story-readout" id="nrsStoryReadout" aria-live="polite" aria-hidden="true">
        <div class="nrs-story-readout-head"><span id="nrsStoryStep">01 / PROBLEM</span><span id="nrsStoryArtifact">JTBD</span></div>
        <strong id="nrsStoryTitle">Separate the job from the request.</strong>
        <code id="nrsStoryRule">request ≠ outcome</code>
      </div>
      `;

if (storyStart >= 0 && thesisStart >= 0) html = html.slice(0, storyStart) + storyMarkup + html.slice(thesisStart);
html = html.replace('<p class="nrs-uploaded-thesis">The interface is the visible consequence of decisions made underneath.</p>', '<p class="nrs-uploaded-thesis">Every gap is ambiguity. Good product design closes only the gaps that change the decision.</p>');
html = html.replace('<div class="nrs-uploaded-meta" aria-hidden="true"><span>Problem framing</span><span>State models</span><span>Interaction logic</span></div>', '<div class="nrs-uploaded-meta" aria-hidden="true"><span>JTBD</span><span>Rule model · State model</span><span>Choice architecture</span></div>');

const runtime = `<!-- nrs-hero-story-v23-runtime:start -->
<script>
(() => {
  const visual = document.querySelector('.nrs-uploaded-hero-v19 .nrs-uploaded-visual');
  if (!visual || visual.dataset.storyV23Bound === 'true') return;
  visual.dataset.storyV23Bound = 'true';
  const nodes = [...visual.querySelectorAll('.nrs-story-node')];
  const arcs = [...visual.querySelectorAll('.nrs-field-arc')];
  const pixelField = visual.querySelector('.nrs-field-pixels');
  const readout = visual.querySelector('#nrsStoryReadout');
  const step = visual.querySelector('#nrsStoryStep');
  const artifact = visual.querySelector('#nrsStoryArtifact');
  const title = visual.querySelector('#nrsStoryTitle');
  const rule = visual.querySelector('#nrsStoryRule');
  const ghost = visual.querySelector('.nrs-original-portrait-ghost');
  const gs = window.gsap || null;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverMedia = window.matchMedia('(hover:hover) and (pointer:fine) and (min-width:800px)');
  const aborter = new AbortController();
  const signal = aborter.signal;
  const order = ['problem', 'rules', 'state', 'choice', 'signal'];
  const story = {
    problem: { step:'01 / PROBLEM', artifact:'JTBD', title:'Separate the job from the request.', rule:'request ≠ outcome', pixels:.76, ghost:.07 },
    rules: { step:'02 / SYSTEM', artifact:'RULE MODEL', title:'Find what the product can actually promise.', rule:'possible ≠ permissible', pixels:.60, ghost:.13 },
    state: { step:'03 / STATE', artifact:'STATE MODEL', title:'Expose the condition that changes the choice.', rule:'same screen ≠ same situation', pixels:.43, ghost:.18 },
    choice: { step:'04 / CHOICE', artifact:'AFFORDANCE', title:'Make consequence visible before action.', rule:'priority → action', pixels:.24, ghost:.10 },
    signal: { step:'OUTPUT / SIGNAL', artifact:'REDUCTION', title:'Remove what does not change the decision.', rule:'noise ↓ · confidence ↑', pixels:.055, ghost:.025 }
  };
  let pinned = false;
  let resetTimer = 0;
  function isReduced(){ return media.matches; }
  function canHover(){ return hoverMedia.matches; }
  function setCopy(item){ step.textContent=item.step; artifact.textContent=item.artifact; title.textContent=item.title; rule.textContent=item.rule; }
  function setClasses(key){
    const activeIndex=order.indexOf(key);
    nodes.forEach((node)=>{ const index=order.indexOf(node.dataset.story); node.classList.toggle('is-active',index===activeIndex); node.classList.toggle('is-complete',index<activeIndex); node.classList.toggle('is-future',index>activeIndex); });
    arcs.forEach((arc)=>{ const index=order.indexOf(arc.dataset.arc); arc.classList.toggle('is-active',arc.dataset.arc===key); arc.classList.toggle('is-complete',index>=0&&index<activeIndex); });
  }
  function render(key){
    const item=story[key]; if(!item) return; clearTimeout(resetTimer); visual.dataset.storyActive=key; setCopy(item); setClasses(key); readout.setAttribute('aria-hidden','false');
    if(!gs||isReduced()){ pixelField.style.opacity=String(item.pixels); ghost.style.opacity=String(item.ghost); readout.style.opacity='1'; readout.style.transform='translateY(0)'; return; }
    gs.killTweensOf([readout,pixelField,ghost,...arcs,...nodes]);
    const activeArc=arcs.find((arc)=>arc.dataset.arc===key); const activeNode=nodes.find((node)=>node.dataset.story===key);
    const tl=gs.timeline({defaults:{ease:'power3.out',overwrite:'auto'}});
    tl.fromTo(readout,{autoAlpha:0,y:6},{autoAlpha:1,y:0,duration:.22},0).to(pixelField,{autoAlpha:item.pixels,duration:.34},0).to(ghost,{autoAlpha:item.ghost,duration:.38},0).to(arcs,{opacity:.22,duration:.2},0).to(nodes,{opacity:(index)=>nodes[index]===activeNode?1:.52,duration:.18},0);
    if(activeArc) tl.fromTo(activeArc,{strokeDashoffset:100,opacity:.5},{strokeDashoffset:0,opacity:1,duration:.42,ease:'power2.out'},.02);
    if(activeNode) tl.fromTo(activeNode,{scale:.92},{scale:1,duration:.18},.02);
  }
  function reset(){
    if(pinned) return; visual.removeAttribute('data-story-active'); nodes.forEach((node)=>node.classList.remove('is-active','is-complete','is-future')); arcs.forEach((arc)=>arc.classList.remove('is-active','is-complete')); readout.setAttribute('aria-hidden','true');
    if(!gs||isReduced()){ pixelField.style.opacity='.62'; ghost.style.opacity='.09'; nodes.forEach((node)=>node.style.opacity='1'); arcs.forEach((arc)=>{arc.style.opacity='';arc.style.strokeDashoffset='';}); readout.style.opacity='0'; return; }
    gs.to(pixelField,{autoAlpha:.62,duration:.32,ease:'power3.out',overwrite:'auto'}); gs.to(ghost,{autoAlpha:.09,duration:.32,ease:'power3.out',overwrite:'auto'}); gs.to(arcs,{opacity:.48,strokeDashoffset:0,duration:.3,ease:'power3.out',overwrite:'auto'}); gs.to(nodes,{opacity:1,scale:1,duration:.2,ease:'power3.out',overwrite:'auto'}); gs.to(readout,{autoAlpha:0,y:6,duration:.14,overwrite:'auto'});
  }
  function entrance(){ if(!gs||isReduced()) return; gs.set(readout,{autoAlpha:0,y:6}); gs.set(arcs,{strokeDasharray:100,strokeDashoffset:100,opacity:0}); gs.set(nodes,{autoAlpha:0,scale:.7}); gs.set(pixelField,{autoAlpha:0}); const tl=gs.timeline({defaults:{ease:'power3.out'}}); tl.to(arcs,{strokeDashoffset:0,opacity:.48,duration:.68,stagger:.07}).to(pixelField,{autoAlpha:.62,duration:.5},'-=.42').to(nodes,{autoAlpha:1,scale:1,duration:.26,stagger:.045},'-=.3'); }
  nodes.forEach((node)=>{ node.addEventListener('mouseenter',()=>{if(canHover())render(node.dataset.story);},{signal}); node.addEventListener('mouseleave',()=>{if(canHover()&&!pinned)resetTimer=window.setTimeout(reset,120);},{signal}); node.addEventListener('focus',()=>render(node.dataset.story),{signal}); node.addEventListener('blur',()=>{if(!pinned)resetTimer=window.setTimeout(reset,120);},{signal}); node.addEventListener('click',(event)=>{event.preventDefault();const same=pinned&&visual.dataset.storyActive===node.dataset.story;pinned=!same;visual.dataset.storyPinned=pinned?'true':'false';if(same)reset();else render(node.dataset.story);},{signal}); });
  readout.addEventListener('mouseenter',()=>clearTimeout(resetTimer),{signal}); readout.addEventListener('mouseleave',()=>{if(!pinned)resetTimer=window.setTimeout(reset,120);},{signal}); document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){pinned=false;visual.dataset.storyPinned='false';reset();}},{signal}); window.addEventListener('pagehide',()=>aborter.abort(),{once:true}); reset(); entrance();
})();
</script>
<!-- nrs-hero-story-v23-runtime:end -->`;
html = html.replace('</body>', `${runtime}\n</body>`);

css = css
  .replace(/\/\* nrs-hero-story-v20:start \*\/[\s\S]*?\/\* nrs-hero-story-v20:end \*\//g, '')
  .replace(/\/\* nrs-hero-story-v21:start \*\/[\s\S]*?\/\* nrs-hero-story-v21:end \*\//g, '')
  .replace(/\/\* nrs-hero-story-v22:start \*\/[\s\S]*?\/\* nrs-hero-story-v22:end \*\//g, '')
  .replace(/\/\* nrs-hero-story-v22-polish:start \*\/[\s\S]*?\/\* nrs-hero-story-v22-polish:end \*\//g, '')
  .replace(/\/\* nrs-hero-story-v23:start \*\/[\s\S]*?\/\* nrs-hero-story-v23:end \*\//g, '')
  .trimEnd();

css += `

/* nrs-hero-story-v23:start */
.nrs-uploaded-hero-v19{--nrs-field-orange:#ef6a2c;--nrs-field-signal:#f4efe6;--nrs-field-line:rgba(239,106,44,.36);--nrs-field-faint:rgba(239,106,44,.13)}
html[data-theme="light"] .nrs-uploaded-hero-v19{--nrs-field-orange:#d95a20;--nrs-field-signal:#171512;--nrs-field-line:rgba(217,90,32,.34);--nrs-field-faint:rgba(217,90,32,.12)}
.nrs-uploaded-hero-v19 .nrs-uploaded-visual{width:min(100%,650px)!important;max-width:650px!important;overflow:visible!important;isolation:isolate!important}
.nrs-uploaded-hero-v19 .nrs-original-portrait:not(.nrs-original-portrait-ghost){z-index:6!important}
.nrs-uploaded-hero-v19 .nrs-original-portrait-ghost{z-index:1!important;opacity:.09!important;transform:translateX(-50%) scale(.96)!important;filter:grayscale(1) contrast(1.08)!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-original-portrait-ghost{opacity:.045!important}
.nrs-uploaded-hero-v19 .nrs-orbit,.nrs-uploaded-hero-v19 .nrs-story-thread,.nrs-uploaded-hero-v19 .nrs-story-noise,.nrs-uploaded-hero-v19 .nrs-pixel-field{display:none!important}
.nrs-uploaded-hero-v19 .nrs-visual-grid{inset:-2% -8% 0 -8%!important;z-index:0!important;opacity:.34!important;background-size:32px 32px!important;mask-image:radial-gradient(ellipse 72% 70% at 51% 49%,#000 0 42%,rgba(0,0,0,.55) 69%,transparent 96%)!important;-webkit-mask-image:radial-gradient(ellipse 72% 70% at 51% 49%,#000 0 42%,rgba(0,0,0,.55) 69%,transparent 96%)!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-visual-grid{opacity:.22!important}
.nrs-uploaded-hero-v19 .nrs-decision-field{position:absolute!important;inset:-10% -13% -8% -13%!important;z-index:2!important;pointer-events:none!important;overflow:visible!important}
.nrs-uploaded-hero-v19 .nrs-decision-arcs{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;overflow:visible!important}
.nrs-uploaded-hero-v19 .nrs-field-arc{fill:none!important;stroke:var(--nrs-field-line)!important;stroke-width:.33!important;stroke-linecap:round!important;vector-effect:non-scaling-stroke!important;opacity:.48;filter:drop-shadow(0 0 5px var(--nrs-field-faint))!important;transition:stroke .18s ease,opacity .18s ease!important}
.nrs-uploaded-hero-v19 .nrs-field-arc-a{stroke-dasharray:2 2.4!important}.nrs-uploaded-hero-v19 .nrs-field-arc-b{stroke-width:.22!important;opacity:.36}.nrs-uploaded-hero-v19 .nrs-field-arc-c{stroke-dasharray:.8 2.7!important;stroke-width:.24!important;opacity:.32}.nrs-uploaded-hero-v19 .nrs-field-arc-signal{stroke:color-mix(in srgb,var(--nrs-field-signal) 72%,transparent)!important;stroke-width:.42!important;opacity:.44}
.nrs-uploaded-hero-v19 .nrs-field-arc.is-complete{stroke:color-mix(in srgb,var(--nrs-field-orange) 76%,transparent)!important;opacity:.62!important}.nrs-uploaded-hero-v19 .nrs-field-arc.is-active{stroke:var(--nrs-field-orange)!important;opacity:1!important;filter:drop-shadow(0 0 7px color-mix(in srgb,var(--nrs-field-orange) 38%,transparent))!important}.nrs-uploaded-hero-v19 .nrs-field-arc-signal.is-active{stroke:var(--nrs-field-signal)!important;filter:drop-shadow(0 0 9px color-mix(in srgb,var(--nrs-field-signal) 34%,transparent))!important}
.nrs-uploaded-hero-v19 .nrs-field-pixels{position:absolute!important;inset:0!important;opacity:.62;will-change:opacity!important;mask-image:radial-gradient(ellipse 65% 66% at 51% 48%,transparent 0 43%,rgba(0,0,0,.28) 49%,#000 58%,#000 79%,transparent 97%)!important;-webkit-mask-image:radial-gradient(ellipse 65% 66% at 51% 48%,transparent 0 43%,rgba(0,0,0,.28) 49%,#000 58%,#000 79%,transparent 97%)!important}
.nrs-uploaded-hero-v19 .nrs-field-pixels i{position:absolute!important;left:var(--field-x)!important;top:var(--field-y)!important;width:var(--field-size)!important;height:var(--field-size)!important;background:var(--nrs-field-orange)!important;opacity:var(--field-alpha)!important;border-radius:0!important;box-shadow:0 0 6px color-mix(in srgb,var(--nrs-field-orange) 35%,transparent)!important}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-field-pixels{filter:opacity(.72)!important}
.nrs-uploaded-hero-v19 .nrs-story-node{position:absolute!important;z-index:9!important;width:34px!important;height:34px!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:var(--nrs-u-ink)!important;cursor:pointer!important;appearance:none!important;outline:none!important;transform:translate(-50%,-50%)!important;opacity:1}
.nrs-uploaded-hero-v19 .nrs-story-dot{position:absolute!important;inset:13px!important;border-radius:50%!important;background:var(--nrs-field-orange)!important;box-shadow:0 0 0 4px color-mix(in srgb,var(--nrs-field-orange) 9%,transparent),0 0 14px color-mix(in srgb,var(--nrs-field-orange) 26%,transparent)!important;transition:transform .16s cubic-bezier(.2,0,0,1),box-shadow .16s ease!important}
.nrs-uploaded-hero-v19 .nrs-story-node:hover .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-node:focus-visible .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-node.is-active .nrs-story-dot{transform:scale(1.65)!important;box-shadow:0 0 0 6px color-mix(in srgb,var(--nrs-field-orange) 12%,transparent),0 0 22px color-mix(in srgb,var(--nrs-field-orange) 42%,transparent)!important}
.nrs-uploaded-hero-v19 .nrs-story-signal .nrs-story-dot{background:var(--nrs-field-signal)!important;box-shadow:0 0 0 4px color-mix(in srgb,var(--nrs-field-signal) 9%,transparent),0 0 16px color-mix(in srgb,var(--nrs-field-signal) 28%,transparent)!important}
.nrs-uploaded-hero-v19 .nrs-story-node.is-future{opacity:.5!important}.nrs-uploaded-hero-v19 .nrs-story-node.is-complete{opacity:.72!important}
.nrs-uploaded-hero-v19 .nrs-story-problem{left:5%!important;top:69%!important}.nrs-uploaded-hero-v19 .nrs-story-rules{left:47%!important;top:4%!important}.nrs-uploaded-hero-v19 .nrs-story-state{left:101%!important;top:43%!important}.nrs-uploaded-hero-v19 .nrs-story-choice{left:84%!important;top:89%!important}.nrs-uploaded-hero-v19 .nrs-story-signal{left:2%!important;top:43%!important}
.nrs-uploaded-hero-v19 .nrs-story-node-label{position:absolute!important;left:20px!important;top:50%!important;transform:translateY(-50%) translateX(-3px)!important;width:max-content!important;padding:4px 6px!important;border:1px solid color-mix(in srgb,var(--nrs-u-ink) 14%,transparent)!important;background:color-mix(in srgb,var(--nrs-u-page) 94%,transparent)!important;color:var(--nrs-u-soft)!important;font:700 7px/1 var(--nrs-u-mono)!important;letter-spacing:.065em!important;text-transform:uppercase!important;opacity:0!important;pointer-events:none!important;transition:opacity .12s ease,transform .16s cubic-bezier(.2,0,0,1)!important}.nrs-uploaded-hero-v19 .nrs-story-state .nrs-story-node-label,.nrs-uploaded-hero-v19 .nrs-story-choice .nrs-story-node-label{left:auto!important;right:20px!important;transform:translateY(-50%) translateX(3px)!important}.nrs-uploaded-hero-v19 .nrs-story-node:hover .nrs-story-node-label,.nrs-uploaded-hero-v19 .nrs-story-node:focus-visible .nrs-story-node-label,.nrs-uploaded-hero-v19 .nrs-story-node.is-active .nrs-story-node-label{opacity:1!important;transform:translateY(-50%) translateX(0)!important}
.nrs-uploaded-hero-v19 .nrs-story-readout{position:absolute!important;z-index:10!important;right:-2%!important;bottom:5%!important;width:218px!important;padding:10px 11px!important;border:1px solid color-mix(in srgb,var(--nrs-u-ink) 16%,transparent)!important;background:color-mix(in srgb,var(--nrs-u-page) 94%,transparent)!important;backdrop-filter:blur(14px)!important;box-shadow:0 14px 36px rgba(0,0,0,.12)!important;opacity:0;transform:translateY(6px)}
.nrs-uploaded-hero-v19 .nrs-story-readout[aria-hidden="true"]{pointer-events:none!important}.nrs-uploaded-hero-v19 .nrs-story-readout-head{display:flex!important;justify-content:space-between!important;gap:10px!important;margin:0 0 6px!important;color:var(--nrs-field-orange)!important;font:700 6.5px/1 var(--nrs-u-mono)!important;letter-spacing:.08em!important;text-transform:uppercase!important}.nrs-uploaded-hero-v19 .nrs-story-readout strong{display:block!important;margin:0 0 6px!important;color:var(--nrs-u-ink)!important;font:720 10px/1.35 var(--nrs-u-sans)!important}.nrs-uploaded-hero-v19 .nrs-story-readout code{display:block!important;color:var(--nrs-u-soft)!important;background:none!important;padding:0!important;font:600 7px/1.3 var(--nrs-u-mono)!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{left:2%!important;bottom:8%!important;width:35%!important;padding-left:10px!important;border-left:2px solid var(--nrs-field-orange)!important;font-size:7.4px!important;line-height:1.5!important;opacity:.72!important}.nrs-uploaded-hero-v19 .nrs-uploaded-meta{left:2%!important;right:2%!important;bottom:-1%!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-actions{position:relative!important;z-index:20!important}.nrs-uploaded-hero-v19 .nrs-uploaded-btn{opacity:1!important;visibility:visible!important;color:var(--nrs-u-ink)!important;-webkit-text-fill-color:currentColor!important}.nrs-uploaded-hero-v19 .nrs-uploaded-btn::before,.nrs-uploaded-hero-v19 .nrs-uploaded-btn::after{content:none!important;display:none!important}.nrs-uploaded-hero-v19 .nrs-uploaded-btn-primary{background:var(--nrs-u-primary)!important;color:var(--nrs-u-primary-ink)!important;-webkit-text-fill-color:var(--nrs-u-primary-ink)!important}
@media(max-width:1100px){.nrs-uploaded-hero-v19 .nrs-decision-field{inset:-6% -5% -6% -5%!important}.nrs-uploaded-hero-v19 .nrs-story-state{left:97%!important}.nrs-uploaded-hero-v19 .nrs-story-problem{left:8%!important}}
@media(max-width:960px){.nrs-uploaded-hero-v19 .nrs-decision-field{inset:-3% 0!important}.nrs-uploaded-hero-v19 .nrs-story-readout{right:2%!important;bottom:8%!important}.nrs-uploaded-hero-v19 .nrs-story-node-label{display:none!important}}
@media(max-width:720px){.nrs-uploaded-hero-v19 .nrs-story-node{width:40px!important;height:40px!important}.nrs-uploaded-hero-v19 .nrs-story-dot{inset:16px!important}.nrs-uploaded-hero-v19 .nrs-story-readout{width:min(210px,48%)!important}.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{width:42%!important}}
@media(prefers-reduced-motion:reduce){.nrs-uploaded-hero-v19 .nrs-field-arc,.nrs-uploaded-hero-v19 .nrs-field-pixels,.nrs-uploaded-hero-v19 .nrs-story-dot,.nrs-uploaded-hero-v19 .nrs-story-readout{transition:none!important;animation:none!important}}
/* nrs-hero-story-v23:end */
`;
fs.writeFileSync(homePath, html, 'utf8');
fs.writeFileSync(stylePath, css, 'utf8');
const checks = [html.includes('nrs-decision-field'), html.includes('data-story="problem"'), html.includes('nrs-hero-story-v23-runtime:start'), !html.includes('nrs-hero-story-v21-runtime:start'), css.includes('nrs-hero-story-v23:start')];
if (checks.some(/** Callback contract: Processes the callback step for checks without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (value) => !value)) throw new Error('[hero-story-v23] Verification failed.');
console.log('[hero-story-v23] Rebuilt decision field: static broken arcs, compact product-design story, no hover parallax.');
