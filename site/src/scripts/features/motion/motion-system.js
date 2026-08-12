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
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}


/**
 * Function contract: ensureMotionStyle
 * Purpose: Apply motion style consistently while preserving the surrounding motion system browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Return reveal elements from the supplied inputs or current motion system browser feature state.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: The requested reveal elements; explicit early-return branches define empty/fallback behavior.
 */
function getRevealElements() {
  return Array.from(document.querySelectorAll(REVEAL_SELECTOR)).filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `element` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (element) => element instanceof HTMLElement);
}



/**
 * Function contract: runGsapMotion
 * Purpose: Execute gsap motion in the required order and propagate failures through the motion system browser feature contract.
 * Inputs: `elements`
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function runGsapMotion(elements) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  gsap.registerPlugin(ScrollTrigger);

  elements.forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (element, index) => {
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
 * Purpose: Execute fallback motion in the required order and propagate failures through the motion system browser feature contract.
 * Inputs: `elements`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function runFallbackMotion(elements) {
  const observer = new IntersectionObserver(   /** Callback contract: Perform the local callback step required by the immediately enclosing motion system browser feature operation. Inputs: `entries` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ (entries) => {
    entries.forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `entry` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (entry) => {
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

  elements.forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (element) => observer.observe(element));
}



/**
 * Function contract: initProfessionalMotionSystem
 * Purpose: Initialize professional motion system for the motion system browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
