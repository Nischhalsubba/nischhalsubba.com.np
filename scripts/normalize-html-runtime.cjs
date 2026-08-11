/**
 * @fileoverview scripts/normalize-html-runtime.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for normalize html runtime.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const root = useDist ? path.join(repositoryRoot, 'dist') : repositoryRoot;
const htmlFiles = [];
const styleHref = '/style.css?v=50.0';
const scriptSrc = '/script.js?v=35.0';

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || (!useDist && entry.name === 'dist')) continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(filePath);
  }
}

/**
 * Function contract: normalizeFontLinks
 * Purpose: Applies normalize font links while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeFontLinks(html) {
  return html
    .replace(/\s*<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]*rel="stylesheet"\s*\/?>\s*/gi, '\n')
    .replace(/\s*<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]*>\s*/gi, '\n');
}

/**
 * Function contract: normalizeStylesheets
 * Purpose: Applies normalize stylesheets while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeStylesheets(html) {
  let output = html.replace(/\s*<link\s+rel="stylesheet"\s+href="\/(?!style\.css)[^"]+\.css[^>]*>\s*/gi, '\n');
  output = output.replace(/\/style\.css\?v=[0-9.]+/g, styleHref);
  if (/<link\s+rel="stylesheet"\s+href="\/style\.css[^>]*>/i.test(output)) {
    return output.replace(/<link\s+rel="stylesheet"\s+href="\/style\.css[^>]*>/i, `<link rel="stylesheet" href="${styleHref}" />`);
  }
  return output.replace(/<\/head>/i, `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
}

/**
 * Function contract: normalizeScriptTags
 * Purpose: Applies normalize script tags while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeScriptTags(html) {
  const localRuntimePattern = /\s*<script\b[^>]*src=["'](?:\/script\.js(?:\?[^"']*)?|\/assets\/(?:script|main|index)[^"']*\.js)["'][^>]*><\/script>\s*/gi;
  let output = html.replace(localRuntimePattern, '\n');
  output = output
    .replace(/\s*<script\b[^>]*src=["']\/(?:blog-index|site-experience|portfolio-improvements)\.js[^"']*["'][^>]*><\/script>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*src=["']\/assets\/vendor\/(?:gsap|ScrollTrigger)\.min\.js["'][^>]*><\/script>\s*/gi, '\n');
  return output.replace(/<\/body>/i, `    <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}

/**
 * Function contract: normalize
 * Purpose: Applies normalize while preserving the surrounding repository/runtime contract.
 * Inputs: content.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalize(content) {
  let output = content
    .replace(/<canvas id="grid-canvas"><\/canvas>/g, '')
    .replace(/<div class="custom-cursor-dot"><\/div>/g, '')
    .replace(/<div class="custom-cursor-outline"><\/div>/g, '')
    .replace(/<nav class="nav-wrapper">/g, '<nav class="nav-wrapper" aria-label="Primary navigation">')
    .replace(/<nav class="mobile-nav-links">/g, '<nav class="mobile-nav-links" aria-label="Mobile navigation">');
  output = normalizeFontLinks(output);
  output = normalizeStylesheets(output);
  output = normalizeScriptTags(output);
  return output;
}

if (!fs.existsSync(root)) throw new Error(`HTML runtime target does not exist: ${root}`);
walk(root);
let touched = 0;
for (const filePath of htmlFiles) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = normalize(before);
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
    touched += 1;
  }
}

console.log(`Normalized ${htmlFiles.length} ${useDist ? 'production' : 'source'} HTML files to style.css v50 and one stable runtime script; updated ${touched}.`);
