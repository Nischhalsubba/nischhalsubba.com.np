const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');
if (!fs.existsSync(homePath)) throw new Error(`[uploaded-hero-v18] Missing ${homePath}`);
if (!fs.existsSync(stylePath)) throw new Error(`[uploaded-hero-v18] Missing ${stylePath}`);

const readArtworkParts = (folder, names) => names
  .map((name) => fs.readFileSync(path.join(root, 'assets', 'images', folder, name), 'utf8').replace(/\s+/g, ''))
  .join('');
const darkBase64 = readArtworkParts('hero-uploaded-dark.parts', ['part-00.b64', 'part-01.b64', 'part-02.b64', 'part-03.b64']);
const lightBase64 = readArtworkParts('hero-uploaded-light.parts', ['part-00.b64', 'part-01.b64', 'part-02.b64']);
const assetChecks = [
  ['dark', darkBase64, 37402, 'bc48503f168b84a0c8b20940076262ce4f0d971b477b6e964e1ca4f275faff6a'],
  ['light', lightBase64, 29350, '52ad4ff49a971b058b6e5a76039a25cc93687c6a6bca8d12b71909edca506614'],
];
for (const [name, encoded, bytes, expectedHash] of assetChecks) {
  const data = Buffer.from(encoded, 'base64');
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  if (data.length !== bytes || hash !== expectedHash) {
    throw new Error(`[uploaded-hero-v18] ${name} artwork verification failed: ${data.length} bytes, ${hash}.`);
  }
}
const artworkDir = path.join(base, 'assets', 'images');
fs.mkdirSync(artworkDir, { recursive: true });
fs.writeFileSync(path.join(artworkDir, 'hero-uploaded-dark-v18.webp'), Buffer.from(darkBase64, 'base64'));
fs.writeFileSync(path.join(artworkDir, 'hero-uploaded-light-v18.webp'), Buffer.from(lightBase64, 'base64'));

let html = fs.readFileSync(homePath, 'utf8');
const exactStart = html.indexOf('<section class="nrs-uploaded-hero-v18"');
const priorExactStart = html.indexOf('<section class="nrs-exact-hero-v17"');
const legacyStart = html.indexOf('<section class="agent-hero"');
const heroStart = exactStart >= 0 ? exactStart : priorExactStart >= 0 ? priorExactStart : legacyStart;
const nextSection = heroStart >= 0 ? html.indexOf('<section class="agent-section"', heroStart) : -1;
if (heroStart < 0 || nextSection < 0) throw new Error('[uploaded-hero-v18] Stable homepage hero section boundaries were not found.');

const hero = `<section class="nrs-uploaded-hero-v18" aria-labelledby="nrs-uploaded-hero-title">
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
    <div class="nrs-uploaded-visual" aria-label="Portrait visual">
      <img class="nrs-uploaded-visual-art nrs-uploaded-dark-art" src="/assets/images/hero-uploaded-dark-v18.webp" alt="" width="390" height="470" decoding="async" fetchpriority="high">
      <img class="nrs-uploaded-visual-art nrs-uploaded-light-art" src="/assets/images/hero-uploaded-light-v18.webp" alt="" width="390" height="470" decoding="async" fetchpriority="high">
      <p class="nrs-uploaded-thesis">My job is usually the same: find the product logic, expose the important state and make the next decision easier.</p>
      <div class="nrs-uploaded-meta" aria-hidden="true"><span>6+ years</span><span>SaaS · Web3 · Fintech</span><span>Design · Implementation</span></div>
    </div>
  </div>
</section>`;

html = html.slice(0, heroStart) + hero + '\n' + html.slice(nextSection);
html = html.replace(/<!-- nrs-signal-demo-v1[567]-runtime:start -->[\s\S]*?<!-- nrs-signal-demo-v1[567]-runtime:end -->/g, '');
fs.writeFileSync(homePath, html, 'utf8');

