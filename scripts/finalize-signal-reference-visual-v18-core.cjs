const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
if (!fs.existsSync(homePath)) throw new Error(`[hero-photo-v19] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[hero-photo-v19] Missing ${stylePath}`);

const partDir = path.join(root, 'assets', 'images', 'hero-original-v19.parts');
const encodedPortrait = ['part-00.b64','part-01.b64','part-02.b64','part-03.b64']
  .map((name) => fs.readFileSync(path.join(partDir, name), 'utf8').replace(/\s+/g, ''))
  .join('');
const portrait = Buffer.from(encodedPortrait, 'base64');
const portraitHash = crypto.createHash('sha256').update(portrait).digest('hex');
if (portrait.length !== 27932 || portraitHash !== '6de71f96f93cd310bce284222856df254aa17c89a09b0b3dbcfedb96d6da3c34') {
  throw new Error(`[hero-photo-v19] Portrait verification failed: ${portrait.length} bytes, ${portraitHash}.`);
}
const artworkDir = path.join(base, 'assets', 'images');
fs.mkdirSync(artworkDir, { recursive: true });
fs.writeFileSync(path.join(artworkDir, 'hero-portrait-original-v19.webp'), portrait);

let html = fs.readFileSync(homePath, 'utf8');
const starts = [
  html.indexOf('<section class="nrs-uploaded-hero-v19"'),
  html.indexOf('<section class="nrs-uploaded-hero-v18"'),
  html.indexOf('<section class="nrs-exact-hero-v17"'),
  html.indexOf('<section class="agent-hero"'),
].filter((value) => value >= 0);
const heroStart = starts.length ? Math.min(...starts) : -1;
const nextSection = heroStart >= 0 ? html.indexOf('<section class="agent-section"', heroStart) : -1;
if (heroStart < 0 || nextSection < 0) throw new Error('[hero-photo-v19] Stable homepage hero boundaries were not found.');

const hero = `<section class="nrs-uploaded-hero-v19" aria-labelledby="nrs-uploaded-hero-title">
  <div class="nrs-uploaded-hero-inner">
    <div class="nrs-uploaded-hero-copy">
      <div class="nrs-uploaded-kicker">Senior product designer · Kathmandu, Nepal · Remote</div>
      <h1 id="nrs-uploaded-hero-title">I turn complicated product logic into interfaces people can act on.</h1>
      <div class="nrs-uploaded-hero-support">
        <p class="nrs-uploaded-lead">I’m Nischhal Raj Subba. For 6+ years I’ve worked across SaaS, Web3, fintech, enterprise software and product websites, from early product structure through interface systems and implementation handoff.</p>
        <div class="nrs-uploaded-actions">
          <a href="#selected-work" class="nrs-uploaded-btn nrs-uploaded-btn-primary">View selected work <span aria-hidden="true">↗</span></a>
          <a href="/about" class="nrs-uploaded-btn">Experience and approach <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>
    <div class="nrs-uploaded-visual" aria-label="How I turn product logic into build-ready interface decisions">
      <div class="nrs-visual-grid" aria-hidden="true"></div>
      <img class="nrs-original-portrait nrs-original-portrait-ghost" src="/assets/images/hero-portrait-original-v19.webp" alt="" width="540" height="720" decoding="async">
      <img class="nrs-original-portrait" src="/assets/images/hero-portrait-original-v19.webp" alt="Portrait of Nischhal Raj Subba" width="540" height="720" decoding="async" fetchpriority="high">
      <svg class="nrs-orbit" viewBox="0 0 100 100" aria-hidden="true">
        <ellipse cx="49" cy="49" rx="35" ry="28" transform="rotate(-13 49 49)" />
        <ellipse cx="51" cy="50" rx="31" ry="35" transform="rotate(29 51 50)" />
      </svg>
      <span class="nrs-node nrs-node-a" aria-hidden="true"></span>
      <span class="nrs-node nrs-node-b" aria-hidden="true"></span>
      <span class="nrs-node nrs-node-c" aria-hidden="true"></span>
      <div class="nrs-meaning nrs-meaning-understand"><span>01</span><strong>Understand</strong><small>Find the real user problem.</small></div>
      <div class="nrs-meaning nrs-meaning-structure"><span>02</span><strong>Structure</strong><small>Turn logic into states and flows.</small></div>
      <div class="nrs-meaning nrs-meaning-handoff"><span>03</span><strong>Build-ready</strong><small>Make implementation intent explicit.</small></div>
      <p class="nrs-uploaded-thesis">My job is usually the same: find the product logic, expose the important state and make the next decision easier.</p>
      <div class="nrs-uploaded-meta" aria-hidden="true"><span>6+ years</span><span>SaaS · Web3 · Fintech</span><span>Design · Implementation</span></div>
    </div>
  </div>
</section>`;

