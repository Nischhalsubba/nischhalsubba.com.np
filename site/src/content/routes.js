/**
 * @fileoverview src/content/routes.js
 * Purpose: Provide lightweight route metadata for content tooling that needs to refer to primary pages, historical redirects, or public discovery resources.
 * Responsibilities:
 * - Keep human-facing route metadata in one data-only module.
 * - Preserve compatibility redirect intent for content tooling that cannot read the canonical manifest directly.
 * - List public non-page resources that may be linked from generated content or maintenance tooling.
 * Execution context: Repository source imported by content generators and validation tooling.
 * Connected files:
 * - config/canonical-routes.json
 * - scripts/audit-content-structure.cjs
 * - src/content/
 * Maintenance: `config/canonical-routes.json` remains authoritative for production routing. Keep this file aligned with that manifest and avoid introducing an independent routing policy here.
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
  { path: '/humans.txt', file: 'humans.txt', title: 'Ownership information' },
  { path: '/site.webmanifest', file: 'site.webmanifest', title: 'Web manifest' },
];

export const routeGroups = {
  core: coreRoutes,
  compatibility: compatibilityRoutes,
  discovery: discoveryRoutes,
};
