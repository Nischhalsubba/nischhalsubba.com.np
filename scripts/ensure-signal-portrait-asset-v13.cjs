/**
 * @fileoverview scripts/ensure-signal-portrait-asset-v13.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for ensure signal portrait asset v13.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - AGENTS.md
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
// Legacy build-stage compatibility shim.
// The production hero installs the uploaded Signal over Noise demo through the pure-code v16 installer.
// Keep this filename because scripts/build-dist.cjs still calls the historical v13 stage.
require('./ensure-signal-demo-hero-v16.cjs');
