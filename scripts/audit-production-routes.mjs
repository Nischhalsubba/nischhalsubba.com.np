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
  console.error(`[production-routes] ${failures.length} failure(s)\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`[production-routes] ${requiredRoutes.length} canonical routes passed.`);
