/**
 * @fileoverview src/scripts/features/navigation/page-transitions.js
 * Purpose: Implement page transitions behavior inside the navigation browser-runtime domain.
 * Responsibilities:
 * - Own the navigation behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const TRANSITION_MS = 220;

/**
 * Function contract: prefersReducedMotion
 * Purpose: Implement the prefers reduced motion responsibility owned by the page transitions browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Function contract: isModifiedClick
 * Purpose: Determine whether modified click satisfies the condition represented by this page transitions browser feature.
 * Inputs: `event`: browser/DOM event being handled
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean indicating whether modified click satisfies the documented condition.
 */
function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

/**
 * Function contract: shouldTransition
 * Purpose: Determine whether transition satisfies the condition represented by this page transitions browser feature.
 * Inputs: `link`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Boolean indicating whether transition satisfies the documented condition.
 */
function shouldTransition(link) {
  if (!link) return false;
  if (link.target && link.target !== '_self') return false;
  if (link.hasAttribute('download')) return false;
  if (link.dataset.noTransition === 'true') return false;

  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  const samePath = url.pathname === window.location.pathname;
  const sameSearch = url.search === window.location.search;
  if (samePath && sameSearch && url.hash) return false;

  return true;
}

/**
 * Function contract: initPageTransitions
 * Purpose: Initialize page transitions for the page transitions browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initPageTransitions() {
  if (prefersReducedMotion()) return;

  document.body.classList.add('nrs-page-enter');
  window.setTimeout(/** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ () => document.body.classList.remove('nrs-page-enter'), 520);

  window.addEventListener('pageshow', /** Callback contract: Handle the pageshow event for `window` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
    document.body.classList.remove('nrs-page-leave');
    document.body.classList.add('nrs-page-enter');
    window.setTimeout(/** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ () => document.body.classList.remove('nrs-page-enter'), 520);
  });

  document.addEventListener('click', /** Callback contract: Handle the click event for `document` and apply the related local state update. Inputs: `event`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (event) => {
    if (isModifiedClick(event)) return;

    const link = event.target.closest?.('a[href]');
    if (!shouldTransition(link)) return;

    event.preventDefault();
    document.body.classList.remove('nrs-page-enter');
    document.body.classList.add('nrs-page-leave');

    window.setTimeout(/** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
      window.location.href = link.href;
    }, TRANSITION_MS);
  });
}
