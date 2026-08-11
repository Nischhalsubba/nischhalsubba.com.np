/**
 * @fileoverview scripts/repository/clean-root-sources.cjs
 * Purpose: Repository architecture and maintenance utility for clean root sources.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/repository/README.md
 * - scripts/repository/source-layout.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const { cleanRootSources } = require('./source-layout.cjs');

const count = cleanRootSources();
console.log(`[repository] Removed ${count} materialized compatibility source file(s) from repository root.`);
