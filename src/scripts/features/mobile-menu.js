import { $, $$ } from '../utils/dom.js';

function setMenuState(button, overlay, open) {
  document.body.classList.toggle('menu-open', open);
  button.setAttribute('aria-expanded', String(open));

  if (overlay) {
    overlay.toggleAttribute('aria-hidden', !open);
  }
}

export function initMobileMenu() {
  const button = $('.mobile-nav-toggle');
  if (!button || button.dataset.mobileMenuReady === 'true') return;

  const overlay = $('.mobile-nav-overlay');
  if (overlay && !overlay.id) overlay.id = 'mobile-nav-overlay';

  button.dataset.mobileMenuReady = 'true';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-expanded', 'false');

  if (overlay) {
    button.setAttribute('aria-controls', overlay.id);
    overlay.setAttribute('aria-hidden', 'true');
  }

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const open = !document.body.classList.contains('menu-open');
    setMenuState(button, overlay, open);
  });

  $$('.mobile-nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuState(button, overlay, false);
    });
  });

  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) {
      setMenuState(button, overlay, false);
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenuState(button, overlay, false);
      button.focus({ preventScroll: true });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 850 && document.body.classList.contains('menu-open')) {
      setMenuState(button, overlay, false);
    }
  });
}
