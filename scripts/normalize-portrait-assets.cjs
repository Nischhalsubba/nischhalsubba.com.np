/**
 * @fileoverview scripts/normalize-portrait-assets.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for normalize portrait assets.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const target = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const localPortrait = 'https://nischhalsubba.com.np/assets/images/portrait.svg';
const portraitReferences = /(?:https:\/\/i\.imgur\.com\/(?:ixsEpYM|oFHdPUS)\.png|https:\/\/nischhalsubba\.com\.np\/assets\/images\/portrait\.png|\/assets\/images\/portrait\.png)/gi;
const supported = new Set(['.html', '.json', '.js', '.txt']);

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory, files.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
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
  const after = before.replace(portraitReferences, /** Callback contract: Processes the callback step for before without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (match) => match.startsWith('/') ? '/assets/images/portrait.svg' : localPortrait);
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`[portrait] Normalized portrait references in ${changed} ${process.argv.includes('--dist') ? 'production' : 'source'} file(s).`);
