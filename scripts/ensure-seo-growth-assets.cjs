const fs = require('fs');
const path = require('path');
const { EARLY_THEME_BOOTSTRAP } = require('./early-theme-bootstrap.cjs');

const root = path.resolve(__dirname, '..');
const SITE = 'https://nischhalsubba.com.np';
const email = 'hinischalsubba@gmail.com';
const today = '2026-06-24';

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function nav(active = 'writing') {
  const item = (section, href, label, cls = 'nav-link') => {
    const isActive = active === section;
    return `<a href="${href}" class="${cls}${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${label}</a>`;
  };
  return `<button class="mobile-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav-overlay"><span></span><span></span></button><a href="/" class="mobile-logo">NRS</a><div class="mobile-nav-overlay" id="mobile-nav-overlay"><nav class="mobile-nav-links" aria-label="Mobile navigation">${item('home', '/', 'Home', '')}${item('work', '/projects.html', 'Work', '')}${item('about', '/about.html', 'About', '')}${item('writing', '/blog/', 'Writing', '')}${item('contact', '/contact.html', 'Contact', '')}</nav></div><button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme"></button><nav class="nav-wrapper" aria-label="Primary navigation"><div class="nav-pill"><div class="nav-glider"></div>${item('home', '/', 'Home')}${item('work', '/projects.html', 'Work')}${item('about', '/about.html', 'About')}${item('writing', '/blog/', 'Writing')}${item('contact', '/contact.html', 'Contact')}</div></nav>`;
}

const footer = `<footer class="site-footer"><div class="container"><div class="footer-top-grid"><div class="footer-cta"><h2>Available for<br>product design<br><span style="font-style:italic;">roles and projects.</span></h2><p>I help teams clarify product flows, ship polished interfaces, document systems, and hand off work engineers can build.</p><a href="mailto:${email}" class="footer-email-btn">${email}</a></div><div class="footer-nav-grid"><div class="footer-col"><h5>Pages</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a><a href="/media-kit.html">Media kit</a></div><div class="footer-col"><h5>Proof</h5><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener">Behance</a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener">Uxcel</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener">LinkedIn</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a></div></div></div><div class="footer-bottom-bar"><span>(c) 2026 Nischhal Raj Subba.</span></div></div></footer>`;
const script = `<script type="module" src="/script.js?v=32.0"></script>`;

