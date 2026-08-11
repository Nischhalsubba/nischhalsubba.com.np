/**
 * @fileoverview scripts/ensure-semantic-headings.cjs
 * Purpose: Apply the ensure semantic headings production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const useDist = process.argv.includes('--dist');
const targetRoot = useDist ? path.join(root, 'dist') : root;
const ignored = new Set(['.git', 'node_modules', '.wrangler', 'dist', 'wordpress']);

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure semantic headings repository tool.
 * Inputs: `dir`: input consumed by this operation; `files`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Remove tags without disturbing required surrounding ensure semantic headings repository tool state.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function stripTags(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Function contract: normalizeLayeredHeading
 * Purpose: Apply layered heading consistently while preserving the surrounding ensure semantic headings repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function normalizeLayeredHeading(html) {
  return html.replace(/<(h[1-3])([^>]*)>([\s\S]*?)<\/\1>/gi, /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `full`, `tag`, `attrs`, `inner`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed value consumed by the enclosing operation. */ (full, tag, attrs, inner) => {
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
