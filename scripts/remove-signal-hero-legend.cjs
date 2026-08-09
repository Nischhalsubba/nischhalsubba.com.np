const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const homePath = path.join(base, 'index.html');

if (!fs.existsSync(homePath)) {
  throw new Error(`[signal-hero-cleanup] Missing ${homePath}`);
}

let html = fs.readFileSync(homePath, 'utf8');
const legendStart = html.indexOf('<div class="legend" aria-label="Visual legend">');

if (legendStart >= 0) {
  const hintStart = html.indexOf('<p class="hint">', legendStart);
  if (hintStart < 0) {
    throw new Error('[signal-hero-cleanup] Legend found but instruction hint boundary is missing.');
  }

  const hintEnd = html.indexOf('</p>', hintStart);
  if (hintEnd < 0) {
    throw new Error('[signal-hero-cleanup] Instruction hint closing tag is missing.');
  }

  html = html.slice(0, legendStart) + html.slice(hintEnd + 4);
}

if (html.includes('<div class="legend" aria-label="Visual legend">')) {
  throw new Error('[signal-hero-cleanup] Visual legend survived cleanup.');
}
if (html.includes('<p class="hint">Desktop: move the pointer for subtle depth.')) {
  throw new Error('[signal-hero-cleanup] Interaction instruction survived cleanup.');
}

fs.writeFileSync(homePath, html, 'utf8');
console.log('[signal-hero-cleanup] Removed the visual legend and interaction instruction from the homepage hero.');
