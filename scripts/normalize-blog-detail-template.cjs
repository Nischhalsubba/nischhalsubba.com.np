const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const styleVersion = '51.0';

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

function text(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function ensurePageClass(html) {
  if (/class=["'][^"']*nrs-blog-detail-page/i.test(html)) return html;
  if (/<html\b[^>]*class=/i.test(html)) {
    return html.replace(/<html\b([^>]*class=["'])([^"']*)(["'][^>]*)>/i, '<html$1$2 nrs-blog-detail-page$3>');
  }
  return html.replace(/<html\b([^>]*)>/i, '<html$1 class="nrs-blog-detail-page">');
}

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
