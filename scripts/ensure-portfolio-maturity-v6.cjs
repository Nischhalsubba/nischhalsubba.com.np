const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');
const manifestPath = path.join(root, 'config', 'canonical-routes.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const serviceRoutes = new Set([
  '/product-design-nepal',
  '/web3-ux-designer',
  '/saas-ux-designer',
  '/website-ux-design',
  '/figma-design-systems',
  '/ux-audit',
]);
const flagshipOrder = ['yarsha', 'pihub', 'orkest', 'masteriyo'];
const secondaryOrder = ['mokshya', 'neverwinter-parser'];

function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}

function fileFor(route) {
  if (route === '/') return path.join(base, 'index.html');
  if (route === '/blog/') return path.join(base, 'blog', 'index.html');
  return path.join(base, `${route.replace(/^\//, '')}.html`);
}

function strip(value = '') {
  return String(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function h1Text(html) {
  return strip(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || 'Current page');
}

function ensureBreadcrumb(html, route) {
  const isBlogDetail = route.startsWith('/blog/') && route !== '/blog/';
  if (!serviceRoutes.has(route) && !isBlogDetail) return html;
  if ((html.match(/<nav\b[^>]*aria-label=["']Breadcrumb["'][^>]*>/gi) || []).length === 1) return html;
  html = html.replace(/\s*<nav\b[^>]*aria-label=["']Breadcrumb["'][^>]*>[\s\S]*?<\/nav>/gi, '');
  const parentHref = isBlogDetail ? '/blog/' : '/services';
  const parentLabel = isBlogDetail ? 'Writing' : 'Services';
  const current = h1Text(html);
  const nav = `<nav class="nrs-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="${parentHref}">${parentLabel}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(current)}</span></nav>`;
  return html.replace(/(<main\b[^>]*>)/i, `$1${nav}`);
}

function addIdToNamedControl(html, name, id) {
  const pattern = new RegExp(`<(input|select|textarea)\\b([^>]*\\bname=["']${name}["'][^>]*)>`, 'i');
  return html.replace(pattern, (whole, tag, attrs) => {
    if (/\bid=["'][^"']+["']/i.test(attrs)) return whole;
    return `<${tag}${attrs} id="${id}">`;
  });
}

function ensureContactForm(html) {
  if (!/id=["']contact-form["']/i.test(html)) return html;
  html = addIdToNamedControl(html, 'name', 'contact-name');
  html = addIdToNamedControl(html, 'email', 'contact-email');
  html = addIdToNamedControl(html, 'need', 'contact-need');
  html = addIdToNamedControl(html, 'timeline', 'contact-timeline');
  html = addIdToNamedControl(html, 'message', 'contact-message');

  // Keep the human wording, but retain the audit/browser option label used by the production contract.
  html = html.replace(/<option([^>]*)>Product design engagement<\/option>/i, '<option$1>Freelance UX/UI project</option>');

  html = html.replace(/<([a-z0-9]+)\b([^>]*\bid=["']contact-form-status["'][^>]*)>/i, (whole, tag, attrs) => {
    let next = attrs.replace(/\srole=["'][^"']*["']/i, '').replace(/\saria-live=["'][^"']*["']/i, '');
    return `<${tag}${next} role="status" aria-live="polite">`;
  });
  return html;
}

function normalizeImages(html) {
  return html.replace(/<img\b[^>]*>/gi, (tag) => {
    let next = tag;
    if (!/\bdecoding=/i.test(next)) next = next.replace(/\s*\/?>(\s*)$/i, ' decoding="async">$1');
    if (!/\bloading=/i.test(next)) next = next.replace(/\s*\/?>(\s*)$/i, ' loading="lazy">$1');
    if (/loading=["']lazy["']/i.test(next) && !/\bfetchpriority=/i.test(next)) next = next.replace(/\s*\/?>(\s*)$/i, ' fetchpriority="low">$1');
    return next;
  });
}

function moveEvidenceBesideDecisions(html) {
  if (!/class=["'][^"']*\bnrs-case-v4\b/i.test(html)) return html;
  const evidence = html.match(/<section\b[^>]*class=["'][^"']*\bnrs-case-v4-evidence\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i)?.[0];
  if (!evidence) return html;
  const without = html.replace(evidence, '');
  const decisionSection = /(<section\b[^>]*class=["'][^"']*\bagent-section--inverse\b[^"']*["'][^>]*>[\s\S]*?\bnrs-case-v4-decisions\b[\s\S]*?<\/section>)/i;
  return decisionSection.test(without) ? without.replace(decisionSection, `$1${evidence}`) : html;
}

function cardMap(section) {
  const result = new Map();
  for (const match of section.matchAll(/<a\b[^>]*class=["'][^"']*\bnrs-work-card\b[^"']*["'][^>]*href=["']\/project-([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi)) {
    result.set(match[1], match[0]);
  }
  return result;
}

function enhanceWorkHierarchy(html) {
  const sectionPattern = /<section\b[^>]*class=["'][^"']*\bnrs-work-featured\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i;
  const section = html.match(sectionPattern)?.[0];
  if (!section) return html;
  const cards = cardMap(section);
  if (![...flagshipOrder, ...secondaryOrder].every((slug) => cards.has(slug))) return html;

  const flagship = flagshipOrder.map((slug) => cards.get(slug)).join('');
  const secondary = secondaryOrder.map((slug) => cards.get(slug)).join('');
  const next = `<section class="agent-section nrs-work-featured"><div class="agent-frame"><div class="nrs-work-group-head"><span class="agent-meta">Start here</span><h2>Four flagship cases. Two supporting cases.</h2><p>Start with the four projects that best show product judgment, then use the supporting pair for technical storytelling and data-product range.</p></div><div class="nrs-work-subgroup"><div class="nrs-work-subgroup-head"><span class="agent-meta">Flagship cases</span><p>High-stakes interaction, multi-role workflows, SaaS architecture and mature product collaboration.</p></div><div class="nrs-work-grid nrs-work-grid--flagship">${flagship}</div></div><div class="nrs-work-subgroup nrs-work-subgroup--secondary"><div class="nrs-work-subgroup-head"><span class="agent-meta">Supporting range</span><p>Technical product storytelling and a data-heavy side project.</p></div><div class="nrs-work-grid nrs-work-grid--secondary">${secondary}</div></div></div></section>`;
  return html.replace(sectionPattern, next);
}

function tightenHome(html) {
  if (!/\bnrs-editorial-home\b/i.test(html)) return html;
  html = html.replace(/<article\b[^>]*class=["'][^"']*\bagent-capability\b[^"']*["'][^>]*>[\s\S]*?<h3>Make important information easy to act on\.<\/h3>[\s\S]*?<\/article>/i, '');
  html = html.replace('Product thinking that survives implementation.', 'Three habits that keep product decisions useful through implementation.');
  return html;
}

function injectAnalytics(html) {
  if (/src=["']\/portfolio-events\.js["']/i.test(html)) return html;
  return html.replace('</body>', '  <script src="/portfolio-events.js" defer></script>\n</body>');
}

function patchBuiltRuntime() {
  const assets = path.join(base, 'assets');
  if (!fs.existsSync(assets)) return 0;
  let patched = 0;
  for (const name of fs.readdirSync(assets)) {
    if (!/\.js(?:$|\?)/i.test(name)) continue;
    const file = path.join(assets, name);
    let source = fs.readFileSync(file, 'utf8');
    const before = source;
    source = source.replaceAll('Check the highlighted fields, then send again.', 'Review the highlighted fields, then send again.');
    if (source !== before) {
      fs.writeFileSync(file, source, 'utf8');
      patched += 1;
    }
  }
  return patched;
}

function applyFinalCss() {
  if (!fs.existsSync(stylePath)) throw new Error('[portfolio-maturity-v6] Missing style.css');
  const start = '/* nrs-portfolio-maturity-v6:start */';
  const end = '/* nrs-portfolio-maturity-v6:end */';
  const marker = /\/\* nrs-portfolio-maturity-v\d+:start \*\/[\s\S]*?\/\* nrs-portfolio-maturity-v\d+:end \*\\//g;
  const css = `${start}
html[data-theme='light'] .agent-main {
  --nrs-final-bg: #f2efe7;
  --nrs-final-ink: #11110f;
  --nrs-final-soft: #48443d;
  --nrs-final-faint: #575249;
  --nrs-final-line: rgba(17,17,15,.26);
}
html[data-theme='dark'] .agent-main,
html:not([data-theme='light']) .agent-main {
  --nrs-final-bg: #10110f;
  --nrs-final-ink: #f7f2e8;
  --nrs-final-soft: #d8d1c5;
  --nrs-final-faint: #bdb6aa;
  --nrs-final-line: rgba(247,242,232,.28);
}
html[data-theme='light'] .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd),
html[data-theme='light'] .agent-main :is(.agent-display,.agent-section-title,.agent-case-title) {
  color: #11110f !important;
  -webkit-text-fill-color: #11110f !important;
}
html[data-theme='light'] .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p) {
  color: #48443d !important;
  -webkit-text-fill-color: #48443d !important;
}
html[data-theme='light'] .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt) {
  color: #575249 !important;
  -webkit-text-fill-color: #575249 !important;
}
html[data-theme='dark'] .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd),
html:not([data-theme='light']) .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd),
html[data-theme='dark'] .agent-main :is(.agent-display,.agent-section-title,.agent-case-title),
html:not([data-theme='light']) .agent-main :is(.agent-display,.agent-section-title,.agent-case-title) {
  color: #f7f2e8 !important;
  -webkit-text-fill-color: #f7f2e8 !important;
}
html[data-theme='dark'] .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p),
html:not([data-theme='light']) .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p) {
  color: #d8d1c5 !important;
  -webkit-text-fill-color: #d8d1c5 !important;
}
html[data-theme='dark'] .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt),
html:not([data-theme='light']) .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt) {
  color: #bdb6aa !important;
  -webkit-text-fill-color: #bdb6aa !important;
}
.agent-main .agent-section--inverse {
  background: #11110f !important;
  color: #f7f2e8 !important;
}
.agent-main .agent-section--inverse :is(h1,h2,h3,h4,h5,h6,strong,dd,.agent-section-title) {
  color: #f7f2e8 !important;
  -webkit-text-fill-color: #f7f2e8 !important;
}
.agent-main .agent-section--inverse :is(p,li,figcaption,small,.agent-lead,.agent-page-intro) {
  color: #d8d1c5 !important;
  -webkit-text-fill-color: #d8d1c5 !important;
}
.agent-main .agent-section--inverse :is(.agent-kicker,.agent-meta,.agent-project-index,dt) {
  color: #c7c0b4 !important;
  -webkit-text-fill-color: #c7c0b4 !important;
}
.agent-main .agent-btn {
  color: var(--nrs-final-ink) !important;
  -webkit-text-fill-color: var(--nrs-final-ink) !important;
  border-color: var(--nrs-final-line) !important;
}
.agent-main .agent-btn--primary {
  background: var(--nrs-final-ink) !important;
  border-color: var(--nrs-final-ink) !important;
  color: var(--nrs-final-bg) !important;
  -webkit-text-fill-color: var(--nrs-final-bg) !important;
}
.agent-main .agent-section--inverse .agent-btn {
  background: #191916 !important;
  border-color: rgba(247,242,232,.42) !important;
  color: #f7f2e8 !important;
  -webkit-text-fill-color: #f7f2e8 !important;
}
.agent-main .agent-section--inverse .agent-btn--primary {
  background: #f7f2e8 !important;
  border-color: #f7f2e8 !important;
  color: #11110f !important;
  -webkit-text-fill-color: #11110f !important;
}

/* Work hero: stop the intro copy collapsing into a receipt-width column. */
.nrs-editorial-work .agent-page-hero-grid {
  display: grid !important;
  grid-template-columns: minmax(0, 7fr) minmax(20rem, 4fr) !important;
  gap: clamp(2.5rem, 7vw, 7rem) !important;
  align-items: end !important;
}
.nrs-editorial-work .agent-page-hero-grid > * { min-width: 0 !important; }
.nrs-editorial-work .nrs-work-intro {
  grid-column: auto !important;
  width: 100% !important;
  max-width: 34rem !important;
  min-width: 0 !important;
  justify-self: end !important;
  align-self: end !important;
}
.nrs-editorial-work .nrs-work-intro p { max-width: 58ch !important; }
.nrs-editorial-work .nrs-work-intro p + p { margin-top: 1.1rem !important; }

/* Recruiter hierarchy: four primary cases, then two supporting cases, then archive. */
.nrs-work-subgroup { margin-top: clamp(2.25rem, 5vw, 4.75rem); }
.nrs-work-subgroup-head { display: grid; grid-template-columns: minmax(0,1fr) minmax(16rem,28rem); gap: 1.5rem; align-items: end; margin-bottom: 1.25rem; }
.nrs-work-subgroup-head p { margin: 0; max-width: 46ch; justify-self: end; }
.nrs-work-grid--flagship { display: grid !important; grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
.nrs-work-grid--secondary { display: grid !important; grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
.nrs-work-grid--secondary .nrs-work-card-media { aspect-ratio: 16 / 8.4; }
.nrs-work-grid--secondary .nrs-work-card-copy { padding-block: clamp(1rem,1.8vw,1.35rem) !important; }

/* Deep-page wayfinding. */
.nrs-breadcrumbs {
  width: min(var(--ap-frame, 1180px), calc(100% - 2 * var(--ap-gutter, 1.25rem));
  margin: 0 auto;
  padding-top: clamp(6.75rem, 10vw, 8.5rem);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .55rem;
  color: var(--nrs-final-faint);
  font: 650 .76rem/1.4 var(--ap-font-mono, ui-monospace, monospace);
}
.nrs-breadcrumbs a { color: inherit; text-decoration-thickness: 1px; text-underline-offset: .22em; }
.nrs-breadcrumbs [aria-current='page'] { color: var(--nrs-final-soft); }
.nrs-breadcrumbs + .agent-page-hero,
.nrs-breadcrumbs + .article-hero,
.nrs-breadcrumbs + header { padding-top: clamp(2.25rem, 4vw, 4rem) !important; }

/* Grid and media containment. Fixes tablet/landscape overflow instead of hiding it. */
.agent-main :is(.agent-frame,.agent-hero-grid,.agent-page-hero-grid,.agent-service-grid,.agent-capabilities,.agent-contact-grid,.agent-case-grid,.nrs-work-grid,.nrs-case-v4-two-col,.nrs-case-v4-gallery) > * { min-width: 0 !important; }
.agent-service-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; }
.agent-service { grid-column: auto !important; width: auto !important; min-width: 0 !important; overflow-wrap: anywhere; }
.agent-capabilities { grid-template-columns: repeat(3, minmax(0,1fr)) !important; }
.agent-capability { grid-column: auto !important; min-width: 0 !important; }
.agent-system-figure { min-width: 0 !important; max-width: 100% !important; overflow: hidden !important; }
.agent-three-canvas,
.agent-main canvas {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  aspect-ratio: 4 / 3;
}
.agent-main :is(img,svg,video,canvas,iframe) { max-width: 100% !important; }

/* Contact accessibility and error recovery. */
.nrs-contact-field-error { display: block; margin-top: .45rem; color: #b42318 !important; -webkit-text-fill-color: #b42318 !important; font-size: .875rem; line-height: 1.45; }
html[data-theme='dark'] .nrs-contact-field-error { color: #ffb4a8 !important; -webkit-text-fill-color: #ffb4a8 !important; }
#contact-form :is(input,select,textarea)[aria-invalid='true'] { border-color: #b42318 !important; box-shadow: 0 0 0 2px rgba(180,35,24,.18) !important; }
#contact-form :is(input,select,textarea):focus-visible,
.agent-main a:focus-visible,
.agent-main button:focus-visible,
.nrs-breadcrumbs a:focus-visible { outline: 3px solid #ff6b2c !important; outline-offset: 3px !important; }
#contact-form-status[data-tone='error'] { color: #b42318 !important; -webkit-text-fill-color: #b42318 !important; }
html[data-theme='dark'] #contact-form-status[data-tone='error'] { color: #ffb4a8 !important; -webkit-text-fill-color: #ffb4a8 !important; }
#contact-form-status[data-tone='success'] { color: #176b3a !important; -webkit-text-fill-color: #176b3a !important; }
html[data-theme='dark'] #contact-form-status[data-tone='success'] { color: #91e6b5 !important; -webkit-text-fill-color: #91e6b5 !important; }

/* Slightly tighter homepage after removing redundant capability copy. */
.nrs-editorial-home .agent-section { padding-block: clamp(4.25rem, 7vw, 7rem) !important; }
.nrs-editorial-home .agent-capabilities { grid-template-columns: repeat(3, minmax(0,1fr)) !important; }

@media (max-width: 1023px) {
  .agent-service-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
  .agent-capabilities { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
  .nrs-editorial-work .agent-page-hero-grid { grid-template-columns: minmax(0,1fr) !important; gap: 2rem !important; }
  .nrs-editorial-work .nrs-work-intro { max-width: 44rem !important; justify-self: start !important; }
  .agent-hero-grid { grid-template-columns: minmax(0,1fr) !important; }
  .agent-three-canvas { max-height: 22rem !important; }
}
@media (max-width: 700px) {
  .agent-service-grid,
  .agent-capabilities,
  .nrs-work-grid--flagship,
  .nrs-work-grid--secondary { grid-template-columns: minmax(0,1fr) !important; }
  .nrs-work-subgroup-head { grid-template-columns: minmax(0,1fr); }
  .nrs-work-subgroup-head p { justify-self: start; }
  .nrs-breadcrumbs { padding-top: calc(env(safe-area-inset-top, 0px) + 5.75rem); }
}
@media (max-height: 450px) and (orientation: landscape) {
  .agent-three-canvas { max-height: 9rem !important; }
}
${end}`;
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(marker, '').trimEnd();
  style += `\n\n${css}\n`;
  fs.writeFileSync(stylePath, style, 'utf8');
}

let changed = 0;
for (const file of manifest.html) {
  const route = routeFor(file);
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) continue;
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;
  html = ensureBreadcrumb(html, route);
  if (route === '/contact') html = ensureContactForm(html);
  if (route === '/projects') html = enhanceWorkHierarchy(html);
  if (route === '/') html = tightenHome(html);
  if (route.startsWith('/project-')) html = moveEvidenceBesideDecisions(html);
  html = normalizeImages(html);
  html = injectAnalytics(html);
  if (html !== before) {
    fs.writeFileSync(filePath, html, 'utf8');
    changed += 1;
  }
}

const runtimePatched = patchBuiltRuntime();
applyFinalCss();

const work = fs.readFileSync(fileFor('/projects'), 'utf8');
const contact = fs.readFileSync(fileFor('/contact'), 'utf8');
const sampleService = fs.readFileSync(fileFor('/saas-ux-designer'), 'utf8');
const sampleArticle = fs.readFileSync(fileFor('/blog/saas-dashboard-filter-ux'), 'utf8');
const style = fs.readFileSync(stylePath, 'utf8');
const failures = [];
if (!/nrs-work-grid--flagship/.test(work) || !/nrs-work-grid--secondary/.test(work)) failures.push('work hierarchy missing');
if (!/id=["']contact-need["']/.test(contact) || !/>Freelance UX\/UI project<\/option>/.test(contact)) failures.push('contact contract missing');
if (!/aria-label=["']Breadcrumb["']/.test(sampleService)) failures.push('service breadcrumb missing');
if (!/aria-label=["']Breadcrumb["']/.test(sampleArticle)) failures.push('article breadcrumb missing');
if (!/nrs-portfolio-maturity-v6:start/.test(style)) failures.push('final CSS missing');
if (!/nrs-editorial-work \.agent-page-hero-grid/.test(style)) failures.push('work hero repair missing');
if (!runtimePatched) failures.push('contact runtime validation copy was not patched');
if (failures.length) throw new Error(`[portfolio-maturity-v6] ${failures.join('; ')}`);

console.log(`[portfolio-maturity-v6] stabilized ${changed} page(s); runtime bundles patched=${runtimePatched}.`);
