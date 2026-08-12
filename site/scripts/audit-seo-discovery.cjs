/**
 * @fileoverview scripts/audit-seo-discovery.cjs
 * Purpose: Verify that canonical routes, crawler files, redirects, headers, and social preview assets agree with the production SEO contract.
 * Responsibilities:
 * - Compare generated discovery files with the canonical route manifest.
 * - Reject stale, non-canonical, or accidental HTML URLs in the sitemap.
 * - Verify cache and indexing headers for stable runtime and non-page resources.
 * - Validate generated social preview image references when a production build exists.
 * Execution context: Node.js quality check used by `npm run audit:seo-discovery` and the full validation pipeline.
 * Connected files:
 * - config/canonical-routes.json
 * - scripts/seo-discovery-lib.cjs
 * - src/discovery/_headers
 * - wrangler.jsonc
 * Maintenance: Keep these checks aligned with the public routing and deployment contracts. Add a rule only when the corresponding production behavior is intentional and testable.
 */
const fs = require('node:fs');
const path = require('node:path');
const {
  SITE,
  loadManifest,
  routeForFile,
  buildSitemap,
  buildRobots,
  buildRedirectFile,
  buildRedirectModule,
} = require('./seo-discovery-lib.cjs');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = loadManifest(root);
const errors = [];

/**
 * Function contract: read
 * Purpose: Read a UTF-8 file when it exists and return an empty string for an absent optional file.
 * Inputs: `file` - Absolute file path.
 * Side effects: Reads filesystem state.
 * Returns: File contents or an empty string when the path does not exist.
 */
const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '');

/**
 * Function contract: expectEqual
 * Purpose: Compare a repository file with the deterministic content expected from the current route manifest.
 * Inputs: `relativePath` - Repository-relative file path; `expected` - expected complete file contents.
 * Side effects: Reads filesystem state and appends validation messages to `errors`.
 * Returns: Nothing.
 */
function expectEqual(relativePath, expected) {
  const actual = read(path.join(root, relativePath));
  if (!actual) {
    errors.push(`${relativePath}: missing`);
    return;
  }
  if (actual !== expected) errors.push(`${relativePath}: does not match generated canonical contract`);
}

expectEqual('sitemap.xml', buildSitemap(manifest));
expectEqual('robots.txt', buildRobots());
expectEqual('public/_redirects', buildRedirectFile(manifest));
expectEqual('src/generated/legacy-redirects.js', buildRedirectModule(manifest));

const sitemap = read(path.join(root, 'sitemap.xml'));
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  /** Callback contract: Extract the URL captured from a sitemap `<loc>` element. Inputs: `match` Side effects: None. Returns: Captured URL string. */
  (match) => match[1],
);
const expectedUrls = manifest.html.map(
  /** Callback contract: Convert a canonical HTML source filename into its public clean URL. Inputs: `file` Side effects: None. Returns: Absolute canonical URL. */
  (file) => `${SITE}${routeForFile(file)}`,
);

if (sitemapUrls.length !== expectedUrls.length) {
  errors.push(`sitemap: expected ${expectedUrls.length} URLs, found ${sitemapUrls.length}`);
}
for (const url of expectedUrls) {
  if (!sitemapUrls.includes(url)) errors.push(`sitemap: missing ${url}`);
}
if (/<lastmod>|humans\.txt|site\.webmanifest/i.test(sitemap)) {
  errors.push('sitemap: contains unverified dates or non-page resources');
}
if (sitemapUrls.some(
  /** Callback contract: Detect public sitemap entries that expose build-time `.html` filenames. Inputs: `url` Side effects: None. Returns: `true` when the URL ends in `.html`. */
  (url) => url.endsWith('.html'),
)) {
  errors.push('sitemap: exposes .html URLs');
}

if (fs.existsSync(path.join(root, 'public', 'nischhal-raj-subba.html'))) {
  errors.push('entity: duplicate /nischhal-raj-subba source exists; homepage must remain canonical');
}

const headers = read(path.join(root, '_headers'));
for (const route of ['/assets/resume.pdf', '/humans.txt']) {
  const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = headers.match(new RegExp(`${escapedRoute}\\n([\\s\\S]*?)(?=\\n\\S|$)`))?.[1] || '';
  if (!/X-Robots-Tag:\s*noindex/i.test(block)) errors.push(`_headers: ${route} must send X-Robots-Tag: noindex`);
}

for (const broadTarget of ['/*', '/*.html', '/style.css']) {
  const escapedTarget = broadTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const broadBlock = headers.match(new RegExp(`${escapedTarget}\\n([\\s\\S]*?)(?=\\n\\S|$)`))?.[1] || '';
  if (/Cache-Control:\s*no-store|Cache-Control:\s*no-cache/i.test(broadBlock)) {
    errors.push(`_headers: ${broadTarget} must not use blanket no-store/no-cache`);
  }
}

const runtimePolicy = 'Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate';
for (const runtimeTarget of ['/*.js', '/detail-navigation.js', '/seo-enhancements.js']) {
  if (!headers.includes(`${runtimeTarget}\n  ${runtimePolicy}`)) {
    errors.push(`_headers: ${runtimeTarget} must preserve the stable-runtime cache policy`);
  }
}

const wrangler = read(path.join(root, 'wrangler.jsonc'));
if (!/"html_handling"\s*:\s*"auto-trailing-slash"/.test(wrangler)) {
  errors.push('wrangler.jsonc: clean HTML handling is not explicit');
}

if (fs.existsSync(dist)) {
  for (const file of manifest.html) {
    const htmlPath = path.join(dist, file);
    if (!fs.existsSync(htmlPath)) continue;

    const html = read(htmlPath);
    const ogImage = html.match(/<meta\b(?=[^>]*property=["']og:image["'])[^>]*content=["']([^"']+)["'][^>]*>/i)?.[1] || '';
    const twitterImage = html.match(/<meta\b(?=[^>]*name=["']twitter:image["'])[^>]*content=["']([^"']+)["'][^>]*>/i)?.[1] || '';

    if (ogImage !== twitterImage || !ogImage.includes('/assets/social/')) {
      errors.push(`${file}: social images are not synchronized generated PNGs`);
    }
    if (!/twitter:card["'][^>]*content=["']summary_large_image/i.test(html) && !/content=["']summary_large_image["'][^>]*name=["']twitter:card/i.test(html)) {
      errors.push(`${file}: twitter card is not summary_large_image`);
    }

    if (ogImage.startsWith(SITE)) {
      const imagePath = path.join(dist, new URL(ogImage).pathname.replace(/^\//, ''));
      if (!fs.existsSync(imagePath)) {
        errors.push(`${file}: generated social image is missing`);
        continue;
      }

      const png = fs.readFileSync(imagePath);
      if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
        errors.push(`${file}: social image is not PNG`);
      } else if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
        errors.push(`${file}: social image is not 1200x630`);
      }
    }
  }
}

if (errors.length) {
  console.error(`[seo-discovery-audit] ${errors.length} failure(s)\n${errors.map(
    /** Callback contract: Format one validation failure for readable console output. Inputs: `error` Side effects: None. Returns: A bullet-prefixed message. */
    (error) => `- ${error}`,
  ).join('\n')}`);
  process.exit(1);
}

console.log(`[seo-discovery-audit] ${manifest.html.length} canonical routes, redirects, headers, clean URLs, and social previews passed.`);
