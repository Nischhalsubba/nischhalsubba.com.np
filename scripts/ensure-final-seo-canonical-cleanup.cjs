/**
 * @fileoverview scripts/ensure-final-seo-canonical-cleanup.cjs
 * Purpose: Apply the ensure final seo canonical cleanup production transformation or maintenance step while preserving canonical source/build contracts.
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

const preferredSitemap = [
  '/',
  '/nischhal-raj-subba',
  '/projects',
  '/services',
  '/about',
  '/contact',
  '/blog/',
  '/product-design-nepal',
  '/web3-ux-designer',
  '/saas-ux-designer',
  '/figma-design-systems',
  '/ux-audit',
  '/website-ux-design',
  '/project-yarsha',
  '/project-mokshya',
  '/project-hamro-idea',
  '/project-morajaa',
  '/project-pihub',
  '/project-masteriyo',
  '/project-zapp',
  '/project-neverwinter-parser',
  '/project-orkest',
  '/project-splashnode',
  '/project-grid-labs',
  '/project-zakra-furniture',
  '/project-designerex',
  '/project-sassboilerplate',
  '/blog/saas-dashboard-ux-checklist',
  '/blog/web3-wallet-ux-checklist',
  '/blog/figma-handoff-notes-for-developers',
  '/blog/ux-audit-checklist-before-redesign',
  '/blog/website-ux-checklist-software-companies',
  '/blog/role-based-saas-dashboard-ux',
  '/llms.txt',
  '/llms-full.txt',
  '/ai-profile.json',
  '/humans.txt',
];

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: `dir`: input consumed by this operation; `files`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Implement the rel responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function rel(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/');
}

/**
 * Function contract: escapeAttribute
 * Purpose: Implement the escape attribute responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function escapeAttribute(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * Function contract: upsertTitle
 * Purpose: Implement the upsert title responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: `html`: input consumed by this operation; `title`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function upsertTitle(html, title) {
  const tag = `<title>${title}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/**
 * Function contract: upsertMeta
 * Purpose: Implements the upsert meta responsibility for this module.
 * Inputs: html, attr, name, content.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertMeta
 * Purpose: Implement the upsert meta responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: `html`: input consumed by this operation; `attr`: input consumed by this operation; `name`: stable identifier or label for the current item; `content`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Implements the upsert canonical responsibility for this module.
 * Inputs: html, canonicalPath.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertCanonical
 * Purpose: Implement the upsert canonical responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: `html`: input consumed by this operation; `canonicalPath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function upsertCanonical(html, canonicalPath) {
  const href = `${site}${canonicalPath}`;
  const tag = `<link rel="canonical" href="${href}" />`;
  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) return html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/**
 * Function contract: removeKeywordMeta
 * Purpose: Removes or cleans remove keyword meta while keeping required outputs intact.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: removeKeywordMeta
 * Purpose: Remove keyword meta without disturbing required surrounding ensure final seo canonical cleanup repository tool state.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function removeKeywordMeta(html) {
  return html.replace(/\s*<meta\s+[^>]*name=["']keywords["'][^>]*>\s*/gi, '\n');
}

