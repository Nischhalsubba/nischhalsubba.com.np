/**
 * @fileoverview Install the homepage workspace design on every retained inner route.
 * Purpose: Replace obsolete visual shells while preserving complete main content and SEO.
 * Responsibilities: Reuse homepage fonts, navigation, footer and motion; retain contact security.
 * Execution context: Final Node production build stage, after install-workspace-home.
 * Connected files: src/workspace-inner, src/workspace-home, package.json.
 * Maintenance: Keep semantic content in its canonical generator; own shared presentation here.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const home = fs.readFileSync(path.join(root, 'src/workspace-home/index.html'), 'utf8');
const source = path.join(root, 'src/workspace-inner');
fs.cpSync(source, path.join(dist, 'workspace-inner'), { recursive: true });
const homeStyles = [...home.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]).join('\n');
fs.writeFileSync(path.join(dist, 'workspace-inner/home-system.css'), homeStyles);
const footer = home.match(/<footer>[\s\S]*?<\/footer>/)[0];
const originalNav = home.match(/<nav class="tb"[\s\S]*?<\/nav>/)[0];
const destinations = { top: '/', about: '/about', exp: '/#exp', work: '/projects', services: '/services', process: '/blog/', testi: '/#testi', pricing: '/#pricing', contact: '/contact' };
const routes = [];
/** Function contract: collect
 * Purpose: Collect generated public HTML, excluding the untouched homepage and asset namespaces.
 * Inputs: directory path. Side effects: reads filesystem, appends route filenames. Returns: void.
 */
function collect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('workspace-')) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (entry.name.endsWith('.html') && !['index.html', 'home.html', 'home-v2.html'].includes(path.relative(dist, file))) routes.push(file);
  }
}
collect(dist);
const inventory = [];
for (const file of routes) {
  const html = fs.readFileSync(file, 'utf8');
  let main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  if (!main) throw new Error(`Missing semantic content: ${file}`);
  const relative = path.relative(dist, file).replaceAll('\\', '/');
  const isBlog = relative.startsWith('blog/');
  const isProject = relative.startsWith('project-');
  const section = isProject || relative === 'projects.html' ? 'work' : isBlog ? 'process' : relative === 'about.html' ? 'about' : relative === 'contact.html' ? 'contact' : 'services';
  let nav = originalNav.replace(/class="tb-t on"/g, 'class="tb-t"').replace(/href="#([^"]+)"/g, (match, id) => `href="${destinations[id] || '/#' + id}"`)
    .replace(/Process/g, 'Writing').replace(/aria-label="Nischhal, back to top"/, 'aria-label="Nischhal, homepage"')
    .replace(new RegExp(`data-sec="${section}"`, 'g'), `data-sec="${section}" aria-current="page"`)
    .replace(/<span class="tb-file">[\s\S]*?<\/span>/, '<span class="tb-file">Nischhal / <b>Portfolio</b></span>');
  let head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)[1]
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<link\b[^>]*>/gi, tag => /stylesheet|preconnect|preload.*font/.test(tag) ? '' : tag)
    .replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (tag, attrs) => attrs.includes('ld+json') ? tag : '')
    .replace(/<meta\s+name="theme-color"[^>]*>/gi, '');
  // Inline layout declarations remain useful; obsolete surface styling is normalized by the shared design tokens.
  main = main.replace(/\bdata-agent-reveal\b/g, 'data-workspace-reveal').replace(/\breveal-on-scroll\b/g, 'workspace-reveal');
  const title = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, '') || 'Portfolio';
  const group = isProject ? 'Case study' : isBlog ? 'Writing' : 'Portfolio';
  const label = title.length > 60 ? title.slice(0, 57) + '…' : title;
  const bar = `<div class="workspace-filebar"><a href="/" aria-label="Homepage">NISCHHAL</a><span>/</span><span>${group}</span><span class="workspace-file-name">/ ${label}</span><span class="workspace-live"><i></i> DESIGN FILE</span></div>`;
  const connect = relative === 'contact.html' ? '' : `<section class="workspace-connect"><span class="mono">NEXT FILE / YOUR PRODUCT</span><h2>Got a product <span>in mind?</span></h2><a class="workspace-button" href="/contact">Let’s talk <span aria-hidden="true">↗</span></a></section>`;
  const output = `<!doctype html>\n<html lang="en" data-theme="dark"><head>${head}\n<meta name="theme-color" content="#07070A"><link rel="stylesheet" href="/workspace-home/vendor/fonts.googleapis.com/ceaca49b99bd7ce7.css"><link rel="stylesheet" href="/workspace-inner/home-system.css"><link rel="stylesheet" href="/workspace-home/personal.css"><link rel="stylesheet" href="/workspace-inner/inner.css"></head><body id="top" data-portfolio-design="workspace-inner-v1"><a class="skip-link" href="#main-content">Skip to main content</a><div class="workspace-progress" aria-hidden="true"></div>${bar}${main}${connect}${footer}${nav}<script type="module" src="/workspace-inner/inner.js"></script></body></html>`;
  fs.writeFileSync(file, output);
  inventory.push({ file: relative, title, contentHash: crypto.createHash('sha256').update(main).digest('hex'), kind: isProject ? 'project' : isBlog ? (relative === 'blog/index.html' ? 'blog-index' : 'article') : 'page' });
}
fs.writeFileSync(path.join(dist, 'workspace-inner/routes.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(`[workspace-inner] Rebuilt ${inventory.length} inner pages with the homepage design system.`);
