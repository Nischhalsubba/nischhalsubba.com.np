const MOTION_STYLE_ID = 'nrs-professional-motion-style';
const MOTION_SELECTOR = [
  '.hero-section > *',
  '.section-container',
  '.project-card',
  '.impact-card',
  '.writing-item',
  '.blog-card-modern',
  '.journey-card',
  '.comparison-card',
  '.metric-plan-card',
  '.story-card',
  '.quote-card',
  '.case-list li',
  '.clarity-row-list article',
  '.clarity-steps article',
  '.contact-form',
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
    .nrs-motion-ready ${MOTION_SELECTOR} {
      will-change: transform, opacity;
    }

    .nrs-motion-ready .project-card,
    .nrs-motion-ready .impact-card,
    .nrs-motion-ready .writing-item,
    .nrs-motion-ready .blog-card-modern,
    .nrs-motion-ready .journey-card,
    .nrs-motion-ready .comparison-card,
    .nrs-motion-ready .metric-plan-card,
    .nrs-motion-ready .story-card,
    .nrs-motion-ready .quote-card,
    .nrs-motion-ready .case-list li,
    .nrs-motion-ready .clarity-row-list article,
    .nrs-motion-ready .clarity-steps article,
    .nrs-motion-ready .contact-form {
      transition:
        transform 320ms cubic-bezier(.16, 1, .3, 1),
        border-color 220ms ease,
        color 220ms ease,
        opacity 420ms cubic-bezier(.16, 1, .3, 1) !important;
    }

    .nrs-motion-ready .project-card:hover,
    .nrs-motion-ready .impact-card:hover,
    .nrs-motion-ready .writing-item:hover,
    .nrs-motion-ready .blog-card-modern:hover,
    .nrs-motion-ready .journey-card:hover,
    .nrs-motion-ready .comparison-card:hover,
    .nrs-motion-ready .metric-plan-card:hover,
    .nrs-motion-ready .story-card:hover,
    .nrs-motion-ready .quote-card:hover,
    .nrs-motion-ready .case-list li:hover,
    .nrs-motion-ready .clarity-row-list article:hover,
    .nrs-motion-ready .clarity-steps article:hover {
      transform: translate3d(0, -5px, 0) !important;
    }

    .nrs-motion-ready .btn,
    .nrs-motion-ready .nav-link,
    .nrs-motion-ready .filter-btn,
    .nrs-motion-ready .link-pill,
    .nrs-motion-ready .badge-pill,
    .nrs-motion-ready .theme-toggle-btn {
      transition:
        transform 180ms cubic-bezier(.16, 1, .3, 1),
        background-color 180ms ease,
        border-color 180ms ease,
        color 180ms ease !important;
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
  return Array.from(document.querySelectorAll(MOTION_SELECTOR)).filter((element) => element instanceof HTMLElement);
}

function runGsapMotion(elements) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    'main',
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, duration: 0.72, ease: 'power3.out', clearProps: 'transform,opacity,visibility' }
  );

  elements.forEach((element, index) => {
    gsap.fromTo(
      element,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        delay: Math.min(index * 0.015, 0.12),
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
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
          { opacity: 0, transform: 'translate3d(0, 28px, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        { duration: 620, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'both' }
      );
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

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
