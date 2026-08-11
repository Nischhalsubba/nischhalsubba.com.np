/**
 * @fileoverview scripts/normalize-portrait-assets.cjs
 * Purpose: Apply the normalize portrait assets production transformation or maintenance step while preserving canonical source/build contracts.
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
const localPortrait = 'https://nischhalsubba.com.np/assets/images/portrait.svg';
const portraitReferences = /(?:https:\/\/i\.imgur\.com\/(?:ixsEpYM|oFHdPUS)\.png|https:\/\/nischhalsubba\.com\.np\/assets\/images\/portrait\.png|\/assets\/images\/portrait\.png)/gi;
const supported = new Set(['.html', '.json', '.js', '.txt']);


/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the normalize portrait assets repository tool.
 * Inputs: `directory`, `files`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
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
  const after = before.replace(portraitReferences,  /** Callback contract: Perform the local callback step required by the immediately enclosing normalize portrait assets repository tool operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => match.startsWith('/') ? '/assets/images/portrait.svg' : localPortrait);
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed += 1;
  }
}

console.log(`[portrait] Normalized portrait references in ${changed} ${process.argv.includes('--dist') ? 'production' : 'source'} file(s).`);
