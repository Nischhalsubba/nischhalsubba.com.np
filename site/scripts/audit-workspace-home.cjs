/**
 * @fileoverview Validate the approved workspace homepage and its deployment boundaries.
 * Purpose: Check public identity, assets, project destinations, semantic structure and syntax in final output.
 * Responsibilities: Keep the approved homepage, dependency paths and retained routes coherent.
 * Execution context: Node validation, after the final homepage installer.
 * Connected files: src/workspace-home, scripts/install-workspace-home.cjs, package.json.
 * Maintenance: Add behavior regressions here rather than retaining obsolete editorial-hero assertions.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const dist = path.resolve(__dirname, '../dist');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.match(html, /data-portfolio-design="workspace-v1"/);
assert.match(html, /<main id="main-content">/);
assert.match(html, /class="skip-link"/);
assert.doesNotMatch(html, /<link\b[^>]*rel="stylesheet"/, 'Homepage critical CSS must not wait for another request.');
assert.match(html, /url\("\/workspace-home\/vendor\/fonts.gstatic.com\/ab38da6f5df1b377.woff2"\)/, 'Inlined font URLs must retain their original resource location.');
const fontSubsets = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/content/font-subsets.json'), 'utf8'));
for (const font of fontSubsets) {
  assert.ok(html.includes(font.output), 'Primary font subset must be emitted: ' + font.family);
  assert.ok(html.includes(font.original), 'Original glyph coverage must remain available: ' + font.family);
  assert.ok(fs.existsSync(path.join(dist, 'workspace-home/vendor/fonts.gstatic.com', font.output)));
  assert.ok(font.bytes < font.originalBytes, 'Measured font transfer must decrease');
}
assert.match(html, /Nischhal Raj Subba/);
assert.match(html, /rel="canonical" href="https:\/\/nischhalsubba.com.np\/"/);
assert.doesNotMatch(html, /hridoy|nischhal-design-portfolio\.grittytide4|track\.php|fetch\('contact\.php'/i);
assert.match(html, /mod\.sendPayload\(endpoint, payload/);
assert.doesNotMatch(html, /location\.href = `mailto:/);
let inline = 0;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (!match[2].trim() || match[1].includes('ld+json')) continue;
  new vm.Script(match[2]); inline++;
}
new vm.Script(fs.readFileSync(path.join(dist, 'workspace-home/personal.js'), 'utf8'));
for (const match of html.matchAll(/<(?:img|script|link)\b[^>]*(?:src|href)="([^"]+)"/g)) {
  const ref = match[1];
  if (!ref.startsWith('/workspace-home/')) continue;
  assert.ok(fs.existsSync(path.join(dist, ref.split('?')[0])), `Missing dependency ${ref}`);
}
const config = JSON.parse(html.match(/window\.__C=([\s\S]*?);<\/script>/)[1]);
const recognition = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/content/uxcel-recognition.json'), 'utf8'));
assert.equal(recognition.ranking.kind, 'DATED_WEEKLY_SNAPSHOT');
assert.ok(config.testimonials.some(item => item.url === recognition.ranking.source && item.q.includes('90/100') && item.q.includes('3 November 2026') && item.q.includes('Pro-member')));
assert.ok(config.testimonials.some(item => item.url === recognition.historical.find(record => record.year === 2023).source && item.q.includes('2023') && item.q.includes('Product Designer')));
assert.doesNotMatch(html, /Uxcel Global Rankings 2024 · Ranked #1 Designer/, 'Do not conflate an unverified legacy annual claim with a verified current snapshot.');
assert.equal(config.work.length, 14);
assert.ok(config.pricing.every(service => service.p === 0), 'Do not invent rates.');
for (const item of config.work) {
  assert.ok(fs.existsSync(path.join(dist, item.img)), `Missing project image ${item.img}`);
  const route = new URL(item.url, 'https://nischhalsubba.com.np').pathname;
  assert.ok(fs.existsSync(path.join(dist, route + '.html')), `Missing case study ${route}`);
}
for (const entry of config.testimonials) assert.ok(entry.url, 'Credential needs a destination.');
assert.ok(fs.existsSync(path.join(dist, 'contact.html')), 'Keep first-party contact route.');
assert.ok(fs.existsSync(path.join(dist, 'blog/index.html')), 'Keep writing archive.');
console.log(`[workspace-home] ${inline} inline scripts, 14 case studies, local assets, identity and retained-route boundaries passed.`);
