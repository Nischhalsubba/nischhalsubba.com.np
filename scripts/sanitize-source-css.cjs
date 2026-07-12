const fs = require('node:fs');
const path = require('node:path');

const stylePath = path.join(process.cwd(), 'style.css');
const malformedFontFragment = /^\s*\d+(?:;\d+)+&display=swap'\);\s*\r?\n?/m;

if (!fs.existsSync(stylePath)) {
  console.error('[css] style.css was not found.');
  process.exit(1);
}

const source = fs.readFileSync(stylePath, 'utf8');
const cleaned = source.replace(malformedFontFragment, '');

if (cleaned !== source) {
  fs.writeFileSync(stylePath, cleaned, 'utf8');
  console.log('[css] Removed malformed font import fragment from style.css.');
} else {
  console.log('[css] Source stylesheet is already clean.');
}

if (malformedFontFragment.test(cleaned)) {
  console.error('[css] Malformed font import fragment is still present.');
  process.exit(1);
}
