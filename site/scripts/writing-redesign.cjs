/**
 * @fileoverview scripts/writing-redesign.cjs
 * Purpose: Rebuild the production writing index into the same project-style editorial layout used by the redesigned portfolio, then apply the shared portfolio polish stage.
 * Responsibilities:
 * - Read generated writing-index routes from `dist/` when they exist.
 * - Extract existing post URLs, dates, titles, and summaries without changing article content.
 * - Replace only the writing-index `<main>` region with the redesigned list markup.
 * - Run `portfolio-polish.cjs` afterward so the writing route and About page receive the shared final style refinements.
 * Execution context: Node.js production-build stage invoked by `scripts/build-dist.cjs`.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/portfolio-polish.cjs
 * - dist/blog/index.html
 * - dist/blog.html
 * Maintenance: Keep this stage focused on the writing index. Article detail content and canonical source generation belong to their own content/build owners.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const files = [path.join(dist, 'blog', 'index.html'), path.join(dist, 'blog.html')].filter(
  /** Callback contract: Keep only writing-index routes that exist in the current production output. Inputs: `file` - absolute candidate path. Side effects: Reads filesystem state. Returns: `true` when the file exists. */
  (file) => fs.existsSync(file),
);

/**
 * Function contract: text
 * Purpose: Convert a small HTML fragment into normalized plain text for reuse in rebuilt writing-index cards.
 * Inputs: `value` - HTML or text fragment.
 * Side effects: None.
 * Returns: Trimmed text with tags removed, common entities decoded, and whitespace collapsed.
 */
function text(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rarr;/g, '→')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Function contract: escape
 * Purpose: Escape text before placing extracted writing metadata back into generated HTML.
 * Inputs: `value` - value to stringify and escape.
 * Side effects: None.
 * Returns: HTML-safe text for element content or quoted attributes.
 */
function escape(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const posts = [];
  const itemPattern = /<a\b([^>]*class=["'][^"']*writing-item[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(itemPattern)) {
    const attrs = match[1];
    const body = match[2];
    const href = attrs.match(/\bhref=["']([^"']+)["']/i)?.[1];
    const date = text(body.match(/class=["'][^"']*w-date[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]);
    const title = text(body.match(/class=["'][^"']*w-title[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]);
    const summary = text(body.match(/class=["'][^"']*w-summary[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1]);
    if (href && title) posts.push({ href, date, title, summary });
  }

  if (!posts.length) continue;

  const list = posts.map(
    /** Callback contract: Render one extracted article as a numbered writing-index row. Inputs: `post` - extracted article metadata; `index` - zero-based display position. Side effects: None. Returns: HTML for one writing-index link. */
    (post, index) => `<a class="agent-index-item" href="${escape(post.href)}" data-agent-reveal><span class="agent-project-index">${String(index + 1).padStart(2, '0')}</span><h2>${escape(post.title)}</h2><span class="agent-meta">${escape(post.date || 'Essay')}</span><p>${escape(post.summary)}</p><span class="agent-project-arrow" aria-hidden="true">↗</span></a>`,
  ).join('');

  const main = `<main id="main-content" class="agent-main"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Writing</span><h1>Notes from the difficult parts.</h1></div><p class="agent-page-intro">Product-design writing about audits, SaaS dashboards, Web3 flows, design systems, responsive behavior, implementation handoff, and the decisions hidden between screens.</p></div></header><section class="agent-section agent-section--compact"><div class="agent-frame"><div class="agent-index-list">${list}</div></div></section></main>`;
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  fs.writeFileSync(file, html, 'utf8');
}

console.log(`[writing-redesign] Rebuilt ${files.length} writing index route(s).`);
require('./portfolio-polish.cjs');
