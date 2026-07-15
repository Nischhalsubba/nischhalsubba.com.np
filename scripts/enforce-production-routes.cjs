const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const errors = [];

for (const file of manifest.legacy) {
  const target = path.join(dist, file);
  if (fs.existsSync(target)) fs.rmSync(target, { force: true });
}

for (const file of manifest.html) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing canonical source: ${file}`);
  if (!fs.existsSync(path.join(dist, file))) errors.push(`Missing production route: ${file}`);
}

for (const file of manifest.legacy) {
  if (fs.existsSync(path.join(dist, file))) errors.push(`Legacy route survived build: ${file}`);
}

for (const name of ['audit-remediations.css', 'stable-layout.css', 'final-ui-fixes.css', 'layout-integrity.css']) {
  if (fs.existsSync(path.join(dist, name))) errors.push(`Retired stylesheet survived build: ${name}`);
}

function parseRedirects(file) {
  if (!fs.existsSync(file)) return new Map();
  const entries = new Map();
  for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to] = line.split(/\s+/);
    if (from && to) entries.set(from, to);
  }
  return entries;
}

for (const redirectFile of [path.join(root, '_redirects'), path.join(root, 'public', '_redirects')]) {
  const redirects = parseRedirects(redirectFile);
  for (const [from, to] of Object.entries(manifest.redirects)) {
    if (redirects.get(from) !== to) {
      errors.push(`${path.relative(root, redirectFile)}: ${from} must redirect to ${to}`);
    }
  }
}

if (errors.length) {
  console.error('Production route audit failed:\n- ' + errors.join('\n- '));
  process.exit(1);
}

console.log(`Production route audit passed for ${manifest.html.length} canonical routes and ${Object.keys(manifest.redirects).length} legacy redirects.`);
