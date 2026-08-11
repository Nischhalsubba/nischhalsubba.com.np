/**
 * @fileoverview scripts/audit-production-routes.mjs
 * Purpose: Validate audit production routes and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const base = new URL(process.env.PRODUCTION_BASE_URL || 'https://nischhalsubba.com.np');
const requiredRoutes = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/contact',
  '/blog/',
  '/product-design-nepal',
  '/ux-audit',
  '/project-yarsha',
  '/project-mokshya',
];

const failures = [];


/**
 * Function contract: requestWithRedirectAudit
 * Purpose: Implement the request with redirect audit responsibility owned by the audit production routes repository tool.
 * Inputs: `pathname`
 * Side effects: performs network I/O
 * Returns: Promise resolving to the computed function result.
 */
async function requestWithRedirectAudit(pathname) {
  let current = new URL(pathname, base);
  const visited = new Set();
  const chain = [];

  for (let hop = 0; hop < 3; hop += 1) {
    if (visited.has(current.href)) throw new Error(`redirect loop: ${[...chain, current.href].join(' -> ')}`);
    visited.add(current.href);

    const response = await fetch(current, {
      redirect: 'manual',
      headers: { 'user-agent': 'portfolio-production-route-audit/1.0' },
    });
    chain.push(`${response.status} ${current.href}`);

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error(`redirect ${response.status} without Location header`);
      current = new URL(location, current);
      continue;
    }

    if (response.status !== 200) throw new Error(`expected 200, received ${response.status}`);
    if (chain.length > 2) throw new Error(`more than one redirect: ${chain.join(' -> ')}`);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) throw new Error(`expected HTML, received ${contentType || 'unknown content type'}`);
    const html = await response.text();
    if (!/<main\b/i.test(html)) throw new Error('response does not contain a main landmark');
    return chain;
  }

  throw new Error(`redirect chain exceeded limit: ${chain.join(' -> ')}`);
}

for (const route of requiredRoutes) {
  try {
    const chain = await requestWithRedirectAudit(route);
    console.log(`[production-routes] ${route}: ${chain.join(' -> ')}`);
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`[production-routes] ${failures.length} failure(s)\n${failures.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `failure` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`[production-routes] ${requiredRoutes.length} canonical routes passed.`);
