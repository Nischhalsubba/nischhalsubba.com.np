/**
 * @fileoverview scripts/repository/materialize-root-sources.cjs
 * Purpose: Repository architecture and maintenance utility for materialize root sources.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - .gitignore
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const { materializeRootSources } = require('./source-layout.cjs');

const count = materializeRootSources();
console.log(`[repository] Materialized ${count} compatibility source file(s) at repository root.`);
