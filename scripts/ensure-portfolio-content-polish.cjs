const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(target, 'style.css');
const start = '/* nrs-portfolio-content-polish-v1:start */';
const end = '/* nrs-portfolio-content-polish-v1:end */';
const marker = /\/\* nrs-portfolio-content-polish-v\d+:start \*\/[\s\S]*?\/\* nrs-portfolio-content-polish-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[portfolio-content-polish] Missing ${stylePath}`);

const css = `${start}
.agent-portfolio .nav-pill {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

html[data-theme='light'] .agent-portfolio .nav-wrapper {
  background: color-mix(in srgb, var(--ap-page) 96%, transparent) !important;
}

html[data-theme='light'] .agent-portfolio .nav-link:not(.active):not([aria-current='page']) {
  background: transparent !important;
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

@media (max-width: 1023px) {
  .agent-portfolio .agent-process-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .agent-portfolio .agent-process-step:nth-child(2) { border-right: 0; }
  .agent-portfolio .agent-process-step:nth-child(-n + 2) { border-bottom: 1px solid var(--ap-line); }
  .agent-portfolio .agent-process-step:nth-child(3) { padding-left: 0; }
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

for (const required of ['.agent-portfolio .nav-pill', '.agent-portfolio .agent-process-grid', 'repeat(4, minmax(0, 1fr))', 'padding-left: clamp(18px, 2vw, 30px) !important']) {
  if (!style.includes(required)) throw new Error(`[portfolio-content-polish] Missing contract: ${required}`);
}

console.log(`[portfolio-content-polish] Applied to ${path.relative(root, stylePath)}.`);
