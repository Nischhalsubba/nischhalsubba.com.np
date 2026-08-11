/**
 * @fileoverview src/scripts/entrypoints/main.js
 * Purpose: Bootstrap the standard browser runtime, select route-appropriate feature modules, and initialize them after DOM readiness.
 * Responsibilities:
 * - Orchestrate feature loading and initialization order without absorbing feature-domain implementation details.
 * - Keep route checks and lazy imports explicit so optional code runs only where it is needed.
 * - Isolate one feature failure from unrelated features while still surfacing diagnostics.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/scripts/features/navigation/mobile-menu.js
 * - src/scripts/features/navigation/theme.js
 * - src/scripts/features/accessibility/audit-remediations.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { onReady } from '../shared/dom.js';
import { initMobileMenu } from '../features/navigation/mobile-menu.js';

/*
 * Behaviour only. Visual styling is owned by /style.css so every route uses
 * the same container, typography, spacing, and component rules.
 */
const globalFeatures = [
  ['theme', /** Callback contract: Lazy-load the theme module and resolve its `initTheme` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/navigation/theme.js').then(/** Callback contract: Select the `initTheme` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `initTheme` value. */ (module) => module.initTheme)],
  ['audit remediations', /** Callback contract: Lazy-load the audit remediations module and resolve its `applyAuditRemediations` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/accessibility/audit-remediations.js').then(/** Callback contract: Select the `applyAuditRemediations` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `applyAuditRemediations` value. */ (module) => module.applyAuditRemediations)],
  ['design-system shell', /** Callback contract: Lazy-load the nav consistency module and resolve its `enforceDesignSystemShell` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/navigation/nav-consistency.js').then(/** Callback contract: Select the `enforceDesignSystemShell` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `enforceDesignSystemShell` value. */ (module) => module.enforceDesignSystemShell)],
  ['layout integrity', /** Callback contract: Lazy-load the layout integrity module and resolve its `applyLayoutIntegrity` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/layout/layout-integrity.js').then(/** Callback contract: Select the `applyLayoutIntegrity` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `applyLayoutIntegrity` value. */ (module) => module.applyLayoutIntegrity)],
  ['active navigation', /** Callback contract: Lazy-load the navigation module and resolve its `initActiveNavigation` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/navigation/navigation.js').then(/** Callback contract: Select the `initActiveNavigation` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `initActiveNavigation` value. */ (module) => module.initActiveNavigation)],
  ['resume download', /** Callback contract: Lazy-load the resume module and resolve its `initResumeDownload` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/navigation/resume.js').then(/** Callback contract: Select the `initResumeDownload` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `initResumeDownload` value. */ (module) => module.initResumeDownload)],
  ['analytics events', /** Callback contract: Lazy-load the analytics events module and resolve its `initAnalyticsEvents` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/analytics/analytics-events.js').then(/** Callback contract: Select the `initAnalyticsEvents` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `initAnalyticsEvents` value. */ (module) => module.initAnalyticsEvents)],
  ['experience system', /** Callback contract: Lazy-load the experience system module and resolve its `initExperienceSystem` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/system/experience-system.js').then(/** Callback contract: Select the `initExperienceSystem` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `initExperienceSystem` value. */ (module) => module.initExperienceSystem)],
];