function head({ title, description, canonical, type = 'article', schema }) {
  const url = `${SITE}${canonical}`;
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/assets/images/portrait.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE}/assets/images/portrait.png" />
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
    <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt summary for AI agents" />
    <link rel="alternate" type="application/json" href="/ai-profile.json" title="AI-readable profile for Nischhal Raj Subba" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    ${EARLY_THEME_BOOTSTRAP}
    <link rel="stylesheet" href="/style.css?v=32.0" />
    ${schema || ''}
  </head>`;
}

function articleSchema(article) {
  return `<script type="application/ld+json" id="nrs-article-schema">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: today,
    dateModified: today,
    author: {
      '@type': 'Person',
      '@id': `${SITE}/#nischhal-raj-subba`,
      name: 'Nischhal Raj Subba',
      url: `${SITE}/about.html`,
      jobTitle: 'Product Designer',
    },
    publisher: {
      '@type': 'Person',
      '@id': `${SITE}/#nischhal-raj-subba`,
      name: 'Nischhal Raj Subba',
    },
    mainEntityOfPage: `${SITE}${article.canonical}`,
    about: article.intent,
  })}</script>`;
}

const articles = [
  {
    slug: 'figma-handoff-notes-for-developers.html',
    title: 'Developer-Ready Figma Handoff Notes for Product Teams',
    navTitle: 'Developer-ready Figma handoff',
    intent: 'developer-ready Figma handoff for product teams',
    description: 'A practical guide to developer-ready Figma handoff: component states, responsive rules, flows, edge cases, QA notes and implementation-ready design documentation.',
    intro: 'A Figma file is not a handoff by default. It becomes useful when it explains decisions, states, responsive behavior, and edge cases clearly enough for engineers to build without decoding a designer’s brain like ancient scripture.',
    sections: [
      ['Start with the product flow', 'Before polishing frames, map the main journey, alternate paths, empty states, error states, permission states, and success states. Engineers need to understand what changes when the user has no data, makes a mistake, waits for a response, or finishes a task.'],
      ['Document component states', 'Buttons, inputs, tabs, filters, modals, tables, cards, drawers, and navigation patterns should include default, hover, focus, disabled, loading, selected, error, and empty states where relevant. Missing states create implementation guesswork.'],
      ['Explain responsive behavior', 'A desktop screen is not enough. Add notes for mobile stacking, table behavior, truncation, long names, sticky actions, scroll containers, and content overflow. Responsive decisions are product decisions, not decoration.'],
      ['Add QA notes', 'A good handoff includes what to test: keyboard focus, reduced motion, form validation, long text, missing images, slow network states, and whether the implementation still matches the intent after real data is added.'],
    ],
    links: [['See design systems service', '/figma-design-systems.html'], ['View project work', '/projects.html'], ['Contact for handoff review', '/contact.html']],
  },
  {
    slug: 'web3-wallet-ux-checklist.html',
    title: 'Web3 Wallet UX Checklist for Safer Transaction Flows',
    navTitle: 'Web3 wallet UX checklist',
    intent: 'Web3 wallet UX checklist for signing, permissions and transaction review',
    description: 'A Web3 wallet UX checklist covering signing context, permissions, transaction review, risk language, loading states, confirmation states and user trust.',
    intro: 'Web3 UX fails when users are asked to approve something they do not understand. Good wallet UX slows down the right moments, explains risk clearly, and avoids turning every action into a technical panic room.',
    sections: [
      ['Show what the user is approving', 'Every signing or transaction step should explain the action, asset, network, address, amount, fees, permissions, and consequence before the user confirms.'],
      ['Use plain risk language', 'Avoid hiding the meaning behind protocol jargon. If an action grants access, changes ownership, triggers a fee, or cannot be reversed, say that clearly.'],
      ['Design for waiting and failure', 'Wallet flows need pending, delayed, rejected, failed, expired, and confirmed states. Without these, users refresh, retry, or assume the product broke.'],
      ['Keep proof close to action', 'Project pages, trust signals, protocol context, support links, and transaction history help users understand whether they are acting in the right place.'],
    ],
    links: [['Yarsha Web3 UX case study', '/project-yarsha.html'], ['Web3 UX design service', '/web3-ux-designer.html'], ['Contact for Web3 UX work', '/contact.html']],
  },
  {
    slug: 'saas-dashboard-ux-checklist.html',
    title: 'SaaS Dashboard UX Checklist for B2B Product Teams',
    navTitle: 'SaaS dashboard UX checklist',
    intent: 'SaaS dashboard UX checklist for B2B product teams',
    description: 'A SaaS dashboard UX checklist for hierarchy, role-based views, filters, tables, empty states, alerts, admin workflows and operational clarity.',
    intro: 'SaaS dashboards become confusing when every metric, filter, table, and action is treated as equally important. The interface should help teams decide what needs attention now, what can wait, and what action comes next.',
    sections: [
      ['Prioritize by role', 'Admins, operators, managers, and analysts do not need the same default view. The dashboard should reflect the decisions each role actually makes.'],
      ['Make tables usable', 'Tables need clear columns, sorting, filters, pagination, empty states, bulk actions, row states, and sensible truncation. Dense data is not a crime; unmanaged density is.'],
      ['Design empty and error states', 'A dashboard with no data should explain what happened and what to do next. Error states should identify the problem and recovery path without dumping technical noise on the user.'],
      ['Connect metrics to actions', 'If a metric is shown, users should know why it matters and what action it supports. Otherwise it is just decorative anxiety.'],
    ],
    links: [['Orkest SaaS UX case study', '/project-orkest.html'], ['SaaS UX design service', '/saas-ux-designer.html'], ['View selected work', '/projects.html']],
  },
  {
    slug: 'fintech-verification-ux.html',
    title: 'Fintech Verification UX: Designing Trustworthy Credit and Investor Flows',
    navTitle: 'Fintech verification UX',
    intent: 'fintech verification UX for credit, investor and admin workflows',
    description: 'A practical fintech UX guide for verification, credit requests, investor workflows, account states, risk language, admin review and trust-focused interface design.',
    intro: 'Fintech UX has to balance trust, clarity, and compliance-sensitive behavior. Users need to understand what is being verified, why it matters, what status they are in, and what happens next.',
    sections: [
      ['Make account status obvious', 'Users should always know whether their profile is incomplete, pending review, verified, rejected, blocked, or ready for action. Status language needs to be human, not just system labels.'],
      ['Explain required documents', 'Verification flows should show what is needed, why it is needed, accepted formats, expected review time, and how to fix problems.'],
      ['Separate user and admin needs', 'Investors, creditors, and admins have different goals. The product should not force them through the same mental model just because the database joins are convenient.'],
      ['Design for review and recovery', 'Fintech workflows need clear review queues, audit trails, rejection reasons, retry options, and escalation paths. Trust grows when the interface explains what happened.'],
    ],
    links: [['piHub fintech UX case study', '/project-pihub.html'], ['Product design services', '/product-design-nepal.html'], ['Contact for fintech UX work', '/contact.html']],
  },
  {
    slug: 'ux-audit-checklist-before-redesign.html',
    title: 'UX Audit Checklist Before a Website or Product Redesign',
    navTitle: 'UX audit checklist before redesign',
    intent: 'UX audit checklist before redesign for websites and product interfaces',
    description: 'A UX audit checklist before redesign covering hierarchy, navigation, conversion paths, accessibility, responsive behavior, content clarity and implementation risk.',
    intro: 'A redesign without an audit is often just new paint on old confusion. A useful UX audit finds what blocks understanding, trust, navigation, conversion, and implementation before visual redesign begins.',
    sections: [
      ['Check the first-screen promise', 'The page should quickly explain who it is for, what it offers, why it matters, and what the visitor can do next. If users need archaeology tools, the hero section failed.'],
      ['Audit navigation and internal links', 'Important routes should be reachable, labeled consistently, and connected through meaningful links. Search engines and humans both follow the paths you create.'],
      ['Review accessibility basics', 'Check focus states, contrast, labels, target sizes, reduced motion, semantic headings, form errors, and keyboard behavior before blaming the design aesthetic.'],
      ['Separate symptoms from causes', 'Large spacing, weak copy, low conversion, or confusing pages are symptoms. The cause may be unclear hierarchy, missing proof, poor routing, or mismatched user intent.'],
    ],
    links: [['UX audit service', '/ux-audit.html'], ['Website UX service', '/website-ux-design.html'], ['Contact for audit work', '/contact.html']],
  },
  {
    slug: 'website-ux-checklist-software-companies.html',
    title: 'Website UX Checklist for Software Companies and Service Businesses',
    navTitle: 'Website UX checklist for software companies',
    intent: 'website UX checklist for software companies and service businesses',
    description: 'A website UX checklist for software companies covering positioning, service pages, proof, conversion paths, responsive structure, SEO content and trust signals.',
    intro: 'A software company website should not just look modern. It should explain what the company does, who it helps, why visitors should trust it, and what action makes sense next.',
    sections: [
      ['Clarify the offer', 'Visitors should understand the service, audience, outcome, proof, and next step without reading every paragraph. Good positioning reduces support questions before they happen.'],
      ['Build service pages around intent', 'Each service page should target one clear search intent and explain problems, process, deliverables, proof, and fit. Generic service pages are search-engine oatmeal.'],
      ['Use proof close to claims', 'Case studies, client work, prototypes, screenshots, public profiles, and resume links should sit near the claims they support. Trust signals should not be buried in the footer like a sad museum exhibit.'],
      ['Make contact low-friction', 'A contact page should ask for the right context, not a biography. Project type, timeline, product, current issue, and email are enough for a useful first reply.'],
    ],
    links: [['Website UX design service', '/website-ux-design.html'], ['Morajaa website UX case study', '/project-morajaa.html'], ['Hamro Idea website case study', '/project-hamro-idea.html']],
  },
];

function articlePage(article) {
  const canonical = `/blog/${article.slug}`;
  const schema = articleSchema({ ...article, canonical });
  return `${head({ title: `${article.title} | Nischhal Raj Subba`, description: article.description, canonical, type: 'article', schema })}
  <body>
    ${nav('writing')}
    <main class="container nrs-seo-article">
      <article class="section-container" style="padding-top:150px;max-width:900px;">
        <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Product design article</p>
        <h1 class="hero-title" style="max-width:980px;">${escapeHtml(article.title)}</h1>
        <p class="body-large" style="margin-top:24px;color:var(--text-secondary);">${escapeHtml(article.intro)}</p>
        <div class="hero-proof-strip" style="margin-top:28px;"><span>Written by Nischhal Raj Subba</span><span>Updated ${today}</span><span>${escapeHtml(article.intent)}</span></div>
      </article>
      <section class="section-container" style="padding-top:0;max-width:900px;">
        <ul class="case-list">
          ${article.sections.map(([heading, body]) => `<li><strong>${escapeHtml(heading)}:</strong> ${escapeHtml(body)}</li>`).join('\n          ')}
        </ul>
      </section>
      <section class="section-container" style="border-top:1px solid var(--border-faint);max-width:900px;">
        <div class="section-header"><p class="eyebrow">Related pages</p><h2 class="section-title">Use this with real portfolio context.</h2><p class="section-lead">These links connect the article to public proof, service intent, and contact paths.</p></div>
        <div class="prototype-link-list">
          ${article.links.map(([label, href]) => `<a class="prototype-link-card" href="${href}"><span style="display:block;font-weight:850;">${escapeHtml(label)}</span><span style="color:var(--text-secondary);">Open related page</span></a>`).join('\n          ')}
          <a class="prototype-link-card" href="/media-kit.html"><span style="display:block;font-weight:850;">Media kit and proof links</span><span style="color:var(--text-secondary);">Use official profile and citation details</span></a>
        </div>
      </section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`;
}

function mediaKitPage() {
  const schema = `<script type="application/ld+json" id="nrs-media-kit-schema">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE}/media-kit.html#profile`,
    url: `${SITE}/media-kit.html`,
    name: 'Nischhal Raj Subba media kit and proof links',
    about: { '@id': `${SITE}/#nischhal-raj-subba`, '@type': 'Person', name: 'Nischhal Raj Subba', jobTitle: 'Product Designer' },
  })}</script>`;

  return `${head({ title: 'Media Kit & Proof Links | Nischhal Raj Subba', description: 'Official media kit, short bio, long bio, proof links, resume, portfolio, social profiles and citation guidance for Nischhal Raj Subba, Product Designer in Nepal.', canonical: '/media-kit.html', type: 'profile', schema })}
  <body>
    ${nav('about')}
    <main class="container">
      <section class="hero-section" style="min-height:auto;padding-top:150px;padding-bottom:62px;align-items:flex-start;text-align:left;">
        <p class="eyebrow">Media kit</p>
        <h1 class="hero-title">Official profile, proof links, and citation details.</h1>
        <p class="body-large" style="max-width:820px;color:var(--text-secondary);">Use this page when referencing Nischhal Raj Subba in articles, directories, communities, AI summaries, hiring notes, or backlink placements.</p>
      </section>
      <section class="section-container" style="padding-top:0;">
        <div class="snapshot-grid">
          <div><h5>Name</h5><p>Nischhal Raj Subba</p></div>
          <div><h5>Role</h5><p>Product Designer</p></div>
          <div><h5>Location</h5><p>Nepal / Remote</p></div>
          <div><h5>Email</h5><p>${email}</p></div>
          <div><h5>Primary URL</h5><p>${SITE}/</p></div>
          <div><h5>Focus</h5><p>UX/UI, Web3, SaaS, fintech, design systems, handoff</p></div>
        </div>
      </section>
      <section class="section-container" style="border-top:1px solid var(--border-faint);">
        <div class="section-header"><p class="eyebrow">Bios</p><h2 class="section-title">Short and long profile copy</h2></div>
        <div class="journey-grid">
          <article class="journey-card"><span class="eyebrow">Short bio</span><h3>One sentence</h3><p>Nischhal Raj Subba is a Product Designer in Nepal focused on UX/UI, Web3 flows, SaaS dashboards, fintech workflows, service websites, design systems, and developer-ready handoff.</p></article>
          <article class="journey-card"><span class="eyebrow">Long bio</span><h3>Professional summary</h3><p>Nischhal Raj Subba helps product and software teams clarify complex flows, design polished interfaces, create practical Figma systems, prototype key interactions, and hand off work engineers can build. His portfolio includes public work across Web3 UX, SaaS dashboards, fintech workflows, logistics apps, B2B websites, WordPress LMS contribution, and front-end-aware product design.</p></article>
        </div>
      </section>
      <section class="section-container" style="border-top:1px solid var(--border-faint);">
        <div class="section-header"><p class="eyebrow">Proof links</p><h2 class="section-title">Use these as citation and verification points.</h2><p class="section-lead">Do not invent awards, rankings, client outcomes, revenue metrics, or testimonials. Use only visible proof.</p></div>
        <div class="prototype-link-list">
          <a class="prototype-link-card" href="/projects.html"><strong>Portfolio</strong><span>Selected product design work</span></a>
          <a class="prototype-link-card" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><strong>Resume PDF</strong><span>Experience and skills</span></a>
          <a class="prototype-link-card" href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><strong>Uxcel</strong><span>Public UX/UI learning profile</span></a>
          <a class="prototype-link-card" href="https://www.behance.net/nischhal" target="_blank" rel="noopener"><strong>Behance</strong><span>External design profile</span></a>
          <a class="prototype-link-card" href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener"><strong>LinkedIn</strong><span>Professional profile</span></a>
          <a class="prototype-link-card" href="https://github.com/Nischhalsubba" target="_blank" rel="noopener"><strong>GitHub</strong><span>Technical identity</span></a>
          <a class="prototype-link-card" href="/llms.txt"><strong>llms.txt</strong><span>AI-readable summary</span></a>
          <a class="prototype-link-card" href="/ai-profile.json"><strong>ai-profile.json</strong><span>Machine-readable profile</span></a>
        </div>
      </section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`;
}

const projectSeo = {
  'project-yarsha.html': ['Web3 messaging app UX case study', '/web3-ux-designer.html'],
  'project-mokshya.html': ['Web3 protocol website design case study', '/web3-ux-designer.html'],
  'project-hamro-idea.html': ['Software company website UX case study', '/website-ux-design.html'],
  'project-morajaa.html': ['B2B consulting website UX case study', '/website-ux-design.html'],
  'project-pihub.html': ['Fintech app UX case study', '/product-design-nepal.html'],
  'project-zapp.html': ['Logistics mobile app UX case study', '/product-design-nepal.html'],
  'project-masteriyo.html': ['WordPress LMS product design contribution', '/saas-ux-designer.html'],
  'project-neverwinter-parser.html': ['Gaming analytics desktop app UI case study', '/product-design-nepal.html'],
  'project-orkest.html': ['SaaS dashboard UX architecture case study', '/saas-ux-designer.html'],
  'project-splashnode.html': ['Technical platform website UX case study', '/website-ux-design.html'],
  'project-grid-labs.html': ['Hosting landing page UI case study', '/website-ux-design.html'],
  'project-zakra-furniture.html': ['WordPress furniture starter website design case study', '/website-ux-design.html'],
  'project-designerex.html': ['Fashion marketplace UI contribution case study', '/product-design-nepal.html'],
  'project-sassboilerplate.html': ['Sass front-end starter structure case study', '/figma-design-systems.html'],
};

function enhanceProjectPage(file, [intent, serviceLink]) {
  const filePath = path.join(root, file);
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/\s*<section id="project-seo-asset"[\s\S]*?<\/section>/, '');
  const section = `
      <section id="project-seo-asset" class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);">
        <div class="section-header"><p class="eyebrow">Search context</p><h2 class="section-title">Why this case study is relevant</h2><p class="section-lead">This page is structured around the search intent: ${escapeHtml(intent)}. It connects the visible work, role, scope, design decisions, proof links, and related service context without inventing private metrics.</p></div>
        <div class="prototype-link-list">
          <a class="prototype-link-card" href="${serviceLink}"><strong>Related service</strong><span>See the matching design service page</span></a>
          <a class="prototype-link-card" href="/projects.html"><strong>More work</strong><span>Browse all product design case studies</span></a>
          <a class="prototype-link-card" href="/media-kit.html"><strong>Proof links</strong><span>Use official profile and citation information</span></a>
          <a class="prototype-link-card" href="/contact.html"><strong>Discuss similar work</strong><span>Contact Nischhal about product design support</span></a>
        </div>
      </section>`;
  html = html.replace('</main>', `${section}\n    </main>`);
  fs.writeFileSync(filePath, html, 'utf8');
}

function updateBlogIndex() {
  const filePath = path.join(root, 'blog', 'index.html');
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/\s*<section id="nrs-seo-growth-writing"[\s\S]*?<\/section>/, '');
  const links = articles.map((article) => `<a href="/blog/${article.slug}" class="writing-item" data-category="seo ux product design"><span class="w-date">Jun 24, 2026</span><div class="w-info"><span class="w-title">${escapeHtml(article.navTitle)}</span><span class="w-summary">${escapeHtml(article.description)}</span></div><span class="w-arrow">&rarr;</span></a>`).join('\n          ');
  const section = `
      <section id="nrs-seo-growth-writing" class="section-container" style="border-top:1px solid var(--border-faint);">
        <div class="section-header"><p class="eyebrow">Practical SEO series</p><h2 class="section-title">Answers to hiring and client questions.</h2><p class="section-lead">Focused articles that connect product design expertise to real search intent, case studies, and service pages.</p></div>
        <div class="writing-list reveal-on-scroll">
          ${links}
        </div>
      </section>`;
  html = html.replace('</main>', `${section}\n    </main>`);
  fs.writeFileSync(filePath, html, 'utf8');
}

function writeDocs() {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  const doc = `# SEO and AI Visibility QA Plan

