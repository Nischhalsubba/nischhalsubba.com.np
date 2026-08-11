/**
 * @fileoverview scripts/verify-live-routes.mjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for verify live routes.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const BASE_URL = process.env.SITE_URL || 'https://nischhalsubba.com.np';
const routes = [
  '/', '/projects', '/services', '/about', '/contact', '/privacy', '/blog/',
  '/product-design-nepal', '/web3-ux-designer', '/saas-ux-designer',
  '/website-ux-design', '/figma-design-systems', '/ux-audit',
  '/project-yarsha', '/project-mokshya', '/project-hamro-idea', '/project-morajaa',
  '/project-pihub', '/project-masteriyo', '/project-zapp', '/project-neverwinter-parser',
  '/project-orkest', '/project-splashnode', '/project-grid-labs',
  '/project-zakra-furniture', '/project-designerex', '/project-sassboilerplate',
];

const redirects = new Map([
  ['/home', '/'], ['/home.html', '/'], ['/home-v2', '/'], ['/home-v2.html', '/'],
  ['/blog', '/blog/'], ['/blog.html', '/blog/'], ['/writing', '/blog/'], ['/writing/', '/blog/'],
  ['/products', '/projects'], ['/products.html', '/projects'],
  ['/project-detail', '/projects'], ['/project-detail.html', '/projects'],
  ['/project-archive', '/projects'], ['/project-archive.html', '/projects'],
  ['/media-kit', '/about'], ['/media-kit.html', '/about'],
]);

const errors = [];

/**
 * Function contract: verifyRoute
 * Purpose: Validates verify route and reports violations instead of silently accepting invalid state.
 * Inputs: route.
 * Side effects: may read or update browser DOM/state; may perform network I/O.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
async function verifyRoute(route) {
  const response = await fetch(new URL(route, BASE_URL), { redirect: 'manual' });
  const type = response.headers.get('content-type') || '';
  if (response.status !== 200) errors.push(`${route}: expected 200, got ${response.status}`);
  if (!type.includes('text/html')) errors.push(`${route}: expected text/html, got ${type || 'missing content-type'}`);
  const text = await response.text();
  if (!/<title>[^<]+<\/title>/i.test(text)) errors.push(`${route}: missing document title`);
  if (!/<h1\b/i.test(text)) errors.push(`${route}: missing H1`);
}

/**
 * Function contract: verifyRedirect
 * Purpose: Validates verify redirect and reports violations instead of silently accepting invalid state.
 * Inputs: route, expected.
 * Side effects: may perform network I/O.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function verifyRedirect(route, expected) {
  const response = await fetch(new URL(route, BASE_URL), { redirect: 'manual' });
  if (![301, 302, 307, 308].includes(response.status)) {
    errors.push(`${route}: expected redirect, got ${response.status}`);
    return;
  }
  const location = response.headers.get('location');
  const resolved = location ? new URL(location, BASE_URL).pathname : '';
  if (resolved !== expected) errors.push(`${route}: expected redirect to ${expected}, got ${location || 'missing location'}`);
}

for (const route of routes) {
  try { await verifyRoute(route); } catch (error) { errors.push(`${route}: ${error.message}`); }
}
for (const [route, expected] of redirects) {
  try { await verifyRedirect(route, expected); } catch (error) { errors.push(`${route}: ${error.message}`); }
}

if (errors.length) {
  console.error('Live route verification failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`Live route verification passed for ${routes.length} canonical routes and ${redirects.size} redirects.`);
