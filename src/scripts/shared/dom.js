/**
 * @fileoverview src/scripts/shared/dom.js
 * Purpose: Provide small dependency-light DOM query and readiness helpers shared by browser feature domains.
 * Responsibilities:
 * - Expose small dependency-light primitives that can be reused across feature domains.
 * - Avoid page-specific policy, feature state, or styling decisions in shared helpers.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */

/**
 * Function contract: onReady
 * Purpose: Run the supplied initializer after DOM readiness, or immediately when document parsing has already completed.
 * Inputs: `callback`
 * Side effects: registers or removes browser listeners; reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Implement the $ responsibility owned by the dom module.
 * Inputs: `selector`, `scope`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
export function $(selector, scope = document) {
  return scope.querySelector(selector);
}


/**
 * Function contract: $$
 * Purpose: Implement the $$ responsibility owned by the dom module.
 * Inputs: `selector`, `scope`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
export function $$(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}


/**
 * Function contract: getStorage
 * Purpose: Return storage from the supplied inputs or current dom module state.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: The requested storage; explicit early-return branches define empty/fallback behavior.
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
 * Purpose: Implement the prefers reduced motion responsibility owned by the dom module.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


/**
 * Function contract: isTouchDevice
 * Purpose: Determine whether touch device satisfies the condition represented by this dom module.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Boolean indicating whether touch device satisfies the documented condition.
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