const start = '/* nrs-uploaded-hero-v18:start */';
const end = '/* nrs-uploaded-hero-v18:end */';
const marker = /\/\* nrs-uploaded-hero-v\d+:start \*\/[\s\S]*?\/\* nrs-uploaded-hero-v\d+:end \*\//g;
const priorExactMarker = /\/\* nrs-exact-hero-v\d+:start \*\/[\s\S]*?\/\* nrs-exact-hero-v\d+:end \*\//g;
const priorReferenceMarker = /\/\* nrs-signal-reference-v\d+:start \*\/[\s\S]*?\/\* nrs-signal-reference-v\d+:end \*\//g;
const css = `${start}
.nrs-uploaded-hero-v18 {
  --nrs-u-orange:#ef6a2c;
  --nrs-u-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;
  --nrs-u-sans:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --nrs-u-page:#0b0c0a;--nrs-u-ink:#f7f2e8;--nrs-u-soft:#d8d1c5;--nrs-u-line:rgba(247,242,232,.13);--nrs-u-primary:#f7f2e8;--nrs-u-primary-ink:#11110f;
  width:100%!important;min-height:100vh!important;display:flex!important;align-items:center!important;overflow:hidden!important;background:var(--nrs-u-page)!important;color:var(--nrs-u-ink)!important;font-family:var(--nrs-u-sans)!important;transition:background .22s ease,color .22s ease!important;margin:0!important;padding:0!important;border:0!important;box-shadow:none!important;
}
html[data-theme="light"] .nrs-uploaded-hero-v18 {--nrs-u-page:#f4f0e8;--nrs-u-ink:#11110f;--nrs-u-soft:#4c473f;--nrs-u-line:rgba(17,17,15,.13);--nrs-u-primary:#11110f;--nrs-u-primary-ink:#f7f2e8;}
.nrs-uploaded-hero-v18,.nrs-uploaded-hero-v18 *{box-sizing:border-box!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-hero-inner{width:min(1320px,calc(100% - 64px))!important;max-width:none!important;margin:auto!important;display:grid!important;grid-template-columns:minmax(0,1.05fr) minmax(400px,.95fr)!important;gap:clamp(48px,7vw,112px)!important;align-items:center!important;padding:clamp(90px,10vw,145px) 0!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-hero-copy{min-width:0!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-kicker{display:flex!important;align-items:center!important;gap:10px!important;margin:0 0 30px!important;color:var(--nrs-u-soft)!important;font:700 10px/1.4 var(--nrs-u-mono)!important;text-transform:uppercase!important;letter-spacing:.07em!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-kicker::before{content:""!important;width:8px!important;height:8px!important;flex:none!important;background:var(--nrs-u-orange)!important;}
.nrs-uploaded-hero-v18 #nrs-uploaded-hero-title{display:block!important;max-width:11ch!important;width:auto!important;margin:0!important;padding:0!important;color:var(--nrs-u-ink)!important;font-family:var(--nrs-u-sans)!important;font-size:clamp(50px,5.4vw,84px)!important;font-weight:800!important;font-style:normal!important;line-height:.93!important;letter-spacing:-.06em!important;text-wrap:balance!important;word-break:normal!important;overflow-wrap:normal!important;hyphens:none!important;text-transform:none!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-hero-support{display:grid!important;grid-template-columns:minmax(220px,.72fr) minmax(280px,1fr)!important;gap:28px 42px!important;margin:30px 0 0!important;align-items:end!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-lead{max-width:21ch!important;margin:0!important;color:var(--nrs-u-soft)!important;font-family:var(--nrs-u-sans)!important;font-size:clamp(17px,1.25vw,21px)!important;font-weight:400!important;line-height:1.5!important;letter-spacing:normal!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-actions{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:10px!important;margin:0!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-btn{display:inline-flex!important;visibility:visible!important;opacity:1!important;align-items:center!important;justify-content:center!important;gap:14px!important;min-width:0!important;min-height:48px!important;padding:0 16px!important;border:1px solid var(--nrs-u-line)!important;border-radius:0!important;background:transparent!important;color:var(--nrs-u-ink)!important;text-decoration:none!important;font:700 10px/1 var(--nrs-u-mono)!important;text-transform:uppercase!important;letter-spacing:.04em!important;white-space:nowrap!important;box-shadow:none!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-btn,.nrs-uploaded-hero-v18 .nrs-uploaded-btn *{color:var(--nrs-u-ink)!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-btn-primary{background:var(--nrs-u-primary)!important;border-color:var(--nrs-u-primary)!important;color:var(--nrs-u-primary-ink)!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-btn-primary,.nrs-uploaded-hero-v18 .nrs-uploaded-btn-primary *{color:var(--nrs-u-primary-ink)!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-visual{position:relative!important;width:min(100%,570px)!important;max-width:570px!important;justify-self:end!important;aspect-ratio:390/590!important;overflow:visible!important;isolation:isolate!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-visual-art{position:absolute!important;left:50%!important;top:44%!important;z-index:1!important;display:block!important;visibility:visible!important;opacity:1!important;width:118%!important;max-width:none!important;height:auto!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;object-fit:contain!important;transform:translate(-50%,-50%)!important;pointer-events:none!important;user-select:none!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-light-art{display:none!important;}
html[data-theme="light"] .nrs-uploaded-hero-v18 .nrs-uploaded-dark-art{display:none!important;}
html[data-theme="light"] .nrs-uploaded-hero-v18 .nrs-uploaded-light-art{display:block!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-thesis{position:absolute!important;left:10%!important;bottom:17%!important;z-index:4!important;width:min(48%,260px)!important;margin:0!important;color:var(--nrs-u-soft)!important;font:700 clamp(9px,.7vw,11px)/1.55 var(--nrs-u-mono)!important;text-transform:uppercase!important;letter-spacing:.01em!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-meta{position:absolute!important;left:10%!important;right:2%!important;bottom:5%!important;z-index:4!important;display:flex!important;justify-content:space-between!important;gap:14px!important;margin:0!important;color:color-mix(in srgb,var(--nrs-u-soft) 84%,transparent)!important;font:700 8px/1.4 var(--nrs-u-mono)!important;text-transform:uppercase!important;letter-spacing:.05em!important;}
.nrs-uploaded-hero-v18 .nrs-uploaded-meta span{white-space:nowrap!important;}
@media(max-width:980px){.nrs-uploaded-hero-v18 .nrs-uploaded-hero-inner{grid-template-columns:1fr!important;width:min(760px,calc(100% - 36px))!important;}.nrs-uploaded-hero-v18 .nrs-uploaded-hero-support{grid-template-columns:1fr!important;}.nrs-uploaded-hero-v18 .nrs-uploaded-lead{max-width:36ch!important;}.nrs-uploaded-hero-v18 .nrs-uploaded-visual{justify-self:center!important;width:min(100%,600px)!important;}}
@media(max-width:620px){.nrs-uploaded-hero-v18 .nrs-uploaded-hero-inner{padding:90px 0 60px!important;}.nrs-uploaded-hero-v18 #nrs-uploaded-hero-title{font-size:clamp(44px,14vw,66px)!important;}.nrs-uploaded-hero-v18 .nrs-uploaded-visual{width:100%!important;}.nrs-uploaded-hero-v18 .nrs-uploaded-thesis{left:6%!important;bottom:15%!important;width:58%!important;}.nrs-uploaded-hero-v18 .nrs-uploaded-meta{left:6%!important;right:3%!important;font-size:7px!important;}}
${end}`;
let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').replace(priorExactMarker, '').replace(priorReferenceMarker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const written = fs.readFileSync(homePath, 'utf8');
for (const token of ['class="nrs-uploaded-hero-v18"','id="nrs-uploaded-hero-title"','nrs-uploaded-dark-art','nrs-uploaded-light-art','View selected work','Experience and approach']) {
  if (!written.includes(token)) throw new Error(`[uploaded-hero-v18] Final homepage assertion failed: ${token}`);
}
if (written.includes('data-signal-demo-v16') || written.includes('class="nrs-exact-hero-v17"')) throw new Error('[uploaded-hero-v18] A legacy hero survived final replacement.');
console.log('[uploaded-hero-v18] Applied the exact uploaded dark/light hero composition from verified source parts.');
