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

walk(targetRoot);

const issues = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = relative(file);

  if (!html.includes('/style.css')) {
    issues.push(`${rel}: missing /style.css`);
  }

  if (!html.includes('/site-design-system.css')) {
    issues.push(`${rel}: missing /site-design-system.css`);
  }

  if (!html.includes('/script.js')) {
    issues.push(`${rel}: missing /script.js runtime`);
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
  console.log(`OK: ${htmlFiles.length} HTML files include the shared design system and runtime.`);
}
