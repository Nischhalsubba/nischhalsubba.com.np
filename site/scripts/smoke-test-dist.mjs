/**
 * @fileoverview scripts/smoke-test-dist.mjs
 * Purpose: Validate smoke test dist and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const routes = [
  '/',
  '/projects',
  '/services',
  '/about',
  '/contact',
  '/blog/',
  '/project-yarsha',
  '/project-mokshya',
  '/project-morajaa',
  '/project-pihub',
  '/project-zapp',
  '/web3-ux-designer',
  '/saas-ux-designer',
  '/ux-audit',
];

const errors = [];


/**
 * Function contract: fail
 * Purpose: Implement the fail responsibility owned by the smoke test dist repository tool.
 * Inputs: `message`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function fail(message) {
  errors.push(message);
}


/**
 * Function contract: routeCandidates
 * Purpose: Implement the route candidates responsibility owned by the smoke test dist repository tool.
 * Inputs: `route`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function routeCandidates(route) {
  if (route === '/') return ['index.html'];
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return [`${clean}.html`, `${clean}/index.html`];
}



/**
 * Function contract: resolveRoute
 * Purpose: Resolve route from the supplied inputs and current smoke test dist repository tool context.
 * Inputs: `route`
 * Side effects: reads filesystem state
 * Returns: The requested route; explicit early-return branches define empty/fallback behavior.
 */
function resolveRoute(route) {
  return routeCandidates(route).find(   /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `candidate` Side effects: reads filesystem state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (candidate) => fs.existsSync(path.join(dist, candidate))) || null;
}



/**
 * Function contract: readRedirects
 * Purpose: Return redirects from the supplied inputs or current smoke test dist repository tool state.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads filesystem state
 * Returns: The requested redirects; explicit early-return branches define empty/fallback behavior.
 */
function readRedirects() {
  const redirectPath = path.join(dist, '_redirects');
  const redirects = new Map();
  if (!fs.existsSync(redirectPath)) return redirects;

  for (const line of fs.readFileSync(redirectPath, 'utf8').split(/\r?\n/)) {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) continue;
    const [from, to, status = '302'] = clean.split(/\s+/);
    redirects.set(from, { to, status });
  }
  return redirects;
}



/**
 * Function contract: findRedirectCycle
 * Purpose: Resolve redirect cycle from the supplied inputs and current smoke test dist repository tool context.
 * Inputs: `redirects`, `start`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: The requested redirect cycle; explicit early-return branches define empty/fallback behavior.
 */
function findRedirectCycle(redirects, start) {
  const seen = new Set();
  let current = start;

  while (redirects.has(current)) {
    if (seen.has(current)) return [...seen, current];
    seen.add(current);
    current = redirects.get(current).to;
  }

  return null;
}



/**
 * Function contract: localStylesheets
 * Purpose: Implement the local stylesheets responsibility owned by the smoke test dist repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function localStylesheets(html) {
  return [...html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match[1])
    .filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `href` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (href) => !/^https?:\/\//i.test(href));
}



/**
 * Function contract: assertHtml
 * Purpose: Implement the assert html responsibility owned by the smoke test dist repository tool.
 * Inputs: `route`, `relativePath`
 * Side effects: reads filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function assertHtml(route, relativePath) {
  const html = fs.readFileSync(path.join(dist, relativePath), 'utf8');

  if (!/<main\b/i.test(html)) fail(`${route} (${relativePath}) has no main landmark.`);
  if (!/<h1\b/i.test(html)) fail(`${route} (${relativePath}) has no h1.`);
  if (!/class=["'][^"']*skip-link/i.test(html)) fail(`${route} (${relativePath}) has no skip link.`);
  if (!/id=["']main-content["']/i.test(html)) fail(`${route} (${relativePath}) has no #main-content target.`);

  const stylesheets = localStylesheets(html);
  if (stylesheets.length !== 1 || !stylesheets[0].startsWith('/style.css')) {
    fail(`${route} (${relativePath}) must load exactly one local stylesheet: /style.css.`);
  }

  if (!html.includes('/script.js') && !/<script[^>]+\/assets\/[^"']+\.js/i.test(html)) fail(`${route} (${relativePath}) is missing the runtime.`);
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(html)) fail(`${route} (${relativePath}) still loads remote Google Fonts.`);
  if (/i\.imgur\.com\/oFHdPUS/i.test(html)) fail(`${route} (${relativePath}) still loads the external portrait.`);

  const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
  if (!canonical) fail(`${route} (${relativePath}) has no canonical URL.`);
  if (canonical?.endsWith('.html')) fail(`${route} (${relativePath}) has a .html canonical URL.`);

  for (const frame of html.matchAll(/<iframe\b[^>]*figma\.com[^>]*>/gi)) {
    if (!/loading=["']lazy["']/i.test(frame[0])) fail(`${route} (${relativePath}) has a non-lazy Figma iframe.`);
    if (!/title=["'][^"']+/i.test(frame[0])) fail(`${route} (${relativePath}) has an untitled Figma iframe.`);
  }
}

if (!fs.existsSync(dist)) {
  fail('dist does not exist. Run npm run build before smoke testing.');
} else {
  for (const route of routes) {
    const resolved = resolveRoute(route);
    if (!resolved) {
      fail(`${route} does not resolve to a built HTML file.`);
      continue;
    }
    assertHtml(route, resolved);
  }

  const redirects = readRedirects();
  for (const source of redirects.keys()) {
    const cycle = findRedirectCycle(redirects, source);
    if (cycle) fail(`Redirect cycle detected: ${cycle.join(' -> ')}`);
  }

  for (const route of ['/about', '/services', '/projects', '/contact']) {
    if (redirects.has(route) && redirects.get(route).to.endsWith('.html')) {
      fail(`Clean route ${route} redirects back to an HTML filename.`);
    }
  }
}

if (errors.length) {
  console.error('Portfolio smoke tests failed:');
  errors.forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `error` Side effects: emits diagnostics or changes process failure state Returns: Undefined; this callback is side-effect-only. */ (error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Portfolio smoke tests passed for ${routes.length} critical routes.`);
