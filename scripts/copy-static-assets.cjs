/**
 * @fileoverview scripts/copy-static-assets.cjs
 * Purpose: Generate or assemble copy static assets deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/early-theme-bootstrap.cjs
 * - docs/build-pipeline.md
 * - docs/root-route-map.md
 * - scripts/build-dist.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Apply dir consistently while preserving the surrounding copy static assets repository tool contract.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureDir(file) { fs.mkdirSync(path.dirname(file), { recursive: true }); }
/**
 * Function contract: copyFile
 * Purpose: Implement the copy file responsibility owned by the copy static assets repository tool.
 * Inputs: `source`: source text or source object being processed; `target`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function copyFile(source, target) { if (!fs.existsSync(source)) return; ensureDir(target); fs.copyFileSync(source, target); }
/**
 * Function contract: copyText
 * Purpose: Implement the copy text responsibility owned by the copy static assets repository tool.
 * Inputs: `source`: source text or source object being processed; `target`: input consumed by this operation; `transform`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function copyText(source, target, transform = /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `value`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (value) => value) {
  if (!fs.existsSync(source)) return;
  ensureDir(target);
  fs.writeFileSync(target, transform(fs.readFileSync(source, 'utf8')), 'utf8');
}
/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the copy static assets repository tool.
 * Inputs: `dir`: input consumed by this operation; `files`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Implement the copy directory responsibility owned by the copy static assets repository tool.
 * Inputs: `source`: source text or source object being processed; `target`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function copyDirectory(source, target) {
  for (const file of walk(source)) copyFile(file, path.join(target, path.relative(source, file)));
}
/**
 * Function contract: copyPublicAssets
 * Purpose: Implement the copy public assets responsibility owned by the copy static assets repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
 * Purpose: Remove remote fonts without disturbing required surrounding copy static assets repository tool state.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function removeRemoteFonts(html) {
  return html
    .replace(/\s*<link[^>]+rel=["']preconnect["'][^>]+href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>/gi, '')
    .replace(/\s*<link[^>]+href=["']https:\/\/fonts\.googleapis\.com\/[^"']+["'][^>]*>/gi, '');
}
/**
 * Function contract: ensureSingleStylesheet
 * Purpose: Apply single stylesheet consistently while preserving the surrounding copy static assets repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function ensureSingleStylesheet(html) {
  let output = html.replace(/\s*<link[^>]+rel=["']stylesheet["'][^>]*>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: tag. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing copy static assets repository tool operation. Inputs: `tag`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `tag`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (tag) => /\/style\.css(?:\?|["'])/i.test(tag) ? tag : '');
  if (/\/style\.css/i.test(output)) output = output.replace(/\/style\.css(?:\?v=[^"']+)?/g, styleHref);
  else output = output.replace('</head>', `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
  return output;
}
/**
 * Function contract: ensureRuntime
 * Purpose: Apply runtime consistently while preserving the surrounding copy static assets repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function ensureRuntime(html) {
  const entryScriptPattern = /\s*<script\b[^>]*src=["'](?:\/script\.js(?:\?[^"']*)?|\/assets\/(?:script|main|index)[^"']*\.js)["'][^>]*><\/script>\s*/gi;
  const output = html.replace(entryScriptPattern, '\n');
  return output.replace('</body>', `  <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}
/**
 * Function contract: ensureTheme
 * Purpose: Apply theme consistently while preserving the surrounding copy static assets repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
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
/**
 * Function contract: ensureAccessibility
 * Purpose: Apply accessibility consistently while preserving the surrounding copy static assets repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
/**
 * Function contract: normalizeFrames
 * Purpose: Apply frames consistently while preserving the surrounding copy static assets repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function normalizeFrames(html) {
  return html.replace(/<iframe\b([^>]*figma\.com[^>]*)>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _match, attrs. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing copy static assets repository tool operation. Inputs: `_match`, `attrs`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `_match`, `attrs`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate/result. */ (_match, attrs) => {
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
/**
 * Function contract: optimizeHtml
 * Purpose: Implement the optimize html responsibility owned by the copy static assets repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function optimizeHtml() {
  for (const file of walk(dist).filter(/** Callback contract: Processes the callback step for walk(dist) without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (item) => item.endsWith('.html'))) {
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
/**
 * Function contract: stripRemoteFontImports
 * Purpose: Remove remote font imports without disturbing required surrounding copy static assets repository tool state.
 * Inputs: `css`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
