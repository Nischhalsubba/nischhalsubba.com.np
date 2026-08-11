/**
 * @fileoverview scripts/copy-static-assets.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for copy static assets.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/build-pipeline.md
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - docs/root-route-map.md
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
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

/**
 * Function contract: ensureDir
 * Purpose: Applies ensure dir while preserving the surrounding repository/runtime contract.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureDir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
/**
 * Function contract: copyFile
 * Purpose: Implements the copy file responsibility for this module.
 * Inputs: source, target.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function copyFile(source, target) { if (!fs.existsSync(source)) return; ensureDir(target); fs.copyFileSync(source, target); }
/**
 * Function contract: copyText
 * Purpose: Implements the copy text responsibility for this module.
 * Inputs: source, target, transform.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function copyText(source, target, transform = /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (value) => value) {
  if (!fs.existsSync(source)) return;
  ensureDir(target);
  fs.writeFileSync(target, transform(fs.readFileSync(source, 'utf8')), 'utf8');
}
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
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files); else files.push(full);
  }
  return files;
}
/**
 * Function contract: copyDirectory
 * Purpose: Implements the copy directory responsibility for this module.
 * Inputs: source, target.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function copyDirectory(source, target) {
  for (const file of walk(source)) copyFile(file, path.join(target, path.relative(source, file)));
}
/**
 * Function contract: copyPublicAssets
 * Purpose: Implements the copy public assets responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function copyPublicAssets() {
  for (const file of walk(publicDir)) {
    const relative = path.relative(publicDir, file).replaceAll(path.sep, '/');
    const extension = path.extname(file).toLowerCase();
    if (forbiddenPublicExtensions.has(extension) || forbiddenPublicFiles.has(relative)) continue;
    copyFile(file, path.join(dist, relative));
  }
}
/**
 * Function contract: removeRemoteFonts
 * Purpose: Removes or cleans remove remote fonts while keeping required outputs intact.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function removeRemoteFonts(html) {
  return html
    .replace(/\s*<link[^>]+rel=["']preconnect["'][^>]+href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>/gi, '')
    .replace(/\s*<link[^>]+href=["']https:\/\/fonts\.googleapis\.com\/[^"']+["'][^>]*>/gi, '');
}
/**
 * Function contract: ensureSingleStylesheet
 * Purpose: Applies ensure single stylesheet while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureSingleStylesheet(html) {
  let output = html.replace(/\s*<link[^>]+rel=["']stylesheet["'][^>]*>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: tag. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (tag) => /\/style\.css(?:\?|["'])/i.test(tag) ? tag : '');
  if (/\/style\.css/i.test(output)) output = output.replace(/\/style\.css(?:\?v=[^"']+)?/g, styleHref);
  else output = output.replace('</head>', `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
  return output;
}
/**
 * Function contract: ensureRuntime
 * Purpose: Applies ensure runtime while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureRuntime(html) {
  const entryScriptPattern = /\s*<script\b[^>]*src=["'](?:\/script\.js(?:\?[^"']*)?|\/assets\/(?:script|main|index)[^"']*\.js)["'][^>]*><\/script>\s*/gi;
  const output = html.replace(entryScriptPattern, '\n');
  return output.replace('</body>', `  <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}
/**
 * Function contract: ensureTheme
 * Purpose: Applies ensure theme while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureTheme(html) {
  const cleaned = html.replace(/\s*<script id="nrs-early-theme-bootstrap">[\s\S]*?<\/script>/, '');
  return cleaned.includes('</head>') ? cleaned.replace('</head>', `    ${EARLY_THEME_BOOTSTRAP}\n  </head>`) : cleaned;
}
/**
 * Function contract: ensureAccessibility
 * Purpose: Applies ensure accessibility while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureAccessibility(html) {
  if (!/<body/i.test(html) || !/<main/i.test(html)) return html;
  let output = html;
  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(output)) output = output.replace(/<main\b([^>]*)>/i, '<main id="main-content"$1>');
  if (!/class=["'][^"']*skip-link/i.test(output)) output = output.replace(/(<body\b[^>]*>)/i, '$1\n    <a class="skip-link" href="#main-content">Skip to main content</a>');
  return output;
}
/**
 * Function contract: normalizeFrames
 * Purpose: Applies normalize frames while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeFrames(html) {
  return html.replace(/<iframe\b([^>]*figma\.com[^>]*)>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _match, attrs. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (_match, attrs) => {
    let next = attrs.replace(/\sloading=["'](?:eager|lazy)["']/i, '');
    if (!/\stitle=["']/i.test(next)) next += ' title="Interactive Figma project preview"';
    if (!/\sreferrerpolicy=["']/i.test(next)) next += ' referrerpolicy="strict-origin-when-cross-origin"';
    return `<iframe${next} loading="lazy">`;
  });
}
/**
 * Function contract: optimizeHtml
 * Purpose: Implements the optimize html responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function optimizeHtml() {
  for (const file of walk(dist).filter(/** Callback contract: Processes the callback step for walk(dist) without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.endsWith('.html'))) {
    const original = fs.readFileSync(file, 'utf8');
    const updated = ensureRuntime(ensureSingleStylesheet(ensureTheme(ensureAccessibility(normalizeFrames(removeRemoteFonts(original))))));
    if (updated !== original) fs.writeFileSync(file, updated, 'utf8');
  }
}
/**
 * Function contract: stripRemoteFontImports
 * Purpose: Implements the strip remote font imports responsibility for this module.
 * Inputs: css.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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
