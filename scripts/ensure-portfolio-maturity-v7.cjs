/**
 * @fileoverview scripts/ensure-portfolio-maturity-v7.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure portfolio maturity v7.
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
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const stylePath = path.join(base, 'style.css');
const serviceRoutes = new Set(['/product-design-nepal','/web3-ux-designer','/saas-ux-designer','/website-ux-design','/figma-design-systems','/ux-audit']);
const flagship = ['yarsha','pihub','orkest','masteriyo'];
const supporting = ['mokshya','neverwinter-parser'];

/**
 * Function contract: routeFor
 * Purpose: Implements the route for responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}
/**
 * Function contract: fileFor
 * Purpose: Implements the file for responsibility for this module.
 * Inputs: route.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function fileFor(route) {
  if (route === '/') return path.join(base, 'index.html');
  if (route === '/blog/') return path.join(base, 'blog', 'index.html');
  return path.join(base, `${route.replace(/^\//, '')}.html`);
}
/**
 * Function contract: strip
 * Purpose: Implements the strip responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function strip(value = '') {
  return String(value).replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&#39;/gi,"'").replace(/&quot;/gi,'"').replace(/\s+/g,' ').trim();
}
/**
 * Function contract: esc
 * Purpose: Implements the esc responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function esc(value = '') {
  return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}
/**
 * Function contract: h1
 * Purpose: Implements the h1 responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function h1(html) { return strip(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || 'Current page'); }

/**
 * Function contract: breadcrumb
 * Purpose: Implements the breadcrumb responsibility for this module.
 * Inputs: html, route.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function breadcrumb(html, route) {
  const article = route.startsWith('/blog/') && route !== '/blog/';
  if (!article && !serviceRoutes.has(route)) return html;
  html = html.replace(/\s*<nav\b[^>]*aria-label=["']Breadcrumb["'][^>]*>[\s\S]*?<\/nav>/gi, '');
  const parentHref = article ? '/blog/' : '/services';
  const parent = article ? 'Writing' : 'Services';
  const nav = `<nav class="nrs-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="${parentHref}">${parent}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(h1(html))}</span></nav>`;
  return html.replace(/(<main\b[^>]*>)/i, `$1${nav}`);
}

/**
 * Function contract: addControlId
 * Purpose: Implements the add control id responsibility for this module.
 * Inputs: html, name, id.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function addControlId(html, name, id) {
  const re = new RegExp(`<(input|select|textarea)\\b([^>]*\\bname=["']${name}["'][^>]*)>`, 'i');
  return html.replace(re, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: whole, tag, attrs. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (whole, tag, attrs) => /\bid=["']/i.test(attrs) ? whole : `<${tag}${attrs} id="${id}">`);
}
/**
 * Function contract: contactContract
 * Purpose: Implements the contact contract responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function contactContract(html) {
  if (!/id=["']contact-form["']/i.test(html)) return html;
  for (const [name,id] of [['name','contact-name'],['email','contact-email'],['need','contact-need'],['timeline','contact-timeline'],['message','contact-message']]) html = addControlId(html, name, id);
  html = html.replace(/<option([^>]*)>Product design engagement<\/option>/i, '<option$1>Freelance UX/UI project</option>');
  html = html.replace(/<([a-z0-9]+)\b([^>]*\bid=["']contact-form-status["'][^>]*)>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _whole, tag, attrs. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (_whole, tag, attrs) => `<${tag}${attrs.replace(/\srole=["'][^"']*["']/i,'').replace(/\saria-live=["'][^"']*["']/i,'')} role="status" aria-live="polite">`);
  return html;
}

/**
 * Function contract: moveEvidence
 * Purpose: Implements the move evidence responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function moveEvidence(html) {
  if (!/\bnrs-case-v4\b/i.test(html)) return html;
  const evidence = html.match(/<section\b[^>]*class=["'][^"']*\bnrs-case-v4-evidence\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i)?.[0];
  if (!evidence) return html;
  const source = html.replace(evidence, '');
  const decisions = /(<section\b[^>]*class=["'][^"']*\bagent-section--inverse\b[^"']*["'][^>]*>[\s\S]*?\bnrs-case-v4-decisions\b[\s\S]*?<\/section>)/i;
  return decisions.test(source) ? source.replace(decisions, `$1${evidence}`) : html;
}

/**
 * Function contract: workHierarchy
 * Purpose: Implements the work hierarchy responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function workHierarchy(html) {
  const re = /<section\b[^>]*class=["'][^"']*\bnrs-work-featured\b[^"']*["'][^>]*>[\s\S]*?<\/section>/i;
  const section = html.match(re)?.[0];
  if (!section) return html;
  const cards = new Map();
  for (const match of section.matchAll(/<a\b[^>]*class=["'][^"']*\bnrs-work-card\b[^"']*["'][^>]*href=["']\/project-([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi)) cards.set(match[1], match[0]);
  const order = [...flagship, ...supporting];
  if (!order.every(/** Callback contract: Processes the callback step for order without leaking orchestration details to the caller. Inputs: slug. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (slug) => cards.has(slug))) return html;
  const primary = flagship.map(/** Callback contract: Processes the callback step for flagship without leaking orchestration details to the caller. Inputs: slug. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (slug) => cards.get(slug)).join('');
  const secondary = supporting.map(/** Callback contract: Processes the callback step for supporting without leaking orchestration details to the caller. Inputs: slug. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (slug) => cards.get(slug)).join('');
  const replacement = `<section class="agent-section nrs-work-featured"><div class="agent-frame"><div class="nrs-work-group-head"><span class="agent-meta">Start here</span><h2>Four flagship cases. Two supporting cases.</h2><p>The flagship set shows high-stakes interaction, multi-role workflows, SaaS architecture and mature product collaboration. The supporting pair adds technical storytelling and data-product range.</p></div><div class="nrs-work-subgroup"><div class="nrs-work-subgroup-head"><span class="agent-meta">Flagship cases</span><p>The strongest view of how I structure complex product behavior and carry decisions into interface systems.</p></div><div class="nrs-work-grid nrs-work-grid--flagship">${primary}</div></div><div class="nrs-work-subgroup nrs-work-subgroup--secondary"><div class="nrs-work-subgroup-head"><span class="agent-meta">Supporting range</span><p>Two shorter cases showing technical communication and a data-heavy side project.</p></div><div class="nrs-work-grid nrs-work-grid--secondary">${secondary}</div></div></div></section>`;
  return html.replace(re, replacement);
}

/**
 * Function contract: tightenHome
 * Purpose: Implements the tighten home responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function tightenHome(html) {
  if (!/\bnrs-editorial-home\b/i.test(html)) return html;
  html = html.replace(/<article\b[^>]*class=["'][^"']*\bagent-capability\b[^"']*["'][^>]*>[\s\S]*?<h3>Make important information easy to act on\.<\/h3>[\s\S]*?<\/article>/i, '');
  return html.replace('Product thinking that survives implementation.', 'Three habits that keep product decisions useful through implementation.');
}
/**
 * Function contract: imageHints
 * Purpose: Implements the image hints responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function imageHints(html) {
  return html.replace(/<img\b[^>]*>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: tag. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (tag) => /\bdecoding=/i.test(tag) ? tag : tag.replace(/\s*\/?>(\s*)$/i, ' decoding="async">$1'));
}
/**
 * Function contract: analytics
 * Purpose: Implements the analytics responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function analytics(html) {
  return /src=["']\/portfolio-events\.js["']/i.test(html) ? html : html.replace('</body>', '  <script src="/portfolio-events.js" defer></script>\n</body>');
}

let changed = 0;
for (const file of manifest.html) {
  const route = routeFor(file);
  const target = path.join(base, file);
  if (!fs.existsSync(target)) continue;
  let html = fs.readFileSync(target, 'utf8');
  const before = html;
  html = breadcrumb(html, route);
  if (route === '/contact') html = contactContract(html);
  if (route === '/projects') html = workHierarchy(html);
  if (route === '/') html = tightenHome(html);
  if (route.startsWith('/project-')) html = moveEvidence(html);
  html = imageHints(html);
  html = analytics(html);
  if (html !== before) { fs.writeFileSync(target, html, 'utf8'); changed += 1; }
}

if (!fs.existsSync(stylePath)) throw new Error('[portfolio-maturity-v7] Missing style.css');
const start = '/* nrs-portfolio-maturity-v7:start */';
const end = '/* nrs-portfolio-maturity-v7:end */';
const marker = /\/\* nrs-portfolio-maturity-v\d+:start \*\/[\s\S]*?\/\* nrs-portfolio-maturity-v\d+:end \*\//g;
const css = `${start}
/* Semantic text colors with comfortable AA headroom. */
html[data-theme='light'] .agent-main { --nrs-bg:#f2efe7; --nrs-ink:#11110f; --nrs-soft:#48443d; --nrs-faint:#575249; --nrs-line:rgba(17,17,15,.28); color:#11110f; }
html[data-theme='dark'] .agent-main, html:not([data-theme='light']) .agent-main { --nrs-bg:#10110f; --nrs-ink:#f7f2e8; --nrs-soft:#d8d1c5; --nrs-faint:#bdb6aa; --nrs-line:rgba(247,242,232,.3); color:#f7f2e8; }
html[data-theme='light'] .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd,a,label,button) { color:#11110f!important; -webkit-text-fill-color:#11110f!important; }
html[data-theme='light'] .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p,.nrs-work-card-link,.agent-service-link,.agent-service-proof) { color:#48443d!important; -webkit-text-fill-color:#48443d!important; }
html[data-theme='light'] .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span,.agent-hero-foot span,.agent-project-meta span) { color:#575249!important; -webkit-text-fill-color:#575249!important; opacity:1!important; }
html[data-theme='dark'] .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd,a,label,button), html:not([data-theme='light']) .agent-main :is(h1,h2,h3,h4,h5,h6,strong,dd,a,label,button) { color:#f7f2e8!important; -webkit-text-fill-color:#f7f2e8!important; }
html[data-theme='dark'] .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p,.nrs-work-card-link,.agent-service-link,.agent-service-proof), html:not([data-theme='light']) .agent-main :is(p,li,figcaption,small,.agent-lead,.agent-page-intro,.agent-rich-copy,.agent-rich-copy p,.nrs-work-card-link,.agent-service-link,.agent-service-proof) { color:#d8d1c5!important; -webkit-text-fill-color:#d8d1c5!important; }
html[data-theme='dark'] .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span,.agent-hero-foot span,.agent-project-meta span), html:not([data-theme='light']) .agent-main :is(.agent-kicker,.agent-meta,.agent-project-index,dt,.agent-stat span,.agent-hero-foot span,.agent-project-meta span) { color:#bdb6aa!important; -webkit-text-fill-color:#bdb6aa!important; opacity:1!important; }
.agent-main .agent-section--inverse { background:#11110f!important; color:#f7f2e8!important; }
.agent-main .agent-section--inverse :is(h1,h2,h3,h4,h5,h6,strong,dd,a,label,button,.agent-section-title) { color:#f7f2e8!important; -webkit-text-fill-color:#f7f2e8!important; }
.agent-main .agent-section--inverse :is(p,li,figcaption,small,.agent-lead,.agent-page-intro) { color:#d8d1c5!important; -webkit-text-fill-color:#d8d1c5!important; }
.agent-main .agent-section--inverse :is(.agent-kicker,.agent-meta,.agent-project-index,dt) { color:#c7c0b4!important; -webkit-text-fill-color:#c7c0b4!important; opacity:1!important; }
.agent-main .agent-btn { color:var(--nrs-ink)!important; -webkit-text-fill-color:var(--nrs-ink)!important; border-color:var(--nrs-line)!important; }
.agent-main .agent-btn--primary { background:var(--nrs-ink)!important; border-color:var(--nrs-ink)!important; color:var(--nrs-bg)!important; -webkit-text-fill-color:var(--nrs-bg)!important; }
.agent-main .agent-section--inverse .agent-btn { background:#191916!important; border-color:rgba(247,242,232,.46)!important; color:#f7f2e8!important; -webkit-text-fill-color:#f7f2e8!important; }
.agent-main .agent-section--inverse .agent-btn--primary { background:#f7f2e8!important; color:#11110f!important; -webkit-text-fill-color:#11110f!important; }

/* Work hero layout repair from the reported desktop screenshot. */
.nrs-editorial-work .agent-page-hero-grid { display:grid!important; grid-template-columns:minmax(0,7fr) minmax(20rem,4fr)!important; gap:clamp(2.5rem,7vw,7rem)!important; align-items:end!important; }
.nrs-editorial-work .agent-page-hero-grid>* { min-width:0!important; }
.nrs-editorial-work .nrs-work-intro { grid-column:auto!important; width:100%!important; max-width:34rem!important; min-width:0!important; justify-self:end!important; align-self:end!important; }
.nrs-editorial-work .nrs-work-intro p { max-width:58ch!important; }
.nrs-editorial-work .nrs-work-intro p+p { margin-top:1.1rem!important; }

/* Recruiter hierarchy. */
.nrs-work-subgroup { margin-top:clamp(2.25rem,5vw,4.75rem); }
.nrs-work-subgroup-head { display:grid; grid-template-columns:minmax(0,1fr) minmax(16rem,28rem); gap:1.5rem; align-items:end; margin-bottom:1.25rem; }
.nrs-work-subgroup-head p { margin:0; max-width:46ch; justify-self:end; }
.nrs-work-grid--flagship,.nrs-work-grid--secondary { display:grid!important; grid-template-columns:repeat(2,minmax(0,1fr))!important; }
.nrs-work-grid--secondary .nrs-work-card-media { aspect-ratio:16/8.4; }
.nrs-work-grid--secondary .nrs-work-card-copy { padding-block:clamp(1rem,1.8vw,1.35rem)!important; }

/* Wayfinding. */
.nrs-breadcrumbs { width:min(var(--ap-frame,1180px),calc(100% - 2 * var(--ap-gutter,1.25rem))); margin:0 auto; padding-top:clamp(6.75rem,10vw,8.5rem); display:flex; flex-wrap:wrap; align-items:center; gap:.55rem; color:var(--nrs-faint); font:650 .76rem/1.4 var(--ap-font-mono,ui-monospace,monospace); }
.nrs-breadcrumbs a { color:inherit!important; -webkit-text-fill-color:currentColor!important; text-decoration-thickness:1px; text-underline-offset:.22em; }
.nrs-breadcrumbs [aria-current='page'] { color:var(--nrs-soft); }
.nrs-breadcrumbs + :is(.agent-page-hero,.article-hero,header) { padding-top:clamp(2.25rem,4vw,4rem)!important; }

/* Containment. Fix the service-grid and decorative-canvas overflow instead of clipping the viewport. */
.agent-main :is(.agent-frame,.agent-hero-grid,.agent-page-hero-grid,.agent-service-grid,.agent-capabilities,.agent-contact-grid,.agent-case-grid,.nrs-work-grid,.nrs-case-v4-two-col,.nrs-case-v4-gallery)>* { min-width:0!important; }
.agent-service-grid { grid-template-columns:repeat(3,minmax(0,1fr))!important; }
.agent-service { grid-column:auto!important; width:auto!important; min-width:0!important; overflow-wrap:anywhere; }
.agent-capabilities { grid-template-columns:repeat(3,minmax(0,1fr))!important; }
.agent-capability { grid-column:auto!important; min-width:0!important; }
.agent-system-figure { min-width:0!important; max-width:100%!important; overflow:hidden!important; }
.agent-main :is(img,svg,video,canvas,iframe) { max-width:100%!important; }
.agent-three-canvas { display:block!important; width:100%!important; max-width:100%!important; min-width:0!important; height:auto!important; aspect-ratio:4/3; }

/* Contact error, keyboard focus and status states. */
.nrs-contact-field-error { display:block; margin-top:.45rem; color:#b42318!important; -webkit-text-fill-color:#b42318!important; font-size:.875rem; line-height:1.45; }
html[data-theme='dark'] .nrs-contact-field-error { color:#ffb4a8!important; -webkit-text-fill-color:#ffb4a8!important; }
#contact-form :is(input,select,textarea)[aria-invalid='true'] { border-color:#b42318!important; box-shadow:0 0 0 2px rgba(180,35,24,.18)!important; }
#contact-form :is(input,select,textarea):focus-visible,.agent-main a:focus-visible,.agent-main button:focus-visible,.nrs-breadcrumbs a:focus-visible { outline:3px solid #ff6b2c!important; outline-offset:3px!important; }
#contact-form-status[data-tone='error'] { color:#b42318!important; -webkit-text-fill-color:#b42318!important; }
html[data-theme='dark'] #contact-form-status[data-tone='error'] { color:#ffb4a8!important; -webkit-text-fill-color:#ffb4a8!important; }
#contact-form-status[data-tone='success'] { color:#176b3a!important; -webkit-text-fill-color:#176b3a!important; }
html[data-theme='dark'] #contact-form-status[data-tone='success'] { color:#91e6b5!important; -webkit-text-fill-color:#91e6b5!important; }

/* Homepage subtraction and tighter rhythm. */
.nrs-editorial-home .agent-section { padding-block:clamp(4.25rem,7vw,7rem)!important; }
.nrs-editorial-home .agent-capabilities { grid-template-columns:repeat(3,minmax(0,1fr))!important; }

@media (max-width:1023px) {
  .nrs-editorial-work .agent-page-hero-grid { grid-template-columns:minmax(0,1fr)!important; gap:2rem!important; }
  .nrs-editorial-work .nrs-work-intro { max-width:44rem!important; justify-self:start!important; }
  .agent-service-grid,.agent-capabilities { grid-template-columns:repeat(2,minmax(0,1fr))!important; }
  .agent-hero-grid { grid-template-columns:minmax(0,1fr)!important; }
  .agent-three-canvas { display:none!important; }
}
@media (max-width:700px) {
  .agent-service-grid,.agent-capabilities,.nrs-work-grid--flagship,.nrs-work-grid--secondary { grid-template-columns:minmax(0,1fr)!important; }
  .nrs-work-subgroup-head { grid-template-columns:minmax(0,1fr); }
  .nrs-work-subgroup-head p { justify-self:start; }
  .nrs-breadcrumbs { padding-top:calc(env(safe-area-inset-top,0px) + 5.75rem); }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');
console.log(`[portfolio-maturity-v7] Applied final accessibility, responsive, proof, hierarchy, performance and analytics hooks to ${changed} page(s).`);
