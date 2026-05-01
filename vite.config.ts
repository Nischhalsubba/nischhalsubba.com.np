import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const page = (filePath: string) => path.resolve(__dirname, filePath);
const SITE = 'https://nischhalsubba.com.np';

type SeoEntry = {
  name: string;
  type: string;
  focus: string;
  role: string;
  parentName: string;
  parentUrl: string;
  schemaType: 'CreativeWork' | 'Article';
  related: [string, string][];
  faqs: [string, string][];
};

const projectSeo: Record<string, SeoEntry> = {
  '/project-yarsha.html': {
    name: 'Yarsha Web3 App',
    type: 'Web3 mobile app UX case study',
    focus: 'Mobile Web3 messaging, wallet interaction, blinks, transfers, and transaction review clarity.',
    role: 'Product design for Web3 mobile flows, with emphasis on understandable wallet actions and trust-focused microcopy.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Web3 UX service', '/web3-ux-designer.html'], ['Web3 UX article', '/blog/blog-web3-products.html'], ['Mokshya.io case study', '/project-mokshya.html']],
    faqs: [
      ['What is Yarsha?', 'Yarsha is a mobile-first Web3 messaging experience that combines chat, blinks, wallet interaction, and transfer review.'],
      ['What was Nischhal’s role in Yarsha?', 'Nischhal designed Web3 mobile app flows focused on messaging, wallet actions, transfers, transaction review, and trust-focused microcopy.'],
      ['What UX problem did Yarsha focus on?', 'The design focused on making wallet and transfer actions easier to understand before users commit to sensitive Web3 actions.'],
      ['Why is Yarsha relevant to Web3 UX?', 'Yarsha connects messaging, wallet actions, transaction review, and status feedback in a mobile interface where trust and clarity are important.']
    ]
  },
  '/project-mokshya.html': {
    name: 'Mokshya.io',
    type: 'Web3 protocol website UX case study',
    focus: 'Web3 protocol website clarity, developer-facing storytelling, and product explanation.',
    role: 'Website design focused on hierarchy, positioning, trust, and technical explanation for a Web3 protocol product.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Web3 UX service', '/web3-ux-designer.html'], ['Yarsha case study', '/project-yarsha.html'], ['Web3 UX article', '/blog/blog-web3-products.html']],
    faqs: [
      ['What is Mokshya.io?', 'Mokshya.io is a Web3 protocol website project focused on clearer product explanation and developer-facing storytelling.'],
      ['What was Nischhal’s role in Mokshya.io?', 'Nischhal designed the website experience with a focus on hierarchy, trust, and clearer Web3 product communication.'],
      ['What UX challenge did the website solve?', 'The page structure helped translate a technical Web3 product into clearer sections, navigation, and calls to action.'],
      ['Why is Mokshya relevant to Web3 website UX?', 'It shows how a protocol website needs both technical credibility and simple product explanation.']
    ]
  },
  '/project-hamro-idea.html': {
    name: 'Hamro Idea',
    type: 'Software studio website and brand case study',
    focus: 'Software studio rebrand, service clarity, SEO structure, and static website implementation.',
    role: 'Brand direction, content structure, website UI, and static front-end implementation for a Nepal-based software company.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Website UX service', '/website-ux-design.html'], ['Service website article', '/blog/blog-service-websites.html'], ['Product Design Nepal', '/product-design-nepal.html']],
    faqs: [
      ['What is Hamro Idea?', 'Hamro Idea is a Nepal-based software development company website and rebrand project.'],
      ['What was Nischhal’s role in Hamro Idea?', 'Nischhal worked on brand direction, positioning, website design, content structure, and static front-end implementation.'],
      ['What did the redesign focus on?', 'The redesign focused on clearer service communication, SEO-friendly structure, project presentation, and conversion paths.'],
      ['Why is Hamro Idea relevant to website UX?', 'It shows how a software company website can explain services, process, credibility, and next steps more clearly.']
    ]
  },
  '/project-morajaa.html': {
    name: 'Morajaa',
    type: 'B2B consulting website UX case study',
    focus: 'B2B consulting website UX, service pages, sector pages, and segmented lead collection.',
    role: 'UX and content structure for service pages, sector pages, and guided lead flows for a consulting website.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Website UX service', '/website-ux-design.html'], ['Service website article', '/blog/blog-service-websites.html'], ['Hamro Idea case study', '/project-hamro-idea.html']],
    faqs: [
      ['What is Morajaa?', 'Morajaa is a B2B consulting website project focused on services, sector pages, and segmented lead collection.'],
      ['What was the main UX challenge?', 'The challenge was presenting broad consulting services in a way that felt specific, premium, and easy to act on.'],
      ['What was Nischhal’s role in Morajaa?', 'Nischhal designed service page structures, sector pages, and guided lead flows for the consulting website.'],
      ['What can Morajaa teach about B2B website UX?', 'It shows the value of clear service definitions, sector-specific pages, and inquiry flows that match visitor intent.']
    ]
  },
  '/project-pihub.html': {
    name: 'piHub',
    type: 'Fintech app UX case study',
    focus: 'Fintech workflows for investor, creditor, and admin experiences.',
    role: 'Fintech app UX around applications, verification, credit requests, and profile management.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Product Design Nepal', '/product-design-nepal.html'], ['UX audit service', '/ux-audit.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is piHub?', 'piHub is a fintech app experience involving investor, creditor, and admin workflows.'],
      ['What was Nischhal’s role in piHub?', 'Nischhal worked on fintech app experience around product applications, credit requests, verification, and profile workflows.'],
      ['What UX challenge did piHub involve?', 'The project required making financial tasks, verification states, and role-based workflows easier to understand.'],
      ['Why is piHub relevant to fintech UX?', 'It connects trust, clarity, form design, verification, and dashboard usability in a financial product context.']
    ]
  },
  '/project-masteriyo.html': {
    name: 'Masteriyo LMS',
    type: 'WordPress LMS product design contribution',
    focus: 'Learning management system UX, course/product flows, and WordPress product interface design.',
    role: 'Figma design contribution as part of a multi-designer team. This is intentionally framed as contribution-based work.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Figma Design Systems', '/figma-design-systems.html'], ['SaaS UX service', '/saas-ux-designer.html'], ['Design systems article', '/blog/blog-design-systems-front-end.html']],
    faqs: [
      ['What is Masteriyo LMS?', 'Masteriyo LMS is a WordPress learning management system product.'],
      ['What was Nischhal’s role in Masteriyo?', 'Nischhal contributed to the Figma design of the LMS product as part of a multi-designer product team.'],
      ['Why is this framed as a contribution?', 'Because the project was a team-based product design effort, the portfolio presents it as contribution-based work.'],
      ['What UX areas are relevant in LMS design?', 'Course creation, lesson structure, quizzes, dashboards, progress tracking, and admin usability are important LMS UX areas.']
    ]
  },
  '/project-zapp.html': {
    name: 'Zapp Today',
    type: 'Logistics mobile app UX case study',
    focus: 'Customer app, driver app, delivery scheduling, task status, and admin prototype flows.',
    role: 'Mobile product design from wireframes to prototype for customer and driver logistics experiences.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Product Design Nepal', '/product-design-nepal.html'], ['UX audit service', '/ux-audit.html'], ['Good handoff article', '/blog/blog-good-handoff.html']],
    faqs: [
      ['What is Zapp Today?', 'Zapp Today is a logistics and delivery product with customer, driver, and admin experiences.'],
      ['What was Nischhal’s role in Zapp?', 'Nischhal designed customer and driver app flows from wireframes to final prototype.'],
      ['What UX challenge did Zapp solve?', 'The design needed to make delivery, scheduling, driver coordination, and order status easier to understand.'],
      ['Why is Zapp relevant to mobile UX?', 'It involves real-time task flow, role-based mobile screens, map or status awareness, and action clarity.']
    ]
  },
  '/project-neverwinter-parser.html': {
    name: 'Neverwinter Live Parser',
    type: 'Gaming UX and desktop tool case study',
    focus: 'Real-time combat log readability, encounter performance insights, status feedback, and desktop interface clarity.',
    role: 'Product and interface direction for an ongoing combat log parser concept/tool for Neverwinter players.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Gaming interface article', '/blog/blog-gaming-interface-clarity.html'], ['UX audit service', '/ux-audit.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is Neverwinter Live Parser?', 'It is an ongoing desktop tool concept for reading Neverwinter combat logs and turning encounter data into clearer performance insights.'],
      ['What UX problem does it address?', 'Raw combat logs are difficult to interpret, so the UX focuses on readable summaries, encounter state, and performance clarity.'],
      ['Why is gaming UI relevant to product design?', 'Gaming interfaces teach real-time feedback, dense information design, and fast decision support.'],
      ['Is this a finished commercial product?', 'The portfolio frames it as an ongoing design and product exploration, not a finished commercial product.']
    ]
  },
  '/project-orkest.html': {
    name: 'Orkest HQ',
    type: 'Modular SaaS UX architecture case study',
    focus: 'CRM, Sales, Inventory, Finance, and shared workspace UX for modular business software.',
    role: 'UX architecture and product flow direction for a modular SaaS business platform.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['SaaS UX service', '/saas-ux-designer.html'], ['Figma Design Systems', '/figma-design-systems.html'], ['Design systems article', '/blog/blog-design-systems-front-end.html']],
    faqs: [
      ['What is Orkest HQ?', 'Orkest HQ is a modular SaaS platform concept covering CRM, Sales, Inventory, Finance, and shared workspace areas.'],
      ['What was Nischhal’s role in Orkest?', 'Nischhal structured UX direction for the modular business platform and its core module flow.'],
      ['What UX problem does Orkest address?', 'It addresses how small-scale business software can organize multiple workflows without overwhelming users.'],
      ['Why is Orkest relevant to SaaS UX?', 'It shows modular information architecture, dashboard thinking, role-based workflows, and business-process clarity.']
    ]
  },
  '/project-splashnode.html': {
    name: 'Splashnode',
    type: 'Website design and front-end build case study',
    focus: 'Website design for a content, device, and data management platform, with front-end implementation.',
    role: 'Designed and coded the marketing website, translating technical capabilities into clearer page structure.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Website UX service', '/website-ux-design.html'], ['Service website article', '/blog/blog-service-websites.html'], ['Good handoff article', '/blog/blog-good-handoff.html']],
    faqs: [
      ['What is Splashnode?', 'Splashnode is a website project for a content, device, and data management platform.'],
      ['What was Nischhal’s role in Splashnode?', 'Nischhal designed and coded the website experience.'],
      ['What was the UX focus?', 'The focus was translating technical product capabilities into clearer website sections and visitor-facing explanations.'],
      ['Why is Splashnode relevant to website UX?', 'It shows how technical products need clear page hierarchy, service explanation, and credible presentation.']
    ]
  },
  '/project-grid-labs.html': {
    name: 'Grid Labs Hosting',
    type: 'Hosting landing page and static front-end case study',
    focus: 'Domain search, hosting service cards, pricing sections, testimonials, and static landing page UX.',
    role: 'Static front-end landing page direction for a hosting-service website experience.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Website UX service', '/website-ux-design.html'], ['UX audit service', '/ux-audit.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is Grid Labs Hosting?', 'Grid Labs Hosting is a static hosting landing page project.'],
      ['What UX areas does it include?', 'It includes domain search, hosting service cards, pricing tabs, testimonials, and contact sections.'],
      ['What was the design focus?', 'The focus was organizing hosting information into scannable sections that support visitor decisions.'],
      ['Why is it relevant to website design?', 'It shows service landing page structure, pricing clarity, and conversion-focused layout.']
    ]
  },
  '/project-zakra-furniture.html': {
    name: 'Zakra Furniture',
    type: 'WordPress starter website case study',
    focus: 'Furniture starter website design and build using Zakra and Elementor.',
    role: 'Designed and built a WordPress starter website focused on clean product presentation and reusable business sections.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Website UX service', '/website-ux-design.html'], ['Product Design Nepal', '/product-design-nepal.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is Zakra Furniture?', 'Zakra Furniture is a WordPress starter website for a furniture business experience.'],
      ['What was Nischhal’s role?', 'Nischhal designed and built the starter website using Zakra and Elementor.'],
      ['What was the UX focus?', 'The focus was clean product presentation, reusable business sections, and a polished website layout.'],
      ['Why is it relevant?', 'It shows practical website design and WordPress implementation experience.']
    ]
  },
  '/project-designerex.html': {
    name: 'Designerex',
    type: 'Marketplace design contribution case study',
    focus: 'Luxury fashion rental marketplace experience and product design contribution.',
    role: 'Design contribution to a broader marketplace product design effort. This is intentionally not framed as sole ownership.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Product Design Nepal', '/product-design-nepal.html'], ['Portfolio article', '/blog/blog-portfolio-product.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is Designerex?', 'Designerex is a luxury fashion rental marketplace.'],
      ['What was Nischhal’s role?', 'Nischhal contributed design work as part of a broader product design effort.'],
      ['Why is this framed as a contribution?', 'The page avoids overclaiming and presents the work as contribution-based.'],
      ['What is the relevant UX theme?', 'Marketplace UX involves product discovery, listing clarity, trust, and transaction confidence.']
    ]
  },
  '/project-sassboilerplate.html': {
    name: 'sassBoilerplate',
    type: 'Front-end workflow toolkit case study',
    focus: 'Static website development workflow, styling organization, and front-end starter structure.',
    role: 'Created a front-end starter workflow to speed up and organize static website development.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Figma Design Systems', '/figma-design-systems.html'], ['Good handoff article', '/blog/blog-good-handoff.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is sassBoilerplate?', 'sassBoilerplate is a front-end starter project for organizing static website development.'],
      ['Why did Nischhal create it?', 'It was created to improve styling organization and speed up repeatable front-end work.'],
      ['How is it relevant to product design?', 'It shows front-end-aware design thinking and practical understanding of design-to-code constraints.'],
      ['What does it connect to?', 'It connects to design systems, developer handoff, and reusable front-end workflows.']
    ]
  }
};

