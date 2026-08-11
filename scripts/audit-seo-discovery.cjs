const fs = require('node:fs');
const path = require('node:path');
const {
  SITE,
  loadManifest,
  routeForFile,
  canonicalizeOwnedUrl,
  extractOwnedUrls,
  buildSitemap,
  buildRobots,
  buildRedirectFile,
  buildRedirectModule,
} = require('./seo-discovery-lib.cjs');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = loadManifest(root);
const errors = [];
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

function expectEqual(relativePath, expected) {
  const actual = read(path.join(root, relativePath));
  if (!actual) return errors.push(`${relativePath}: missing`);
  if (actual !== expected) errors.push(`${relativePath}: does not match generated canonical contract`);
}

expectEqual('sitemap.xml', buildSitemap(manifest));
expectEqual('robots.txt', buildRobots());
expectEqual('public/_redirects', buildRedirectFile(manifest));
expectEqual('src/generated/legacy-redirects.js', buildRedirectModule(manifest));

const sitemap = read(path.join(root, 'sitemap.xml'));
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
const expectedUrls = manifest.html.map((file) => `${SITE}${routeForFile(file)}`);
if (sitemapUrls.length !== expectedUrls.length) errors.push(`sitemap: expected ${expectedUrls.length} URLs, found ${sitemapUrls.length}`);
for (const url of expectedUrls) if (!sitemapUrls.includes(url)) errors.push(`sitemap: missing ${url}`);
if (/<lastmod>|llms\.txt|llms-full\.txt|ai-profile\.json|humans\.txt/i.test(sitemap)) errors.push('sitemap: contains unverified dates or machine-only resources');
if (sitemapUrls.some((url) => url.endsWith('.html'))) errors.push('sitemap: exposes .html URLs');

const robots = read(path.join(root, 'robots.txt'));
if (/^AI-Profile:|^LLMs:/mi.test(robots)) errors.push('robots.txt: contains non-standard custom directives');

for (const relativePath of ['llms.txt', 'llms-full.txt', 'ai-profile.json']) {
  const source = read(path.join(root, relativePath));
  if (!source) {
    errors.push(`${relativePath}: missing`);
    continue;
  }
  if (relativePath.endsWith('.json')) {
    try { JSON.parse(source); } catch (error) { errors.push(`${relativePath}: invalid JSON (${error.message})`); }
  }
  for (const url of extractOwnedUrls(source)) {
    const normalized = canonicalizeOwnedUrl(url, manifest);
    if (!normalized.known) errors.push(`${relativePath}: references unknown owned URL ${url}`);
    if (normalized.known && normalized.owned && normalized.value !== url) errors.push(`${relativePath}: non-canonical owned URL ${url}`);
  }
}

if (fs.existsSync(path.join(root, 'public', 'nischhal-raj-subba.html'))) errors.push('entity: duplicate /nischhal-raj-subba source exists; homepage must remain canonical');

const headers = read(path.join(root, '_headers'));
for (const route of ['/assets/resume.pdf', '/llms.txt', '/llms-full.txt', '/ai-profile.json']) {
  const block = headers.match(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n([\\s\\S]*?)(?=\\n\\S|$)`))?.[1] || '';
  if (!/X-Robots-Tag:\s*noindex/i.test(block)) errors.push(`_headers: ${route} must send X-Robots-Tag: noindex`);
}
for (const broadTarget of ['/*', '/*.html', '/style.css']) {
  const broadBlock = headers.match(new RegExp(`${broadTarget.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n([\\s\\S]*?)(?=\\n\\S|$)`))?.[1] || '';
  if (/Cache-Control:\s*no-store|Cache-Control:\s*no-cache/i.test(broadBlock)) errors.push(`_headers: ${broadTarget} must not use blanket no-store/no-cache`);
}
const runtimePolicy = 'Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate';
for (const runtimeTarget of ['/*.js', '/detail-navigation.js', '/seo-enhancements.js']) {
  if (!headers.includes(`${runtimeTarget}\n  ${runtimePolicy}`)) errors.push(`_headers: ${runtimeTarget} must preserve the atomic stable-runtime cache policy`);
}

const wrangler = read(path.join(root, 'wrangler.jsonc'));
if (!/"html_handling"\s*:\s*"auto-trailing-slash"/.test(wrangler)) errors.push('wrangler.jsonc: clean HTML handling is not explicit');

if (fs.existsSync(dist)) {
  for (const file of manifest.html) {
    const htmlPath = path.join(dist, file);
    if (!fs.existsSync(htmlPath)) continue;
    const html = read(htmlPath);
    const ogImage = html.match(/<meta\b(?=[^>]*property=["']og:image["'])[^>]*content=["']([^"']+)["'][^>]*>/i)?.[1] || '';
    const twitterImage = html.match(/<meta\b(?=[^>]*name=["']twitter:image["'])[^>]*content=["']([^"']+)["'][^>]*>/i)?.[1] || '';
    if (ogImage !== twitterImage || !ogImage.includes('/assets/social/')) errors.push(`${file}: social images are not synchronized generated PNGs`);
    if (!/twitter:card["'][^>]*content=["']summary_large_image/i.test(html) && !/content=["']summary_large_image["'][^>]*name=["']twitter:card/i.test(html)) errors.push(`${file}: twitter card is not summary_large_image`);
    if (ogImage.startsWith(SITE)) {
      const imagePath = path.join(dist, new URL(ogImage).pathname.replace(/^\//, ''));
      if (!fs.existsSync(imagePath)) errors.push(`${file}: generated social image is missing`);
      else {
        const png = fs.readFileSync(imagePath);
        if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') errors.push(`${file}: social image is not PNG`);
        else if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) errors.push(`${file}: social image is not 1200x630`);
      }
    }
  }
}

if (errors.length) {
  console.error(`[seo-discovery-audit] ${errors.length} failure(s)\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`[seo-discovery-audit] ${manifest.html.length} canonical routes, AI files, redirects, headers, clean URLs, and social previews passed.`);
