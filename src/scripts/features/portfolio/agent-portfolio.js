/**
 * @fileoverview Temporary compatibility entry for a legacy production-build guard.
 * Purpose: Keep the historical runtime path resolvable while the remaining redesign fragment is migrated to `portfolio-runtime.js`.
 * Responsibilities:
 * - Forward module loading to the canonical portfolio runtime without duplicating behavior.
 * - Prevent older build checks from failing during the repository cleanup.
 * Execution context: Browser/source compatibility module; not the canonical runtime owner.
 * Connected files:
 * - scripts/portfolio-redesign-part-1.cjsfrag
 * - src/scripts/features/portfolio/portfolio-runtime.js
 * Maintenance: Delete this file as soon as the remaining redesign fragment points directly to `portfolio-runtime.js`.
 */
import './portfolio-runtime.js';
