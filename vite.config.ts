/**
 * @fileoverview vite.config.ts
 * Purpose: Configure Vite multi-page inputs, canonical URL transforms, source materialization expectations, and production asset output.
 * Responsibilities:
 * - Keep this file focused on its stated responsibility and stable public/build interfaces.
 * - Update connected owners whenever this file changes a shared contract.
 * Execution context: TypeScript source consumed by build/runtime tooling.
 * Connected files:
 * - README.md
 * - config/repository/code-documentation-policy.json
 * - config/repository/root-policy.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Function contract: page
 * Purpose: Implement the page responsibility owned by the vite.config module.
 * Inputs: `filePath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
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
      ['What is Zakra Furniture?', 'Zakra Furniture is a WordPress starter website project for furniture product presentation.'],
      ['What tools were used?', 'The project used WordPress, the Zakra theme, and Elementor for page building.'],
      ['What was the design focus?', 'The design focused on clean product sections, reusable business layouts, and simple furniture website structure.'],
      ['Why is this relevant?', 'It shows practical WordPress website setup, starter template thinking, and small-business page structure.']
    ]
  },
  '/project-designerex.html': {
    name: 'Designerex WordPress Exploration',
    type: 'WordPress theme adaptation and website exploration',
    focus: 'WordPress portfolio exploration, theme customization, layout adaptation, and implementation learning.',
    role: 'Theme adaptation and layout exploration using WordPress, Zakra, Elementor, and Tutor LMS Pro.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Website UX service', '/website-ux-design.html'], ['Figma Design Systems', '/figma-design-systems.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is Designerex?', 'Designerex is a WordPress exploration focused on portfolio layout adaptation and theme customization.'],
      ['What tools were used?', 'WordPress, Zakra, Elementor, Tutor LMS Pro, WP Portfolio, WPForms, Fluent Forms, Easy Table of Contents, and SureCart were used.'],
      ['What was the purpose?', 'The project explored how WordPress theme systems and plugin stacks can support portfolio-style websites.'],
      ['Is Designerex a full product case study?', 'It is best understood as an implementation and theme-adaptation exploration rather than a full product case study.']
    ]
  },
  '/project-sassboilerplate.html': {
    name: 'Sass Boilerplate',
    type: 'Front-end starter architecture exploration',
    focus: 'SCSS folder structure, tokens, variables, component partials, and maintainable front-end organization.',
    role: 'Front-end architecture exploration for scalable SCSS starter structure.',
    parentName: 'Projects',
    parentUrl: '/projects.html',
    schemaType: 'CreativeWork',
    related: [['Figma Design Systems', '/figma-design-systems.html'], ['Good handoff article', '/blog/blog-good-handoff.html'], ['All projects', '/projects.html']],
    faqs: [
      ['What is Sass Boilerplate?', 'Sass Boilerplate is a front-end starter architecture exploration for organizing SCSS projects.'],
      ['What does it include?', 'It includes folder structure, variables, token thinking, component partials, and maintainable SCSS conventions.'],
      ['Why is it relevant to design systems?', 'Design systems need consistent implementation rules, and a Sass architecture helps translate UI decisions into maintainable styles.'],
      ['Is this a user-facing product?', 'No. It is a front-end architecture exploration rather than a user-facing product.']
    ]
  }
};

const blogSeo: Record<string, SeoEntry> = {
  '/blog/blog-web3-products.html': {
    name: 'Why Web3 Products Need Better UX, Not More Explanations',
    type: 'Web3 UX article',
    focus: 'Wallet interactions, transaction review, permissions, onboarding, trust states, and product clarity for Web3 apps.',
    role: 'Product design writing about Web3 UX clarity, based on interface and transaction-flow thinking.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Web3 UX service', '/web3-ux-designer.html'], ['Yarsha case study', '/project-yarsha.html'], ['Mokshya case study', '/project-mokshya.html']],
    faqs: [
      ['Why do Web3 products need better UX?', 'Because many Web3 products ask users to approve complex wallet, token, and permission actions without enough context.'],
      ['What should transaction review show?', 'Transaction review should show what changes, what leaves the wallet, network fees, destination, risk, and confirmation states.'],
      ['What is wallet UX?', 'Wallet UX covers connection, permissions, signing, transaction review, status feedback, errors, and trust-building around asset actions.'],
      ['What is the main idea of the article?', 'Better Web3 UX means making decisions easier before, during, and after wallet or transaction actions.']
    ]
  },
  '/blog/blog-good-handoff.html': {
    name: 'What Good Design Handoff Looks Like',
    type: 'Design handoff article',
    focus: 'Responsive states, component behavior, edge cases, design notes, QA, and developer-ready Figma files.',
    role: 'Product design writing about practical handoff and front-end-aware collaboration.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Figma Design Systems', '/figma-design-systems.html'], ['Sass Boilerplate project', '/project-sassboilerplate.html'], ['UX audit service', '/ux-audit.html']],
    faqs: [
      ['What is design handoff?', 'Design handoff is the process of giving developers the layout, states, behavior, content rules, and assets needed to build the interface.'],
      ['What makes handoff good?', 'Good handoff includes responsive rules, component states, interaction notes, empty states, error states, and QA expectations.'],
      ['Why does handoff matter?', 'Poor handoff creates guesswork, rework, inconsistent UI, and implementation delays.'],
      ['What is the main takeaway?', 'A good handoff reduces ambiguity before engineering starts building.']
    ]
  },
  '/blog/blog-portfolio-product.html': {
    name: 'Treating a Portfolio Like a Product',
    type: 'Portfolio strategy article',
    focus: 'Portfolio UX, recruiter journeys, case study structure, positioning, proof, and conversion paths.',
    role: 'Product design writing about treating a portfolio as a user journey rather than a static gallery.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Product Design Nepal', '/product-design-nepal.html'], ['All projects', '/projects.html'], ['About Nischhal', '/about.html']],
    faqs: [
      ['Why treat a portfolio like a product?', 'Because hiring managers, collaborators, and clients each arrive with different questions and need clear proof quickly.'],
      ['What should a portfolio explain?', 'A portfolio should explain role, problem, process, decisions, constraints, outcome, and fit for future work.'],
      ['What is portfolio UX?', 'Portfolio UX is the structure, navigation, content, and proof that help visitors understand a designer’s work quickly.'],
      ['What is the main takeaway?', 'A portfolio should guide visitors through evidence, not just display attractive screens.']
    ]
  },
  '/blog/blog-service-websites.html': {
    name: 'Why Service Websites Fail Before the Hero Section Ends',
    type: 'Website UX article',
    focus: 'Service website positioning, hero clarity, proof, service pages, conversion paths, and inquiry flow design.',
    role: 'Product design writing about website UX for service businesses, software companies, and consulting websites.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Website UX service', '/website-ux-design.html'], ['Hamro Idea case study', '/project-hamro-idea.html'], ['Morajaa case study', '/project-morajaa.html']],
    faqs: [
      ['Why do service websites fail?', 'Many fail because visitors cannot quickly understand what the company does, who it helps, why it is credible, and what to do next.'],
      ['What should a hero section explain?', 'A strong hero should explain the service, audience, value, proof, and next action without vague language.'],
      ['What makes service website UX better?', 'Clear service pages, proof, comparison, process, FAQs, and inquiry flows help visitors decide faster.'],
      ['What is the main takeaway?', 'Service websites need clarity and trust before visual decoration.']
    ]
  },
  '/blog/blog-gaming-interface-clarity.html': {
    name: 'What Gaming Interfaces Teach About Product Clarity',
    type: 'Gaming interface UX article',
    focus: 'Real-time feedback, dense information design, status states, prioritization, and decision support in gaming UI.',
    role: 'Product design writing about lessons from gaming interfaces and information-dense tools.',
    parentName: 'Writing',
    parentUrl: '/blog/',
    schemaType: 'Article',
    related: [['Neverwinter Live Parser project', '/project-neverwinter-parser.html'], ['UX audit service', '/ux-audit.html'], ['Product Design Nepal', '/product-design-nepal.html']],
    faqs: [
      ['Why are gaming interfaces useful for product design?', 'Gaming interfaces often handle dense information, fast feedback, status changes, and decision-making under pressure.'],
      ['What can apps learn from games?', 'Apps can learn better feedback, prioritization, visual hierarchy, progressive disclosure, and state clarity.'],
      ['What is the UX challenge in gaming UI?', 'The challenge is showing important information without overwhelming the player or hiding critical status changes.'],
      ['What is the main takeaway?', 'Good interfaces help users understand what is happening and what action matters next.']
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

/**
 * Function contract: makeStaticSeoSection
 * Purpose: Build static seo section from the supplied inputs in the form expected by downstream vite.config module consumers.
 * Inputs: `pagePath`: input consumed by this operation; `data`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function makeStaticSeoSection(pagePath: string, data: SeoEntry) {
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
        mainEntity: data.faqs.map(/** Callback contract: Processes the callback step for data.faqs without leaking orchestration details to the caller. Inputs: [name, text]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[name, text]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ ([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
      }
    ]
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * Build-time HTML polish.
 *
 * Heavy animation libraries are deferred so mobile rendering starts earlier.
 * JSON-LD schema is injected for every project and blog detail page so SEO does
 * not depend only on client-side JavaScript. Visible helper blocks are avoided
 * intentionally because they can leak into production UI and fail the build audit.
 */
