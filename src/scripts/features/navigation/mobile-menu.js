/**
 * @fileoverview src/scripts/features/navigation/mobile-menu.js
 * Purpose: Browser runtime feature in the navigation domain responsible for mobile menu behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/agent-main.js
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { $, $$ } from '../../shared/dom.js';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Function contract: getFocusableElements
 * Purpose: Retrieves get focusable elements and returns it in the form expected by its caller.
 * Inputs: overlay.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getFocusableElements(overlay) {
  if (!overlay || overlay.hidden) return [];
  return [...overlay.querySelectorAll(FOCUSABLE_SELECTOR)].filter(/** Callback contract: Processes the callback step for [...overlay.query selector all(focusable selector)] without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return !element.hasAttribute('hidden')
      && element.getAttribute('aria-hidden') !== 'true'
      && style.display !== 'none'
      && style.visibility !== 'hidden'
      && rect.width > 0
      && rect.height > 0;
  });
}

/**
 * Function contract: setBackgroundInert
 * Purpose: Applies set background inert while preserving the surrounding repository/runtime contract.
 * Inputs: button, overlay, open.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function setBackgroundInert(button, overlay, open) {
  [...document.body.children].forEach(/** Callback contract: Processes the callback step for [...document.body.children] without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (element) => {
    if (element === overlay || element === button || element.classList.contains('skip-link')) return;

    if (open) {
      if (element.inert) element.dataset.wasInert = 'true';
      element.inert = true;
    } else {
      element.inert = element.dataset.wasInert === 'true';
      delete element.dataset.wasInert;
    }
  });
}

/**
 * Function contract: syncOpenState
 * Purpose: Implements the sync open state responsibility for this module.
 * Inputs: button, overlay, open.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function syncOpenState(button, overlay, open) {
  document.body.classList.toggle('menu-open', open);
  document.documentElement.classList.toggle('menu-open', open);
  button.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close site navigation' : 'Open site navigation');

  overlay.classList.toggle('is-open', open);
  overlay.dataset.open = String(open);
  overlay.setAttribute('aria-hidden', String(!open));
}

/**
 * Function contract: setMenuState
 * Purpose: Applies set menu state while preserving the surrounding repository/runtime contract.
 * Inputs: button, overlay, open, { restoreFocus = true }.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function setMenuState(button, overlay, open, { restoreFocus = true } = {}) {
  if (!overlay) return;

  if (open) overlay.hidden = false;
  syncOpenState(button, overlay, open);
  setBackgroundInert(button, overlay, open);

  if (open) {
    window.requestAnimationFrame(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
      overlay.scrollTop = 0;
      overlay.focus({ preventScroll: true });
      window.requestAnimationFrame(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
        const firstFocusable = getFocusableElements(overlay)[0];
        if (firstFocusable) firstFocusable.focus({ preventScroll: true });
      });
    });
    return;
  }

  window.requestAnimationFrame(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
    overlay.scrollTop = 0;
    overlay.hidden = true;
    if (restoreFocus && button.getClientRects().length) button.focus({ preventScroll: true });
  });
}

/**
 * Function contract: trapFocus
 * Purpose: Implements the trap focus responsibility for this module.
 * Inputs: event, overlay.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function trapFocus(event, overlay) {
  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements(overlay);
  if (!focusable.length) {
    event.preventDefault();
    overlay.focus({ preventScroll: true });
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && (document.activeElement === first || document.activeElement === overlay)) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}

/**
 * Function contract: initMobileMenu
 * Purpose: Implements the init mobile menu responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function initMobileMenu() {
  const button = $('.mobile-nav-toggle');
  const overlay = $('.mobile-nav-overlay');
  if (!button || !overlay || button.dataset.mobileMenuReady === 'true') return;

  if (!overlay.id) overlay.id = 'mobile-nav-overlay';

  button.dataset.mobileMenuReady = 'true';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-controls', overlay.id);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open site navigation');

  overlay.hidden = true;
  overlay.dataset.open = 'false';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Site navigation');
  overlay.setAttribute('tabindex', '-1');

  button.addEventListener('click', /** Callback contract: Processes the callback step for button without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state. No explicit return contract. */ (event) => {
    event.preventDefault();
    event.stopPropagation();
    const open = !document.body.classList.contains('menu-open');
    setMenuState(button, overlay, open);
  });

  $$('.mobile-nav-links a').forEach(/** Callback contract: Processes the callback step for $$('.mobile nav links a') without leaking orchestration details to the caller. Inputs: link. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (link) => {
    link.addEventListener('click', /** Callback contract: Processes the callback step for link without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
      setMenuState(button, overlay, false, { restoreFocus: false });
    });
  });

  overlay.addEventListener('click', /** Callback contract: Processes the callback step for overlay without leaking orchestration details to the caller. Inputs: event. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (event) => {
    if (event.target === overlay) setMenuState(button, overlay, false);
  });

  window.addEventListener('keydown', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (event) => {
    if (!document.body.classList.contains('menu-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuState(button, overlay, false);
      return;
    }

    trapFocus(event, overlay);
  });

  /**
   * Function contract: closeWhenDesktopShellReturns
   * Purpose: Implements the close when desktop shell returns responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  const closeWhenDesktopShellReturns = () => {
    if (!document.body.classList.contains('menu-open')) return;

    const style = window.getComputedStyle(button);
    const mobileControlVisible = style.display !== 'none'
      && style.visibility !== 'hidden'
      && button.getClientRects().length > 0;

    if (!mobileControlVisible) {
      setMenuState(button, overlay, false, { restoreFocus: false });
    }
  };

  window.addEventListener('resize', closeWhenDesktopShellReturns, { passive: true });
  window.addEventListener('orientationchange', closeWhenDesktopShellReturns, { passive: true });
  window.visualViewport?.addEventListener('resize', closeWhenDesktopShellReturns, { passive: true });
}
