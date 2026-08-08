const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');
const runtimePath = path.join(base, 'script.js');
const start = '/* nrs-mobile-brand-singleton-v11:start */';
const end = '/* nrs-mobile-brand-singleton-v11:end */';
const marker = /\/\* nrs-mobile-brand-singleton-v\d+:start \*\/[\s\S]*?\/\* nrs-mobile-brand-singleton-v\d+:end \*\//g;
const brandMarkup = '<a id="mobile-site-brand" class="agent-mobile-brand" href="/" aria-label="Nischhal Raj Subba, home"><span class="mobile-site-brand__text">Nischhal Raj Subba</span></a>';

if (!fs.existsSync(stylePath)) throw new Error(`[mobile-brand-singleton] Missing ${stylePath}`);

const htmlFiles = [];
(function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(full);
  }
})(base);

let repaired = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('agent-portfolio') || !html.includes('mobile-nav-toggle')) continue;
  const before = html;

  html = html
    .replace(/\s*<a\b[^>]*id=["']mobile-site-brand["'][^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/\s*<a\b[^>]*class=["'][^"']*\bagent-mobile-brand\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/\s*<a\b[^>]*class=["'][^"']*\bmobile-logo\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '');

  html = html.replace(
    /(<button\b[^>]*class=["'][^"']*\bmobile-nav-toggle\b[^"']*["'][^>]*>)/i,
    `${brandMarkup}$1`,
  );

  const idCount = (html.match(/id=["']mobile-site-brand["']/g) || []).length;
  const brandCount = (html.match(/class=["'][^"']*\bagent-mobile-brand\b[^"']*["']/g) || []).length;
  if (idCount !== 1 || brandCount !== 1) {
    throw new Error(`[mobile-brand-singleton] ${path.relative(root, file)} has id=${idCount}, class=${brandCount}`);
  }
  if (/class=["'][^"']*\bmobile-logo\b[^"']*["']/i.test(html)) {
    throw new Error(`[mobile-brand-singleton] Legacy mobile-logo survived in ${path.relative(root, file)}`);
  }

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    repaired += 1;
  }
}

const css = `${start}
/* Exactly one mobile identity. This runs after every legacy header layer. */
.agent-portfolio #mobile-site-brand { display: none !important; }
.agent-portfolio .agent-mobile-brand:not(#mobile-site-brand),
.agent-portfolio .mobile-logo { display: none !important; }

@media (max-width: 1023px) {
  .agent-portfolio .nav-wrapper,
  .agent-portfolio .mobile-logo,
  .agent-portfolio .agent-mobile-brand:not(#mobile-site-brand) {
    display: none !important;
  }

  .agent-portfolio #mobile-site-brand {
    position: fixed !important;
    top: calc(env(safe-area-inset-top, 0px) + 10px) !important;
    left: max(var(--ap-gutter, 18px), env(safe-area-inset-left, 0px)) !important;
    right: auto !important;
    z-index: 2147483001 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: calc(100vw - 8.75rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
    min-height: 44px !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    isolation: isolate !important;
    background: transparent !important;
    color: var(--ap-ink) !important;
    opacity: 1 !important;
    visibility: visible !important;
    text-decoration: none !important;
    text-shadow: none !important;
    -webkit-text-fill-color: currentColor !important;
    -webkit-text-stroke: 0 transparent !important;
    filter: none !important;
    transform: none !important;
    mix-blend-mode: normal !important;
    animation: none !important;
  }

  .agent-portfolio #mobile-site-brand .mobile-site-brand__text {
    display: block !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    color: inherit !important;
    font-family: var(--ap-font-display, Arial, sans-serif) !important;
    font-size: .875rem !important;
    font-style: normal !important;
    font-weight: 750 !important;
    line-height: 1 !important;
    letter-spacing: -.02em !important;
    text-overflow: ellipsis !important;
    text-shadow: none !important;
    white-space: nowrap !important;
    -webkit-text-fill-color: currentColor !important;
    -webkit-text-stroke: 0 transparent !important;
    filter: none !important;
    transform: none !important;
    mix-blend-mode: normal !important;
    animation: none !important;
  }

  .agent-portfolio #mobile-site-brand::before,
  .agent-portfolio #mobile-site-brand::after,
  .agent-portfolio #mobile-site-brand .mobile-site-brand__text::before,
  .agent-portfolio #mobile-site-brand .mobile-site-brand__text::after {
    content: none !important;
    display: none !important;
  }

  .agent-portfolio.menu-open #mobile-site-brand {
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
}

@media (max-width: 360px) {
  .agent-portfolio #mobile-site-brand {
    max-width: calc(100vw - 8.25rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
  }
  .agent-portfolio #mobile-site-brand .mobile-site-brand__text {
    font-size: .8125rem !important;
  }
}
${end}`;

let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

if (fs.existsSync(runtimePath)) {
  const runtimeStart = '/* nrs-mobile-brand-runtime-v11:start */';
  const runtimeEnd = '/* nrs-mobile-brand-runtime-v11:end */';
  const runtimeMarker = /\/\* nrs-mobile-brand-runtime-v\d+:start \*\/[\s\S]*?\/\* nrs-mobile-brand-runtime-v\d+:end \*\//g;
  const runtime = `${runtimeStart}\n(() => {\n  const NAME = 'Nischhal Raj Subba';\n  let scheduled = false;\n  function createBrand() {\n    const toggle = document.querySelector('.mobile-nav-toggle');\n    if (!toggle) return null;\n    const brand = document.createElement('a');\n    brand.id = 'mobile-site-brand';\n    brand.className = 'agent-mobile-brand';\n    brand.href = '/';\n    brand.setAttribute('aria-label', 'Nischhal Raj Subba, home');\n    const text = document.createElement('span');\n    text.className = 'mobile-site-brand__text';\n    text.textContent = NAME;\n    brand.append(text);\n    toggle.before(brand);\n    return brand;\n  }\n  function normalizeBrand() {\n    let keeper = document.getElementById('mobile-site-brand');\n    if (!keeper) keeper = createBrand();\n    if (!keeper) return;\n    document.querySelectorAll('#mobile-site-brand, .agent-mobile-brand, .mobile-logo').forEach((node) => {\n      if (node !== keeper) node.remove();\n    });\n    if (keeper.id !== 'mobile-site-brand') keeper.id = 'mobile-site-brand';\n    if (!keeper.classList.contains('agent-mobile-brand')) keeper.classList.add('agent-mobile-brand');\n    if (keeper.getAttribute('href') !== '/') keeper.setAttribute('href', '/');\n    if (keeper.getAttribute('aria-label') !== 'Nischhal Raj Subba, home') keeper.setAttribute('aria-label', 'Nischhal Raj Subba, home');\n    let text = keeper.querySelector('.mobile-site-brand__text');\n    if (!text || keeper.children.length !== 1) {\n      text = document.createElement('span');\n      text.className = 'mobile-site-brand__text';\n      text.textContent = NAME;\n      keeper.replaceChildren(text);\n    } else if (text.textContent !== NAME) {\n      text.textContent = NAME;\n    }\n  }\n  function schedule() {\n    if (scheduled) return;\n    scheduled = true;\n    requestAnimationFrame(() => { scheduled = false; normalizeBrand(); });\n  }\n  normalizeBrand();\n  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });\n})();\n${runtimeEnd}`;
  let script = fs.readFileSync(runtimePath, 'utf8');
  script = script.replace(runtimeMarker, '').trimEnd();
  script += `\n\n${runtime}\n`;
  fs.writeFileSync(runtimePath, script, 'utf8');
}

for (const required of [
  start,
  '#mobile-site-brand',
  'text-shadow: none !important',
  'content: none !important',
]) {
  if (!style.includes(required)) throw new Error(`[mobile-brand-singleton] Missing CSS contract: ${required}`);
}

if (fs.existsSync(runtimePath)) {
  const runtimeText = fs.readFileSync(runtimePath, 'utf8');
  if (!runtimeText.includes('nrs-mobile-brand-runtime-v11:start')) {
    throw new Error('[mobile-brand-singleton] Runtime singleton guard was not appended');
  }
}

console.log(`[mobile-brand-singleton] Rebuilt one mobile brand across ${repaired} route(s), reset legacy visual effects, and added runtime deduplication.`);
