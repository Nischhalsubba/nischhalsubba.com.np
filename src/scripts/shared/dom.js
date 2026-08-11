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
 * Purpose: Run the supplied initializer after the DOM is ready, or immediately when document parsing has already completed.
 * Inputs: `callback`: input consumed by this operation
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
 * Inputs: `selector`: input consumed by this operation; `scope`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
export function $(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Function contract: $$
 * Purpose: Implement the $$ responsibility owned by the dom module.
 * Inputs: `selector`: input consumed by this operation; `scope`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
export function $$(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/**
 * Function contract: getStorage
 * Purpose: Return storage from the supplied inputs or current dom module state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state; reads or updates browser persistence.
 * Returns: The requested storage; early-return/empty-state behavior follows the explicit branches in this function.
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
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Function contract: isTouchDevice
 * Purpose: Determine whether touch device satisfies the condition represented by this dom module.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Boolean indicating whether touch device satisfies the documented condition.
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
