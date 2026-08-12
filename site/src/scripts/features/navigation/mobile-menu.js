/**
 * @fileoverview src/scripts/features/navigation/mobile-menu.js
 * Purpose: Implement mobile menu behavior inside the navigation browser-runtime domain.
 * Responsibilities:
 * - Own the navigation behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Collect descendants of the supplied overlay that are rendered, visible, and eligible for keyboard focus.
 * Inputs: `overlay`
 * Side effects: reads or updates DOM/browser state
 * Returns: The requested focusable elements; explicit early-return branches define empty/fallback behavior.
 */
function getFocusableElements(overlay) {
  if (!overlay || overlay.hidden) return [];
  return [...overlay.querySelectorAll(FOCUSABLE_SELECTOR)].filter( /** Callback contract: Keep only elements that are rendered, visible, and eligible for the enclosing focus/layout operation. Inputs: `element` Side effects: reads or updates DOM/browser state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (element) => {
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
 * Purpose: Apply or restore inert state on background page elements while the mobile navigation overlay is open, preserving any pre-existing inert state.
 * Inputs: `button`, `overlay`, `open`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function setBackgroundInert(button, overlay, open) {
  [...document.body.children].forEach( /** Callback contract: Apply or restore inert state for the current background element while preserving its previous value. Inputs: `element` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (element) => {
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
 * Purpose: Synchronize menu classes, data attributes, labels, and ARIA state with the requested open/closed value.
 * Inputs: `button`, `overlay`, `open`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Open or close the mobile navigation, coordinate inert background behavior, and move focus only after the related visibility/layout state is ready.
 * Inputs: `button`, `overlay`, `open`, `{ restoreFocus = true }`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function setMenuState(button, overlay, open, { restoreFocus = true } = {}) {
  if (!overlay) return;

  if (open) overlay.hidden = false;
  syncOpenState(button, overlay, open);
  setBackgroundInert(button, overlay, open);

  if (open) {
    window.requestAnimationFrame( /** Callback contract: Wait one animation frame for visibility/layout changes before moving keyboard focus. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
      overlay.scrollTop = 0;
      overlay.focus({ preventScroll: true });
      window.requestAnimationFrame( /** Callback contract: Wait one animation frame for visibility/layout changes before moving keyboard focus. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
        const firstFocusable = getFocusableElements(overlay)[0];
        if (firstFocusable) firstFocusable.focus({ preventScroll: true });
      });
    });
    return;
  }

  window.requestAnimationFrame( /** Callback contract: Wait one animation frame for visibility/layout changes before moving keyboard focus. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
    overlay.scrollTop = 0;
    overlay.hidden = true;
    if (restoreFocus && button.getClientRects().length) button.focus({ preventScroll: true });
  });
}


/**
 * Function contract: trapFocus
 * Purpose: Keep Tab and Shift+Tab focus inside the open mobile navigation overlay, including the no-focusable-elements fallback.
 * Inputs: `event`, `overlay`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Initialize mobile navigation exactly once, establish its accessibility state, and attach the click, keyboard, resize, and navigation listeners that control it.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: registers or removes browser listeners; reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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

  button.addEventListener('click',  /** Callback contract: Handle the click by preventing conflicting default behavior and toggling the mobile-menu state. Inputs: `event` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (event) => {
    event.preventDefault();
    event.stopPropagation();
    const open = !document.body.classList.contains('menu-open');
    setMenuState(button, overlay, open);
  });

  $$('.mobile-nav-links a').forEach( /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `link` Side effects: registers or removes browser listeners Returns: Undefined; this callback is side-effect-only. */ (link) => {
    link.addEventListener('click',  /** Callback contract: Handle the click by preventing conflicting default behavior and toggling the mobile-menu state. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ () => {
      setMenuState(button, overlay, false, { restoreFocus: false });
    });
  });

  overlay.addEventListener('click',  /** Callback contract: Handle the click by preventing conflicting default behavior and toggling the mobile-menu state. Inputs: `event` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (event) => {
    if (event.target === overlay) setMenuState(button, overlay, false);
  });

  window.addEventListener('keydown',  /** Callback contract: Handle keydown input for Escape/Tab behavior and keyboard focus containment. Inputs: `event` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (event) => {
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
   * Purpose: Implement the close when desktop shell returns responsibility owned by the mobile menu browser feature.
   * Inputs: None; derives required state from its enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
