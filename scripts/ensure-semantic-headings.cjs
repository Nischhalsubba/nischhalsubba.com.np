const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const targetRoot = useDist ? path.join(root, 'dist') : root;
const ignored = new Set(['.git', 'node_modules', '.wrangler', 'dist', 'wordpress']);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!useDist && ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeLayeredHeading(html) {
  return html.replace(/<(h[1-3])([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    const spans = Array.from(inner.matchAll(/<span\b([^>]*)class=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/span>/gi));
    if (spans.length !== 2) return full;

    const firstClasses = spans[0][2].split(/\s+/);
    const secondClasses = spans[1][2].split(/\s+/);
    const layeredPair =
      (firstClasses.includes('text-outline') && secondClasses.includes('text-fill')) ||
      (firstClasses.includes('text-fill') && secondClasses.includes('text-outline'));
    if (!layeredPair) return full;

    const firstText = stripTags(spans[0][4]);
    const secondText = stripTags(spans[1][4]);
    if (!firstText || firstText !== secondText) return full;

    return `<${tag}${attrs}>${spans[0][4].trim()}</${tag}>`;
  });
}

let changed = 0;
for (const file of walk(targetRoot)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = normalizeLayeredHeading(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
  }
}

console.log(`[semantic-headings] Normalized duplicate layered headings in ${changed} HTML file(s).`);
