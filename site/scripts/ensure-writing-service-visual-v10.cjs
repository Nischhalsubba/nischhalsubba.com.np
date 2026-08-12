/**
 * @fileoverview scripts/ensure-writing-service-visual-v10.cjs
 * Purpose: Apply the ensure writing service visual v10 production transformation or maintenance step while preserving canonical source/build contracts.
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
if (!fs.existsSync(stylePath)) throw new Error('[writing-service-v10] Missing style.css');

const start = '/* nrs-writing-service-visual-v10:start */';
const end = '/* nrs-writing-service-visual-v10:end */';
const marker = /\/\* nrs-writing-service-visual-v\d+:start \*\/[\s\S]*?\/\* nrs-writing-service-visual-v\d+:end \*\//g;

const css = `${start}
/* The original service link enlarged its click target with ::after inset -100vw.
   That created an invisible 2,000px-wide box. Use real 44px link targets instead. */
.agent-portfolio .nrs-editorial-services .agent-service-link::after {
  content: none !important;
  display: none !important;
}
.agent-portfolio .nrs-editorial-services :is(.agent-service-link,.agent-service-proof) {
  min-height: 44px !important;
  align-items: center !important;
  padding-block: .25rem !important;
}

/* Featured Writing cards reuse .agent-index-item markup, whose archive component is
   a five-column row. Reset the card itself to one column before placing three cards
   side-by-side. This keeps article titles readable instead of one character per line. */
.agent-portfolio .nrs-writing-featured-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  width: 100% !important;
  min-width: 0 !important;
}
.agent-portfolio .nrs-writing-featured-item.agent-index-item {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) !important;
  grid-auto-flow: row !important;
  align-content: start !important;
  align-items: start !important;
  gap: .9rem !important;
  width: 100% !important;
  min-width: 0 !important;
  padding: clamp(1.15rem, 2vw, 1.6rem) !important;
}
.agent-portfolio .nrs-writing-featured-item.agent-index-item > * {
  grid-column: 1 !important;
  min-width: 0 !important;
  max-width: 100% !important;
}
.agent-portfolio .nrs-writing-featured-item .agent-project-index {
  display: none !important;
}
.agent-portfolio .nrs-writing-featured-item h2 {
  width: auto !important;
  max-width: 18ch !important;
  margin: 0 !important;
  font-size: clamp(1.65rem, 2.45vw, 2.5rem) !important;
  line-height: .98 !important;
  overflow-wrap: normal !important;
  word-break: normal !important;
  hyphens: none !important;
}
.agent-portfolio .nrs-writing-featured-item p {
  width: auto !important;
  max-width: 42ch !important;
  margin: 0 !important;
  line-height: 1.55 !important;
  overflow-wrap: normal !important;
  word-break: normal !important;
}
.agent-portfolio .nrs-writing-featured-item .agent-meta {
  width: auto !important;
  max-width: 100% !important;
}
.agent-portfolio .nrs-writing-featured-item .agent-project-arrow {
  justify-self: start !important;
  margin-top: .25rem !important;
}
@media (max-width: 900px) {
  .agent-portfolio .nrs-writing-featured-grid {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .agent-portfolio .nrs-writing-featured-item h2,
  .agent-portfolio .nrs-writing-featured-item p {
    max-width: 34rem !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');
console.log('[writing-service-v10] Fixed Writing feature-card inheritance and Services link overflow.');
