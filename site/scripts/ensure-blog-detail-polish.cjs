/**
 * @fileoverview scripts/ensure-blog-detail-polish.cjs
 * Purpose: Apply the ensure blog detail polish production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const site = 'https://nischhalsubba.com.np';
const styleVersion = '46.0';
const scriptVersion = '36.0';
const stylePath = path.join(targetRoot, 'style.css');

const css = `

/* nrs-blog-detail-polish-v46 */
.nrs-blog-detail-page,
.nrs-blog-detail-page body {
  font-family: var(--font-sans) !important;
}
.nrs-blog-detail-page main.container {
  width: min(1180px, calc(100vw - var(--pad-x) * 2)) !important;
  max-width: min(1180px, calc(100vw - var(--pad-x) * 2)) !important;
}
.nrs-blog-detail-page article.section-container {
  width: 100% !important;
  max-width: 100% !important;
  padding-top: clamp(132px, 12vw, 176px) !important;
  padding-bottom: clamp(80px, 8vw, 126px) !important;
  margin: 0 !important;
  border-top: 0 !important;
}
.nrs-blog-breadcrumbs {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 8px !important;
  margin-bottom: clamp(28px, 4vw, 46px) !important;
  color: var(--text-tertiary) !important;
  font-size: .78rem !important;
  font-weight: 800 !important;
  letter-spacing: .03em !important;
}
.nrs-blog-breadcrumbs a,
.nrs-blog-breadcrumbs span {
  display: inline-flex !important;
  align-items: center !important;
  min-height: 34px !important;
  text-decoration: none !important;
}
.nrs-blog-breadcrumbs a {
  padding: 0 12px !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-pill) !important;
  background: var(--bg-surface) !important;
  color: var(--text-primary) !important;
}
.nrs-blog-breadcrumbs a:hover {
  border-color: var(--border-strong) !important;
  background: var(--bg-panel-2) !important;
  transform: translateY(-1px) !important;
}
.nrs-blog-breadcrumbs .nrs-crumb-current {
  max-width: min(540px, 100%) !important;
  color: var(--text-secondary) !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.nrs-blog-back-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  min-height: 46px !important;
  margin: 0 0 clamp(26px, 3vw, 40px) !important;
  padding: 0 18px !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-pill) !important;
  background: var(--bg-panel) !important;
  color: var(--text-primary) !important;
  font-size: .86rem !important;
  font-weight: 900 !important;
  text-decoration: none !important;
  width: max-content !important;
  max-width: 100% !important;
}
.nrs-blog-back-btn::before {
  content: '←' !important;
  display: grid !important;
  place-items: center !important;
  width: 24px !important;
  height: 24px !important;
  border-radius: 999px !important;
  background: var(--accent) !important;
  color: var(--accent-ink) !important;
  line-height: 1 !important;
}
.nrs-blog-back-btn:hover {
  transform: translateY(-2px) !important;
  border-color: var(--border-strong) !important;
  background: var(--bg-panel-2) !important;
}
.nrs-blog-detail-page .nrs-blog-category {
  margin: 0 0 22px !important;
}
.nrs-blog-detail-page .hero-title,
.nrs-blog-detail-page article h1 {
  max-width: 980px !important;
  margin: 0 !important;
  font-family: var(--font-sans) !important;
  font-size: clamp(3rem, 6vw, 6.25rem) !important;
  line-height: .98 !important;
  letter-spacing: -.065em !important;
  font-weight: 900 !important;
  color: var(--text-primary) !important;
  -webkit-text-fill-color: var(--text-primary) !important;
  text-wrap: balance !important;
}
.nrs-blog-detail-page article > .body-large,
.nrs-blog-detail-page .nrs-blog-dek {
  max-width: 780px !important;
  margin: clamp(22px, 3vw, 34px) 0 0 !important;
  color: var(--text-secondary) !important;
  font-size: clamp(1.04rem, 1.25vw, 1.22rem) !important;
  line-height: 1.75 !important;
}
.nrs-blog-detail-page .meta-text,
.nrs-blog-detail-page .nrs-blog-meta {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 10px !important;
  width: 100% !important;
  max-width: 100% !important;
  margin-top: clamp(28px, 4vw, 46px) !important;
  padding-top: 22px !important;
  border-top: 1px solid var(--hairline) !important;
}
.nrs-blog-detail-page .meta-text span,
.nrs-blog-detail-page .nrs-blog-meta span {
  display: inline-flex !important;
  align-items: center !important;
  min-height: 34px !important;
  padding: 0 12px !important;
  border: 1px solid var(--border-faint) !important;
  border-radius: var(--radius-pill) !important;
  background: var(--bg-surface) !important;
  color: var(--text-tertiary) !important;
}
.nrs-blog-cover-img {
  display: block !important;
  width: 100% !important;
  max-height: min(520px, 52vw) !important;
  object-fit: cover !important;
  margin-top: clamp(34px, 5vw, 58px) !important;
  border-radius: var(--radius-xl) !important;
  border: 1px solid var(--border-faint) !important;
  box-shadow: var(--shadow-card) !important;
}
.nrs-blog-detail-page article > .body-large:last-of-type,
.nrs-blog-detail-page .nrs-blog-content {
  max-width: 820px !important;
  margin-top: clamp(48px, 6vw, 78px) !important;
  color: var(--text-secondary) !important;
  font-size: clamp(1.03rem, 1.08vw, 1.13rem) !important;
  line-height: 1.88 !important;
}
.nrs-blog-detail-page .nrs-blog-content p,
.nrs-blog-detail-page article > .body-large:last-of-type p {
  margin: 0 0 1.35em !important;
}
.nrs-blog-detail-page .nrs-blog-content h2,
.nrs-blog-detail-page article > .body-large:last-of-type h2 {
  margin: 2.2em 0 .7em !important;
  max-width: 760px !important;
  font-family: var(--font-sans) !important;
  font-size: clamp(2rem, 3.2vw, 3.45rem) !important;
  line-height: 1.02 !important;
  letter-spacing: -.055em !important;
  font-weight: 900 !important;
  color: var(--text-primary) !important;
}
.nrs-blog-detail-page .nrs-blog-content h3,
.nrs-blog-detail-page article > .body-large:last-of-type h3 {
  margin: 1.9em 0 .55em !important;
  max-width: 720px !important;
  font-family: var(--font-sans) !important;
  font-size: clamp(1.35rem, 2.1vw, 2rem) !important;
  line-height: 1.12 !important;
  letter-spacing: -.035em !important;
  font-weight: 900 !important;
  color: var(--text-primary) !important;
}
.nrs-blog-detail-page .nrs-blog-content a,
.nrs-blog-detail-page article > .body-large:last-of-type a {
  color: var(--text-primary) !important;
  text-decoration: underline !important;
  text-underline-offset: 4px !important;
  text-decoration-thickness: 1px !important;
}
.nrs-blog-detail-page .nrs-blog-content ul,
.nrs-blog-detail-page .nrs-blog-content ol,
.nrs-blog-detail-page article > .body-large:last-of-type ul,
.nrs-blog-detail-page article > .body-large:last-of-type ol {
  padding-left: 1.2em !important;
  margin: 0 0 1.4em !important;
}
@media (max-width: 720px) {
  .nrs-blog-detail-page main.container {
    width: calc(100vw - 40px) !important;
    max-width: calc(100vw - 40px) !important;
  }
  .nrs-blog-detail-page article.section-container {
    padding-top: 128px !important;
  }
  .nrs-blog-detail-page .hero-title,
  .nrs-blog-detail-page article h1 {
    font-size: clamp(2.5rem, 12vw, 4.35rem) !important;
  }
  .nrs-blog-breadcrumbs .nrs-crumb-current {
    max-width: 100% !important;
    white-space: normal !important;
  }
  .nrs-blog-cover-img {
    max-height: 360px !important;
    border-radius: 22px !important;
  }
}
`;


/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure blog detail polish repository tool.
 * Inputs: `dir`, `files`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}


/**
 * Function contract: rel
 * Purpose: Implement the rel responsibility owned by the ensure blog detail polish repository tool.
 * Inputs: `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function rel(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/');
}


