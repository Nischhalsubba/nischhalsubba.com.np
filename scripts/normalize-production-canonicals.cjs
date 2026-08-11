/**
 * @fileoverview scripts/normalize-production-canonicals.cjs
 * Purpose: Apply the normalize production canonicals production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const origin = 'https://nischhalsubba.com.np';

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the normalize production canonicals repository tool.
 * Inputs: `directory`: input consumed by this operation; `files`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
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

/**
 * Function contract: cleanCanonical
 * Purpose: Remove canonical without disturbing required surrounding normalize production canonicals repository tool state.
 * Inputs: `url`: URL being inspected, normalized, or requested
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function cleanCanonical(url) {
  if (!url.startsWith(origin)) return url;
  const parsed = new URL(url);
  if (parsed.pathname.endsWith('.html')) parsed.pathname = parsed.pathname.slice(0, -5) || '/';
  return `${parsed.origin}${parsed.pathname}${parsed.search}${parsed.hash}`;
}

let changed = 0;
for (const filePath of walk(target)) {
  const before = fs.readFileSync(filePath, 'utf8');
  const after = before.replace(
    /(<link\s+[^>]*rel=["']canonical["'][^>]*href=["'])([^"']+)(["'][^>]*>)/i,
    /** Callback contract: Processes the callback step for before without leaking orchestration details to the caller. Inputs: _, start, href, end. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing normalize production canonicals repository tool operation. Inputs: `_`, `start`, `href`, `end`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `_`, `start`, `href`, `end`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (_, start, href, end) => `${start}${cleanCanonical(href)}${end}`,
  );
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`[canonical] Normalized ${changed} canonical URL(s) in ${process.argv.includes('--dist') ? 'dist' : 'source'}.`);
