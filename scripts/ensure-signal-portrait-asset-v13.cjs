/**
 * @fileoverview scripts/ensure-signal-portrait-asset-v13.cjs
 * Purpose: Apply the ensure signal portrait asset v13 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/ensure-signal-demo-hero-v16.cjs
 * - AGENTS.md
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
// Legacy build-stage compatibility shim.
// The production hero installs the uploaded Signal over Noise demo through the pure-code v16 installer.
// Keep this filename because scripts/build-dist.cjs still calls the historical v13 stage.
require('./ensure-signal-demo-hero-v16.cjs');
