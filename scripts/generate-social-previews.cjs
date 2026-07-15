const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';
const width = 1200;
const height = 630;
const pages = [
  ['index.html', 'home'],
  ['projects.html', 'projects'],
  ['services.html', 'services'],
  ['product-design-nepal.html', 'product-design-nepal'],
  ['saas-ux-designer.html', 'saas-ux-designer'],
  ['web3-ux-designer.html', 'web3-ux-designer'],
  ['figma-design-systems.html', 'figma-design-systems'],
  ['ux-audit.html', 'ux-audit'],
  ['website-ux-design.html', 'website-ux-design'],
  ['project-yarsha.html', 'project-yarsha'],
  ['project-mokshya.html', 'project-mokshya'],
];

function color(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}

function pixel(buffer, x, y, rgb) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const index = (y * width + x) * 4;
  buffer[index] = rgb[0];
  buffer[index + 1] = rgb[1];
  buffer[index + 2] = rgb[2];
  buffer[index + 3] = 255;
}

function rect(buffer, x, y, w, h, rgb) {
  for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy += 1) {
    for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx += 1) pixel(buffer, xx, yy, rgb);
  }
}

function circle(buffer, cx, cy, radius, rgb) {
  const radiusSquared = radius * radius;
  for (let y = cy - radius; y <= cy + radius; y += 1) {
    for (let x = cx - radius; x <= cx + radius; x += 1) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radiusSquared) pixel(buffer, x, y, rgb);
    }
  }
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function encodePng(rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const offset = y * (width * 4 + 1);
    raw[offset] = 0;
    rgba.copy(raw, offset + 1, y * width * 4, (y + 1) * width * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function render(slug) {
  const rgba = Buffer.alloc(width * height * 4);
  const accents = ['#d8ff48', '#70f1c5', '#f5c26b', '#b8a7ff'];
  const hash = [...slug].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const accent = color(accents[hash % accents.length]);
  rect(rgba, 0, 0, width, height, color('#0b0f0d'));
  rect(rgba, 0, 0, 18, height, accent);
  rect(rgba, 72, 62, 1056, 506, color('#151c18'));
  rect(rgba, 110, 106, 500, 24, accent);
  rect(rgba, 110, 164, 690, 58, color('#f2f5eb'));
  rect(rgba, 110, 244, 570, 58, color('#f2f5eb'));
  rect(rgba, 110, 342, 420, 16, color('#aab3a8'));
  rect(rgba, 110, 378, 510, 16, color('#aab3a8'));
  circle(rgba, 1015, 140, 155, accent);
  circle(rgba, 1040, 545, 220, color('#111713'));
  for (let index = 0; index < 6; index += 1) rect(rgba, 770 + index * 54, 360 + (index % 2) * 34, 32, 158, accent);
  return encodePng(rgba);
}

function replaceMeta(html, attribute, key, value) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escaped}["'])[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${value}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

if (!fs.existsSync(dist)) throw new Error('dist directory is missing.');
const output = path.join(dist, 'assets', 'images', 'social');
fs.mkdirSync(output, { recursive: true });

for (const [file, slug] of pages) {
  const filePath = path.join(dist, file);
  if (!fs.existsSync(filePath)) throw new Error(`Missing social-preview page: ${file}`);
  const imageUrl = `${site}/assets/images/social/${slug}.png`;
  fs.writeFileSync(path.join(output, `${slug}.png`), render(slug));
  let html = fs.readFileSync(filePath, 'utf8');
  html = replaceMeta(html, 'property', 'og:image', imageUrl);
  html = replaceMeta(html, 'name', 'twitter:image', imageUrl);
  html = replaceMeta(html, 'property', 'og:image:width', '1200');
  html = replaceMeta(html, 'property', 'og:image:height', '630');
  fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`[social-preview] Generated ${pages.length} deterministic raster previews.`);
