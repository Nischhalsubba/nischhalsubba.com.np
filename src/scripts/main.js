import { onReady } from './utils/dom.js';
import { injectGlobalStyles } from './features/global-styles.js';
import { polishSiteConsistency } from './features/site-consistency.js';
import { enforceDesignSystemShell } from './features/nav-consistency.js';
import { applyLayoutSystemUniformity } from './features/layout-system-uniformity.js';
import { applyViewportResponsivePolish } from './features/viewport-responsive-polish.js';
import { normalizeArticleLayout } from './features/article-layout.js';
import { ensureBlogGeneratedVisuals } from './features/blog-visuals.js';
import { polishContactPage } from './features/contact-page-polish.js';
import { initActiveNavigation } from './features/navigation.js';
import { initContactForm } from './features/contact-form.js';
import { initFilters } from './features/filters.js';
import { lockLightThemePalette } from './features/light-palette-lock.js';
import { polishListSpacing } from './features/list-spacing.js';
import { initMobileMenu } from './features/mobile-menu.js';
import { polishMicrocopy } from './features/microcopy-polish.js';
import { polishPortfolioCaseStudies } from './features/portfolio-case-studies.js';
import { addRemainingCaseStudyCoverage } from './features/portfolio-case-study-coverage.js';
import { initPageExperience } from './features/page-experience.js';
import { initPageTransitions } from './features/page-transitions.js';
import { initProfessionalMotionSystem } from './features/motion-system.js';
import { useProjectDetailImages } from './features/project-images.js';
import { initResumeDownload } from './features/resume.js';
import { ensureSiteFooter } from './features/site-footer.js';
import { initTheme } from './features/theme.js';
import { resolveUiAuditIssues } from './features/ui-audit-resolutions.js';
import { applyDesignSystemStandards } from './features/design-system-standards.js';
import { applyAboutContactStandards } from './features/about-contact-standards.js';
import { applyFinalSpacingNavProof } from './features/final-spacing-nav-proof.js';
import { proveMobileHeaderIcon } from './features/mobile-header-icon-proof.js';
import { initAnalyticsEvents } from './features/analytics-events.js';
import { applyAuditRemediations } from './features/audit-remediations.js';

/**
 * Run each feature independently so one legacy page-specific failure cannot
 * prevent navigation, theme, contact or accessibility features from starting.
 */
function runFeature(name, feature) {
  try {
    feature();
  } catch (error) {
    console.error(`[portfolio] ${name} failed`, error);
  }
}

/**
 * Site runtime entrypoint.
 *
 * Stable layout, spacing and typography now live in authored CSS. Runtime
 * modules are reserved for actual behavior and legacy compatibility work.
 */
onReady(() => {
  const features = [
    ['global styles', injectGlobalStyles],
    ['theme', initTheme],
    ['site consistency', polishSiteConsistency],
    ['design-system shell', enforceDesignSystemShell],
    ['layout uniformity', applyLayoutSystemUniformity],
    ['responsive polish', applyViewportResponsivePolish],
    ['article layout', normalizeArticleLayout],
    ['blog visuals', ensureBlogGeneratedVisuals],
    ['project imagery', useProjectDetailImages],
    ['list spacing', polishListSpacing],
    ['contact page polish', polishContactPage],
    ['microcopy polish', polishMicrocopy],
    ['case-study polish', polishPortfolioCaseStudies],
    ['case-study coverage', addRemainingCaseStudyCoverage],
    ['page experience', initPageExperience],
    ['page transitions', initPageTransitions],
    ['mobile menu', initMobileMenu],
    ['active navigation', initActiveNavigation],
    ['filters', initFilters],
    ['motion system', initProfessionalMotionSystem],
    ['resume download', initResumeDownload],
    ['contact form', initContactForm],
    ['analytics events', initAnalyticsEvents],
    ['site footer', ensureSiteFooter],
    ['light palette', lockLightThemePalette],
    ['UI audit resolutions', resolveUiAuditIssues],
    ['design-system standards', applyDesignSystemStandards],
    ['about/contact standards', applyAboutContactStandards],
    ['spacing and navigation proof', applyFinalSpacingNavProof],
    ['mobile header icon', proveMobileHeaderIcon],
    ['audit remediations', applyAuditRemediations],
  ];

  features.forEach(([name, feature]) => runFeature(name, feature));
});
