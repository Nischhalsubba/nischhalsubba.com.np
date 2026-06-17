import { prefersReducedMotion, isTouchDevice } from '../utils/dom.js';

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

  const dot = createCursorElement('nrs-cursor-dot');
  const ring = createCursorElement('nrs-cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let frame = 0;

  // Keep the real browser cursor visible. The custom cursor is only decorative.
  document.body.classList.remove('nrs-premium-cursor');

  function animate() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    frame = requestAnimationFrame(animate);
  }

  function showCursor() {
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

  window.addEventListener('scroll', () => {
    showCursor();
  }, { passive: true });

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