/**
 * Function contract: getTitle
 * Purpose: Return title from the supplied inputs or current ensure blog detail polish repository tool state.
 * Inputs: `html`, `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: The requested title; explicit early-return branches define empty/fallback behavior.
 */
function getTitle(html, file) {
  return html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim()
    || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.split('|')[0]?.trim()
    || path.basename(file, '.html').replace(/-/g, ' ');
}


/**
 * Function contract: getCategory
 * Purpose: Return category from the supplied inputs or current ensure blog detail polish repository tool state.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: The requested category; explicit early-return branches define empty/fallback behavior.
 */
function getCategory(html) {
  return html.match(/<p class="eyebrow"[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.replace(/<[^>]+>/g, '').trim()
    || 'Article';
}


/**
 * Function contract: titleCase
 * Purpose: Implement the title case responsibility owned by the ensure blog detail polish repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function titleCase(value) {
  return value.replace(/\s+/g, ' ').trim().replace(/\b\w/g,  /** Callback contract: Perform the local callback step required by the immediately enclosing ensure blog detail polish repository tool operation. Inputs: `char` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (char) => char.toUpperCase());
}


/**
 * Function contract: upsertBodyClass
 * Purpose: Implement the upsert body class responsibility owned by the ensure blog detail polish repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function upsertBodyClass(html) {
  if (/<html\b[^>]*class=["'][^"']*nrs-blog-detail-page/i.test(html)) return html;
  if (/<html\b[^>]*class=/i.test(html)) return html.replace(/<html\b([^>]*class=["'])([^"']*)(["'][^>]*)>/i, '<html$1$2 nrs-blog-detail-page$3>');
  return html.replace(/<html\b([^>]*)>/i, '<html$1 class="nrs-blog-detail-page">');
}


/**
 * Function contract: normalizeAssetVersions
 * Purpose: Apply asset versions consistently while preserving the surrounding ensure blog detail polish repository tool contract.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeAssetVersions(html) {
  return html
    .replace(/\/style\.css\?v=[0-9.]+/g, `/style.css?v=${styleVersion}`)
    .replace(/\/script\.js\?v=[0-9.]+/g, `/script.js?v=${scriptVersion}`);
}



/**
 * Function contract: normalizeArticleClasses
 * Purpose: Apply article classes consistently while preserving the surrounding ensure blog detail polish repository tool contract.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeArticleClasses(html) {
  return html
    .replace(/<p class="eyebrow"([^>]*)>/i, '<p class="eyebrow nrs-blog-category"$1>')
    .replace(/<div class="meta-text"/i, '<div class="meta-text nrs-blog-meta"')
    .replace(/<div class="body-large"([^>]*)>/i, '<div class="body-large nrs-blog-content"$1>')
    .replace(/<p class="body-large"([^>]*)>/i, '<p class="body-large nrs-blog-dek"$1>');
}



/**
 * Function contract: removeOldBackAndBreadcrumbs
 * Purpose: Remove old back and breadcrumbs without disturbing required surrounding ensure blog detail polish repository tool state.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function removeOldBackAndBreadcrumbs(html) {
  return html
    .replace(/\s*<nav class="nrs-blog-breadcrumbs"[\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<a class="nrs-blog-back-btn"[\s\S]*?<\/a>\s*/gi, '\n')
    .replace(/\s*<a class="badge-pill" href="\/blog\/">[\s\S]*?<\/a>\s*/i, '\n');
}



