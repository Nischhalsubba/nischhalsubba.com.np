/**
 * @fileoverview scripts/enforce-single-floating-resume.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for enforce single floating resume.
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
const floatingResume = '<a class="floating-resume-btn" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download aria-label="Download Resume"><span class="btn-text">Download Resume</span></a>';
const anchorPattern = /\s*<a\b(?=[^>]*\bclass=["'][^"']*\bfloating-resume-btn\b[^"']*["'])[^>]*>[\s\S]*?<\/a>/gi;

/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: directory, output.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
for (const file of walk(target).filter(/** Callback contract: Processes the callback step for walk(target) without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (item) => item.endsWith('.html'))) {
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
