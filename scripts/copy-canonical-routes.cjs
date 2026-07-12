const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));

if (!fs.existsSync(dist)) throw new Error('dist directory is missing. Run Vite first.');

for (const relative of manifest.html) {
  const source = path.join(root, relative);
  const target = path.join(dist, relative);
  if (!fs.existsSync(source)) throw new Error(`Canonical route source is missing: ${relative}`);
  fs.mkdirSync