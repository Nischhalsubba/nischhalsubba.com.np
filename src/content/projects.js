/**
 * @fileoverview src/content/projects.js
 * Purpose: Provide structured projects content consumed by generators or runtime presentation code.
 * Responsibilities:
 * - Keep this file focused on its stated responsibility and stable public/build interfaces.
 * - Update connected owners whenever this file changes a shared contract.
 * Execution context: Repository application or build source.
 * Connected files:
 * - scripts/audit-content-structure.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/**
 * Canonical project metadata for the portfolio.
 *
 * This file is intentionally data-only. The current site still uses static HTML
 * routes, but future templates/build scripts should read from this file instead
 * of duplicating project names, categories, summaries, and links across pages.
 */
export const projects = [
  {
    slug: 'yarsha',
    title: 'Yarsha',
    route: '/project-yarsha.html',
    category: 'Web3 Messaging App',
    year: '2024',
    role: 'Product Design',
    tags: ['Web3', 'Mobile UX', 'Wallet UX', 'AI bots', 'Transaction review'],
    cover: '/assets/images/project-yarsha-cover.svg',
    summary:
      'Designed a mobile Web3 chat experience where messaging, wallet actions, blinks, AI bots, and transaction review feel understandable.',
    featured: true,
  },
  {
    slug: 'mokshya',
    title: 'Mokshya.io',
    route: '/project-mokshya.html',
    category: 'Web3 Protocol Website',
    year: '2024-2025',
    role: 'Website Design',
    tags: ['Web3', 'Protocol website', 'Product storytelling', 'Trust signals'],
    cover: '/assets/images/project-mokshya-cover.svg',
    summary:
      'Structured a protocol website around clearer hierarchy, sharper product explanation, and trust-building communication for technical visitors.',
    featured: true,
  },
  {
    slug: 'hamro-idea',
    title: 'Hamro Idea',
    route: '/project-hamro-idea.html',
    category: 'Brand + Website',
    year: '2025',
    role: 'Design & Development',
    tags: ['Website UX', 'Branding', 'SEO structure', 'Frontend'],
    cover: '/assets/images/project-hamro-idea-cover.svg',
    summary:
      'Rebranded and built a static multi-page website for a Nepal-based software studio with clearer positioning and lead paths.',
    featured: true,
  },
  {
    slug: 'pihub',
    title: 'piHub',
    route: '/project-pihub.html',
    category: 'Fintech Product Experience',
    year: '2024',
    role: 'App Experience',
    tags: ['Fintech', 'Investor flows', 'Verification', 'Dashboard UX'],
    cover: '/assets/images/project-pihub-cover.svg',
    summary:
      'Worked through fintech product flows for investor journeys, credit requests, verification, profile management, and dashboard clarity.',
    featured: true,
  },
  {
    slug: 'zapp',
    title: 'Zapp Today',
    route: '/project-zapp.html',
    category: 'Logistics App',
    year: '2024',
    role: 'Mobile Product Design',
    tags: ['Mobile UX', 'Logistics', 'Driver app', 'Customer app', 'Admin workflows'],
    cover: '/assets/images/project-zapp-cover.svg',
    summary:
      'Designed customer and driver app flows from wireframes to prototype for delivery tasks, status visibility, and operational control.',
    featured: true,
  },
  {
    slug: 'morajaa',
    title: 'Morajaa',
    route: '/project-morajaa.html',
    category: 'B2B Consulting Website',
    year: '2025',
    role: 'UX & Content Structure',
    tags: ['B2B', 'Website UX', 'Content strategy', 'Service pages'],
    cover: '/assets/images/project-morajaa-cover.svg',
    summary:
      'Designed service pages, sector pages, and guided inquiry paths for a consulting website with premium communication needs.',
    featured: true,
  },
  {
    slug: 'masteriyo',
    title: 'Masteriyo',
    route: '/project-masteriyo.html',
    category: 'WordPress LMS Product',
    year: '2024',
    role: 'Product/UI Contribution',
    tags: ['WordPress', 'SaaS', 'LMS', 'Product UI'],
    cover: '/assets/images/project-masteriyo-cover.svg',
    summary: 'Product UI and UX contribution for a WordPress learning management product experience.',
    featured: false,
  },
  {
    slug: 'neverwinter-parser',
    title: 'Neverwinter Live Parser',
    route: '/project-neverwinter-parser.html',
    category: 'Gaming Data Interface',
    year: '2025',
    role: 'Product Design + Tooling',
    tags: ['Gaming UX', 'Data UI', 'Dashboard', 'Parser'],
    cover: '/assets/images/project-neverwinter-parser-cover.svg',
    summary: 'Interface exploration for turning combat logs and real-time game data into readable performance insight.',
    featured: false,
  },
  {
    slug: 'orkest',
    title: 'Orkest',
    route: '/project-orkest.html',
    category: 'Website / Product Storytelling',
    year: '2024',
    role: 'Website UX',
    tags: ['Website UX', 'B2B', 'Product storytelling'],
    cover: '/assets/images/project-orkest-cover.svg',
    summary: 'Website UX and visual communication work for a product-led brand experience.',
    featured: false,
  },
  {
    slug: 'splashnode',
    title: 'Splashnode',
    route: '/project-splashnode.html',
    category: 'Hosting / Service Website',
    year: '2024',
    role: 'Website UX',
    tags: ['Website UX', 'Service pages', 'Hosting'],
    cover: '/assets/images/project-splashnode-cover.svg',
    summary: 'Service website structure and interface work focused on clearer service discovery and trust.',
    featured: false,
  },
  {
    slug: 'grid-labs',
    title: 'Grid Labs',
    route: '/project-grid-labs.html',
    category: 'Software Studio Website',
    year: '2024',
    role: 'Website UX',
    tags: ['Website UX', 'Software studio', 'Service positioning'],
    cover: '/assets/images/project-grid-labs-cover.svg',
    summary: 'Website UX and positioning work for a software studio presence.',
    featured: false,
  },
  {
    slug: 'zakra-furniture',
    title: 'Zakra Furniture',
    route: '/project-zakra-furniture.html',
    category: 'Ecommerce Website Concept',
    year: '2024',
    role: 'UI/UX',
    tags: ['Ecommerce', 'Website UX', 'WordPress'],
    cover: '/assets/images/project-zakra-furniture-cover.svg',
    summary: 'Furniture ecommerce website interface work with focus on product browsing and visual clarity.',
    featured: false,
  },
  {
    slug: 'designerex',
    title: 'Designerex',
    route: '/project-designerex.html',
    category: 'Design Resource / Product Concept',
    year: '2024',
    role: 'Product/UI',
    tags: ['Design resources', 'Product concept', 'UI'],
    cover: '/assets/images/project-designerex-cover.svg',
    summary: 'Product/interface exploration for a designer-focused resource experience.',
    featured: false,
  },
  {
    slug: 'sassboilerplate',
    title: 'Sass Boilerplate',
    route: '/project-sassboilerplate.html',
    category: 'Frontend Utility',
    year: '2024',
    role: 'Frontend / System',
    tags: ['Frontend', 'Sass', 'System thinking'],
    cover: '/assets/images/project-sassboilerplate-cover.svg',
    summary: 'Frontend utility work focused on reusable Sass structure and scalable styling foundations.',
    featured: false,
  },
];

export const featuredProjects = projects.filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `project` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (project) => project.featured);
