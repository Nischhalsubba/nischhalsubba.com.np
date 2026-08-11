/**
 * @fileoverview scripts/generate-social-previews.cjs
 * Purpose: Generate or assemble generate social previews deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/seo-discovery-lib.cjs
 * - docs/seo-maintenance.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Implement the crc32 responsibility owned by the generate social previews repository tool.
 * Inputs: `buffer`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
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
 * Purpose: Implement the chunk responsibility owned by the generate social previews repository tool.
 * Inputs: `type`: input consumed by this operation; `data`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Implement the png from rows responsibility owned by the generate social previews repository tool.
 * Inputs: `rows`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function pngFromRows(rows) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const raw = Buffer.concat(rows.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `row`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (row) => Buffer.concat([Buffer.from([0]), row])));
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/**
 * Function contract: makeCard
 * Purpose: Build card from the supplied inputs in the form expected by downstream generate social previews repository tool consumers.
 * Inputs: `seed`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function makeCard(seed) {
  const digest = crypto.createHash('sha256').update(seed).digest();
  const rows = [];
  const background = [12, 15, 11];
  const foreground = [243, 246, 234];
  const accent = [216, 255, 72];
  const muted = [38, 45, 34];
  const bars = Array.from({ length: 5 }, /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `_`, `index`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (_, index) => ({
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
      if (bars.some(/** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `bar`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (bar) => x >= bar.x && x < bar.x + bar.w && y >= bar.y && y < bar.y + bar.h)) color = (y % 2 ? accent : foreground);
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
 * Purpose: Implement the route slug responsibility owned by the generate social previews repository tool.
 * Inputs: `route`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function routeSlug(route) {
  if (route === '/') return 'home';
  if (route === '/blog/') return 'writing';
  return route.replace(/^\//, '').replace(/\//g, '--').replace(/[^a-z0-9-]/gi, '-');
}

/**
 * Function contract: setMeta
 * Purpose: Synchronize meta with the requested state while preserving related generate social previews repository tool invariants.
 * Inputs: `html`: input consumed by this operation; `attribute`: input consumed by this operation; `key`: input consumed by this operation; `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
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
