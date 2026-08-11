/**
 * @fileoverview scripts/verify-live-routes.mjs
 * Purpose: Validate verify live routes and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Validate route and surface actionable failures when the verify live routes repository tool contract is violated.
 * Inputs: `route`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state; performs network I/O.
 * Returns: Promise that resolves when the asynchronous side effects complete.
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
/**
 * Function contract: verifyRedirect
 * Purpose: Validate redirect and surface actionable failures when the verify live routes repository tool contract is violated.
 * Inputs: `route`: input consumed by this operation; `expected`: input consumed by this operation
 * Side effects: performs network I/O.
 * Returns: Promise that resolves when the asynchronous side effects complete.
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