/**
 * Function contract: breadcrumbHtml
 * Purpose: Implement the breadcrumb html responsibility owned by the ensure blog detail polish repository tool.
 * Inputs: `{ title, category }`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function breadcrumbHtml({ title, category }) {
  const categoryLabel = titleCase(category);
  return `        <nav class="nrs-blog-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Writing</a><span aria-hidden="true">/</span><span class="nrs-crumb-current" aria-current="page">${categoryLabel}</span>
        </nav>
        <a class="nrs-blog-back-btn" href="/blog/">Back to all writing</a>`;
}



/**
 * Function contract: breadcrumbJsonLd
 * Purpose: Implement the breadcrumb json ld responsibility owned by the ensure blog detail polish repository tool.
 * Inputs: `{ title, slugPath }`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function breadcrumbJsonLd({ title, slugPath }) {
  const url = `${site}/${slugPath}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
      { '@type': 'ListItem', position: 2, name: 'Writing', item: `${site}/blog/` },
      { '@type': 'ListItem', position: 3, name: title, item: url },
    ],
  };
  return `<script id="nrs-blog-breadcrumb-json" type="application/ld+json">${JSON.stringify(data)}</script>`;
}



/**
 * Function contract: upsertBreadcrumbJson
 * Purpose: Implement the upsert breadcrumb json responsibility owned by the ensure blog detail polish repository tool.
 * Inputs: `html`, `payload`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function upsertBreadcrumbJson(html, payload) {
  let output = html.replace(/\s*<script id="nrs-blog-breadcrumb-json"[\s\S]*?<\/script>\s*/gi, '\n');
  return output.replace('</head>', `    ${payload}\n  </head>`);
}



