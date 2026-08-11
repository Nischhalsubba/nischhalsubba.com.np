/**
 * @fileoverview scripts/enforce-single-floating-resume.cjs
 * Purpose: Apply the enforce single floating resume production transformation or maintenance step while preserving canonical source/build contracts.
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
const floatingResume = '<a class="floating-resume-btn" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download aria-label="Download Resume"><span class="btn-text">Download Resume</span></a>';
const anchorPattern = /\s*<a\b(?=[^>]*\bclass=["'][^"']*\bfloating-resume-btn\b[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi;


/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the enforce single floating resume repository tool.
 * Inputs: `directory`, `output`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function walk(directory, output = []) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || (target === root && entry.name === 'dist')) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file, output);
    else output.push(file);
  }
  return output;
}

let changed = 0;
const errors = [];
for (const file of walk(target).filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (item) => item.endsWith('.html'))) {
  const original = fs.readFileSync(file, 'utf8');
  const matches = original.match(anchorPattern) || [];
  let updated = original.replace(anchorPattern, '');
  if (!updated.includes('</body>')) {
    errors.push(`${path.relative(target, file)} has no closing body tag.`);
    continue;
  }
  updated = updated.replace(/<\/body>/i, `  ${floatingResume}\n</body>`);
  const remaining = updated.match(anchorPattern) || [];
  if (remaining.length !== 1) errors.push(`${path.relative(target, file)} contains ${remaining.length} floating resume controls after normalization.`);
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    changed += 1;
  }
}

if (errors.length) {
  console.error(`Floating resume contract failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Enforced one floating resume control on ${changed} HTML file(s).`);
