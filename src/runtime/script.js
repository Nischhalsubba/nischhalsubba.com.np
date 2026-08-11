/**
 * @fileoverview src/runtime/script.js
 * Purpose: Preserve the stable browser entry URL while delegating behavior to the organized runtime entrypoint.
 * Responsibilities:
 * - Keep this file focused on its stated responsibility and stable public/build interfaces.
 * - Update connected owners whenever this file changes a shared contract.
 * Execution context: Repository application or build source.
 * Connected files:
 * - scripts/repository/audit-repository-structure.cjs
 * - scripts/repository/generate-file-catalog.cjs
 * - src/scripts/entrypoints/agent-main.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
/*
 * Compatibility entrypoint for existing HTML files.
 * Runtime modules live in src/scripts/ for maintainability.
 * Visual styling is owned by /style.css only.
 */
import './src/scripts/entrypoints/main.js';
