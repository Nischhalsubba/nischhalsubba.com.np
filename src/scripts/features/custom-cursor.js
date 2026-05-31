function canUseCustomCursor() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isInteractiveElement(target) {
  return Boolean(target.closest('a, button, input, textarea, select, [role="button"], .work-card, .az-card[href], .project-card, .cursor-hover'));
}

function isTextElement(target) {
  return Boolean(target.closest('input, textarea, [contenteditable="true"]'));
}

export function initCustomCursor() {
  if (!canUseCustomCursor() || document.querySelector('.nrs-cursor-dot')) return;

  const dot = document.createElement('span');
  const ring = document.createElement('span');
  dot.className = 'nrs-cursor-dot';
  ring.className = 'nrs-cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);

  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;
  let rafId = 0;

  function render() {
    ringX += (dotX - ringX) * 0.22;
    ringY += (dotY - ringY) * 0.22;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    rafId = window.requestAnimationFrame(render);
  }

  window.addEventListener('mousemove', (event) => {
    dotX = event.clientX;
    dotY = event.clientY;
    document.body.classList.add('nrs-cursor-ready');

    if (isTextElement(event.target)) {
      document.body.classList.add('nrs-cursor-text');
      document.body.classList.remove('nrs-cursor-hover');
    } else if (isInteractiveElement(event.target)) {
      document.body.classList.add('nrs-cursor-hover');
      document.body.classList.remove('nrs-cursor-text');
    } else {
      document.body.classList.remove('nrs-cursor-hover', 'nrs-cursor-text');
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    document.body.classList.remove('nrs-cursor-ready', 'nrs-cursor-hover', 'nrs-cursor-text');
  });

  window.addEventListener('blur', () => {
    document.body.classList.remove('nrs-cursor-ready', 'nrs-cursor-hover', 'nrs-cursor-text');
  });

  rafId = window.requestAnimationFrame(render);

  window.addEventListener('pagehide', () => {
    if (rafId) window.cancelAnimationFrame(rafId);
  });
}
