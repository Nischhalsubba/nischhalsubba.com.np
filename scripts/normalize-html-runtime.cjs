const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const root = useDist ? path.join(repositoryRoot, 'dist') : repositoryRoot;
const htmlFiles = [];
const styleHref = '/style.css?v=50.0';
const scriptSrc = '/script.js?v=35.0';

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || (!useDist && entry.name === 'dist')) continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(filePath);
  }
}

function normalizeFontLinks(html) {
  return html
    .replace(/\s*<link\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]*rel="stylesheet"\s*\/?>\s*/gi, '\n')
    .replace(/\s*<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis\.com\/css2\?[^>]*>\s*/gi, '\n');
}

function normalizeStylesheets(html) {
  let output = html.replace(/\s*<link\s+rel="stylesheet"\s+href="\/(?!style\.css)[^"]+\.css[^>]*>\s*/gi, '\n');
  output = output.replace(/\/style\.css\?v=[0-9.]+/g, styleHref);
  if (/<link\s+rel="stylesheet"\s+href="\/style\.css[^>]*>/i.test(output)) {
    return output.replace(/<link\s+rel="stylesheet"\s+href="\/style\.css[^>]*>/i, `<link rel="stylesheet" href="${styleHref}" />`);
  }
  return output.replace(/<\/head>/i, `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
}

function normalizeScriptTags(html) {
  const localRuntimePattern = /\s*<script\b[^>]*src=["'](?:\/script\.js(?:\?[^"']*)?|\/assets\/(?:script|main|index)[^"']*\.js)["'][^>]*><\/script>\s*/gi;
  let output = html.replace(localRuntimePattern, '\n');
  output = output
    .replace(/\s*<script\b[^>]*src=["']\/(?:blog-index|site-experience|portfolio-improvements)\.js[^"']*["'][^>]*><\/script>\s*/gi, '\n')
    .replace(/\s*<script\b[^>]*src=["']\/assets\/vendor\/(?:gsap|ScrollTrigger)\.min\.js["'][^>]*><\/script>\s*/gi, '\n');
  return output.replace(/<\/body>/i, `    <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}

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
