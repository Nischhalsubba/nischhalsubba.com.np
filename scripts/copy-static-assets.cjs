const fs = require('node:fs');
const path = require('node:path');
const { EARLY_THEME_BOOTSTRAP } = require('./early-theme-bootstrap.cjs');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const publicDir = path.join(root, 'public');
const styleHref = '/style.css?v=50.0';
const scriptSrc = '/script.js?v=35.0';
const forbiddenPublicExtensions = new Set(['.html', '.css', '.js']);
const forbiddenPublicFiles = new Set(['sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt', 'ai-profile.json', 'humans.txt']);

function ensureDir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
function copyFile(source, target) { if (!fs.existsSync(source)) return; ensureDir(target); fs.copyFileSync(source, target); }
function copyText(source, target, transform = (value) => value) {
  if (!fs.existsSync(source)) return;
  ensureDir(target);
  fs.writeFileSync(target, transform(fs.readFileSync(source, 'utf8')), 'utf8');
}
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files); else files.push(full);
  }
  return files;
}
function copyDirectory(source, target) {
  for (const file of walk(source)) copyFile(file, path.join(target, path.relative(source, file)));
}
function copyPublicAssets() {
  for (const file of walk(publicDir)) {
    const relative = path.relative(publicDir, file).replaceAll(path.sep, '/');
    const extension = path.extname(file).toLowerCase();
    if (forbiddenPublicExtensions.has(extension) || forbiddenPublicFiles.has(relative)) continue;
    copyFile(file, path.join(dist, relative));
  }
}
function removeRemoteFonts(html) {
  return html
    .replace(/\s*<link[^>]+rel=["']preconnect["'][^>]+href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>/gi, '')
    .replace(/\s*<link[^>]+href=["']https:\/\/fonts\.googleapis\.com\/[^"']+["'][^>]*>/gi, '');
}
function ensureSingleStylesheet(html) {
  let output = html.replace(/\s*<link[^>]+rel=["']stylesheet["'][^>]*>/gi, (tag) => /\/style\.css(?:\?|["'])/i.test(tag) ? tag : '');
  if (/\/style\.css/i.test(output)) output = output.replace(/\/style\.css(?:\?v=[^"']+)?/g, styleHref);
  else output = output.replace('</head>', `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
  return output;
}
function ensureRuntime(html) {
  const entryScriptPattern = /\s*<script\b[^>]*src=["'](?:\/script\.js(?:\?[^"']*)?|\/assets\/(?:script|main|index)[^"']*\.js)["'][^>]*><\/script>\s*/gi;
  const output = html.replace(entryScriptPattern, '\n');
  return output.replace('</body>', `  <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}
function ensureTheme(html) {
  const cleaned = html.replace(/\s*<script id="nrs-early-theme-bootstrap">[\s\S]*?<\/script>/, '');
  return cleaned.includes('</head>') ? cleaned.replace('</head>', `    ${EARLY_THEME_BOOTSTRAP}\n  </head>`) : cleaned;
}
function ensureAccessibility(html) {
  if (!/<body/i.test(html) || !/<main/i.test(html)) return html;
  let output = html;
  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(output)) output = output.replace(/<main\b([^>]*)>/i, '<main id="main-content"$1>');
  if (!/class=["'][^"']*skip-link/i.test(output)) output = output.replace(/(<body\b[^>]*>)/i, '$1\n    <a class="skip-link" href="#main-content">Skip to main content</a>');
  return output;
}
function normalizeFrames(html) {
  return html.replace(/<iframe\b([^>]*figma\.com[^>]*)>/gi, (_match, attrs) => {
    let next = attrs.replace(/\sloading=["'](?:eager|lazy)["']/i, '');
    if (!/\stitle=["']/i.test(next)) next += ' title="Interactive Figma project preview"';
    if (!/\sreferrerpolicy=["']/i.test(next)) next += ' referrerpolicy="strict-origin-when-cross-origin"';
    return `<iframe${next} loading="lazy">`;
  });
}
function optimizeHtml() {
  for (const file of walk(dist).filter((item) => item.endsWith('.html'))) {
    const original = fs.readFileSync(file, 'utf8');
    const updated = ensureRuntime(ensureSingleStylesheet(ensureTheme(ensureAccessibility(normalizeFrames(removeRemoteFonts(original))))));
    if (updated !== original) fs.writeFileSync(file, updated, 'utf8');
  }
}
function stripRemoteFontImports(css) {
  return css.replace(/@import\s+url\(["']?https:\/\/fonts\.googleapis\.com\/[^;]+;\s*/gi, '');
}

if (!fs.existsSync(dist)) throw new Error('dist directory is missing. Run Vite before copying assets.');
copyDirectory(path.join(root, 'assets'), path.join(dist, 'assets'));
copyPublicAssets();
copyDirectory(path.join(root, 'src', 'scripts'), path.join(dist, 'src', 'scripts'));
copyFile(path.join(root, 'script.js'), path.join(dist, 'script.js'));
copyText(path.join(root, 'style.css'), path.join(dist, 'style.css'), stripRemoteFontImports);
for (const name of ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'ai-profile.json', 'humans.txt', 'site.webmanifest', '_headers', '_redirects']) copyFile(path.join(root, name), path.join(dist, name));
optimizeHtml();
console.log('Copied canonical static assets and enforced one stable production runtime entrypoint.');
