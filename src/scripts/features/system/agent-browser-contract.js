/**
 * @fileoverview src/scripts/features/system/agent-browser-contract.js
 * Purpose: Browser runtime feature in the system domain responsible for agent browser contract behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/agent-main.js
 * - src/runtime/script.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
(/** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ () => {
  const root = document.querySelector('.agent-portfolio');
  if (!root) return;

  const documentElement = document.documentElement;
  const nav = document.querySelector('.nav-wrapper');
  const progress = document.querySelector('#agent-progress');
  const contactForm = document.querySelector('#contact-form');
  const desktopThemeToggle = document.querySelector('#theme-toggle');
  const mobileThemeToggle = document.querySelector('.agent-mobile-theme-toggle');

  document.querySelector('#nrs-scroll-progress')?.remove();
  document.querySelector('#nrs-first-paint-theme')?.remove();
  document.querySelector('#nrs-page-experience-style')?.remove();

  if (progress) progress.dataset.stickyProgressReady = 'true';

  /**
   * Function contract: syncHeaderHeight
   * Purpose: Implements the sync header height responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: no obvious external side effect beyond invoked dependencies.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  const syncHeaderHeight = () => {
    if (!nav) return;
    const height = Math.ceil(nav.getBoundingClientRect().height);
    if (height > 0) documentElement.style.setProperty('--nrs-sticky-nav-height', `${height}px`);
  };

  /**
   * Function contract: syncLayout
   * Purpose: Implements the sync layout responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  const syncLayout = () => {
    syncHeaderHeight();
    window.requestAnimationFrame(syncHeaderHeight);
  };

  if (nav && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(nav);
  }

  if (mobileThemeToggle && desktopThemeToggle && mobileThemeToggle.dataset.themeProxyReady !== 'true') {
    mobileThemeToggle.dataset.themeProxyReady = 'true';
    mobileThemeToggle.addEventListener('click', /** Callback contract: Processes the callback step for mobile theme toggle without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
      desktopThemeToggle.click();
    });
  }

  if (contactForm && contactForm.dataset.focusGuardReady !== 'true') {
    contactForm.dataset.focusGuardReady = 'true';
    contactForm.addEventListener('submit', /** Callback contract: Processes the callback step for contact form without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ () => {
      let attempts = 0;
      /**
       * Function contract: restoreInvalidFocus
       * Purpose: Implements the restore invalid focus responsibility for this module.
       * Inputs: none; the function derives state from its enclosing module/runtime context.
       * Side effects: may read or update browser DOM/state.
       * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
       */
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
    document.fonts.ready.then(syncLayout).catch(/** Callback contract: Processes the callback step for document.fonts.ready.then(sync layout) without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {});
  }

  syncLayout();
})();
