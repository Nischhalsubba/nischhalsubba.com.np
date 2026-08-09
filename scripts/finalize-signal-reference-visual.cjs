const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath)) throw new Error(`[exact-hero] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[exact-hero] Missing ${stylePath}`);

let html = fs.readFileSync(homePath, 'utf8');
const exactStart = html.indexOf('<section class="nrs-exact-hero-v17"');
const legacyStart = html.indexOf('<section class="agent-hero"');
const heroStart = exactStart >= 0 ? exactStart : legacyStart;
const nextSection = heroStart >= 0 ? html.indexOf('<section class="agent-section"', heroStart) : -1;
if (heroStart < 0 || nextSection < 0) {
  throw new Error('[exact-hero] Stable homepage hero section boundaries were not found.');
}

const hero = `<section class="nrs-exact-hero-v17" aria-labelledby="nrs-hero-title">
  <div class="nrs-hero-inner">
    <div class="nrs-hero-copy">
      <div class="nrs-kicker">Senior product designer · Kathmandu, Nepal · Remote</div>
      <h1 id="nrs-hero-title">I turn complicated product logic into interfaces people can act on.</h1>
      <div class="nrs-hero-support">
        <p class="nrs-lead">I’m Nischhal Raj Subba. For 6+ years I’ve worked across SaaS, Web3, fintech, enterprise software and product websites, from early product structure through interface systems and implementation handoff.</p>
        <div class="nrs-actions">
          <a href="#selected-work" class="nrs-btn nrs-btn-primary">View selected work <span aria-hidden="true">↗</span></a>
          <a href="/about" class="nrs-btn">Experience and approach <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>

    <div class="nrs-visual" aria-label="Portrait visual">
      <div class="nrs-visual-art" aria-hidden="true">
        <div class="nrs-grid"></div>
        <div class="nrs-portrait nrs-portrait-ghost"></div>
        <div class="nrs-portrait nrs-portrait-main"></div>
        <div class="nrs-portrait nrs-portrait-detail"></div>
        <svg class="nrs-orbits" viewBox="0 0 390 470" aria-hidden="true">
          <ellipse class="nrs-orbit nrs-orbit-a" cx="226" cy="225" rx="126" ry="111" transform="rotate(-10 226 225)" />
          <ellipse class="nrs-orbit nrs-orbit-b" cx="219" cy="231" rx="112" ry="129" transform="rotate(31 219 231)" />
        </svg>
        <span class="nrs-dot nrs-dot-1"></span><span class="nrs-dot nrs-dot-2"></span><span class="nrs-dot nrs-dot-3"></span><span class="nrs-dot nrs-dot-4"></span><span class="nrs-dot nrs-dot-5"></span><span class="nrs-dot nrs-dot-6"></span><span class="nrs-dot nrs-dot-7"></span><span class="nrs-dot nrs-dot-8"></span><span class="nrs-dot nrs-dot-9"></span>
      </div>
      <p class="nrs-thesis">My job is usually the same: find the product logic, expose the important state and make the next decision easier.</p>
      <div class="nrs-meta" aria-hidden="true"><span>6+ years</span><span>SaaS · Web3 · Fintech</span><span>Design · Implementation</span></div>
    </div>
  </div>
</section>`;

html = html.slice(0, heroStart) + hero + '\n' + html.slice(nextSection);
html = html.replace(/<!-- nrs-signal-demo-v1[567]-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v1[567]-runtime:end -->/g, '');
fs.writeFileSync(homePath, html, 'utf8');

const start = '/* nrs-exact-hero-v17:start */';
const end = '/* nrs-exact-hero-v17:end */';
const exactMarker = /\/\* nrs-exact-hero-v\d+:start \*\/[\s\S]*?\/\* nrs-exact-hero-v\d+:end \*\//g;
const oldReferenceMarker = /\/\* nrs-signal-reference-v\d+:start \*\/[\s\S]*?\/\* nrs-signal-reference-v\d+:end \*\//g;

