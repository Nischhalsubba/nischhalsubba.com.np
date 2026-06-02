import { $$, prefersReducedMotion } from '../utils/dom.js';

function initRevealObserver() {
  const elements = $$('.reveal-on-scroll, .project-card, .impact-card, .writing-item, .achieve-item');
  if (!elements.length) return;

  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach((element, index) => {
    observer.observe(element);
  });
}

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
    .filter((element) => !heroElements.includes(element));
  if (!elements.length) return true;

  elements.forEach((element, index) => {
    const tween = {
      autoAlpha: 1,
      y: 0,
      duration: 0.62,
      delay: Math.min(index % 5, 4) * 0.035,
      ease: 'power2.out',
      clearProps: 'transform,opacity,visibility',
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

export function initMotionEnhancements() {
  if (!initGsapReveals()) initRevealObserver();
}
