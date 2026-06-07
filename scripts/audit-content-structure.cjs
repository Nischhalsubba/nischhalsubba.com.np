const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

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

const discouragedRootFiles = [
  'blog-detail.html',
  'project-detail.html',
  'products.html',
];

function fail(message) {
  console.error(`[content-structure] ${message}`);
  process.exitCode = 1;
}

for (const relativePath of requiredStructure) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) {
    fail(`Missing required structure file: ${relativePath}`);
  }
}

for (const relativePath of discouragedRootFiles) {
  if (fs.existsSync(path.join(rootDir, relativePath))) {
    fail(`Legacy root file should not exist: ${relativePath}`);
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log('[content-structure] Content and documentation structure checks passed.');