const css = `${start}
.nrs-exact-hero-v17{
  --nrs-orange:#ef6a2c;
  --nrs-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;
  --nrs-sans:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --nrs-page:#0b0c0a;--nrs-ink:#f7f2e8;--nrs-soft:#d8d1c5;--nrs-line:rgba(247,242,232,.13);--nrs-primary:#f7f2e8;--nrs-primary-ink:#11110f;
  min-height:100vh;display:flex;align-items:center;overflow:hidden;background:var(--nrs-page);color:var(--nrs-ink);font-family:var(--nrs-sans);transition:background .22s ease,color .22s ease;
}
html[data-theme='light'] .nrs-exact-hero-v17{--nrs-page:#f4f0e8;--nrs-ink:#11110f;--nrs-soft:#4c473f;--nrs-line:rgba(17,17,15,.13);--nrs-primary:#11110f;--nrs-primary-ink:#f7f2e8;}
.nrs-exact-hero-v17 *{box-sizing:border-box}
.nrs-exact-hero-v17 .nrs-hero-inner{width:min(1320px,calc(100% - 64px));margin:auto;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(400px,.95fr);gap:clamp(48px,7vw,112px);align-items:center;padding:clamp(90px,10vw,145px) 0;}
.nrs-exact-hero-v17 .nrs-hero-copy{min-width:0}
.nrs-exact-hero-v17 .nrs-kicker{display:flex;align-items:center;gap:10px;margin-bottom:30px;color:var(--nrs-soft);font:700 10px/1.4 var(--nrs-mono);text-transform:uppercase;letter-spacing:.07em;}
.nrs-exact-hero-v17 .nrs-kicker::before{content:"";width:8px;height:8px;background:var(--nrs-orange);flex:none}
.nrs-exact-hero-v17 h1{max-width:11ch;margin:0;font-size:clamp(50px,5.4vw,84px);line-height:.93;letter-spacing:-.06em;font-weight:800;text-wrap:balance;color:var(--nrs-ink);font-family:var(--nrs-sans);}
.nrs-exact-hero-v17 .nrs-hero-support{display:grid;grid-template-columns:minmax(220px,.72fr) minmax(280px,1fr);gap:28px 42px;margin-top:30px;align-items:end;}
.nrs-exact-hero-v17 .nrs-lead{max-width:21ch;margin:0;color:var(--nrs-soft);font-size:clamp(17px,1.25vw,21px);line-height:1.5;}
.nrs-exact-hero-v17 .nrs-actions{display:flex;flex-wrap:wrap;gap:10px;}
.nrs-exact-hero-v17 .nrs-btn{display:inline-flex;align-items:center;gap:14px;min-height:48px;padding:0 16px;border:1px solid var(--nrs-line);color:var(--nrs-ink);background:transparent;text-decoration:none;font:700 10px/1 var(--nrs-mono);text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;transition:transform .18s ease,background .18s ease,color .18s ease;}
.nrs-exact-hero-v17 .nrs-btn:hover{transform:translateY(-1px)}
.nrs-exact-hero-v17 .nrs-btn-primary{background:var(--nrs-primary);color:var(--nrs-primary-ink);border-color:var(--nrs-primary);}
.nrs-exact-hero-v17 .nrs-visual{position:relative;width:min(100%,570px);justify-self:end;aspect-ratio:390/590;overflow:visible;isolation:isolate;}
.nrs-exact-hero-v17 .nrs-visual-art{position:absolute;left:50%;top:44%;width:118%;aspect-ratio:390/470;transform:translate(-50%,-50%);pointer-events:none;user-select:none;isolation:isolate;overflow:visible;}
.nrs-exact-hero-v17 .nrs-visual-art::after{content:"";position:absolute;inset:-6%;z-index:9;pointer-events:none;background:radial-gradient(ellipse 69% 76% at 54% 48%,transparent 0 58%,color-mix(in srgb,var(--nrs-page) 18%,transparent) 74%,var(--nrs-page) 100%);}
.nrs-exact-hero-v17 .nrs-grid{position:absolute;inset:5% 3% 5% 1%;z-index:0;background-image:linear-gradient(rgba(239,106,44,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(239,106,44,.07) 1px,transparent 1px);background-size:31px 31px;opacity:.62;-webkit-mask-image:radial-gradient(ellipse 70% 78% at 53% 49%,#000 0 47%,rgba(0,0,0,.65) 69%,transparent 100%);mask-image:radial-gradient(ellipse 70% 78% at 53% 49%,#000 0 47%,rgba(0,0,0,.65) 69%,transparent 100%);}
.nrs-exact-hero-v17 .nrs-portrait{position:absolute;inset:-5% -7% -7% -6%;z-index:2;background-image:url('/assets/images/portrait.png');background-repeat:no-repeat;background-position:61% 48%;background-size:86% auto;pointer-events:none;-webkit-mask-image:radial-gradient(ellipse 66% 78% at 58% 49%,#000 0 48%,rgba(0,0,0,.95) 62%,rgba(0,0,0,.55) 79%,rgba(0,0,0,.12) 91%,transparent 100%);mask-image:radial-gradient(ellipse 66% 78% at 58% 49%,#000 0 48%,rgba(0,0,0,.95) 62%,rgba(0,0,0,.55) 79%,rgba(0,0,0,.12) 91%,transparent 100%);}
.nrs-exact-hero-v17 .nrs-portrait-main{filter:saturate(.82) contrast(1.08) brightness(.92);opacity:.98;}
.nrs-exact-hero-v17 .nrs-portrait-ghost{z-index:1;background-position:38% 46%;background-size:91% auto;transform:translate(-8%,-1%) scale(1.02);filter:grayscale(1) sepia(.2) contrast(1.15) brightness(.52);opacity:.17;mix-blend-mode:screen;}
.nrs-exact-hero-v17 .nrs-portrait-detail{display:none}
.nrs-exact-hero-v17 .nrs-orbits{position:absolute;inset:0;width:100%;height:100%;z-index:5;overflow:visible;filter:drop-shadow(0 0 9px rgba(239,106,44,.18));}
.nrs-exact-hero-v17 .nrs-orbit{fill:none;stroke:rgba(239,106,44,.68);stroke-width:1.05;}
.nrs-exact-hero-v17 .nrs-orbit-a{stroke:rgba(239,106,44,.92);stroke-width:1.15}.nrs-exact-hero-v17 .nrs-orbit-b{opacity:.72}
.nrs-exact-hero-v17 .nrs-dot{position:absolute;z-index:6;border-radius:50%;background:var(--nrs-orange);box-shadow:0 0 10px rgba(239,106,44,.6)}
.nrs-exact-hero-v17 .nrs-dot-1{width:10px;height:10px;left:14%;top:59%}.nrs-exact-hero-v17 .nrs-dot-2{width:8px;height:8px;left:26%;top:72%}.nrs-exact-hero-v17 .nrs-dot-3{width:11px;height:11px;left:74%;top:31%}.nrs-exact-hero-v17 .nrs-dot-4{width:14px;height:14px;left:82%;top:63%}.nrs-exact-hero-v17 .nrs-dot-5{width:9px;height:9px;left:59%;top:75%}.nrs-exact-hero-v17 .nrs-dot-6{width:5px;height:5px;left:89%;top:41%}.nrs-exact-hero-v17 .nrs-dot-7{width:4px;height:4px;left:18%;top:20%}.nrs-exact-hero-v17 .nrs-dot-8{width:4px;height:4px;left:67%;top:12%}.nrs-exact-hero-v17 .nrs-dot-9{width:3px;height:3px;left:93%;top:52%}
.nrs-exact-hero-v17 .nrs-thesis{position:absolute;left:10%;bottom:17%;z-index:12;width:min(48%,260px);margin:0;color:var(--nrs-soft);font:700 clamp(9px,.7vw,11px)/1.55 var(--nrs-mono);text-transform:uppercase;letter-spacing:.01em;}
.nrs-exact-hero-v17 .nrs-meta{position:absolute;left:10%;right:2%;bottom:5%;z-index:12;display:flex;justify-content:space-between;gap:14px;color:color-mix(in srgb,var(--nrs-soft) 84%,transparent);font:700 8px/1.4 var(--nrs-mono);text-transform:uppercase;letter-spacing:.05em;}
.nrs-exact-hero-v17 .nrs-meta span{white-space:nowrap}
html[data-theme='light'] .nrs-exact-hero-v17 .nrs-grid{background-image:linear-gradient(rgba(17,17,15,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(17,17,15,.045) 1px,transparent 1px);opacity:.48}
html[data-theme='light'] .nrs-exact-hero-v17 .nrs-portrait-main{filter:saturate(.82) contrast(1.02) brightness(1.03);mix-blend-mode:screen;opacity:.98;}
html[data-theme='light'] .nrs-exact-hero-v17 .nrs-portrait-detail{display:block;z-index:3;background-position:61% 48%;background-size:86% auto;filter:saturate(.78) contrast(1.06);mix-blend-mode:multiply;opacity:.84;-webkit-mask-image:radial-gradient(ellipse 36% 47% at 60% 45%,#000 0 48%,rgba(0,0,0,.8) 68%,rgba(0,0,0,.2) 88%,transparent 100%);mask-image:radial-gradient(ellipse 36% 47% at 60% 45%,#000 0 48%,rgba(0,0,0,.8) 68%,rgba(0,0,0,.2) 88%,transparent 100%);}
html[data-theme='light'] .nrs-exact-hero-v17 .nrs-portrait-ghost{filter:grayscale(1) sepia(.08) brightness(1.34) contrast(.9);opacity:.085;mix-blend-mode:multiply;}
html[data-theme='light'] .nrs-exact-hero-v17 .nrs-orbit{stroke:rgba(239,106,44,.52)}html[data-theme='light'] .nrs-exact-hero-v17 .nrs-orbit-a{stroke:rgba(239,106,44,.82)}
html[data-theme='light'] .nrs-exact-hero-v17 .nrs-dot{box-shadow:0 0 12px rgba(239,106,44,.28)}
@media(max-width:980px){.nrs-exact-hero-v17 .nrs-hero-inner{grid-template-columns:1fr;width:min(760px,calc(100% - 36px));}.nrs-exact-hero-v17 .nrs-hero-support{grid-template-columns:1fr}.nrs-exact-hero-v17 .nrs-lead{max-width:36ch}.nrs-exact-hero-v17 .nrs-visual{justify-self:center;width:min(100%,600px)}}
@media(max-width:620px){.nrs-exact-hero-v17 .nrs-hero-inner{padding:90px 0 60px}.nrs-exact-hero-v17 h1{font-size:clamp(44px,14vw,66px)}.nrs-exact-hero-v17 .nrs-visual{width:100%}.nrs-exact-hero-v17 .nrs-thesis{left:6%;bottom:15%;width:58%}.nrs-exact-hero-v17 .nrs-meta{left:6%;right:3%;font-size:7px}}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(exactMarker, '').replace(oldReferenceMarker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const written = fs.readFileSync(homePath, 'utf8');
for (const token of ['class="nrs-exact-hero-v17"', 'id="nrs-hero-title"', 'class="nrs-visual"', 'View selected work', 'Experience and approach']) {
  if (!written.includes(token)) throw new Error(`[exact-hero] Final homepage assertion failed: ${token}`);
}
if (written.includes('data-signal-demo-v16')) throw new Error('[exact-hero] Legacy interactive Signal stage survived final replacement.');
console.log('[exact-hero] Replaced the homepage hero with the approved dark/light HTML composition.');
