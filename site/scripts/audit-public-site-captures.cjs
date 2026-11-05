/**
 * @fileoverview Verify independently captured public-site assets in the final build.
 * Purpose: Prevent original/hash drift, missing responsive sources and lost source attribution.
 * Responsibilities: Check publication records, PNG/WebP bytes and final HTML discovery links.
 * Execution context: Local and CI validation after final workspace installation.
 * Connected files: public-site-captures.cjs; src/content/public-site-captures.json; package.json.
 * Maintenance: Hash integrity does not replace visual review, rights checks or source authentication.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const captures = require('../src/content/public-site-captures.json');
const routes = require('../config/canonical-routes.json').html;
const dist = path.resolve(__dirname, '../dist');
const ids = new Set();
/** Function contract: asset
 * Purpose: Read a capture only from its committed public asset namespace.
 * Inputs: public URL. Side effects: reads final build. Returns: file bytes.
 */
function asset(url) {
 assert.ok(url.startsWith('/assets/images/site-captures/') && !url.includes('..'), 'Capture must use a local static asset');
 return fs.readFileSync(path.join(dist, url));
}
/** Function contract: digest
 * Purpose: Compare published bytes with independently reviewed provenance.
 * Inputs: bytes. Side effects: none. Returns: SHA256 hex digest.
 */
function digest(bytes) { return crypto.createHash('sha256').update(bytes).digest('hex'); }
for (const record of captures) {
 assert.match(record.id, /^[a-z0-9-]+$/);
 assert.ok(!ids.has(record.id), 'Capture IDs must be unique'); ids.add(record.id);
 assert.equal(new URL(record.sourceUrl).protocol, 'https:');
 assert.ok(['OWNER_REQUESTED_PUBLIC_DEMO_CAPTURE', 'OWNER_REQUESTED_PUBLIC_PROJECT_CAPTURE'].includes(record.permission), 'Unapproved publication record');
 assert.ok(record.caption && record.alt && record.roleBoundary && record.capturedAt);
 assert.ok(Number.isFinite(Date.parse(record.capturedAt)));
 const file = record.route.slice(1) + '.html'; assert.ok(routes.includes(file));
 const png = asset(record.socialSrc); assert.equal(digest(png), record.sourceSha256);
 assert.equal(png.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
 assert.equal(png.readUInt32BE(16), record.sourceViewport.width); assert.equal(png.readUInt32BE(20), record.sourceViewport.height);
 assert.equal(digest(asset(record.fullOriginal)), record.fullOriginalSha256);
 const widths = new Set();
 for (const variant of record.variants) {
  assert.ok(variant.width > 0 && variant.height > 0 && !widths.has(variant.width)); widths.add(variant.width);
  assert.equal(variant.width / variant.height, record.sourceViewport.width / record.sourceViewport.height);
  const bytes = asset(variant.src); assert.equal(digest(bytes), variant.sha256); assert.equal(bytes.length, variant.bytes);
  assert.equal(bytes.subarray(0,4).toString(), 'RIFF'); assert.equal(bytes.subarray(8,12).toString(), 'WEBP');
 }
 assert.ok(widths.size >= 2, 'Responsive capture needs more than one size');
 const html = fs.readFileSync(path.join(dist, file), 'utf8');
 const figure = html.match(new RegExp('<figure\\b[^>]*data-site-capture="' + record.id + '"[^>]*>([\\s\\S]*?)</figure>'));
 assert.ok(figure, 'The actual evidence figure must survive generation');
 assert.ok(figure[1].includes(record.socialSrc), 'Evidence figure must use its reviewed original fallback');
 for (const variant of record.variants) assert.ok(figure[1].includes(variant.src), 'Evidence figure must use its own reviewed responsive sources');
 assert.ok(html.includes(record.fullOriginal) && html.includes(record.sourceUrl), 'Original and source must remain discoverable');
 assert.ok(html.includes('srcset="') && html.includes('figcaption'), 'Responsive picture and caption must survive generation');
}
console.log(`[public-captures] ${captures.length} reviewed records: original/variant hashes, codecs, dimensions and final source links passed.`);
