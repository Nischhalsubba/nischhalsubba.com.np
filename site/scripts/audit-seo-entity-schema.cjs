/**
 * @fileoverview scripts/audit-seo-entity-schema.cjs
 * Purpose: Guard the final structured-data contract for personal identity and published articles.
 * Responsibilities:
 * - Require the canonical Person entity to reference only verified professional profiles.
 * - Require known public name variants to resolve to the canonical professional identity.
 * - Require BlogPosting publication and modification dates to match article meta tags when those tags exist.
 * - Reject malformed JSON-LD before production deployment.
 * Execution context: Repository validation after a production build.
 * Connected files:
 * - scripts/finalize-seo-entity-schema-v30.cjs
 * - scripts/audit-final-seo.cjs
 * - config/canonical-routes.json
 * Maintenance: Keep the asserted identity, profile URLs, and article metadata synchronized with the final SEO entity normalizer.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const site = 'https://nischhalsubba.com.np';
const personId = `${site}/#nischhal-raj-subba`;
const requiredAliases = ['Nischhal Subba', 'Nischhal Raj S.'];
const requiredProfiles = [
  'https://www.linkedin.com/in/nischhal/',
  'https://www.behance.net/nischhal',
  'https://github.com/Nischhalsubba',
  'https://app.uxcel.com/ux/nischhal',
  'https://dribbble.com/Nischhal',
  'https://x.com/imnischhal',
];

/**
 * Function contract: routeFor
 * Purpose: Convert one canonical HTML filename to its clean public route.
 * Inputs: `file` - canonical manifest filename.
 * Side effects: None.
 * Returns: Clean route beginning with `/`.
 */
function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}

/**
 * Function contract: attribute
 * Purpose: Read one attribute value from an HTML opening tag.
 * Inputs: `tag` - opening tag text; `name` - attribute name.
 * Side effects: None.
 * Returns: Attribute value or an empty string.
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}

/**
 * Function contract: metaValue
 * Purpose: Read a named or property-based meta content value regardless of attribute order.
 * Inputs: `html`, `key`, `keyAttribute`.
 * Side effects: None.
 * Returns: Matching meta content or an empty string.
 */
function metaValue(html, key, keyAttribute = 'property') {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (attribute(tag, keyAttribute).toLowerCase() === key.toLowerCase()) return attribute(tag, 'content');
  }
  return '';
}

/**
 * Function contract: jsonLdNodes
 * Purpose: Parse and flatten every JSON-LD node from one HTML document.
 * Inputs: `html` - complete document; `file` - diagnostic filename.
 * Side effects: None; malformed JSON-LD throws an explicit validation error.
 * Returns: Flattened structured-data node array.
 */
function jsonLdNodes(html, file) {
  const nodes = [];
  let blocks = 0;
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    blocks += 1;
    let data;
    try {
      data = JSON.parse(match[1].trim());
    } catch (error) {
      throw new Error(`[seo-entity-audit] ${file}: malformed JSON-LD: ${error.message}`);
    }
    if (Array.isArray(data?.['@graph'])) nodes.push(...data['@graph']);
    else if (data && typeof data === 'object') nodes.push(data);
  }
  if (!blocks) throw new Error(`[seo-entity-audit] ${file}: no JSON-LD found`);
  return nodes;
}

for (const file of manifest.html) {
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) throw new Error(`[seo-entity-audit] Missing file: ${file}`);
  const html = fs.readFileSync(filePath, 'utf8');
  const route = routeFor(file);
  const nodes = jsonLdNodes(html, file);

  if (route === '/') {
    const person = nodes.find(
      /** Callback contract: Select the canonical Person by stable ID or canonical name. Inputs: `node` Side effects: None. Returns: `true` for the canonical professional Person. */
      (node) => node?.['@type'] === 'Person' && (node['@id'] === personId || node.name === 'Nischhal Raj Subba'),
    );
    if (!person) throw new Error('[seo-entity-audit] index.html: canonical Person entity missing');
    if (person.name !== 'Nischhal Raj Subba') throw new Error(`[seo-entity-audit] index.html: canonical Person name mismatch: ${person.name || 'missing'}`);
    if (person.url !== `${site}/`) throw new Error(`[seo-entity-audit] index.html: Person URL mismatch: ${person.url || 'missing'}`);
    if (person.jobTitle !== 'Senior Product Designer') throw new Error(`[seo-entity-audit] index.html: Person jobTitle mismatch: ${person.jobTitle || 'missing'}`);
    const sameAs = Array.isArray(person.sameAs) ? person.sameAs : [];
    if (sameAs.length !== requiredProfiles.length) {
      throw new Error(`[seo-entity-audit] index.html: Person.sameAs expected ${requiredProfiles.length} canonical profiles, found ${sameAs.length}`);
    }
    for (const profile of requiredProfiles) {
      if (!sameAs.includes(profile)) throw new Error(`[seo-entity-audit] index.html: Person.sameAs missing ${profile}`);
    }
    for (const profile of sameAs) {
      if (!requiredProfiles.includes(profile)) throw new Error(`[seo-entity-audit] index.html: Person.sameAs contains unapproved or stale profile URL ${profile}`);
    }
    const aliases = Array.isArray(person.alternateName) ? person.alternateName : person.alternateName ? [person.alternateName] : [];
    for (const alias of requiredAliases) {
      if (!aliases.includes(alias)) throw new Error(`[seo-entity-audit] index.html: Person.alternateName missing ${alias}`);
    }
  }

  if (route.startsWith('/blog/') && route !== '/blog/') {
    const published = metaValue(html, 'article:published_time');
    const modified = metaValue(html, 'article:modified_time');
    const posting = nodes.find(
      /** Callback contract: Select the BlogPosting structured-data node for a canonical article route. Inputs: `node` Side effects: None. Returns: `true` for BlogPosting. */
      (node) => node?.['@type'] === 'BlogPosting',
    );
    if (published && !posting) throw new Error(`[seo-entity-audit] ${file}: BlogPosting missing`);
    if (published && posting.datePublished !== published) {
      throw new Error(`[seo-entity-audit] ${file}: datePublished mismatch. Expected ${published}, found ${posting.datePublished || 'missing'}`);
    }
    if (modified && posting.dateModified !== modified) {
      throw new Error(`[seo-entity-audit] ${file}: dateModified mismatch. Expected ${modified}, found ${posting.dateModified || 'missing'}`);
    }
    if (posting && posting.author?.['@id'] !== personId) {
      throw new Error(`[seo-entity-audit] ${file}: BlogPosting author must reference ${personId}`);
    }
  }
}

console.log('[seo-entity-audit] Canonical Person identity and article structured-data contract passed.');
