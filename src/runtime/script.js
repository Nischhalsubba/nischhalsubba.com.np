/**
 * @fileoverview src/runtime/script.js
 * Purpose: Stable compatibility entrypoint that connects historical page references to the organized browser runtime.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Repository build or application source.
 * Connected files:
 * - .gitignore
 * - README.md
 * - blog/ai-assisted-product-design-workflows-small-teams.html
 * - blog/beautiful-interface-poor-ux.html
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
/*
 * Compatibility entrypoint for existing HTML files.
 * Runtime modules live in src/scripts/ for maintainability.
 * Visual styling is owned by /style.css only.
 */
import './src/scripts/entrypoints/main.js';
