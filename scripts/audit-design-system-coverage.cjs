/**
 * @fileoverview scripts/audit-design-system-coverage.cjs
 * Purpose: Validate audit design system coverage and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - docs/design-system/README.md
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const htmlFiles = [];
const ignoredDirs = new Set(['.git', 'node_modules', '.wrangler']);

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the audit design system coverage repository tool.
 * Inputs: `dir`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
 * Purpose: Implement the relative responsibility owned by the audit design system coverage repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function relative(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/');
}

/**
 * Function contract: stylesheetHrefs
 * Purpose: Implement the stylesheet hrefs responsibility owned by the audit design system coverage repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function stylesheetHrefs(html) {
  return Array.from(html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)).map(/** Callback contract: Processes the callback step for array.from(html.match all(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)) without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => match[1]);
}

/**
 * Function contract: scriptSrcs
 * Purpose: Implement the script srcs responsibility owned by the audit design system coverage repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function scriptSrcs(html) {
  return Array.from(html.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi)).map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => match[1]);
}

/**
 * Function contract: hasRuntimeScript
 * Purpose: Determine whether runtime script satisfies the condition represented by this audit design system coverage repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether runtime script satisfies the documented condition.
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
