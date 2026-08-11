/**
 * @fileoverview src/content/posts.js
 * Purpose: Provide structured posts content consumed by generators or runtime presentation code.
 * Responsibilities:
 * - Keep this file focused on its stated responsibility and stable public/build interfaces.
 * - Update connected owners whenever this file changes a shared contract.
 * Execution context: Repository application or build source.
 * Connected files:
 * - scripts/audit-content-structure.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/**
 * Canonical writing metadata for the portfolio.
 *
 * Static blog pages still exist as HTML routes. This file is the future source
 * of truth for cards, related posts, sitemap generation, and AI-readable site
 * summaries so those details stop being copied by hand like it is 2009.
 */
export const posts = [
  {
    slug: 'web3-products',
    title: 'Designing Web3 Products Without Making Users Feel Lost',
    route: '/blog/blog-web3-products.html',
    legacyRoute: '/blog-web3-products.html',
    category: 'Web3 UX',
    date: '2026-04-26',
    readingTime: '5 min read',
    cover: '/assets/images/blog-web3-wallet-ux-cover.png',
    summary:
      'A reflection on wallet clarity, transaction review, trust language, Yarsha, Mokshya.io, and designing crypto products that feel understandable.',
    featured: true,
  },
  {
    slug: 'good-handoff',
    title: 'Why Good Handoff Matters More Than Perfect Screens',
    route: '/blog/blog-good-handoff.html',
    legacyRoute: '/blog-good-handoff.html',
    category: 'Design Process',
    date: '2026-04-25',
    readingTime: '5 min read',
    cover: '/assets/images/blog-design-systems-handoff-cover.png',
    summary:
      'A note on Figma handoff, design-to-development clarity, UI states, edge cases, acceptance criteria, and front-end-aware product design.',
    featured: true,
  },
  {
    slug: 'portfolio-product',
    title: 'What I Learned Designing My Portfolio Like a Product',
    route: '/blog/blog-portfolio-product.html',
    legacyRoute: '/blog-portfolio-product.html',
    category: 'Portfolio',
    date: '2026-04-24',
    readingTime: '4 min read',
    cover: '/assets/images/blog-design-systems-handoff-cover.png',
    summary:
      'A reflection on building a truthful SEO-focused portfolio with clear contribution, case study structure, constraints, images, and honest outcomes.',
    featured: true,
  },
  {
    slug: 'service-websites',
    title: 'Designing Service Websites That Explain the Business Clearly',
    route: '/blog/blog-service-websites.html',
    legacyRoute: '/blog-service-websites.html',
    category: 'Website UX',
    date: '2026-04-18',
    readingTime: '5 min read',
    cover: '/assets/images/blog-service-pricing-ux-cover.png',
    summary:
      'Lessons from service websites, B2B consulting pages, software studio websites, SEO content structure, and conversion paths.',
    featured: true,
  },
  {
    slug: 'gaming-interface-clarity',
    title: 'What Gaming Taught Me About Interface Clarity',
    route: '/blog/blog-gaming-interface-clarity.html',
    legacyRoute: '/blog-gaming-interface-clarity.html',
    category: 'Gaming UX',
    date: '2026-04-12',
    readingTime: '4 min read',
    cover: '/assets/images/blog-saas-empty-states-cover.png',
    summary:
      'How Neverwinter, combat logs, real-time feedback, status states, data visualization, and gameplay pressure shaped product design thinking.',
    featured: false,
  },
  {
    slug: 'design-systems-front-end',
    title: 'How I Think About Design Systems as a Front-End-Aware Designer',
    route: '/blog/blog-design-systems-front-end.html',
    legacyRoute: '/blog-design-systems-front-end.html',
    category: 'Design Systems',
    date: '2026-04-08',
    readingTime: '4 min read',
    cover: '/assets/images/blog-design-systems-handoff-cover.png',
    summary:
      'A reflection on reusable components, UI behavior, accessibility, tokens, front-end constraints, and practical design-to-code thinking.',
    featured: false,
  },
];

export const featuredPosts = posts.filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `post` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (post) => post.featured);
