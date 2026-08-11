/**
 * @fileoverview scripts/ensure-spacious-core-pages.cjs
 * Purpose: Apply the ensure spacious core pages production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/spacious-pages/about.cjs
 * - scripts/spacious-pages/services.cjs
 * - scripts/spacious-pages/contact.cjs
 * - scripts/spacious-pages/home-work.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
require('./spacious-pages/about.cjs');
require('./spacious-pages/services.cjs');
require('./spacious-pages/contact.cjs');
require('./spacious-pages/home-work.cjs');
console.log('Applied spacious layouts to About, Services, Contact, Work and homepage proof.');
