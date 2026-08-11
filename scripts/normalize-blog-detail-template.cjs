/**
 * @fileoverview scripts/normalize-blog-detail-template.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for normalize blog detail template.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const styleVersion = '51.0';

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: dir, files.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Function contract: text
 * Purpose: Implements the text responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function text(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Function contract: ensurePageClass
 * Purpose: Applies ensure page class while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensurePageClass(html) {
  if (/class=["'][^"']*nrs-blog-detail-page/i.test(html)) return html;
  if (/<html\b[^>]*class=/i.test(html)) {
    return html.replace(/<html\b([^>]*class=["'])([^"']*)(["'][^>]*)>/i, '<html$1$2 nrs-blog-detail-page$3>');
  }
  return html.replace(/<html\b([^>]*)>/i, '<html$1 class="nrs-blog-detail-page">');
}

/**
 * Function contract: normalizeArticle
 * Purpose: Applies normalize article while preserving the surrounding repository/runtime contract.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeArticle(file) {
  const rel = path.relative(targetRoot, file).replaceAll(path.sep, '/');
  if (!rel.startsWith('blog/') || rel === 'blog/index.html' || !rel.endsWith('.html')) return false;

  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const category = text(html.match(/<p class=["'][^"']*nrs-blog-category[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1]) ||
    text(html.match(/<p class=["'][^"']*eyebrow[^"']*["'][^>]*>([\s\S]*?)<\/p>/i)?.[1]) || 'Article';

  html = ensurePageClass(html)
    .replace(/\s*<nav class=["']nrs-wayfinding["'][\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<nav class=["']nrs-blog-breadcrumbs["'][\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<nav class=["']nrs-blog-utility["'][\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<a class=["']nrs-blog-back-btn["'][\s\S]*?<\/a>\s*/gi, '\n')
    .replace(/\s*<a class=["']nrs-back-link["'][\s\S]*?<\/a>\s*/gi, '\n')
    .replace(/\s*<a class=["']badge-pill["'] href=["']\/blog\/["'][\s\S]*?<\/a>\s*/gi, '\n');

  const utility = `<nav class="nrs-blog-utility" aria-label="Article navigation"><a href="/blog/">← Back to writing</a><span aria-hidden="true">/</span><span>${category}</span></nav>`;
  const categoryTag = /(<p class=["'][^"']*(?:nrs-blog-category|eyebrow)[^"']*["'][^>]*>)/i;
  html = categoryTag.test(html)
    ? html.replace(categoryTag, `${utility}\n$1`)
    : html.replace(/(<article\b[^>]*>)/i, `$1\n${utility}`);

  html = html.replace(/\/style\.css\?v=[0-9.]+/g, `/style.css?v=${styleVersion}`);
  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  return html !== before;
}

let changed = 0;
for (const file of walk(targetRoot)) {
  if (file.endsWith('.html') && normalizeArticle(file)) changed += 1;
}

console.log(`Normalized ${changed} blog detail page(s) to one article navigation component.`);