/**
 * Function contract: ensureCanonicalHierarchy
 * Purpose: Apply canonical hierarchy consistently while preserving the surrounding ensure blog detail polish repository tool contract.
 * Inputs: `html`, `slugPath`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function ensureCanonicalHierarchy(html, slugPath) {
  const canonical = `${site}/${slugPath}`;
  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  } else {
    html = html.replace('</head>', `    <link rel="canonical" href="${canonical}" />\n  </head>`);
  }
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  return html;
}



/**
 * Function contract: polishBlogArticle
 * Purpose: Apply blog article consistently while preserving the surrounding ensure blog detail polish repository tool contract.
 * Inputs: `file`
 * Side effects: writes filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function polishBlogArticle(file) {
  const slugPath = rel(file);
  if (!slugPath.startsWith('blog/') || slugPath === 'blog/index.html' || !slugPath.endsWith('.html')) return false;

  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const title = getTitle(html, file);
  const category = getCategory(html);

  html = upsertBodyClass(html);
  html = normalizeAssetVersions(html);
  html = ensureCanonicalHierarchy(html, slugPath);
  html = upsertBreadcrumbJson(html, breadcrumbJsonLd({ title, slugPath }));
  html = removeOldBackAndBreadcrumbs(html);
  html = html.replace(/(<article\b[^>]*>)/i, `$1\n${breadcrumbHtml({ title, category })}`);
  html = normalizeArticleClasses(html);

  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  return html !== before;
}



/**
 * Function contract: updateStyle
 * Purpose: Apply style consistently while preserving the surrounding ensure blog detail polish repository tool contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: writes filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function updateStyle() {
  if (!fs.existsSync(stylePath)) return false;
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(/Version:\s*[0-9.]+/i, `Version: ${styleVersion}`);
  style = style.replace(/\/\* nrs-blog-detail-polish-v\d+ \*\/[\s\S]*$/g, '');
  style += css;
  fs.writeFileSync(stylePath, style, 'utf8');
  return true;
}

let changed = 0;
for (const file of walk(targetRoot).filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (item) => item.endsWith('.html'))) {
  if (polishBlogArticle(file)) changed += 1;
}
const styled = updateStyle();

console.log(`Polished ${changed} blog detail page(s)${styled ? ' and updated shared style.css' : ''}.`);
