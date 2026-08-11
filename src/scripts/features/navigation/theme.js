/**
 * @fileoverview src/scripts/features/navigation/theme.js
 * Purpose: Implement theme behavior inside the navigation browser-runtime domain.
 * Responsibilities:
 * - Own the navigation behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { $, $$ } from '../../shared/dom.js';

const PORTRAIT_IMG = '/assets/images/portrait.png';
const FALLBACK_PORTRAIT_IMG = '/assets/images/portrait.svg';
const SESSION_THEME_KEY = 'nrs-theme-override';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 109 9 7 7 0 01-9-9z"/></svg>';


/**
 * Function contract: systemTheme
 * Purpose: Implement the system theme responsibility owned by the theme browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}


/**
 * Function contract: sessionTheme
 * Purpose: Implement the session theme responsibility owned by the theme browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function sessionTheme() {
  try {
    const value = window.sessionStorage?.getItem(SESSION_THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}


/**
 * Function contract: saveSessionTheme
 * Purpose: Implement the save session theme responsibility owned by the theme browser feature.
 * Inputs: `theme`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function saveSessionTheme(theme) {
  try {
    window.sessionStorage?.setItem(SESSION_THEME_KEY, theme);
    window.localStorage?.removeItem('theme');
  } catch {
    // Theme still works when storage is blocked.
  }
}


/**
 * Function contract: updatePortraitImages
 * Purpose: Apply portrait images consistently while preserving the surrounding theme browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updatePortraitImages() {
  $$('.hero-portrait-img, .footer-portrait-img, .profile-img').forEach( /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `image` Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ (image) => {
    if (image.dataset.localPortraitReady === 'true') return;

    image.dataset.localPortraitReady = 'true';
    image.src = PORTRAIT_IMG;
    image.decoding = 'async';
    image.onerror =  /** Callback contract: Perform the local callback step required by the immediately enclosing theme browser feature operation. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; the function exists for the documented side effects, validation, or orchestration. */ () => {
      image.onerror = null;
      image.src = FALLBACK_PORTRAIT_IMG;
    };
  });
}


/**
 * Function contract: updateThemeButton
 * Purpose: Apply theme button consistently while preserving the surrounding theme browser feature contract.
 * Inputs: `button`, `theme`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateThemeButton(button, theme) {
  if (!button) return;
  button.innerHTML = theme === 'light' ? moonIcon : sunIcon;
  button.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  button.setAttribute('aria-pressed', String(theme === 'dark'));
  button.setAttribute('title', `Current theme: ${theme}`);
}



/**
 * Function contract: applyTheme
 * Purpose: Apply theme consistently while preserving the surrounding theme browser feature contract.
 * Inputs: `theme`, `button`, `source`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function applyTheme(theme, button, source = 'system') {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  document.documentElement.style.colorScheme = nextTheme;
  document.documentElement.dataset.themeSource = source;
  updateThemeButton(button, nextTheme);
  updatePortraitImages();
  window.dispatchEvent(new CustomEvent('nrs:themechange', { detail: { theme: nextTheme, source } }));
}



/**
 * Function contract: initTheme
 * Purpose: Initialize theme for the theme browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: registers or removes browser listeners; reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function initTheme() {
  const button = $('#theme-toggle');
  const mediaQuery = window.matchMedia?.('(prefers-color-scheme: light)');
  const override = sessionTheme();

  try {
    window.localStorage?.removeItem('theme');
  } catch {
    // Ignore blocked storage.
  }

  applyTheme(override || systemTheme(), button, override ? 'session' : 'system');

  button?.addEventListener('click',    /** Callback contract: Handle the click event for `button` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || systemTheme();
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    saveSessionTheme(nextTheme);
    applyTheme(nextTheme, button, 'session');
  });

  mediaQuery?.addEventListener?.('change',    /** Callback contract: Handle the change event for `mediaQuery` and apply the related local state update. Inputs: None; derives required state from its enclosing module/runtime context. Side effects: No direct external side effect beyond invoked dependencies. Returns: Undefined; this callback is side-effect-only. */ () => {
    if (!sessionTheme()) applyTheme(systemTheme(), button, 'system');
  });
}