Last updated: ${today}

## Objective

Increase qualified organic visibility for Nischhal Raj Subba by making the site crawlable, intent-aligned, proof-backed, internally linked, and easy for AI/search systems to summarize without inventing claims.

## Implemented assets

- Search intent metadata per important page.
- Proof-backed AI profile and llms.txt.
- humans.txt for human-readable identity verification.
- Media kit page for backlinks, citations, and profile references.
- Practical articles for hiring/client questions.
- Project-page SEO context sections.
- Analytics event hooks for resume, contact, project, proof, and AI discovery clicks.

## Monthly QA checklist

1. Submit sitemap in Google Search Console and Bing Webmaster Tools.
2. Inspect and request indexing for homepage, About, Projects, Media Kit, top service pages, and new articles.
3. Check queries for: Product Designer Nepal, Web3 UX Designer, SaaS UX Designer, fintech UX designer, developer-ready Figma handoff, UX audit before redesign.
4. Check which pages get impressions but low CTR; improve title and meta description first.
5. Check zero-impression pages; add internal links or rewrite intent.
6. Validate structured data for homepage, About, Media Kit, articles, and project pages.
7. Confirm no unsupported awards, rankings, testimonials, revenue, or conversion metrics appear.
8. Share one article or case study externally each week on LinkedIn, Behance, Uxcel/GitHub profile links, or relevant communities.

