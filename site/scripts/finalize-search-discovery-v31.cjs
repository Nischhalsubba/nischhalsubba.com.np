/**
 * @fileoverview scripts/finalize-search-discovery-v31.cjs
 * Purpose: Publish final search-discovery assets from the fully transformed production HTML.
 * Responsibilities:
 * - Generate a deterministic RSS 2.0 feed from canonical blog routes.
 * - Publish the IndexNow ownership key at the production host root.
 * - Advertise the RSS feed from every canonical HTML page.
 * - Advertise verified professional identity URLs with `rel=me` on the canonical profile page.
 * Execution context: Final dist-only production pass after structured-data normalization.
 * Connected files:
 * - config/search-discovery.json
 * - config/canonical-routes.json
 * - scripts/finalize-seo-entity-schema-v30.cjs
 * - scripts/audit-search-discovery-v31.cjs
 * Maintenance: Keep outputs deterministic. Do not use wall-clock timestamps or submit network requests from the build.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const config = JSON.parse(fs.readFileSync(path.join(root, 'config', 'search-discovery.json'), 'utf8'));
const site = config.site.replace(/\/$/, '');
const feedUrl = `${site}${config.feed.path}`;
const indexNowKey = config.indexNow.key;
const indexNowKeyFile = `${indexNowKey}.txt`;

/**
 * Function contract: attribute
 * Purpose: Read one HTML attribute from a complete opening tag.
 * Inputs: `tag` - opening tag text; `name` - attribute name.
 * Side effects: None.
 * Returns: Attribute value or an empty string.
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}

/**
 * Function contract: metaValue
 * Purpose: Read one meta content value regardless of attribute order.
 * Inputs: `html`, `key`, `keyAttribute`.
 * Side effects: None.
 * Returns: Matching content value or an empty string.
 */
function metaValue(html, key, keyAttribute = 'property') {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (attribute(tag, keyAttribute).toLowerCase() === key.toLowerCase()) return attribute(tag, 'content');
  }
  return '';
}

/**
 * Function contract: titleValue
 * Purpose: Read the preferred human-facing article title from final HTML.
 * Inputs: `html` - final HTML document.
 * Side effects: None.
 * Returns: Open Graph title, document title, or an empty string.
 */
function titleValue(html) {
  return metaValue(html, 'og:title') || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
}

/**
 * Function contract: routeForFile
 * Purpose: Convert a canonical HTML filename into its clean public route.
 * Inputs: `file` - canonical manifest filename.
 * Side effects: None.
 * Returns: Clean route beginning with `/`.
 */
