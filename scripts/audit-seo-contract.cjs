const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const errors = [];

const socialPages = new Map([
  ['index.html', 'home'],
  ['projects.html', 'projects'],
  ['services.html', 'services'],
  ['product-design-nepal.html', 'product-design-nepal'],
  ['saas-ux-designer.html', 'saas-ux-designer'],
  ['web3-ux-designer.html', 'web3-ux-designer'],
  ['figma-design-systems.html', 'figma-design-systems'],
  ['ux-audit.html', 'ux-audit'],
  ['website-ux-design.html', 'website-ux-design'],
  ['project-yarsha.html', 'project-yarsha'],
  ['project-mokshya.html', 'project-mokshya'],
]);

function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function attribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return tag.match(new RegExp(`\\b${escaped}=["']([^"']*)["']`, 'i'))?.[1]?.trim() || '';
}

function metaValues(html, key, keyAttribute = 'name') {
  return tags(html, 'meta')
    .filter((tag) => attribute(tag, keyAttribute).toLowerCase() === key.toLowerCase())
    .map((tag) => attribute(tag, 'content'));
}

function single(values, label, file) {
  if (values.length !== 1) errors.push(`${file}: expected one ${label}, found ${values.length}`);
  return values[0] || '';
}

function canonicalValues(html) {
  return tags(html, 'link')
    .filter((tag) => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'))
    .map((tag) => attribute(tag, 'href'));
}

function titleValues(html) {
  return [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)]
    .map((match) => match[1].replace(/\s+/g, ' ').trim());
}

function assertLength(value, minimum, maximum, label, file) {
  if (value.length < minimum || value.length > maximum) {
    errors.push(`${file}: ${label} length ${value.length} is outside ${minimum}-${maximum}`);
  }
}

function validateJsonLd(html, file, canonical) {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [index, block] of blocks.entries()) {
    try {
      const value = JSON.parse(block[1]);
      const nodes = Array.isArray(value) ? value : [value];
      for (const node of nodes) {
        if (!node || typeof node !== 'object') continue;
        if (node['@context'] && node['@context'] !== 'https://schema.org') errors.push(`${file}: JSON-LD ${index + 1} uses a non-canonical context`);
        if (typeof node.url === 'string' && !node.url.startsWith(site)) errors.push(`${file}: JSON-LD ${index + 1} URL is off-site`);
        if (typeof node.url === 'string' && node.url.endsWith('.html')) errors.push(`${file}: JSON-LD ${index + 1} URL exposes .html`);
        if (node.url === canonical || !node.url) continue;
        const normalized = node.url.replace(/#.*$/, '');
        if (normalized !== canonical && normalized !== `${site}/`) errors.push(`${file}: JSON-LD ${index + 1} URL does not match canonical`);
      }
    } catch (error) {
      errors.push(`${file}: JSON-LD ${index + 1} is invalid JSON (${error.message})`);
    }
  }
}

function validatePng(file, slug, imageUrl, widthMeta, heightMeta) {
  const expectedUrl = `${site}/assets/images/social/${slug}.png`;
  if (imageUrl !== expectedUrl) errors.push(`${file}: social image must be ${expectedUrl}`);
  if (widthMeta !== '1200' || heightMeta !== '630') errors.push(`${file}: social image metadata must declare 1200x630`);
  const imagePath = path.join(dist, 'assets', 'images', 'social', `${slug}.png`);
  if (!fs.existsSync(imagePath)) return errors.push(`${file}: generated social image is missing`);
  const png = fs.readFileSync(imagePath);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (png.length < 24 || !png.subarray(0, 8).equals(signature)) return errors.push(`${file}: social image is not a valid PNG`);
  if (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) errors.push(`${file}: PNG dimensions are not 1200x630`);
}

const canonicalUrls = [];
const seenTitles = new Map();
for (const file of manifest.html) {
  const filePath = path.join(dist, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`${file}: canonical output is missing`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const expectedCanonical = `${site}${routeFor(file)}`;
  canonicalUrls.push(expectedCanonical);

  const title = single(titleValues(html), 'title', file);
  const description = single(metaValues(html, 'description'), 'meta description', file);
  const robots = single(metaValues(html, 'robots'), 'robots meta', file);
  const canonical = single(canonicalValues(html), 'canonical link', file);
  const ogUrl = single(metaValues(html, 'og:url', 'property'), 'og:url', file);
  const ogTitle = single(metaValues(html, 'og:title', 'property'), 'og:title', file);
  const ogDescription = single(metaValues(html, 'og:description', 'property'), 'og:description', file);
  const ogImage = single(metaValues(html, 'og:image', 'property'), 'og:image', file);
  const twitterCard = single(metaValues(html, 'twitter:card'), 'twitter:card', file);
  const twitterTitle = single(metaValues(html, 'twitter:title'), 'twitter:title', file);
  const twitterDescription = single(metaValues(html, 'twitter:description'), 'twitter:description', file);
  const twitterImage = single(metaValues(html, 'twitter:image'), 'twitter:image', file);

  assertLength(title, 10, 80, 'title', file);
  assertLength(description, 50, 220, 'description', file);
  if (!robots.toLowerCase().includes('index') || !robots.toLowerCase().includes('follow')) errors.push(`${file}: robots must allow index and follow`);
  if (canonical !== expectedCanonical) errors.push(`${file}: canonical mismatch, expected ${expectedCanonical}`);
  if (canonical.endsWith('.html')) errors.push(`${file}: canonical exposes .html`);
  if (ogUrl !== canonical) errors.push(`${file}: og:url must equal canonical`);
  if (ogTitle !== title || twitterTitle !== title) errors.push(`${file}: social titles must equal document title`);
  if (ogDescription !== description || twitterDescription !== description) errors.push(`${file}: social descriptions must equal meta description`);
  if (ogImage !== twitterImage) errors.push(`${file}: Open Graph and Twitter images must match`);
  if (twitterCard !== 'summary_large_image') errors.push(`${file}: twitter:card must be summary_large_image`);
  if (!/^https:\/\/nischhalsubba\.com\.np\//.test(ogImage)) errors.push(`${file}: social image must use the production origin`);

  if (seenTitles.has(title)) errors.push(`${file}: duplicate title also used by ${seenTitles.get(title)}`);
  else if (title) seenTitles.set(title, file);

  validateJsonLd(html, file, canonical);
  if (socialPages.has(file)) {
    validatePng(
      file,
      socialPages.get(file),
      ogImage,
      single(metaValues(html, 'og:image:width', 'property'), 'og:image:width', file),
      single(metaValues(html, 'og:image:height', 'property'), 'og:image:height', file),
    );
  }
}

const sitemapPath = path.join(dist, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) errors.push('sitemap.xml is missing');
else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const entries = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
  const duplicates = entries.filter((value, index) => entries.indexOf(value) !== index);
  if (duplicates.length) errors.push(`sitemap contains duplicates: ${[...new Set(duplicates)].join(', ')}`);
  for (const url of canonicalUrls) if (!entries.includes(url)) errors.push(`sitemap is missing ${url}`);
  for (const url of entries) {
    if (!canonicalUrls.includes(url)) errors.push(`sitemap contains non-canonical URL ${url}`);
    if (url.endsWith('.html')) errors.push(`sitemap exposes .html URL ${url}`);
  }
}

if (errors.length) {
  console.error(`[seo-contract] ${errors.length} failure(s)\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`[seo-contract] ${manifest.html.length} canonical routes, structured data, sitemap and raster social previews passed.`);
