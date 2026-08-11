/**
 * @fileoverview scripts/ensure-semantic-headings.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure semantic headings.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const targetRoot = useDist ? path.join(root, 'dist') : root;
const ignored = new Set(['.git', 'node_modules', '.wrangler', 'dist', 'wordpress']);

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: dir, files.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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

/**
 * Function contract: stripTags
 * Purpose: Implements the strip tags responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function stripTags(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Function contract: normalizeLayeredHeading
 * Purpose: Applies normalize layered heading while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeLayeredHeading(html) {
  return html.replace(/<(h[1-3])([^>]*)>([\s\S]*?)<\/\1>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: full, tag, attrs, inner. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (full, tag, attrs, inner) => {
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
