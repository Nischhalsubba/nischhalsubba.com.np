/**
 * @fileoverview scripts/audit-content-structure.cjs
 * Purpose: Validate audit content structure and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * - src/compat/legacy-pages/home.html
 * - src/content/posts.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const requiredStructure = [
  'src/content/projects.js',
  'src/content/posts.js',
  'src/content/services.js',
  'src/content/routes.js',
  'src/content/README.md',
  'src/styles/README.md',
  'docs/root-route-map.md',
  'docs/build-pipeline.md',
  'docs/codebase-structure.md',
];

const retiredProductionFiles = [
  'blog-detail.html',
  'project-detail.html',
  'products.html',
  'home.html',
  'home-v2.html',
  'blog.html',
];


/**
 * Function contract: fail
 * Purpose: Implement the fail responsibility owned by the audit content structure repository tool.
 * Inputs: `message`
 * Side effects: emits diagnostics or changes process failure state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function fail(message) {
  console.error(`[content-structure] ${message}`);
  process.exitCode = 1;
}

for (const relativePath of requiredStructure) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    fail(`Missing required structure file: ${relativePath}`);
  }
}

if (!fs.existsSync(distDir)) {
  fail('Production output is missing. Run the build before the structure audit.');
} else {
  for (const relativePath of retiredProductionFiles) {
    if (fs.existsSync(path.join(distDir, relativePath))) {
      fail(`Retired production file should not exist: ${relativePath}`);
    }
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log('[content-structure] Source architecture and production route checks passed.');
