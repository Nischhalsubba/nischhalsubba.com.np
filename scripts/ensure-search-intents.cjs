/**
 * @fileoverview scripts/ensure-search-intents.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure search intents.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/generate-source.cjs
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SITE = 'https://nischhalsubba.com.np';
const DEFAULT_IMAGE = `${SITE}/assets/images/portrait.png`;
const PROJECT_IMAGE = `${SITE}/assets/images/project-yarsha-cover.svg`;

const intents = {
  'index.html': {
    type: 'WebPage',
    intent: 'Product Designer in Nepal for Web3, SaaS, fintech and developer-ready UX handoff',
    title: 'Product Designer in Nepal for Web3, SaaS & Fintech UX | Nischhal Raj Subba',
    description: 'Nischhal Raj Subba is a Product Designer in Nepal helping Web3, SaaS, fintech and software teams design clearer flows, polished UI, design systems and developer-ready handoff.',
    canonical: '/',
    image: DEFAULT_IMAGE,
  },
  'projects.html': {
    type: 'CollectionPage',
    intent: 'Product design portfolio and UX case studies by Nischhal Raj Subba',
    title: 'Product Design Portfolio & UX Case Studies | Nischhal Raj Subba',
    description: 'Selected product design case studies by Nischhal Raj Subba across Web3 UX, SaaS dashboards, fintech workflows, logistics apps, service websites, WordPress LMS and front-end tools.',
    canonical: '/projects.html',
    image: PROJECT_IMAGE,
  },
  'about.html': {
    type: 'ProfilePage',
    intent: 'About Nischhal Raj Subba, Product Designer in Nepal',
    title: 'About Nischhal Raj Subba | Product Designer in Nepal',
    description: 'About Nischhal Raj Subba, a Nepal-based Product Designer focused on UX/UI, design systems, Web3 product flows, SaaS dashboards, fintech interfaces and developer-ready handoff.',
    canonical: '/about.html',
    image: DEFAULT_IMAGE,
  },
  'contact.html': {
    type: 'ContactPage',
    intent: 'Contact Nischhal Raj Subba for product design, UX/UI, design systems and audits',
    title: 'Contact Nischhal Raj Subba | Product Design, UX/UI & Design Systems',
    description: 'Contact Nischhal Raj Subba for product design roles, UX/UI projects, Web3 UX, SaaS dashboards, fintech workflows, design systems, UX audits and website redesigns.',
    canonical: '/contact.html',
    image: DEFAULT_IMAGE,
  },
  'blog/index.html': {
    type: 'CollectionPage',
    intent: 'Product design writing on UX, Web3, SaaS dashboards and developer handoff',
    title: 'Product Design Writing on UX, Web3, SaaS & Handoff | Nischhal Raj Subba',
    description: 'Articles by Nischhal Raj Subba on product design, Web3 UX, SaaS dashboard UX, fintech flows, website UX, design systems and developer-ready handoff.',
    canonical: '/blog/',
    image: DEFAULT_IMAGE,
  },
  'blog.html': {
    type: 'CollectionPage',
    intent: 'Product design writing by Nischhal Raj Subba',
    title: 'Product Design Writing | Nischhal Raj Subba',
    description: 'Product design articles by Nischhal Raj Subba on UX clarity, Web3 products, handoff, portfolio thinking, service websites and design systems.',
    canonical: '/blog.html',
    image: DEFAULT_IMAGE,
  },
  'product-design-nepal.html': {
    type: 'Service',
    intent: 'Product designer in Nepal for startups and software teams',
    title: 'Product Designer in Nepal for Startups & Software Teams | Nischhal Raj Subba',
    description: 'Hire Nischhal Raj Subba, a Product Designer in Nepal for UX/UI, mobile app design, dashboards, design systems, prototypes and developer-ready handoff.',
    canonical: '/product-design-nepal.html',
    image: DEFAULT_IMAGE,
  },
  'web3-ux-designer.html': {
    type: 'Service',
    intent: 'Web3 UX designer for wallet actions, transaction review and crypto product flows',
    title: 'Web3 UX Designer for Wallet & Transaction Flows | Nischhal Raj Subba',
    description: 'Web3 UX design services for wallet actions, transaction review, crypto app flows, protocol websites and trust-focused product interfaces.',
    canonical: '/web3-ux-designer.html',
    image: PROJECT_IMAGE,
  },
  'saas-ux-designer.html': {
    type: 'Service',
    intent: 'SaaS UX designer for dashboards, admin tools and B2B product workflows',
    title: 'SaaS UX Designer for Dashboards & B2B Workflows | Nischhal Raj Subba',
    description: 'SaaS UX design for dashboards, admin tools, onboarding, role-based workflows, tables, states, design systems and developer-ready handoff.',
    canonical: '/saas-ux-designer.html',
    image: DEFAULT_IMAGE,
  },
  'website-ux-design.html': {
    type: 'Service',
    intent: 'Website UX design for software companies and service businesses',
    title: 'Website UX Design for Software Companies | Nischhal Raj Subba',
    description: 'Website UX design for software companies, service businesses and startups that need clearer positioning, service pages, conversion paths and responsive layouts.',
    canonical: '/website-ux-design.html',
    image: DEFAULT_IMAGE,
  },
  'figma-design-systems.html': {
    type: 'Service',
    intent: 'Figma design systems and reusable UI components for product teams',
    title: 'Figma Design Systems & Reusable UI Components | Nischhal Raj Subba',
    description: 'Figma design system services for product teams: reusable components, variants, tokens, states, responsive rules and developer-ready handoff.',
    canonical: '/figma-design-systems.html',
    image: DEFAULT_IMAGE,
  },
  'ux-audit.html': {
    type: 'Service',
    intent: 'UX audit for websites, dashboards and product interfaces',
    title: 'UX Audit for Websites, Dashboards & Product Interfaces | Nischhal Raj Subba',
    description: 'UX audits for websites, dashboards and digital products covering hierarchy, flows, accessibility, friction points, conversion paths and practical redesign priorities.',
    canonical: '/ux-audit.html',
    image: DEFAULT_IMAGE,
  },
  'project-yarsha.html': {
    type: 'CreativeWork',
    intent: 'Web3 messaging mobile app UX case study',
    title: 'Yarsha Web3 Messaging App UX Case Study | Nischhal Raj Subba',
    description: 'Yarsha case study showing mobile UX/UI for a Web3 messaging app with chat-first flows, wallet actions, transaction review states, payments and AI-bot interactions.',
    canonical: '/project-yarsha.html',
    image: `${SITE}/assets/images/project-yarsha-cover.svg`,
  },
  'project-mokshya.html': {
    type: 'CreativeWork',
    intent: 'Web3 protocol website design case study',
    title: 'Mokshya Web3 Protocol Website Design Case Study | Nischhal Raj Subba',
    description: 'Mokshya case study on designing a clearer Web3 protocol website with technical product messaging, responsive sections and trust-focused hierarchy.',
    canonical: '/project-mokshya.html',
    image: `${SITE}/assets/images/project-mokshya-cover.svg`,
  },
  'project-hamro-idea.html': {
    type: 'CreativeWork',
    intent: 'Software company website UX and brand case study in Nepal',
    title: 'Hamro Idea Software Company Website UX Case Study | Nischhal Raj Subba',
    description: 'Hamro Idea case study covering brand direction, service website UX, responsive static front-end implementation and SEO-ready structure for a Nepal-based software studio.',
    canonical: '/project-hamro-idea.html',
    image: `${SITE}/assets/images/project-hamro-idea-cover.svg`,
  },
  'project-morajaa.html': {
    type: 'CreativeWork',
    intent: 'B2B consulting website UX case study',
    title: 'Morajaa B2B Consulting Website UX Case Study | Nischhal Raj Subba',
    description: 'Morajaa case study on website UX for a consulting business, including service pages, sector pages, lead paths, content hierarchy and premium responsive presentation.',
    canonical: '/project-morajaa.html',
    image: `${SITE}/assets/images/project-morajaa-cover.svg`,
  },
  'project-pihub.html': {
    type: 'CreativeWork',
    intent: 'Fintech app UX case study for investor and creditor workflows',
    title: 'piHub Fintech App UX Case Study | Nischhal Raj Subba',
    description: 'piHub case study covering fintech UX for creditor, investor and admin flows, including product applications, credit requests, verification states and profile workflows.',
    canonical: '/project-pihub.html',
    image: `${SITE}/assets/images/project-pihub-cover.svg`,
  },
  'project-zapp.html': {
    type: 'CreativeWork',
    intent: 'Logistics mobile app UX case study for customer and driver flows',
    title: 'Zapp Today Logistics App UX Case Study | Nischhal Raj Subba',
    description: 'Zapp Today case study covering customer and driver mobile app UX, delivery status states, booking and tracking flows, and logistics dashboard exploration.',
    canonical: '/project-zapp.html',
    image: `${SITE}/assets/images/project-zapp-cover.svg`,
  },
  'project-masteriyo.html': {
    type: 'CreativeWork',
    intent: 'WordPress LMS product design contribution case study',
    title: 'Masteriyo WordPress LMS Product Design Contribution | Nischhal Raj Subba',
    description: 'Masteriyo case study covering contribution work for a WordPress LMS product, including course, quiz, admin and student interface design patterns in Figma.',
    canonical: '/project-masteriyo.html',
    image: `${SITE}/assets/images/project-masteriyo-cover.svg`,
  },
  'project-neverwinter-parser.html': {
    type: 'CreativeWork',
    intent: 'Gaming analytics desktop app UI case study',
    title: 'Neverwinter Live Parser Desktop App UI Case Study | Nischhal Raj Subba',
    description: 'Neverwinter Live Parser case study for a Windows desktop tool that turns combat logs into readable encounter summaries, dashboard views and performance insights.',
    canonical: '/project-neverwinter-parser.html',
    image: DEFAULT_IMAGE,
  },
  'project-orkest.html': {
    type: 'CreativeWork',
    intent: 'SaaS dashboard UX architecture case study',
    title: 'Orkest HQ SaaS Dashboard UX Architecture Case Study | Nischhal Raj Subba',
    description: 'Orkest HQ case study covering UX architecture for a modular SaaS platform with CRM, sales, inventory, finance and shared workspace modules.',
    canonical: '/project-orkest.html',
    image: `${SITE}/assets/images/project-orkest-cover.svg`,
  },
  'project-splashnode.html': {
    type: 'CreativeWork',
    intent: 'Technical platform website UX and front-end case study',
    title: 'Splashnode Technical Platform Website UX Case Study | Nischhal Raj Subba',
    description: 'Splashnode case study covering technical platform website UX, feature explanation, responsive layouts and front-end implementation-aware design.',
    canonical: '/project-splashnode.html',
    image: `${SITE}/assets/images/project-splashnode-cover.svg`,
  },
  'project-grid-labs.html': {
    type: 'CreativeWork',
    intent: 'Hosting landing page UI and front-end case study',
    title: 'Grid Labs Hosting Landing Page UI Case Study | Nischhal Raj Subba',
    description: 'Grid Labs Hosting case study covering a static landing page for hosting services with domain search UI, service cards, pricing tabs and contact sections.',
    canonical: '/project-grid-labs.html',
    image: DEFAULT_IMAGE,
  },
  'project-zakra-furniture.html': {
    type: 'CreativeWork',
    intent: 'WordPress Elementor furniture starter site design case study',
    title: 'Zakra Furniture WordPress Starter Site Case Study | Nischhal Raj Subba',
    description: 'Zakra Furniture case study covering a WordPress and Elementor starter website with reusable furniture business sections and product presentation layouts.',
    canonical: '/project-zakra-furniture.html',
    image: DEFAULT_IMAGE,
  },
  'project-designerex.html': {
    type: 'CreativeWork',
    intent: 'Fashion marketplace product discovery UI contribution case study',
    title: 'Designerex Fashion Marketplace UI Contribution | Nischhal Raj Subba',
    description: 'Designerex case study covering contribution work for marketplace discovery, product listing presentation and premium fashion browsing UI.',
    canonical: '/project-designerex.html',
    image: DEFAULT_IMAGE,
  },
  'project-sassboilerplate.html': {
    type: 'CreativeWork',
    intent: 'Sass front-end starter structure case study',
    title: 'sassBoilerplate Front-End Structure Case Study | Nischhal Raj Subba',
    description: 'sassBoilerplate case study covering a reusable Sass starter structure for organizing front-end styling work, static website setup and maintainable CSS patterns.',
    canonical: '/project-sassboilerplate.html',
    image: DEFAULT_IMAGE,
  },
};

const blogIntents = {
  'blog/blog-web3-products.html': ['Article', 'Web3 product UX design article', 'Designing Web3 Products Users Can Trust | Nischhal Raj Subba', 'A practical article about Web3 product UX, trust, wallet actions, transaction review, states and interface clarity.'],
  'blog/blog-good-handoff.html': ['Article', 'Developer-ready Figma handoff article', 'What Makes a Good Design Handoff | Nischhal Raj Subba', 'A practical article on developer-ready design handoff, Figma specs, responsive states, QA notes and reducing implementation ambiguity.'],
  'blog/blog-portfolio-product.html': ['Article', 'Product design portfolio strategy article', 'Treat Your Portfolio Like a Product | Nischhal Raj Subba', 'A product-design article about structuring a portfolio around users, proof, case studies, positioning and scannable decision-making.'],
  'blog/blog-service-websites.html': ['Article', 'Service website UX article', 'Why Service Websites Need Product Thinking | Nischhal Raj Subba', 'A practical article about service website UX, positioning, conversion paths, trust signals, content hierarchy and redesign priorities.'],
  'blog/blog-gaming-interface-clarity.html': ['Article', 'Gaming interface clarity article', 'Interface Clarity for Gaming Tools | Nischhal Raj Subba', 'A UX article about gaming interface clarity, dense data, combat logs, dashboards and making player-facing tools easier to scan.'],
  'blog/blog-design-systems-front-end.html': ['Article', 'Design systems and front-end handoff article', 'Design Systems Need Front-End Awareness | Nischhal Raj Subba', 'A design systems article about reusable UI, tokens, implementation constraints, component states and front-end-aware product design.'],
  'blog/web3-wallet-ux-checklist.html': ['Article', 'Web3 wallet UX checklist', 'Web3 Wallet UX Checklist | Nischhal Raj Subba', 'A checklist for improving Web3 wallet UX, transaction review, permissions, risk language, confirmation states and trust-building interaction design.'],
  'blog/transaction-review-ux-crypto-apps.html': ['Article', 'Crypto transaction review UX article', 'Transaction Review UX for Crypto Apps | Nischhal Raj Subba', 'A UX article about clearer crypto transaction review screens, wallet actions, state language, fees, confirmation moments and user trust.'],
  'blog/saas-dashboard-ux-checklist.html': ['Article', 'SaaS dashboard UX checklist', 'SaaS Dashboard UX Checklist | Nischhal Raj Subba', 'A checklist for SaaS dashboard UX covering hierarchy, tables, filters, onboarding, role-based views, empty states and operational clarity.'],
  'blog/website-ux-checklist-software-companies.html': ['Article', 'Website UX checklist for software companies', 'Website UX Checklist for Software Companies | Nischhal Raj Subba', 'A website UX checklist for software companies covering positioning, service pages, proof, conversion paths, responsive layout and content clarity.'],
  'blog/ux-audit-checklist-before-redesign.html': ['Article', 'UX audit checklist before redesign', 'UX Audit Checklist Before a Redesign | Nischhal Raj Subba', 'A practical UX audit checklist for teams planning a website or product redesign, covering hierarchy, friction, accessibility and conversion risks.'],
  'blog/figma-handoff-notes-for-developers.html': ['Article', 'Figma handoff notes for developers', 'Figma Handoff Notes for Developers | Nischhal Raj Subba', 'A practical article about Figma handoff notes, component states, responsive specs, QA and developer-ready design documentation.'],
  'blog/hire-product-designer-nepal-saas-web3.html': ['Article', 'Hiring a product designer in Nepal for SaaS and Web3', 'Hire a Product Designer in Nepal for SaaS & Web3 | Nischhal Raj Subba', 'A hiring-focused article about working with a Product Designer in Nepal for SaaS, Web3, fintech, dashboards, design systems and handoff.'],
};

for (const [file, [type, intent, title, description]] of Object.entries(blogIntents)) {
  intents[file] = {
    type,
    intent,
    title,
    description,
    canonical: `/${file}`,
    image: DEFAULT_IMAGE,
  };
}

/**
 * Function contract: escapeHtml
 * Purpose: Implements the escape html responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Function contract: absoluteUrl
 * Purpose: Implements the absolute url responsibility for this module.
 * Inputs: canonical.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function absoluteUrl(canonical) {
  if (canonical === '/') return `${SITE}/`;
  return `${SITE}${canonical}`;
}

/**
 * Function contract: upsertTitle
 * Purpose: Implements the upsert title responsibility for this module.
 * Inputs: html, title.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function upsertTitle(html, title) {
  const value = `<title>${escapeHtml(title)}</title>`;
  return /<title>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title>[\s\S]*?<\/title>/i, value)
    : html.replace(/<head[^>]*>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => `${match}\n    ${value}`);
}

/**
 * Function contract: upsertMetaName
 * Purpose: Implements the upsert meta name responsibility for this module.
 * Inputs: html, name, content.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function upsertMetaName(html, name, content) {
  const value = `<meta name="${name}" content="${escapeHtml(content)}" />`;
  const regex = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i');
  return regex.test(html)
    ? html.replace(regex, value)
    : html.replace(/<meta\s+name="viewport"[^>]*>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => `${match}\n    ${value}`);
}

/**
 * Function contract: upsertMetaProperty
 * Purpose: Implements the upsert meta property responsibility for this module.
 * Inputs: html, property, content.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function upsertMetaProperty(html, property, content) {
  const value = `<meta property="${property}" content="${escapeHtml(content)}" />`;
  const regex = new RegExp(`<meta\\s+property=["']${property}["'][^>]*>`, 'i');
  return regex.test(html)
    ? html.replace(regex, value)
    : html.replace(/<\/title>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => `${match}\n    ${value}`);
}

/**
 * Function contract: upsertCanonical
 * Purpose: Implements the upsert canonical responsibility for this module.
 * Inputs: html, canonical.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function upsertCanonical(html, canonical) {
  const value = `<link rel="canonical" href="${absoluteUrl(canonical)}" />`;
  return /<link\s+rel="canonical"[^>]*>/i.test(html)
    ? html.replace(/<link\s+rel="canonical"[^>]*>/i, value)
    : html.replace(/<\/title>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => `${match}\n    ${value}`);
}

/**
 * Function contract: upsertSearchIntentSchema
 * Purpose: Implements the upsert search intent schema responsibility for this module.
 * Inputs: html, config.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function upsertSearchIntentSchema(html, config) {
  const url = absoluteUrl(config.canonical);
  const schema = {
    '@context': 'https://schema.org',
    '@type': config.type,
    '@id': `${url}#search-intent`,
    url,
    name: config.title,
    description: config.description,
    about: config.intent,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: 'Nischhal Raj Subba Portfolio',
      url: `${SITE}/`,
    },
    author: {
      '@type': 'Person',
      '@id': `${SITE}/#nischhal-raj-subba`,
      name: 'Nischhal Raj Subba',
      url: `${SITE}/about.html`,
      jobTitle: 'Product Designer',
    },
  };

  const script = `<script type="application/ld+json" id="nrs-search-intent-schema">${JSON.stringify(schema)}</script>`;
  html = html.replace(/\s*<script\s+type="application\/ld\+json"\s+id="nrs-search-intent-schema">[\s\S]*?<\/script>/i, '');
  return html.replace(/<\/head>/i, `    ${script}\n  </head>`);
}

/**
 * Function contract: applyIntent
 * Purpose: Applies apply intent while preserving the surrounding repository/runtime contract.
 * Inputs: html, config.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function applyIntent(html, config) {
  html = upsertTitle(html, config.title);
  html = upsertMetaName(html, 'description', config.description);
  html = upsertMetaName(html, 'nrs-search-intent', config.intent);
  html = upsertMetaName(html, 'robots', 'index, follow, max-image-preview:large');
  html = upsertCanonical(html, config.canonical);
  html = upsertMetaProperty(html, 'og:title', config.title);
  html = upsertMetaProperty(html, 'og:description', config.description);
  html = upsertMetaProperty(html, 'og:url', absoluteUrl(config.canonical));
  html = upsertMetaProperty(html, 'og:image', config.image || DEFAULT_IMAGE);
  html = upsertMetaName(html, 'twitter:card', 'summary_large_image');
  html = upsertMetaName(html, 'twitter:title', config.title);
  html = upsertMetaName(html, 'twitter:description', config.description);
  html = upsertMetaName(html, 'twitter:image', config.image || DEFAULT_IMAGE);
  html = upsertSearchIntentSchema(html, config);
  return html;
}

let updated = 0;
for (const [file, config] of Object.entries(intents)) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[search-intent] missing file: ${file}`);
    continue;
  }

  const before = fs.readFileSync(filePath, 'utf8');
  const after = applyIntent(before, config);
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
    updated += 1;
  }
}

console.log(`Applied search intent metadata to ${updated} HTML files.`);
