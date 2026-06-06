import { onReady } from './utils/dom.js';
import { injectGlobalStyles } from './features/global-styles.js';
import { normalizeArticleLayout } from './features/article-layout.js';
import { initActiveNavigation } from './features/navigation.js';
import { initContactForm } from './features/contact-form.js';
import { initFilters } from './features/filters.js';
import { initMobileMenu } from './features/mobile-menu.js';
import { initMotionEnhancements } from './features/motion.js';
import { initPointerGlow } from './features/pointer-glow.js';
import { useProjectDetailImages } from './features/project-images.js';
import { initResumeDownload } from './features/resume.js';
import { ensureSiteFooter } from './features/site-footer.js';
import { initTheme } from './features/theme.js';

onReady(() => {
  injectGlobalStyles();
  normalizeArticleLayout();
  useProjectDetailImages();
  initTheme();
  initMobileMenu();
  initActiveNavigation();
  initFilters();
  initMotionEnhancements();
  initPointerGlow();
  initResumeDownload();
  initContactForm();
  ensureSiteFooter();
});
