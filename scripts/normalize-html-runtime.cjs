const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlFiles = [];
const styleHref = '/style.css?v=36.0';
const scriptSrc = '/script.js?v=32.0';

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}

function normalizeStylesheets(html) {
  let output = html.replace(/\s*<link\s+rel="stylesheet"\s+href="\/(?!style\.css)[^"]+\.css[^>]*>\s*/gi, '\n');
  output = output.replace(/\/style\.css\?v=[0-9.]+/g, styleHref);

  if (/<link\s+rel="stylesheet"\s+href="\/style\.css[^>]*>/i.test(output)) {
    return output.replace(/<link\s+rel="stylesheet"\s+href="\/style\.css[^>]*>/i, `<link rel="stylesheet" href="${styleHref}" />`);
  }

  return output.replace(/<\/head>/i, `    <link rel="stylesheet" href="${styleHref}" />\n  </head>`);
}

function removeExtraLocalScripts(html) {
  return html
    .replace(/\s*<script src="\/blog-index\.js[^>]*><\/script>/g, '')
    .replace(/\s*<script src="\/site-experience\.js[^>]*><\/script>/g, '')
    .replace(/\s*<script src="\/portfolio-improvements\.js[^>]*><\/script>/g, '')
    .replace(/\s*<script src="\/assets\/vendor\/gsap\.min\.js" defer><\/script>/g, '')
    .replace(/\s*<script src="\/assets\/vendor\/ScrollTrigger\.min\.js" defer><\/script>/g, '');
}

function normalizeScriptTags(html) {
  let output = removeExtraLocalScripts(html).replace(/\/script\.js\?v=[0-9.]+/g, scriptSrc);

  const scriptPattern = /<script\s+type="module"\s+src="\/script\.js\?v=32\.0"><\/script>/i;
  if (scriptPattern.test(output)) return output;

  if (/<script[^>]+src="\/script\.js[^>]*><\/script>/i.test(output)) {
    return output.replace(/<script[^>]+src="\/script\.js[^>]*><\/script>/i, `<script type="module" src="${scriptSrc}"></script>`);
  }

  return output.replace(/<\/body>/i, `    <script type="module" src="${scriptSrc}"></script>\n  </body>`);
}

function normalize(content) {
  let output = content
    .replace(/<canvas id="grid-canvas"><\/canvas>/g, '')
    .replace(/<div class="custom-cursor-dot"><\/div>/g, '')
    .replace(/<div class="custom-cursor-outline"><\/div>/g, '')
    .replace(/#nrs-scroll-progress\{position:fixed;top:0;left:0;width:100%;height:4px;z-index:2147483647;pointer-events:none;background:transparent!important;opacity:1!important;transform:none!important;\}/g,
      '#nrs-scroll-progress{position:fixed!important;top:0!important;left:0!important;width:100%!important;height:6px!important;z-index:2147483647!important;pointer-events:none!important;background:var(--nrs-progress-track,rgba(255,255,255,.16))!important;opacity:1!important;transform:none!important;overflow:hidden!important;}')
    .replace(/--nrs-progress:#eeeeee;color-scheme:dark;/g, '--nrs-progress:#E0E0E0;--nrs-progress-track:rgba(255,255,255,.16);color-scheme:dark;')
    .replace(/--nrs-progress:#171717;color-scheme:light;/g, '--nrs-progress:#444444;--nrs-progress-track:rgba(68,68,68,.16);color-scheme:light;')
    .replace(/var\(--nrs-scroll-progress-scale,0\.015\)/g, 'var(--nrs-scroll-progress-scale,0.02)')
    .replace(/Math\.max\(0\.015,/g, 'Math.max(0.02,')
    .replace(/<nav class="nav-wrapper">/g, '<nav class="nav-wrapper" aria-label="Primary navigation">')
    .replace(/<nav class="mobile-nav-links">/g, '<nav class="mobile-nav-links" aria-label="Mobile navigation">');

  output = normalizeStylesheets(output);
  output = normalizeScriptTags(output);
  return output;
}

walk(root);

let touched = 0;
for (const file of htmlFiles) {
  const before = fs.readFileSync(file, 'utf8');
  const after = normalize(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    touched += 1;
  }
}

console.log(`Normalized ${htmlFiles.length} HTML files to one stylesheet and one website runtime script; updated ${touched}.`);
