/**
 * @fileoverview scripts/smoke-test-dist.mjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for smoke test dist.
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
 * Purpose: Implements the fail responsibility for this module.
 * Inputs: message.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function fail(message) {
  errors.push(message);
}

/**
 * Function contract: routeCandidates
 * Purpose: Implements the route candidates responsibility for this module.
 * Inputs: route.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function routeCandidates(route) {
  if (route === '/') return ['index.html'];
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return [`${clean}.html`, `${clean}/index.html`];
}

/**
 * Function contract: resolveRoute
 * Purpose: Resolves resolve route using the current inputs and repository/runtime context.
 * Inputs: route.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function resolveRoute(route) {
  return routeCandidates(route).find(/** Callback contract: Processes the callback step for route candidates(route) without leaking orchestration details to the caller. Inputs: candidate. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (candidate) => fs.existsSync(path.join(dist, candidate))) || null;
}

/**
 * Function contract: readRedirects
 * Purpose: Retrieves read redirects and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Resolves find redirect cycle using the current inputs and repository/runtime context.
 * Inputs: redirects, start.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the local stylesheets responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function localStylesheets(html) {
  return [...html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map(/** Callback contract: Processes the callback step for [...html.match all(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => match[1])
    .filter(/** Callback contract: Processes the callback step for [...html.match all(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1]) without leaking orchestration details to the caller. Inputs: href. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (href) => !/^https?:\/\//i.test(href));
}

/**
 * Function contract: assertHtml
 * Purpose: Implements the assert html responsibility for this module.
 * Inputs: route, relativePath.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
  errors.forEach(/** Callback contract: Processes the callback step for errors without leaking orchestration details to the caller. Inputs: error. Side effects: may emit diagnostics or inspect process state. No explicit return contract. */ (error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Portfolio smoke tests passed for ${routes.length} critical routes.`);
