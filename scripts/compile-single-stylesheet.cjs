/**
 * @fileoverview scripts/compile-single-stylesheet.cjs
 * Purpose: Generate or assemble compile single stylesheet deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/audit-css-architecture.cjs
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
  .filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `file` Side effects: reads filesystem state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (file) => fs.existsSync(file))
  .map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file` Side effects: reads filesystem state Returns: Computed expression result consumed by the enclosing operation. */ (file) => fs.readFileSync(file, 'utf8').trim())
  .filter(Boolean)
  .join('\n\n');

stylesheet = stylesheet
  .replace(/^\s*500;600;700;800&display=swap'\);\s*$/m, '')
  .replace(/Version:\s*[0-9.]+/, 'Version: 51.0')
  .replace(/html\[data-theme='light'\]([\s\S]*?)--text-tertiary:\s*#[0-9a-f]{6};/i,  /** Callback contract: Perform the local callback step required by the immediately enclosing compile single stylesheet repository tool operation. Inputs: `match`, `prefix` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match, prefix) => `html[data-theme='light']${prefix}--text-tertiary: #5f655b;`)
  .replace(/\/\* nrs-single-source-inner-pages-v\d+:compiled:start \*\/[\s\S]*?\/\* nrs-single-source-inner-pages-v\d+:compiled:end \*\/\s*/g, '')
  .trimEnd();

stylesheet += `\n\n${startMarker}\n${fragments}\n${endMarker}\n`;
fs.writeFileSync(stylesheetPath, stylesheet, 'utf8');
console.log(`Compiled the redesigned visual system into ${path.relative(root, stylesheetPath) || 'style.css'}.`);
