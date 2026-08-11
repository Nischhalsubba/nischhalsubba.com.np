/**
 * @fileoverview scripts/ensure-navigation-font-consistency.cjs
 * Purpose: Apply the ensure navigation font consistency production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(targetRoot, 'style.css');
const styleVersion = '50.0';


/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure navigation font consistency repository tool.
 * Inputs: `dir`, `files`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}


/**
 * Function contract: cleanBlogArticle
 * Purpose: Remove blog article without disturbing required surrounding ensure navigation font consistency repository tool state.
 * Inputs: `file`
 * Side effects: writes filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function cleanBlogArticle(file) {
  const rel = path.relative(targetRoot, file).replaceAll(path.sep, '/');
  if (!rel.startsWith('blog/') || rel === 'blog/index.html' || !rel.endsWith('.html')) return false;

  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const category = html.match(/<p class="[^"]*nrs-blog-category[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .trim() || 'Article';

  html = html
    .replace(/\s*<nav class="nrs-wayfinding"[\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<nav class="nrs-blog-breadcrumbs"[\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<a class="nrs-blog-back-btn"[\s\S]*?<\/a>\s*/gi, '\n')
    .replace(/\s*<a class="badge-pill" href="\/blog\/"[\s\S]*?<\/a>\s*/gi, '\n')
    .replace(/\s*<a class="nrs-back-link"[\s\S]*?<\/a>\s*/gi, '\n');

  const utility = `<nav class="nrs-blog-utility" aria-label="Article navigation"><a href="/blog/">← Back to writing</a><span aria-hidden="true">/</span><span>${category}</span></nav>`;
  const categoryPattern = /(<p class="[^"]*nrs-blog-category[^"]*"[^>]*>)/i;
  if (categoryPattern.test(html)) html = html.replace(categoryPattern, `${utility}\n$1`);
  else html = html.replace(/(<article\b[^>]*>)/i, `$1\n${utility}`);

  html = html.replace(/\/style\.css\?v=[0-9.]+/g, `/style.css?v=${styleVersion}`);
  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  return html !== before;
}

const css = `
/* nrs-final-navigation-font-consistency-v50 */
:root {
  --font-primary: "Aptos Display", "Segoe UI Variable Display", "Helvetica Neue", Arial, sans-serif;
  --font-secondary: "Inter", "Aptos", "Segoe UI Variable Text", "Segoe UI", Arial, sans-serif;
  --font-display: var(--font-primary);
  --font-body: var(--font-secondary);
  --font-sans: var(--font-secondary);
}

html, body, button, input, textarea, select, option,
.nav-link, .mobile-nav-links, .eyebrow, .meta-text, .w-date,
.card-meta-line, .nrs-row-index, .nrs-row-meta, .nrs-facts,
.nrs-blog-meta, .nrs-blog-utility, .btn, .site-footer {
  font-family: var(--font-secondary) !important;
}

body :is(h1, h2, h3, h4, h5, h6, .hero-title, .section-title, .footer-cta h2, .w-title, .card-content h3),
.nrs-blog-detail-page :is(h1, h2, h3, h4),
.nrs-services-v49 :is(h1, h2, h3) {
  font-family: var(--font-primary) !important;
}

.nrs-blog-detail-page main.container {
  width: var(--site-width) !important;
  max-width: var(--site-width) !important;
}

.nrs-blog-detail-page article.section-container {
  max-width: 1040px !important;
  margin-inline: 0 !important;
  padding-top: clamp(132px, 11vw, 176px) !important;
}

.nrs-blog-detail-page .nrs-wayfinding,
.nrs-blog-detail-page .nrs-blog-breadcrumbs,
.nrs-blog-detail-page .nrs-blog-back-btn {
  display: none !important;
}

.nrs-blog-utility {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 10px !important;
  margin: 0 0 clamp(42px, 5vw, 70px) !important;
  padding: 0 !important;
  border: 0 !important;
  color: var(--text-tertiary) !important;
  font-size: .78rem !important;
  font-weight: 720 !important;
  letter-spacing: .02em !important;
}

.nrs-blog-utility a {
  color: var(--text-primary) !important;
  text-decoration: none !important;
}

.nrs-blog-utility a:hover,
.nrs-blog-utility a:focus-visible {
  text-decoration: underline !important;
  text-underline-offset: 5px !important;
}

.nrs-blog-detail-page .nrs-blog-category {
  margin: 0 0 18px !important;
}

.nrs-blog-detail-page :is(.hero-title, article h1) {
  max-width: 900px !important;
  font-family: var(--font-primary) !important;
  font-size: clamp(3rem, 5.4vw, 5.7rem) !important;
  font-weight: 650 !important;
  letter-spacing: -.055em !important;
  line-height: .98 !important;
}

.nrs-blog-detail-page .nrs-blog-content :is(h2, h3) {
  font-family: var(--font-primary) !important;
  font-weight: 650 !important;
  letter-spacing: -.045em !important;
}

.nrs-blog-detail-page .nrs-blog-meta span {
  min-height: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
}

body.nrs-services-v49-page .nrs-wayfinding {
  display: none !important;
}

body.nrs-services-v49-page main.container {
  width: var(--site-width) !important;
  max-width: var(--site-width) !important;
  padding-inline: 0 !important;
}

body.nrs-services-v49-page :is(.nrs-services-index, .nrs-services-index-hero, .nrs-services-catalog, .nrs-services-method, .nrs-services-index-cta) {
  all: revert-layer;
}

body.nrs-services-v49-page .nrs-services-v49 {
  display: block !important;
  min-height: 0 !important;
}

@media (max-width: 720px) {
  .nrs-blog-detail-page article.section-container { padding-top: 112px !important; }
  .nrs-blog-utility { margin-bottom: 38px !important; }
  .nrs-blog-detail-page :is(.hero-title, article h1) { font-size: clamp(2.55rem, 12vw, 4.2rem) !important; }
}
`;

let changed = 0;
for (const file of walk(targetRoot).filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (item) => item.endsWith('.html'))) {
  if (cleanBlogArticle(file)) changed += 1;
}

if (fs.existsSync(stylePath)) {
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style
    .replace(/Version:\s*[0-9.]+/i, `Version: ${styleVersion}`)
    .replace(/\/\* nrs-final-navigation-font-consistency-v\d+ \*\/[\s\S]*$/g, '')
    .trimEnd();
  style += `\n\n${css.trim()}\n`;
  fs.writeFileSync(stylePath, style, 'utf8');
}

console.log(`Normalized navigation and typography on ${changed} blog detail page(s).`);
