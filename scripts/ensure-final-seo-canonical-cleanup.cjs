/**
 * @fileoverview scripts/ensure-final-seo-canonical-cleanup.cjs
 * Purpose: Normalize final-page titles, descriptions, canonical URLs, social metadata, and structured data without duplicating route, sitemap, or redirect ownership.
 * Responsibilities:
 * - Apply approved metadata to selected production pages.
 * - Mark retained legacy compatibility pages as `noindex` and point them to their canonical replacement.
 * - Remove obsolete keyword metadata and replace duplicate JSON-LD with one page-appropriate schema block.
 * - Leave sitemap and redirect generation to the canonical route-manifest tooling.
 * Execution context: Node.js production-build refinement stage, normally run with `--dist` from `scripts/build-dist.cjs`.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-seo-discovery.cjs
 * - scripts/seo-discovery-lib.cjs
 * - config/canonical-routes.json
 * - docs/seo-maintenance.md
 * Maintenance: Do not add a second sitemap or redirect list here. Public route ownership belongs to `config/canonical-routes.json`; this stage is intentionally limited to per-page metadata cleanup.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const site = 'https://nischhalsubba.com.np';

const metadata = {
  'index.html': {
    canonical: '/',
    title: 'Nischhal Raj Subba - UX/UI Product Designer',
    description: 'Portfolio of Nischhal Raj Subba, a Nepal-based UX/UI product designer creating clearer product flows, interfaces, design systems, websites and developer-ready handoff.',
    schemaType: 'ProfilePage',
  },
  'product-design-nepal.html': {
    canonical: '/product-design-nepal',
    title: 'UX/UI Product Design Services in Nepal',
    description: 'Product design service page for startups and software teams that need UX audits, mobile app flows, SaaS dashboard design, design systems and practical handoff support in Nepal.',
    schemaType: 'Service',
  },
  'services.html': {
    canonical: '/services',
    title: 'Product Design Services for Software Teams',
    description: 'UX/UI design, product audits, SaaS dashboard design, Web3 UX, design systems, website UX and developer handoff services by Nischhal Raj Subba.',
    schemaType: 'Service',
  },
  'about.html': {
    canonical: '/about',
    title: 'About Nischhal Raj Subba - Product Designer',
    description: 'About Nischhal Raj Subba, a Nepal-based product designer focused on UX strategy, product interfaces, design systems, responsive website UX and practical engineering handoff.',
    schemaType: 'ProfilePage',
  },
  'projects.html': {
    canonical: '/projects',
    title: 'UX/UI Product Design Case Studies',
    description: 'Selected product design case studies by Nischhal Raj Subba across Web3, SaaS, fintech, dashboards, mobile apps, websites and design systems.',
    schemaType: 'CollectionPage',
  },
  'contact.html': {
    canonical: '/contact',
    title: 'Contact Nischhal Raj Subba for Product Design',
    description: 'Contact Nischhal Raj Subba for UX/UI product design, SaaS dashboards, Web3 flows, design systems, UX audits, product websites and developer-ready handoff.',
    schemaType: 'ContactPage',
  },
  'blog/index.html': {
    canonical: '/blog/',
    title: 'Product Design Writing - UX, SaaS, Web3 and Handoff',
    description: 'Practical product design writing about SaaS dashboard UX, Web3 wallet flows, design systems, website UX, UX audits and developer handoff.',
    schemaType: 'Blog',
  },
  'web3-ux-designer.html': {
    canonical: '/web3-ux-designer',
    title: 'Web3 UX Design for Wallets and Protocols',
    description: 'UX/UI design services for Web3 wallets, protocol websites, transaction review flows, signing context, risk language and trust-building product experiences.',
    schemaType: 'Service',
  },
  'saas-ux-designer.html': {
    canonical: '/saas-ux-designer',
    title: 'SaaS UX Design for Dashboards and Admin Tools',
    description: 'UX/UI design services for SaaS dashboards, admin workflows, onboarding, filters, role-based views, empty states and operational product systems.',
    schemaType: 'Service',
  },
  'figma-design-systems.html': {
    canonical: '/figma-design-systems',
    title: 'Figma Design Systems and Developer Handoff',
    description: 'Design system support for reusable Figma components, responsive rules, interaction states, product UI documentation and developer-ready handoff.',
    schemaType: 'Service',
  },
  'ux-audit.html': {
    canonical: '/ux-audit',
    title: 'UX Audit for Software Products and Websites',
    description: 'UX audit service for finding unclear flows, weak hierarchy, confusing copy, missing states, responsive issues and conversion friction before redesign.',
    schemaType: 'Service',
  },
  'website-ux-design.html': {
    canonical: '/website-ux-design',
    title: 'Website UX Design for Software and Product Teams',
    description: 'Website UX design for software companies that need clearer positioning, page hierarchy, service messaging, responsive layouts and conversion paths.',
    schemaType: 'Service',
  },
};

const legacyNoindex = new Set(['home.html', 'home-v2.html', 'blog.html']);

/**
 * Function contract: walk
 * Purpose: Recursively collect files beneath the selected source or production root.
 * Inputs: `dir` - directory to scan; `files` - optional accumulator used during recursion.
 * Side effects: Reads filesystem directory entries.
 * Returns: Array of absolute file paths discovered beneath `dir`.
 */
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/**
 * Function contract: rel
 * Purpose: Convert an absolute file path into the normalized repository/build-relative key used by the metadata table.
 * Inputs: `file` - absolute path beneath `targetRoot`.
 * Side effects: None.
 * Returns: Forward-slash-separated relative path.
 */
