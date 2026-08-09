const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');
const stylePath = path.join(base, 'style.css');

if (!fs.existsSync(homePath)) {
  throw new Error(`[signal-hero-cleanup] Missing ${homePath}`);
}
if (!fs.existsSync(stylePath)) {
  throw new Error(`[signal-hero-cleanup] Missing ${stylePath}`);
}

let html = fs.readFileSync(homePath, 'utf8');
const legendStart = html.indexOf('<div class="legend" aria-label="Visual legend">');

if (legendStart >= 0) {
  const hintStart = html.indexOf('<p class="hint">', legendStart);
  if (hintStart < 0) {
    throw new Error('[signal-hero-cleanup] Legend found but instruction hint boundary is missing.');
  }

  const hintEnd = html.indexOf('</p>', hintStart);
  if (hintEnd < 0) {
    throw new Error('[signal-hero-cleanup] Instruction hint closing tag is missing.');
  }

  html = html.slice(0, legendStart) + html.slice(hintEnd + 4);
}

if (html.includes('<div class="legend" aria-label="Visual legend">')) {
  throw new Error('[signal-hero-cleanup] Visual legend survived cleanup.');
}
if (html.includes('<p class="hint">Desktop: move the pointer for subtle depth.')) {
  throw new Error('[signal-hero-cleanup] Interaction instruction survived cleanup.');
}

const practiceSection = /<section\b[^>]*aria-labelledby=["']practice-heading["'][^>]*>[\s\S]*?<\/section>/i;
if (!practiceSection.test(html)) {
  throw new Error('[home-habits] Homepage What I bring section was not found.');
}

const habitsSection = `<section class="agent-section agent-section--inverse nrs-home-habits" aria-labelledby="practice-heading"><div class="agent-frame"><header class="agent-section-head nrs-home-habits-head"><span class="agent-kicker">What I bring</span><h2 class="agent-section-title" id="practice-heading">Three habits that keep product decisions useful through implementation.</h2></header><div class="nrs-home-habits-grid"><article class="nrs-home-habit"><span class="agent-meta">01 · Clarity</span><div><h3>Find the real product problem.</h3><p>Clarify the user goal, constraints, important state and decision points before visual polish makes a weak flow look finished.</p></div></article><article class="nrs-home-habit"><span class="agent-meta">02 · Systems</span><div><h3>Reuse decisions, not just components.</h3><p>Build patterns that create consistency while leaving room for workflows that genuinely need to behave differently.</p></div></article><article class="nrs-home-habit"><span class="agent-meta">03 · Delivery</span><div><h3>Close the gap between design and build.</h3><p>Document responsive behavior, states and implementation intent, then stay close enough to QA the real interface.</p></div></article></div></div></section>`;

html = html.replace(practiceSection, habitsSection);

const requiredHabits = [
  '01 · Clarity',
  '02 · Systems',
  '03 · Delivery',
  'Reuse decisions, not just components.',
  'Close the gap between design and build.',
];
for (const token of requiredHabits) {
  if (!html.includes(token)) throw new Error(`[home-habits] Missing required content: ${token}`);
}
if (html.includes('04 · Delivery') || html.includes('03 · Systems')) {
  throw new Error('[home-habits] Legacy numbering survived homepage normalization.');
}

fs.writeFileSync(homePath, html, 'utf8');

const cssStart = '/* nrs-home-habits-fix:start */';
const cssEnd = '/* nrs-home-habits-fix:end */';
const cssMarker = /\/\* nrs-home-habits-fix:start \*\/[\s\S]*?\/\* nrs-home-habits-fix:end \*\//g;
const habitsCss = `${cssStart}
.agent-portfolio .nrs-home-habits {
  padding-block: clamp(4.5rem, 7vw, 7rem) !important;
}
.agent-portfolio .nrs-home-habits-head {
  display: grid !important;
  grid-template-columns: minmax(10rem, .65fr) minmax(0, 1.35fr) !important;
  gap: 1.25rem clamp(2rem, 7vw, 8rem) !important;
  align-items: start !important;
  margin-bottom: clamp(2.5rem, 5vw, 4.5rem) !important;
}
.agent-portfolio .nrs-home-habits-head .agent-section-title {
  max-width: 15ch !important;
  margin: 0 !important;
  text-wrap: balance;
}
.agent-portfolio .nrs-home-habits-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  border-top: 1px solid rgba(247, 242, 232, .34) !important;
  border-bottom: 1px solid rgba(247, 242, 232, .24) !important;
}
.agent-portfolio .nrs-home-habit {
  display: grid !important;
  grid-template-rows: auto 1fr !important;
  gap: clamp(2.75rem, 4vw, 4.75rem) !important;
  min-width: 0 !important;
  min-height: clamp(13rem, 19vw, 17rem) !important;
  padding: 1.35rem clamp(1.25rem, 2.25vw, 2rem) 1.65rem !important;
  border-right: 1px solid rgba(247, 242, 232, .22) !important;
}
.agent-portfolio .nrs-home-habit:first-child {
  padding-left: 0 !important;
}
.agent-portfolio .nrs-home-habit:last-child {
  padding-right: 0 !important;
  border-right: 0 !important;
}
.agent-portfolio .nrs-home-habit h3 {
  max-width: 16ch !important;
  margin: 0 0 .6rem !important;
  color: #f7f2e8 !important;
  font: 700 clamp(1.55rem, 2.3vw, 2.25rem)/.98 var(--ap-font-display) !important;
  letter-spacing: -.045em !important;
  text-wrap: balance;
}
.agent-portfolio .nrs-home-habit p {
  max-width: 36rem !important;
  margin: 0 !important;
  color: #d8d1c5 !important;
  font-size: clamp(.95rem, 1.1vw, 1.05rem) !important;
  line-height: 1.58 !important;
}
.agent-portfolio .nrs-home-habit .agent-meta {
  color: #c7c0b4 !important;
  opacity: 1 !important;
}
@media (max-width: 900px) {
  .agent-portfolio .nrs-home-habits-head {
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 1rem !important;
  }
  .agent-portfolio .nrs-home-habits-head .agent-section-title {
    max-width: 18ch !important;
  }
  .agent-portfolio .nrs-home-habits-grid {
    grid-template-columns: minmax(0, 1fr) !important;
  }
  .agent-portfolio .nrs-home-habit,
  .agent-portfolio .nrs-home-habit:first-child,
  .agent-portfolio .nrs-home-habit:last-child {
    min-height: 0 !important;
    padding: 1.25rem 0 1.5rem !important;
    border-right: 0 !important;
    border-bottom: 1px solid rgba(247, 242, 232, .22) !important;
    gap: 2rem !important;
  }
  .agent-portfolio .nrs-home-habit:last-child {
    border-bottom: 0 !important;
  }
}
${cssEnd}`;

let css = fs.readFileSync(stylePath, 'utf8');
css = css.replace(cssMarker, '').trimEnd();
css += `\n\n${habitsCss}\n`;
fs.writeFileSync(stylePath, css, 'utf8');

console.log('[signal-hero-cleanup] Removed hero legend/instructions and normalized the homepage Three habits section.');
