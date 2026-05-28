import { onReady } from './utils/dom.js';
import { injectGlobalStyles } from './features/global-styles.js';
import { initActiveNavigation } from './features/navigation.js';
import { initContactForm } from './features/contact-form.js';
import { initFilters } from './features/filters.js';
import { initGridCanvas } from './features/grid-canvas.js';
import { initMobileMenu } from './features/mobile-menu.js';
import { initPageTransitions } from './features/page-transitions.js';
import { initResumeDownload } from './features/resume.js';
import { initShareButtons } from './features/share.js';
import { initTheme } from './features/theme.js';

onReady(() => {
  injectGlobalStyles();
  initTheme();
  initMobileMenu();
  initGridCanvas();
  initActiveNavigation();
  initFilters();
  initPageTransitions();
  initResumeDownload();
  initShareButtons();
  initContactForm();
});
