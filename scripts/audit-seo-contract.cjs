/**
 * @fileoverview scripts/audit-seo-contract.cjs
 * Purpose: Validate audit seo contract and fail with actionable diagnostics when the production contract is violated.
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

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const errors = [];


/**
 * Function contract: routeFor
 * Purpose: Implement the route for responsibility owned by the audit seo contract repository tool.
 * Inputs: `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}



/**
 * Function contract: tags
 * Purpose: Implement the tags responsibility owned by the audit seo contract repository tool.
 * Inputs: `html`, `name`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match[0]);
}



/**
 * Function contract: attribute
 * Purpose: Implement the attribute responsibility owned by the audit seo contract repository tool.
 * Inputs: `tag`, `name`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function attribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return tag.match(new RegExp(`\\b${escaped}=["']([^"']*)["']`, 'i'))?.[1]?.trim() || '';
}



/**
 * Function contract: metaValues
 * Purpose: Implement the meta values responsibility owned by the audit seo contract repository tool.
 * Inputs: `html`, `key`, `keyAttribute`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function metaValues(html, key, keyAttribute = 'name') {
  return tags(html, 'meta')
    .filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `tag` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (tag) => attribute(tag, keyAttribute).toLowerCase() === key.toLowerCase())
    .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `tag` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (tag) => attribute(tag, 'content'));
}



/**
 * Function contract: single
 * Purpose: Implement the single responsibility owned by the audit seo contract repository tool.
 * Inputs: `values`, `label`, `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function single(values, label, file) {
  if (values.length !== 1) errors.push(`${file}: expected one ${label}, found ${values.length}`);
  return values[0] || '';
}



/**
 * Function contract: canonicalValues
 * Purpose: Implement the canonical values responsibility owned by the audit seo contract repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function canonicalValues(html) {
  return tags(html, 'link')
    .filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `tag` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (tag) => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'))
    .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `tag` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (tag) => attribute(tag, 'href'));
}



/**
 * Function contract: titleValues
 * Purpose: Implement the title values responsibility owned by the audit seo contract repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function titleValues(html) {
  return [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)]
    .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match[1].replace(/\s+/g, ' ').trim());
}



/**
 * Function contract: assertLength
 * Purpose: Implement the assert length responsibility owned by the audit seo contract repository tool.
 * Inputs: `value`, `minimum`, `maximum`, `label`, `file`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function assertLength(value, minimum, maximum, label, file) {
  if (value.length < minimum || value.length > maximum) {
    errors.push(`${file}: ${label} length ${value.length} is outside ${minimum}-${maximum}`);
  }
}



/**
 * Function contract: validateJsonLd
 * Purpose: Validate json ld and surface actionable failures when the audit seo contract repository tool contract is violated.
 * Inputs: `html`, `file`, `canonical`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
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



/**
 * Function contract: validateSocialImage
 * Purpose: Validate social image and surface actionable failures when the audit seo contract repository tool contract is violated.
 * Inputs: `file`, `imageUrl`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function validateSocialImage(file, imageUrl) {
  if (!imageUrl) return errors.push(`${file}: social image is missing`);

  let parsed;
  try {
    parsed = new URL(imageUrl);
  } catch {
    return errors.push(`${file}: social image URL is invalid`);
  }

  if (parsed.origin !== site) return errors.push(`${file}: social image must use the production origin`);
  if (/^\/assets\/images\/social\//i.test(parsed.pathname)) {
    errors.push(`${file}: social image still points to the retired synthetic preview-card directory`);
    return;
  }

  const relative = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');
  const imagePath = path.join(dist, relative);
  if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) {
    errors.push(`${file}: social image does not resolve to a built file (${parsed.pathname})`);
    return;
  }
  if (fs.statSync(imagePath).size === 0) errors.push(`${file}: social image file is empty`);
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

  if (seenTitles.has(title)) errors.push(`${file}: duplicate title also used by ${seenTitles.get(title)}`);
  else if (title) seenTitles.set(title, file);

  validateJsonLd(html, file, canonical);
  validateSocialImage(file, ogImage);
}

const retiredSocialDirectory = path.join(dist, 'assets', 'images', 'social');
if (fs.existsSync(retiredSocialDirectory)) errors.push('retired synthetic social preview directory must not be present in dist');

const sitemapPath = path.join(dist, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) errors.push('sitemap.xml is missing');
else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const entries = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match[1].trim());
  const duplicates = entries.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `value`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (value, index) => entries.indexOf(value) !== index);
  if (duplicates.length) errors.push(`sitemap contains duplicates: ${[...new Set(duplicates)].join(', ')}`);
  for (const url of canonicalUrls) if (!entries.includes(url)) errors.push(`sitemap is missing ${url}`);
  for (const url of entries) {
    if (!canonicalUrls.includes(url)) errors.push(`sitemap contains non-canonical URL ${url}`);
    if (url.endsWith('.html')) errors.push(`sitemap exposes .html URL ${url}`);
  }
}

if (errors.length) {
  console.error(`[seo-contract] ${errors.length} failure(s)\n${errors.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `error` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`[seo-contract] ${manifest.html.length} canonical routes, structured data, sitemap and real social imagery passed.`);
