const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const origin = 'https://nischhalsubba.com.np';

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || (target === root && entry.name === 'dist')) continue;
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(filePath, files);
    else if (entry.name.endsWith('.html')) files.push(filePath);
  }
  return files;
}

function cleanCanonical(url) {
  if (!url.startsWith(origin)) return url;
  const parsed = new URL(url);
  if (parsed.pathname.endsWith('.html')) parsed.pathname = parsed.pathname.slice(0, -5) || '/';
  return parsed.toString().replace(/\/$/, parsed.pathname === '/' ? '/' : '');
}

let changed = 0;
for (const filePath of walk(target)) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = before.replace(
    /(<link\s+[^>]*rel=["']canonical["'][^>]*href=["'])([^"']+)(["'][^>]*>)/i,
    (_, start, href, end) => `${start}${cleanCanonical(href)}${end}`,
  );
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`[canonical] Normalized ${changed} canonical URL(s) in ${process.argv.includes('--dist') ? 'dist' : 'source'}.`);
