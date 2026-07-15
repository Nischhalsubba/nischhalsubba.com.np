const fs = require('node:fs');
const path = require('node:path');

const stylesheetPath = path.join(process.cwd(), 'style.css');
const css = fs.readFileSync(stylesheetPath, 'utf8');
const failures = [];

if (/^\s*\d+(?:;\d+)+&display=swap'\);/m.test(css)) {
  failures.push('style.css contains a malformed font-query fragment');
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

const lightTheme = css.match(/html\[data-theme='light'\]\s*\{([\s\S]*?)\n\}/i)?.[1] || '';
const page = lightTheme.match(/--bg-page:\s*(#[0-9a-f]{6})/i)?.[1];
const secondary = lightTheme.match(/--text-secondary:\s*(#[0-9a-f]{6})/i)?.[1];
const tertiary = lightTheme.match(/--text-tertiary:\s*(#[0-9a-f]{6})/i)?.[1];

for (const [name, value] of [['background', page], ['secondary', secondary], ['tertiary', tertiary]]) {
  if (!value) failures.push(`missing light-theme ${name} token`);
}

if (page && secondary && contrast(secondary, page) < 4.5) {
  failures.push(`light-theme secondary text contrast is ${contrast(secondary, page).toFixed(2)}:1`);
}
if (page && tertiary && contrast(tertiary, page) < 4.5) {
  failures.push(`light-theme tertiary text contrast is ${contrast(tertiary, page).toFixed(2)}:1`);
}

if (failures.length) {
  console.error(`[accessibility-tokens] ${failures.length} failure(s)\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`[accessibility-tokens] light-theme text tokens meet WCAG AA and CSS residue checks passed.`);
