/**
 * @fileoverview scripts/repository/materialize-root-sources.cjs
 * Purpose: Maintain the repository architecture, generated documentation, or structural policy for materialize root sources.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/repository/source-layout.cjs
 * - .gitignore
 * - package.json
 * - scripts/generate-seo-discovery.cjs
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const { materializeRootSources } = require('./source-layout.cjs');

const count = materializeRootSources();
console.log(`[repository] Materialized ${count} compatibility source file(s) at repository root.`);
