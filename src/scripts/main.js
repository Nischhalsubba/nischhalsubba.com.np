import { onReady } from './utils/dom.js';

/*
 * Behaviour only. Visual styling is owned by /style.css so every route uses
 * the same container, typography, spacing, and component rules.
 */
const globalFeatures = [
  ['theme', () => import('./features/theme.js').then((module) => module.initTheme)],
  ['audit remediations', () => import('./features/audit-remediations.js').then((module) => module.applyAuditRemediations)],
  ['design-system shell', () => import('./features/nav-consistency.js').then((module) => module.enforceDesignSystemShell)],
  ['layout integrity', () => import('./features/layout-integrity.js').then((module) => module.applyLayoutIntegrity)],
  ['mobile menu', () => import('./features/mobile-menu.js').then((module) => module.initMobileMenu)],
  ['active navigation', () => import('./features/navigation.js').then((module) => module.initActiveNavigation)],
  ['resume download', () => import('./features/resume.js').then((module) => module.initResumeDownload)],
  ['analytics events', () => import('./features/analytics-events.js').then((module) => module.initAnalyticsEvents)],
  ['experience system', () => import('./features/experience-system.js').then((module) => module.initExperienceSystem)],
];

const projectDetailFeatures = [
  ['case study layout fixes', () => import('./features/case-study-layout-fixes.js').then((module) => module.improveCaseStudySections)],
  ['article layout', () => import('./features/article-layout.js').then((module) => module.normalizeArticleLayout)],
  ['project imagery', () => import('./features/project-images.js').then((module) => module.useProjectDetailImages)],
  ['microcopy polish', () => import('./features/microcopy-polish.js').then((module) => module.polishMicrocopy)],
  ['case-study polish', () => import('./features/portfolio-case-studies.js').then((module) => module.polishPortfolioCaseStudies)],
  ['case-study coverage', () => import('./features/portfolio-case-study-coverage.js').then((module) => module.addRemainingCaseStudyCoverage)],
];

const blogFeatures = [
  ['article layout', () => import('./features/article-layout.js').then((module) => module.normalizeArticleLayout)],
  ['blog visuals', () => import('./features/blog-visuals.js').then((module) => module.ensureBlogGeneratedVisuals)],
];

const contactFeatures = [
  ['contact form', () => import('./features/contact-form.js').then((module) => module.initContactForm)],
];

const projectsIndexFeatures = [
  ['filters', () => import('./features/filters.js').then((module) => module.initFilters)],
];

function pageSpecificFeatures() {
  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

  if (path === '/contact') return contactFeatures;
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
