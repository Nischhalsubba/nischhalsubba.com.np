/**
 * @fileoverview src/scripts/entrypoints/interaction-motion.js
 * Purpose: Initialize the sitewide refined interaction-motion feature after DOM readiness without adding motion-domain logic to the main application entrypoint.
 * Responsibilities:
 * - Wait until authored controls exist before initializing the shared refined button-motion system.
 * - Keep interaction-motion loading isolated from unrelated global application features.
 * - Preserve the stable runtime entry contract while allowing the feature to own its own lifecycle and fallback behavior.
 * Execution context: Browser ES module imported by the stable runtime compatibility entry.
 * Connected files:
 * - src/runtime/script.js
 * - src/scripts/shared/dom.js
 * - src/scripts/features/motion/refined-button-motion.js
 * Maintenance: Keep this entrypoint thin; all interaction logic belongs in the motion feature module.
 */
import { onReady } from '../shared/dom.js';
import { initRefinedButtonMotion } from '../features/motion/refined-button-motion.js';

onReady(initRefinedButtonMotion);
