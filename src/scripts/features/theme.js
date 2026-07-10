import { $, $$, getStorage } from '../utils/dom.js';

const PORTRAIT_IMG = '/assets/images/portrait.png';
const FALLBACK_PORTRAIT_IMG = '/assets/images/portrait.svg';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 109 9 7 7 0 01-9-9z"/></svg>';

function systemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function updatePortraitImages() {
  $$('.hero-portrait-img, .footer-portrait-img, .profile-img').forEach((image) => {
    if (image.dataset.localPortraitReady === 'true') return;

    image.dataset.localPortraitReady = 'true';
    image.src = PORTRAIT_IMG;
    image.decoding = 'async';
    image.onerror = () => {
      image.onerror = null;
      image.src = FALLBACK_PORTRAIT_IMG;
    };
  });
}

function updateThemeButton(button, theme) {
  if (!button) return;
  button.innerHTML = theme === 'light' ? moonIcon : sunIcon;
  button.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  button.setAttribute('aria-pressed', String(theme === 'dark'));
  button.setAttribute('title', `Current theme: ${theme}`);
}

function applyTheme(theme, button, source = 'system') {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  document.documentElement.style.colorScheme = nextTheme;
  document.documentElement.dataset.themeSource = source;
  updateThemeButton(button, nextTheme);
  updatePortraitImages();
  window.dispatchEvent(new CustomEvent('nrs:themechange', { detail: { theme: nextTheme, source } }));
}

export function initTheme() {
  const button = $('#theme-toggle');
  const storage = getStorage();
  const savedTheme = storage?.getItem('theme');
  const hasManualTheme = savedTheme === 'light' || savedTheme === 'dark';
  const mediaQuery = window.matchMedia?.('(prefers-color-scheme: light)');

  applyTheme(hasManualTheme ? savedTheme : systemTheme(), button, hasManualTheme ? 'manual' : 'system');

  button?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || systemTheme();
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    storage?.setItem('theme', nextTheme);
    applyTheme(nextTheme, button, 'manual');
  });

  mediaQuery?.addEventListener?.('change', () => {
    const latestSaved = storage?.getItem('theme');
    const latestManual = latestSaved === 'light' || latestSaved === 'dark';
    if (!latestManual) applyTheme(systemTheme(), button, 'system');
  });
}
