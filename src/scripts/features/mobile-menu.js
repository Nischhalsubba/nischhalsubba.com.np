import { $, $$ } from '../utils/dom.js';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusableElements(overlay) {
  if (!overlay || overlay.hidden) return [];
  return [...overlay.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return !element.hasAttribute('hidden')
      && element.getAttribute('aria-hidden') !== 'true'
      && style.display !== 'none'
      && style.visibility !== 'hidden'
      && rect.width > 0
      && rect.height > 0;
  });
}

function setBackgroundInert(button, overlay, open) {
  [...document.body.children].forEach((element) => {
    if (element === overlay || element === button || element.classList.contains('skip-link')) return;

    if (open) {
      if (element.inert) element.dataset.wasInert = 'true';
      element.inert = true;
    } else {
      element.inert = element.dataset.wasInert === 'true';
      delete element.dataset.wasInert;
    }
  });
}

function setMenuState(button, overlay, open, { restoreFocus = true } = {}) {
  document.body.classList.toggle('menu-open', open);
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');

  if (!overlay) return;

  if (open) overlay.hidden = false;
  overlay.setAttribute('aria-hidden', String(!open));
  setBackgroundInert(button, overlay, open);

  if (open) {
    window.requestAnimationFrame(() => {
      overlay.focus({ preventScroll: true });
      window.requestAnimationFrame(() => {
        const firstFocusable = getFocusableElements(overlay)[0];
        if (firstFocusable) firstFocusable.focus({ preventScroll: true });
      });
    });
    return;
  }

  window.requestAnimationFrame(() => {
    overlay.hidden = true;
    if (restoreFocus) button.focus({ preventScroll: true });
  });
}

function trapFocus(event, overlay) {
  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements(overlay);
  if (!focusable.length) {
    event.preventDefault();
    overlay.focus({ preventScroll: true });
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && (document.activeElement === first || document.activeElement === overlay)) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
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
  button.setAttribute('aria-label', 'Open navigation menu');

  if (overlay) {
    button.setAttribute('aria-controls', overlay.id);
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Site navigation');
    overlay.setAttribute('tabindex', '-1');
  }

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const open = !document.body.classList.contains('menu-open');
    setMenuState(button, overlay, open);
  });

  $$('.mobile-nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuState(button, overlay, false, { restoreFocus: false });
    });
  });

  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) setMenuState(button, overlay, false);
  });

  window.addEventListener('keydown', (event) => {
    if (!document.body.classList.contains('menu-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuState(button, overlay, false);
      return;
    }

    trapFocus(event, overlay);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 850 && document.body.classList.contains('menu-open')) {
      setMenuState(button, overlay, false, { restoreFocus: false });
    }
  }, { passive: true });
}
