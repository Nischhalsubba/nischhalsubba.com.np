const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const serviceDetails = new Set([
  'product-design-nepal.html',
  'web3-ux-designer.html',
  'saas-ux-designer.html',
  'website-ux-design.html',
  'figma-design-systems.html',
  'ux-audit.html',
]);
const navigationItems = [
  ['home', '/', 'Home'],
  ['work', '/projects', 'Work'],
  ['services', '/services', 'Services'],
  ['about', '/about', 'About'],
  ['writing', '/blog/', 'Writing'],
  ['contact', '/contact', 'Contact'],
];

function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || (target === root && entry.name === 'dist')) continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath, output);
    else output.push(filePath);
  }
  return output;
}

function relativePath(filePath) {
  return path.relative(target, filePath).replaceAll(path.sep, '/').replace(/^public\//, '');
}

function activeSection(relativeFile) {
  const base = path.basename(relativeFile);
  if (relativeFile === 'index.html' || base === 'home.html' || base === 'home-v2.html') return 'home';
  if (base === 'projects.html' || /^project-/.test(base)) return 'work';
  if (base === 'services.html' || serviceDetails.has(base)) return 'services';
  if (base === 'about.html') return 'about';
  if (base === 'contact.html') return 'contact';
  if (relativeFile.startsWith('blog/') || /^blog-/.test(base)) return 'writing';
  return '';
}

function links(active, className) {
  return navigationItems.map(([key, href, label]) => {
    const activeClass = key === active ? ' active' : '';
    const current = key === active ? ' aria-current="page"' : '';
    return `<a href="${href}" class="${className}${activeClass}"${current}>${label}</a>`;
  }).join('');
}

function shell(active, themeToggle) {
  return `<header class="nrs-site-header" data-nrs-site-header>
    <a class="nrs-site-brand" href="/" aria-label="Nischhal Raj Subba home"><span class="nrs-site-brand__name">Nischhal Raj Subba</span><span class="nrs-site-brand__role">Product Designer · Kathmandu</span></a>
    <nav class="nav-wrapper" aria-label="Primary navigation"><div class="nav-pill"><div class="nav-glider" aria-hidden="true"></div>${links(active, 'nav-link')}</div></nav>
    <div class="nrs-site-actions"><span class="nrs-site-availability" aria-label="Available for selected product design work"><span>Available for selected work</span></span>${themeToggle}<button class="mobile-nav-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav-overlay"><span></span><span></span></button></div>
  </header>
  <a href="/" class="mobile-logo" aria-label="Nischhal Raj Subba home">NRS</a>
  <div class="mobile-nav-overlay" id="mobile-nav-overlay" hidden><nav class="mobile-nav-links" aria-label="Mobile navigation">${links(active, '')}</nav></div>`;
}

const footer = `<footer class="site-footer" aria-label="Portfolio footer"><div class="container nrs-footer-editorial"><div class="nrs-footer-cta"><p class="nrs-editorial-section-label">Product design / Nepal / Remote</p><h2 class="nrs-footer-cta__title"><span class="nrs-footer-cta__title-text">Clear the product.<br><em>Then make it memorable.</em></span></h2></div><div class="nrs-footer-links"><a href="mailto:hinischalsubba@gmail.com">Email</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/Nischhalsubba" target="_blank" rel="noopener noreferrer">GitHub</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a><a href="/contact">Project inquiry</a></div><div class="nrs-footer-meta"><span>© 2026 Nischhal Raj Subba.</span><span>27.7172° N / 85.3240° E · UTC +05:45</span><span><a href="/privacy">Privacy</a> · <a href="/services">Services</a></span></div></div></footer>`;

const themeTogglePattern = /<button\b[^>]*id=["']theme-toggle["'][^>]*>[\s\S]*?<\/button>/i;

function stripExistingShell(html) {
  return html
    .replace(/<header\b[^>]*class=["'][^"']*nrs-site-header[^"']*["'][\s\S]*?<\/header>/gi, '')
    .replace(/<button\b[^>]*class=["'][^"']*mobile-nav-toggle[^"']*["'][\s\S]*?<\/button>/gi, '')
    .replace(/<a\b[^>]*class=["'][^"']*mobile-logo[^"']*["'][\s\S]*?<\/a>/gi, '')
    .replace(/<div\b[^>]*class=["'][^"']*mobile-nav-overlay[^"']*["'][\s\S]*?<\/div>/gi, '')
    .replace(/<nav\b[^>]*class=["'][^"']*nav-wrapper[^"']*["'][\s\S]*?<\/nav>/gi, '');
}

function insertShell(html, sharedShell) {
  if (/<main\b/i.test(html)) return html.replace(/<main\b/i, `${sharedShell}<main`);
  throw new Error('Cannot insert shared shell because the page has no main element.');
}

function normalizeFooter(html) {
  const existingFooter = /<footer\b[^>]*class=["'][^"']*site-footer[^"']*["'][\s\S]*?<\/footer>/i;
  if (existingFooter.test(html)) return html.replace(existingFooter, footer);
  const closingBody = /\s*(<script\b[^>]*src=["'](?:\/script\.js|\/assets\/[^"']+\.js)[^>]*><\/script>\s*<\/body>)/i;
  if (closingBody.test(html)) return html.replace(closingBody, `\n${footer}\n$1`);
  return html.replace(/<\/body>/i, `${footer}</body>`);
}

function addBodyClass(html) {
  return html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i, (_match, current = '', rest = '') => {
    const classes = new Set(`${current} nrs-editorial-redesign`.trim().split(/\s+/).filter(Boolean));
    return `<body class="${[...classes].join(' ')}"${rest}>`;
  });
}

function normalize(html, relativeFile) {
  const existingToggle = html.match(themeTogglePattern)?.[0] || '<button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle theme"></button>';
  let output = stripExistingShell(html).replace(themeTogglePattern, '');
  output = insertShell(output, shell(activeSection(relativeFile), existingToggle));
  output = normalizeFooter(output);
  output = addBodyClass(output);
  return output
    .replace(/\(c\)\s*2026/gi, '© 2026')
    .replace(/href="\/(projects|services|about|contact)\.html"/g, 'href="/$1"')
    .replace(/href="\/(product-design-nepal|web3-ux-designer|saas-ux-designer|website-ux-design|figma-design-systems|ux-audit)\.html"/g, 'href="/$1"');
}

let changed = 0;
for (const filePath of walk(target).filter((file) => file.endsWith('.html'))) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = normalize(before, relativePath(filePath));
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`Normalized the editorial navigation and footer on ${changed} page(s).`);