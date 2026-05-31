const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const checks = [
  ['Body text on Apple gray', '#4f4f55', '#f5f5f7', 4.5],
  ['Muted metadata on Apple gray', '#5b5b62', '#f5f5f7', 4.5],
  ['Primary link on Apple gray', '#005bb5', '#f5f5f7', 4.5],
  ['Primary button text', '#ffffff', '#005bb5', 4.5],
  ['Primary button hover text', '#ffffff', '#004f9f', 4.5],
  ['Dark chapter body', '#d7d7dc', '#000000', 4.5],
  ['Dark card body', '#d7d7dc', '#1d1d1f', 4.5],
  ['Dark chapter link', '#6bb7ff', '#000000', 4.5],
  ['White card body', '#4f4f55', '#ffffff', 4.5],
  ['White card metadata', '#5b5b62', '#ffffff', 4.5],
  ['Secondary button text', '#1d1d1f', '#ffffff', 4.5],
  ['Focus ring on white', '#005bb5', '#ffffff', 3],
  ['Border on dark interactive pill', '#86868b', '#2c2c2e', 3],
];

const requiredFiles = [
  'assets/styles/portfolio-system.css',
  'src/scripts/features/atelier-pages.js',
  'src/scripts/features/custom-cursor.js',
];

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return [0, 2, 4].map((start) => Number.parseInt(clean.slice(start, start + 2), 16) / 255);
}

function channelToLinear(channel) {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [red, green, blue] = hexToRgb(hex).map(channelToLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const fg = luminance(foreground);
  const bg = luminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

function fail(message) {
  console.error(`[contrast-audit] ${message}`);
  process.exitCode = 1;
}

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(distDir, relativePath))) {
    fail(`Missing required file: ${relativePath}`);
  }
}

for (const [name, foreground, background, minimum] of checks) {
  const ratio = contrastRatio(foreground, background);
  if (ratio < minimum) {
    fail(`${name} failed contrast: ${foreground} on ${background} = ${ratio.toFixed(2)}:1, expected ${minimum}:1`);
  }
}

const portfolioCss = fs.existsSync(path.join(distDir, 'assets/styles/portfolio-system.css'))
  ? fs.readFileSync(path.join(distDir, 'assets/styles/portfolio-system.css'), 'utf8')
  : '';

for (const requiredToken of ['#4f4f55', '#d7d7dc', '#6bb7ff', '#005bb5', ':focus-visible', '.work-grid', '.project-grid']) {
  if (!portfolioCss.includes(requiredToken)) {
    fail(`portfolio-system.css is missing required token or selector: ${requiredToken}`);
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log('[contrast-audit] WCAG AA token checks passed.');