/**
 * Function contract: removeJsonLd
 * Purpose: Removes or cleans remove json ld while keeping required outputs intact.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: removeJsonLd
 * Purpose: Remove json ld without disturbing required surrounding ensure final seo canonical cleanup repository tool state.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function removeJsonLd(html) {
  return html.replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n');
}

/**
 * Function contract: buildSchema
 * Purpose: Creates build schema from the supplied inputs and repository state.
 * Inputs: data.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: buildSchema
 * Purpose: Build schema from the supplied inputs in the form expected by downstream ensure final seo canonical cleanup repository tool consumers.
 * Inputs: `data`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function buildSchema(data) {
  const url = `${site}${data.canonical}`;
  const base = {
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
    base.provider = {
      '@type': 'Person',
      name: 'Nischhal Raj Subba',
      jobTitle: 'UX/UI Product Designer',
      url: `${site}/`,
      address: { '@type': 'PostalAddress', addressCountry: 'NP' },
    };
    base.areaServed = ['Nepal', 'Remote'];
    base.serviceType = data.title;
  }

  if (data.schemaType === 'ProfilePage') {
    base.mainEntity = {
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

  return `<script type="application/ld+json">${JSON.stringify(base)}</script>`;
}

/**
 * Function contract: applyMetadata
 * Purpose: Applies apply metadata while preserving the surrounding repository/runtime contract.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: applyMetadata
 * Purpose: Apply metadata consistently while preserving the surrounding ensure final seo canonical cleanup repository tool contract.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: writes repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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

/**
 * Function contract: writeSitemap
 * Purpose: Applies write sitemap while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: writeSitemap
 * Purpose: Implement the write sitemap responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function writeSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = preferredSitemap.map(/** Callback contract: Processes the callback step for preferred sitemap without leaking orchestration details to the caller. Inputs: url. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `url`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `url`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (url) => `  <url>\n    <loc>${site}${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(targetRoot, 'sitemap.xml'), xml, 'utf8');
}

/**
 * Function contract: validateCloudflareRedirects
 * Purpose: Validates validate cloudflare redirects and reports violations instead of silently accepting invalid state.
 * Inputs: redirects.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: validateCloudflareRedirects
 * Purpose: Validate cloudflare redirects and surface actionable failures when the ensure final seo canonical cleanup repository tool contract is violated.
 * Inputs: `redirects`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function validateCloudflareRedirects(redirects) {
  const map = new Map();

  for (const [index, rawLine] of redirects.split('\n').entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to] = line.split(/\s+/);
    if (!from?.startsWith('/') || !to?.startsWith('/')) {
      throw new Error(`[redirects] Relative URLs are required. Invalid line ${index + 1}: ${line}`);
    }
    if (from === to) throw new Error(`[redirects] Self redirect on line ${index + 1}: ${line}`);
    map.set(from, to);
  }

  for (const start of map.keys()) {
    const seen = new Set();
    let current = start;
    while (map.has(current)) {
      if (seen.has(current)) throw new Error(`[redirects] Redirect cycle detected from ${start}`);
      seen.add(current);
      current = map.get(current);
    }
  }
}

/**
 * Function contract: writeRedirects
 * Purpose: Applies write redirects while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: writeRedirects
 * Purpose: Implement the write redirects responsibility owned by the ensure final seo canonical cleanup repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function writeRedirects() {
  const redirects = `# Legacy URLs only. Clean routes are served directly by the platform.\n/home / 301\n/home.html / 301\n/home-v2 / 301\n/home-v2.html / 301\n/index.html / 301\n/blog /blog/ 301\n/blog.html /blog/ 301\n/products /figma-design-systems 301\n/products.html /figma-design-systems 301\n/project-detail.html /projects 301\n/project-jeweltrek.html /projects 301\n/blog-detail.html /blog/ 301\n/blog-saas-dashboard-ux-checklist.html /blog/saas-dashboard-ux-checklist 301\n/blog-web3-wallet-ux-checklist.html /blog/web3-wallet-ux-checklist 301\n/blog-figma-handoff-notes-for-developers.html /blog/figma-handoff-notes-for-developers 301\n/blog-ux-audit-checklist-before-redesign.html /blog/ux-audit-checklist-before-redesign 301\n/blog-website-ux-checklist-software-companies.html /blog/website-ux-checklist-software-companies 301\n/blog-role-based-saas-dashboard-ux.html /blog/role-based-saas-dashboard-ux 301\n`;
  validateCloudflareRedirects(redirects);
  fs.writeFileSync(path.join(targetRoot, '_redirects'), redirects, 'utf8');
}

let updated = 0;
let legacy = 0;
for (const file of walk(targetRoot).filter(/** Callback contract: Processes the callback step for walk(target root) without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (item) => item.endsWith('.html'))) {
  const status = applyMetadata(file);
  if (status === 'updated') updated += 1;
  if (status === 'legacy') legacy += 1;
}
writeSitemap();
writeRedirects();

console.log(`Final SEO cleanup applied to ${updated} preferred page(s); noindexed ${legacy} legacy route(s), and wrote clean canonical URLs without reverse redirects.`);