const blogSeo: Record<string, SeoEntry> = {
  '/blog/blog-web3-products.html': {
    name: 'Designing Web3 Products Without Making Users Feel Lost',
    type: 'Web3 UX article',
    focus: 'Wallet clarity, transaction review, trust language, and Web3 product education.',
    role: 'Product design writing based on Web3 UX patterns and portfolio experience with Yarsha and Mokshya.io.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Yarsha case study', '/project-yarsha.html'], ['Mokshya.io case study', '/project-mokshya.html'], ['Web3 UX service', '/web3-ux-designer.html']],
    faqs: [
      ['What is Web3 UX?', 'Web3 UX is the design of wallet, signing, transaction, and protocol experiences so users understand what will happen before they act.'],
      ['Why is wallet clarity important?', 'Wallet clarity is important because signing or transferring assets can feel risky when users do not understand fees, recipients, and outcomes.'],
      ['Which projects relate to this article?', 'The article relates most closely to Yarsha and Mokshya.io.'],
      ['What is the main takeaway?', 'Good Web3 UX should explain complexity at the right time instead of hiding it or exposing it too late.']
    ]
  },
  '/blog/blog-good-handoff.html': {
    name: 'Why Good Handoff Matters More Than Perfect Screens',
    type: 'Design handoff article',
    focus: 'States, edge cases, responsive rules, interaction notes, acceptance criteria, and developer-ready design communication.',
    role: 'Product design writing about making design work easier to implement without guessing.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Figma Design Systems', '/figma-design-systems.html'], ['sassBoilerplate case study', '/project-sassboilerplate.html'], ['UX Audit service', '/ux-audit.html']],
    faqs: [
      ['What is design handoff?', 'Design handoff is the process of communicating UI behavior, states, responsive rules, and acceptance criteria to developers.'],
      ['Why is handoff more than a Figma file?', 'A Figma file shows layout, but handoff explains intent, edge cases, state behavior, and implementation expectations.'],
      ['Who benefits from better handoff?', 'Designers, developers, product managers, QA teams, and AI coding agents all benefit from clear handoff documentation.'],
      ['What is the main takeaway?', 'Good handoff reduces guessing and protects design intent during implementation.']
    ]
  },
  '/blog/blog-portfolio-product.html': {
    name: 'What I Learned Designing My Portfolio Like a Product',
    type: 'Portfolio strategy article',
    focus: 'Portfolio UX, truthful contribution framing, SEO structure, case-study hierarchy, and recruiter/client decision paths.',
    role: 'Product design writing about treating a personal portfolio like a usable product.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Product Design Nepal', '/product-design-nepal.html'], ['Projects page', '/projects.html'], ['About page', '/about.html']],
    faqs: [
      ['Why design a portfolio like a product?', 'A portfolio has users, goals, content hierarchy, trust signals, and conversion paths like any other digital product.'],
      ['What makes a portfolio trustworthy?', 'Clear contribution framing, real project context, truthful outcomes, and specific design decisions make a portfolio more trustworthy.'],
      ['Should every portfolio claim metrics?', 'No. Metrics should only be used when they are verified. Otherwise, design intent and contribution should be explained honestly.'],
      ['What is the main takeaway?', 'A strong portfolio should be visually polished and truthful enough to survive questions.']
    ]
  },
  '/blog/blog-service-websites.html': {
    name: 'Designing Service Websites That Explain the Business Clearly',
    type: 'Website UX article',
    focus: 'Service page structure, business positioning, SEO headings, trust signals, conversion paths, and clear website storytelling.',
    role: 'Product design writing connected to service website work such as Hamro Idea, Morajaa, Splashnode, and Grid Labs.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Website UX service', '/website-ux-design.html'], ['Hamro Idea case study', '/project-hamro-idea.html'], ['Morajaa case study', '/project-morajaa.html']],
    faqs: [
      ['What is service website UX?', 'Service website UX is the design of pages that clearly explain what a business offers, who it helps, and what the visitor should do next.'],
      ['Why do service websites need strong content structure?', 'Good content structure helps visitors understand the business quickly and helps search engines interpret the page topic.'],
      ['Which projects relate to this article?', 'Hamro Idea, Morajaa, Splashnode, and Grid Labs relate to this topic.'],
      ['What is the main takeaway?', 'A service website is not only a brochure; it is a decision path.']
    ]
  },
  '/blog/blog-gaming-interface-clarity.html': {
    name: 'What Gaming Taught Me About Interface Clarity',
    type: 'Gaming UX article',
    focus: 'Real-time feedback, combat logs, status states, information density, dashboards, and fast decision-making.',
    role: 'Product design writing connected to Neverwinter Live Parser and gaming-interface clarity.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Neverwinter Live Parser case study', '/project-neverwinter-parser.html'], ['UX Audit service', '/ux-audit.html'], ['Product Design Nepal', '/product-design-nepal.html']],
    faqs: [
      ['What can gaming teach product designers?', 'Gaming interfaces teach designers about real-time feedback, status clarity, information density, and fast decision-making.'],
      ['Why are combat logs a UX problem?', 'Raw combat logs are difficult to read, so good UX turns them into understandable performance insights.'],
      ['Which project relates to this article?', 'The article relates to the Neverwinter Live Parser project.'],
      ['What is the main takeaway?', 'A good interface helps people act confidently while the situation is changing.']
    ]
  },
  '/blog/blog-design-systems-front-end.html': {
    name: 'How I Think About Design Systems as a Front-End-Aware Designer',
    type: 'Design systems article',
    focus: 'Tokens, reusable components, interaction states, accessibility notes, responsive behavior, and practical design-to-code thinking.',
    role: 'Product design writing about design systems through a front-end-aware lens.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Figma Design Systems', '/figma-design-systems.html'], ['Masteriyo case study', '/project-masteriyo.html'], ['Orkest case study', '/project-orkest.html']],
    faqs: [
      ['What is a front-end-aware design system?', 'It is a design system that considers components, states, accessibility, responsive behavior, and implementation constraints.'],
      ['Why are tokens important?', 'Tokens turn visual decisions like color, spacing, typography, radius, and motion into reusable design and code language.'],
      ['What should components include?', 'Components should include visual style, states, behavior, content rules, accessibility notes, and responsive behavior.'],
      ['What is the main takeaway?', 'A design system should reduce confusion for both the people designing and the people building.']
    ]
  }
};

