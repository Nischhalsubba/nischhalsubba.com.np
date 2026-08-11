/**
 * @fileoverview src/scripts/entrypoints/main.js
 * Purpose: Bootstraps the standard browser runtime and loads global/page-specific feature modules in a controlled order.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - scripts/repository/apply-deep-organization.cjs
 * - scripts/repository/generate-file-catalog.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { onReady } from '../shared/dom.js';
import { initMobileMenu } from '../features/navigation/mobile-menu.js';

/*
 * Behaviour only. Visual styling is owned by /style.css so every route uses
 * the same container, typography, spacing, and component rules.
 */
const globalFeatures = [
  ['theme', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/navigation/theme.js').then(/** Callback contract: Processes the callback step for import('../features/navigation/theme.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.initTheme)],
  ['audit remediations', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/accessibility/audit-remediations.js').then(/** Callback contract: Processes the callback step for import('../features/accessibility/audit remediations.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.applyAuditRemediations)],
  ['design-system shell', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/navigation/nav-consistency.js').then(/** Callback contract: Processes the callback step for import('../features/navigation/nav consistency.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.enforceDesignSystemShell)],
  ['layout integrity', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/layout/layout-integrity.js').then(/** Callback contract: Processes the callback step for import('../features/layout/layout integrity.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.applyLayoutIntegrity)],
  ['active navigation', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/navigation/navigation.js').then(/** Callback contract: Processes the callback step for import('../features/navigation/navigation.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.initActiveNavigation)],
  ['resume download', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/navigation/resume.js').then(/** Callback contract: Processes the callback step for import('../features/navigation/resume.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.initResumeDownload)],
  ['analytics events', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/analytics/analytics-events.js').then(/** Callback contract: Processes the callback step for import('../features/analytics/analytics events.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.initAnalyticsEvents)],
  ['experience system', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/system/experience-system.js').then(/** Callback contract: Processes the callback step for import('../features/system/experience system.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.initExperienceSystem)],
];

const projectDetailFeatures = [
  ['case study layout fixes', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/layout/case-study-layout-fixes.js').then(/** Callback contract: Processes the callback step for import('../features/layout/case study layout fixes.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.improveCaseStudySections)],
  ['article layout', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/content/article-layout.js').then(/** Callback contract: Processes the callback step for import('../features/content/article layout.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.normalizeArticleLayout)],
  ['project imagery', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/portfolio/project-images.js').then(/** Callback contract: Processes the callback step for import('../features/portfolio/project images.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.useProjectDetailImages)],
  ['microcopy polish', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/content/microcopy-polish.js').then(/** Callback contract: Processes the callback step for import('../features/content/microcopy polish.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.polishMicrocopy)],
  ['case-study polish', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/portfolio/portfolio-case-studies.js').then(/** Callback contract: Processes the callback step for import('../features/portfolio/portfolio case studies.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.polishPortfolioCaseStudies)],
  ['case-study coverage', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/portfolio/portfolio-case-study-coverage.js').then(/** Callback contract: Processes the callback step for import('../features/portfolio/portfolio case study coverage.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.addRemainingCaseStudyCoverage)],
];

const blogFeatures = [
  ['article layout', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/content/article-layout.js').then(/** Callback contract: Processes the callback step for import('../features/content/article layout.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.normalizeArticleLayout)],
  ['blog visuals', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/content/blog-visuals.js').then(/** Callback contract: Processes the callback step for import('../features/content/blog visuals.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.ensureBlogGeneratedVisuals)],
];

const contactFeatures = [
  ['contact form', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/forms/contact-form.js').then(/** Callback contract: Processes the callback step for import('../features/forms/contact form.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.initContactForm)],
];

const projectsIndexFeatures = [
  ['filters', /** Callback contract: Processes the callback step for anonymous without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => import('../features/content/filters.js').then(/** Callback contract: Processes the callback step for import('../features/content/filters.js') without leaking orchestration details to the caller. Inputs: module. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (module) => module.initFilters)],
];

/**
 * Function contract: pageSpecificFeatures
 * Purpose: Implements the page specific features responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function pageSpecificFeatures() {
  const currentPath = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

  if (currentPath === '/contact') return contactFeatures;
  if (currentPath === '/projects') return projectsIndexFeatures;
  if (currentPath.startsWith('/project-')) return projectDetailFeatures;
  if (currentPath === '/blog' || currentPath.startsWith('/blog/')) return blogFeatures;
  return [];
}

/**
 * Function contract: loadAndRunFeatures
 * Purpose: Retrieves load and run features and returns it in the form expected by its caller.
 * Inputs: definitions.
 * Side effects: may emit diagnostics or inspect process state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
async function loadAndRunFeatures(definitions) {
  const loaded = await Promise.all(definitions.map(/** Callback contract: Processes the callback step for definitions without leaking orchestration details to the caller. Inputs: [name, load]. Side effects: may emit diagnostics or inspect process state. Returns a value to the invoking API. */ async ([name, load]) => {
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

onReady(/** Callback contract: Processes the callback step for on ready without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ async () => {
  initMobileMenu();
  await loadAndRunFeatures(globalFeatures);
  await loadAndRunFeatures(pageSpecificFeatures());
});
