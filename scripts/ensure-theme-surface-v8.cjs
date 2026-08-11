/**
 * @fileoverview scripts/ensure-theme-surface-v8.cjs
 * Purpose: Apply the ensure theme surface v8 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');
if (!fs.existsSync(stylePath)) throw new Error('[theme-surface-v8] Missing style.css');

const start = '/* nrs-theme-surface-v8:start */';
const end = '/* nrs-theme-surface-v8:end */';
const marker = /\/\* nrs-theme-surface-v\d+:start \*\/[\s\S]*?\/\* nrs-theme-surface-v\d+:end \*\//g;

const css = `${start}
/*
 * Final theme contract.
 * The historical dark theme inverted --ap-inverse to a light surface, while later
 * text patches assumed inverse sections stayed dark. Lock surfaces and text together
 * so a theme switch cannot produce dark-on-dark or light-on-light combinations.
 */
html[data-theme='light'] body.agent-portfolio {
  --ap-page: #f2efe7 !important;
  --ap-surface: #fbf8f1 !important;
  --ap-ink: #11110f !important;
  --ap-ink-soft: #48443d !important;
  --ap-ink-faint: #575249 !important;
  --ap-inverse: #11110f !important;
  --ap-inverse-ink: #f7f2e8 !important;
  background: #f2efe7 !important;
  color: #11110f !important;
}
html[data-theme='dark'] body.agent-portfolio,
html:not([data-theme='light']) body.agent-portfolio {
  --ap-page: #0c0c0b !important;
  --ap-surface: #151512 !important;
  --ap-ink: #f7f2e8 !important;
  --ap-ink-soft: #d8d1c5 !important;
  --ap-ink-faint: #bdb6aa !important;
  --ap-inverse: #11110f !important;
  --ap-inverse-ink: #f7f2e8 !important;
  background: #0c0c0b !important;
  color: #f7f2e8 !important;
}

html[data-theme='light'] body.agent-portfolio .agent-main,
html[data-theme='light'] body.agent-portfolio .agent-main > :not(.agent-section--inverse) {
  background-color: #f2efe7 !important;
  color: #11110f !important;
}
html[data-theme='dark'] body.agent-portfolio .agent-main,
html[data-theme='dark'] body.agent-portfolio .agent-main > :not(.agent-section--inverse),
html:not([data-theme='light']) body.agent-portfolio .agent-main,
html:not([data-theme='light']) body.agent-portfolio .agent-main > :not(.agent-section--inverse) {
  background-color: #0c0c0b !important;
  color: #f7f2e8 !important;
}

/* Inverse editorial sections deliberately remain dark in both themes. */
html[data-theme='light'] body.agent-portfolio .agent-main .agent-section--inverse,
html[data-theme='dark'] body.agent-portfolio .agent-main .agent-section--inverse,
html:not([data-theme='light']) body.agent-portfolio .agent-main .agent-section--inverse {
  --ap-ink: #f7f2e8 !important;
  --ap-ink-soft: #d8d1c5 !important;
  --ap-ink-faint: #c7c0b4 !important;
  --ap-line: rgba(247, 242, 232, .28) !important;
  background: #11110f !important;
  background-color: #11110f !important;
  color: #f7f2e8 !important;
}
html[data-theme='light'] body.agent-portfolio .agent-main .agent-section--inverse :is(h1,h2,h3,h4,h5,h6,strong,dd,a,label,button),
html[data-theme='dark'] body.agent-portfolio .agent-main .agent-section--inverse :is(h1,h2,h3,h4,h5,h6,strong,dd,a,label,button),
html:not([data-theme='light']) body.agent-portfolio .agent-main .agent-section--inverse :is(h1,h2,h3,h4,h5,h6,strong,dd,a,label,button) {
  color: #f7f2e8 !important;
  -webkit-text-fill-color: #f7f2e8 !important;
  opacity: 1 !important;
}
html[data-theme='light'] body.agent-portfolio .agent-main .agent-section--inverse :is(p,li,figcaption,small,.agent-lead,.agent-page-intro),
html[data-theme='dark'] body.agent-portfolio .agent-main .agent-section--inverse :is(p,li,figcaption,small,.agent-lead,.agent-page-intro),
html:not([data-theme='light']) body.agent-portfolio .agent-main .agent-section--inverse :is(p,li,figcaption,small,.agent-lead,.agent-page-intro) {
  color: #d8d1c5 !important;
  -webkit-text-fill-color: #d8d1c5 !important;
  opacity: 1 !important;
}
html[data-theme='light'] body.agent-portfolio .agent-main .agent-section--inverse :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span),
html[data-theme='dark'] body.agent-portfolio .agent-main .agent-section--inverse :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span),
html:not([data-theme='light']) body.agent-portfolio .agent-main .agent-section--inverse :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span) {
  color: #c7c0b4 !important;
  -webkit-text-fill-color: #c7c0b4 !important;
  opacity: 1 !important;
}

/* Normal surfaces. Explicit text-fill avoids inherited WebKit fill colors from old layers. */
html[data-theme='light'] body.agent-portfolio .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd) {
  color: #11110f !important;
  -webkit-text-fill-color: #11110f !important;
  opacity: 1 !important;
}
html[data-theme='light'] body.agent-portfolio .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p) {
  color: #48443d !important;
  -webkit-text-fill-color: #48443d !important;
  opacity: 1 !important;
}
html[data-theme='light'] body.agent-portfolio .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span,.agent-hero-foot span,.agent-project-meta span) {
  color: #575249 !important;
  -webkit-text-fill-color: #575249 !important;
  opacity: 1 !important;
}
html[data-theme='dark'] body.agent-portfolio .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd),
html:not([data-theme='light']) body.agent-portfolio .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd) {
  color: #f7f2e8 !important;
  -webkit-text-fill-color: #f7f2e8 !important;
  opacity: 1 !important;
}
html[data-theme='dark'] body.agent-portfolio .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p),
html:not([data-theme='light']) body.agent-portfolio .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p) {
  color: #d8d1c5 !important;
  -webkit-text-fill-color: #d8d1c5 !important;
  opacity: 1 !important;
}
html[data-theme='dark'] body.agent-portfolio .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span,.agent-hero-foot span,.agent-project-meta span),
html:not([data-theme='light']) body.agent-portfolio .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span,.agent-hero-foot span,.agent-project-meta span) {
  color: #bdb6aa !important;
  -webkit-text-fill-color: #bdb6aa !important;
  opacity: 1 !important;
}

/* Button foreground/background pairs are hard-coded per theme so variables cannot cross wires. */
html[data-theme='light'] body.agent-portfolio :is(.agent-btn--primary,.btn.btn-primary,button.btn-primary) {
  background: #11110f !important;
  border-color: #11110f !important;
  color: #f7f2e8 !important;
  -webkit-text-fill-color: #f7f2e8 !important;
}
html[data-theme='dark'] body.agent-portfolio :is(.agent-btn--primary,.btn.btn-primary,button.btn-primary),
html:not([data-theme='light']) body.agent-portfolio :is(.agent-btn--primary,.btn.btn-primary,button.btn-primary) {
  background: #f7f2e8 !important;
  border-color: #f7f2e8 !important;
  color: #11110f !important;
  -webkit-text-fill-color: #11110f !important;
}
html[data-theme='light'] body.agent-portfolio .agent-section--inverse .agent-btn--primary,
html[data-theme='dark'] body.agent-portfolio .agent-section--inverse .agent-btn--primary,
html:not([data-theme='light']) body.agent-portfolio .agent-section--inverse .agent-btn--primary {
  background: #f7f2e8 !important;
  border-color: #f7f2e8 !important;
  color: #11110f !important;
  -webkit-text-fill-color: #11110f !important;
}

/* Work hero: explicit columns prevent the intro from collapsing into a narrow receipt. */
@media (min-width: 1024px) {
  .nrs-editorial-work .agent-page-hero-grid > :first-child {
    grid-column: 1 !important;
    min-width: 0 !important;
  }
  .nrs-editorial-work .nrs-work-intro {
    grid-column: 2 !important;
    grid-row: 1 !important;
    align-self: end !important;
    justify-self: stretch !important;
    width: 100% !important;
    max-width: 34rem !important;
    min-width: 20rem !important;
    margin: 0 !important;
    padding-bottom: .35rem !important;
  }
  .nrs-editorial-work .nrs-work-intro p {
    width: 100% !important;
    max-width: 58ch !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const required of [
  "html[data-theme='light'] body.agent-portfolio",
  "html[data-theme='dark'] body.agent-portfolio",
  '.agent-section--inverse',
  '.btn.btn-primary',
  'grid-column: 2 !important',
]) {
  if (!style.includes(required)) throw new Error(`[theme-surface-v8] Missing contract: ${required}`);
}

console.log('[theme-surface-v8] Locked theme surfaces, text contrast, primary controls and Work hero columns.');
