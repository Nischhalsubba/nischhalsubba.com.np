/**
 * @fileoverview src/content/routes.js
 * Purpose: Structured content module providing routes data to generators/runtime code.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Repository build or application source.
 * Connected files:
 * - README.md
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - docs/seo-maintenance.md
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
/**
 * Canonical route manifest for the static portfolio.
 *
 * Public paths use Cloudflare Pages clean URLs. The backing files remain
 * static HTML, but navigation, canonical tags, sitemaps and tests should all
 * agree on this one public contract.
 */
export const coreRoutes = [
  { path: '/', file: 'index.html', title: 'Home', priority: 1 },
  { path: '/projects', file: 'projects.html', title: 'Work', priority: 0.95 },
  { path: '/services', file: 'public/services.html', title: 'Services', priority: 0.92 },
  { path: '/about', file: 'about.html', title: 'About', priority: 0.88 },
  { path: '/contact', file: 'contact.html', title: 'Contact', priority: 0.86 },
  { path: '/blog/', file: 'blog/index.html', title: 'Writing', priority: 0.9 },
];

export const compatibilityRoutes = [
  { path: '/home', target: '/', status: 301 },
  { path: '/home.html', target: '/', status: 301 },
  { path: '/home-v2', target: '/', status: 301 },
  { path: '/home-v2.html', target: '/', status: 301 },
  { path: '/blog', target: '/blog/', status: 301 },
  { path: '/blog.html', target: '/blog/', status: 301 },
  { path: '/products', target: '/figma-design-systems', status: 301 },
  { path: '/products.html', target: '/figma-design-systems', status: 301 },
  { path: '/project-detail.html', target: '/projects', status: 301 },
  { path: '/blog-detail.html', target: '/blog/', status: 301 },
];

export const discoveryRoutes = [
  { path: '/robots.txt', file: 'robots.txt', title: 'Robots' },
  { path: '/sitemap.xml', file: 'sitemap.xml', title: 'Sitemap' },
  { path: '/llms.txt', file: 'llms.txt', title: 'LLMs summary' },
  { path: '/ai-profile.json', file: 'ai-profile.json', title: 'AI profile' },
  { path: '/site.webmanifest', file: 'site.webmanifest', title: 'Web manifest' },
];

export const routeGroups = {
  core: coreRoutes,
  compatibility: compatibilityRoutes,
  discovery: discoveryRoutes,
};
