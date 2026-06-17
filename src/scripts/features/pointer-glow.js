import { prefersReducedMotion, isTouchDevice } from '../utils/dom.js';

const CURSOR_STYLE_ID = 'nrs-decorative-cursor-style';
const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'summary',
  '[role="button"]',
  '.project-card',
  '.impact-card',
  '.blog-card-modern',
  '.writing-item',
  '.link-pill',
  '.filter-btn',
  '.btn',
].join(',');

function ensureCursorStyle() {
  let style = document.getElementById(CURSOR_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = CURSOR_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    .nrs-premium-cursor,
    .nrs-premium-cursor * {
      cursor: auto !important;
    }

    .nrs-cursor-dot,
    .nrs-cursor-ring {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      opacity: 0 !important;
      display: block !important;
      visibility: visible !important;
      will-change: transform, opacity, width, height, border-color, background-color !important;
    }

    .nrs-cursor-dot {
      width: 7px !important;
      height: 7px !important;
      border-radius: 999px !important;
      background: #E0E0E0 !important;
      box-shadow: none !important;
      transition: opacity 160ms ease, width 180ms ease, height 180ms ease, background-color 180ms ease !important;
    }

    .nrs-cursor-ring {
      width: 34px !important;
      height: 34px !important;
      border-radius: 999px !important;
      border: 1px solid #888888 !important;
      background: transparent !important;
      box-shadow: none !important;
      transition: opacity 160ms ease, width 220ms ease, height 220ms ease, border-color 220ms ease, background-color 220ms ease !important;
    }

    .nrs-cursor-visible .nrs-cursor-dot,
    .nrs-cursor-visible .nrs-cursor-ring {
      opacity: 1 !important;
    }

    .nrs-cursor-interactive .nrs-cursor-dot {
      width: 5px !important;
      height: 5px !important;
      background: #B0B0B0 !important;
    }

    .nrs-cursor-interactive .nrs-cursor-ring {
      width: 56px !important;
      height: 56px !important;
      border-color: #B0B0B0 !important;
      background: transparent !important;
    }

    .nrs-cursor-pressed .nrs-cursor-ring {
      width: 44px !important;
      height: 44px !important;
    }

    html[data-theme='light'] .nrs-cursor-dot {
      background: #444444 !important;
    }

    html[data-theme='light'] .nrs-cursor-ring {
      border-color: #444444 !important;
      background: transparent !important;
    }

    html[data-theme='light'] .nrs-cursor-interactive .nrs-cursor-dot {
      background: #1A1A1A !important;
    }

    html[data-theme='light'] .nrs-cursor-interactive .nrs-cursor-ring {
      border-color: #1A1A1A !important;
      background: transparent !important;
    }
  `;
}

function createCursorElement(className) {
  const element = document.createElement('div');
  element.className = className;
  element.setAttribute('aria-hidden', 'true');
  document.body.appendChild(element);
  return element;
}

export function initPointerGlow() {
  if (prefersReducedMotion() || isTouchDevice()) return;
  if (document.querySelector('.nrs-cursor-dot')) return;

  ensureCursorStyle();

  const dot = createCursorElement('nrs-cursor-dot');
  const ring = createCursorElement('nrs-cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let frame = 0;

  // Keep the real browser cursor visible. The custom cursor is decorative, not a replacement.
  document.body.classList.add('nrs-premium-cursor');

  function animate() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    frame = requestAnimationFrame(animate);
  }

  function showCursor() {
    ensureCursorStyle();
    document.body.classList.add('nrs-cursor-visible');
  }

  function hideCursor() {
    document.body.classList.remove('nrs-cursor-visible', 'nrs-cursor-interactive', 'nrs-cursor-pressed');
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    showCursor();
  }, { passive: true });

  window.addEventListener('scroll', showCursor, { passive: true });
  window.addEventListener('resize', ensureCursorStyle);

  window.addEventListener('pointerleave', hideCursor, { passive: true });
  document.addEventListener('mouseleave', hideCursor, { passive: true });

  document.addEventListener('pointerover', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    document.body.classList.toggle('nrs-cursor-interactive', Boolean(target.closest(INTERACTIVE_SELECTOR)));
  }, { passive: true });

  document.addEventListener('pointerdown', () => {
    document.body.classList.add('nrs-cursor-pressed');
  }, { passive: true });

  document.addEventListener('pointerup', () => {
    document.body.classList.remove('nrs-cursor-pressed');
  }, { passive: true });

  frame = requestAnimationFrame(animate);

  window.addEventListener('beforeunload', () => {
    if (frame) cancelAnimationFrame(frame);
  }, { once: true });
}
