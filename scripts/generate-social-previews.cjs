const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const portrait = `${site}/assets/images/portrait.png`;

function absoluteImage(src) {
  if (!src || /^data:/i.test(src)) return '';
  try { return new URL(src, `${site}/`).href; } catch { return ''; }
}

function pageImages(html) {
  const images = [];
  const seen = new Set();
  for (const match of html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    const src = absoluteImage(match[1]);
    if (!src || seen.has(src) || /favicon|logo|icon|social\//i.test(src)) continue;
    seen.add(src);
    images.push(src);
  }
  return images;
}

function preferredImage(html) {
  const images = pageImages(html);
  return images.find((src) => /\.(?:png|jpe?g|webp|avif)(?:[?#]|$)/i.test(src)) || images[0] || portrait;
}

function setMeta(html, attribute, key, value) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escaped}["'])[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${value.replace(/["<>]/g, '')}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

function removeMeta(html, attribute, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`\\s*<meta\\b(?=[^>]*\\b${attribute}=["']${escaped}["'])[^>]*>`, 'gi'), '');
}

if (!fs.existsSync(dist)) throw new Error('dist directory is missing.');

/* Delete the old generated-card directory so Search/social crawlers cannot keep discovering it in fresh builds. */
const retired = path.join(dist, 'assets', 'images', 'social');
if (fs.existsSync(retired)) fs.rmSync(retired, { recursive: true, force: true });

let updated = 0;
for (const file of manifest.html) {
  const filePath = path.join(dist, file);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  const image = preferredImage(html);
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() || 'Nischhal Raj Subba';

  html = removeMeta(html, 'property', 'og:image:width');
  html = removeMeta(html, 'property', 'og:image:height');
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:alt', `${title} — portfolio image`);
  html = setMeta(html, 'name', 'twitter:image', image);
  html = setMeta(html, 'name', 'twitter:image:alt', `${title} — portfolio image`);
  fs.writeFileSync(filePath, html, 'utf8');
  updated += 1;
}

console.log(`[social-preview] Assigned real page/project imagery to ${updated} route(s); synthetic preview cards retired.`);
