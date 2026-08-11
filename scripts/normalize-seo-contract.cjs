/**
 * @fileoverview scripts/normalize-seo-contract.cjs
 * Purpose: Apply the normalize seo contract production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Implement the route for responsibility owned by the normalize seo contract repository tool.
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
 * Function contract: escapePattern
 * Purpose: Implement the escape pattern responsibility owned by the normalize seo contract repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


/**
 * Function contract: attribute
 * Purpose: Implement the attribute responsibility owned by the normalize seo contract repository tool.
 * Inputs: `tag`, `name`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${escapePattern(name)}=["']([^"']*)["']`, 'i'))?.[1]?.trim() || '';
}



/**
 * Function contract: metaValue
 * Purpose: Implement the meta value responsibility owned by the normalize seo contract repository tool.
 * Inputs: `html`, `key`, `keyAttribute`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function metaValue(html, key, keyAttribute = 'name') {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match[0]);
  const tag = tags.find(   /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `candidate` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (candidate) => attribute(candidate, keyAttribute).toLowerCase() === key.toLowerCase());
  return tag ? attribute(tag, 'content') : '';
}



/**
 * Function contract: setMeta
 * Purpose: Synchronize meta with the requested state while preserving related normalize seo contract repository tool invariants.
 * Inputs: `html`, `key`, `value`, `keyAttribute`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function setMeta(html, key, value, keyAttribute = 'name') {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${keyAttribute}=["']${escapePattern(key)}["'])[^>]*>`, 'i');
  const safeValue = String(value).replace(/["<>]/g, '');
  const tag = `<meta ${keyAttribute}="${key}" content="${safeValue}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}



/**
 * Function contract: titleValue
 * Purpose: Implement the title value responsibility owned by the normalize seo contract repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function titleValue(html) {
  return html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || '';
}



/**
 * Function contract: conciseTitle
 * Purpose: Implement the concise title responsibility owned by the normalize seo contract repository tool.
 * Inputs: `title`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
 * Purpose: Synchronize title with the requested state while preserving related normalize seo contract repository tool invariants.
 * Inputs: `html`, `title`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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

const sitemapEntries = manifest.html.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (file) => `  <url><loc>${site}${routeFor(file)}</loc></url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
console.log(`[seo-contract] Normalized ${updated} page(s) and rebuilt sitemap with ${manifest.html.length} canonical URLs.`);
