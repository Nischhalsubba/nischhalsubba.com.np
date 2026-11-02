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
assert.match(html, /Nischhal Raj Subba/);
assert.match(html, /rel="canonical" href="https:\/\/nischhalsubba.com.np\/"/);
assert.doesNotMatch(html, /hridoy|nischhal-design-portfolio\.grittytide4|track\.php|fetch\('contact\.php'/i);
assert.match(html, /mailto:\$\{EMAIL\}/);
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
