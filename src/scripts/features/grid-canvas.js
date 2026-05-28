import { $, isTouchDevice, prefersReducedMotion } from '../utils/dom.js';

export function initGridCanvas() {
  const canvas = $('#grid-canvas');
  if (!canvas || prefersReducedMotion() || isTouchDevice() || window.innerWidth < 900) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  let width = 0;
  let height = 0;
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const grid = 60;

    context.strokeStyle = light ? 'rgba(0,0,0,.045)' : 'rgba(255,255,255,.045)';
    context.lineWidth = 1;
    context.beginPath();

    for (let x = 0; x <= width; x += grid) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }

    for (let y = 0; y <= height; y += grid) {
      context.moveTo(0, y);
      context.lineTo(width, y);
    }

    context.stroke();

    const gradient = context.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 320);
    gradient.addColorStop(0, light ? 'rgba(12,140,233,.12)' : 'rgba(59,130,246,.14)');
    gradient.addColorStop(1, 'rgba(59,130,246,0)');

    context.strokeStyle = gradient;
    context.beginPath();

    for (let x = 0; x <= width; x += grid) {
      context.moveTo(x, Math.max(0, mouse.y - 320));
      context.lineTo(x, Math.min(height, mouse.y + 320));
    }

    for (let y = 0; y <= height; y += grid) {
      context.moveTo(Math.max(0, mouse.x - 320), y);
      context.lineTo(Math.min(width, mouse.x + 320), y);
    }

    context.stroke();
    window.requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (event) => {
    mouse = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  draw();
}
