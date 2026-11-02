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
// These implementations are extracted verbatim so fixes to the homepage cannot drift on inner routes.
const decoder = home.slice(home.indexOf('class Decoder {'), home.indexOf('  const io = new IntersectionObserver'));
const frame = home.slice(home.indexOf('function chSize(el)'), home.indexOf('  const chRO = new ResizeObserver'));
const footerMotion = home.slice(home.indexOf('  (() => {', home.indexOf('/* ---- footer: the name again')), home.indexOf('  /* ---- section labels read as Figma frame names'));
const footerInitializer = `function initFooter(){ const $=(selector, parent=document)=>parent.querySelector(selector); const RS=()=>Math.min(devicePixelRatio||1,2,Math.max(1,Math.sqrt(8.3e6/(innerWidth*innerHeight||1)))); ${footerMotion} }`;
const primitives = `const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches; const GLYPHS='#@$%&8901ZQ9*'; const CHAR_MS=60, LINE_MS=420, WIN=4;\n${decoder}\n${frame}\n${footerInitializer}\nexport { Decoder, chSize, initFooter };\n`;
fs.writeFileSync(path.join(dist, 'workspace-inner/homepage-primitives.js'), primitives);
const gradient = home.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)[0];
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
    .replace(new RegExp(`data-sec="${section}"`, 'g'), `data-sec="${section}" aria-current="page"`);
  let head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)[1]
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<link\b[^>]*>/gi, tag => /stylesheet|preconnect|preload.*font/.test(tag) ? '' : tag)
    .replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (tag, attrs) => attrs.includes('ld+json') ? tag : '')
    .replace(/<meta\s+name="theme-color"[^>]*>/gi, '');
  // Inline layout declarations remain useful; obsolete surface styling is normalized by the shared design tokens.
  main = main.replace(/\bdata-agent-reveal\b/g, 'data-workspace-reveal').replace(/\breveal-on-scroll\b/g, 'workspace-reveal');
  const title = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, '') || 'Portfolio';
  const group = isProject ? 'Case study' : isBlog ? 'Writing' : 'Portfolio';
  const sectionNames = {work:['04','Work'],about:['02','About'],contact:['09','Contact'],services:['05','Services'],process:['06','Writing']};
  const [sectionNumber, sectionLabel] = sectionNames[section] || ['01','Home'];
  nav = nav.replace('<span class="tb-now" id="islNow" aria-live="polite"></span>', `<span class="tb-now" id="islNow" aria-live="polite"><span><em>${sectionNumber}</em>${sectionLabel}</span></span>`);
  const label = title.length > 60 ? title.slice(0, 57) + '…' : title;
  const bar = `<div class="workspace-filebar mono"><a href="/" aria-label="Homepage">NISCHHAL</a><span>/</span><span>${group}</span><span class="workspace-file-name">/ ${label}</span><span class="workspace-live"><i></i> DESIGN FILE</span></div>`;
  const connect = relative === 'contact.html' ? '' : `<section class="workspace-connect"><span class="mono">NEXT FILE / YOUR PRODUCT</span><h2>Got a product <span>in mind?</span></h2><a class="workspace-button" href="/contact">Let’s talk <span aria-hidden="true">↗</span></a></section>`;
  main = main.replace(/<h([12])([^>]*)>([\s\S]*?)<\/h\1>/g, (tag, level, attrs, text) => `<h${level}${attrs} data-workspace-decode>${text}</h${level}>`);
  const output = `<!doctype html>\n<html lang="en" data-theme="dark"><head>${head}\n<meta name="theme-color" content="#07070A"><link rel="stylesheet" href="/workspace-home/vendor/fonts.googleapis.com/ceaca49b99bd7ce7.css"><link rel="stylesheet" href="/workspace-inner/home-system.css"><link rel="stylesheet" href="/workspace-home/personal.css"><link rel="stylesheet" href="/workspace-inner/inner.css"><link rel="stylesheet" href="/workspace-inner/parity.css"></head><body id="top" data-portfolio-design="workspace-inner-v1"><a class="skip-link" href="#main-content">Skip to main content</a><div class="workspace-progress" aria-hidden="true"></div>${gradient}<div class="atmo" aria-hidden="true"><div class="dots"></div></div><div class="grain" aria-hidden="true"></div><div class="workspace-grid" aria-hidden="true"></div>${bar}${main}${connect}${footer}${nav}<dialog id="mediaPreview" aria-label="Project image preview"><button type="button" id="closeMedia" aria-label="Close image preview">Close ×</button><img alt=""></dialog><script src="/workspace-home/vendor/unpkg.com/fc91f338f7a5e7ee.js"></script><script type="module" src="/workspace-inner/inner.js"></script></body></html>`;
  fs.writeFileSync(file, output);
  inventory.push({ file: relative, title, contentHash: crypto.createHash('sha256').update(main).digest('hex'), kind: isProject ? 'project' : isBlog ? (relative === 'blog/index.html' ? 'blog-index' : 'article') : 'page' });
}
fs.writeFileSync(path.join(dist, 'workspace-inner/routes.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log(`[workspace-inner] Rebuilt ${inventory.length} inner pages with the homepage design system.`);
