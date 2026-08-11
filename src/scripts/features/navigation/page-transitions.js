/**
 * @fileoverview src/scripts/features/navigation/page-transitions.js
 * Purpose: Browser runtime feature in the navigation domain responsible for page transitions behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/runtime/script.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const TRANSITION_MS = 220;

/**
 * Function contract: prefersReducedMotion
 * Purpose: Implements the prefers reduced motion responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Function contract: isModifiedClick
 * Purpose: Implements the is modified click responsibility for this module.
 * Inputs: event.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

/**
 * Function contract: shouldTransition
 * Purpose: Implements the should transition responsibility for this module.
 * Inputs: link.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the init page transitions responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function initPageTransitions() {
  if (prefersReducedMotion()) return;

  document.body.classList.add('nrs-page-enter');
  window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => document.body.classList.remove('nrs-page-enter'), 520);

  window.addEventListener('pageshow', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
    document.body.classList.remove('nrs-page-leave');
    document.body.classList.add('nrs-page-enter');
    window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => document.body.classList.remove('nrs-page-enter'), 520);
  });

  document.addEventListener('click', /** Callback contract: Processes the callback step for document without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (event) => {
    if (isModifiedClick(event)) return;

    const link = event.target.closest?.('a[href]');
    if (!shouldTransition(link)) return;

    event.preventDefault();
    document.body.classList.remove('nrs-page-enter');
    document.body.classList.add('nrs-page-leave');

    window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
      window.location.href = link.href;
    }, TRANSITION_MS);
  });
}
