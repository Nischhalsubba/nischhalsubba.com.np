/**
 * @fileoverview scripts/generate-social-previews.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for generate social previews.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - docs/seo-maintenance.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { routeForFile } = require('./seo-discovery-lib.cjs');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const outputDir = path.join(dist, 'assets', 'social');
const SITE = 'https://nischhalsubba.com.np';
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Function contract: crc32
 * Purpose: Implements the crc32 responsibility for this module.
 * Inputs: buffer.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Function contract: chunk
 * Purpose: Implements the chunk responsibility for this module.
 * Inputs: type, data.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function chunk(type, data) {
  const label = Buffer.from(type, 'ascii');
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  label.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([label, data])), 8 + data.length);
  return out;
}

/**
 * Function contract: pngFromRows
 * Purpose: Implements the png from rows responsibility for this module.
 * Inputs: rows.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function pngFromRows(rows) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const raw = Buffer.concat(rows.map(/** Callback contract: Processes the callback step for rows without leaking orchestration details to the caller. Inputs: row. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (row) => Buffer.concat([Buffer.from([0]), row])));
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Function contract: makeCard
 * Purpose: Implements the make card responsibility for this module.
 * Inputs: seed.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function makeCard(seed) {
  const digest = crypto.createHash('sha256').update(seed).digest();
  const rows = [];
  const background = [12, 15, 11];
  const foreground = [243, 246, 234];
  const accent = [216, 255, 72];
  const muted = [38, 45, 34];
  const bars = Array.from({ length: 5 }, /** Callback contract: Processes the callback step for array without leaking orchestration details to the caller. Inputs: _, index. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (_, index) => ({
    x: 690 + (digest[index] % 130),
    y: 90 + index * 92,
    w: 230 + (digest[index + 5] % 250),
    h: 18 + (digest[index + 10] % 34),
  }));

  for (let y = 0; y < HEIGHT; y += 1) {
    const row = Buffer.alloc(WIDTH * 3);
    for (let x = 0; x < WIDTH; x += 1) {
      let color = background;
      if (x >= 72 && x < 88 && y >= 72 && y < 558) color = accent;
      if (x >= 128 && x < 560 && y >= 132 && y < 148) color = foreground;
      if (x >= 128 && x < 490 && y >= 185 && y < 197) color = muted;
      if (x >= 128 && x < 420 && y >= 221 && y < 233) color = muted;
      if (x >= 128 && x < 345 && y >= 257 && y < 269) color = muted;
      if (x >= 128 && x < 360 && y >= 482 && y < 490) color = accent;
      if (bars.some(/** Callback contract: Processes the callback step for bars without leaking orchestration details to the caller. Inputs: bar. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (bar) => x >= bar.x && x < bar.x + bar.w && y >= bar.y && y < bar.y + bar.h)) color = (y % 2 ? accent : foreground);
      const offset = x * 3;
      row[offset] = color[0];
      row[offset + 1] = color[1];
      row[offset + 2] = color[2];
    }
    rows.push(row);
  }
  return pngFromRows(rows);
}

/**
 * Function contract: routeSlug
 * Purpose: Implements the route slug responsibility for this module.
 * Inputs: route.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function routeSlug(route) {
  if (route === '/') return 'home';
  if (route === '/blog/') return 'writing';
  return route.replace(/^\//, '').replace(/\//g, '--').replace(/[^a-z0-9-]/gi, '-');
}

/**
 * Function contract: setMeta
 * Purpose: Applies set meta while preserving the surrounding repository/runtime contract.
 * Inputs: html, attribute, key, value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function setMeta(html, attribute, key, value) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escaped}["'])[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${String(value).replace(/["<>]/g, '')}" />`;
  return regex.test(html) ? html.replace(regex, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

if (!fs.existsSync(dist)) throw new Error('dist directory is missing. Run the production build before social preview generation.');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

let updated = 0;
for (const file of manifest.html) {
  const htmlPath = path.join(dist, file);
  if (!fs.existsSync(htmlPath)) throw new Error(`Missing canonical output for social preview: ${file}`);

  const route = routeForFile(file);
  const filename = `${routeSlug(route)}.png`;
  const imageUrl = `${SITE}/assets/social/${filename}`;
  fs.writeFileSync(path.join(outputDir, filename), makeCard(route));

  let html = fs.readFileSync(htmlPath, 'utf8');
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || 'Nischhal Raj Subba';
  html = setMeta(html, 'property', 'og:image', imageUrl);
  html = setMeta(html, 'property', 'og:image:alt', `${title} - Nischhal Raj Subba portfolio`);
  html = setMeta(html, 'property', 'og:image:width', String(WIDTH));
  html = setMeta(html, 'property', 'og:image:height', String(HEIGHT));
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:image', imageUrl);
  html = setMeta(html, 'name', 'twitter:image:alt', `${title} - Nischhal Raj Subba portfolio`);
  fs.writeFileSync(htmlPath, html, 'utf8');
  updated += 1;
}

console.log(`[social-preview] Generated ${updated} deterministic ${WIDTH}x${HEIGHT} PNG cards from canonical routes.`);
