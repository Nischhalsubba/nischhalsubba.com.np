/**
 * @fileoverview scripts/normalize-html-runtime.cjs
 * Purpose: Apply the normalize html runtime production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Implement the walk responsibility owned by the normalize html runtime repository tool.
 * Inputs: `directory`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
 * Purpose: Apply font links consistently while preserving the surrounding normalize html runtime repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function normalizeFontLinks(html) {
  return html
    .replace(/\s*<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]*rel="stylesheet"\s*\/?>\s*/gi, '\n')
    .replace(/\s*<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]*>\s*/gi, '\n');
}

/**
 * Function contract: normalizeStylesheets
 * Purpose: Apply stylesheets consistently while preserving the surrounding normalize html runtime repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
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
 * Purpose: Apply script tags consistently while preserving the surrounding normalize html runtime repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
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
 * Purpose: Apply module behavior consistently while preserving the surrounding normalize html runtime repository tool contract.
 * Inputs: `content`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
