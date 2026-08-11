/**
 * @fileoverview scripts/ensure-shared-site-shell.cjs
 * Purpose: Apply the ensure shared site shell production transformation or maintenance step while preserving canonical source/build contracts.
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


/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure shared site shell repository tool.
 * Inputs: `directory`, `output`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
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


/**
 * Function contract: relativePath
 * Purpose: Implement the relative path responsibility owned by the ensure shared site shell repository tool.
 * Inputs: `filePath`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function relativePath(filePath) {
  return path.relative(target, filePath).replaceAll(path.sep, '/').replace(/^public\//, '');
}


/**
 * Function contract: activeSection
 * Purpose: Implement the active section responsibility owned by the ensure shared site shell repository tool.
 * Inputs: `relativeFile`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
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


/**
 * Function contract: links
 * Purpose: Implement the links responsibility owned by the ensure shared site shell repository tool.
 * Inputs: `active`, `className`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function links(active, className) {
  return navigationItems.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[key, href, label]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior. */ ([key, href, label]) => {
    const activeClass = key === active ? ' active' : '';
    const current = key === active ? ' aria-current="page"' : '';
    return `<a href="${href}" class="${className}${activeClass}"${current}>${label}</a>`;
  }).join('');
}


/**
 * Function contract: shell
 * Purpose: Implement the shell responsibility owned by the ensure shared site shell repository tool.
 * Inputs: `active`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function shell(active) {
  return {
    desktop: `<nav class="nav-wrapper" aria-label="Primary navigation"><div class="nav-pill"><div class="nav-glider" aria-hidden="true"></div>${links(active, 'nav-link')}</div></nav>`,
    mobile: `<button class="mobile-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav-overlay"><span></span><span></span></button><a href="/" class="mobile-logo" aria-label="Nischhal Raj Subba home">NRS</a><div class="mobile-nav-overlay" id="mobile-nav-overlay" hidden><nav class="mobile-nav-links" aria-label="Mobile navigation">${links(active, '')}</nav></div>`,
  };
}

const footer = `<footer class="site-footer" aria-label="Portfolio footer"><div class="container"><div class="footer-top-grid"><div class="footer-cta"><p class="eyebrow">Product designer in Nepal · Remote collaboration</p><h2>Clear product thinking, polished interfaces and practical handoff.</h2><p>Available for product design roles, focused UX/UI projects, design systems, Web3 and SaaS work, website UX and product audits.</p><a href="mailto:hinischalsubba@gmail.com" class="footer-email-btn">hinischalsubba@gmail.com</a></div><div class="footer-nav-grid"><div class="footer-col"><h3>Pages</h3><a href="/">Home</a><a href="/projects">Work</a><a href="/services">Services</a><a href="/about">About</a><a href="/blog/">Writing</a><a href="/contact">Contact</a></div><div class="footer-col"><h3>Proof</h3><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener noreferrer">Behance</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://github.com/Nischhalsubba" target="_blank" rel="noopener noreferrer">GitHub</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a></div><div class="footer-col"><h3>Services</h3><a href="/product-design-nepal">Product design</a><a href="/saas-ux-designer">SaaS UX</a><a href="/web3-ux-designer">Web3 UX</a><a href="/figma-design-systems">Design systems</a><a href="/ux-audit">UX audit</a></div></div></div><div class="footer-bottom-bar"><span>© 2026 Nischhal Raj Subba.</span><span>Based in Nepal · UTC+5:45</span><a href="/privacy">Privacy</a></div></div></footer>`;



/**
 * Function contract: stripExistingShell
 * Purpose: Remove existing shell without disturbing required surrounding ensure shared site shell repository tool state.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function stripExistingShell(html) {
  return html
    .replace(/<button\b[^>]*class=["'][^"']*mobile-nav-toggle[^"']*["'][\s\S]*?<\/button>/gi, '')
    .replace(/<a\b[^>]*class=["'][^"']*mobile-logo[^"']*["'][\s\S]*?<\/a>/gi, '')
    .replace(/<div\b[^>]*class=["'][^"']*mobile-nav-overlay[^"']*["'][\s\S]*?<\/div>/gi, '')
    .replace(/<nav\b[^>]*class=["'][^"']*nav-wrapper[^"']*["'][\s\S]*?<\/nav>/gi, '');
}



/**
 * Function contract: insertShell
 * Purpose: Implement the insert shell responsibility owned by the ensure shared site shell repository tool.
 * Inputs: `html`, `sharedShell`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function insertShell(html, sharedShell) {
  const themeToggle = /<button\b[^>]*id=["']theme-toggle["'][^>]*>[\s\S]*?<\/button>/i;
  if (themeToggle.test(html)) {
    return html.replace(themeToggle,    /** Callback contract: Perform the local callback step required by the immediately enclosing ensure shared site shell repository tool operation. Inputs: `toggle` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (toggle) => `${sharedShell.mobile}${toggle}${sharedShell.desktop}`);
  }
  if (/<main\b/i.test(html)) return html.replace(/<main\b/i, `${sharedShell.mobile}${sharedShell.desktop}<main`);
  throw new Error('Cannot insert shared shell because the page has neither a theme toggle nor a main element.');
}



/**
 * Function contract: normalizeFooter
 * Purpose: Apply footer consistently while preserving the surrounding ensure shared site shell repository tool contract.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeFooter(html) {
  const existingFooter = /<footer\b[^>]*class=["'][^"']*site-footer[^"']*["'][\s\S]*?<\/footer>/i;
  if (existingFooter.test(html)) return html.replace(existingFooter, footer);
  const closingBody = /\s*(<script\b[^>]*src=["'](?:\/script\.js|\/assets\/[^"']+\.js)[^>]*><\/script>\s*<\/body>)/i;
  if (closingBody.test(html)) return html.replace(closingBody, `\n${footer}\n$1`);
  return html.replace(/<\/body>/i, `${footer}</body>`);
}



/**
 * Function contract: normalize
 * Purpose: Apply module behavior consistently while preserving the surrounding ensure shared site shell repository tool contract.
 * Inputs: `html`, `relativeFile`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalize(html, relativeFile) {
  const sharedShell = shell(activeSection(relativeFile));
  let output = insertShell(stripExistingShell(html), sharedShell);
  output = normalizeFooter(output);
  return output
    .replace(/\(c\)\s*2026/gi, '© 2026')
    .replace(/href="\/(projects|services|about|contact)\.html"/g, 'href="/$1"')
    .replace(/href="\/(product-design-nepal|web3-ux-designer|saas-ux-designer|website-ux-design|figma-design-systems|ux-audit)\.html"/g, 'href="/$1"');
}

let changed = 0;
for (const filePath of walk(target).filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (file) => file.endsWith('.html'))) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = normalize(before, relativePath(filePath));
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`Normalized shared navigation and footer on ${changed} page(s).`);
