const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const serviceDetails = new Set([
  'product-design-nepal.html',
  'web3-ux-designer.html',
  'saas-ux-designer.html',
  'website-ux-design.html',
  'figma-design-systems.html',
  'ux-audit.html',
]);

const navItems = [
  ['home', '/', 'Home'],
  ['work', '/projects', 'Work'],
  ['services', '/services', 'Services'],
  ['about', '/about', 'About'],
  ['writing', '/blog/', 'Writing'],
  ['contact', '/contact', 'Contact'],
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || (targetRoot === root && entry.name === 'dist')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function normalizedRelative(file) {
  return path.relative(targetRoot, file).replaceAll(path.sep, '/').replace(/^public\//, '');
}

function activeSection(relativePath) {
  const base = path.basename(relativePath);
  if (relativePath === 'index.html' || base === 'home.html' || base === 'home-v2.html') return 'home';
  if (base