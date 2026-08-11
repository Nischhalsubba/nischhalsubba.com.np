/**
 * @fileoverview scripts/compile-single-stylesheet.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for compile single stylesheet.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/audit-css-architecture.cjs
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylesheetPath = path.join(targetRoot, 'style.css');
const fragmentFiles = [
  path.join(root, 'src', 'styles', 'systems', 'inner-pages.css'),
  path.join(root, 'src', 'styles', 'systems', 'case-study.css'),
];
const startMarker = '/* nrs-single-source-inner-pages-v50:compiled:start */';
const endMarker = '/* nrs-single-source-inner-pages-v50:compiled:end */';

let stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
const fragments = fragmentFiles
  .filter(/** Callback contract: Processes the callback step for fragment files without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (file) => fs.existsSync(file))
  .map(/** Callback contract: Processes the callback step for fragment files
  .filter((file) => fs.exists sync(file)) without leaking orchestration details to the caller. Inputs: file. Side effects: may read or write repository/filesystem state. No explicit return contract. */ (file) => fs.readFileSync(file, 'utf8').trim())
  .filter(Boolean)
  .join('\n\n');

stylesheet = stylesheet
  .replace(/^\s*500;600;700;800&display=swap'\);\s*$/m, '')
  .replace(/Version:\s*[0-9.]+/, 'Version: 51.0')
  .replace(/html\[data-theme='light'\]([\s\S]*?)--text-tertiary:\s*#[0-9a-f]{6};/i, /** Callback contract: Processes the callback step for stylesheet
  .replace(/^\s*500;600;700;800&display=swap'\);\s*$/m, '')
  .replace(/version:\s*[0 9.]+/, 'version: 51.0') without leaking orchestration details to the caller. Inputs: match, prefix. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match, prefix) => `html[data-theme='light']${prefix}--text-tertiary: #5f655b;`)
  .replace(/\/\* nrs-single-source-inner-pages-v\d+:compiled:start \*\/[\s\S]*?\/\* nrs-single-source-inner-pages-v\d+:compiled:end \*\/\s*/g, '')
  .trimEnd();

stylesheet += `\n\n${startMarker}\n${fragments}\n${endMarker}\n`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');
console.log(`Compiled the redesigned visual system into ${path.relative(root, stylesheetPath) || 'style.css'}.`);