/**
 * Function contract: htmlEnhancementInjector
 * Purpose: Implements the html enhancement injector responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: htmlEnhancementInjector
 * Purpose: Implement the html enhancement injector responsibility owned by the vite.config module.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
const htmlEnhancementInjector = (): Plugin => ({
  name: 'nrs-html-enhancement-injector',
  /**
   * Function contract: transformIndexHtml
   * Purpose: Implements the transform index html responsibility for this module.
   * Inputs: html, ctx.
   * Side effects: no obvious external side effect beyond invoked dependencies.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: transformIndexHtml
   * Purpose: Implement the transform index html responsibility owned by the vite.config module.
   * Inputs: `html`: input consumed by this operation; `ctx`: input consumed by this operation
   * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
   * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
   */
  transformIndexHtml(html, ctx) {
    let output = html
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/gsap\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>')
      .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap\/3\.12\.2\/ScrollTrigger\.min\.js"><\/script>/g, '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>');

    const pagePath = ctx.path;
    const staticData = staticSeoEntries[pagePath];
    if (staticData && !output.includes('"@type":"BreadcrumbList"')) {
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

export default defineConfig(/** Callback contract: Processes the callback step for define config without leaking orchestration details to the caller. Inputs: { mode }. Side effects: may emit diagnostics or inspect process state. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing vite.config module operation. Inputs: `{ mode }`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation. */ ({ mode }) => {
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
