/**
 * @fileoverview scripts/ensure-accessible-accent-text.cjs
 * Purpose: Apply the ensure accessible accent text production transformation or maintenance step while preserving canonical source/build contracts.
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
const start = '/* nrs-accessible-accent-text-v1:start */';
const end = '/* nrs-accessible-accent-text-v1:end */';
const marker = /\/\* nrs-accessible-accent-text-v\d+:start \*\/[\s\S]*?\/\* nrs-accessible-accent-text-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[accessible-accent-text] Missing ${stylePath}`);

const css = `${start}
/* Keep the bright orange for fills, rules and focus rings. Text gets its own AA-safe token. */
.agent-portfolio { --ap-signal-text: #b93600; }
html[data-theme='dark'] .agent-portfolio { --ap-signal-text: #ff7a42; }

.agent-portfolio main .agent-hero-title .agent-serif,
.agent-portfolio main .nrs-case-v4-steps li > span,
.agent-portfolio main .agent-about-fit-item > span:first-child,
.agent-portfolio main .agent-case-rail a:hover,
.agent-portfolio main .agent-case-rail a:focus-visible,
.agent-portfolio main .agent-breadcrumbs a:hover,
.agent-portfolio main .agent-breadcrumbs a:focus-visible,
.agent-portfolio main .nrs-case-breadcrumb a:hover,
.agent-portfolio main .nrs-case-breadcrumb a:focus-visible {
  color: var(--ap-signal-text) !important;
  -webkit-text-fill-color: currentColor !important;
}

/* In dark inverse sections the brighter signal already clears AA comfortably. */
.agent-portfolio .agent-section--inverse :is(
  .agent-case-rail a:hover,
  .agent-case-rail a:focus-visible,
  .agent-breadcrumbs a:hover,
  .agent-breadcrumbs a:focus-visible,
  .nrs-case-breadcrumb a:hover,
  .nrs-case-breadcrumb a:focus-visible
) {
  color: #ff7a42 !important;
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const required of ['--ap-signal-text: #b93600', "--ap-signal-text: #ff7a42", '.nrs-case-v4-steps li > span']) {
  if (!style.includes(required)) throw new Error(`[accessible-accent-text] Missing contract: ${required}`);
}

console.log('[accessible-accent-text] Applied AA-safe accent text colors for light and dark themes.');
