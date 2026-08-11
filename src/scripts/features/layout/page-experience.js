/**
 * @fileoverview src/scripts/features/layout/page-experience.js
 * Purpose: Implement page experience behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const PAGE_EXPERIENCE_STYLE_ID = 'nrs-page-experience-style';
const SCROLL_BAR_ID = 'nrs-scroll-progress';

/**
 * Function contract: ensurePageExperienceStyle
 * Purpose: Apply page experience style consistently while preserving the surrounding page experience browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensurePageExperienceStyle() {
  let style = document.getElementById(PAGE_EXPERIENCE_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = PAGE_EXPERIENCE_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    html {
      scroll-behavior: smooth;
    }

    #${SCROLL_BAR_ID} {
      position: fixed !important;
      inset: 0 auto auto 0 !important;
      z-index: 2147483647 !important;
      display: block !important;
      width: 100vw !important;
      height: 6px !important;
      min-height: 6px !important;
      max-height: 6px !important;
      pointer-events: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      background: rgba(255, 255, 255, 0.18) !important;
      transform: none !important;
      translate: none !important;
      scale: none !important;
      rotate: none !important;
      overflow: hidden !important;
      contain: paint !important;
      isolation: isolate !important;
      border: 0 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.10) !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    #${SCROLL_BAR_ID}::before {
      content: '' !important;
      position: absolute !important;
      inset: 0 auto 0 0 !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      transform: scaleX(var(--nrs-scroll-progress-scale, .02)) !important;
      transform-origin: left center !important;
      background: #E0E0E0 !important;
      transition: transform 80ms linear, background-color 180ms ease !important;
      will-change: transform !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    html[data-theme='light'] #${SCROLL_BAR_ID} {
      background: rgba(68, 68, 68, 0.18) !important;
      border-bottom-color: rgba(68, 68, 68, 0.10) !important;
    }

    html[data-theme='light'] #${SCROLL_BAR_ID}::before {
      background: #444444 !important;
    }

    html[data-theme='dark'] #${SCROLL_BAR_ID}::before,
    html:not([data-theme='light']) #${SCROLL_BAR_ID}::before {
      background: #E0E0E0 !important;
    }

    body {
      opacity: 1;
      transform: none !important;
    }

    body.nrs-page-visible {
      opacity: 1;
      transform: none !important;
    }

    body.nrs-page-exiting {
      opacity: 0;
      transform: none !important;
      transition: opacity 180ms ease;
    }

    @media (max-width: 760px) {
      #${SCROLL_BAR_ID} {
        height: 5px !important;
        min-height: 5px !important;
        max-height: 5px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      body,
      body.nrs-page-visible,
      body.nrs-page-exiting {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }

      #${SCROLL_BAR_ID},
      #${SCROLL_BAR_ID}::before {
        transition: none !important;
      }
    }
  `;
}

/**
 * Function contract: forceProgressBarStyles
 * Purpose: Implements the force progress bar styles responsibility for this module.
 * Inputs: bar.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: forceProgressBarStyles
 * Purpose: Implement the force progress bar styles responsibility owned by the page experience browser feature.
 * Inputs: `bar`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function forceProgressBarStyles(bar) {
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0px',
    left: '0px',
    right: 'auto',
    bottom: 'auto',
    zIndex: '2147483647',
    display: 'block',
    width: '100vw',
    height: isMobile ? '5px' : '6px',
    minHeight: isMobile ? '5px' : '6px',
    maxHeight: isMobile ? '5px' : '6px',
    pointerEvents: 'none',
    opacity: '1',
    visibility: 'visible',
    transform: 'none',
    overflow: 'hidden',
    borderRadius: '0',
    border: '0',
    background: document.documentElement.dataset.theme === 'light'
      ? 'rgba(68, 68, 68, 0.18)'
      : 'rgba(255, 255, 255, 0.18)',
  });
}

/**
 * Function contract: ensureScrollProgressBar
 * Purpose: Applies ensure scroll progress bar while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: ensureScrollProgressBar
 * Purpose: Apply scroll progress bar consistently while preserving the surrounding page experience browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function ensureScrollProgressBar() {
  let bar = document.getElementById(SCROLL_BAR_ID);
  if (!bar) {
    bar = document.createElement('div');
    bar.id = SCROLL_BAR_ID;
    bar.setAttribute('aria-hidden', 'true');
  }

  if (bar.parentElement !== document.documentElement) {
    document.documentElement.prepend(bar);
  }

  forceProgressBarStyles(bar);
  return bar;
}

/**
 * Function contract: updateScrollProgress
 * Purpose: Applies update scroll progress while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: updateScrollProgress
 * Purpose: Apply scroll progress consistently while preserving the surrounding page experience browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function updateScrollProgress() {
  ensurePageExperienceStyle();
  const bar = ensureScrollProgressBar();
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0.02, window.scrollY / scrollable)) : 1;
  document.documentElement.style.setProperty('--nrs-scroll-progress-scale', String(progress));
  forceProgressBarStyles(bar);
}

/**
 * Function contract: initPageTransitions
 * Purpose: Implements the init page transitions responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: initPageTransitions
 * Purpose: Initialize page transitions for the page experience browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function initPageTransitions() {
  requestAnimationFrame(/** Callback contract: Processes the callback step for request animation frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so layout/state changes apply in a stable order. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so browser state settles in a predictable order. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ () => document.body.classList.add('nrs-page-visible'));

  document.addEventListener('click', /** Callback contract: Processes the callback step for document without leaking orchestration details to the caller. Inputs: event. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Handle the click event for `document` and apply this module's related state update. Inputs: `event`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the click event for `document` and apply the related local state update. Inputs: `event`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const isSameOrigin = url.origin === window.location.origin;
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    const shouldSkip =
      !isSameOrigin ||
      isModifiedClick ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      link.href.startsWith('mailto:') ||
      link.href.startsWith('tel:') ||
      url.href === window.location.href ||
      url.pathname === window.location.pathname && url.hash;

    if (shouldSkip) return;

    event.preventDefault();
    document.body.classList.add('nrs-page-exiting');
    window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing page experience browser feature operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
      window.location.href = url.href;
    }, 160);
  });
}

/**
 * Function contract: keepProgressBarAlive
 * Purpose: Implements the keep progress bar alive responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: keepProgressBarAlive
 * Purpose: Implement the keep progress bar alive responsibility owned by the page experience browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function keepProgressBarAlive() {
  const observer = new MutationObserver(/** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing page experience browser feature operation. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
    updateScrollProgress();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: false,
    attributes: true,
    attributeFilter: ['data-theme', 'style', 'class'],
  });

  window.setInterval(updateScrollProgress, 1000);
}

/**
 * Function contract: initPageExperience
 * Purpose: Implements the init page experience responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: initPageExperience
 * Purpose: Initialize page experience for the page experience browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initPageExperience() {
  ensurePageExperienceStyle();
  ensureScrollProgressBar();
  updateScrollProgress();
  initPageTransitions();
  keepProgressBarAlive();

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  window.addEventListener('visibilitychange', updateScrollProgress);
  window.addEventListener('pageshow', /** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Handle the pageshow event for `window` and apply this module's related state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Handle the pageshow event for `window` and apply the related local state update. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
    document.body.classList.remove('nrs-page-exiting');
    document.body.classList.add('nrs-page-visible');
    updateScrollProgress();
  });

  requestAnimationFrame(updateScrollProgress);
  window.setTimeout(updateScrollProgress, 250);
  window.setTimeout(updateScrollProgress, 1000);
}