## Backlink targets

- LinkedIn profile featured links.
- Behance project descriptions.
- Uxcel profile website link.
- GitHub profile README.
- Nepal design/developer directories.
- Guest posts or community posts around Web3 UX, SaaS dashboard UX, handoff, and website UX.

## Analytics events

Runtime emits CustomEvent('nrs:analytics') and optional dataLayer/gtag/plausible events for:

- resume_download_click
- email_click
- contact_cta_click
- project_case_study_click
- portfolio_click
- ai_discovery_file_click
- external_proof_click

`;
  fs.writeFileSync(path.join(root, 'docs', 'seo-ai-visibility-plan.md'), doc, 'utf8');
}

function writeArticlePages() {
  fs.mkdirSync(path.join(root, 'blog'), { recursive: true });
  for (const article of articles) {
    fs.writeFileSync(path.join(root, 'blog', article.slug), `${articlePage(article)}\n`, 'utf8');
  }
}

writeArticlePages();
fs.writeFileSync(path.join(root, 'media-kit.html'), `${mediaKitPage()}\n`, 'utf8');
Object.entries(projectSeo).forEach(([file, config]) => enhanceProjectPage(file, config));
updateBlogIndex();
writeDocs();

console.log('Ensured SEO growth assets: articles, media kit, project SEO sections, and QA docs.');
