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

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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

function getRevealElements() {
  return Array.from(document.querySelectorAll(REVEAL_SELECTOR)).filter((element) => element instanceof HTMLElement);
}

function runGsapMotion(elements) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  gsap.registerPlugin(ScrollTrigger);

  elements.forEach((element, index) => {
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

function runFallbackMotion(elements) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
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

  elements.forEach((element) => observer.observe(element));
}

export function initProfessionalMotionSystem() {
  if (prefersReducedMotion()) return;

  ensureMotionStyle();
  document.documentElement.classList.add('nrs-motion-ready');

  const elements = getRevealElements();
  if (!runGsapMotion(elements)) {
    runFallbackMotion(elements);
  }
}