html = html.slice(0, heroStart) + hero + '\n' + html.slice(nextSection);
html = html.replace(/<!-- nrs-signal-demo-v1[567]-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v1[567]-runtime:end -->/g, '');
fs.writeFileSync(homePath, html, 'utf8');

const marker = /\/\* nrs-uploaded-hero-v\d+:start \*\/[\s\S]*?\/\* nrs-uploaded-hero-v\d+:end \*\//g;
const priorExactMarker = /\/\* nrs-exact-hero-v\d+:start \*\/[\s\S]*?\/\* nrs-exact-hero-v\d+:end \*\//g;
const priorReferenceMarker = /\/\* nrs-signal-reference-v\d+:start \*\/[\s\S]*?\/\* nrs-signal-reference-v\d+:end \*\//g;
const css = `/* nrs-uploaded-hero-v19:start */
.nrs-uploaded-hero-v19{--nrs-u-orange:#ef6a2c;--nrs-u-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;--nrs-u-sans:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--nrs-u-page:#0b0c0a;--nrs-u-ink:#f7f2e8;--nrs-u-soft:#d8d1c5;--nrs-u-line:rgba(247,242,232,.13);--nrs-u-primary:#f7f2e8;--nrs-u-primary-ink:#11110f;width:100%!important;min-height:100vh!important;display:flex!important;align-items:center!important;overflow:hidden!important;background:var(--nrs-u-page)!important;color:var(--nrs-u-ink)!important;font-family:var(--nrs-u-sans)!important;margin:0!important;padding:0!important;border:0!important;box-shadow:none!important}
html[data-theme="light"] .nrs-uploaded-hero-v19{--nrs-u-page:#f4f0e8;--nrs-u-ink:#11110f;--nrs-u-soft:#4c473f;--nrs-u-line:rgba(17,17,15,.13);--nrs-u-primary:#11110f;--nrs-u-primary-ink:#f7f2e8}
.nrs-uploaded-hero-v19,.nrs-uploaded-hero-v19 *{box-sizing:border-box!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-hero-inner{width:min(1320px,calc(100% - 64px))!important;max-width:none!important;margin:auto!important;display:grid!important;grid-template-columns:minmax(0,1.05fr) minmax(420px,.95fr)!important;gap:clamp(48px,6vw,96px)!important;align-items:center!important;padding:clamp(90px,10vw,145px) 0!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-kicker{display:flex!important;align-items:center!important;gap:10px!important;margin:0 0 30px!important;color:var(--nrs-u-soft)!important;font:700 10px/1.4 var(--nrs-u-mono)!important;text-transform:uppercase!important;letter-spacing:.07em!important}.nrs-uploaded-hero-v19 .nrs-uploaded-kicker:before{content:""!important;width:8px!important;height:8px!important;background:var(--nrs-u-orange)!important;flex:none!important}
.nrs-uploaded-hero-v19 #nrs-uploaded-hero-title{display:block!important;max-width:11ch!important;margin:0!important;color:var(--nrs-u-ink)!important;font:800 clamp(50px,5.4vw,84px)/.93 var(--nrs-u-sans)!important;letter-spacing:-.06em!important;text-wrap:balance!important;text-transform:none!important;word-break:normal!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-hero-support{display:grid!important;grid-template-columns:minmax(220px,.72fr) minmax(280px,1fr)!important;gap:28px 42px!important;margin:30px 0 0!important;align-items:end!important}.nrs-uploaded-hero-v19 .nrs-uploaded-lead{max-width:21ch!important;margin:0!important;color:var(--nrs-u-soft)!important;font:400 clamp(17px,1.25vw,21px)/1.5 var(--nrs-u-sans)!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-actions{display:flex!important;flex-wrap:wrap!important;gap:10px!important}.nrs-uploaded-hero-v19 .nrs-uploaded-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:14px!important;min-height:48px!important;padding:0 16px!important;border:1px solid var(--nrs-u-line)!important;border-radius:0!important;background:transparent!important;color:var(--nrs-u-ink)!important;text-decoration:none!important;font:700 10px/1 var(--nrs-u-mono)!important;text-transform:uppercase!important;letter-spacing:.04em!important;white-space:nowrap!important}.nrs-uploaded-hero-v19 .nrs-uploaded-btn-primary{background:var(--nrs-u-primary)!important;border-color:var(--nrs-u-primary)!important;color:var(--nrs-u-primary-ink)!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-visual{position:relative!important;width:min(100%,610px)!important;max-width:610px!important;justify-self:end!important;aspect-ratio:1/1!important;isolation:isolate!important;overflow:visible!important;background:transparent!important;border:0!important;box-shadow:none!important}
.nrs-uploaded-hero-v19 .nrs-visual-grid{position:absolute!important;inset:7% 1% 8% 2%!important;z-index:0!important;background-image:linear-gradient(color-mix(in srgb,var(--nrs-u-ink) 7%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--nrs-u-ink) 7%,transparent) 1px,transparent 1px)!important;background-size:34px 34px!important;opacity:.55!important;mask-image:radial-gradient(ellipse 67% 69% at 50% 49%,#000 0 45%,transparent 96%)!important;-webkit-mask-image:radial-gradient(ellipse 67% 69% at 50% 49%,#000 0 45%,transparent 96%)!important}
.nrs-uploaded-hero-v19 .nrs-original-portrait{position:absolute!important;z-index:3!important;left:50%!important;bottom:3%!important;width:72%!important;height:92%!important;object-fit:contain!important;object-position:center bottom!important;transform:translateX(-50%)!important;background:transparent!important;border:0!important;box-shadow:none!important;filter:drop-shadow(0 24px 38px rgba(0,0,0,.22))!important;mask-image:linear-gradient(to bottom,#000 0 81%,rgba(0,0,0,.98) 88%,rgba(0,0,0,.3) 97%,transparent 100%)!important;-webkit-mask-image:linear-gradient(to bottom,#000 0 81%,rgba(0,0,0,.98) 88%,rgba(0,0,0,.3) 97%,transparent 100%)!important}
.nrs-uploaded-hero-v19 .nrs-original-portrait-ghost{z-index:1!important;left:38%!important;opacity:.11!important;filter:grayscale(1) contrast(1.15)!important;transform:translateX(-50%) scale(.96)!important}html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-original-portrait-ghost{opacity:.055!important}
.nrs-uploaded-hero-v19 .nrs-orbit{position:absolute!important;inset:4% -1% 9% 0!important;z-index:4!important;width:100%!important;height:100%!important;overflow:visible!important;pointer-events:none!important}.nrs-uploaded-hero-v19 .nrs-orbit ellipse{fill:none!important;stroke:color-mix(in srgb,var(--nrs-u-orange) 83%,transparent)!important;stroke-width:.28!important}.nrs-uploaded-hero-v19 .nrs-orbit ellipse+ellipse{stroke-width:.18!important;opacity:.65!important}
.nrs-uploaded-hero-v19 .nrs-node{position:absolute!important;z-index:5!important;width:9px!important;height:9px!important;border-radius:50%!important;background:var(--nrs-u-orange)!important;box-shadow:0 0 0 6px color-mix(in srgb,var(--nrs-u-orange) 12%,transparent),0 0 22px color-mix(in srgb,var(--nrs-u-orange) 45%,transparent)!important}.nrs-uploaded-hero-v19 .nrs-node-a{left:18%!important;top:55%!important}.nrs-uploaded-hero-v19 .nrs-node-b{right:17%!important;top:29%!important}.nrs-uploaded-hero-v19 .nrs-node-c{right:13%!important;bottom:25%!important}
.nrs-uploaded-hero-v19 .nrs-meaning{position:absolute!important;z-index:7!important;width:148px!important;padding:10px 12px!important;border:1px solid var(--nrs-u-line)!important;background:color-mix(in srgb,var(--nrs-u-page) 82%,transparent)!important;backdrop-filter:blur(10px)!important;color:var(--nrs-u-soft)!important}.nrs-uploaded-hero-v19 .nrs-meaning span{display:block!important;margin-bottom:4px!important;color:var(--nrs-u-orange)!important;font:700 8px/1 var(--nrs-u-mono)!important}.nrs-uploaded-hero-v19 .nrs-meaning strong{display:block!important;margin-bottom:4px!important;color:var(--nrs-u-ink)!important;font:700 11px/1.2 var(--nrs-u-sans)!important}.nrs-uploaded-hero-v19 .nrs-meaning small{display:block!important;color:var(--nrs-u-soft)!important;font:500 9px/1.4 var(--nrs-u-sans)!important}.nrs-uploaded-hero-v19 .nrs-meaning-understand{right:-2%!important;top:15%!important}.nrs-uploaded-hero-v19 .nrs-meaning-structure{right:-6%!important;top:42%!important}.nrs-uploaded-hero-v19 .nrs-meaning-handoff{right:0!important;bottom:15%!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{position:absolute!important;z-index:7!important;left:7%!important;bottom:14%!important;width:min(40%,230px)!important;margin:0!important;padding-left:11px!important;border-left:2px solid var(--nrs-u-orange)!important;color:var(--nrs-u-soft)!important;font:700 clamp(8px,.65vw,10px)/1.55 var(--nrs-u-mono)!important;text-transform:uppercase!important}.nrs-uploaded-hero-v19 .nrs-uploaded-meta{position:absolute!important;z-index:7!important;left:8%!important;right:4%!important;bottom:3%!important;display:flex!important;justify-content:space-between!important;gap:12px!important;color:color-mix(in srgb,var(--nrs-u-soft) 82%,transparent)!important;font:700 7px/1.4 var(--nrs-u-mono)!important;text-transform:uppercase!important;letter-spacing:.05em!important}.nrs-uploaded-hero-v19 .nrs-uploaded-meta span{white-space:nowrap!important}
@media(max-width:1120px){.nrs-uploaded-hero-v19 .nrs-meaning{width:132px!important}.nrs-uploaded-hero-v19 .nrs-meaning-structure{right:-1%!important}}
@media(max-width:980px){.nrs-uploaded-hero-v19 .nrs-uploaded-hero-inner{grid-template-columns:1fr!important;width:min(760px,calc(100% - 36px))!important}.nrs-uploaded-hero-v19 .nrs-uploaded-hero-support{grid-template-columns:1fr!important}.nrs-uploaded-hero-v19 .nrs-uploaded-lead{max-width:36ch!important}.nrs-uploaded-hero-v19 .nrs-uploaded-visual{justify-self:center!important;width:min(100%,620px)!important}.nrs-uploaded-hero-v19 .nrs-meaning{display:none!important}}
@media(max-width:620px){.nrs-uploaded-hero-v19 .nrs-uploaded-hero-inner{padding:90px 0 60px!important}.nrs-uploaded-hero-v19 #nrs-uploaded-hero-title{font-size:clamp(44px,14vw,66px)!important}.nrs-uploaded-hero-v19 .nrs-uploaded-visual{width:100%!important}.nrs-uploaded-hero-v19 .nrs-original-portrait{width:84%!important}.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{left:4%!important;width:48%!important;bottom:12%!important}.nrs-uploaded-hero-v19 .nrs-uploaded-meta{left:4%!important;right:2%!important;font-size:6px!important}}
/* nrs-uploaded-hero-v19:end */`;
let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').replace(priorExactMarker, '').replace(priorReferenceMarker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const written = fs.readFileSync(homePath, 'utf8');
for (const token of ['class="nrs-uploaded-hero-v19"','hero-portrait-original-v19.webp','nrs-original-portrait','nrs-meaning-understand','View selected work','Experience and approach']) {
  if (!written.includes(token)) throw new Error(`[hero-photo-v19] Final homepage assertion failed: ${token}`);
}
if (written.includes('class="nrs-uploaded-hero-v18"') || written.includes('class="nrs-exact-hero-v17"') || written.includes('data-signal-demo-v16')) {
  throw new Error('[hero-photo-v19] A legacy hero survived final replacement.');
}
console.log('[hero-photo-v19] Applied original user portrait with meaningful, theme-aware visual system.');