const staticSeoEntries: Record<string, SeoEntry> = { ...projectSeo, ...blogSeo };

function makeStaticSeoSection(pagePath: string, data: SeoEntry) {
  const faqHtml = data.faqs.map(([q, a]) => `<details class="impact-card"><summary>${q}</summary><p>${a}</p></details>`).join('');
  const relatedHtml = data.related.map(([label, url]) => `<a class="writing-item" href="${url}"><span class="w-date">Related</span><div class="w-info"><span class="w-title">${label}</span><span class="w-summary">Continue with topic-specific context for ${data.name}.</span></div><span class="w-arrow">→</span></a>`).join('');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: data.parentName, item: `${SITE}${data.parentUrl}` },
          { '@type': 'ListItem', position: 3, name: data.name, item: `${SITE}${pagePath}` }
        ]
      },
      {
        '@type': data.schemaType,
        name: data.name,
        headline: data.name,
        url: `${SITE}${pagePath}`,
        mainEntityOfPage: `${SITE}${pagePath}`,
        author: { '@type': 'Person', name: 'Nischhal Raj Subba', url: SITE },
        publisher: { '@type': 'Person', name: 'Nischhal Raj Subba', url: SITE },
        description: data.focus,
        about: [data.type, 'Product Design', 'UX Design', 'UI Design'],
        dateModified: '2026-04-29'
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
      }
    ]
  };

  return `
    <section class="section-container nrs-static-project-context">
      <p class="eyebrow">Static SEO context</p>
      <h2 class="section-title">What this ${data.type} focuses on</h2>
      <div class="impact-summary-grid">
        <div class="impact-card"><span class="eyebrow">Focus</span><h3>${data.name}</h3><p>${data.focus}</p></div>
        <div class="impact-card"><span class="eyebrow">Role</span><h3>Truthful contribution</h3><p>${data.role}</p></div>
        <div class="impact-card"><span class="eyebrow">SEO note</span><h3>Subject-specific framing</h3><p>This section is rendered at build time so search engines and AI crawlers can read the page context without relying only on client-side JavaScript.</p></div>
      </div>
    </section>
    <section class="section-container nrs-static-related-links">
      <p class="eyebrow">Related paths</p>
      <h2 class="section-title">Continue with related work and writing</h2>
      <div class="writing-list">${relatedHtml}</div>
    </section>
    <section class="section-container nrs-static-faq">
      <p class="eyebrow">Frequently asked questions</p>
      <h2 class="section-title">Questions this page answers</h2>
      <div style="display:grid;gap:16px;">${faqHtml}</div>
    </section>
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  `;
}

