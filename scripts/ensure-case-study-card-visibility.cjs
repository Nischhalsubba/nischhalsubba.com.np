/**
 * @fileoverview scripts/ensure-case-study-card-visibility.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure case study card visibility.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(target, 'style.css');
const start = '/* nrs-case-card-visibility-v2:start */';
const end = '/* nrs-case-card-visibility-v2:end */';
const marker = /\/\* nrs-case-card-visibility-v\d+:start \*\/[\s\S]*?\/\* nrs-case-card-visibility-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[case-card-visibility] Missing ${stylePath}`);

const css = `${start}
/* Final case-study contrast contract. Inverse editorial sections stay genuinely dark in both themes. */
.agent-portfolio .nrs-editorial-case .agent-section--inverse {
  --nrs-case-inverse-bg: #11110f;
  --nrs-case-inverse-surface: #191916;
  --nrs-case-inverse-text: #f7f2e8;
  --nrs-case-inverse-muted: #d8d1c5;
  --nrs-case-inverse-line: rgba(247, 242, 232, .24);
  background: var(--nrs-case-inverse-bg) !important;
  color: var(--nrs-case-inverse-text) !important;
}

.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-section-head h2,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-subhead,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-list li,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-section-body > p {
  color: var(--nrs-case-inverse-text) !important;
}

.agent-portfolio .nrs-editorial-case .agent-section--inverse .agent-meta,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-evidence-note,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-supporting {
  color: var(--nrs-case-inverse-muted) !important;
}

.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-list {
  border-top-color: rgba(247, 242, 232, .42) !important;
}

.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-list li {
  border-bottom-color: var(--nrs-case-inverse-line) !important;
}

.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-list li::before {
  background: var(--ap-signal) !important;
}

/* Give every design-move card its own visible surface instead of one black rectangle. */
.agent-portfolio .agent-section--inverse .nrs-case-decision-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: clamp(.9rem, 1.4vw, 1.3rem) !important;
  border: 0 !important;
  background: transparent !important;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card {
  position: relative;
  display: grid;
  align-content: start;
  gap: 1rem;
  min-width: 0;
  min-height: clamp(13rem, 18vw, 17rem);
  padding: clamp(1.35rem, 2vw, 1.85rem) !important;
  border: 1px solid var(--nrs-case-inverse-line, rgba(247, 242, 232, .24)) !important;
  background: var(--nrs-case-inverse-surface, #191916) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .04);
  color: var(--nrs-case-inverse-text, #f7f2e8) !important;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card:nth-child(even) {
  padding: clamp(1.35rem, 2vw, 1.85rem) !important;
  border-right: 1px solid var(--nrs-case-inverse-line, rgba(247, 242, 232, .24)) !important;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card .agent-meta {
  width: fit-content;
  margin: 0;
  padding: .38rem .55rem;
  border: 1px solid rgba(247, 242, 232, .2);
  background: rgba(255, 255, 255, .045);
  color: var(--nrs-case-inverse-muted, #d8d1c5) !important;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card h3 {
  max-width: 18ch;
  margin: .2rem 0 0;
  color: var(--nrs-case-inverse-text, #f7f2e8) !important;
  font: 740 clamp(1.55rem, 2.3vw, 2.25rem)/1 var(--ap-font-display);
  letter-spacing: -.045em;
  text-wrap: balance;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card p {
  max-width: 35rem;
  margin: 0;
  color: var(--nrs-case-inverse-muted, #d8d1c5) !important;
  font-size: 1rem;
  line-height: 1.65;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card:hover {
  border-color: rgba(247, 242, 232, .42) !important;
  background: #1e1e1a !important;
}

/* Tighten About > Four passes. The previous section left a presentation-slide-sized void. */
.agent-portfolio .agent-process-section {
  padding-top: clamp(3.25rem, 4.8vw, 5rem) !important;
  padding-bottom: clamp(3.5rem, 5vw, 5.25rem) !important;
}

.agent-portfolio .agent-process-head {
  margin-bottom: clamp(1.75rem, 2.5vw, 2.5rem) !important;
}

.agent-portfolio .agent-process-grid {
  margin-top: 0 !important;
}

.agent-portfolio .agent-process-step {
  min-height: clamp(13rem, 17vw, 15rem) !important;
  gap: clamp(1.6rem, 2.4vw, 2.5rem) !important;
}

/* Long-form case copy stays readable and avoids pale secondary text on light surfaces. */
.agent-portfolio .nrs-editorial-case .nrs-case-section-body,
.agent-portfolio .nrs-editorial-case .nrs-case-section-body > p,
.agent-portfolio .nrs-editorial-case .nrs-case-list li {
  color: var(--ap-ink-soft) !important;
}

.agent-portfolio .nrs-editorial-case .nrs-case-section-head h2,
.agent-portfolio .nrs-editorial-case .nrs-case-subhead {
  color: var(--ap-ink) !important;
}

/* Reassert inverse colors after the light-surface rules above. */
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-section-head h2,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-subhead,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-list li,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-section-body,
.agent-portfolio .nrs-editorial-case .agent-section--inverse .nrs-case-section-body > p {
  color: var(--nrs-case-inverse-text) !important;
}

.agent-portfolio .nrs-editorial-case .nrs-case-section-body > p {
  max-width: 46rem;
  font-size: clamp(1rem, 1.15vw, 1.08rem);
  line-height: 1.76;
}

.agent-portfolio .nrs-editorial-case .nrs-case-section-head h2 {
  max-width: 13ch;
}

@media (max-width: 1023px) {
  .agent-portfolio .agent-process-section {
    padding-top: 3.5rem !important;
    padding-bottom: 4rem !important;
  }
}

@media (max-width: 767px) {
  .agent-portfolio .agent-section--inverse .nrs-case-decision-grid {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .agent-portfolio .agent-section--inverse .nrs-case-decision-card,
  .agent-portfolio .agent-section--inverse .nrs-case-decision-card:nth-child(even) {
    min-height: 0;
    padding: 1.25rem !important;
  }

  .agent-portfolio .agent-process-section {
    padding-top: 3rem !important;
    padding-bottom: 3.25rem !important;
  }

  .agent-portfolio .agent-process-head {
    margin-bottom: 1.5rem !important;
  }

  .agent-portfolio .agent-process-step {
    min-height: 0 !important;
    gap: 1.25rem !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const required of [
  '.nrs-editorial-case .agent-section--inverse',
  '--nrs-case-inverse-text: #f7f2e8',
  '.nrs-case-decision-card',
  '.agent-process-section',
  'margin-bottom: clamp(1.75rem, 2.5vw, 2.5rem) !important',
]) {
  if (!style.includes(required)) throw new Error(`[case-card-visibility] Missing contract: ${required}`);
}

console.log(`[case-card-visibility] Applied contrast, card visibility, and process spacing to ${path.relative(root, stylePath)}.`);
