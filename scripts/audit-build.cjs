/**
 * @fileoverview scripts/audit-build.cjs
 * Purpose: Validate audit build and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - blog/index.html
 * - docs/build-pipeline.md
 * - docs/root-route-map.md
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const requiredFiles = [
  'index.html',
  'projects.html',
  'services.html',
  'about.html',
  'contact.html',
  'blog/index.html',
  'style.css',
  'script.js',
  'assets/resume.pdf',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  '_headers',
  '_redirects',
];

const retiredStylesheets = [
  'audit-remediations.css',
  'stable-layout.css',
  'final-ui-fixes.css',
  'layout-integrity.css',
];

const forbiddenHtmlMarkers = [
  'nrs-static-project-context',
  'nrs-static-related-links',
  'nrs-static-faq',
];

const forbiddenPublicAssets = [
  'seo-ui-enhancements.css',
  'site-design-system.css',
  'contact-redesign.css',
  'services-redesign.css',
  'services-process-redesign.css',
  'style-1.css',
  'assets/styles/main.css',
  'blog-index.js',
  'site-experience.js',
  'portfolio-improvements.js',
];


/**
 * Function contract: fail
 * Purpose: Implement the fail responsibility owned by the audit build repository tool.
 * Inputs: `message`
 * Side effects: emits diagnostics or changes process failure state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function fail(message) {
  console.error(`[build-audit] ${message}`);
  process.exitCode = 1;
}



/**
 * Function contract: warn
 * Purpose: Implement the warn responsibility owned by the audit build repository tool.
 * Inputs: `message`
 * Side effects: emits diagnostics or changes process failure state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function warn(message) {
  console.warn(`[build-audit] ${message}`);
}



/**
 * Function contract: walkFiles
 * Purpose: Implement the walk files responsibility owned by the audit build repository tool.
 * Inputs: `directory`, `matcher`, `files`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function walkFiles(directory, matcher, files = []) {
  if (!fs.existsSync(directory)) return files;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, matcher, files);
      continue;
    }
    if (matcher(fullPath)) files.push(fullPath);
  }

  return files;
}



/**
 * Function contract: fileContains
 * Purpose: Implement the file contains responsibility owned by the audit build repository tool.
 * Inputs: `relativePath`, `value`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function fileContains(relativePath, value) {
  const filePath = path.join(distDir, relativePath);
  return fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8').includes(value);
}



/**
 * Function contract: stylesheetHrefs
 * Purpose: Implement the stylesheet hrefs responsibility owned by the audit build repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function stylesheetHrefs(html) {
  return Array.from(
    html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi),
  ).map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match[1]);
}



/**
 * Function contract: canonicalHref
 * Purpose: Implement the canonical href responsibility owned by the audit build repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function canonicalHref(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || '';
}



/**
 * Function contract: htmlUsesAllowedRuntime
 * Purpose: Implement the html uses allowed runtime responsibility owned by the audit build repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function htmlUsesAllowedRuntime(html) {
  return html.includes('/script.js') || /<script\s+[^>]*src=["']\/assets\/[^"']+\.js["'][^>]*><\/script>/i.test(html);
}



/**
 * Function contract: hasLocalPortraitAsset
 * Purpose: Determine whether local portrait asset satisfies the condition represented by this audit build repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads filesystem state
 * Returns: Boolean indicating whether local portrait asset satisfies the documented condition.
 */
