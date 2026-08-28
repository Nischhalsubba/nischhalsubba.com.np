/**
 * @fileoverview scripts/audit-search-discovery-v31.cjs
 * Purpose: Guard the final RSS, IndexNow, and identity-link discovery contract.
 * Responsibilities:
 * - Verify every canonical page advertises the production RSS feed.
 * - Verify the homepage advertises every canonical Person `sameAs` URL with `rel=me`.
 * - Verify the RSS feed contains every canonical blog article exactly once and uses clean URLs.
 * - Verify the public IndexNow ownership file matches the configured key.
 * Execution context: Validation after the production build has completed.
 * Connected files:
 * - config/search-discovery.json
 * - config/canonical-routes.json
 * - scripts/finalize-search-discovery-v31.cjs
 * - scripts/submit-indexnow.cjs
 * Maintenance: Keep this audit aligned with the generated production discovery contract and canonical route manifest.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(root, 'config', 'search-discovery.json'), 'utf8'));
const site = config.site.replace(/\/$/, '');
const feedUrl = `${site}${config.feed.path}`;
const key = config.indexNow.key;
const keyFile = `${key}.txt`;
const errors = [];

/**
 * Function contract: attribute
 * Purpose: Read one attribute value from an HTML opening tag.
 * Inputs: `tag`, `name`.
 * Side effects: None.
 * Returns: Attribute value or an empty string.
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}

/**
 * Function contract: routeForFile
 * Purpose: Convert a canonical manifest filename into its clean public route.
 * Inputs: `file`.
 * Side effects: None.
 * Returns: Clean route beginning with `/`.
 */
function routeForFile(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\\/g, '/').replace(/\.html$/i, '')}`;
}

/**
 * Function contract: hasLink
 * Purpose: Check for an exact head link relationship and URL.
 * Inputs: `html`, `rel`, `href`.
 * Side effects: None.
 * Returns: Boolean match state.
 */
function hasLink(html, rel, href) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const relTokens = attribute(tag, 'rel').toLowerCase().split(/\s+/).filter(Boolean);
    if (relTokens.includes(rel.toLowerCase()) && attribute(tag, 'href') === href) return true;
  }
  return false;
}

/**
 * Function contract: jsonLdNodes
 * Purpose: Collect structured-data nodes and report malformed JSON-LD.
 * Inputs: `html`, `file`.
 * Side effects: Appends parse failures to `errors`.
 * Returns: Flattened JSON-LD node array.
 */
function jsonLdNodes(html, file) {
  const nodes = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1].trim());
      if (Array.isArray(data?.['@graph'])) nodes.push(...data['@graph']);
      else if (data && typeof data === 'object') nodes.push(data);
    } catch (error) {
      errors.push(`${file}: malformed JSON-LD while auditing discovery links: ${error.message}`);
    }
  }
  return nodes;
}

if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) errors.push('search-discovery.json: IndexNow key format is invalid');
if (config.indexNow.endpoint !== 'https://api.indexnow.org/indexnow') {
  errors.push(`search-discovery.json: unexpected IndexNow endpoint ${config.indexNow.endpoint || 'missing'}`);
}
if (config.feed.path !== '/feed.xml') errors.push(`search-discovery.json: feed path must remain /feed.xml, found ${config.feed.path}`);

for (const file of manifest.html) {
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`${file}: canonical route missing from audit base`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  if (!hasLink(html, 'alternate', feedUrl)) errors.push(`${file}: RSS alternate link missing`);

  if (file === 'index.html') {
    const nodes = jsonLdNodes(html, file);
    const person = nodes.find(
      /** Callback contract: Select the canonical professional Person entity. Inputs: `node` Side effects: None. Returns: `true` for the canonical Person node. */
      (node) => node?.['@type'] === 'Person' && node.name === 'Nischhal Raj Subba',
    );
    if (!person) {
      errors.push('index.html: canonical Person entity missing while auditing rel=me links');
    } else {
      const profiles = Array.isArray(person.sameAs) ? person.sameAs : [];
      for (const profile of profiles) {
        if (!hasLink(html, 'me', profile)) errors.push(`index.html: rel=me missing ${profile}`);
      }
    }
  }
}

const feedPath = path.join(base, config.feed.path.replace(/^\//, ''));
if (!fs.existsSync(feedPath)) {
  errors.push('feed.xml: missing from production output');
} else {
  const feed = fs.readFileSync(feedPath, 'utf8');
  if (!/<rss\b[^>]*version=["']2\.0["']/i.test(feed)) errors.push('feed.xml: RSS 2.0 root missing');
  if (!feed.includes(`<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`)) {
    errors.push('feed.xml: canonical self link missing');
  }
  if (/https:\/\/nischhalsubba\.com\.np\/[^<\s]*\.html(?:<|\s)/i.test(feed)) errors.push('feed.xml: exposes .html URLs');

  const feedLinks = [...feed.matchAll(/<link>(https:\/\/nischhalsubba\.com\.np[^<]*)<\/link>/gi)].map(
    /** Callback contract: Extract one URL from an RSS channel or item link match. Inputs: `match` Side effects: None. Returns: Captured absolute URL. */
    (match) => match[1],
  );
  const articleUrls = manifest.html
    .filter(
      /** Callback contract: Select canonical blog-detail routes while excluding the writing index. Inputs: `file` Side effects: None. Returns: `true` for article routes. */
      (file) => file.startsWith('blog/') && file !== 'blog/index.html',
    )
    .map(
      /** Callback contract: Convert one canonical article file into its public clean URL. Inputs: `file` Side effects: None. Returns: Absolute canonical article URL. */
      (file) => `${site}${routeForFile(file)}`,
    );
  for (const url of articleUrls) {
    const count = feedLinks.filter(
      /** Callback contract: Count RSS links that exactly match the canonical article URL under review. Inputs: `candidate` Side effects: None. Returns: `true` for an exact URL match. */
      (candidate) => candidate === url,
    ).length;
    if (count !== 1) errors.push(`feed.xml: expected one item link for ${url}, found ${count}`);
  }
}

const keyPath = path.join(base, keyFile);
if (!fs.existsSync(keyPath)) {
  errors.push(`${keyFile}: IndexNow ownership file missing`);
} else if (fs.readFileSync(keyPath, 'utf8').trim() !== key) {
  errors.push(`${keyFile}: IndexNow ownership file does not match configured key`);
}

if (errors.length) {
  console.error(`[search-discovery-v31-audit] ${errors.length} failure(s)\n${errors.map(
    /** Callback contract: Format one discovery validation failure for console output. Inputs: `error` Side effects: None. Returns: Bullet-prefixed diagnostic text. */
    (error) => `- ${error}`,
  ).join('\n')}`);
  process.exit(1);
}

console.log(`[search-discovery-v31-audit] RSS feed, ${manifest.html.length} feed links, canonical rel=me links, and IndexNow ownership passed.`);
