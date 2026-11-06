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
 assert.ok(['OWNER_REQUESTED_PUBLIC_DEMO_CAPTURE', 'OWNER_REQUESTED_PUBLIC_PROJECT_CAPTURE', 'GPL_3_0_OFFICIAL_REFERENCE', 'OWNER_REQUESTED_STATIC_PUBLIC_REFERENCE', 'APACHE_2_0_PUBLIC_COMPONENT_REFERENCE'].includes(record.permission), 'Unapproved publication record');
 if(record.kind === 'INDEPENDENT_COMPONENT_CAPTURE') { assert.equal(record.permission,'APACHE_2_0_PUBLIC_COMPONENT_REFERENCE'); assert.equal(record.license,'Apache-2.0'); assert.ok(record.sourceImageDimensions && record.sourceElementBounds && record.sourceViewport.deviceScaleFactor===2); }
 if(record.licenseUrl) assert.equal(digest(asset(record.licenseUrl)),record.licenseSha256);
 if(record.displayMaxWidth) assert.ok(Number.isFinite(record.displayMaxWidth)&&record.displayMaxWidth>0&&record.displayMaxWidth<=1440);
 if(record.kind === 'STATIC_PUBLIC_WEBSITE_REFERENCE') { assert.equal(record.permission,'OWNER_REQUESTED_STATIC_PUBLIC_REFERENCE'); if(record.useAsPreview){ assert.equal(record.route,'/project-designerex'); assert.equal(record.referenceOnlyPreview,true); assert.equal(record.replacesSourcePending,true); assert.equal(record.previewDisclosure,'Current public-site reference'); assert.ok(!require('../src/content/portfolio-evidence-images.json').some(image => image.project==='Designerex'),'Current reference cannot displace a verified historical Designerex frame'); } else assert.equal(record.useAsPreview,false,'A scoped reference must not displace authored previews'); assert.ok(record.sourceCreator && record.sourceDiagnostics && record.roleBoundary); }
 if(record.kind === 'OFFICIAL_SOURCE_SCREENSHOT') { assert.equal(record.permission,'GPL_3_0_OFFICIAL_REFERENCE'); assert.equal(record.license,'GPL-3.0'); assert.equal(digest(asset(record.licenseUrl)),record.licenseSha256); assert.ok(record.sourceCreator && record.noticeUrl && record.sourceOriginalSha256 === record.fullOriginalSha256); }
 assert.ok(record.caption && record.alt && record.roleBoundary && record.capturedAt);
 assert.ok(Number.isFinite(Date.parse(record.capturedAt)));
 const file = record.route.slice(1) + '.html'; assert.ok(routes.includes(file));
 const dimensions = record.sourceImageDimensions || record.sourceViewport;
 const png = asset(record.socialSrc); assert.equal(digest(png), record.sourceSha256);
 assert.equal(png.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
 assert.equal(png.readUInt32BE(16), dimensions.width); assert.equal(png.readUInt32BE(20), dimensions.height);
 assert.equal(digest(asset(record.fullOriginal)), record.fullOriginalSha256);
 if(record.originalCapture){ assert.equal(digest(asset(record.originalCapture)),record.originalCaptureSha256); assert.equal(asset(record.originalCapture).subarray(0,2).toString('hex'),'ffd8'); }
 const widths = new Set();
 for (const variant of record.variants) {
  assert.ok(variant.width > 0 && variant.height > 0 && !widths.has(variant.width)); widths.add(variant.width);
  assert.ok(Math.abs(variant.height - variant.width * dimensions.height / dimensions.width) <= 1, 'Preserve aspect within one rounding pixel');
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