function hasLocalPortraitAsset() {
  const assetDir = path.join(distDir, 'assets', 'images');
  if (!fs.existsSync(assetDir)) return false;
  return walkFiles(
    assetDir,
       /** Callback contract: Perform the local callback step required by the immediately enclosing audit build repository tool operation. Inputs: `filePath` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (filePath) => /^portrait[-\w]*\.(png|jpg|jpeg|webp|avif|svg)$/i.test(path.basename(filePath)),
  ).length > 0;
}



/**
 * Function contract: validateResumePdf
 * Purpose: Validate resume pdf and surface actionable failures when the audit build repository tool contract is violated.
 * Inputs: `filePath`
 * Side effects: reads filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function validateResumePdf(filePath) {
  if (!fs.existsSync(filePath)) return;
  const pdf = fs.readFileSync(filePath);
  const text = pdf.toString('latin1');

  if (pdf.length < 2_000) fail('Generated resume PDF is unexpectedly small or truncated.');
  if (!text.startsWith('%PDF-')) fail('Generated resume PDF is missing a valid PDF header.');
  if (!text.trimEnd().endsWith('%%EOF')) fail('Generated resume PDF is missing the EOF marker.');
  if (!/\bxref\b/.test(text) || !/\btrailer\b/.test(text)) fail('Generated resume PDF is missing its cross-reference table or trailer.');
  if (!/\/Type\s*\/Catalog\b/.test(text) || !/\/Type\s*\/Pages\b/.test(text)) fail('Generated resume PDF is missing its catalog/pages structure.');

  const pageCount = Number(text.match(/\/Type\s*\/Pages\b[\s\S]*?\/Count\s+(\d+)/)?.[1] || 0);
  if (!Number.isInteger(pageCount) || pageCount < 1) fail('Generated resume PDF does not declare at least one page.');
  if (!text.includes('Nischhal Raj Subba')) fail('Generated resume PDF is missing the portfolio owner identity.');
}

if (!fs.existsSync(distDir)) {
  fail('dist directory does not exist. Run the build before auditing.');
} else {
  for (const relativePath of requiredFiles) {
    if (!fs.existsSync(path.join(distDir, relativePath))) {
      fail(`Missing required build output: ${relativePath}`);
    }
  }

  const headersPath = path.join(distDir, '_headers');
  if (fs.existsSync(headersPath)) {
    const headers = fs.readFileSync(headersPath, 'utf8');
    const atomicRuntimePolicy = '/*.js\n  Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate';
    if (!headers.includes(atomicRuntimePolicy)) {
      fail('Stable JavaScript module URLs must use no-store so one page load cannot mix runtime generations across deploys.');
    }
    for (const runtimePath of ['/detail-navigation.js', '/seo-enhancements.js']) {
      const expected = `${runtimePath}\n  Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`;
      if (!headers.includes(expected)) fail(`${runtimePath} must use the atomic no-store runtime cache policy.`);
    }
  }

  for (const relativePath of [...retiredStylesheets, ...forbiddenPublicAssets]) {
    if (fs.existsSync(path.join(distDir, relativePath))) {
      fail(`Retired frontend asset still exists in dist: ${relativePath}`);
    }
  }

  const indexPath = path.join(distDir, 'index.html');
  const indexHtml = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';

  for (const htmlFile of walkFiles(distDir,    /** Callback contract: Perform the local callback step required by the immediately enclosing audit build repository tool operation. Inputs: `file` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (file) => file.endsWith('.html'))) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const rel = path.relative(distDir, htmlFile).replaceAll(path.sep, '/');
    const stylesheets = stylesheetHrefs(html);

    for (const marker of forbiddenHtmlMarkers) {
      if (html.includes(marker)) fail(`Visible SEO helper marker found in ${rel}: ${marker}`);
    }

    const localStylesheets = stylesheets.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => !/^https?:\/\//i.test(href));
    if (localStylesheets.length !== 1 || !localStylesheets[0].startsWith('/style.css')) {
      fail(`${rel} must use exactly one local stylesheet: /style.css.`);
    }

    for (const retiredStylesheet of retiredStylesheets) {
      if (stylesheets.some(   /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => href.includes(retiredStylesheet))) {
        fail(`${rel} references retired stylesheet ${retiredStylesheet}.`);
      }
    }

    if (html.includes('Playfair Display') || html.includes('Playfair+Display')) {
      fail(`${rel} contains a legacy Playfair font reference.`);
    }
    if (html.includes('https://i.imgur.com/oFHdPUS.png')) {
      fail(`${rel} still depends on the external Imgur portrait.`);
    }
    if (!htmlUsesAllowedRuntime(html)) fail(`${rel} is missing the website runtime script.`);
    if (!html.includes('class="site-footer"') && !html.includes('class="floating-resume-btn"')) {
      warn(`${rel} has neither an authored footer nor the floating resume control.`);
    }

    const canonical = canonicalHref(html);
    if (canonical && canonical.endsWith('.html')) {
      fail(`${rel} uses a .html canonical URL: ${canonical}`);
    }

    if (/<iframe[^>]+figma\.com[^>]+loading=["']eager["']/i.test(html)) {
      fail(`${rel} eagerly loads a Figma embed.`);
    }
  }

  if (!hasLocalPortraitAsset()) {
    warn('No local portrait asset was detected. Pages must not fall back to a third-party portrait URL.');
  }
  if (fileContains('style.css', 'fonts.googleapis.com')) {
    fail('style.css still imports Google Fonts.');
  }

  validateResumePdf(path.join(distDir, 'assets', 'resume.pdf'));

  if (!indexHtml.includes('Product Designer')) {
    warn('Homepage does not contain the primary Product Designer positioning phrase.');
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log('[build-audit] Build output checks passed.');
