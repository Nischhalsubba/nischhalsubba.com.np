import { $$, isTouchDevice, prefersReducedMotion } from '../utils/dom.js';

function initRevealObserver() {
  const elements = $$('.reveal-on-scroll, .project-card, .impact-card, .writing-item, .achieve-item');
  if (!elements.length) return;

  if (prefersReducedMotion()) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

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
    element.style.setProperty('--reveal-delay', `${Math.min(index % 8, 7) * 55}ms`);
    observer.observe(element);
  });
}

function initMagneticCards() {
  if (prefersReducedMotion() || isTouchDevice()) return;

  $$('.project-card, .impact-card, .blog-card-modern').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
      card.style.setProperty('--tilt-x', `${y}deg`);
      card.style.setProperty('--tilt-y', `${x}deg`);
      card.classList.add('is-tilting');
    });

    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
}

function initCustomCursor() {
  if (prefersReducedMotion() || isTouchDevice()) return;

  let dot = document.querySelector('.custom-cursor-dot');
  let outline = document.querySelector('.custom-cursor-outline');

  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);
  }

  if (!outline) {
    outline = document.createElement('div');
    outline.className = 'custom-cursor-outline';
    document.body.appendChild(outline);
  }

  document.body.classList.add('custom-cursor-active');

  let outlineX = window.innerWidth / 2;
  let outlineY = window.innerHeight / 2;
  let targetX = outlineX;
  let targetY = outlineY;

  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
    },
    { passive: true }
  );

  function animate() {
    outlineX += (targetX - outlineX) * 0.18;
    outlineY += (targetY - outlineY) * 0.18;
    outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }

  animate();

  $$('a, button, .project-card, .impact-card, input, textarea').forEach((element) => {
    element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover'));
    element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover'));
  });
}

export function initMotionEnhancements() {
  initRevealObserver();
  initMagneticCards();
  initCustomCursor();
}
