const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(target, 'style.css');
const start = '/* nrs-case-card-visibility-v1:start */';
const end = '/* nrs-case-card-visibility-v1:end */';
const marker = /\/\* nrs-case-card-visibility-v\d+:start \*\/[\s\S]*?\/\* nrs-case-card-visibility-v\d+:end \*\//g;

if (!fs.existsSync(stylePath)) throw new Error(`[case-card-visibility] Missing ${stylePath}`);

const css = `${start}
/* Give each decision a real surface. Previously the cards were transparent on the inverse section. */
.agent-portfolio .agent-section--inverse .nrs-case-decision-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: clamp(.85rem, 1.4vw, 1.25rem) !important;
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
  padding: clamp(1.35rem, 2vw, 1.8rem) !important;
  border: 1px solid color-mix(in srgb, var(--ap-inverse-ink) 24%, transparent) !important;
  background: color-mix(in srgb, var(--ap-inverse-ink) 7%, var(--ap-inverse)) !important;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--ap-inverse-ink) 7%, transparent);
  color: var(--ap-inverse-ink) !important;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card:nth-child(even) {
  padding: clamp(1.35rem, 2vw, 1.8rem) !important;
  border-right: 1px solid color-mix(in srgb, var(--ap-inverse-ink) 24%, transparent) !important;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card .agent-meta {
  width: fit-content;
  margin: 0;
  padding: .4rem .55rem;
  border: 1px solid color-mix(in srgb, var(--ap-inverse-ink) 22%, transparent);
  background: color-mix(in srgb, var(--ap-inverse-ink) 8%, transparent);
  color: color-mix(in srgb, var(--ap-inverse-ink) 82%, transparent) !important;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card h3 {
  max-width: 18ch;
  margin: .25rem 0 0;
  color: var(--ap-inverse-ink) !important;
  font: 740 clamp(1.55rem, 2.3vw, 2.25rem)/1 var(--ap-font-display);
  letter-spacing: -.045em;
  text-wrap: balance;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card p {
  max-width: 35rem;
  margin: 0;
  color: color-mix(in srgb, var(--ap-inverse-ink) 78%, transparent) !important;
  font-size: 1rem;
  line-height: 1.65;
}

.agent-portfolio .agent-section--inverse .nrs-case-decision-card:hover {
  border-color: color-mix(in srgb, var(--ap-inverse-ink) 44%, transparent) !important;
  background: color-mix(in srgb, var(--ap-inverse-ink) 10%, var(--ap-inverse)) !important;
}

.agent-portfolio .nrs-senior-case .nrs-case-section-body > p {
  max-width: 46rem;
  font-size: clamp(1rem, 1.15vw, 1.08rem);
  line-height: 1.76;
}

.agent-portfolio .nrs-senior-case .nrs-case-section-head h2 {
  max-width: 13ch;
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
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const required of ['.nrs-case-decision-card', 'background: color-mix(in srgb, var(--ap-inverse-ink) 7%, var(--ap-inverse)) !important', 'grid-template-columns: repeat(2, minmax(0, 1fr)) !important']) {
  if (!style.includes(required)) throw new Error(`[case-card-visibility] Missing contract: ${required}`);
}

console.log(`[case-card-visibility] Applied visible decision-card surfaces to ${path.relative(root, stylePath)}.`);
