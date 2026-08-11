/**
 * @fileoverview src/scripts/features/motion/motion-system.js
 * Purpose: Implement motion system behavior inside the motion browser-runtime domain.
 * Responsibilities:
 * - Own the motion behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const MOTION_STYLE_ID = 'nrs-professional-motion-style';
const REVEAL_SELECTOR = [
  '.hero-section > .eyebrow',
  '.hero-section > .hero-title',
  '.hero-section > .body-large',
  '.hero-actions',
  '.project-card',
  '.writing-item',
  '.contact-form',
  '.nrs-case-study-snapshot',
].join(',');

const HOVER_SELECTOR = [
  '.project-card',
  '.writing-item',
  '.impact-card',
  '.journey-card',
  '.comparison-card',
  '.metric-plan-card',
  '.story-card',
  '.quote-card',
].join(',');

/**
 * Function contract: prefersReducedMotion
 * Purpose: Implement the prefers reduced motion responsibility owned by the motion system browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Function contract: ensureMotionStyle
 * Purpose: Apply motion style consistently while preserving the surrounding motion system browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureMotionStyle() {
  let style = document.getElementById(MOTION_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = MOTION_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    .nrs-motion-ready ${REVEAL_SELECTOR} {
      will-change: transform, opacity;
    }

    .nrs-motion-ready ${HOVER_SELECTOR} {
      transition:
        transform 260ms cubic-bezier(.16, 1, .3, 1),
        border-color 180ms ease,
        color 180ms ease,
        opacity 320ms cubic-bezier(.16, 1, .3, 1) !important;
    }

    .nrs-motion-ready ${HOVER_SELECTOR}:hover {
      transform: translate3d(0, -3px, 0) !important;
    }

    .nrs-motion-ready .btn,
    .nrs-motion-ready .nav-link,
    .nrs-motion-ready .filter-btn,
    .nrs-motion-ready .link-pill,
    .nrs-motion-ready .badge-pill,
    .nrs-motion-ready .theme-toggle-btn {
      transition:
        transform 160ms cubic-bezier(.16, 1, .3, 1),
        background-color 160ms ease,
        border-color 160ms ease,
        color 160ms ease !important;
    }

    .nrs-motion-ready .btn:hover,
    .nrs-motion-ready .nav-link:hover,
    .nrs-motion-ready .filter-btn:hover,
    .nrs-motion-ready .link-pill:hover,
    .nrs-motion-ready .badge-pill:hover,
    .nrs-motion-ready .theme-toggle-btn:hover {
      transform: translate3d(0, -2px, 0) !important;
    }

    .nrs-motion-ready .btn:active,
    .nrs-motion-ready .nav-link:active,
    .nrs-motion-ready .filter-btn:active,
    .nrs-motion-ready .link-pill:active,
    .nrs-motion-ready .theme-toggle-btn:active {
      transform: translate3d(0, 0, 0) scale(.985) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .nrs-motion-ready *,
      .nrs-motion-ready *::before,
      .nrs-motion-ready *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .001ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
}

/**
 * Function contract: getRevealElements
 * Purpose: Retrieves get reveal elements and returns it in the form expected by its caller.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: getRevealElements
 * Purpose: Return reveal elements from the supplied inputs or current motion system browser feature state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: The requested reveal elements; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getRevealElements() {
  return Array.from(document.querySelectorAll(REVEAL_SELECTOR)).filter(/** Callback contract: Processes the callback step for array.from(document.query selector all(reveal selector)) without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `element`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `element`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (element) => element instanceof HTMLElement);
}

/**
 * Function contract: runGsapMotion
 * Purpose: Implements the run gsap motion responsibility for this module.
 * Inputs: elements.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: runGsapMotion
 * Purpose: Execute gsap motion in the required order and propagate failures through the motion system browser feature contract.
 * Inputs: `elements`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Boolean predicate result consumed by the caller.
 */
function runGsapMotion(elements) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  gsap.registerPlugin(ScrollTrigger);

  elements.forEach(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element, index. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`, `index`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`, `index`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (element, index) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.46,
        delay: Math.min(index * 0.008, 0.06),
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: element,
          start: 'top 92%',
          once: true,
        },
      }
    );
  });

  return true;
}

/**
 * Function contract: runFallbackMotion
 * Purpose: Implements the run fallback motion responsibility for this module.
 * Inputs: elements.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: runFallbackMotion
 * Purpose: Execute fallback motion in the required order and propagate failures through the motion system browser feature contract.
 * Inputs: `elements`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function runFallbackMotion(elements) {
  const observer = new IntersectionObserver(/** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: entries. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing motion system browser feature operation. Inputs: `entries`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `entries`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (entries) => {
    entries.forEach(/** Callback contract: Processes the callback step for entries without leaking orchestration details to the caller. Inputs: entry. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `entry`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `entry`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (entry) => {
      if (!entry.isIntersecting) return;
      entry.target.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 20px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        { duration: 420, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' }
      );
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  elements.forEach(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (element) => observer.observe(element));
}

/**
 * Function contract: initProfessionalMotionSystem
 * Purpose: Implements the init professional motion system responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: initProfessionalMotionSystem
 * Purpose: Initialize professional motion system for the motion system browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initProfessionalMotionSystem() {
  if (prefersReducedMotion()) return;

  ensureMotionStyle();
  document.documentElement.classList.add('nrs-motion-ready');

  const elements = getRevealElements();
  if (!runGsapMotion(elements)) {
    runFallbackMotion(elements);
  }
}
