/**
 * @fileoverview scripts/copy-static-assets.cjs
 * Purpose: Assemble static production assets after Vite has created `dist/`, then normalize generated HTML so every route uses the same runtime, stylesheet, theme bootstrap, and accessibility baseline.
 * Responsibilities:
 * - Copy authored assets and approved public files into the production directory.
 * - Keep stable runtime and stylesheet entry URLs consistent across generated pages.
 * - Remove remote font dependencies from production HTML and CSS.
 * - Add baseline accessibility and iframe attributes without changing page content.
 * Execution context: Node.js build stage executed after Vite output exists.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/early-theme-bootstrap.cjs
 * - src/scripts/
 * - src/discovery/
 * - style.css
 * - script.js
 * Maintenance: Treat the copy allow/deny rules as part of the production contract. New public files should be added deliberately rather than copied by accident.
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
const forbiddenPublicFiles = new Set(['sitemap.xml', 'robots.txt', 'humans.txt']);

/**
 * Function contract: ensureDir
 * Purpose: Create the parent directory required for a destination file.
 * Inputs: `file` - Absolute destination file path.
 * Side effects: Creates missing directories on disk.
 * Returns: Nothing.
 */
function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

/**
 * Function contract: copyFile
 * Purpose: Copy an existing file while safely ignoring optional source files that are absent.
 * Inputs: `source` - Absolute source path; `target` - absolute destination path.
 * Side effects: Creates destination directories and writes the copied file.
 * Returns: Nothing.
 */
function copyFile(source, target) {
  if (!fs.existsSync(source)) return;
  ensureDir(target);
  fs.copyFileSync(source, target);
}

/**
 * Function contract: copyText
 * Purpose: Read a UTF-8 source file, optionally transform its contents, and write the result to the destination.
 * Inputs: `source` - Absolute source path; `target` - absolute destination path; `transform` - content transformation callback.
 * Side effects: Reads and writes filesystem state.
 * Returns: Nothing.
 */
function copyText(
  source,
  target,
  transform = /** Callback contract: Preserve text unchanged when no custom transform is supplied. Inputs: `value` Side effects: None. Returns: Original text value. */ (value) => value,
) {
  if (!fs.existsSync(source)) return;
  ensureDir(target);
  fs.writeFileSync(target, transform(fs.readFileSync(source, 'utf8')), 'utf8');
}

/**
 * Function contract: walk
 * Purpose: Recursively collect file paths beneath a directory.
 * Inputs: `dir` - Directory to inspect; `files` - accumulator used during recursion.
 * Side effects: Reads directory entries from disk.
 * Returns: Array containing every discovered file path.
 */
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/**
 * Function contract: copyDirectory
 * Purpose: Copy an entire directory tree while preserving relative paths.
 * Inputs: `source` - Source directory; `target` - destination directory.
 * Side effects: Reads the source tree and writes files under the destination tree.
 * Returns: Nothing.
 */
function copyDirectory(source, target) {
  for (const file of walk(source)) {
    copyFile(file, path.join(target, path.relative(source, file)));
  }
}

/**
 * Function contract: copyPublicAssets
 * Purpose: Copy safe non-code public assets while excluding files owned by the canonical source/build pipeline.
 * Inputs: None.
 * Side effects: Reads `public/` and writes approved files into `dist/`.
 * Returns: Nothing.
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
 * Purpose: Remove Google Fonts preconnect and stylesheet tags so production uses the repository's local typography strategy.
 * Inputs: `html` - Complete HTML document text.
 * Side effects: None.
 * Returns: HTML with remote Google Fonts tags removed.
 */
