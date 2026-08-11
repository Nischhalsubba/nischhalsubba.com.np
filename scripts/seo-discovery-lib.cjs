/**
 * @fileoverview scripts/seo-discovery-lib.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for seo discovery lib.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/audit-seo-discovery.cjs
 * - scripts/generate-seo-discovery.cjs
 * - scripts/generate-social-previews.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Retrieves load manifest and returns it in the form expected by its caller.
 * Inputs: root.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function loadManifest(root) {
  return JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
}

/**
 * Function contract: routeForFile
 * Purpose: Implements the route for file responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function routeForFile(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\\/g, '/').replace(/\.html$/i, '')}`;
}

/**
 * Function contract: canonicalRouteSet
 * Purpose: Implements the canonical route set responsibility for this module.
 * Inputs: manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function canonicalRouteSet(manifest) {
  return new Set(manifest.html.map(routeForFile));
}

/**
 * Function contract: resolveRedirect
 * Purpose: Resolves resolve redirect using the current inputs and repository/runtime context.
 * Inputs: pathname, manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the canonical path for pathname responsibility for this module.
 * Inputs: pathname, manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the canonicalize owned url responsibility for this module.
 * Inputs: value, manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the extract owned urls responsibility for this module.
 * Inputs: text.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function extractOwnedUrls(text) {
  const pattern = /https:\/\/nischhalsubba\.com\.np(?:\/[A-Za-z0-9._~%!$&'()*+,;=:@/-]*)?(?:\?[A-Za-z0-9._~%!$&'()*+,;=:@/?-]*)?(?:#[A-Za-z0-9._~%!$&'()*+,;=:@/?-]*)?/g;
  return text.match(pattern) || [];
}

/**
 * Function contract: normalizeOwnedUrlsInText
 * Purpose: Applies normalize owned urls in text while preserving the surrounding repository/runtime contract.
 * Inputs: text, manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeOwnedUrlsInText(text, manifest) {
  const unknown = new Set();
  let output = text;
  const urls = [...new Set(extractOwnedUrls(text))].sort(/** Callback contract: Processes the callback step for [...new set(extract owned urls(text))] without leaking orchestration details to the caller. Inputs: a, b. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (a, b) => b.length - a.length);

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
 * Purpose: Applies normalize json urls while preserving the surrounding repository/runtime contract.
 * Inputs: value, manifest, unknown.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeJsonUrls(value, manifest, unknown = new Set()) {
  if (Array.isArray(value)) return value.map(/** Callback contract: Processes the callback step for value without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => normalizeJsonUrls(item, manifest, unknown));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(/** Callback contract: Processes the callback step for object.entries(value) without leaking orchestration details to the caller. Inputs: [key, item]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ ([key, item]) => [key, normalizeJsonUrls(item, manifest, unknown)]));
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
 * Purpose: Implements the xml escape responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Function contract: buildSitemap
 * Purpose: Creates build sitemap from the supplied inputs and repository state.
 * Inputs: manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function buildSitemap(manifest) {
  const entries = manifest.html
    .map(/** Callback contract: Processes the callback step for manifest.html without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (file) => `  <url><loc>${xmlEscape(`${SITE}${routeForFile(file)}`)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

/**
 * Function contract: buildRobots
 * Purpose: Creates build robots from the supplied inputs and repository state.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}

/**
 * Function contract: buildRedirectFile
 * Purpose: Creates build redirect file from the supplied inputs and repository state.
 * Inputs: manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Creates build redirect module from the supplied inputs and repository state.
 * Inputs: manifest.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function buildRedirectModule(manifest) {
  const entries = Object.entries(manifest.redirects)
    .map(/** Callback contract: Processes the callback step for object.entries(manifest.redirects) without leaking orchestration details to the caller. Inputs: [from, to]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ ([from, to]) => `  [${JSON.stringify(from)}, ${JSON.stringify(to)}],`)
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
