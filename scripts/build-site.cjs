/**
 * @fileoverview scripts/build-site.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for build site.
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
const { spawnSync } = require('node:child_process');

for (const script of ['scripts/generate-source.cjs', 'scripts/build-dist.cjs']) {
  const result = spawnSync('node', [script], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.error) {
    console.error(`[build] Could not start ${script}:`, result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log('\n[build] Source generation and production build completed successfully.');
