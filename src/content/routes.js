/**
 * Canonical route manifest for the static portfolio.
 *
 * This does not change the live routing by itself. It documents the intended
 * public URL contract so future cleanup can remove root clutter safely instead
 * of guessing which files are active. Guessing is how static sites become a
 * scavenger hunt with 404 pages.
 */
export const coreRoutes = [
  { path: '/', file: 'index.html', title: 'Home', priority: 1 },
  { path: '/projects.html', file: 'projects.html', title: 'Work', priority: 0.95 },
  { path: '/about.html', file: 'about.html', title: 'About', priority: 0.88 },
  { path: '/contact.html', file: 'contact.html', title: 'Contact', priority: 0.86 },
  { path: '/blog/', file: 'blog/index.html', title: 'Writing', priority: 0.9 },
];

export const compatibilityRoutes = [
  { path: '/home.html', target: '/', status: 301 },
  { path: '/home-v2.html', target: '/', status: 301 },
  { path: '/blog.html', target: '/blog/', status: 301 },
  { path: '/products.html', target: '/figma-design-systems.html', status: 301 },
  { path: '/project-detail.html', target: '/projects.html', status: 301 },
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
