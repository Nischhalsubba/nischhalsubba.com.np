/**
 * @fileoverview scripts/seo-discovery-lib.cjs
 * Purpose: Apply the seo discovery lib production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const SITE = 'https://nischhalsubba.com.np';
const OWNED_STATIC_PATHS = new Set([
  '/assets/resume.pdf',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/ai-profile.json',
  '/humans.txt',
  '/site.webmanifest',
]);


/**
 * Function contract: loadManifest
 * Purpose: Return manifest from the supplied inputs or current seo discovery lib repository tool state.
 * Inputs: `root`
 * Side effects: reads filesystem state
 * Returns: The requested manifest; explicit early-return branches define empty/fallback behavior.
 */
function loadManifest(root) {
  return JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
}


/**
 * Function contract: routeForFile
 * Purpose: Implement the route for file responsibility owned by the seo discovery lib repository tool.
 * Inputs: `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function routeForFile(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\\/g, '/').replace(/\.html$/i, '')}`;
}



/**
 * Function contract: canonicalRouteSet
 * Purpose: Implement the canonical route set responsibility owned by the seo discovery lib repository tool.
 * Inputs: `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function canonicalRouteSet(manifest) {
  return new Set(manifest.html.map(routeForFile));
}



/**
 * Function contract: resolveRedirect
 * Purpose: Resolve redirect from the supplied inputs and current seo discovery lib repository tool context.
 * Inputs: `pathname`, `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: The requested redirect; explicit early-return branches define empty/fallback behavior.
 */
function resolveRedirect(pathname, manifest) {
  let current = pathname;
  const seen = new Set();
  while (manifest.redirects[current]) {
    if (seen.has(current)) throw new Error(`Redirect cycle detected at ${current}`);
    seen.add(current);
    current = manifest.redirects[current];
  }
  return current;
}



