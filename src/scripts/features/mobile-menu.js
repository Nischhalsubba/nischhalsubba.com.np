import { $, $$ } from '../utils/dom.js';

export function initMobileMenu() {
  const button = $('.mobile-nav-toggle');
  if (!button) return;

  const overlay = $('.mobile-nav-overlay');
  if (overlay && !overlay.id) overlay.id = 'mobile-nav-overlay';
  if (overlay) button.setAttribute('aria-controls', overlay.id);
  button.setAttribute('aria-expanded', 'false');

  button.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    button.setAttribute('aria-expanded', String(open));
  });

  $$('.mobile-nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      button.setAttribute('aria-expanded', 'false');
    });
  });
}
