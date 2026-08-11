/**
 * @fileoverview scripts/ensure-final-brand-contrast.cjs
 * Purpose: Apply the ensure final brand contrast production transformation or maintenance step while preserving canonical source/build contracts.
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
const start = '/* nrs-final-brand-contrast-v1:start */';
const end = '/* nrs-final-brand-contrast-v1:end */';
const marker = /\/\* nrs-final-brand-contrast-v\d+:start \*\/[\s\S]*?\/\* nrs-final-brand-contrast-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[final-brand-contrast] Missing ${stylePath}`);

const brandMarkup = '<a class="agent-mobile-brand" href="/" aria-label="Nischhal Raj Subba, home"><strong>Nischhal Raj Subba</strong></a>';
const htmlFiles = [];
(/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure final brand contrast repository tool.
 * Inputs: `directory`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
})(base);

let repairedBrands = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('agent-portfolio') || !html.includes('mobile-nav-toggle')) continue;

  const before = html;
  html = html
    .replace(/\s*<a\b[^>]*class=["'][^"']*\bagent-mobile-brand\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/\s*<a\b[^>]*class=["'][^"']*\bmobile-logo\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');

  html = html.replace(
    /(<button\b[^>]*class=["'][^"']*\bmobile-nav-toggle\b[^"']*["'][^>]*>)/i,
    `${brandMarkup}$1`,
  );

  const brandCount = (html.match(/\bagent-mobile-brand\b/g) || []).length;
  if (brandCount !== 1) throw new Error(`[final-brand-contrast] ${path.relative(root, file)} has ${brandCount} mobile brands`);
  if (/\bclass=["'][^"']*\bmobile-logo\b/i.test(html)) throw new Error(`[final-brand-contrast] Legacy mobile-logo survived in ${path.relative(root, file)}`);

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    repairedBrands += 1;
  }
}

const css = `${start}
/* Semantic text tokens with comfortable AA headroom in both themes. */
.agent-portfolio {
  --ap-ink-faint: #6a655d !important;
  --nrs-inverse-bg: #11110f;
  --nrs-inverse-surface: #191916;
  --nrs-inverse-ink: #f7f2e8;
  --nrs-inverse-muted: #d8d1c5;
  --nrs-inverse-faint: #bdb6aa;
  --nrs-inverse-line: rgba(247, 242, 232, .28);
}

html[data-theme='dark'] .agent-portfolio {
  --ap-ink-faint: #9c958b !important;
}

/* Inverse editorial sections stay dark in both themes. Do not invert their text tokens twice. */
.agent-portfolio .agent-section--inverse {
  background: var(--nrs-inverse-bg) !important;
  color: var(--nrs-inverse-ink) !important;
}

.agent-portfolio .agent-section--inverse :is(
  .agent-section-title,
  h1, h2, h3, h4, h5, h6,
  strong, dt, dd
) {
  color: var(--nrs-inverse-ink) !important;
  -webkit-text-fill-color: var(--nrs-inverse-ink) !important;
  text-shadow: none !important;
}

.agent-portfolio .agent-section--inverse :is(
  p, li, figcaption, small,
  .agent-page-intro,
  .agent-lead,
  .agent-rich-copy,
  .agent-rich-copy p,
  .agent-decision p
) {
  color: var(--nrs-inverse-muted) !important;
  -webkit-text-fill-color: currentColor !important;
}

.agent-portfolio .agent-section--inverse :is(.agent-meta, .agent-kicker) {
  color: var(--nrs-inverse-faint) !important;
  -webkit-text-fill-color: currentColor !important;
}

/* Current case-study decision cards. This is the component the v4 renderer actually emits. */
.agent-portfolio .nrs-case-v4 .agent-section--inverse .agent-decision-grid {
  gap: clamp(.85rem, 1.35vw, 1.25rem) !important;
  border: 0 !important;
  background: transparent !important;
}

