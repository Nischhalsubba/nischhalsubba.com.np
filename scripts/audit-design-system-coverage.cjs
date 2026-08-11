/**
 * @fileoverview scripts/audit-design-system-coverage.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for audit design system coverage.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/design-system/README.md
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const htmlFiles = [];
const ignoredDirs = new Set(['.git', 'node_modules', '.wrangler']);

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: dir.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}

/**
 * Function contract: relative
 * Purpose: Implements the relative responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function relative(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/');
}

/**
 * Function contract: stylesheetHrefs
 * Purpose: Implements the stylesheet hrefs responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function stylesheetHrefs(html) {
  return Array.from(html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)).map(/** Callback contract: Processes the callback step for array.from(html.match all(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)) without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => match[1]);
}

/**
 * Function contract: scriptSrcs
 * Purpose: Implements the script srcs responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function scriptSrcs(html) {
  return Array.from(html.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)).map(/** Callback contract: Processes the callback step for array.from(html.match all(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)) without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => match[1]);
}

/**
 * Function contract: hasRuntimeScript
 * Purpose: Implements the has runtime script responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function hasRuntimeScript(html) {
  return html.includes('/script.js') || /<script\s+[^>]*src=["']\/assets\/[^"]+\.js["'][^>]*><\/script>/i.test(html);
}

walk(targetRoot);

const issues = [];
const forbiddenCss = /(site-design-system|contact-redesign|services-redesign|services-process-redesign|seo-ui-enhancements|style-1|blog-experience)\.css/i;
const forbiddenJs = /(blog-index|site-experience|portfolio-improvements)\.js/i;
const forbiddenFontText = /(Playfair\+Display|Playfair Display|fonts\.googleapis\.com\/css2\?family=Playfair)/i;
const approvedRootScripts = new Set(['/portfolio-events.js']);

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = relative(file);
  const cssLinks = stylesheetHrefs(html);
  const scripts = scriptSrcs(html);

  if (forbiddenFontText.test(html)) issues.push(`${rel}: contains legacy Playfair font reference`);
  if (html.includes('/style.css?v=22.0') || html.includes('/style.css?v=37.0')) issues.push(`${rel}: contains stale stylesheet cache version`);

  if (cssLinks.length === 0) issues.push(`${rel}: missing stylesheet link`);
  for (const href of cssLinks) {
    if (forbiddenCss.test(href)) issues.push(`${rel}: links removed CSS file ${href}`);
    if (/fonts\.googleapis\.com\/css2/i.test(href)) issues.push(`${rel}: links external font stylesheet ${href}`);
  }

  for (const src of scripts) {
    const isAllowedRuntime = src.includes('/script.js') || /\/assets\/.+\.js$/i.test(src) || approvedRootScripts.has(src);
    if (src.startsWith('/') && src.endsWith('.js') && !isAllowedRuntime) issues.push(`${rel}: links extra website JS ${src}`);
    if (forbiddenJs.test(src)) issues.push(`${rel}: links removed website JS ${src}`);
  }

  if (!hasRuntimeScript(html)) issues.push(`${rel}: missing runtime script`);
  if (/<nav class="nav-wrapper"(?![^>]*aria-label=)/.test(html)) issues.push(`${rel}: desktop nav missing aria-label`);
  if (/<nav class="mobile-nav-links"(?![^>]*aria-label=)/.test(html)) issues.push(`${rel}: mobile nav missing aria-label`);
}

if (fs.existsSync(path.join(targetRoot, 'portfolio-events.js')) === false) {
  issues.push('approved first-party analytics runtime /portfolio-events.js is missing from build output');
}

if (issues.length > 0) {
  console.error('Design-system coverage audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${htmlFiles.length} HTML files use the single frontend stylesheet, approved font system, primary runtime, and first-party analytics runtime.`);
}
