/**
 * @fileoverview src/scripts/features/motion/motion.js
 * Purpose: Browser runtime feature in the motion domain responsible for motion behavior.
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
import { $$, prefersReducedMotion } from '../../shared/dom.js';

/**
 * Function contract: initRevealObserver
 * Purpose: Implements the init reveal observer responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function initRevealObserver() {
  const elements = $$('.reveal-on-scroll, .project-card, .impact-card, .writing-item, .achieve-item');
  if (!elements.length) return;

  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver(
    /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: entries. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (entries) => {
      entries.forEach(/** Callback contract: Processes the callback step for entries without leaking orchestration details to the caller. Inputs: entry. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element, index. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (element, index) => {
    observer.observe(element);
  });
}

/**
 * Function contract: initGsapReveals
 * Purpose: Implements the init gsap reveals responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
    .filter(/** Callback contract: Processes the callback step for $$('.reveal on scroll, .project card, .impact card, .writing item, .journey card, .prototype link card') without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (element) => !heroElements.includes(element));
  if (!elements.length) return true;

  elements.forEach(/** Callback contract: Processes the callback step for elements without leaking orchestration details to the caller. Inputs: element, index. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (element, index) => {
    const tween = {
      autoAlpha: 1,
      y: 0,
      duration: 0.62,
      delay: Math.min(index % 5, 4) * 0.035,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
      onComplete: /**
       * Function contract: onComplete
       * Purpose: Handles on complete and coordinates the required state or UI response.
       * Inputs: none; the function derives state from its enclosing module/runtime context.
       * Side effects: may read or update browser DOM/state.
       * Returns: no explicit value unless an invoked dependency throws/rejects.
       */
      () => element.classList.add('is-visible'),
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
 * Purpose: Implements the init motion enhancements responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function initMotionEnhancements() {
  if (!initGsapReveals()) initRevealObserver();
}
