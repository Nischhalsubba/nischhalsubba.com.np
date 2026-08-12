/**
 * @fileoverview scripts/ensure-portfolio-content-polish.cjs
 * Purpose: Apply the ensure portfolio content polish production transformation or maintenance step while preserving canonical source/build contracts.
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
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(target, 'style.css');
const start = '/* nrs-portfolio-content-polish-v2:start */';
const end = '/* nrs-portfolio-content-polish-v2:end */';
const marker = /\/\* nrs-portfolio-content-polish-v\d+:start \*\/[\s\S]*?\/\* nrs-portfolio-content-polish-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[portfolio-content-polish] Missing ${stylePath}`);

const css = `${start}
/* Navigation should inherit the portfolio surface, not introduce a white slab. */
.agent-portfolio .nav-pill {
  border: 0 !important;
  background: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html[data-theme='light'] .agent-portfolio .nav-wrapper {
  background: var(--ap-page) !important;
  background-color: var(--ap-page) !important;
  background-image: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html[data-theme='light'] .agent-portfolio .nav-pill,
html[data-theme='light'] .agent-portfolio .nav-link:not(.active):not([aria-current='page']),
html[data-theme='light'] .agent-portfolio .theme-toggle-btn,
html[data-theme='light'] .agent-portfolio #theme-toggle {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
}

.agent-portfolio .agent-process-section {
  padding-block: clamp(4.75rem, 7vw, 7.5rem) !important;
}

.agent-portfolio .agent-process-head {
  margin-bottom: clamp(2rem, 3.5vw, 3.5rem) !important;
}

.agent-portfolio .agent-process-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--ap-line-strong);
  border-bottom: 1px solid var(--ap-line);
}

.agent-portfolio .agent-process-step {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: clamp(2.25rem, 3.6vw, 3.75rem);
  min-width: 0;
  min-height: 15.5rem;
  padding: 1.25rem clamp(1.15rem, 2vw, 1.75rem) 1.75rem 0;
  border-right: 1px solid var(--ap-line);
}

.agent-portfolio .agent-process-step:not(:first-child) {
  padding-left: clamp(1.15rem, 2vw, 1.75rem);
}

.agent-portfolio .agent-process-step:last-child {
  padding-right: 0;
  border-right: 0;
}

.agent-portfolio .agent-process-step h3 {
  margin: 0 0 .75rem;
  color: var(--ap-ink);
  font: 700 clamp(1.5rem, 2.3vw, 2.25rem)/1 var(--ap-font-display);
  letter-spacing: -.045em;
}

.agent-portfolio .agent-process-step p {
  max-width: 31rem;
  margin: 0;
  color: var(--ap-ink-soft);
  font-size: 1rem;
  line-height: 1.62;
}

.agent-portfolio .agent-project-row,
.agent-portfolio .agent-index-item {
  box-sizing: border-box;
  padding-left: clamp(18px, 2vw, 30px) !important;
  padding-right: clamp(18px, 2vw, 30px) !important;
}

.agent-portfolio .agent-project-index-section .agent-project-copy p {
  max-width: 36rem;
}

/* Hiring-focused case study system. */
.agent-portfolio .nrs-hireable-case-hero {
  padding-block: clamp(4.5rem, 8vw, 8rem) clamp(3.5rem, 6vw, 6rem);
  border-bottom: 1px solid var(--ap-line);
}

.agent-portfolio .nrs-hireable-case-hero .agent-case-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 2rem);
  align-items: start;
}

.agent-portfolio .nrs-case-breadcrumb {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: .65rem;
  margin-bottom: clamp(1.25rem, 2vw, 2.25rem);
  color: var(--ap-ink-faint);
  font: 600 .72rem/1.4 var(--ap-font-mono);
  letter-spacing: .07em;
  text-transform: uppercase;
}

.agent-portfolio .nrs-case-breadcrumb a {
  color: var(--ap-ink);
  text-decoration: none;
}

.agent-portfolio .nrs-hireable-case-hero .agent-case-title-wrap {
  grid-column: 1 / span 6;
}

.agent-portfolio .nrs-hireable-case-hero .agent-case-title {
  margin: 1rem 0 0;
  font: 760 clamp(4rem, 8.5vw, 8.5rem)/.86 var(--ap-font-display);
  letter-spacing: -.075em;
}

.agent-portfolio .nrs-hireable-case-hero .agent-case-deck {
  grid-column: 7 / -1;
  max-width: 44rem;
  margin: 2.2rem 0 0;
  color: var(--ap-ink-soft);
  font-size: clamp(1.15rem, 1.8vw, 1.55rem);
  line-height: 1.52;
  text-wrap: pretty;
}

.agent-portfolio .nrs-hireable-case-facts {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: clamp(2.5rem, 5vw, 4.5rem) 0 0;
  border-top: 1px solid var(--ap-line-strong);
  border-bottom: 1px solid var(--ap-line);
}

