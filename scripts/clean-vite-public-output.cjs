const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));

const remove = [
  ...manifest.legacy,
  'audit-remediations.css',
  'stable-layout.css',
  'detail-navigation.js',
  'seo-enhancements.js',
];

for (const relative of remove) {
  const target = path.join(dist, relative);
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

console.log('Removed retired public pages and patch assets from dist.');