function rel(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/');
}

/**
 * Function contract: escapeAttribute
 * Purpose: Escape text before inserting it into generated HTML attribute values.
 * Inputs: `value` - value to convert to text and escape.
 * Side effects: None.
 * Returns: Attribute-safe string with ampersands and quotes escaped.
 */
function escapeAttribute(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * Function contract: upsertTitle
 * Purpose: Replace the existing document title or add one before `</head>` when absent.
 * Inputs: `html` - complete HTML document; `title` - desired document title.
 * Side effects: None.
 * Returns: HTML containing the requested title.
 */
function upsertTitle(html, title) {
  const tag = `<title>${title}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/**
 * Function contract: upsertMeta
 * Purpose: Replace or add one named/property metadata element in the document head.
 * Inputs: `html` - complete document; `attr` - `name` or `property`; `name` - metadata key; `content` - desired value.
 * Side effects: None.
 * Returns: HTML containing one updated metadata element for the requested key.
 */
function upsertMeta(html, attr, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${attr}=["']${escapedName}["'][^>]*>`, 'i');
  const tag = `<meta ${attr}="${name}" content="${escapeAttribute(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/**
 * Function contract: upsertCanonical
 * Purpose: Replace or add the canonical link for a page.
 * Inputs: `html` - complete document; `canonicalPath` - clean public route beginning with `/`.
 * Side effects: None.
 * Returns: HTML containing the absolute canonical URL.
 */
function upsertCanonical(html, canonicalPath) {
  const href = `${site}${canonicalPath}`;
  const tag = `<link rel="canonical" href="${href}" />`;
  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/**
 * Function contract: removeKeywordMeta
 * Purpose: Remove obsolete keyword metadata from a page before final SEO metadata is applied.
 * Inputs: `html` - complete HTML document.
 * Side effects: None.
 * Returns: HTML with all `<meta name="keywords">` elements removed.
 */
function removeKeywordMeta(html) {
  return html.replace(/\s*<meta\s+[^>]*name=["']keywords["'][^>]*>\s*/gi, '\n');
}

/**
 * Function contract: removeJsonLd
 * Purpose: Remove existing JSON-LD blocks so the selected metadata owner can write one deterministic page schema.
 * Inputs: `html` - complete HTML document.
 * Side effects: None.
 * Returns: HTML without existing JSON-LD script elements.
 */
function removeJsonLd(html) {
  return html.replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n');
}

/**
 * Function contract: buildSchema
 * Purpose: Build the page-appropriate Schema.org JSON-LD block for one configured metadata entry.
 * Inputs: `data` - metadata definition containing canonical path, title, description, and schema type.
 * Side effects: None.
 * Returns: JSON-LD script element for the configured page.
 */
function buildSchema(data) {
  const url = `${site}${data.canonical}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': data.schemaType || 'WebPage',
    name: data.title,
    description: data.description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Nischhal Raj Subba Portfolio',
      url: `${site}/`,
    },
  };

  if (data.schemaType === 'Service') {
    schema.provider = {
      '@type': 'Person',
      name: 'Nischhal Raj Subba',
      jobTitle: 'UX/UI Product Designer',
      url: `${site}/`,
      address: { '@type': 'PostalAddress', addressCountry: 'NP' },
    };
    schema.areaServed = ['Nepal', 'Remote'];
    schema.serviceType = data.title;
  }

  if (data.schemaType === 'ProfilePage') {
    schema.mainEntity = {
      '@type': 'Person',
      name: 'Nischhal Raj Subba',
      jobTitle: 'UX/UI Product Designer',
      url: `${site}/`,
      email: 'mailto:hinischalsubba@gmail.com',
      address: { '@type': 'PostalAddress', addressCountry: 'NP' },
      sameAs: [
        'https://www.behance.net/nischhal',
        'https://app.uxcel.com/ux/nischhal',
        'https://linkedin.com/in/nischhal/',
        'https://github.com/Nischhalsubba',
      ],
    };
  }

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * Function contract: applyMetadata
 * Purpose: Apply configured metadata to one HTML file or mark a retained compatibility route as non-indexable.
 * Inputs: `file` - absolute HTML file path beneath `targetRoot`.
 * Side effects: Reads and rewrites the HTML file on disk.
 * Returns: `updated`, `legacy`, or `unchanged` so the caller can report what happened.
 */
