(() => {
  const root = document.querySelector('.agent-portfolio');
  if (!root) return;

  const documentElement = document.documentElement;
  const progressId = 'nrs-scroll-progress';
  const nav = document.querySelector('.nav-wrapper');
  let frame = 0;

  document.querySelector('#nrs-first-paint-theme')?.remove();
  document.querySelector('#nrs-page-experience-style')?.remove();

  let progress = document.getElementById(progressId);
  if (!progress) {
    progress = document.createElement('div');
    progress.id = progressId;
    progress.setAttribute('aria-hidden', 'true');
    document.body.prepend(progress);
  }
  progress.dataset.stickyProgressReady = 'true';

  const syncHeaderHeight = () => {
    if (!nav) return;
    const height = Math.ceil(nav.getBoundingClientRect().height);
    if (height > 0) documentElement.style.setProperty('--nrs-sticky-nav-height', `${height}px`);
  };

  const renderProgress = () => {
    frame = 0;
    const scrollable = Math.max(0, documentElement.scrollHeight - window.innerHeight);
    const ratio = scrollable > 0
      ? Math.min(1, Math.max(0, window.scrollY / scrollable))
      : 0;

    progress.style.setProperty('--nrs-scroll-progress-scale', ratio.toFixed(5));
    progress.dataset.progress = ratio.toFixed(3);
    progress.classList.toggle('is-active', ratio > 0.002);
  };

  const scheduleProgress = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(renderProgress);
  };

  const syncLayout = () => {
    syncHeaderHeight();
    scheduleProgress();
  };

  if (nav && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(nav);
  }

  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', syncLayout, { passive: true });
  window.addEventListener('orientationchange', syncLayout, { passive: true });
  window.addEventListener('pageshow', syncLayout, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(syncLayout).catch(() => {});
  }

  syncLayout();
  window.requestAnimationFrame(syncLayout);
})();
