/**
 * @fileoverview Final SEO and social-preview acceptance checks across every live page template.
 * Purpose: Verify deployed HTML search signals instead of relying on pre-redesign source audits.
 * Responsibilities: Canonicals, image format/dimensions, metadata, entity identities, sitemap and internal discovery.
 * Execution context: Node after final workspace build stages.
 * Connected files: finalize-workspace-seo.cjs, package.json, src/workspace-inner.
 * Maintenance: Assert technical readiness only; this test cannot establish Google indexing or rankings.
 */
const fs = require('node:fs'); const path = require('node:path'); const assert = require('node:assert/strict');
const { PNG } = require('pngjs');
const crypto = require('node:crypto');
const dist = path.resolve(__dirname, '../dist');
const records = JSON.parse(fs.readFileSync(path.join(dist, 'workspace-inner/seo-inventory.json'), 'utf8'));
const site = 'https://nischhalsubba.com.np'; const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
assert.equal(records.length, 53); assert.equal(new Set(records.map(record => record.url)).size, 53);
assert.equal(new Set(records.map(record => record.image)).size, 53);
assert.match(sitemap, /http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9/);
for (const record of records) {
  const html = fs.readFileSync(path.join(dist, record.file), 'utf8');
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, record.file + ': one canonical');
  assert.ok(!record.url.endsWith('.html')); assert.ok(record.description.length >= 40, record.file + ': useful description');
  assert.match(html, /max-image-preview:large/); assert.match(html, /property="og:image:type" content="image\/png"/);
  const imageBytes = fs.readFileSync(path.join(dist, new URL(record.image).pathname));
  const imageHash = crypto.createHash('sha256').update(imageBytes).digest('hex').slice(0,12);
  assert.ok(new URL(record.image).pathname.endsWith('-' + imageHash + '.png'), 'Immutable social URLs must match content hashes');
  const png = PNG.sync.read(imageBytes);
  assert.equal(png.width, 1200); assert.equal(png.height, 630);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.equal(graph.filter(node => node['@type'] === 'Person').length, 1);
  assert.equal(graph.filter(node => node['@type'] === 'WebSite').length, 1);
  assert.ok(graph.some(node => node['@id'] === site + '/#nischhal-raj-subba'));
  if (record.isArticle) assert.ok(graph.some(node => ['BlogPosting','Article'].includes(node['@type'])));
  assert.ok(sitemap.includes(`<loc>${record.url}</loc>`), record.file + ': sitemap');
  assert.ok(sitemap.includes(record.image));
}
const writing = fs.readFileSync(path.join(dist, 'blog/index.html'), 'utf8');
for (const record of records.filter(record => record.isArticle)) assert.ok(writing.includes(`href="${new URL(record.url).pathname}"`), record.file + ': HTML discovery');
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.match(home, /aria-label="Explore portfolio"/); assert.match(home, /href="\/blog\/"/);
assert.match(fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8'), /User-agent: OAI-SearchBot\nAllow: \//);
assert.match(fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8'), /Nischhal Raj Subba/);
const primitives = fs.readFileSync(path.join(dist, 'workspace-inner/homepage-primitives.js'), 'utf8');
const original = fs.readFileSync(path.join(dist, 'workspace-home/index.html'), 'utf8');
assert.ok(original.includes(primitives.match(/class Decoder [\s\S]*?(?=\nfunction chSize)/)[0].trim()), 'Decoder must come directly from homepage');
console.log('[workspace-seo] All 53 canonicals, 1200x630 PNG cards, entity graphs, sitemap entries and article discovery links passed.');
