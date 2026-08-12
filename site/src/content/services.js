/**
 * @fileoverview src/content/services.js
 * Purpose: Provide structured services content consumed by generators or runtime presentation code.
 * Responsibilities:
 * - Keep this file focused on its stated responsibility and stable public/build interfaces.
 * - Update connected owners whenever this file changes a shared contract.
 * Execution context: Repository application or build source.
 * Connected files:
 * - scripts/audit-content-structure.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/**
 * Canonical service-page metadata.
 *
 * These pages support SEO and client discovery. Keeping their positioning in one
 * data file makes the content easier to audit before templates eventually
 * generate the static HTML pages.
 */
export const services = [
  {
    slug: 'product-design-nepal',
    title: 'Product Design in Nepal',
    route: '/product-design-nepal.html',
    audience: 'Founders, agencies, and product teams looking for product design support from Nepal.',
    focus: ['Product UX', 'Interface design', 'Prototypes', 'Design systems', 'Handoff'],
    summary:
      'Product design support for teams that need clearer flows, polished UI, and developer-ready design decisions.',
  },
  {
    slug: 'web3-ux-designer',
    title: 'Web3 UX Designer',
    route: '/web3-ux-designer.html',
    audience: 'Wallet, protocol, crypto, and on-chain product teams.',
    focus: ['Wallet UX', 'Signing flows', 'Transaction review', 'Trust states', 'Protocol websites'],
    summary:
      'Web3 UX design for products where users need clarity before connecting wallets, signing actions, or trusting a protocol.',
  },
  {
    slug: 'saas-ux-designer',
    title: 'SaaS UX Designer',
    route: '/saas-ux-designer.html',
    audience: 'SaaS teams improving dashboards, admin tools, onboarding, and product workflows.',
    focus: ['Dashboard UX', 'Admin flows', 'Onboarding', 'Empty states', 'UX audit'],
    summary:
      'SaaS UX design for dashboards, workflows, and admin experiences that need better hierarchy and fewer confusing states.',
  },
  {
    slug: 'website-ux-design',
    title: 'Website UX Design',
    route: '/website-ux-design.html',
    audience: 'Software studios, service businesses, B2B teams, and product companies.',
    focus: ['Website structure', 'Service pages', 'SEO clarity', 'Conversion paths', 'Content hierarchy'],
    summary:
      'Website UX design that explains what the business does, who it helps, and what visitors should do next.',
  },
  {
    slug: 'figma-design-systems',
    title: 'Figma Design Systems',
    route: '/figma-design-systems.html',
    audience: 'Teams that need reusable, documented, developer-friendly interface systems.',
    focus: ['Components', 'Variants', 'States', 'Tokens', 'Responsive rules', 'Handoff notes'],
    summary:
      'Practical Figma systems that connect visual consistency, product behavior, and implementation needs.',
  },
  {
    slug: 'ux-audit',
    title: 'UX Audit',
    route: '/ux-audit.html',
    audience: 'Teams that need a clear diagnosis before redesigning a product, app, or website.',
    focus: ['Heuristic review', 'Content clarity', 'Conversion risk', 'Accessibility', 'Implementation issues'],
    summary:
      'UX audits that identify friction, unclear hierarchy, missing states, weak copy, and practical redesign priorities.',
  },
];
