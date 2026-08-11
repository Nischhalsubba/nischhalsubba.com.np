/**
 * @fileoverview src/scripts/features/motion/pointer-glow.js
 * Purpose: Implement pointer glow behavior inside the motion browser-runtime domain.
 * Responsibilities:
 * - Own the motion behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { prefersReducedMotion, isTouchDevice } from '../../shared/dom.js';

const CURSOR_STYLE_ID = 'nrs-decorative-cursor-style';
const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'summary',
  'label',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
  '.project-card',
  '.impact-card',
  '.blog-card-modern',
  '.writing-item',
  '.link-pill',
  '.filter-btn',
  '.btn',
  '.nrs-cursor-target',
].join(',');

/**
 * Function contract: ensureCursorStyle
 * Purpose: Apply cursor style consistently while preserving the surrounding pointer glow browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureCursorStyle() {
  let style = document.getElementById(CURSOR_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = CURSOR_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    .nrs-premium-cursor,
    .nrs-premium-cursor * {
      cursor: auto !important;
    }

    .nrs-cursor-dot,
    .nrs-cursor-ring {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      opacity: 0 !important;
      display: block !important;
      visibility: visible !important;
      will-change: transform, opacity, width, height, border-color, background-color !important;
    }

    .nrs-cursor-dot {
      width: 7px !important;
      height: 7px !important;
      border-radius: 999px !important;
      background: #E0E0E0 !important;
      box-shadow: none !important;
      transition: opacity 160ms ease, width 180ms ease, height 180ms ease, background-color 180ms ease !important;
    }

    .nrs-cursor-ring {
      width: 34px !important;
      height: 34px !important;
      border-radius: 999px !important;
      border: 1px solid #888888 !important;
      background: transparent !important;
      box-shadow: none !important;
      transition: opacity 160ms ease, width 220ms ease, height 220ms ease, border-color 220ms ease, background-color 220ms ease !important;
    }

    .nrs-cursor-visible .nrs-cursor-dot,
    .nrs-cursor-visible .nrs-cursor-ring {
      opacity: 1 !important;
    }

    .nrs-cursor-interactive .nrs-cursor-dot {
      width: 5px !important;
      height: 5px !important;
      background: #B0B0B0 !important;
    }

    .nrs-cursor-interactive .nrs-cursor-ring {
      width: 56px !important;
      height: 56px !important;
      border-color: #B0B0B0 !important;
      background: transparent !important;
    }

    .nrs-cursor-pressed .nrs-cursor-ring {
      width: 44px !important;
      height: 44px !important;
    }

    html[data-theme='light'] .nrs-cursor-dot {
      background: #444444 !important;
    }

    html[data-theme='light'] .nrs-cursor-ring {
      border-color: #444444 !important;
      background: transparent !important;
    }

    html[data-theme='light'] .nrs-cursor-interactive .nrs-cursor-dot {
      background: #1A1A1A !important;
    }

    html[data-theme='light'] .nrs-cursor-interactive .nrs-cursor-ring {
      border-color: #1A1A1A !important;
      background: transparent !important;
    }
  `;
}

/**
 * Function contract: createCursorElement
 * Purpose: Build cursor element from the supplied inputs in the form expected by downstream pointer glow browser feature consumers.
 * Inputs: `className`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function createCursorElement(className) {
  const element = document.createElement('div');
  element.className = className;
  element.setAttribute('aria-hidden', 'true');
  document.body.appendChild(element);
  return element;
}

/**
 * Function contract: initPointerGlow
 * Purpose: Initialize pointer glow for the pointer glow browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initPointerGlow() {
  if (prefersReducedMotion() || isTouchDevice()) return;
  if (document.querySelector('.nrs-cursor-dot')) return;

  ensureCursorStyle();

  const dot = createCursorElement('nrs-cursor-dot');
  const ring = createCursorElement('nrs-cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let frame = 0;

  document.body.classList.add('nrs-premium-cursor');

  /**
   * Function contract: animate
   * Purpose: Implement the animate responsibility owned by the pointer glow browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function animate() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    frame = requestAnimationFrame(animate);
  }

  /**
   * Function contract: showCursor
   * Purpose: Implements the show cursor responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: showCursor
   * Purpose: Implement the show cursor responsibility owned by the pointer glow browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function showCursor() {
    ensureCursorStyle();
    document.body.classList.add('nrs-cursor-visible');
  }

  /**
   * Function contract: hideCursor
   * Purpose: Implements the hide cursor responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: hideCursor
   * Purpose: Implement the hide cursor responsibility owned by the pointer glow browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  function hideCursor() {
    document.body.classList.remove('nrs-cursor-visible', 'nrs-cursor-interactive', 'nrs-cursor-pressed', 'nrs-cursor-text', 'nrs-cursor-media', 'nrs-cursor-labeled');
    ring.removeAttribute('data-label');
  }

  window.addEventListener('pointermove', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: event. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Handle the pointermove event for `window` and apply this module's related state update. Inputs: `event`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointermove event for `window` and apply the related local state update. Inputs: `event`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    showCursor();
  }, { passive: true });

  window.addEventListener('scroll', showCursor, { passive: true });
  window.addEventListener('resize', ensureCursorStyle);
  window.addEventListener('pointerleave', hideCursor, { passive: true });
  document.addEventListener('mouseleave', hideCursor, { passive: true });

  document.addEventListener('pointerover', /** Callback contract: Processes the callback step for document without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Handle the pointerover event for `document` and apply this module's related state update. Inputs: `event`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointerover event for `document` and apply the related local state update. Inputs: `event`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const interactive = target.closest(INTERACTIVE_SELECTOR);
    const modeTarget = target.closest('[data-cursor-mode]');
    const labelTarget = target.closest('[data-cursor-label]');
    const mode = modeTarget?.getAttribute('data-cursor-mode');
    const label = labelTarget?.getAttribute('data-cursor-label') || '';

    document.body.classList.toggle('nrs-cursor-interactive', Boolean(interactive));
    document.body.classList.toggle('nrs-cursor-text', mode === 'text' && !interactive);
    document.body.classList.toggle('nrs-cursor-media', mode === 'media');
    document.body.classList.toggle('nrs-cursor-labeled', Boolean(label));

    if (label) ring.setAttribute('data-label', label);
    else ring.removeAttribute('data-label');
  }, { passive: true });

  document.addEventListener('pointerdown', /** Callback contract: Processes the callback step for document without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Handle the pointerdown event for `document` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointerdown event for `document` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
    document.body.classList.add('nrs-cursor-pressed');
  }, { passive: true });

  document.addEventListener('pointerup', /** Callback contract: Processes the callback step for document without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Handle the pointerup event for `document` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pointerup event for `document` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
    document.body.classList.remove('nrs-cursor-pressed');
  }, { passive: true });

  frame = requestAnimationFrame(animate);

  window.addEventListener('beforeunload', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the beforeunload event for `window` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the beforeunload event for `window` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
    if (frame) cancelAnimationFrame(frame);
  }, { once: true });
}