.agent-portfolio .nrs-hireable-case-facts > div {
  min-width: 0;
  padding: 1rem clamp(.75rem, 1.5vw, 1.25rem) 1.15rem 0;
  border-right: 1px solid var(--ap-line);
}

.agent-portfolio .nrs-hireable-case-facts > div:not(:first-child) {
  padding-left: clamp(.75rem, 1.5vw, 1.25rem);
}

.agent-portfolio .nrs-hireable-case-facts > div:last-child {
  border-right: 0;
}

.agent-portfolio .nrs-hireable-case-facts dt {
  margin-bottom: .45rem;
  color: var(--ap-ink-faint);
  font: 650 .68rem/1.3 var(--ap-font-mono);
  letter-spacing: .08em;
  text-transform: uppercase;
}

.agent-portfolio .nrs-hireable-case-facts dd {
  margin: 0;
  color: var(--ap-ink);
  font-size: .98rem;
  line-height: 1.45;
}

.agent-portfolio .nrs-hireable-case-cover {
  grid-column: 1 / -1;
  margin: clamp(2.5rem, 5vw, 5rem) 0 0;
  overflow: clip;
  border: 1px solid var(--ap-line);
  background: var(--ap-surface);
}

.agent-portfolio .nrs-hireable-case-cover img {
  width: 100%;
  height: auto;
}

.agent-portfolio .nrs-case-section {
  display: grid;
  grid-template-columns: minmax(13rem, 3fr) minmax(0, 7fr);
  gap: clamp(2rem, 6vw, 7rem);
  align-items: start;
}

.agent-portfolio .nrs-case-section-head {
  display: grid;
  gap: 1.15rem;
}

.agent-portfolio .nrs-case-section-head h2 {
  max-width: 12ch;
  margin: 0;
  font: 740 clamp(2.25rem, 4.5vw, 4.75rem)/.94 var(--ap-font-display);
  letter-spacing: -.06em;
  text-wrap: balance;
}

.agent-portfolio .nrs-case-section-body {
  min-width: 0;
  max-width: 55rem;
  color: var(--ap-ink-soft);
  font-size: 1.03rem;
  line-height: 1.72;
}

.agent-portfolio .nrs-case-section-body > p {
  max-width: 48rem;
  margin: 0 0 1.25rem;
}

.agent-portfolio .nrs-case-subhead {
  margin: clamp(2.5rem, 5vw, 4.5rem) 0 1rem;
  color: var(--ap-ink);
  font: 720 clamp(1.45rem, 2.2vw, 2rem)/1.05 var(--ap-font-display);
  letter-spacing: -.035em;
}

.agent-portfolio .nrs-case-callout {
  max-width: 48rem;
  margin-top: 2rem;
  padding: 1.1rem 0 0;
  border-top: 1px solid var(--ap-line-strong);
}

.agent-portfolio .nrs-case-callout strong,
.agent-portfolio .nrs-case-handoff-grid strong,
.agent-portfolio .nrs-case-signal-grid strong {
  color: var(--ap-ink);
  font: 700 .78rem/1.35 var(--ap-font-mono);
  letter-spacing: .055em;
  text-transform: uppercase;
}

.agent-portfolio .nrs-case-callout p,
.agent-portfolio .nrs-case-handoff-grid p {
  margin: .55rem 0 0;
}

.agent-portfolio .nrs-case-list {
  display: grid;
  gap: 0;
  max-width: 52rem;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--ap-line-strong);
}

.agent-portfolio .nrs-case-list li {
  position: relative;
  padding: 1rem 0 1rem 1.5rem;
  border-bottom: 1px solid var(--ap-line);
}

.agent-portfolio .nrs-case-list li::before {
  content: '';
  position: absolute;
  top: 1.6rem;
  left: 0;
  width: .45rem;
  height: .45rem;
  background: var(--ap-signal);
}

