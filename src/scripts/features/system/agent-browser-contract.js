/**
 * @fileoverview src/scripts/features/system/agent-browser-contract.js
 * Purpose: Implement agent browser contract behavior inside the system browser-runtime domain.
 * Responsibilities:
 * - Own the system behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
(/** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: registers or removes browser listeners; reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
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
   * Purpose: Synchronize header height with the requested state while preserving related agent browser contract browser feature invariants.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
  /**
   * Function contract: syncLayout
   * Purpose: Synchronize layout with the requested state while preserving related agent browser contract browser feature invariants.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
    mobileThemeToggle.addEventListener('click', /** Callback contract: Processes the callback step for mobile theme toggle without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Handle the click event for `mobileThemeToggle` and apply this module's related state update. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the click event for `mobileThemeToggle` and apply the related local state update. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
      desktopThemeToggle.click();
    });
  }

  if (contactForm && contactForm.dataset.focusGuardReady !== 'true') {
    contactForm.dataset.focusGuardReady = 'true';
    contactForm.addEventListener('submit', /** Callback contract: Processes the callback step for contact form without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Handle the submit event for `contactForm` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the submit event for `contactForm` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
      let attempts = 0;
      /**
       * Function contract: restoreInvalidFocus
       * Purpose: Implements the restore invalid focus responsibility for this module.
       * Inputs: none; the function derives state from its enclosing module/runtime context.
       * Side effects: may read or update browser DOM/state.
       * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
       */
      /**
       * Function contract: restoreInvalidFocus
       * Purpose: Apply invalid focus consistently while preserving the surrounding agent browser contract browser feature contract.
       * Inputs: None; derives required state from the enclosing module/runtime context.
       * Side effects: reads or updates DOM/browser state.
       * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
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
    document.fonts.ready.then(syncLayout).catch(/** Callback contract: Processes the callback step for document.fonts.ready.then(sync layout) without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Convert or report the rejected asynchronous operation according to this module’s failure-handling policy. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {});
  }

  syncLayout();
})();
