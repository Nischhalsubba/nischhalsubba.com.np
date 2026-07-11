import { onReady } from './utils/dom.js';

const globalFeatures = [
  ['theme', () => import('./features/theme.js').then((module) => module.initTheme)],
  ['global styles', () => import('./features/global-styles.js').then((module) => module.injectGlobalStyles)],
  ['site consistency', () => import('./features/site-consistency.js').then((module) => module.polishSiteConsistency)],
  ['design-system shell', () => import('./features/nav-consistency.js').then((module) => module.enforceDesignSystemShell)],
  ['layout uniformity', () => import('./features/layout-system-uniformity.js').then((module) => module.applyLayoutSystemUniformity)],
  ['layout integrity', () => import('./features/layout-integrity.js').then((module) => module.applyLayoutIntegrity)],
  ['responsive polish', () => import('./features/viewport-responsive-polish.js').then((module) => module.applyViewportResponsivePolish)],
  ['page experience', () => import('./features/page-experience.js').then((module) => module.initPageExperience)],
  ['page transitions', () => import('./features/page-transitions.js').then((module) => module.initPageTransitions)],
  ['mobile menu', () => import('./features/mobile-menu.js').then((module) => module.initMobileMenu)],
  ['active navigation', () => import('./features/navigation.js').then((module) => module.initActiveNavigation)],
  ['motion system', () => import('./features/motion-system.js').then((module) => module.initProfessionalMotionSystem)],
  ['resume download', () => import('./features/resume.js').then((module) => module.initResumeDownload)],
  ['analytics events', () => import('./features/analytics-events.js').then((module) => module.initAnalyticsEvents)],
  ['light palette', () => import('./features/light-palette-lock.js').then((module) => module.lockLightThemePalette)],
  ['UI audit resolutions', () => import('./features/ui-audit-resolutions.js').then((module) => module.resolveUiAuditIssues)],
  ['design-system standards', () => import('./features/design-system-standards.js').then((module) => module.applyDesignSystemStandards)],
  ['spacing and navigation proof', () => import('./features/final-spacing-nav-proof.js').then((module) => module.applyFinalSpacingNavProof)],
  ['mobile header icon', () => import('./features/mobile-header-icon-proof.js').then((module) => module.proveMobileHeaderIcon)],
  ['audit remediations', () => import('./features/audit-remediations.js').then((module) => module.applyAuditRemediations)],
  ['experience system', () => import('./features/experience-system.js').then((module) => module.initExperienceSystem)],
  ['interactive grid', () => import('./features/grid-canvas.js').then((module) => module.initGridCanvas)],
  ['interactive cursor', () => import('./features/pointer-glow.js').then((module) => module.initPointerGlow)],
];

const projectDetailFeatures = [
  ['case study layout fixes', () => import('./features/case-study-layout-fixes.js').then((module) => module.improveCaseStudySections)],
  ['article layout', () => import('./features/article-layout.js').then((module) => module.normalizeArticleLayout)],
  ['project imagery', () => import('./features/project-images.js').then((module) => module.useProjectDetailImages)],
  ['list spacing', () => import('./features/list-spacing.js').then((module) => module.polishListSpacing)],
  ['microcopy polish', () => import('./features/microcopy-polish.js').then((module) => module.polishMicrocopy)],
  ['case-study polish', () => import('./features/portfolio-case-studies.js').then((module) => module.polishPortfolioCaseStudies)],
  ['case-study coverage', () => import('./features/portfolio-case-study-coverage.js').then((module) => module.addRemainingCaseStudyCoverage)],
];

const blogFeatures = [
  ['article layout', () => import('./features/article-layout.js').then((module) => module.normalizeArticleLayout)],
  ['blog visuals', () => import('./features/blog-visuals.js').then((module) => module.ensureBlogGeneratedVisuals)],
  ['list spacing', () => import('./features/list-spacing.js').then((module) => module.polishListSpacing)],
];

const contactFeatures = [
  ['contact page polish', () => import('./features/contact-page-polish.js').then((module) => module.polishContactPage)],
  ['contact form', () => import('./features/contact-form.js').then((module) => module.initContactForm)],
  ['about/contact standards', () => import('./features/about-contact-standards.js').then((module) => module.applyAboutContactStandards)],
];

const aboutFeatures = [
  ['about/contact standards', () => import('./features/about-contact-standards.js').then((module) => module.applyAboutContactStandards)],
];

const projectsIndexFeatures = [
  ['filters', () => import('./features/filters.js').then((module) => module.initFilters)],
  ['list spacing', () => import('./features/list-spacing.js').then((module) => module.polishListSpacing)],
];

function pageSpecificFeatures() {
  const path = window.location.pathname.replace(/\.html$/, '');

  if (path === '/contact') return contactFeatures;
  if (path === '/about') return aboutFeatures;
  if (path === '/projects') return projectsIndexFeatures;
  if (path.startsWith('/project-')) return projectDetailFeatures;
  if (path === '/blog' || path.startsWith('/blog/')) return blogFeatures;
  return [];
}

async function loadAndRunFeatures(definitions) {
  const loaded = await Promise.all(definitions.map(async ([name, load]) => {
    try {
      return [name, await load()];
    } catch (error) {
      console.error(`[portfolio] failed to load ${name}`, error);
      return [name, null];
    }
  }));

  for (const [name, feature] of loaded) {
    if (typeof feature !== 'function') continue;
    try {
      feature();
    } catch (error) {
      console.error(`[portfolio] ${name} failed`, error);
    }
  }
}

onReady(async () => {
  await loadAndRunFeatures(globalFeatures);
  await loadAndRunFeatures(pageSpecificFeatures());
});
