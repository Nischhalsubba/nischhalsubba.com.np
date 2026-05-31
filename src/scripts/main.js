import { onReady } from './utils/dom.js';
import { injectGlobalStyles } from './features/global-styles.js';
import { normalizeArticleLayout } from './features/article-layout.js';
import { initActiveNavigation } from './features/navigation.js';
import { initAtelierPages } from './features/atelier-pages.js';
import { initContactForm } from './features/contact-form.js';
import { initCustomCursor } from './features/custom-cursor.js';
import { initFilters } from './features/filters.js';
import { initMobileMenu } from './features/mobile-menu.js';
import { initMotionEnhancements } from './features/motion.js';
import { useProjectDetailImages } from './features/project-images.js';
import { initResumeDownload } from './features/resume.js';
import { ensureSiteFooter } from './features/site-footer.js';

onReady(() => {
  injectGlobalStyles();
  normalizeArticleLayout();
  initAtelierPages();
  useProjectDetailImages();
  initMobileMenu();
  initActiveNavigation();
  initFilters();
  initMotionEnhancements();
  initResumeDownload();
  initContactForm();
  initCustomCursor();
  ensureSiteFooter();
});
