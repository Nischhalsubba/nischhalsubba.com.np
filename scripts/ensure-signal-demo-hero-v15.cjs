/**
 * @fileoverview scripts/ensure-signal-demo-hero-v15.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure signal demo hero v15.
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
// Retired Signal demo installer kept only for historical compatibility.
// The production build uses v16. Keep this file syntactically valid because
// scripts/preflight-build-scripts.cjs checks every .cjs/.js/.mjs file under scripts/.
require('./ensure-signal-demo-hero-v16.cjs');
