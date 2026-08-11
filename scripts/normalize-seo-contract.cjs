/**
 * @fileoverview scripts/normalize-seo-contract.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for normalize seo contract.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const fallbackImage = `${site}/assets/images/portrait.png`;

/**
 * Function contract: routeFor
 * Purpose: Implements the route for responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}

/**
 * Function contract: escapePattern
 * Purpose: Implements the escape pattern responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Function contract: attribute
 * Purpose: Implements the attribute responsibility for this module.
 * Inputs: tag, name.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${escapePattern(name)}=["']([^"']*)["']`, 'i'))?.[1]?.trim() || '';
}

/**
 * Function contract: metaValue
 * Purpose: Implements the meta value responsibility for this module.
 * Inputs: html, key, keyAttribute.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function metaValue(html, key, keyAttribute = 'name') {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(/** Callback contract: Processes the callback step for [...html.match all(/<meta\b[^>]*>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => match[0]);
  const tag = tags.find(/** Callback contract: Processes the callback step for tags without leaking orchestration details to the caller. Inputs: candidate. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (candidate) => attribute(candidate, keyAttribute).toLowerCase() === key.toLowerCase());
  return tag ? attribute(tag, 'content') : '';
}

/**
 * Function contract: setMeta
 * Purpose: Applies set meta while preserving the surrounding repository/runtime contract.
 * Inputs: html, key, value, keyAttribute.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function setMeta(html, key, value, keyAttribute = 'name') {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${keyAttribute}=["']${escapePattern(key)}["'])[^>]*>`, 'i');
  const safeValue = String(value).replace(/["<>]/g, '');
  const tag = `<meta ${keyAttribute}="${key}" content="${safeValue}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

/**
 * Function contract: titleValue
 * Purpose: Implements the title value responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function titleValue(html) {
  return html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}

/**
 * Function contract: conciseTitle
 * Purpose: Implements the concise title responsibility for this module.
 * Inputs: title.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function conciseTitle(title) {
  if (title.length <= 80) return title;
  const primary = title.split(/\s+[|–—-]\s+/)[0].trim();
  if (primary.length >= 10 && primary.length <= 80) return primary;
  const words = title.split(/\s+/);
  let result = '';
  for (const word of words) {
    const candidate = result ? `${result} ${word}` : word;
    if (candidate.length > 76) break;
    result = candidate;
  }
  return result || title.slice(0, 76).trim();
}

/**
 * Function contract: setTitle
 * Purpose: Applies set title while preserving the surrounding repository/runtime contract.
 * Inputs: html, title.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function setTitle(html, title) {
  const safeTitle = title.replace(/[<>]/g, '');
  return /<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    : html.replace('</head>', `  <title>${safeTitle}</title>\n</head>`);
}

if (!fs.existsSync(dist)) throw new Error('dist directory is missing.');
let updated = 0;
for (const file of manifest.html) {
  const filePath = path.join(dist, file);
  if (!fs.existsSync(filePath)) throw new Error(`Missing canonical SEO page: ${file}`);
  const original = fs.readFileSync(filePath, 'utf8');
  let html = original;
  const title = conciseTitle(titleValue(html));
  const description = metaValue(html, 'description');
  const canonical = `${site}${routeFor(file)}`;
  const image = metaValue(html, 'og:image', 'property') || metaValue(html, 'twitter:image') || fallbackImage;

  html = setTitle(html, title);
  html = setMeta(html, 'robots', metaValue(html, 'robots') || 'index, follow, max-image-preview:large');
  html = setMeta(html, 'og:url', canonical, 'property');
  html = setMeta(html, 'og:type', metaValue(html, 'og:type', 'property') || (file.startsWith('blog/') || file.startsWith('project-') ? 'article' : 'website'), 'property');
  html = setMeta(html, 'og:title', title, 'property');
  html = setMeta(html, 'og:description', description, 'property');
  html = setMeta(html, 'og:image', image, 'property');
  html = setMeta(html, 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'twitter:title', title);
  html = setMeta(html, 'twitter:description', description);
  html = setMeta(html, 'twitter:image', image);

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    updated += 1;
  }
}

const sitemapEntries = manifest.html.map(/** Callback contract: Processes the callback step for manifest.html without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (file) => `  <url><loc>${site}${routeFor(file)}</loc></url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
console.log(`[seo-contract] Normalized ${updated} page(s) and rebuilt sitemap with ${manifest.html.length} canonical URLs.`);
