/**
 * @fileoverview src/runtime/script.js
 * Purpose: Preserve the stable public browser entry URL while delegating application and interaction behavior to organized runtime entrypoints.
 * Responsibilities:
 * - Keep existing HTML and deployment contracts working through the historical `/script.js` entry path.
 * - Delegate feature loading to the organized browser runtime instead of duplicating behavior here.
 * - Load the isolated interaction-motion entrypoint without absorbing motion-domain logic into this compatibility file.
 * - Keep visual styling outside the runtime entry and under the canonical stylesheet source.
 * Execution context: Canonical compatibility source that is materialized as the root browser entry before development and production builds.
 * Connected files:
 * - src/scripts/entrypoints/main.js
 * - src/scripts/entrypoints/interaction-motion.js
 * - scripts/repository/source-layout.cjs
 * - scripts/repository/materialize-root-sources.cjs
 * - src/styles/style.css
 * Maintenance: Keep this file intentionally small. New browser features belong under `src/scripts/features/` and should be wired through an appropriate entrypoint.
 */
import './src/scripts/entrypoints/main.js';
import './src/scripts/entrypoints/interaction-motion.js';
