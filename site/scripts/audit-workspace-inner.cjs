/**
 * @fileoverview Verify every generated inner route uses the approved workspace system.
 * Purpose: Enforce sitewide design, dependency, content preservation and route integrity.
 * Responsibilities: Check full route coverage, content hashes, local images, links and contact runtime.
 * Execution context: Node CI validation, after final production installers.
 * Connected files: install-workspace-inner.cjs, src/workspace-inner, package.json.
 * Maintenance: Extend behavior coverage without reintroducing obsolete theme or shell selectors.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const dist = path.resolve(__dirname, '../dist');
const inventory = JSON.parse(fs.readFileSync(path.join(dist, 'workspace-inner/routes.json'), 'utf8'));
assert.equal(inventory.filter(route => route.kind === 'project').length, 14);
assert.equal(inventory.filter(route => route.kind === 'blog-index').length, 1);
assert.equal(inventory.filter(route => route.kind === 'article').length, 27);
let links = 0;
for (const route of inventory) {
  const html = fs.readFileSync(path.join(dist, route.file), 'utf8');
  assert.match(html, /data-portfolio-design="workspace-inner-v1"/);
  assert.equal((html.match(/<main\b/g) || []).length, 1, route.file + ': one main');
  assert.equal((html.match(/aria-label="Breadcrumb"/g) || []).length, 1, route.file + ': one location trail');
  assert.ok(html.includes('class="tb-t tb-blog"'), route.file + ': visible Blog destination');
  if (route.kind === 'blog-index') assert.equal((html.match(/class="workspace-story-card"/g) || []).length, 27, 'Every article has a visual discovery card');
  assert.equal((html.match(/<h1\b/g) || []).length, 1, route.file + ': one h1');
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="pill"/);
  assert.match(html, /href="\/workspace-inner\/inner.css"/);
  assert.match(html, /src="\/workspace-inner\/inner.js"/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:style\.css|script\.js)/);
  const main = html.match(/<main\b[\s\S]*?<\/main>/)[0];
  assert.equal(crypto.createHash('sha256').update(main).digest('hex'), route.contentHash, route.file + ': preserved content');
  for (const match of html.matchAll(/<(a|img|script|link)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
    const ref = match[2];
    if (!ref.startsWith('/') || ref.startsWith('//') || ref.startsWith('/api/')) continue;
    const pathname = new URL(ref, 'https://nischhalsubba.com.np').pathname;
    const local = path.join(dist, decodeURI(pathname));
    const exists = [local, local + '.html', path.join(local, 'index.html')].some(candidate => fs.existsSync(candidate));
    assert.ok(exists, `${route.file}: missing ${ref}`); links++;
  }
}
const about = fs.readFileSync(path.join(dist, 'about.html'), 'utf8');
assert.match(about, /I’m a Nepal-based product designer working remotely\./, 'Current About biography must use the approved Nepal-based remote wording');
assert.match(about, /The résumé behind 7\+ years/);
assert.match(about, /Aug 2018/);
assert.doesNotMatch(about, /6\+ years/);
const contact = fs.readFileSync(path.join(dist, 'contact.html'), 'utf8');
assert.match(contact, /action="\/api\/contact"/);
assert.match(contact, /id="contact-form"/);
assert.ok(fs.existsSync(path.join(dist, 'src/scripts/features/forms/contact-form.js')));
console.log(`[workspace-inner] ${inventory.length} routes, 14 projects, 27 articles, content hashes and ${links} local links passed.`);
