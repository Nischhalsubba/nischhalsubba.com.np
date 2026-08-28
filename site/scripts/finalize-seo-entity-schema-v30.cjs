/**
 * @fileoverview scripts/finalize-seo-entity-schema-v30.cjs
 * Purpose: Enrich the final production JSON-LD after all page-level SEO transforms have run.
 * Responsibilities:
 * - Preserve article publication and modification dates from Open Graph article metadata in BlogPosting schema.
 * - Keep the canonical Person entity connected to verified professional profiles.
 * - Reconcile known public name variants to the canonical professional identity.
 * - Fail explicitly if final structured data cannot be patched as expected.
 * Execution context: Final dist-only SEO pass during the production build.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/ensure-human-seo-v2.cjs
 * - scripts/ensure-search-identity-final.cjs
 * - scripts/audit-seo-entity-schema.cjs
 * - config/canonical-routes.json
 * Maintenance: Run this after all transforms that replace JSON-LD and before build metadata is written.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const site = 'https://nischhalsubba.com.np';
const personId = `${site}/#nischhal-raj-subba`;
const identityAliases = ['Nischhal Subba', 'Nischhal Raj S.'];
const verifiedProfiles = [
  'https://www.linkedin.com/in/nischhal/',
  'https://www.behance.net/nischhal',
  'https://github.com/Nischhalsubba',
  'https://app.uxcel.com/ux/nischhal',
  'https://dribbble.com/Nischhal',
  'https://x.com/imnischhal',
];

function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}

function metaValue(html, key, keyAttribute = 'property') {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (attribute(tag, keyAttribute).toLowerCase() === key.toLowerCase()) return attribute(tag, 'content');
  }
  return '';
}

function graphNodes(data) {
  if (Array.isArray(data?.['@graph'])) return data['@graph'];
  if (data && typeof data === 'object') return [data];
  return [];
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function patchJsonLd(html, route) {
  const published = metaValue(html, 'article:published_time');
  const modified = metaValue(html, 'article:modified_time');
  const section = metaValue(html, 'article:section');
  let personPatched = false;
  let articlePatched = false;

  const nextHtml = html.replace(/<script\b([^>]*)type=["']application\/ld\+json["']([^>]*)>([\s\S]*?)<\/script>/gi, (whole, before, after, raw) => {
    try {
      const data = JSON.parse(raw.trim());
      for (const node of graphNodes(data)) {
        const type = node?.['@type'];
        if (type === 'Person' && (node['@id'] === personId || node.name === 'Nischhal Raj Subba')) {
          node['@id'] = node['@id'] || personId;
          node.name = 'Nischhal Raj Subba';
          node.url = `${site}/`;
          node.jobTitle = 'Senior Product Designer';
          node.alternateName = [...new Set([...asArray(node.alternateName), ...identityAliases])];
          node.sameAs = [...verifiedProfiles];
          personPatched = true;
        }
        if (route.startsWith('/blog/') && route !== '/blog/' && type === 'BlogPosting') {
          if (published) node.datePublished = published;
          if (modified) node.dateModified = modified;
          if (section) node.articleSection = section;
          node.publisher = { '@id': personId };
          articlePatched = true;
        }
      }
      return `<script${before}type="application/ld+json"${after}>${JSON.stringify(data)}</script>`;
    } catch {
      return whole;
    }
  });

  return { html: nextHtml, personPatched, articlePatched, published, modified };
}

const failures = [];
let updated = 0;

for (const file of manifest.html) {
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) {
    failures.push(`${file}: missing production route`);
    continue;
  }

  const route = routeFor(file);
  const source = fs.readFileSync(filePath, 'utf8');
  const result = patchJsonLd(source, route);

  if (route === '/' && !result.personPatched) failures.push(`${file}: canonical Person entity was not found`);
  if (route.startsWith('/blog/') && route !== '/blog/' && result.published && !result.articlePatched) {
    failures.push(`${file}: BlogPosting entity was not found for published article`);
  }

  fs.writeFileSync(filePath, result.html, 'utf8');
  updated += 1;
}

if (failures.length) throw new Error(`[seo-entity-schema-v30] ${failures.join('; ')}`);
console.log(`[seo-entity-schema-v30] Enriched Person identity and article dates across ${updated} production route(s).`);
