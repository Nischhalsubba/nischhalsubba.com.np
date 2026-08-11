/**
 * @fileoverview scripts/ensure-signal-demo-hero-v15.cjs
 * Purpose: Apply the ensure signal demo hero v15 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/ensure-signal-demo-hero-v16.cjs
 * - scripts/preflight-build-scripts.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
// Retired Signal demo installer kept only for historical compatibility.
// The production build uses v16. Keep this file syntactically valid because
// scripts/preflight-build-scripts.cjs checks every .cjs/.js/.mjs file under scripts/.
require('./ensure-signal-demo-hero-v16.cjs');
