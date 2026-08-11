/**
 * @fileoverview src/scripts/features/motion/motion.js
 * Purpose: Implement motion behavior inside the motion browser-runtime domain.
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
import { $$, prefersReducedMotion } from '../../shared/dom.js';


/**
 * Function contract: initRevealObserver
 * Purpose: Initialize reveal observer for the motion browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function initRevealObserver() {
  const elements = $$('.reveal-on-scroll, .project-card, .impact-card, .writing-item, .achieve-item');
  if (!elements.length) return;

  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver(
     /** Callback contract: Perform the local callback step required by the immediately enclosing motion browser feature operation. Inputs: `entries` Side effects: reads or updates DOM/browser state Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ (entries) => {
      entries.forEach( /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `entry` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach( /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (element, index) => {
    observer.observe(element);
  });
}


/**
 * Function contract: initGsapReveals
 * Purpose: Initialize gsap reveals for the motion browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function initGsapReveals() {
  if (prefersReducedMotion()) return false;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap) return false;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  document.documentElement.classList.add('motion-ready');

  const heroElements = [
    document.querySelector('.hero-section .eyebrow'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-section .body-large'),
    document.querySelector('.hero-actions'),
    document.querySelector('.hero-portrait-img'),
  ].filter(Boolean);

  if (heroElements.length) {
    gsap.fromTo(
      heroElements,
      { autoAlpha: 0, y: 18 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      }
    );
  }

  const elements = $$('.reveal-on-scroll, .project-card, .impact-card, .writing-item, .journey-card, .prototype-link-card')
    .filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `element` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (element) => !heroElements.includes(element));
  if (!elements.length) return true;

  elements.forEach( /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`, `index` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (element, index) => {
    const tween = {
      autoAlpha: 1,
      y: 0,
      duration: 0.62,
      delay: Math.min(index % 5, 4) * 0.035,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      
      /**
       * Function contract: onComplete
       * Purpose: Handle complete and coordinate the resulting motion browser feature state changes.
       * Inputs: None; derives required state from its enclosing module/runtime context.
       * Side effects: reads or updates DOM/browser state
       * Returns: Computed expression result consumed by the enclosing operation.
       */
      onComplete: () => element.classList.add('is-visible'),
    };

    if (ScrollTrigger) {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 16 },
        {
          ...tween,
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            once: true,
          },
        }
      );
      return;
    }

    gsap.fromTo(element, { autoAlpha: 0, y: 12 }, tween);
  });

  return true;
}


/**
 * Function contract: initMotionEnhancements
 * Purpose: Initialize motion enhancements for the motion browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function initMotionEnhancements() {
  if (!initGsapReveals()) initRevealObserver();
}
