/**
 * @fileoverview scripts/audit-content-structure.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for audit content structure.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Implements the fail responsibility for this module.
 * Inputs: message.
 * Side effects: may emit diagnostics or inspect process state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