function routeForFile(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\\/g, '/').replace(/\.html$/i, '')}`;
}

/**
 * Function contract: xmlEscape
 * Purpose: Escape text for RSS XML element content.
 * Inputs: `value` - source value.
 * Side effects: None.
 * Returns: XML-safe text.
 */
function xmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Function contract: rssDate
 * Purpose: Convert an ISO-like article date to a deterministic RFC 822 date.
 * Inputs: `value` - article date string.
 * Side effects: None.
 * Returns: UTC date string or an empty string for invalid input.
 */
function rssDate(value) {
  if (!value) return '';
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? '' : date.toUTCString();
}

/**
 * Function contract: jsonLdNodes
 * Purpose: Collect every structured-data node from an HTML document.
 * Inputs: `html` - final HTML; `file` - diagnostic filename.
 * Side effects: None.
 * Returns: Flattened JSON-LD node array.
 */
function jsonLdNodes(html, file) {
  const nodes = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(match[1].trim());
    } catch (error) {
      throw new Error(`[search-discovery-v31] ${file}: malformed JSON-LD: ${error.message}`);
    }
    if (Array.isArray(data?.['@graph'])) nodes.push(...data['@graph']);
    else if (data && typeof data === 'object') nodes.push(data);
  }
  return nodes;
}

/**
 * Function contract: hasLink
 * Purpose: Test whether a link relationship and URL are already advertised in the document head.
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
 * Function contract: appendHeadLinks
 * Purpose: Insert missing discovery links before the closing head tag.
 * Inputs: `html` - complete document; `links` - link tag strings.
 * Side effects: None.
 * Returns: Updated HTML.
 */
function appendHeadLinks(html, links) {
  if (!links.length) return html;
  if (!/<\/head>/i.test(html)) throw new Error('[search-discovery-v31] HTML document has no closing head tag');
  return html.replace(/<\/head>/i, `${links.map((link) => `    ${link}`).join('\n')}\n  </head>`);
}

/**
 * Function contract: buildFeed
 * Purpose: Build a deterministic RSS 2.0 feed from final canonical blog pages.
 * Inputs: None; reads canonical routes from the configured production base.
 * Side effects: Reads final HTML files.
 * Returns: Complete RSS XML text.
 */
function buildFeed() {
  const articles = manifest.html
    .filter((file) => file.startsWith('blog/') && file !== 'blog/index.html')
    .map((file) => {
      const filePath = path.join(base, file);
      if (!fs.existsSync(filePath)) throw new Error(`[search-discovery-v31] Missing article route: ${file}`);
      const html = fs.readFileSync(filePath, 'utf8');
      const title = titleValue(html);
      const description = metaValue(html, 'description', 'name');
      const published = metaValue(html, 'article:published_time');
      const modified = metaValue(html, 'article:modified_time') || published;
      const section = metaValue(html, 'article:section');
      const url = `${site}${routeForFile(file)}`;
      if (!title) throw new Error(`[search-discovery-v31] ${file}: feed title is missing`);
      if (!description) throw new Error(`[search-discovery-v31] ${file}: feed description is missing`);
      return { title, description, published, modified, section, url };
    })
    .sort((a, b) => {
      const aTime = Date.parse(a.published || a.modified || '') || 0;
      const bTime = Date.parse(b.published || b.modified || '') || 0;
      return bTime - aTime || a.url.localeCompare(b.url);
    });

  const latest = articles
    .map((article) => article.modified || article.published)
    .filter(Boolean)
    .sort()
    .at(-1) || '';
  const lastBuildDate = rssDate(latest);

  const items = articles.map((article) => {
    const lines = [
      '    <item>',
      `      <title>${xmlEscape(article.title)}</title>`,
      `      <link>${xmlEscape(article.url)}</link>`,
      `      <guid isPermaLink="true">${xmlEscape(article.url)}</guid>`,
      `      <description>${xmlEscape(article.description)}</description>`,
    ];
    const published = rssDate(article.published);
    if (published) lines.push(`      <pubDate>${xmlEscape(published)}</pubDate>`);
    if (article.section) lines.push(`      <category>${xmlEscape(article.section)}</category>`);
    lines.push('    </item>');
    return lines.join('\n');
  }).join('\n');

  const channel = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xmlEscape(config.feed.title)}</title>`,
    `    <link>${xmlEscape(`${site}/blog/`)}</link>`,
    `    <description>${xmlEscape(config.feed.description)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />`,
  ];
  if (lastBuildDate) channel.push(`    <lastBuildDate>${xmlEscape(lastBuildDate)}</lastBuildDate>`);
  channel.push('    <generator>nischhalsubba.com.np search discovery v31</generator>');
  if (items) channel.push(items);
  channel.push('  </channel>', '</rss>', '');
  return channel.join('\n');
}

if (!/^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) {
  throw new Error('[search-discovery-v31] IndexNow key must be 8-128 letters, numbers, or dashes');
}
if (!fs.existsSync(base)) throw new Error(`[search-discovery-v31] Production base is missing: ${base}`);

for (const file of manifest.html) {
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) throw new Error(`[search-discovery-v31] Missing canonical route: ${file}`);
  let html = fs.readFileSync(filePath, 'utf8');
  const links = [];
  if (!hasLink(html, 'alternate', feedUrl)) {
    links.push(`<link rel="alternate" type="application/rss+xml" title="${config.feed.title}" href="${feedUrl}" />`);
  }

  if (file === 'index.html') {
    const nodes = jsonLdNodes(html, file);
    const person = nodes.find((node) => node?.['@type'] === 'Person' && node.name === 'Nischhal Raj Subba');
    if (!person) throw new Error('[search-discovery-v31] index.html: canonical Person entity is missing');
    const profiles = Array.isArray(person.sameAs) ? person.sameAs : [];
    if (!profiles.length) throw new Error('[search-discovery-v31] index.html: Person.sameAs is empty');
    for (const profile of profiles) {
      if (!hasLink(html, 'me', profile)) links.push(`<link rel="me" href="${profile}" />`);
    }
  }

  html = appendHeadLinks(html, links);
  fs.writeFileSync(filePath, html, 'utf8');
}

fs.writeFileSync(path.join(base, config.feed.path.replace(/^\//, '')), buildFeed(), 'utf8');
fs.writeFileSync(path.join(base, indexNowKeyFile), `${indexNowKey}\n`, 'utf8');
console.log(`[search-discovery-v31] Published RSS feed, ${indexNowKeyFile}, feed discovery, and canonical identity links.`);
