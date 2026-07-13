const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const localPortrait = 'https://nischhalsubba.com.np/assets/images/portrait.png';
const externalPortrait = /https:\/\/i\.imgur\.com\/(?:ixsEpYM|oFHdPUS)\.png/gi;
const supported = new Set(['.html', '.json', '.js']);

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || (target === root && entry.name === 'dist')) continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath, files);
    else if (supported.has(path.extname(entry.name))) files.push(filePath);
  }
  return files;
}

let changed = 0;
for (const filePath of walk(target)) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = before.replace(externalPortrait, localPortrait);
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`[portrait] Replaced external portrait references in ${changed} ${process.argv.includes('--dist') ? 'production' : 'source'} file(s).`);
