/**
 * @fileoverview scripts/audit-accessibility-tokens.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for audit accessibility tokens.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const stylesheetPath = path.join(process.cwd(), 'style.css');
const css = fs.readFileSync(stylesheetPath, 'utf8');
const failures = [];

if (/^\s*\d+(?:;\d+)+&display=swap'\);/m.test(css)) {
  failures.push('style.css contains a malformed font-query fragment');
}

/**
 * Function contract: hexToRgb
 * Purpose: Implements the hex to rgb responsibility for this module.
 * Inputs: hex.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map(/** Callback contract: Processes the callback step for [0, 2, 4] without leaking orchestration details to the caller. Inputs: offset. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}

/**
 * Function contract: luminance
 * Purpose: Implements the luminance responsibility for this module.
 * Inputs: hex.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(/** Callback contract: Processes the callback step for hex to rgb(hex) without leaking orchestration details to the caller. Inputs: channel. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Function contract: contrast
 * Purpose: Implements the contrast responsibility for this module.
 * Inputs: foreground, background.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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
  console.error(`[accessibility-tokens] ${failures.length} failure(s)\n${failures.map(/** Callback contract: Processes the callback step for failures without leaking orchestration details to the caller. Inputs: failure. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log(`[accessibility-tokens] light-theme text tokens meet WCAG AA and CSS residue checks passed.`);
