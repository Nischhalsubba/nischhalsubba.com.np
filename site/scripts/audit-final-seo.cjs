/**
 * @fileoverview scripts/audit-final-seo.cjs
 * Purpose: Validate audit final seo and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const site = 'https://nischhalsubba.com.np';

const required = {
  'index.html': {
    canonical: `${site}/`,
    titleMustInclude: ['Nischhal Raj Subba', 'Senior Product Designer'],
    descriptionMustInclude: ['Senior product designer', 'Kathmandu', 'SaaS'],
    robotsMustInclude: ['index', 'follow'],
  },
  'product-design-nepal.html': {
    canonical: `${site}/product-design-nepal`,
    titleMustInclude: ['Product Designer in Nepal', 'Software Teams'],
    descriptionMustInclude: ['Product design support from Kathmandu', 'software teams', 'build-ready handoff'],
    robotsMustInclude: ['index', 'follow'],
  },
  'services.html': {
    canonical: `${site}/services`,
    titleMustInclude: ['Product Design Services'],
    descriptionMustInclude: ['Product design support', 'developer-ready handoff'],
    robotsMustInclude: ['index', 'follow'],
  },
  'about.html': {
    canonical: `${site}/about`,
    robotsMustInclude: ['index', 'follow'],
  },
  'projects.html': {
    canonical: `${site}/projects`,
    robotsMustInclude: ['index', 'follow'],
  },
  'contact.html': {
    canonical: `${site}/contact`,
    robotsMustInclude: ['index', 'follow'],
  },
  'blog/index.html': {
    canonical: `${site}/blog/`,
    robotsMustInclude: ['index', 'follow'],
  },
};

const retiredOutputs = ['home.html', 'home-v2.html', 'blog.html'];



/**
 * Function contract: read
 * Purpose: Return module behavior from the supplied inputs or current audit final seo repository tool state.
 * Inputs: `file`
 * Side effects: reads filesystem state
 * Returns: The requested module behavior; explicit early-return branches define empty/fallback behavior.
 */
function read(file) {
  const full = path.join(targetRoot, file);
  if (!fs.existsSync(full)) throw new Error(`[seo-audit] Missing file: ${file}`);
  return fs.readFileSync(full, 'utf8');
}



/**
 * Function contract: titleOf
 * Purpose: Implement the title of responsibility owned by the audit final seo repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function titleOf(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
}



/**
 * Function contract: metaOf
 * Purpose: Implement the meta of responsibility owned by the audit final seo repository tool.
 * Inputs: `html`, `name`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function metaOf(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<meta\\s+[^>]*name=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i'))?.[1]?.trim() || '';
}


/**
 * Function contract: canonicalOf
 * Purpose: Implement the canonical of responsibility owned by the audit final seo repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function canonicalOf(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]?.trim() || '';
}


/**
 * Function contract: assertContains
 * Purpose: Implement the assert contains responsibility owned by the audit final seo repository tool.
 * Inputs: `label`, `value`, `parts`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function assertContains(label, value, parts) {
  for (const part of parts || []) {
    if (!value.toLowerCase().includes(part.toLowerCase())) {
      throw new Error(`[seo-audit] ${label} must include "${part}". Found: ${value}`);
    }
  }
}

for (const retired of retiredOutputs) {
  if (fs.existsSync(path.join(targetRoot, retired))) {
    throw new Error(`[seo-audit] Retired production output must not exist: ${retired}`);
  }
}

for (const [file, rule] of Object.entries(required)) {
  const html = read(file);
  const title = titleOf(html);
  const description = metaOf(html, 'description');
  const robots = metaOf(html, 'robots');
  const canonical = canonicalOf(html);

  if (rule.canonical && canonical !== rule.canonical) throw new Error(`[seo-audit] ${file} canonical mismatch. Expected ${rule.canonical}, found ${canonical}`);
  if (canonical.endsWith('.html')) throw new Error(`[seo-audit] ${file} uses an HTML filename as its canonical URL.`);
  assertContains(`${file} robots`, robots, rule.robotsMustInclude);
  assertContains(`${file} title`, title, rule.titleMustInclude);
  assertContains(`${file} description`, description, rule.descriptionMustInclude);
}

const homepage = read('index.html');
const service = read('product-design-nepal.html');
if (titleOf(homepage) === titleOf(service)) throw new Error('[seo-audit] Homepage and product-design-nepal title must not match.');
if (metaOf(homepage, 'description') === metaOf(service, 'description')) throw new Error('[seo-audit] Homepage and product-design-nepal description must not match.');

const sitemap = read('sitemap.xml');
for (const bad of [
  `${site}/home.html`,
  `${site}/home-v2.html`,
  `${site}/blog.html`,
  `${site}/projects.html`,
  `${site}/services.html`,
  `${site}/about.html`,
  `${site}/contact.html`,
]) {
  if (sitemap.includes(bad)) throw new Error(`[seo-audit] Sitemap must not include non-canonical URL: ${bad}`);
}

const redirects = read('_redirects');
for (const cleanRoute of ['/projects', '/services', '/about', '/contact']) {
  const reverseRule = new RegExp(`^${cleanRoute.replace('/', '\\/')}\\s+${cleanRoute.replace('/', '\\/')}\\.html\\s+`, 'm');
  if (reverseRule.test(redirects)) throw new Error(`[seo-audit] Clean route ${cleanRoute} must not redirect to an HTML filename.`);
}

console.log('[seo-audit] Final metadata, clean canonicals, robots, sitemap and redirect contract passed.');
