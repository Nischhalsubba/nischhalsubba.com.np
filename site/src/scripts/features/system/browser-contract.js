/**
 * @fileoverview src/scripts/features/system/browser-contract.js
 * Purpose: Apply browser-level layout, theme-proxy, and form-focus safeguards required by the redesigned portfolio shell.
 * Responsibilities:
 * - Keep sticky navigation height synchronized with the actual rendered header.
 * - Forward the mobile drawer appearance control to the canonical theme toggle.
 * - Restore focus to invalid contact fields after asynchronous validation updates.
 * - Recalculate layout-sensitive values after resize, orientation, page restore, and font loading.
 * Execution context: Browser ES module loaded by the portfolio runtime on redesigned pages.
 * Connected files:
 * - src/scripts/entrypoints/portfolio-main.js
 * - src/scripts/features/navigation/theme.js
 * - src/scripts/features/forms/contact-form.js
 * - scripts/ensure-mobile-theme-control.cjs
 * Maintenance: Several DOM selectors are shared with historical generated markup and CSS. Rename those selectors only as one coordinated migration across markup generators, styles, runtime code, and browser audits.
 */
(
/** Callback contract: Initialize browser-level safeguards for pages using the redesigned portfolio shell. Inputs: None. Side effects: Reads and updates DOM state, registers browser listeners, and may move focus after form validation. Returns: Nothing. */
() => {
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
   * Purpose: Measure the rendered navigation height and expose it through the shared sticky-layout CSS variable.
   * Inputs: None.
   * Side effects: Reads navigation geometry and may update a CSS custom property on the document element.
   * Returns: Nothing.
   */
  const syncHeaderHeight = () => {
    if (!nav) return;
    const height = Math.ceil(nav.getBoundingClientRect().height);
    if (height > 0) documentElement.style.setProperty('--nrs-sticky-nav-height', `${height}px`);
  };

  /**
   * Function contract: syncLayout
   * Purpose: Refresh layout measurements immediately and once more on the next animation frame after browser layout settles.
   * Inputs: None.
   * Side effects: Invokes header measurement and schedules one animation-frame update.
   * Returns: Nothing.
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
    mobileThemeToggle.addEventListener(
      'click',
      /** Callback contract: Forward a mobile drawer appearance click to the canonical desktop theme control. Inputs: None. Side effects: Programmatically clicks the canonical theme toggle. Returns: Nothing. */
      () => {
        desktopThemeToggle.click();
      },
    );
  }

  if (contactForm && contactForm.dataset.focusGuardReady !== 'true') {
    contactForm.dataset.focusGuardReady = 'true';
    contactForm.addEventListener(
      'submit',
      /** Callback contract: Schedule short follow-up checks that return focus to the first invalid field after form validation updates. Inputs: None. Side effects: Schedules microtask/frame/timer work and may move keyboard focus. Returns: Nothing. */
      () => {
        let attempts = 0;

        /**
         * Function contract: restoreInvalidFocus
         * Purpose: Move focus to the first field marked invalid after validation and retry briefly while asynchronous validation settles.
         * Inputs: None.
         * Side effects: Queries form state, may move focus, and may schedule another timer.
         * Returns: Nothing.
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
      },
    );
  }

  window.addEventListener('resize', syncLayout, { passive: true });
  window.addEventListener('orientationchange', syncLayout, { passive: true });
  window.addEventListener('pageshow', syncLayout, { passive: true });

  if (document.fonts?.ready) {
    document.fonts.ready.then(syncLayout).catch(
      /** Callback contract: Ignore font-readiness rejection because normal resize/page lifecycle hooks still keep layout usable. Inputs: None. Side effects: None. Returns: Nothing. */
      () => {},
    );
  }

  syncLayout();
})();
