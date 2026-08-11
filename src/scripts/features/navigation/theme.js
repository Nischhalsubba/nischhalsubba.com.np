/**
 * @fileoverview src/scripts/features/navigation/theme.js
 * Purpose: Browser runtime feature in the navigation domain responsible for theme behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/agent-main.js
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { $, $$ } from '../../shared/dom.js';

const PORTRAIT_IMG = '/assets/images/portrait.png';
const FALLBACK_PORTRAIT_IMG = '/assets/images/portrait.svg';
const SESSION_THEME_KEY = 'nrs-theme-override';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 109 9 7 7 0 01-9-9z"/></svg>';

/**
 * Function contract: systemTheme
 * Purpose: Implements the system theme responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Function contract: sessionTheme
 * Purpose: Implements the session theme responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state; may read or update browser persistence.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the save session theme responsibility for this module.
 * Inputs: theme.
 * Side effects: may read or update browser DOM/state; may read or update browser persistence.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
 * Purpose: Applies update portrait images while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function updatePortraitImages() {
  $$('.hero-portrait-img, .footer-portrait-img, .profile-img').forEach(/** Callback contract: Processes the callback step for $$('.hero portrait img, .footer portrait img, .profile img') without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ (image) => {
    if (image.dataset.localPortraitReady === 'true') return;

    image.dataset.localPortraitReady = 'true';
    image.src = PORTRAIT_IMG;
    image.decoding = 'async';
    image.onerror = /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
      image.onerror = null;
      image.src = FALLBACK_PORTRAIT_IMG;
    };
  });
}

/**
 * Function contract: updateThemeButton
 * Purpose: Applies update theme button while preserving the surrounding repository/runtime contract.
 * Inputs: button, theme.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Applies apply theme while preserving the surrounding repository/runtime contract.
 * Inputs: theme, button, source.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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
 * Purpose: Implements the init theme responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state; may read or update browser persistence.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
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

  button?.addEventListener('click', /** Callback contract: Processes the callback step for button? without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. No explicit return contract. */ () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || systemTheme();
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    saveSessionTheme(nextTheme);
    applyTheme(nextTheme, button, 'session');
  });

  mediaQuery?.addEventListener?.('change', /** Callback contract: Processes the callback step for media query? without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
    if (!sessionTheme()) applyTheme(systemTheme(), button, 'system');
  });
}