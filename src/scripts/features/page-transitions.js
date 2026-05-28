import { $$, prefersReducedMotion } from '../utils/dom.js';

export function initPageTransitions() {
  if (prefersReducedMotion()) return;

  document.documentElement.classList.add('page-ready');

  $$('.nav-link, .mobile-nav-links a, .project-card, .writing-item').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    link.addEventListener('click', () => {
      document.documentElement.classList.add('page-leaving');
    });
  });
}
