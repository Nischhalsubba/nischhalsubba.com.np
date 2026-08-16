/**
 * @fileoverview scripts/compile-single-stylesheet.cjs
 * Purpose: Keep the site on one production stylesheet while folding the maintained inner-page, case-study, and interaction-motion style systems into that canonical CSS file.
 * Responsibilities:
 * - Read the selected source or production `style.css` depending on whether `--dist` is present.
 * - Load the maintained inner-page, case-study, and interaction-motion system fragments when they exist.
 * - Replace the previously compiled block instead of appending duplicate copies on repeated runs.
 * - Preserve the current light-theme contrast correction and stylesheet version marker used by the build.
 * Execution context: Node.js source-generation and production-build stage used by `scripts/generate-source.cjs` and `scripts/build-dist.cjs`.
 * Connected files:
 * - src/styles/systems/inner-pages.css
 * - src/styles/systems/case-study.css
 * - src/styles/systems/interaction-motion.css
 * - scripts/audit-css-architecture.cjs
 * - scripts/generate-source.cjs
 * - scripts/build-dist.cjs
 * Maintenance: Keep this stage idempotent. New style systems should have a clear owner and should be added here only when they belong in the single served stylesheet contract.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const fragmentFiles = [
  path.join(root, 'src', 'styles', 'systems', 'inner-pages.css'),
  path.join(root, 'src', 'styles', 'systems', 'case-study.css'),
  path.join(root, 'src', 'styles', 'systems', 'interaction-motion.css'),
];
const startMarker = '/* nrs-single-source-inner-pages-v50:compiled:start */';
const endMarker = '/* nrs-single-source-inner-pages-v50:compiled:end */';

let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
const fragments = fragmentFiles
  .filter(
    /** Callback contract: Keep only style-system fragments that exist in the current checkout. Inputs: `file` - absolute fragment path. Side effects: Reads filesystem state. Returns: `true` when the fragment exists. */
    (file) => fs.existsSync(file),
  )
  .map(
    /** Callback contract: Read one included style-system fragment and trim surrounding whitespace before composition. Inputs: `file` - absolute fragment path. Side effects: Reads filesystem state. Returns: Trimmed CSS text. */
    (file) => fs.readFileSync(file, 'utf8').trim(),
  )
  .filter(Boolean)
  .join('\n\n');

stylesheet = stylesheet
  .replace(/^\s*500;600;700;800&display=swap'\);\s*$/m, '')
  .replace(/Version:\s*[0-9.]+/, 'Version: 51.0')
  .replace(
    /html\[data-theme='light'\]([\s\S]*?)--text-tertiary:\s*#[0-9a-f]{6};/i,
    /** Callback contract: Preserve the matched light-theme block while replacing only the tertiary-text color with the approved contrast value. Inputs: `match` - full match; `prefix` - captured declarations before the color. Side effects: None. Returns: Updated light-theme CSS fragment. */
    (_match, prefix) => `html[data-theme='light']${prefix}--text-tertiary: #5f655b;`,
  )
  .replace(/\/\* nrs-single-source-inner-pages-v\d+:compiled:start \*\/[\s\S]*?\/\* nrs-single-source-inner-pages-v\d+:compiled:end \*\/\s*/g, '')
  .trimEnd();

stylesheet += `\n\n${startMarker}\n${fragments}\n${endMarker}\n`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');
console.log(`Compiled the maintained inner-page style systems into ${path.relative(root, stylesheetPath) || 'style.css'}.`);
