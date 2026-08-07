(() => {
  const root = document.querySelector('.agent-portfolio');
  if (!root) return;

  const documentElement = document.documentElement;
  const nav = document.querySelector('.nav-wrapper');
  const progress = document.querySelector('#agent-progress');
  const contactForm = document.querySelector('#contact-form');

  document.querySelector('#nrs-scroll-progress')?.remove();
  document.querySelector('#nrs-first-paint-theme')?.remove();
  document.querySelector('#nrs-page-experience-style')?.remove();

  if (progress) progress.dataset.stickyProgressReady = 'true';

  const syncHeaderHeight = () => {
    if (!nav) return;
    const height = Math.ceil(nav.getBoundingClientRect().height);
    if (height > 0) documentElement.style.setProperty('--nrs-sticky-nav-height', `${height}px`);
  };

  const syncLayout = () => {
    syncHeaderHeight();
    window.requestAnimationFrame(syncHeaderHeight);
  };

  if (nav && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(nav);
  }

  if (contactForm && contactForm.dataset.focusGuardReady !== 'true') {
    contactForm.dataset.focusGuardReady = 'true';
    contactForm.addEventListener('submit', () => {
      let attempts = 0;
      const restoreInvalidFocus = () => {
        const invalid = contactForm.querySelector('[aria-invalid="true"]');
        if (!invalid) return;
        if (document.activeElement !== invalid) invalid.focus({ preventScroll: false });
        attempts += 1;
        if (attempts < 3) window.setTimeout(restoreInvalidFocus, attempts * 60);
      };
      queueMicrotask(restoreInvalidFocus);
      window.requestAnimationFrame(restoreInvalidFocus);
    });
  }

  window.addEventListener('resize', syncLayout, { passive: true });
  window.addEventListener('orientationchange', syncLayout, { passive: true });
  window.addEventListener('pageshow', syncLayout, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(syncLayout).catch(() => {});
  }

  syncLayout();
})();
