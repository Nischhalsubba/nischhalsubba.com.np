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
( /** Callback contract: Perform the local callback step required by the immediately enclosing agent browser contract browser feature operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: registers or removes browser listeners; reads or updates DOM/browser state Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ () => {
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
   * Inputs: None; derives required state from its enclosing module/runtime context.
   * Side effects: No direct external side effect beyond invoked dependencies.
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
   */
  const syncHeaderHeight = () => {
    if (!nav) return;
    const height = Math.ceil(nav.getBoundingClientRect().height);
    if (height > 0) documentElement.style.setProperty('--nrs-sticky-nav-height', `${height}px`);
  };

  
  
  /**
   * Function contract: syncLayout
   * Purpose: Synchronize layout with the requested state while preserving related agent browser contract browser feature invariants.
   * Inputs: None; derives required state from its enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
    mobileThemeToggle.addEventListener('click',    /** Callback contract: Handle the click event for `mobileThemeToggle` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ () => {
      desktopThemeToggle.click();
    });
  }

  if (contactForm && contactForm.dataset.focusGuardReady !== 'true') {
    contactForm.dataset.focusGuardReady = 'true';
    contactForm.addEventListener('submit',    /** Callback contract: Handle the submit event for `contactForm` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
      let attempts = 0;
      
      
      /**
       * Function contract: restoreInvalidFocus
       * Purpose: Apply invalid focus consistently while preserving the surrounding agent browser contract browser feature contract.
       * Inputs: None; derives required state from its enclosing module/runtime context.
       * Side effects: reads or updates DOM/browser state
       * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
    document.fonts.ready.then(syncLayout).catch(   /** Callback contract: Convert or report the rejected asynchronous operation according to the surrounding failure-handling policy. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ () => {});
  }

  syncLayout();
})();
