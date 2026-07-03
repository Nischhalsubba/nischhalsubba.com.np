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
    canonical: '/product-design-nepal.html',
    title: 'UX/UI Product Design Services in Nepal',
    description: 'Product design service page for startups and software teams that need UX audits, mobile app flows, SaaS dashboard design, design systems and practical handoff support in Nepal.',
    schemaType: 'Service',
  },
  'services.html': {
    canonical: '/services.html',
    title: 'Product Design Services for Software Teams',
    description: 'UX/UI design, product audits, SaaS dashboard design, Web3 UX, design systems, website UX and developer handoff services by Nischhal Raj Subba.',
    schemaType: 'Service',
  },
  'about.html': {
    canonical: '/about.html',
    title: 'About Nischhal Raj Subba - Product Designer',
    description: 'About Nischhal Raj Subba, a Nepal-based product designer focused on UX strategy, product interfaces, design systems, responsive website UX and practical engineering handoff.',
    schemaType: 'ProfilePage',
  },
  'projects.html': {
    canonical: '/projects.html',
    title: 'UX/UI Product Design Case Studies',
    description: 'Selected product design case studies by Nischhal Raj Subba across Web3, SaaS, fintech, dashboards, mobile apps, websites and design systems.',
    schemaType: 'CollectionPage',
  },
  'contact.html': {
    canonical: '/contact.html',
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
    canonical: '/web3-ux-designer.html',
    title: 'Web3 UX Design for Wallets and Protocols',
    description: 'UX/UI design services for Web3 wallets, protocol websites, transaction review flows, signing context, risk language and trust-building product experiences.',
    schemaType: 'Service',
  },
  'saas-ux-designer.html': {
    canonical: '/saas-ux-designer.html',
    title: 'SaaS UX Design for Dashboards and Admin Tools',
    description: 'UX/UI design services for SaaS dashboards, admin workflows, onboarding, filters, role-based views, empty states and operational product systems.',
    schemaType: 'Service',
  },
  'figma-design-systems.html': {
    canonical: '/figma-design-systems.html',
    title: 'Figma Design Systems and Developer Handoff',
    description: 'Design system support for reusable Figma components, responsive rules, interaction states, product UI documentation and developer-ready handoff.',
    schemaType: 'Service',
  },
  'ux-audit.html': {
    canonical: '/ux-audit.html',
    title: 'UX Audit for Software Products and Websites',
    description: 'UX audit service for finding unclear flows, weak hierarchy, confusing copy, missing states, responsive issues and conversion friction before redesign.',
    schemaType: 'Service',
  },
  'website-ux-design.html': {
    canonical: '/website-ux-design.html',
    title: 'Website UX Design for Software and Product Teams',
    description: 'Website UX design for software companies that need clearer positioning, page hierarchy, service messaging, responsive layouts and conversion paths.',
    schemaType: 'Service',
  },
};

const legacyNoindex = new Set([
  'home.html',
  'home-v2.html',
  'blog.html',
]);

const preferredSitemap = [
  '/',
  '/projects.html',
  '/services.html',
  '/about.html',
  '/contact.html',
  '/blog/',
  '/product-design-nepal.html',
  '/web3-ux-designer.html',
  '/saas-ux-designer.html',
  '/figma-design-systems.html',
  '/ux-audit.html',
  '/website-ux-design.html',
  '/project-yarsha.html',
  '/project-mokshya.html',
  '/project-morajaa.html',
  '/project-pihub.html',
  '/project-zapp.html',
  '/project-masteriyo.html',
  '/blog/saas-dashboard-ux-checklist.html',
  '/blog/web3-wallet-ux-checklist.html',
  '/blog/figma-handoff-notes-for-developers.html',
  '/blog/ux-audit-checklist-before-redesign.html',
  '/blog/website-ux-checklist-software-companies.html',
  '/blog/role-based-saas-dashboard-ux.html',
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/');
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function upsertTitle(html, title) {
  const tag = `<title>${title}</title>`;
  if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertMeta(html, attr, name, content) {
  const pattern = new RegExp(`<meta\\s+${attr}=["']${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
  const tag = `<meta ${attr}="${name}" content="${escapeAttribute(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertCanonical(html, canonicalPath) {
  const href = `${site}${canonicalPath}`;
  const tag = `<link rel="canonical" href="${href}" />`;
  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) return html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function removeKeywordMeta(html) {
  return html.replace(/\s*<meta\s+[^>]*name=["']keywords["'][^>]*>\s*/gi, '\n');
}

function removeJsonLd(html) {
  return html.replace(/\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '\n');
}

function buildSchema(key, data) {
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
  html = upsertMeta(html, 'name', 'robots', 'index, follow');
  html = upsertMeta(html, 'property', 'og:title', data.title);
  html = upsertMeta(html, 'property', 'og:description', data.description);
  html = upsertMeta(html, 'property', 'og:url', `${site}${data.canonical}`);
  html = upsertMeta(html, 'name', 'twitter:title', data.title);
  html = upsertMeta(html, 'name', 'twitter:description', data.description);
  html = upsertCanonical(html, data.canonical);
  html = removeJsonLd(html).replace('</head>', `    ${buildSchema(key, data)}\n  </head>`);

  fs.writeFileSync(file, html, 'utf8');
  return 'updated';
}

function writeSitemap() {
  const urls = preferredSitemap.map((url) => `  <url>\n    <loc>${site}${url}</loc>\n  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(targetRoot, 'sitemap.xml'), xml, 'utf8');
}

function validateCloudflareRedirects(redirects) {
  for (const [index, rawLine] of redirects.split('\n').entries()) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to] = line.split(/\s+/);
    if (!from?.startsWith('/') || !to?.startsWith('/')) {
      throw new Error(`[redirects] Cloudflare Workers Assets requires relative URLs in _redirects. Invalid line ${index + 1}: ${line}`);
    }
  }
}

function writeRedirects() {
  const redirects = `/home.html / 301
/home-v2.html / 301
/blog.html /blog/ 301
/index.html / 301
/product-design-nepal /product-design-nepal.html 301
/services /services.html 301
/about /about.html 301
/contact /contact.html 301
/projects /projects.html 301
/blog-saas-dashboard-ux-checklist.html /blog/saas-dashboard-ux-checklist.html 301
/blog-web3-wallet-ux-checklist.html /blog/web3-wallet-ux-checklist.html 301
/blog-figma-handoff-notes-for-developers.html /blog/figma-handoff-notes-for-developers.html 301
/blog-ux-audit-checklist-before-redesign.html /blog/ux-audit-checklist-before-redesign.html 301
/blog-website-ux-checklist-software-companies.html /blog/website-ux-checklist-software-companies.html 301
/blog-role-based-saas-dashboard-ux.html /blog/role-based-saas-dashboard-ux.html 301
`;
  validateCloudflareRedirects(redirects);
  fs.writeFileSync(path.join(targetRoot, '_redirects'), redirects, 'utf8');
}

let updated = 0;
let legacy = 0;
for (const file of walk(targetRoot).filter((item) => item.endsWith('.html'))) {
  const status = applyMetadata(file);
  if (status === 'updated') updated += 1;
  if (status === 'legacy') legacy += 1;
}
writeSitemap();
writeRedirects();

console.log(`Final SEO cleanup applied to ${updated} preferred page(s); noindexed ${legacy} legacy route(s), and wrote Cloudflare-safe relative redirects.`);
