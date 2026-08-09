const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath)) throw new Error(`[signal-demo-v16] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[signal-demo-v16] Missing ${stylePath}`);

const stageMarkup = `<div class="agent-system-figure nrs-demo-stage" id="nrs-demo-stage" data-signal-demo-v16 aria-label="Interactive Signal over Noise portrait composition">
  <div class="nrs-demo-grid" aria-hidden="true"></div>
  <img class="nrs-demo-portrait nrs-demo-portrait-main" src="/assets/images/portrait.png" alt="" loading="eager" decoding="async" aria-hidden="true">
  <img class="nrs-demo-portrait nrs-demo-portrait-ghost" src="/assets/images/portrait.png" alt="" loading="eager" decoding="async" aria-hidden="true">
  <div class="nrs-demo-halftone" aria-hidden="true"></div>
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
  <div class="nrs-demo-poster-copy" aria-hidden="true"><strong>MY JOB IS USUALLY THE SAME: FIND<br>THE PRODUCT LOGIC, EXPOSE THE<br>IMPORTANT STATE AND MAKE THE NEXT<br>DECISION EASIER.</strong></div>
  <div class="nrs-demo-poster-meta" aria-hidden="true"><span>6+ YEARS</span><span>SAAS <i></i> WEB3 <i></i> FINTECH</span><span>DESIGN <i></i> IMPLEMENTATION</span></div>
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
html = html.replace(/<!-- nrs-signal-demo-v(?:14|15|16)-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v(?:14|15|16)-runtime:end -->/g, '');

const figureStart = html.search(/<div class="agent-system-figure\b/i);
if (figureStart < 0) throw new Error('[signal-demo-v16] Homepage hero figure start not found.');
const footMatch = /<div class="agent-hero-foot\b/i.exec(html.slice(figureStart));
if (!footMatch) throw new Error('[signal-demo-v16] Homepage hero foot boundary not found.');
const footStart = figureStart + footMatch.index;
html = html.slice(0, figureStart) + stageMarkup + '\n' + html.slice(footStart);

const runtime = `<!-- nrs-signal-demo-v16-runtime:start -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"><\/script>
<script>
(() => {
  const stage = document.querySelector('[data-signal-demo-v16]');
  if (!stage || stage.dataset.runtimeReady === 'true') return;
  stage.dataset.runtimeReady = 'true';
  const main = stage.querySelector('.nrs-demo-portrait-main');
  const ghost = stage.querySelector('.nrs-demo-portrait-ghost');
  const nodes = [...stage.querySelectorAll('.nrs-demo-state-node')];
  const signal = stage.querySelector('#nrs-demo-signal-node');
  const connector = stage.querySelector('#nrs-demo-connector');
  const halo = stage.querySelector('#nrs-demo-signal-halo');
  const orbit = stage.querySelector('#nrs-demo-orbit-main');
  const orbitSvg = stage.querySelector('.nrs-demo-orbit-svg');
  const card = stage.querySelector('#nrs-demo-insight-card');
  const kicker = stage.querySelector('#nrs-demo-insight-kicker');
  const title = stage.querySelector('#nrs-demo-insight-title');
  const copy = stage.querySelector('#nrs-demo-insight-copy');
  const thesis = stage.querySelector('#nrs-demo-thesis');
  const meanings = {
    intent:['Intent','What is the person actually trying to accomplish?','The system begins with user intent, not interface decoration.'],
    logic:['Product logic','What rules decide what can happen next?','The orbit behaves like a rule system: inputs enter, constraints shape them, decisions leave.'],
    state:['Important state','What does the system need to expose right now?','Good state is usually discovered before it is displayed.'],
    decision:['Decision','What information makes the next action obvious?','The end of the loop is not more data. It is a clearer next move.']
  };
  let signalMode = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!window.gsap;
  const d = s => reduced ? .001 : s;
  const setOpacity = (el, value) => { if (el) el.style.opacity = String(value); };

  function showState(node) {
    const m = meanings[node.dataset.state];
    nodes.forEach(n => { const on=n===node; n.classList.toggle('active',on); n.setAttribute('aria-pressed',on?'true':'false'); });
    connector.setAttribute('x2',node.dataset.x); connector.setAttribute('y2',node.dataset.y);
    kicker.textContent=m[0]; title.textContent=m[1]; copy.textContent=m[2]; card.setAttribute('aria-hidden','false');
    if (hasGSAP) {
      gsap.to(nodes,{autoAlpha:.42,scale:.92,duration:d(.22),overwrite:'auto'});
      gsap.to(node,{autoAlpha:1,scale:1.34,duration:d(.2),overwrite:'auto'});
      gsap.to(ghost,{autoAlpha:(node.dataset.state==='logic'||node.dataset.state==='state')?.34:.2,x:(node.dataset.state==='logic'||node.dataset.state==='state')?-8:0,duration:d(.42),overwrite:'auto'});
      gsap.fromTo(connector,{autoAlpha:0,strokeDashoffset:4},{autoAlpha:1,strokeDashoffset:0,duration:d(.24),overwrite:'auto'});
      gsap.fromTo(card,{y:8,autoAlpha:0},{y:0,autoAlpha:1,duration:d(.26),overwrite:'auto'});
      gsap.to(orbit,{stroke:'rgba(255,132,70,.98)',duration:d(.22),overwrite:'auto'});
    } else { setOpacity(ghost,.25); setOpacity(connector,1); setOpacity(card,1); }
  }

  function resetState() {
    nodes.forEach(n => { n.classList.remove('active'); n.setAttribute('aria-pressed','false'); });
    card.setAttribute('aria-hidden','true');
    if (hasGSAP) {
      gsap.to(nodes,{autoAlpha:1,scale:1,duration:d(.2),overwrite:'auto'});
      gsap.to(connector,{autoAlpha:0,duration:d(.14),overwrite:'auto'});
      gsap.to(card,{autoAlpha:0,y:8,duration:d(.16),overwrite:'auto'});
      if (!signalMode) gsap.to(ghost,{autoAlpha:.14,x:12,duration:d(.3),overwrite:'auto'});
      gsap.to(orbit,{stroke:'rgba(239,106,44,.78)',duration:d(.2),overwrite:'auto'});
    } else { setOpacity(connector,0); setOpacity(card,0); }
  }

  function setSignal(on) {
    signalMode=on; stage.classList.toggle('signal-mode',on); signal.classList.toggle('active',on); signal.setAttribute('aria-pressed',on?'true':'false'); thesis.setAttribute('aria-hidden',on?'false':'true');
    if (hasGSAP) {
      gsap.to(main,{filter:on?'grayscale(.35) brightness(.72) contrast(1.06)':'grayscale(.08) sepia(.12) contrast(1.06)',duration:d(.35),overwrite:'auto'});
      gsap.to(ghost,{autoAlpha:on?.42:.14,x:on?-4:12,duration:d(.45),overwrite:'auto'});
      gsap.to(nodes,{autoAlpha:on?.8:1,duration:d(.3),overwrite:'auto'});
      gsap.to(orbit,{stroke:on?'rgba(255,132,70,1)':'rgba(239,106,44,.78)',strokeWidth:on?.28:.18,duration:d(.35),overwrite:'auto'});
      gsap.to(halo,{autoAlpha:on?1:0,attr:{r:on?4.2:2.4},duration:d(.35),overwrite:'auto'});
      if(on) gsap.fromTo(thesis,{y:10,autoAlpha:0},{y:0,autoAlpha:1,duration:d(.48),overwrite:'auto'}); else gsap.to(thesis,{y:10,autoAlpha:0,duration:d(.2),overwrite:'auto'});
    } else { setOpacity(thesis,on?1:0); setOpacity(ghost,on?.42:.14); }
  }

  nodes.forEach(node => {
    node.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches)showState(node)});
    node.addEventListener('mouseleave',()=>{if(matchMedia('(hover:hover)').matches&&!signalMode)resetState()});
    node.addEventListener('click',()=>showState(node));
  });
  signal.addEventListener('click',()=>setSignal(!signalMode));

  if (hasGSAP) {
    gsap.set([card,thesis],{autoAlpha:0});
    gsap.timeline({defaults:{ease:'power3.out'}})
      .fromTo(main,{autoAlpha:0,scale:1.018},{autoAlpha:1,scale:1.002,duration:d(.7)})
      .fromTo(stage.querySelectorAll('.nrs-demo-orbit-path'),{strokeDasharray:1,strokeDashoffset:1,autoAlpha:0},{strokeDashoffset:0,autoAlpha:1,duration:d(.62)},'<.08')
      .fromTo(nodes,{scale:0,autoAlpha:0},{scale:1,autoAlpha:1,duration:d(.3),stagger:reduced?0:.045},'-=.2');
    const px=gsap.quickTo(main,'x',{duration:.35,ease:'power3.out'}), py=gsap.quickTo(main,'y',{duration:.35,ease:'power3.out'}), gx=gsap.quickTo(ghost,'x',{duration:.45,ease:'power3.out'}), gy=gsap.quickTo(ghost,'y',{duration:.45,ease:'power3.out'}), ox=gsap.quickTo(orbitSvg,'x',{duration:.4,ease:'power3.out'}), oy=gsap.quickTo(orbitSvg,'y',{duration:.4,ease:'power3.out'});
    stage.addEventListener('pointermove',e=>{if(reduced||e.pointerType==='touch'||!matchMedia('(hover:hover)').matches)return;const r=stage.getBoundingClientRect(),nx=((e.clientX-r.left)/r.width-.5)*2,ny=((e.clientY-r.top)/r.height-.5)*2;px(nx*2);py(ny*2);gx(12+nx*-7);gy(ny*-5);ox(nx*5);oy(ny*4)});
    stage.addEventListener('pointerleave',()=>{px(0);py(0);gx(signalMode?-4:12);gy(0);ox(0);oy(0)});
  }
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){setSignal(false);resetState()}});
})();
<\/script>
<!-- nrs-signal-demo-v16-runtime:end -->`;
if (!html.includes('</body>')) throw new Error('[signal-demo-v16] Missing closing body tag.');
html = html.replace('</body>', `${runtime}\n</body>`);
fs.writeFileSync(homePath, html, 'utf8');

let style = fs.readFileSync(stylePath, 'utf8');
style = style
  .replace(/\/\* nrs-signal-portrait-v12:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v12:end \*\//g,'')
  .replace(/\/\* nrs-signal-portrait-v13-stage-inset:start \*\/[\s\S]*?\/\* nrs-signal-portrait-v13-stage-inset:end \*\//g,'')
  .replace(/\/\* nrs-signal-demo-v(?:14|15|16):start \*\/[\s\S]*?\/\* nrs-signal-demo-v(?:14|15|16):end \*\//g,'');
const css = `/* nrs-signal-demo-v16:start */
.agent-portfolio .nrs-demo-stage{--o:#ef6a2c;--o2:#ff8a4c;position:relative;width:100%;max-width:31rem;min-height:0!important;margin-inline-start:auto;aspect-ratio:4/5!important;border:1px solid rgba(255,255,255,.13);background:#080808;overflow:hidden;isolation:isolate;box-shadow:0 40px 100px rgba(0,0,0,.45);color:#f2f0ea}
.agent-portfolio .nrs-demo-stage::before,.agent-portfolio .nrs-demo-stage::after{content:none!important;display:none!important}.agent-portfolio .nrs-demo-stage .agent-three-canvas{display:none!important}
.agent-portfolio .nrs-demo-grid{position:absolute;inset:5%;z-index:0;background-image:linear-gradient(rgba(239,106,44,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(239,106,44,.08) 1px,transparent 1px),radial-gradient(circle,rgba(239,106,44,.22) 0 1px,transparent 1.3px);background-size:14% 14%,14% 14%,9px 9px;mask-image:linear-gradient(to bottom,#000 0 76%,transparent 91%);opacity:.66}
.agent-portfolio .nrs-demo-portrait{position:absolute;z-index:1;left:8%;top:8%;width:92%;height:76%;max-width:none;object-fit:cover;object-position:50% 28%;filter:grayscale(.08) sepia(.12) contrast(1.06);transform-origin:center;will-change:transform,filter,opacity;user-select:none;pointer-events:none}
.agent-portfolio .nrs-demo-portrait-main{clip-path:polygon(29% 0,100% 0,100% 100%,18% 100%,28% 72%,28% 34%);opacity:.98}.agent-portfolio .nrs-demo-portrait-ghost{z-index:2;left:-3%;width:72%;opacity:.14;clip-path:ellipse(39% 47% at 48% 43%);filter:grayscale(1) contrast(1.35) brightness(.52);mix-blend-mode:screen;transform:translateX(12px) scale(1.015)}
.agent-portfolio .nrs-demo-halftone{position:absolute;inset:9% 8% 29% 18%;z-index:3;pointer-events:none;background:radial-gradient(circle,rgba(239,106,44,.24) 0 1px,transparent 1.5px);background-size:6px 6px;mask-image:radial-gradient(ellipse at 62% 38%,#000 0 45%,transparent 74%);opacity:.48;mix-blend-mode:screen}.agent-portfolio .nrs-demo-noise-wash{position:absolute;inset:0;z-index:4;pointer-events:none;background:linear-gradient(to bottom,transparent 0 67%,rgba(5,5,5,.18) 73%,#080808 88%);opacity:.8}.agent-portfolio .nrs-demo-stage.signal-mode .nrs-demo-noise-wash{opacity:.95}
.agent-portfolio .nrs-demo-orbit-svg{position:absolute;inset:0;z-index:5;width:100%;height:100%;overflow:visible;pointer-events:none;filter:drop-shadow(0 0 6px rgba(239,106,44,.08))}.agent-portfolio .nrs-demo-orbit-path{fill:none;stroke:rgba(239,106,44,.58);stroke-width:.23;stroke-linecap:round;stroke-dasharray:1.7 1.2;vector-effect:non-scaling-stroke}.agent-portfolio .nrs-demo-orbit-main{stroke:rgba(239,106,44,.78);stroke-dasharray:none;stroke-width:.18}.agent-portfolio .nrs-demo-connector{stroke:rgba(233,230,223,.72);stroke-width:.16;stroke-dasharray:1.2 .8;opacity:0;vector-effect:non-scaling-stroke}.agent-portfolio .nrs-demo-signal-halo{fill:none;stroke:rgba(233,230,223,.42);stroke-width:.15;opacity:0;vector-effect:non-scaling-stroke}
.agent-portfolio .nrs-demo-node-layer{position:absolute;inset:0;z-index:7}.agent-portfolio .nrs-demo-node{position:absolute;width:44px;height:44px;min-width:44px;min-height:44px;margin:-22px 0 0 -22px;border:0;background:transparent!important;border-radius:50%;cursor:pointer;display:grid;place-items:center;padding:0;touch-action:manipulation;color:#e9e6df!important}.agent-portfolio .nrs-demo-node::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--o);box-shadow:0 0 0 1px rgba(255,160,105,.42),0 0 18px rgba(239,106,44,.18)}.agent-portfolio .nrs-demo-node::after{content:'';position:absolute;inset:10px;border:1px solid transparent;border-radius:50%}.agent-portfolio .nrs-demo-node:hover::after,.agent-portfolio .nrs-demo-node:focus-visible::after{border-color:rgba(239,106,44,.42)}.agent-portfolio .nrs-demo-node:focus-visible{outline:2px solid #fff;outline-offset:2px}.agent-portfolio .nrs-demo-signal::before{width:10px;height:10px;background:#e9e6df;box-shadow:0 0 0 1px rgba(255,255,255,.35),0 0 20px rgba(255,255,255,.18)}.agent-portfolio .nrs-demo-node.active::before{background:var(--o2);box-shadow:0 0 0 3px rgba(239,106,44,.14),0 0 24px rgba(239,106,44,.48)}.agent-portfolio .nrs-demo-signal.active::before{background:#fff;box-shadow:0 0 0 5px rgba(255,255,255,.08),0 0 26px rgba(255,255,255,.38)}
.agent-portfolio .nrs-demo-node-label{position:absolute;left:50%;top:calc(100% - 1px);transform:translateX(-50%) translateY(4px);padding:5px 7px;border:1px solid rgba(255,255,255,.12);background:rgba(8,8,8,.88);color:#ddd7cd!important;border-radius:6px;font:9px/1 var(--ap-font-mono,ui-monospace,monospace);letter-spacing:.07em;text-transform:uppercase;white-space:nowrap;opacity:0;pointer-events:none}.agent-portfolio .nrs-demo-node.active .nrs-demo-node-label,.agent-portfolio .nrs-demo-node:hover .nrs-demo-node-label,.agent-portfolio .nrs-demo-node:focus-visible .nrs-demo-node-label{opacity:1}
.agent-portfolio .nrs-demo-hidden-thesis{position:absolute;z-index:10;right:5%;top:6%;max-width:44%;padding:10px 12px;border:1px solid rgba(255,255,255,.12);background:rgba(8,8,8,.88);backdrop-filter:blur(12px);opacity:0;visibility:hidden;transform:translateY(10px);pointer-events:none}.agent-portfolio .nrs-demo-insight{position:absolute;z-index:10;left:4.5%;right:4.5%;bottom:20%;min-height:82px;display:flex;align-items:flex-end;pointer-events:none}.agent-portfolio .nrs-demo-insight-card{max-width:70%;padding:10px 12px;border-left:2px solid var(--o);background:linear-gradient(90deg,rgba(8,8,8,.94),rgba(8,8,8,.58),transparent);opacity:0;transform:translateY(8px)}.agent-portfolio .nrs-demo-hidden-thesis small,.agent-portfolio .nrs-demo-insight-card small{display:block;color:var(--o2)!important;font:9px/1.25 var(--ap-font-mono,ui-monospace,monospace);letter-spacing:.13em;text-transform:uppercase;margin-bottom:5px}.agent-portfolio .nrs-demo-hidden-thesis b,.agent-portfolio .nrs-demo-insight-card strong{display:block;color:#f2f0ea!important;font-size:14px;line-height:1.25}.agent-portfolio .nrs-demo-hidden-thesis p,.agent-portfolio .nrs-demo-insight-card p{margin:5px 0 0;color:#c5c0b8!important;font-size:10px;line-height:1.45}
.agent-portfolio .nrs-demo-poster-copy{position:absolute;z-index:8;left:8%;right:24%;bottom:13.2%;padding-top:3.2%;border-top:1px solid rgba(255,255,255,.18);color:#f0ece5!important;font:700 clamp(8px,1.12vw,13px)/1.45 var(--ap-font-display,Inter,sans-serif);letter-spacing:.05em}.agent-portfolio .nrs-demo-poster-meta{position:absolute;z-index:8;left:7%;right:7%;bottom:4.3%;padding-top:3%;border-top:1px solid rgba(255,255,255,.12);display:flex;justify-content:space-between;gap:8px;color:#c8c1b8!important;font:600 clamp(6px,.74vw,9px)/1.2 var(--ap-font-mono,ui-monospace,monospace);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}.agent-portfolio .nrs-demo-poster-meta i{display:inline-block;width:4px;height:4px;margin:0 5px;border-radius:50%;background:var(--o);vertical-align:middle}
.agent-portfolio .nrs-demo-stage~.agent-hero-foot{display:none!important}.agent-portfolio .nrs-demo-legend,.agent-portfolio .nrs-demo-hint{width:100%;max-width:31rem;margin-inline-start:auto}.agent-portfolio .nrs-demo-legend{margin-top:16px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.agent-portfolio .nrs-demo-legend div{padding:10px 11px;border-top:1px solid rgba(255,255,255,.12);font:10px/1.45 var(--ap-font-mono,ui-monospace,monospace);color:#9f9a92!important}.agent-portfolio .nrs-demo-legend b{color:#ddd7cf!important;font-weight:600}.agent-portfolio .nrs-demo-hint{margin-top:14px;margin-bottom:0;color:#8e8982!important;font-size:12px;line-height:1.6;text-align:center}
@media(max-width:899px){.agent-portfolio .nrs-demo-stage,.agent-portfolio .nrs-demo-legend,.agent-portfolio .nrs-demo-hint{width:min(calc(100% - 32px),29rem);max-width:29rem;margin-inline:auto}.agent-portfolio .nrs-demo-legend{grid-template-columns:repeat(2,minmax(0,1fr))}.agent-portfolio .nrs-demo-node{width:48px;height:48px;min-width:48px;min-height:48px;margin:-24px 0 0 -24px}.agent-portfolio .nrs-demo-poster-copy{font-size:10px}.agent-portfolio .nrs-demo-poster-meta{font-size:7px}.agent-portfolio .nrs-demo-hidden-thesis{max-width:58%;right:4%;top:4%}}
@media(max-width:480px){.agent-portfolio .nrs-demo-poster-meta{letter-spacing:.06em}.agent-portfolio .nrs-demo-poster-meta span:nth-child(2){display:none}}
@media(prefers-reduced-motion:reduce){.agent-portfolio .nrs-demo-stage *,.agent-portfolio .nrs-demo-stage *::before,.agent-portfolio .nrs-demo-stage *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
/* nrs-signal-demo-v16:end */`;
style = `${style.trim()}\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const resultHtml = fs.readFileSync(homePath, 'utf8');
const resultCss = fs.readFileSync(stylePath, 'utf8');
for (const token of ['data-signal-demo-v16','/assets/images/portrait.png','nrs-demo-state-node','nrs-signal-demo-v16-runtime:start']) if (!resultHtml.includes(token)) throw new Error(`[signal-demo-v16] Missing HTML token: ${token}`);
for (const token of ['nrs-signal-demo-v16:start','.nrs-demo-portrait-main','.nrs-demo-poster-copy']) if (!resultCss.includes(token)) throw new Error(`[signal-demo-v16] Missing CSS token: ${token}`);
console.log('[signal-demo-v16] Demo-faithful hero installed without Base64 artwork dependency.');
