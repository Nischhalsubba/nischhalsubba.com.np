/**
 * @fileoverview Canonical Worker routing regression tests.
 * Purpose: Exercise the actual Worker before static-asset routing can emit temporary redirects.
 * Responsibilities: Cover every retained HTML alias, host normalization, queries and safe methods.
 * Execution context: Node validation with isolated Cloudflare-only bindings.
 * Connected files: src/worker.js, config/canonical-routes.json, seo-discovery-lib.cjs, package.json.
 * Maintenance: Keep assertions behavioral; never contact production or send form submissions.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const manifest = JSON.parse(await readFile(new URL('../config/canonical-routes.json', import.meta.url)));
let source = await readFile(new URL('../src/worker.js', import.meta.url), 'utf8');
source = source.replace(/import \{ onRequestOptions, onRequestPost \} from [^;]+;/,
  'const onRequestOptions = () => new Response(null, {status:204}); const onRequestPost = () => new Response(null, {status:503});');
source = source.replace(/import \{ LEGACY_REDIRECTS \} from [^;]+;/,
  `const LEGACY_REDIRECTS = new Map(${JSON.stringify(Object.entries(manifest.redirects))});`);
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const env = { ASSETS: {
  /** Function contract: fetch
   * Purpose: Model the asset binding without network access. Inputs: request. Side effects: none. Returns: a non-HTML sentinel.
   */
  fetch: async () => new Response('asset sentinel', {headers:{'content-type':'text/plain'}}),
} };
let checked = 0;
for (const [from, to] of Object.entries(manifest.redirects)) {
  for (const method of ['GET', 'HEAD']) {
    const response = await worker.fetch(new Request(`https://nischhalsubba.com.np${from}?source=legacy&name=a%20b`, {method}), env);
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), `https://nischhalsubba.com.np${to}?source=legacy&name=a%20b`, from);
    assert.ok(!manifest.redirects[to], `${from}: redirect chain`);
    checked++;
  }
}
for (const file of manifest.html) {
  const route = file === 'index.html' ? '/' : file === 'blog/index.html' ? '/blog/' : '/' + file.replace(/\.html$/, '');
  assert.equal(manifest.redirects['/' + file], route);
  const response = await worker.fetch(new Request(`http://www.nischhalsubba.com.np/${file}?ref=test`), env);
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), `https://nischhalsubba.com.np${route}?ref=test`);
}
assert.equal((await worker.fetch(new Request('https://nischhalsubba.com.np/unknown-do-not-redirect'), env)).status, 200);
assert.equal((await worker.fetch(new Request('https://nischhalsubba.com.np/project-yarsha.html', {method:'POST'}), env)).status, 200);
console.log(`[canonical-routing] ${checked} legacy GET/HEAD cases and ${manifest.html.length} combined host/path migrations passed; query strings and POST behavior preserved.`);

// Analytics must strip arbitrary visitor strings and reject forged successful leads.
const analyticsEntries = [];
const savedConsoleLog = console.log;
console.log = analyticsEntries.push.bind(analyticsEntries);
try {
  const response = await worker.fetch(new Request('https://nischhalsubba.com.np/api/analytics', { method: 'POST', body: JSON.stringify({ event: 'project_view', path: '/contact?email=visitor@example.com', context: 'visitor@example.com', metric: 'visitor@example.com', value: 99 }) }), env);
  assert.equal(response.status, 204);
  assert.deepEqual(JSON.parse(analyticsEntries.pop()), { type: 'portfolio_event', event: 'project_view', path: '/contact', context: 'unknown', metric: '', value: 1 });
  const forged = await worker.fetch(new Request('https://nischhalsubba.com.np/api/analytics', { method: 'POST', body: JSON.stringify({ event: 'contact_success', path: '/contact' }) }), env);
  assert.equal(forged.status, 400);
  assert.equal(analyticsEntries.length, 0);
} finally { console.log = savedConsoleLog; }
console.log('Analytics PII redaction and forged-contact-success rejection passed.');
