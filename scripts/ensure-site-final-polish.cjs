/**
 * @fileoverview scripts/ensure-site-final-polish.cjs
 * Purpose: Apply the ensure site final polish production transformation or maintenance step while preserving canonical source/build contracts.
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
const email = 'hinischalsubba@gmail.com';
const styleHref = '/style.css?v=41.0';

const pageCopy = {
  'index.html': { title: 'Nischhal Raj Subba - Product Designer for SaaS, Web3 and UX Systems', description: 'Nepal-based product designer helping SaaS, Web3, fintech and software teams improve UX flows, interfaces, design systems and developer-ready handoff.' },
  'home-v2.html': { title: 'Nischhal Raj Subba - UX/UI Product Designer', description: 'Selected product design work, UX case studies, interface systems and practical handoff examples by Nischhal Raj Subba.' },
  'about.html': { title: 'About Nischhal Raj Subba - Product Designer in Nepal', description: 'Learn about Nischhal Raj Subba, a Nepal-based product designer focused on UX strategy, interface design, design systems and implementation-ready handoff.' },
  'projects.html': { title: 'Product Design Work - Nischhal Raj Subba', description: 'Explore UX/UI case studies for Web3, SaaS, fintech, dashboards, websites and product systems designed by Nischhal Raj Subba.' },
  'services.html': { title: 'Product Design Services - UX/UI, Design Systems and Handoff', description: 'Product design support for startups and software teams: UX audits, interface design, design systems, website UX and developer handoff.' },
  'contact.html': { title: 'Contact Nischhal Raj Subba - Product Design Support', description: 'Contact Nischhal Raj Subba for product design, UX/UI, design systems, audits, website UX and handoff support.' },
  'blog/index.html': { title: 'Product Design Writing - UX, Web3, SaaS and Handoff', description: 'Practical product design articles about SaaS UX, Web3 flows, design systems, website UX, portfolio strategy and developer handoff.' },
  'blog.html': { title: 'Product Design Blog - Nischhal Raj Subba', description: 'Writing on practical UX/UI, product design systems, dashboards, Web3 product flows, website clarity and front-end-aware handoff.' },
  'product-design-nepal.html': { title: 'Product Designer in Nepal - UX/UI for Software Teams', description: 'Hire a Nepal-based product designer for UX strategy, interface design, responsive product flows, design systems and practical handoff.' },
  'ux-audit.html': { title: 'UX Audit Service - Improve Product Clarity Before Redesign', description: 'A focused UX audit for software products, dashboards and websites to find friction, unclear flows, weak hierarchy and conversion issues.' },
  'figma-design-systems.html': { title: 'Figma Design Systems - Scalable UI Components and Handoff', description: 'Create clearer Figma design systems with reusable components, responsive rules, interaction states, documentation and developer handoff.' },
  'web3-ux-designer.html': { title: 'Web3 UX Designer - Wallets, Protocols and Transaction Flows', description: 'UX/UI design for Web3 wallets, dashboards, transaction review, protocol websites and trust-building product flows.' },
  'saas-ux-designer.html': { title: 'SaaS UX Designer - Dashboards, Admin Tools and Product Workflows', description: 'UX/UI design for SaaS dashboards, admin workflows, onboarding, filters, role-based views, empty states and product systems.' },
  'website-ux-design.html': { title: 'Website UX Design - Clearer Product and Service Websites', description: 'Website UX design for software teams that need clearer messaging, page hierarchy, conversion paths and responsive interfaces.' },
  'project-yarsha.html': { title: 'Yarsha Case Study - Web3 Messaging App UX/UI Design', description: 'A product design case study for Yarsha, covering Web3 messaging, wallet actions, chat flows, payments and practical mobile UX.' },
  'project-mokshya.html': { title: 'Mokshya Case Study - Web3 Protocol Website Design', description: 'A Web3 website UX case study focused on clearer protocol messaging, trust cues, visual hierarchy and technical visitor journeys.' },
  'project-morajaa.html': { title: 'Morajaa Case Study - Consulting Website UX and Visual Design', description: 'A B2B website design case study focused on clearer positioning, page structure, service messaging and conversion-ready UX.' },
  'project-pihub.html': { title: 'piHub Case Study - Dashboard and Product Workflow Design', description: 'A product design case study for piHub covering dashboard structure, user flows, interface clarity and operational product UX.' },
  'project-zapp.html': { title: 'Zapp Today Case Study - Mobile Product UX/UI Design', description: 'A mobile product design case study covering app flows, interaction clarity, interface hierarchy and practical product experience.' },
  'project-masteriyo.html': { title: 'Masteriyo Case Study - WordPress LMS UX/UI Design', description: 'A WordPress LMS product design case study focused on course flows, admin usability, design systems and learning product UX.' },
  'blog/saas-dashboard-ux-checklist.html': { title: 'SaaS Dashboard UX Checklist - Filters, Tables, States and Roles', description: 'A practical SaaS dashboard UX checklist for improving tables, filters, metrics, role-based views, onboarding and operational workflows.' },
  'blog/web3-wallet-ux-checklist.html': { title: 'Web3 Wallet UX Checklist - Signing, Permissions and Trust', description: 'A practical checklist for Web3 wallet UX, covering signing context, permissions, transaction review, risk language and confirmation states.' },
  'blog/figma-handoff-notes-for-developers.html': { title: 'Figma Handoff Notes for Developers - Practical UX Documentation', description: 'How to write useful Figma handoff notes for developers, including states, edge cases, responsive rules, QA notes and implementation priorities.' },
  'blog/ux-audit-checklist-before-redesign.html': { title: 'UX Audit Checklist Before Redesign - Find Friction First', description: 'A practical UX audit checklist for finding product friction, unclear flows, weak hierarchy and redesign risks before creating new screens.' },
  'blog/website-ux-checklist-software-companies.html': { title: 'Website UX Checklist for Software Companies', description: 'A website UX checklist for software companies that need clearer positioning, page hierarchy, service copy and conversion paths.' },
};

const footer = `<footer class="site-footer"><div class="container"><div class="footer-top-grid"><div class="footer-cta"><p class="eyebrow">Available for selected work</p><h2>Product design support for clearer software.</h2><p>I help teams improve UX structure, interface clarity, design systems, responsive behavior and developer-ready handoff.</p><div class="cta-group"><a href="/contact.html" class="footer-email-btn">Discuss a project</a><a href="/assets/resume.pdf" class="btn btn-secondary" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a></div></div><div class="footer-nav-grid"><div class="footer-col"><h5>Pages</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/services.html">Services</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a></div><div class="footer-col"><h5>Services</h5><a href="/product-design-nepal.html">Product design</a><a href="/ux-audit.html">UX audit</a><a href="/figma-design-systems.html">Design systems</a><a href="/web3-ux-designer.html">Web3 UX</a><a href="/saas-ux-designer.html">SaaS UX</a><a href="/website-ux-design.html">Website UX</a></div><div class="footer-col"><h5>Selected work</h5><a href="/project-yarsha.html">Yarsha</a><a href="/project-mokshya.html">Mokshya</a><a href="/project-morajaa.html">Morajaa</a><a href="/project-pihub.html">piHub</a><a href="/project-zapp.html">Zapp Today</a><a href="/project-masteriyo.html">Masteriyo</a></div><div class="footer-col"><h5>Contact and proof</h5><a href="mailto:${email}">${email}</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume PDF</a><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener">Behance</a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener">Uxcel</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener">LinkedIn</a></div></div></div><div class="footer-bottom-bar"><span>(c) 2026 Nischhal Raj Subba.</span><span>UX/UI, product systems and handoff for software teams.</span></div></div></footer>`;

const floatingResume = '<a class="floating-resume-btn" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a>';
const homeHero = `      <section class="hero-section nrs-home-hero-clean">
        <p class="eyebrow reveal-on-scroll">Product designer in Nepal for Web3, SaaS, fintech and software teams</p>
        <h1 class="hero-title reveal-on-scroll">I design clearer product flows, interfaces and handoff.</h1>
        <p class="body-large reveal-on-scroll">I help teams turn messy product requirements into usable UX, polished UI, practical design systems and implementation-ready Figma work.</p>
        <div class="hero-actions reveal-on-scroll cta-group"><a href="/projects.html" class="btn btn-primary">View selected work</a><a href="/contact.html" class="btn btn-secondary">Discuss a project</a><a href="/assets/resume.pdf" class="btn btn-secondary" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a></div>
        <div class="hero-proof-strip reveal-on-scroll" aria-label="Core design strengths"><span>UX strategy</span><span>Interface design</span><span>Design systems</span><span>Website UX</span><span>Developer handoff</span></div>
      </section>`;

const cssPatch = `

/* nrs-final-polish-v41 */
html[data-theme='light'] .nav-pill{background:rgba(255,255,255,.98)!important;border-color:rgba(17,19,18,.18)!important;box-shadow:0 18px 54px rgba(17,19,18,.12)!important;}
html[data-theme='light'] .nav-link{color:#111312!important;}
html[data-theme='light'] .nav-link:hover,html[data-theme='light'] .nav-link:focus-visible{color:#111312!important;background:rgba(17,19,18,.075)!important;}
html[data-theme='light'] .nav-link.active,html[data-theme='light'] .nav-link[aria-current='page'],html[data-theme='light'] .mobile-nav-links a.active,html[data-theme='light'] .mobile-nav-links a[aria-current='page']{color:#fff!important;background:#111312!important;border-color:#111312!important;}
html[data-theme='light'] .theme-toggle-btn{background:rgba(255,255,255,.98)!important;color:#111312!important;border-color:rgba(17,19,18,.18)!important;}
main.container>section,main.container>article,.section-container,.nrs-case-section,.nrs-services-section,.nrs-contact-section,.nrs-blog-hub-shell,.nrs-article-frame,.nrs-blog-detail-surface,.nrs-case-study,main:has(.case-hero-img-container),body.nrs-services-redesign main.container,body.nrs-contact-page main.container,.nrs-about-redesign{width:var(--site-width)!important;max-width:var(--site-width)!important;margin-left:auto!important;margin-right:auto!important;}
.section-container>*,.nrs-case-section>*,.nrs-services-section>*,.nrs-contact-section>*,.impact-summary-grid,.project-grid,.journey-grid,.case-list,.prototype-link-list,.nrs-services-grid,.nrs-services-process,.nrs-services-fit,.nrs-services-list,.nrs-contact-v3-guidance,.nrs-contact-v3-meta,.nrs-contact-form-grid,.snapshot-grid,.writing-list,.clarity-snapshot,.clarity-section,.clarity-section-body,.clarity-pill-grid{width:100%!important;max-width:none!important;}
.section-header,.nrs-services-section-head,.nrs-case-hero,main:has(.case-hero-img-container) .hero-section,article.section-container,.nrs-blog-detail-surface,.clarity-hero,.nrs-about-redesign .hero-section{width:100%!important;max-width:var(--site-width)!important;margin-left:0!important;margin-right:auto!important;text-align:left!important;}
.nrs-about-redesign .hero-title,.nrs-about-redesign .body-large,.nrs-about-redesign .section-title,.nrs-about-redesign .section-lead{margin-left:0!important;margin-right:auto!important;}
.nrs-about-redesign .clarity-section{display:grid!important;grid-template-columns:minmax(160px,260px) minmax(0,1fr)!important;gap:clamp(28px,5vw,88px)!important;align-items:start!important;padding-block:clamp(76px,8vw,126px)!important;}
.nrs-about-redesign .clarity-section-label{width:100%!important;}
.nrs-about-redesign .journey-grid,.nrs-about-redesign .clarity-pill-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
main.container>.section-container[style*='text-align:center'],main.container>.section-container:has(.section-title):has(.btn-primary){display:grid!important;grid-template-columns:minmax(0,.72fr) minmax(260px,.28fr)!important;gap:clamp(28px,5vw,72px)!important;align-items:end!important;text-align:left!important;padding:clamp(46px,6vw,82px)!important;border:1px solid var(--border-faint)!important;border-radius:var(--radius-xl)!important;background:var(--bg-panel)!important;}
main.container>.section-container[style*='text-align:center'] .section-title,main.container>.section-container:has(.section-title):has(.btn-primary) .section-title{max-width:860px!important;margin:0!important;}
main.container>.section-container[style*='text-align:center'] .body-large,main.container>.section-container[style*='text-align:center'] .section-lead,main.container>.section-container:has(.section-title):has(.btn-primary) .body-large,main.container>.section-container:has(.section-title):has(.btn-primary) .section-lead{max-width:620px!important;margin:0!important;align-self:end!important;}
main.container>.section-container[style*='text-align:center'] .btn,main.container>.section-container:has(.section-title):has(.btn-primary) .btn{width:auto!important;justify-self:start!important;align-self:end!important;}
main.container>.section-container>div[style*='text-align:center']{display:grid!important;grid-template-columns:minmax(0,.55fr) minmax(320px,.45fr)!important;gap:clamp(28px,5vw,78px)!important;align-items:end!important;text-align:left!important;width:100%!important;max-width:none!important;margin:0!important;}
main.container>.section-container>div[style*='text-align:center'] .eyebrow{grid-column:1/-1!important;margin:0!important;}
main.container>.section-container>div[style*='text-align:center'] .section-title{grid-column:1!important;margin:0!important;max-width:760px!important;}
main.container>.section-container>div[style*='text-align:center'] .section-lead{grid-column:2!important;margin:0!important;max-width:560px!important;}
.nrs-services-section-head{grid-template-columns:1fr!important;gap:18px!important;max-width:900px!important;margin-left:0!important;margin-bottom:clamp(42px,5vw,76px)!important;}
.nrs-services-section-head h2{max-width:820px!important;margin:0!important;}
.nrs-services-grid{align-items:stretch!important;}
.nrs-service-card{display:grid!important;grid-template-rows:auto minmax(96px,auto) 1fr auto!important;align-content:start!important;gap:24px!important;min-height:360px!important;padding:clamp(28px,3vw,44px)!important;}
.nrs-service-card h3{min-height:2.1em!important;display:flex!important;align-items:flex-end!important;margin:0!important;line-height:1.02!important;}
.nrs-service-card p{margin:0!important;-webkit-line-clamp:unset!important;}
.nrs-service-card a,.nrs-service-card .btn{align-self:end!important;justify-self:start!important;}
.nrs-services-fit{display:grid!important;grid-template-columns:minmax(0,.9fr) minmax(420px,1.1fr)!important;gap:0!important;overflow:hidden!important;border:1px solid var(--border-faint)!important;border-radius:var(--radius-xl)!important;background:var(--bg-panel)!important;}
.nrs-services-fit-card,.nrs-services-cta{border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;padding:clamp(40px,5vw,78px)!important;}
.nrs-services-fit-card h2,.nrs-services-cta h2{max-width:820px!important;font-size:clamp(2.6rem,5.5vw,6rem)!important;line-height:.96!important;margin:0!important;}
.nrs-services-fit-card p,.nrs-services-cta p{max-width:720px!important;margin-top:22px!important;}
.nrs-services-list{border:0!important;border-left:1px solid var(--hairline)!important;border-radius:0!important;background:transparent!important;align-self:stretch!important;}
.nrs-services-list li{grid-template-columns:minmax(120px,180px) minmax(0,1fr)!important;align-items:center!important;padding:clamp(24px,3vw,38px)!important;min-height:128px!important;}
main:has(.case-hero-img-container) .section-container,main:has(.case-hero-img-container) .case-hero-img-container,main:has(.case-hero-img-container) .snapshot-grid,main:has(.case-hero-img-container) .case-list,.nrs-case-study .section-container,.nrs-case-study .snapshot-grid,.nrs-case-study .case-list{width:100%!important;max-width:none!important;margin-left:0!important;margin-right:0!important;}
main:has(.case-hero-img-container) .nrs-case-hero,main:has(.case-hero-img-container) .hero-section,.nrs-case-study .nrs-case-hero{width:100%!important;max-width:var(--site-width)!important;margin-left:0!important;margin-right:0!important;}
.site-footer .footer-top-grid{grid-template-columns:minmax(280px,.85fr) minmax(520px,1.15fr)!important;gap:clamp(32px,5vw,72px)!important;align-items:start!important;}
.site-footer .footer-nav-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:clamp(20px,3vw,40px)!important;}
.footer-bottom-bar{display:flex!important;justify-content:space-between!important;gap:16px!important;flex-wrap:wrap!important;}
.floating-resume-btn{position:fixed!important;right:24px!important;bottom:24px!important;z-index:5002!important;display:inline-flex!important;min-height:48px!important;padding:0 22px!important;border-radius:999px!important;box-shadow:0 16px 46px rgba(0,0,0,.28)!important;}
@media (max-width:980px){main.container>.section-container[style*='text-align:center'],main.container>.section-container:has(.section-title):has(.btn-primary),main.container>.section-container>div[style*='text-align:center'],.nrs-services-fit,.nrs-about-redesign .clarity-section{grid-template-columns:1fr!important;}.site-footer .footer-top-grid,.site-footer .footer-nav-grid,.nrs-about-redesign .journey-grid,.nrs-about-redesign .clarity-pill-grid{grid-template-columns:1fr 1fr!important;}.nrs-services-list{border-left:0!important;border-top:1px solid var(--hairline)!important;}main.container>.section-container>div[style*='text-align:center'] .section-title,main.container>.section-container>div[style*='text-align:center'] .section-lead{grid-column:auto!important;}}
@media (max-width:680px){.site-footer .footer-top-grid,.site-footer .footer-nav-grid,.nrs-about-redesign .journey-grid,.nrs-about-redesign .clarity-pill-grid{grid-template-columns:1fr!important;}.nrs-services-list li{grid-template-columns:1fr!important;}.floating-resume-btn{right:16px!important;bottom:16px!important;max-width:calc(100vw - 32px)!important;}}
`;

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure site final polish repository tool.
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
 * Function contract: relKey
 * Purpose: Implement the rel key responsibility owned by the ensure site final polish repository tool.
 * Inputs: `filePath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function relKey(filePath) { return path.relative(targetRoot, filePath).replaceAll(path.sep, '/'); }
/**
 * Function contract: upsertTitle
 * Purpose: Implement the upsert title responsibility owned by the ensure site final polish repository tool.
 * Inputs: `html`: input consumed by this operation; `title`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function upsertTitle(html, title) { if (!title) return html; if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`); return html.replace('</head>', `    <title>${title}</title>\n  </head>`); }
/**
 * Function contract: upsertMeta
 * Purpose: Implements the upsert meta responsibility for this module.
 * Inputs: html, attr, name, content.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertMeta
 * Purpose: Implement the upsert meta responsibility owned by the ensure site final polish repository tool.
 * Inputs: `html`: input consumed by this operation; `attr`: input consumed by this operation; `name`: stable identifier or label for the current item; `content`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function upsertMeta(html, attr, name, content) { if (!content) return html; const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const pattern = new RegExp(`<meta\\s+${attr}=["']${escapedName}["'][^>]*>`, 'i'); const tag = `<meta ${attr}="${name}" content="${content}">`; if (pattern.test(html)) return html.replace(pattern, tag); return html.replace('</head>', `    ${tag}\n  </head>`); }
/**
 * Function contract: applySeoCopy
 * Purpose: Apply seo copy consistently while preserving the surrounding ensure site final polish repository tool contract.
 * Inputs: `html`: input consumed by this operation; `filePath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function applySeoCopy(html, filePath) { const copy = pageCopy[relKey(filePath)] || pageCopy[relKey(filePath).replace(/\/index\.html$/, '/index.html')]; if (!copy) return html; let output = upsertTitle(html, copy.title); output = upsertMeta(output, 'name', 'description', copy.description); output = upsertMeta(output, 'property', 'og:title', copy.title); output = upsertMeta(output, 'property', 'og:description', copy.description); output = upsertMeta(output, 'name', 'twitter:title', copy.title); output = upsertMeta(output, 'name', 'twitter:description', copy.description); return output; }
/**
 * Function contract: normalizeStylesheetLinks
 * Purpose: Apply stylesheet links consistently while preserving the surrounding ensure site final polish repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function normalizeStylesheetLinks(html) { let output = html.replace(/\s*<link\s+[^>]*rel=["']stylesheet["'][^>]*>\s*/gi, '\n'); if (!output.includes('</head>')) return output; return output.replace('</head>', `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`); }
/**
 * Function contract: rewriteHomeHero
 * Purpose: Implement the rewrite home hero responsibility owned by the ensure site final polish repository tool.
 * Inputs: `html`: input consumed by this operation; `filePath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function rewriteHomeHero(html, filePath) { const key = relKey(filePath); if (key !== 'index.html' && key !== 'home-v2.html') return html; const oldHero = /      <section class="hero-section[^"]*nrs-home-hero[^"]*"[\s\S]*?      <\/section>/; const cleanHero = /      <section class="hero-section nrs-home-hero-clean">[\s\S]*?      <\/section>/; if (oldHero.test(html)) return html.replace(oldHero, homeHero); if (cleanHero.test(html)) return html.replace(cleanHero, homeHero); return html; }
/**
 * Function contract: ensureFooter
 * Purpose: Apply footer consistently while preserving the surrounding ensure site final polish repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function ensureFooter(html) { if (html.includes('<footer class="site-footer"')) return html.replace(/<footer class="site-footer">[\s\S]*?<\/footer>/g, footer); if (html.includes('</body>')) return html.replace('</body>', `    ${footer}\n  </body>`); return html; }
/**
 * Function contract: ensureFloatingResume
 * Purpose: Applies ensure floating resume while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: ensureFloatingResume
 * Purpose: Apply floating resume consistently while preserving the surrounding ensure site final polish repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function ensureFloatingResume(html) { let output = html.replace(/\s*<a\s+class="floating-resume-btn"[\s\S]*?<\/a>/g, ''); if (!output.includes('</body>')) return output; return output.replace('</body>', `    ${floatingResume}\n  </body>`); }
/**
 * Function contract: removeVisibleAiCopy
 * Purpose: Removes or cleans remove visible ai copy while keeping required outputs intact.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: removeVisibleAiCopy
 * Purpose: Remove visible ai copy without disturbing required surrounding ensure site final polish repository tool state.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function removeVisibleAiCopy(html) { let output = html; output = output.replace(/<a[^>]+href="\/ai-profile\.json"[\s\S]*?<\/a>/gi, ''); output = output.replace(/<a[^>]+href="\/llms\.txt"[\s\S]*?<\/a>/gi, ''); output = output.replace(/AI-readable/gi, 'Site-readable'); output = output.replace(/AI discovery/gi, 'Search discovery'); output = output.replace(/AI agents/gi, 'hiring teams'); output = output.replace(/For AI agents and hiring teams/gi, 'Plain summary'); output = output.replace(/for AI, search, and human verification/gi, 'for search and human verification'); output = output.replace(/AI and human/gi, 'search and human'); output = output.replace(/\bAI\b/g, ''); output = output.replace(/\s{2,}/g, ' '); return output; }
/**
 * Function contract: alignAboutHero
 * Purpose: Implements the align about hero responsibility for this module.
 * Inputs: html, filePath.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: alignAboutHero
 * Purpose: Implement the align about hero responsibility owned by the ensure site final polish repository tool.
 * Inputs: `html`: input consumed by this operation; `filePath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function alignAboutHero(html, filePath) { if (path.basename(filePath) !== 'about.html') return html; return html.replace(/center-aligned-hero/g, '').replace(/text-align:center/g, 'text-align:left').replace(/margin-left:auto;margin-right:auto/g, 'margin-left:0;margin-right:auto').replace(/margin:16px auto 28px/g, 'margin:16px 0 28px'); }
/**
 * Function contract: polishHtml
 * Purpose: Applies polish html while preserving the surrounding repository/runtime contract.
 * Inputs: filePath.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: polishHtml
 * Purpose: Apply html consistently while preserving the surrounding ensure site final polish repository tool contract.
 * Inputs: `filePath`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Boolean predicate result consumed by the caller.
 */
function polishHtml(filePath) { let html = fs.readFileSync(filePath, 'utf8'); const before = html; html = normalizeStylesheetLinks(html); html = applySeoCopy(html, filePath); html = rewriteHomeHero(html, filePath); html = removeVisibleAiCopy(html); html = alignAboutHero(html, filePath); html = ensureFooter(html); html = ensureFloatingResume(html); if (html !== before) fs.writeFileSync(filePath, html, 'utf8'); return html !== before; }
/**
 * Function contract: polishCss
 * Purpose: Applies polish css while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: polishCss
 * Purpose: Apply css consistently while preserving the surrounding ensure site final polish repository tool contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Boolean predicate result consumed by the caller.
 */
function polishCss() { const cssPath = path.join(targetRoot, 'style.css'); if (!fs.existsSync(cssPath)) return false; let css = fs.readFileSync(cssPath, 'utf8'); css = css.replace(/Version:\s*[0-9.]+/i, 'Version: 41.0'); css = css.replace(/\/\* nrs-final-polish-v39 \*\/[\s\S]*?(?=\/\* nrs-final-polish-v4\d \*\/|$)/g, ''); css = css.replace(/\/\* nrs-final-polish-v40 \*\/[\s\S]*?(?=\/\* nrs-final-polish-v4\d \*\/|$)/g, ''); if (!css.includes('nrs-final-polish-v41')) css += cssPatch; fs.writeFileSync(cssPath, css, 'utf8'); return true; }

let changedHtml = 0;
for (const file of walk(targetRoot).filter(/** Callback contract: Processes the callback step for walk(target root) without leaking orchestration details to the caller. Inputs: filePath. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `filePath`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (filePath) => filePath.endsWith('.html'))) if (polishHtml(file)) changedHtml += 1;
const changedCss = polishCss();
console.log(`Applied final site polish v41 to ${changedHtml} HTML file(s)${changedCss ? ' and style.css' : ''}.`);
