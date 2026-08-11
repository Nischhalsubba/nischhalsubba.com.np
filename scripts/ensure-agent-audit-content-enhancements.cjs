/**
 * @fileoverview scripts/ensure-agent-audit-content-enhancements.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure agent audit content enhancements.
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
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');

/**
 * Function contract: enhanceAbout
 * Purpose: Implements the enhance about responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function enhanceAbout() {
  const file = path.join(base, 'about.html');
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('nrs-experience-section')) return false;

  const experience = `<section class="agent-section nrs-experience-section" aria-labelledby="nrs-experience-heading"><div class="agent-frame"><header class="nrs-experience-head"><span class="agent-kicker">Selected experience</span><h2 id="nrs-experience-heading">Six years across agencies, product teams, Web3 and enterprise software.</h2><p>A compact chronology for recruiters who need the work history before the philosophy.</p></header><div class="nrs-experience-list"><article><div><span>2025</span><strong>Idealaya</strong></div><div><h3>Product Designer</h3><p>Led UI/UX for enterprise web software, delivered implementation-ready prototypes, and maintained a design system for cross-screen consistency.</p></div></article><article><div><span>2024–25</span><strong>Mokshya Protocol</strong></div><div><h3>Product Designer</h3><p>Designed Web3 product interfaces and interactive prototypes, balancing wallet-native behavior with clearer workflows and product feedback.</p></div></article><article><div><span>2023</span><strong>Tegzy</strong></div><div><h3>Lead User Experience Designer</h3><p>Built and scaled a design system, standardized reusable UX patterns, and improved design-to-development handoff and designer onboarding.</p></div></article><article><div><span>2021–23</span><strong>ESR Tech</strong></div><div><h3>Senior UI/UX Designer</h3><p>Designed dashboard UX for an internal tool and contributed to broader product and company website work.</p></div></article><article><div><span>2019–21</span><strong>Gurzu</strong></div><div><h3>UI/UX Designer</h3><p>Worked with clients on product goals, prototyped new ideas, and improved existing interfaces for usability and efficiency.</p></div></article></div><a class="agent-btn" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>View full resume</a></div></section>`;

  const manifesto = html.match(/<section\b[^>]*class=["'][^"']*agent-section--inverse[^"']*["'][^>]*>[\s\S]*?<blockquote\b/i);
  if (manifesto?.index != null) {
    html = html.slice(0, manifesto.index) + experience + html.slice(manifesto.index);
  } else {
    html = html.replace(/<\/main>/i, `${experience}</main>`);
  }
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

const serviceMap = new Map([
  ['Product UX', ['/product-design-nepal', '/project-pihub', 'piHub']],
  ['Interface design', ['/saas-ux-designer', '/project-yarsha', 'Yarsha']],
  ['Design systems', ['/figma-design-systems', '/project-orkest', 'Orkest HQ']],
  ['Website UX', ['/website-ux-design', '/project-morajaa', 'Morajaa']],
  ['UX audit', ['/ux-audit', '/project-neverwinter-parser', 'Neverwinter Live Parser']],
  ['Design-to-dev', ['/product-design-nepal', '/project-splashnode', 'Splashnode']],
]);

/**
 * Function contract: enhanceServices
 * Purpose: Implements the enhance services responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function enhanceServices() {
  const file = path.join(base, 'services.html');
  if (!fs.existsSync(file)) return 0;
  let html = fs.readFileSync(file, 'utf8');
  let changed = 0;
  html = html.replace(/<article\b([^>]*class=["'][^"']*agent-service\b[^"']*["'][^>]*)>([\s\S]*?)<\/article>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: article, attrs, body. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (article, attrs, body) => {
    if (/agent-service-link/.test(body)) return article;
    const title = body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
    const links = serviceMap.get(title);
    if (!links) return article;
    changed += 1;
    const [serviceHref, caseHref, caseTitle] = links;
    const actions = `<div class="agent-service-actions"><a class="agent-service-link" href="${serviceHref}">Explore service <span aria-hidden="true">↗</span></a><a class="agent-service-proof" href="${caseHref}">Related case: ${caseTitle}</a></div>`;
    const updatedBody = body.replace(/(<div>\s*<h2\b[\s\S]*?<p\b[\s\S]*?<\/p>)(\s*<\/div>)/i, `$1${actions}$2`);
    return `<article${attrs}>${updatedBody}</article>`;
  });
  fs.writeFileSync(file, html, 'utf8');
  return changed;
}

const featuredWriting = new Set([
  '/blog/beautiful-interface-poor-ux',
  '/blog/design-systems-small-product-teams.html',
  '/blog/responsive-saas-dashboard-handoff-notes.html',
]);

/**
 * Function contract: enhanceWritingFile
 * Purpose: Implements the enhance writing file responsibility for this module.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function enhanceWritingFile(file) {
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*class=["'][^"']*agent-main[^"']*["'][^>]*>[\s\S]*?<\/main>/i)?.[0];
  if (!main || !main.includes('agent-index-list') || main.includes('nrs-writing-featured')) return false;
  const hero = main.match(/<header\b[^>]*class=["'][^"']*agent-page-hero[^"']*["'][^>]*>[\s\S]*?<\/header>/i)?.[0] || '';
  const items = [...main.matchAll(/<a\b[^>]*class=["'][^"']*agent-index-item[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi)]
    .map(/** Callback contract: Processes the callback step for [...main.match all(/<a\b[^>]*class=["'][^"']*agent index item[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>[\s\s]*?<\/a>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => ({ href: match[1], html: match[0] }));
  if (!items.length) return false;

  const picks = items.filter(/** Callback contract: Processes the callback step for items without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => featuredWriting.has(item.href));
  if (!picks.length) return false;
  const rest = items.filter(/** Callback contract: Processes the callback step for items without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => !featuredWriting.has(item.href));
  const featured = `<section class="agent-section nrs-writing-featured"><div class="agent-frame"><div class="nrs-writing-featured-head"><span class="agent-kicker">Start with these</span><h2>Three opinionated notes from the work.</h2><p>Design trade-offs, systems thinking and the gap between a polished screen and a usable product.</p></div><div class="nrs-writing-featured-grid">${picks.map(/** Callback contract: Processes the callback step for picks without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.html.replace('agent-index-item', 'agent-index-item nrs-writing-featured-item')).join('')}</div></div></section>`;
  const archive = `<section class="agent-section agent-section--compact nrs-writing-archive"><div class="agent-frame"><header class="nrs-writing-archive-head"><span class="agent-kicker">Archive</span><h2>More product design writing</h2></header><div class="agent-index-list">${rest.map(/** Callback contract: Processes the callback step for rest without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.html).join('')}</div></div></section>`;
  html = html.replace(main, `<main id="main-content" class="agent-main nrs-writing-remediated">${hero}${featured}${archive}</main>`);
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

/**
 * Function contract: enhanceWriting
 * Purpose: Implements the enhance writing responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function enhanceWriting() {
  return [path.join(base, 'blog', 'index.html'), path.join(base, 'blog.html')].filter(enhanceWritingFile).length;
}

/**
 * Function contract: appendStyles
 * Purpose: Implements the append styles responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function appendStyles() {
  if (!fs.existsSync(stylePath)) throw new Error('[agent-audit-content] Missing style.css');
  const start = '/* nrs-agent-audit-content-v1:start */';
  const end = '/* nrs-agent-audit-content-v1:end */';
  const marker = /\/\* nrs-agent-audit-content-v\d+:start \*\/[\s\S]*?\/\* nrs-agent-audit-content-v\d+:end \*\//g;
  const css = `${start}
.agent-portfolio .nrs-experience-section { padding-block: clamp(4rem, 7vw, 7rem) !important; }
.agent-portfolio .nrs-experience-head { display: grid; grid-template-columns: .75fr 1.25fr; gap: .8rem clamp(2rem, 6vw, 7rem); margin-bottom: 2.5rem; }
.agent-portfolio .nrs-experience-head .agent-kicker { grid-row: 1 / 3; }
.agent-portfolio .nrs-experience-head h2 { max-width: 15ch; margin: 0; color: var(--ap-ink); font-size: clamp(2.4rem, 4.8vw, 5rem); line-height: .92; }
.agent-portfolio .nrs-experience-head p { max-width: 40rem; margin: 0; color: var(--ap-ink-soft); font-size: 1rem; }
.agent-portfolio .nrs-experience-list { border-top: 1px solid var(--ap-line-strong); margin-bottom: 1.5rem; }
.agent-portfolio .nrs-experience-list article { display: grid; grid-template-columns: minmax(12rem, .65fr) minmax(0, 1.35fr); gap: 1.25rem 2rem; padding: 1.35rem 0; border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-experience-list article > div:first-child { display: grid; grid-template-columns: 5.5rem 1fr; gap: 1rem; align-items: baseline; }
.agent-portfolio .nrs-experience-list span { color: var(--ap-ink-soft); font: 600 .75rem/1.3 var(--ap-font-mono); }
.agent-portfolio .nrs-experience-list strong,
.agent-portfolio .nrs-experience-list h3 { color: var(--ap-ink); }
.agent-portfolio .nrs-experience-list h3 { margin: 0 0 .45rem; font-size: 1.2rem; }
.agent-portfolio .nrs-experience-list p { max-width: 54rem; margin: 0; color: var(--ap-ink-soft); line-height: 1.6; }

.agent-portfolio .agent-service { transition: background-color 160ms ease, border-color 160ms ease; }
.agent-portfolio .agent-service:has(.agent-service-link):hover { background: var(--ap-surface); }
.agent-portfolio .agent-service-actions { position: relative; z-index: 2; display: flex; flex-wrap: wrap; gap: .65rem 1.2rem; margin-top: 1.1rem; }
.agent-portfolio .agent-service-link,
.agent-portfolio .agent-service-proof { position: relative; color: var(--ap-ink); font: 650 .78rem/1.35 var(--ap-font-mono); text-decoration: none; }
.agent-portfolio .agent-service-link { text-transform: uppercase; letter-spacing: .04em; }
.agent-portfolio .agent-service-proof { color: var(--ap-ink-soft); }
.agent-portfolio .agent-service-link::after { content: ''; position: absolute; z-index: -1; inset: -3rem -100vw; }
.agent-portfolio .agent-service-link:focus-visible,
.agent-portfolio .agent-service-proof:focus-visible { outline: 2px solid var(--ap-signal); outline-offset: 4px; }

.agent-portfolio .nrs-writing-featured { padding-block: clamp(4rem, 7vw, 7rem); }
.agent-portfolio .nrs-writing-featured-head { display: grid; grid-template-columns: .75fr 1.25fr; gap: .8rem clamp(2rem, 6vw, 7rem); margin-bottom: 2.5rem; }
.agent-portfolio .nrs-writing-featured-head .agent-kicker { grid-row: 1 / 3; }
.agent-portfolio .nrs-writing-featured-head h2 { max-width: 14ch; margin: 0; color: var(--ap-ink); font-size: clamp(2.4rem, 4.5vw, 4.8rem); line-height: .93; }
.agent-portfolio .nrs-writing-featured-head p { max-width: 40rem; margin: 0; color: var(--ap-ink-soft); }
.agent-portfolio .nrs-writing-featured-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--ap-line-strong); border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-writing-featured-item { display: grid; align-content: start; gap: .9rem; min-width: 0; padding: 1.5rem; border: 0 !important; }
.agent-portfolio .nrs-writing-featured-item + .nrs-writing-featured-item { border-left: 1px solid var(--ap-line) !important; }
.agent-portfolio .nrs-writing-featured-item .agent-project-index { display: none; }
.agent-portfolio .nrs-writing-featured-item h2 { font-size: clamp(1.65rem, 2.5vw, 2.5rem); line-height: .98; }
.agent-portfolio .nrs-writing-featured-item p { margin: 0; color: var(--ap-ink-soft); }
.agent-portfolio .nrs-writing-archive { padding-top: 2rem !important; }
.agent-portfolio .nrs-writing-archive-head { display: flex; justify-content: space-between; gap: 1rem; align-items: end; margin-bottom: 1.25rem; }
.agent-portfolio .nrs-writing-archive-head h2 { margin: 0; color: var(--ap-ink); font-size: clamp(2rem, 3vw, 3rem); }

@media (max-width: 900px) {
  .agent-portfolio .nrs-experience-head,
  .agent-portfolio .nrs-writing-featured-head { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-experience-head .agent-kicker,
  .agent-portfolio .nrs-writing-featured-head .agent-kicker { grid-row: auto; }
  .agent-portfolio .nrs-writing-featured-grid { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-writing-featured-item + .nrs-writing-featured-item { border-left: 0 !important; border-top: 1px solid var(--ap-line) !important; }
}
@media (max-width: 640px) {
  .agent-portfolio .nrs-experience-list article { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-experience-list article > div:first-child { grid-template-columns: 5rem 1fr; }
}
${end}`;
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(marker, '').trimEnd();
  style += `\n\n${css}\n`;
  fs.writeFileSync(stylePath, style, 'utf8');
}

const aboutChanged = enhanceAbout();
const servicesChanged = enhanceServices();
const writingChanged = enhanceWriting();
appendStyles();

const failures = [];
const about = fs.readFileSync(path.join(base, 'about.html'), 'utf8');
if (!about.includes('Selected experience') || !about.includes('Idealaya')) failures.push('About experience timeline missing');
const services = fs.readFileSync(path.join(base, 'services.html'), 'utf8');
if ((services.match(/agent-service-link/g) || []).length < 6) failures.push('Service drill-down links missing');
const writingFile = [path.join(base, 'blog', 'index.html'), path.join(base, 'blog.html')].find(fs.existsSync);
if (writingFile && !fs.readFileSync(writingFile, 'utf8').includes('Three opinionated notes from the work.')) failures.push('Writing featured POV section missing');
if (failures.length) throw new Error(`[agent-audit-content] ${failures.join('; ')}`);

console.log(`[agent-audit-content] About=${aboutChanged ? 'enhanced' : 'already enhanced'}; service rows=${servicesChanged}; writing routes=${writingChanged}.`);
