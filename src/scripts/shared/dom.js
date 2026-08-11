/**
 * @fileoverview src/scripts/shared/dom.js
 * Purpose: Provides shared DOM readiness and browser-element helpers used by runtime feature modules.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/repository/apply-deep-organization.cjs
 * - src/scripts/entrypoints/agent-main.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
/**
 * Function contract: onReady
 * Purpose: Handles on ready and coordinates the required state or UI response.
 * Inputs: callback.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function onReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
}

/**
 * Function contract: $
 * Purpose: Implements the $ responsibility for this module.
 * Inputs: selector, scope.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function $(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Function contract: $$
 * Purpose: Implements the $$ responsibility for this module.
 * Inputs: selector, scope.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function $$(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/**
 * Function contract: getStorage
 * Purpose: Retrieves get storage and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state; may read or update browser persistence.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Function contract: prefersReducedMotion
 * Purpose: Implements the prefers reduced motion responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Function contract: isTouchDevice
 * Purpose: Implements the is touch device responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
