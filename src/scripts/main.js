import { onReady } from './utils/dom.js';
import { injectGlobalStyles } from './features/global-styles.js';
import { stabilizeLayout } from './features/layout-rescue.js';
import { polishSiteConsistency } from './features/site-consistency.js';
import { applyViewportResponsivePolish } from './features/viewport-responsive-polish.js';
import { normalizeArticleLayout } from './features/article-layout.js';
import { polishContactPage } from './features/contact-page-polish.js';
import { initActiveNavigation } from './features/navigation.js';
import { initContactForm } from './features/contact-form.js';
import { initFilters } from './features/filters.js';
import { lockLightThemePalette } from './features/light-palette-lock.js';
import { polishListSpacing } from './features/list-spacing.js';
import { initMobileMenu } from './features/mobile-menu.js';
import { polishMicrocopy } from './features/microcopy-polish.js';
import { initPageExperience } from './features/page-experience.js';
import { initProfessionalMotionSystem } from './features/motion-system.js';
import { useProjectDetailImages } from './features/project-images.js';
import { initResumeDownload } from './features/resume.js';
import { ensureSiteFooter } from './features/site-footer.js';
import { initTheme } from './features/theme.js';

/**
 * Site runtime entrypoint.
 *
 * Root HTML files keep loading `/script.js` for backward compatibility. That
 * file imports this module, which then initializes focused feature modules in a
 * predictable order. Keep new browser behavior in `src/scripts/features/` and
 * wire it here instead of scattering inline scripts across static HTML pages.
 */
onReady(() => {
  // 1. Shared visual/runtime foundations first.
  injectGlobalStyles();
  stabilizeLayout();
  polishSiteConsistency();
  applyViewportResponsivePolish();
  normalizeArticleLayout();
  useProjectDetailImages();
  initTheme();
  polishListSpacing();
  polishContactPage();
  polishMicrocopy();
  initPageExperience();

  // 2. Navigation and page-level interaction.
  initMobileMenu();
  initActiveNavigation();
  initFilters();

  // 3. Progressive enhancements. These should fail silently if unavailable.
  initProfessionalMotionSystem();
  initResumeDownload();
  initContactForm();

  // 4. Ensure older/static pages still have a consistent footer.
  ensureSiteFooter();

  // 5. Final palette guard so older runtime styles cannot reintroduce blue in light mode.
  lockLightThemePalette();
});