.agent-portfolio .nrs-case-v4 .agent-section--inverse .agent-decision {
  min-width: 0 !important;
  padding: clamp(1.25rem, 2vw, 1.75rem) !important;
  border: 1px solid var(--nrs-inverse-line) !important;
  background: var(--nrs-inverse-surface) !important;
  color: var(--nrs-inverse-ink) !important;
  box-shadow: none !important;
}

.agent-portfolio .nrs-case-v4 .agent-section--inverse .agent-decision .agent-meta {
  width: fit-content;
  color: var(--nrs-inverse-faint) !important;
  -webkit-text-fill-color: var(--nrs-inverse-faint) !important;
}

.agent-portfolio .nrs-case-v4 .agent-section--inverse .agent-decision h3 {
  color: var(--nrs-inverse-ink) !important;
  -webkit-text-fill-color: var(--nrs-inverse-ink) !important;
}

.agent-portfolio .nrs-case-v4 .agent-section--inverse .agent-decision p {
  color: var(--nrs-inverse-muted) !important;
  -webkit-text-fill-color: var(--nrs-inverse-muted) !important;
}

.agent-portfolio .nrs-case-v4 .agent-section--inverse .agent-decision:hover,
.agent-portfolio .nrs-case-v4 .agent-section--inverse .agent-decision:focus-within {
  border-color: rgba(247, 242, 232, .48) !important;
  background: #1e1e1a !important;
}

/* Ordinary page text uses semantic surface tokens instead of legacy one-theme grays. */
.agent-portfolio main :is(
  .agent-page-intro,
  .agent-lead,
  .agent-rich-copy,
  .agent-rich-copy p,
  .agent-project-copy p,
  .nrs-work-card-copy p,
  .nrs-case-v4-note,
  .nrs-case-evidence-head p,
  .nrs-home-experience-list p,
  figcaption
) {
  color: var(--ap-ink-soft) !important;
}

.agent-portfolio main :is(.agent-meta, .agent-kicker) {
  color: var(--ap-ink-faint) !important;
}

.agent-portfolio main :is(h1, h2, h3, h4, h5, h6, dt, dd) {
  text-shadow: none !important;
}

/* One mobile identity only. The old shell and later masthead patches used to stack two names. */
.agent-portfolio .agent-mobile-brand {
  display: none;
}

@media (max-width: 1023px) {
  .agent-portfolio .nav-wrapper,
  .agent-portfolio .mobile-logo {
    display: none !important;
  }

  .agent-portfolio .agent-mobile-brand {
    position: fixed !important;
    top: calc(env(safe-area-inset-top, 0px) + 10px) !important;
    left: max(var(--ap-gutter), env(safe-area-inset-left, 0px)) !important;
    right: auto !important;
    z-index: 2147483001 !important;
    display: flex !important;
    align-items: center !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: calc(100vw - 8.75rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
    min-height: 44px !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: transparent !important;
    color: var(--ap-ink) !important;
    text-decoration: none !important;
    -webkit-text-fill-color: var(--ap-ink) !important;
  }

  .agent-portfolio .agent-mobile-brand strong {
    display: block !important;
    max-width: 100% !important;
    margin: 0 !important;
    overflow: hidden !important;
    color: inherit !important;
    font: 750 .86rem/1.05 var(--ap-font-display) !important;
    letter-spacing: -.025em !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    -webkit-text-fill-color: currentColor !important;
  }

  .agent-portfolio .agent-mobile-brand span {
    display: none !important;
  }

  .agent-portfolio.menu-open .agent-mobile-brand {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
}

@media (max-width: 360px) {
  .agent-portfolio .agent-mobile-brand {
    max-width: calc(100vw - 8rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
  }
  .agent-portfolio .agent-mobile-brand strong { font-size: .8rem !important; }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const required of [
  start,
  '--nrs-inverse-ink: #f7f2e8',
  '.nrs-case-v4 .agent-section--inverse .agent-decision',
  '.agent-mobile-brand',
  '.nav-wrapper,',
]) {
  if (!style.includes(required)) throw new Error(`[final-brand-contrast] Missing contract: ${required}`);
}

console.log(`[final-brand-contrast] Repaired mobile identity on ${repairedBrands} route(s) and applied final theme contrast contract.`);
