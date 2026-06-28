const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const site = 'https://nischhalsubba.com.np';

const required = {
  'index.html': {
    canonical: `${site}/`,
    titleMustInclude: ['Nischhal Raj Subba', 'UX/UI Product Designer'],
    descriptionMustInclude: ['Portfolio', 'Nepal-based'],
    robots: 'index, follow',
  },
  'product-design-nepal.html': {
    canonical: `${site}/product-design-nepal.html`,
    titleMustInclude: ['UX/UI Product Design Services', 'Nepal'],
    descriptionMustInclude: ['service page', 'startups', 'software teams'],
    robots: 'index, follow',
  },
  'services.html': {
    canonical: `${site}/services.html`,
    titleMustInclude: ['Product Design Services'],
    descriptionMustInclude: ['UX/UI design', 'developer handoff'],
    robots: 'index, follow',
  },
  'home.html': {
    canonical: `${site}/`,
    robots: 'noindex, follow',
  },
  'home-v2.html': {
    canonical: `${site}/`,
    robots: 'noindex, follow',
  },
  'blog.html': {
    canonical: `${site}/blog/`,
    robots: 'noindex, follow',
  },
};

function read(file) {
  const full = path.join(targetRoot, file);
  if (!fs.existsSync(full)) throw new Error(`[seo-audit] Missing file: ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function titleOf(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
}

function metaOf(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.match(new RegExp(`<meta\\s+[^>]*name=["']${escaped}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i'))?.[1]?.trim() || '';
}

function canonicalOf(html) {
  return html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]?.trim() || '';
}

function assertContains(label, value, parts) {
  for (const part of parts || []) {
    if (!value.toLowerCase().includes(part.toLowerCase())) {
      throw new Error(`[seo-audit] ${label} must include "${part}". Found: ${value}`);
    }
  }
}

for (const [file, rule] of Object.entries(required)) {
  const html = read(file);
  const title = titleOf(html);
  const description = metaOf(html, 'description');
  const robots = metaOf(html, 'robots');
  const canonical = canonicalOf(html);

  if (rule.canonical && canonical !== rule.canonical) throw new Error(`[seo-audit] ${file} canonical mismatch. Expected ${rule.canonical}, found ${canonical}`);
  if (rule.robots && robots !== rule.robots) throw new Error(`[seo-audit] ${file} robots mismatch. Expected ${rule.robots}, found ${robots}`);
  assertContains(`${file} title`, title, rule.titleMustInclude);
  assertContains(`${file} description`, description, rule.descriptionMustInclude);
}

const homepage = read('index.html');
const service = read('product-design-nepal.html');
if (titleOf(homepage) === titleOf(service)) throw new Error('[seo-audit] Homepage and product-design-nepal title must not match.');
if (metaOf(homepage, 'description') === metaOf(service, 'description')) throw new Error('[seo-audit] Homepage and product-design-nepal description must not match.');

const sitemap = read('sitemap.xml');
for (const bad of [`${site}/home.html`, `${site}/home-v2.html`, `${site}/blog.html`]) {
  if (sitemap.includes(bad)) throw new Error(`[seo-audit] Sitemap must not include legacy URL: ${bad}`);
}

console.log('[seo-audit] Final SEO metadata, canonicals, robots and sitemap passed.');