.agent-portfolio .nrs-case-decision-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 0 !important;
  border-top: 1px solid color-mix(in srgb, var(--ap-inverse-ink) 36%, transparent);
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-grid .agent-decision {
  padding: 1.4rem clamp(1rem, 2vw, 1.75rem) 1.75rem 0;
  border-right: 1px solid color-mix(in srgb, var(--ap-inverse-ink) 22%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--ap-inverse-ink) 22%, transparent);
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-grid .agent-decision:nth-child(even) {
  padding-left: clamp(1rem, 2vw, 1.75rem);
  padding-right: 0;
  border-right: 0;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-grid h3,
.agent-portfolio .agent-section--inverse .nrs-case-decision-grid strong {
  color: var(--ap-inverse-ink);
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-grid p,
.agent-portfolio .agent-section--inverse .nrs-case-decision-grid .agent-meta {
  color: color-mix(in srgb, var(--ap-inverse-ink) 72%, transparent);
}

.agent-portfolio .nrs-case-supporting,
.agent-portfolio .nrs-case-evidence-note {
  max-width: 48rem;
  margin-top: 1.75rem !important;
  color: var(--ap-ink-faint);
  font-size: .94rem;
  line-height: 1.65;
}

.agent-portfolio .agent-section--inverse .nrs-case-supporting,
.agent-portfolio .agent-section--inverse .nrs-case-evidence-note {
  color: color-mix(in srgb, var(--ap-inverse-ink) 70%, transparent);
}

.agent-portfolio .nrs-case-handoff-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  max-width: 52rem;
  margin-top: 2rem;
  background: var(--ap-line);
  border: 1px solid var(--ap-line);
}

.agent-portfolio .nrs-case-handoff-grid article {
  min-width: 0;
  padding: 1.25rem;
  background: var(--ap-page);
}

.agent-portfolio .nrs-case-evidence-links {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

.agent-portfolio .nrs-case-signal-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  max-width: 55rem;
  background: var(--ap-line);
  border: 1px solid var(--ap-line);
}

.agent-portfolio .nrs-case-signal-grid article {
  min-height: 8rem;
  display: flex;
  align-items: end;
  padding: 1.25rem;
  background: var(--ap-page);
}

.agent-portfolio .nrs-case-actions {
  margin-top: 2rem;
}

@media (max-width: 1023px) {
  .agent-portfolio .agent-process-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .agent-portfolio .agent-process-step:nth-child(2) { border-right: 0; }
  .agent-portfolio .agent-process-step:nth-child(-n + 2) { border-bottom: 1px solid var(--ap-line); }
  .agent-portfolio .agent-process-step:nth-child(3) { padding-left: 0; }

  .agent-portfolio .nrs-hireable-case-hero .agent-case-title-wrap,
  .agent-portfolio .nrs-hireable-case-hero .agent-case-deck {
    grid-column: 1 / -1;
  }

  .agent-portfolio .nrs-hireable-case-hero .agent-case-deck {
    margin-top: .75rem;
  }

  .agent-portfolio .nrs-case-section {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }

  .agent-portfolio .nrs-case-section-head h2 {
    max-width: 15ch;
  }
}

@media (max-width: 767px) {
  .agent-portfolio .agent-process-section { padding-block: 4rem !important; }
  .agent-portfolio .agent-process-head { margin-bottom: 2rem !important; }
  .agent-portfolio .agent-process-grid { grid-template-columns: minmax(0, 1fr); }

  .agent-portfolio .agent-process-step,
  .agent-portfolio .agent-process-step:not(:first-child),
  .agent-portfolio .agent-process-step:nth-child(3) {
    min-height: 0;
    gap: 1.5rem;
    padding: 1.35rem 0 1.6rem !important;
    border-right: 0;
    border-bottom: 1px solid var(--ap-line);
  }

  .agent-portfolio .agent-process-step:last-child { border-bottom: 0; }

  .agent-portfolio .agent-project-row,
  .agent-portfolio .agent-index-item {
    padding-left: 14px !important;
    padding-right: 14px !important;
  }

  .agent-portfolio .nrs-hireable-case-hero {
    padding-block: 3rem 3.5rem;
  }

  .agent-portfolio .nrs-hireable-case-facts {
    grid-template-columns: minmax(0, 1fr);
  }

  .agent-portfolio .nrs-hireable-case-facts > div,
  .agent-portfolio .nrs-hireable-case-facts > div:not(:first-child) {
    padding: .9rem 0 !important;
    border-right: 0;
    border-bottom: 1px solid var(--ap-line);
  }

  .agent-portfolio .nrs-hireable-case-facts > div:last-child {
    border-bottom: 0;
  }

  .agent-portfolio .nrs-case-decision-grid,
  .agent-portfolio .nrs-case-handoff-grid,
  .agent-portfolio .nrs-case-signal-grid {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .agent-portfolio .agent-section--inverse .nrs-case-decision-grid .agent-decision,
  .agent-portfolio .agent-section--inverse .nrs-case-decision-grid .agent-decision:nth-child(even) {
    padding: 1.25rem 0 !important;
    border-right: 0;
  }

  .agent-portfolio .nrs-case-signal-grid article {
    min-height: 6rem;
  }

  .agent-portfolio .nrs-case-evidence-links,
  .agent-portfolio .nrs-case-actions {
    display: grid;
  }

  .agent-portfolio .nrs-case-evidence-links .agent-btn,
  .agent-portfolio .nrs-case-actions .agent-btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .agent-project-row,
  .agent-portfolio .agent-index-item { transition-duration: 0ms !important; }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const required of [
  "html[data-theme='light'] .agent-portfolio .nav-wrapper",
  'background: var(--ap-page) !important',
  '.agent-portfolio .agent-process-grid',
  'repeat(4, minmax(0, 1fr))',
  'padding-left: clamp(18px, 2vw, 30px) !important',
  '.agent-portfolio .nrs-case-section',
  '.agent-portfolio .nrs-hireable-case-facts',
]) {
  if (!style.includes(required)) throw new Error(`[portfolio-content-polish] Missing contract: ${required}`);
}

console.log(`[portfolio-content-polish] Applied to ${path.relative(root, stylePath)}.`);
