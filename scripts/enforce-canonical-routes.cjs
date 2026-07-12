const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));

function removeLegacyOutput() {
  for (const relative of manifest.legacy) {
    const target = path.join(dist, relative);
    if (fs.existsSync(target)) fs.rmSync(target, { force: true });
  }
}

function ensure