const projectDetailFeatures = [
  ['case study layout fixes', /** Callback contract: Lazy-load the case study layout fixes module and resolve its `improveCaseStudySections` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/layout/case-study-layout-fixes.js').then(/** Callback contract: Select the `improveCaseStudySections` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `improveCaseStudySections` value. */ (module) => module.improveCaseStudySections)],
  ['article layout', /** Callback contract: Lazy-load the article layout module and resolve its `normalizeArticleLayout` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/content/article-layout.js').then(/** Callback contract: Select the `normalizeArticleLayout` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `normalizeArticleLayout` value. */ (module) => module.normalizeArticleLayout)],
  ['project imagery', /** Callback contract: Lazy-load the project images module and resolve its `useProjectDetailImages` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/portfolio/project-images.js').then(/** Callback contract: Select the `useProjectDetailImages` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `useProjectDetailImages` value. */ (module) => module.useProjectDetailImages)],
  ['microcopy polish', /** Callback contract: Lazy-load the microcopy polish module and resolve its `polishMicrocopy` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/content/microcopy-polish.js').then(/** Callback contract: Select the `polishMicrocopy` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `polishMicrocopy` value. */ (module) => module.polishMicrocopy)],
  ['case-study polish', /** Callback contract: Lazy-load the portfolio case studies module and resolve its `polishPortfolioCaseStudies` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/portfolio/portfolio-case-studies.js').then(/** Callback contract: Select the `polishPortfolioCaseStudies` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `polishPortfolioCaseStudies` value. */ (module) => module.polishPortfolioCaseStudies)],
  ['case-study coverage', /** Callback contract: Lazy-load the portfolio case study coverage module and resolve its `addRemainingCaseStudyCoverage` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/portfolio/portfolio-case-study-coverage.js').then(/** Callback contract: Select the `addRemainingCaseStudyCoverage` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `addRemainingCaseStudyCoverage` value. */ (module) => module.addRemainingCaseStudyCoverage)],
];

const blogFeatures = [
  ['article layout', /** Callback contract: Lazy-load the article layout module and resolve its `normalizeArticleLayout` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/content/article-layout.js').then(/** Callback contract: Select the `normalizeArticleLayout` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `normalizeArticleLayout` value. */ (module) => module.normalizeArticleLayout)],
  ['blog visuals', /** Callback contract: Lazy-load the blog visuals module and resolve its `ensureBlogGeneratedVisuals` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/content/blog-visuals.js').then(/** Callback contract: Select the `ensureBlogGeneratedVisuals` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `ensureBlogGeneratedVisuals` value. */ (module) => module.ensureBlogGeneratedVisuals)],
];

const contactFeatures = [
  ['contact form', /** Callback contract: Lazy-load the contact form module and resolve its `initContactForm` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/forms/contact-form.js').then(/** Callback contract: Select the `initContactForm` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `initContactForm` value. */ (module) => module.initContactForm)],
];

const projectsIndexFeatures = [
  ['filters', /** Callback contract: Lazy-load the filters module and resolve its `initFilters` initializer. Inputs: none. Side effects: dynamically imports code. Returns: boolean predicate result. */ () => import('../features/content/filters.js').then(/** Callback contract: Select the `initFilters` export/value from the resolved `module`. Inputs: `module`. Side effects: no direct external side effect beyond invoked dependencies. Returns: the selected `initFilters` value. */ (module) => module.initFilters)],
];

/**
 * Function contract: pageSpecificFeatures
 * Purpose: Choose the lazy feature-definition list that applies to the current canonical route.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Array containing the values selected or transformed by this function.
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
 * Purpose: Load feature initializers in parallel, isolate individual load failures, then execute each successfully resolved initializer.
 * Inputs: `definitions`: feature label/loader definitions to resolve and execute
 * Side effects: emits diagnostics or changes process failure state.
 * Returns: Promise that resolves when the asynchronous side effects complete.
 */
async function loadAndRunFeatures(definitions) {
  const loaded = await Promise.all(definitions.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[name, load]`. Side effects: emits diagnostics or changes process failure state. Returns: Promise resolving to the callback result. */ async ([name, load]) => {
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

onReady(/** Callback contract: Processes the callback step for on ready without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Start the main runtime entrypoint after DOM readiness so required elements exist before initialization. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Promise that resolves when the asynchronous side effects complete. */ /** Callback contract: Start the main module after DOM readiness so required elements exist before initialization. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: Promise resolving after the callback side effects complete. */ async () => {
  initMobileMenu();
  await loadAndRunFeatures(globalFeatures);
  await loadAndRunFeatures(pageSpecificFeatures());
});
