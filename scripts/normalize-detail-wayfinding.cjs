const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const serviceFiles = new Set([
  'product-design-nepal.html', 'web3-ux-designer.html', 'saas-ux-designer.html',
  'website-ux-design.html', 'figma-design-systems.html', 'ux-audit.html',
]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function plain(value = '') {
  return value.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function context(rel) {
  const base = path.basename(rel);
  if (/^project-[^/]+\.html$/.test(base)) return { href: '/projects', label: 'Work' };
  if (rel.startsWith('blog/') && base !== 'index.html') return { href: '/blog/', label: 'Writing' };
  if (serviceFiles.has(base)) return { href: '/services', label: 'Services' };
  return null;
}

function removeLegacy(html) {
  return html
    .replace(/\s*<nav\b[^>]*class=["'][^"']*(?:nrs-wayfinding|nrs-blog-utility|nrs-blog-breadcrumbs)[^"']*["'][\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<a\b[^>]*class=["'][^"']*(?:nrs-back-link|nrs-blog-back-btn)[^"']*["'][\s\S]*?<\/a>\s*/gi, '\n')
    .replace(/\s*<a\b[^>]*href=["'](?:\/projects|\/services|\/blog\/)["'][^>]*>\s*(?:&larr;|←)?\s*Back to[^<]*<\/a>\s*/gi, '\n');
}

function normalize(file) {
  const rel = path.relative(targetRoot, file).replaceAll(path.sep, '/');
  const parent = context(rel);
  if (!parent) return false;

  const before = fs.readFileSync(file, 'utf8');
  let html = removeLegacy(before);
  const title = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]) || 'Detail';
  const breadcrumb = `<nav class="nrs-detail-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${parent.href}">${parent.label}</a></li><li><span aria-current="page">${title}</span></li></ol></nav>`;
  const anchor = /(<(?:section|article)\b[^>]*class=["'][^"']*(?:hero|article|section-container)[^"']*["'][^>]*>)/i;
  html = anchor.test(html) ? html.replace(anchor, `$1\n${breadcrumb}`) : html.replace(/(<main\b[^>]*>)/i, `$1\n${breadcrumb}`);

  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  return html !== before;
}

let changed = 0;
for (const file of walk(targetRoot)) if (normalize(file)) changed += 1;
console.log(`Normalized ${changed} detail page(s) to one breadcrumb.`);