/**
 * Build-time HTML polish.
 *
 * Heavy animation libraries are deferred so mobile rendering starts earlier.
 * Static context/schema is injected for every project and blog detail page so SEO
 * does not depend only on client-side JavaScript.
 */
const htmlEnhancementInjector = (): Plugin => ({
  name: 'nrs-html-enhancement-injector',
  transformIndexHtml(html, ctx) {
    let output = html
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/gsap\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>')
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/ScrollTrigger\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>');

    const pagePath = ctx.path;
    const staticData = staticSeoEntries[pagePath];
    if (staticData && !output.includes('nrs-static-project-context')) {
      output = output.replace('</main>', `${makeStaticSeoSection(pagePath, staticData)}\n    </main>`);
    }

    if (!output.includes('/detail-navigation.js')) {
      output = output.replace('</body>', '  <script src="/detail-navigation.js?v=20260429" defer></script>\n  </body>');
    }

    if (!output.includes('/seo-enhancements.js')) {
      output = output.replace('</body>', '  <script src="/seo-enhancements.js?v=20260429" defer></script>\n  </body>');
    }

    return output;
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    build: {
      rollupOptions: {
        input: {
          index: page('index.html'),
          home: page('home.html'),
          homeV2: page('home-v2.html'),
          about: page('about.html'),
          contact: page('contact.html'),
          projects: page('projects.html'),
          blogLegacy: page('blog.html'),
          blogIndex: page('blog/index.html'),

          productDesignNepal: page('product-design-nepal.html'),
          web3UxDesigner: page('web3-ux-designer.html'),
          saasUxDesigner: page('saas-ux-designer.html'),
          websiteUxDesign: page('website-ux-design.html'),
          figmaDesignSystems: page('figma-design-systems.html'),
          uxAudit: page('ux-audit.html'),

          blogWeb3Products: page('blog/blog-web3-products.html'),
          blogGoodHandoff: page('blog/blog-good-handoff.html'),
          blogPortfolioProduct: page('blog/blog-portfolio-product.html'),
          blogServiceWebsites: page('blog/blog-service-websites.html'),
          blogGamingInterfaceClarity: page('blog/blog-gaming-interface-clarity.html'),
          blogDesignSystemsFrontEnd: page('blog/blog-design-systems-front-end.html'),

          projectYarsha: page('project-yarsha.html'),
          projectMokshya: page('project-mokshya.html'),
          projectHamroIdea: page('project-hamro-idea.html'),
          projectMorajaa: page('project-morajaa.html'),
          projectPihub: page('project-pihub.html'),
          projectMasteriyo: page('project-masteriyo.html'),
          projectZapp: page('project-zapp.html'),
          projectNeverwinterParser: page('project-neverwinter-parser.html'),
          projectOrkest: page('project-orkest.html'),
          projectSplashnode: page('project-splashnode.html'),
          projectGridLabs: page('project-grid-labs.html'),
          projectZakraFurniture: page('project-zakra-furniture.html'),
          projectDesignerex: page('project-designerex.html'),
          projectSassboilerplate: page('project-sassboilerplate.html')
        }
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    plugins: [htmlEnhancementInjector()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});
