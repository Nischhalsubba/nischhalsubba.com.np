/**
 * @fileoverview scripts/finalize-signal-typography-v24.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for finalize signal typography v24.
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

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath) || !fs.existsSync(stylePath)) {
  throw new Error('[hero-type-v24] Missing index.html or style.css.');
}

const html = fs.readFileSync(homePath, 'utf8');
let css = fs.readFileSync(stylePath, 'utf8');

const requiredTokens = [
  'nrs-uploaded-hero-v19',
  'nrs-uploaded-actions',
  'nrsStoryReadout',
  'nrs-decision-field'
];
for (const token of requiredTokens) {
  if (!html.includes(token)) throw new Error(`[hero-type-v24] Missing expected hero token: ${token}`);
}

const marker = /\/\* nrs-hero-type-v24:start \*\/[\s\S]*?\/\* nrs-hero-type-v24:end \*\//g;
css = css.replace(marker, '').trimEnd();

css += `

/* nrs-hero-type-v24:start */
/* Overall composition: give the editorial copy and the interactive visual enough room to breathe. */
.nrs-uploaded-hero-v19 .nrs-uploaded-hero-inner{
  width:min(1420px,calc(100% - 72px))!important;
  grid-template-columns:minmax(0,.94fr) minmax(540px,1.06fr)!important;
  gap:clamp(68px,7vw,118px)!important;
  padding:clamp(94px,9vw,136px) 0!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-hero-copy{align-self:center!important;min-width:0!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-kicker{
  margin:0 0 32px!important;
  gap:11px!important;
  font-size:11px!important;
  line-height:1.35!important;
  letter-spacing:.075em!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-kicker:before{width:9px!important;height:9px!important}
.nrs-uploaded-hero-v19 #nrs-uploaded-hero-title{
  max-width:12.7ch!important;
  font-size:clamp(54px,4.85vw,82px)!important;
  line-height:.94!important;
  letter-spacing:-.057em!important;
  text-wrap:balance!important;
}

/* Supporting copy becomes a readable editorial block; CTAs sit beneath it as one clear action group. */
.nrs-uploaded-hero-v19 .nrs-uploaded-hero-support{
  display:grid!important;
  grid-template-columns:minmax(0,1fr)!important;
  gap:26px!important;
  max-width:640px!important;
  margin:34px 0 0!important;
  align-items:start!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-lead{
  max-width:32ch!important;
  margin:0!important;
  font-size:clamp(17px,1.18vw,20px)!important;
  line-height:1.56!important;
  letter-spacing:-.012em!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-actions{
  position:relative!important;
  z-index:30!important;
  display:flex!important;
  flex-wrap:wrap!important;
  align-items:center!important;
  gap:12px!important;
  width:100%!important;
  margin:0!important;
}

/* CTA hard reset: older global anchor/pseudo-element styles cannot hide the label anymore. */
.nrs-uploaded-hero-v19 .nrs-uploaded-btn{
  position:relative!important;
  z-index:1!important;
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  gap:13px!important;
  min-width:204px!important;
  min-height:52px!important;
  padding:0 20px!important;
  opacity:1!important;
  visibility:visible!important;
  overflow:visible!important;
  text-indent:0!important;
  text-decoration:none!important;
  text-shadow:none!important;
  mix-blend-mode:normal!important;
  filter:none!important;
  font-family:var(--nrs-u-mono)!important;
  font-size:11px!important;
  font-weight:750!important;
  line-height:1!important;
  letter-spacing:.052em!important;
  text-transform:uppercase!important;
  transition:transform .16s cubic-bezier(.2,0,0,1),border-color .16s ease,background-color .16s ease!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn::before,
.nrs-uploaded-hero-v19 .nrs-uploaded-btn::after{content:none!important;display:none!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn span{
  position:relative!important;
  z-index:2!important;
  display:inline!important;
  opacity:1!important;
  visibility:visible!important;
  color:inherit!important;
  -webkit-text-fill-color:currentColor!important;
}
html[data-theme="dark"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn-primary{
  background:#f7f2e8!important;
  border-color:#f7f2e8!important;
  color:#11110f!important;
  -webkit-text-fill-color:#11110f!important;
}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn-primary{
  background:#11110f!important;
  border-color:#11110f!important;
  color:#f7f2e8!important;
  -webkit-text-fill-color:#f7f2e8!important;
}
html[data-theme="dark"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn:not(.nrs-uploaded-btn-primary){
  background:rgba(255,255,255,.012)!important;
  border-color:rgba(247,242,232,.29)!important;
  color:#f7f2e8!important;
  -webkit-text-fill-color:#f7f2e8!important;
}
html[data-theme="light"] .nrs-uploaded-hero-v19 .nrs-uploaded-btn:not(.nrs-uploaded-btn-primary){
  background:rgba(17,17,15,.012)!important;
  border-color:rgba(17,17,15,.25)!important;
  color:#11110f!important;
  -webkit-text-fill-color:#11110f!important;
}
@media(hover:hover) and (pointer:fine){
  .nrs-uploaded-hero-v19 .nrs-uploaded-btn:hover{transform:translateY(-2px)!important}
}
.nrs-uploaded-hero-v19 .nrs-uploaded-btn:focus-visible{outline:2px solid var(--nrs-u-orange)!important;outline-offset:4px!important}

/* Right-side hierarchy: visual grows, while the story copy graduates from microscopic annotation to readable micro-editorial. */
.nrs-uploaded-hero-v19 .nrs-uploaded-visual{
  width:min(100%,700px)!important;
  max-width:700px!important;
  justify-self:end!important;
}
.nrs-uploaded-hero-v19 .nrs-story-node{width:42px!important;height:42px!important}
.nrs-uploaded-hero-v19 .nrs-story-dot{
  inset:16px!important;
  min-width:10px!important;
  min-height:10px!important;
}
.nrs-uploaded-hero-v19 .nrs-story-node-label{
  min-height:28px!important;
  display:flex!important;
  align-items:center!important;
  padding:6px 9px!important;
  font-size:9px!important;
  line-height:1!important;
  letter-spacing:.065em!important;
  white-space:nowrap!important;
  border-color:color-mix(in srgb,var(--nrs-u-ink) 18%,transparent)!important;
  background:color-mix(in srgb,var(--nrs-u-page) 94%,transparent)!important;
  backdrop-filter:blur(12px)!important;
}
.nrs-uploaded-hero-v19 .nrs-story-readout{
  right:-1%!important;
  bottom:7%!important;
  width:min(272px,45%)!important;
  min-height:92px!important;
  padding:14px 15px 13px!important;
  border-color:color-mix(in srgb,var(--nrs-u-ink) 18%,transparent)!important;
  background:color-mix(in srgb,var(--nrs-u-page) 94%,transparent)!important;
  box-shadow:0 18px 48px rgba(0,0,0,.13)!important;
  backdrop-filter:blur(16px)!important;
}
.nrs-uploaded-hero-v19 .nrs-story-readout-head{
  display:flex!important;
  justify-content:space-between!important;
  gap:12px!important;
  margin:0 0 8px!important;
  color:var(--nrs-field-orange)!important;
  font:750 8px/1.2 var(--nrs-u-mono)!important;
  letter-spacing:.075em!important;
  text-transform:uppercase!important;
}
.nrs-uploaded-hero-v19 .nrs-story-readout strong{
  display:block!important;
  margin:0!important;
  max-width:24ch!important;
  color:var(--nrs-u-ink)!important;
  font:720 13px/1.34 var(--nrs-u-sans)!important;
  letter-spacing:-.012em!important;
}
.nrs-uploaded-hero-v19 .nrs-story-readout code{
  display:block!important;
  margin:9px 0 0!important;
  color:var(--nrs-u-soft)!important;
  font:650 9px/1.25 var(--nrs-u-mono)!important;
  letter-spacing:.035em!important;
}

/* The thesis and model labels should be legible without competing with the portrait. */
.nrs-uploaded-hero-v19 .nrs-uploaded-thesis{
  left:3%!important;
  bottom:8%!important;
  width:min(46%,290px)!important;
  padding-left:13px!important;
  border-left-width:2px!important;
  color:var(--nrs-u-soft)!important;
  font:700 9.5px/1.55 var(--nrs-u-mono)!important;
  letter-spacing:.035em!important;
  text-transform:uppercase!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-meta{
  left:3%!important;
  right:1%!important;
  bottom:-1%!important;
  display:grid!important;
  grid-template-columns:.7fr 1.35fr 1fr!important;
  align-items:center!important;
  gap:18px!important;
  padding-top:12px!important;
  border-top:1px solid color-mix(in srgb,var(--nrs-u-ink) 10%,transparent)!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-meta span{
  color:color-mix(in srgb,var(--nrs-u-soft) 88%,transparent)!important;
  font:700 8.5px/1.3 var(--nrs-u-mono)!important;
  letter-spacing:.055em!important;
  text-transform:uppercase!important;
  white-space:nowrap!important;
}
.nrs-uploaded-hero-v19 .nrs-uploaded-meta span:nth-child(2){text-align:center!important}
.nrs-uploaded-hero-v19 .nrs-uploaded-meta span:last-child{text-align:right!important}

/* Give the technical field a little more air so typography does not sit on the portrait. */
.nrs-uploaded-hero-v19 .nrs-decision-field{inset:-7% -11% 1% -11%!important}
.nrs-uploaded-hero-v19 .nrs-visual-grid{inset:-3% -8% 4% -8%!important;opacity:.5!important}

@media(max-width:1180px){
  .nrs-uploaded-hero-v19 .nrs-uploaded-hero-inner{
    width:min(1180px,calc(100% - 48px))!important;
    grid-template-columns:minmax(0,1fr) minmax(470px,.94fr)!important;
    gap:52px!important;
  }
  .nrs-uploaded-hero-v19 #nrs-uploaded-hero-title{max-width:11.8ch!important;font-size:clamp(50px,5.3vw,72px)!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-visual{width:min(100%,620px)!important;max-width:620px!important}
  .nrs-uploaded-hero-v19 .nrs-story-readout{width:248px!important}
}

@media(max-width:960px){
  .nrs-uploaded-hero-v19 .nrs-uploaded-hero-inner{
    width:min(760px,calc(100% - 36px))!important;
    grid-template-columns:1fr!important;
    gap:54px!important;
    padding:104px 0 76px!important;
  }
  .nrs-uploaded-hero-v19 #nrs-uploaded-hero-title{max-width:11.6ch!important;font-size:clamp(48px,9vw,72px)!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-hero-support{max-width:600px!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-lead{max-width:34ch!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-visual{justify-self:center!important;width:min(94vw,680px)!important;max-width:680px!important}
  .nrs-uploaded-hero-v19 .nrs-story-readout{right:1%!important;width:250px!important}
}

@media(max-width:620px){
  .nrs-uploaded-hero-v19 .nrs-uploaded-hero-inner{width:calc(100% - 28px)!important;gap:40px!important;padding:88px 0 58px!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-kicker{font-size:9.5px!important;margin-bottom:24px!important}
  .nrs-uploaded-hero-v19 #nrs-uploaded-hero-title{max-width:10.7ch!important;font-size:clamp(43px,13vw,60px)!important;line-height:.95!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-hero-support{margin-top:28px!important;gap:22px!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-lead{font-size:16px!important;line-height:1.55!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-actions{display:grid!important;grid-template-columns:1fr!important;width:100%!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-btn{width:100%!important;min-width:0!important;font-size:10.5px!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-visual{width:min(100%,560px)!important}
  .nrs-uploaded-hero-v19 .nrs-story-node{width:38px!important;height:38px!important}
  .nrs-uploaded-hero-v19 .nrs-story-dot{inset:14px!important}
  .nrs-uploaded-hero-v19 .nrs-story-node-label{font-size:8px!important;padding:5px 7px!important}
  .nrs-uploaded-hero-v19 .nrs-story-readout{right:2%!important;bottom:8%!important;width:min(232px,60%)!important;min-height:82px!important;padding:12px!important}
  .nrs-uploaded-hero-v19 .nrs-story-readout strong{font-size:11.5px!important}
  .nrs-uploaded-hero-v19 .nrs-story-readout code{font-size:8px!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-thesis{left:3%!important;bottom:9%!important;width:46%!important;font-size:8px!important;line-height:1.48!important}
  .nrs-uploaded-hero-v19 .nrs-uploaded-meta{display:none!important}
}

@media(prefers-reduced-motion:reduce){
  .nrs-uploaded-hero-v19 .nrs-uploaded-btn{transition:none!important}
}
/* nrs-hero-type-v24:end */
`;

fs.writeFileSync(stylePath, css, 'utf8');

const checks = [
  'nrs-hero-type-v24:start',
  'font-size:11px!important',
  'width:min(100%,700px)!important',
  'nrs-uploaded-btn-primary'
];
for (const check of checks) {
  if (!css.includes(check)) throw new Error(`[hero-type-v24] Verification failed: ${check}`);
}

console.log('[hero-type-v24] CTA contrast, hero typography hierarchy, and story spacing refined.');
