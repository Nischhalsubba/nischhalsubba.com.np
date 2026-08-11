/**
 * @fileoverview scripts/ensure-spacious-core-pages.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure spacious core pages.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/generate-source.cjs
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
require('./spacious-pages/about.cjs');
require('./spacious-pages/services.cjs');
require('./spacious-pages/contact.cjs');
require('./spacious-pages/home-work.cjs');
console.log('Applied spacious layouts to About, Services, Contact, Work and homepage proof.');