/**
 * Function contract: canonicalPathForPathname
 * Purpose: Implement the canonical path for pathname responsibility owned by the seo discovery lib repository tool.
 * Inputs: `pathname`, `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function canonicalPathForPathname(pathname, manifest) {
  if (!pathname.startsWith('/')) return null;
  const routes = canonicalRouteSet(manifest);
  const candidate = resolveRedirect(pathname, manifest);

  if (routes.has(candidate)) return candidate;
  if (candidate === '/index.html') return '/';
  if (candidate === '/blog/index.html') return '/blog/';

  if (/\.html$/i.test(candidate)) {
    const clean = candidate.replace(/\.html$/i, '');
    const redirectedClean = resolveRedirect(clean, manifest);
    if (routes.has(redirectedClean)) return redirectedClean;
  }

  return null;
}



/**
 * Function contract: canonicalizeOwnedUrl
 * Purpose: Implement the canonicalize owned url responsibility owned by the seo discovery lib repository tool.
 * Inputs: `value`, `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function canonicalizeOwnedUrl(value, manifest) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return { value, owned: false, known: false };
  }

  if (parsed.origin !== SITE) return { value, owned: false, known: true };
  if (OWNED_STATIC_PATHS.has(parsed.pathname)) return { value: parsed.href, owned: true, known: true };

  const canonicalPath = canonicalPathForPathname(parsed.pathname, manifest);
  if (!canonicalPath) return { value, owned: true, known: false };

  parsed.pathname = canonicalPath;
  return { value: parsed.href, owned: true, known: true };
}



/**
 * Function contract: extractOwnedUrls
 * Purpose: Convert owned urls into the structured representation consumed by the seo discovery lib repository tool.
 * Inputs: `text`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function extractOwnedUrls(text) {
  const pattern = /https:\/\/nischhalsubba\.com\.np(?:\/[A-Za-z0-9._~%!$&'()*+,;=:@/-]*)?(?:\?[A-Za-z0-9._~%!$&'()*+,;=:@/?-]*)?(?:#[A-Za-z0-9._~%!$&'()*+,;=:@/?-]*)?/g;
  return text.match(pattern) || [];
}



/**
 * Function contract: normalizeOwnedUrlsInText
 * Purpose: Apply owned urls in text consistently while preserving the surrounding seo discovery lib repository tool contract.
 * Inputs: `text`, `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeOwnedUrlsInText(text, manifest) {
  const unknown = new Set();
  let output = text;
  const urls = [...new Set(extractOwnedUrls(text))].sort(   /** Callback contract: Compare two items and return their deterministic ordering for the enclosing sort. Inputs: `a`, `b` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (a, b) => b.length - a.length);

  for (const url of urls) {
    const normalized = canonicalizeOwnedUrl(url, manifest);
    if (!normalized.known) {
      unknown.add(url);
      continue;
    }
    if (normalized.owned && normalized.value !== url) output = output.split(url).join(normalized.value);
  }

  return { output, unknown: [...unknown] };
}



/**
 * Function contract: normalizeJsonUrls
 * Purpose: Apply json urls consistently while preserving the surrounding seo discovery lib repository tool contract.
 * Inputs: `value`, `manifest`, `unknown`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeJsonUrls(value, manifest, unknown = new Set()) {
  if (Array.isArray(value)) return value.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (item) => normalizeJsonUrls(item, manifest, unknown));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[key, item]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([key, item]) => [key, normalizeJsonUrls(item, manifest, unknown)]));
  }
  if (typeof value !== 'string') return value;

  if (value.startsWith(SITE)) {
    const normalized = canonicalizeOwnedUrl(value, manifest);
    if (!normalized.known) unknown.add(value);
    return normalized.known ? normalized.value : value;
  }
  return value;
}



/**
 * Function contract: xmlEscape
 * Purpose: Implement the xml escape responsibility owned by the seo discovery lib repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}



/**
 * Function contract: buildSitemap
 * Purpose: Build sitemap from the supplied inputs in the form expected by downstream seo discovery lib repository tool consumers.
 * Inputs: `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function buildSitemap(manifest) {
  const entries = manifest.html
    .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (file) => `  <url><loc>${xmlEscape(`${SITE}${routeForFile(file)}`)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}



/**
 * Function contract: buildRobots
 * Purpose: Build robots from the supplied inputs in the form expected by downstream seo discovery lib repository tool consumers.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}



/**
 * Function contract: buildRedirectFile
 * Purpose: Build redirect file from the supplied inputs in the form expected by downstream seo discovery lib repository tool consumers.
 * Inputs: `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function buildRedirectFile(manifest) {
  const lines = [
    '# Generated from config/canonical-routes.json by scripts/generate-seo-discovery.cjs.',
    '# Do not edit this file directly. Update the manifest and regenerate instead.',
    '',
  ];
  for (const [from, to] of Object.entries(manifest.redirects)) lines.push(`${from}  ${to}  301`);
  return `${lines.join('\n')}\n`;
}



/**
 * Function contract: buildRedirectModule
 * Purpose: Build redirect module from the supplied inputs in the form expected by downstream seo discovery lib repository tool consumers.
 * Inputs: `manifest`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function buildRedirectModule(manifest) {
  const entries = Object.entries(manifest.redirects)
    .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[from, to]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([from, to]) => `  [${JSON.stringify(from)}, ${JSON.stringify(to)}],`)
    .join('\n');
  return `// Generated from config/canonical-routes.json. Do not edit by hand.\nexport const LEGACY_REDIRECTS = new Map([\n${entries}\n]);\n`;
}

module.exports = {
  SITE,
  OWNED_STATIC_PATHS,
  loadManifest,
  routeForFile,
  canonicalRouteSet,
  canonicalPathForPathname,
  canonicalizeOwnedUrl,
  extractOwnedUrls,
  normalizeOwnedUrlsInText,
  normalizeJsonUrls,
  buildSitemap,
  buildRobots,
  buildRedirectFile,
  buildRedirectModule,
};