function removeRemoteFonts(html) {
  return html
    .replace(/\s*<link[^>]+rel=["']preconnect["'][^>]+href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"']*["'][^>]*>/gi, '')
    .replace(/\s*<link[^>]+href=["']https:\/\/fonts\.googleapis\.com\/[^"']+["'][^>]*>/gi, '');
}

/**
 * Function contract: ensureSingleStylesheet
 * Purpose: Keep exactly the canonical `/style.css` stylesheet reference and normalize its cache-busting version.
 * Inputs: `html` - Complete HTML document text.
 * Side effects: None.
 * Returns: HTML with one canonical production stylesheet reference.
 */
function ensureSingleStylesheet(html) {
  let output = html.replace(
    /\s*<link[^>]+rel=["']stylesheet["'][^>]*>/gi,
    /** Callback contract: Keep the canonical stylesheet tag and remove unrelated local stylesheet tags. Inputs: `tag` Side effects: None. Returns: Original tag for `/style.css`, otherwise an empty string. */
    (tag) => (/\/style\.css(?:\?|["'])/i.test(tag) ? tag : ''),
  );

  if (/\/style\.css/i.test(output)) {
    output = output.replace(/\/style\.css(?:\?v=[^"']+)?/g, styleHref);
  } else {
    output = output.replace('</head>', `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
  }
  return output;
}

/**
 * Function contract: ensureRuntime
 * Purpose: Remove duplicate or generated entry scripts and append the repository's stable browser runtime entry point.
 * Inputs: `html` - Complete HTML document text.
 * Side effects: None.
 * Returns: HTML containing one canonical module script before `</body>`.
 */
function ensureRuntime(html) {
  const entryScriptPattern = /\s*<script\b[^>]*src=["'](?:\/script\.js(?:\?[^"']*)?|\/assets\/(?:script|main|index)[^"']*\.js)["'][^>]*><\/script>\s*/gi;
  const output = html.replace(entryScriptPattern, '\n');
  return output.replace('</body>', `  <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}

/**
 * Function contract: ensureTheme
 * Purpose: Replace any stale early-theme bootstrap with the current canonical bootstrap snippet.
 * Inputs: `html` - Complete HTML document text.
 * Side effects: None.
 * Returns: HTML with one current theme bootstrap inside `<head>` when a head element exists.
 */
function ensureTheme(html) {
  const cleaned = html.replace(/\s*<script id="nrs-early-theme-bootstrap">[\s\S]*?<\/script>/, '');
  return cleaned.includes('</head>') ? cleaned.replace('</head>', `    ${EARLY_THEME_BOOTSTRAP}\n  </head>`) : cleaned;
}

/**
 * Function contract: ensureAccessibility
 * Purpose: Add a stable main-content target and skip link to pages that contain a body and main landmark.
 * Inputs: `html` - Complete HTML document text.
 * Side effects: None.
 * Returns: HTML with baseline keyboard-navigation landmarks when they were missing.
 */
function ensureAccessibility(html) {
  if (!/<body/i.test(html) || !/<main/i.test(html)) return html;

  let output = html;
  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(output)) {
    output = output.replace(/<main\b([^>]*)>/i, '<main id="main-content"$1>');
  }
  if (!/class=["'][^"']*skip-link/i.test(output)) {
    output = output.replace(/(<body\b[^>]*>)/i, '$1\n    <a class="skip-link" href="#main-content">Skip to main content</a>');
  }
  return output;
}

/**
 * Function contract: normalizeFrames
 * Purpose: Make embedded Figma frames lazy-load by default and provide missing accessibility/security attributes.
 * Inputs: `html` - Complete HTML document text.
 * Side effects: None.
 * Returns: HTML with normalized Figma iframe attributes.
 */
function normalizeFrames(html) {
  return html.replace(
    /<iframe\b([^>]*figma\.com[^>]*)>/gi,
    /** Callback contract: Normalize one matched Figma iframe without altering its URL or feature-specific attributes. Inputs: `_match`, `attrs` Side effects: None. Returns: Rebuilt iframe opening tag. */
    (_match, attrs) => {
      let next = attrs.replace(/\sloading=["'](?:eager|lazy)["']/i, '');
      if (!/\stitle=["']/i.test(next)) next += ' title="Interactive Figma project preview"';
      if (!/\sreferrerpolicy=["']/i.test(next)) next += ' referrerpolicy="strict-origin-when-cross-origin"';
      return `<iframe${next} loading="lazy">`;
    },
  );
}

/**
 * Function contract: optimizeHtml
 * Purpose: Apply the shared production HTML normalization pipeline to every generated page in `dist/`.
 * Inputs: None.
 * Side effects: Reads and may rewrite generated HTML files.
 * Returns: Nothing.
 */
function optimizeHtml() {
  for (const file of walk(dist).filter(
    /** Callback contract: Select generated HTML documents from the production tree. Inputs: `item` Side effects: None. Returns: `true` for `.html` files. */
    (item) => item.endsWith('.html'),
  )) {
    const original = fs.readFileSync(file, 'utf8');
    const updated = ensureRuntime(
      ensureSingleStylesheet(
        ensureTheme(
          ensureAccessibility(
            normalizeFrames(
              removeRemoteFonts(original),
            ),
          ),
        ),
      ),
    );
    if (updated !== original) fs.writeFileSync(file, updated, 'utf8');
  }
}

/**
 * Function contract: stripRemoteFontImports
 * Purpose: Remove Google Fonts `@import` rules from the production stylesheet copy.
 * Inputs: `css` - Stylesheet contents.
 * Side effects: None.
 * Returns: CSS without remote Google Fonts imports.
 */
function stripRemoteFontImports(css) {
  return css.replace(/@import\s+url\(["']?https:\/\/fonts\.googleapis\.com\/[^;]+;\s*/gi, '');
}

if (!fs.existsSync(dist)) {
  throw new Error('dist directory is missing. Run Vite before copying assets.');
}

copyDirectory(path.join(root, 'assets'), path.join(dist, 'assets'));
copyPublicAssets();
copyDirectory(path.join(root, 'src', 'scripts'), path.join(dist, 'src', 'scripts'));
copyFile(path.join(root, 'script.js'), path.join(dist, 'script.js'));
copyText(path.join(root, 'style.css'), path.join(dist, 'style.css'), stripRemoteFontImports);

for (const name of ['robots.txt', 'sitemap.xml', 'humans.txt', 'site.webmanifest', '_headers', '_redirects']) {
  copyFile(path.join(root, name), path.join(dist, name));
}

optimizeHtml();
console.log('Copied canonical static assets and enforced one stable production runtime entrypoint.');
