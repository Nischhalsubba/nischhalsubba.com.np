import { prefersReducedMotion, isTouchDevice } from '../utils/dom.js';

export function initPointerGlow() {
  if (prefersReducedMotion() || isTouchDevice()) return;

  let frame = 0;
  let active = false;

  function setPointer(x, y) {
    document.documentElement.style.setProperty('--pointer-x', `${x}px`);
    document.documentElement.style.setProperty('--pointer-y', `${y}px`);
    if (!active) {
      active = true;
      document.body.classList.add('pointer-glow-active');
    }
  }

  window.addEventListener('pointermove', (event) => {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => setPointer(event.clientX, event.clientY));
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    active = false;
    document.body.classList.remove('pointer-glow-active');
  }, { passive: true });
}