function applyMetadata(file) {
  const key = rel(file);
  let html = fs.readFileSync(file, 'utf8');
  const data = metadata[key];

  html = removeKeywordMeta(html);

  if (legacyNoindex.has(key)) {
    const canonical = key === 'blog.html' ? '/blog/' : '/';
    html = upsertTitle(html, 'Legacy route - Nischhal Raj Subba');
    html = upsertMeta(html, 'name', 'robots', 'noindex, follow');
    html = upsertCanonical(html, canonical);
    fs.writeFileSync(file, html, 'utf8');
    return 'legacy';
  }

  if (!data) {
    fs.writeFileSync(file, html, 'utf8');
    return 'unchanged';
  }

  html = upsertTitle(html, data.title);
  html = upsertMeta(html, 'name', 'description', data.description);
  html = upsertMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large');
  html = upsertMeta(html, 'property', 'og:title', data.title);
  html = upsertMeta(html, 'property', 'og:description', data.description);
  html = upsertMeta(html, 'property', 'og:url', `${site}${data.canonical}`);
  html = upsertMeta(html, 'name', 'twitter:title', data.title);
  html = upsertMeta(html, 'name', 'twitter:description', data.description);
  html = upsertCanonical(html, data.canonical);
  html = removeJsonLd(html).replace('</head>', `    ${buildSchema(data)}\n  </head>`);

  fs.writeFileSync(file, html, 'utf8');
  return 'updated';
}

let updated = 0;
let legacy = 0;
for (const file of walk(targetRoot).filter(
  /** Callback contract: Select HTML documents for final metadata cleanup. Inputs: `item`. Side effects: None. Returns: `true` when the path ends with `.html`. */
  (item) => item.endsWith('.html'),
)) {
  const status = applyMetadata(file);
  if (status === 'updated') updated += 1;
  if (status === 'legacy') legacy += 1;
}

console.log(`Final SEO metadata cleanup applied to ${updated} configured page(s); noindexed ${legacy} legacy route(s). Sitemap and redirects remain owned by the canonical route generator.`);
