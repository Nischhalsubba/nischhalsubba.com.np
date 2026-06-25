const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetRoot = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const htmlFiles = [];
const ignoredDirs = new Set(['.git', 'node_modules', '.wrangler']);

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}

function relative(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/');
}

function hasAnyStylesheet(html) {
  return /<link\s+[^>]*rel=["']stylesheet["'][^>]*>/i.test(html);
}

function hasRuntimeScript(html) {
  // Source HTML points to /script.js. Vite production builds rewrite it to a
  // fingerprinted /assets/*.js file, so accept either form here.
  return html.includes('/script.js') || /<script\s+[^>]*src=["']\/assets\/[^"]+\.js["'][^>]*><\/script>/i.test(html);
}

walk(targetRoot);

const issues = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = relative(file);

  if (!hasAnyStylesheet(html)) {
    issues.push(`${rel}: missing stylesheet link`);
  }

  if (!html.includes('/site-design-system.css')) {
    issues.push(`${rel}: missing /site-design-system.css`);
  }

  if (!hasRuntimeScript(html)) {
    issues.push(`${rel}: missing runtime script`);
  }

  if (/<nav class="nav-wrapper"(?![^>]*aria-label=)/.test(html)) {
    issues.push(`${rel}: desktop nav missing aria-label`);
  }

  if (/<nav class="mobile-nav-links"(?![^>]*aria-label=)/.test(html)) {
    issues.push(`${rel}: mobile nav missing aria-label`);
  }
}

if (issues.length > 0) {
  console.error('Design-system coverage audit failed:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${htmlFiles.length} HTML files include shared design-system CSS and runtime coverage.`);
}
