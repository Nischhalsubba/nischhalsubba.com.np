/**
 * @fileoverview src/scripts/features/layout/layout-integrity.js
 * Purpose: Implement layout integrity behavior inside the layout browser-runtime domain.
 * Responsibilities:
 * - Own the layout behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const RESPONSIVE_QUERY = '(max-width: 1100px)';
const PHONE_QUERY = '(max-width: 850px)';

const FIRST_SURFACE_SELECTORS = [
  '.hero-section',
  '.nrs-home-hero',
  '.nrs-home-hero-clean',
  '.nrs-about-v2-hero',
  '.nrs-contact-v2-hero',
  '.nrs-services-shell',
  '.nrs-services-hero',
  '.nrs-services-index-hero',
  '.nrs-services-v49',
  '.nrs-services-v49-hero',
  '.nrs-contact-v3-hero',
  '.nrs-contact-redesign-hero',
  '.nrs-page-hero',
  '.nrs-spacious-page',
  '.nrs-blog-hub-shell',
  '.nrs-blog-detail-surface',
  '.nrs-article-frame',
  '.nrs-case-study',
  '.nrs-case-hero',
  'article.section-container',
  'section',
  'article',
];

const MAIN_PROPERTIES = {
  display: 'block',
  'min-height': '0',
  height: 'auto',
  'margin-top': '0',
  'padding-top': '0',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'start',
  'place-content': 'start',
};

const SURFACE_PROPERTIES = {
  display: 'block',
  position: 'relative',
  inset: 'auto',
  top: 'auto',
  'min-height': '0',
  height: 'auto',
  'margin-block-start': '0',
  'margin-top': '0',
  'padding-block-start': 'var(--nrs-runtime-header-clearance)',
  'padding-top': 'var(--nrs-runtime-header-clearance)',
  'padding-bottom': 'var(--nrs-runtime-hero-end)',
  'grid-template-rows': 'none',
  'grid-auto-rows': 'auto',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'start',
  'place-content': 'start',
  'align-self': 'auto',
  'justify-self': 'auto',
  opacity: '1',
  transform: 'none',
};

const ANCESTOR_PROPERTIES = {
  position: 'static',
  inset: 'auto',
  top: 'auto',
  'min-height': '0',
  height: 'auto',
  'margin-block-start': '0',
  'margin-top': '0',
  'padding-block-start': '0',
  'padding-top': '0',
  'grid-template-rows': 'none',
  'grid-auto-rows': 'auto',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'start',
  'place-content': 'start',
  'align-self': 'auto',
  'justify-self': 'auto',
  opacity: '1',
  transform: 'none',
};

const INITIAL_CONTENT_PROPERTIES = {
  'min-height': '0',
  height: 'auto',
  'margin-block-start': '0',
  'margin-top': '0',
  'padding-block-start': '0',
  top: 'auto',
  opacity: '1',
  transform: 'none',
};

const touchedElements = new Set();
const originalInlineStyles = new WeakMap();
let geometryFrame = 0;

/**
 * Function contract: rememberInlineStyle
 * Purpose: Implement the remember inline style responsibility owned by the layout integrity browser feature.
 * Inputs: `element`: DOM element currently being evaluated or updated; `property`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function rememberInlineStyle(element, property) {
  let styles = originalInlineStyles.get(element);
  if (!styles) {
    styles = new Map();
    originalInlineStyles.set(element, styles);
  }
  if (styles.has(property)) return;
  styles.set(property, {
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property),
  });
}

/**
 * Function contract: setImportantStyles
 * Purpose: Synchronize important styles with the requested state while preserving related layout integrity browser feature invariants.
 * Inputs: `element`: DOM element currently being evaluated or updated; `properties`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function setImportantStyles(element, properties) {
  if (!element) return;
  touchedElements.add(element);
  for (const [property, value] of Object.entries(properties)) {
    rememberInlineStyle(element, property);
    element.style.setProperty(property, value, 'important');
  }
}

/**
 * Function contract: restoreInlineStyles
 * Purpose: Apply inline styles consistently while preserving the surrounding layout integrity browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function restoreInlineStyles() {
  for (const element of touchedElements) {
    const styles = originalInlineStyles.get(element);
    if (!styles) continue;
    for (const [property, original] of styles.entries()) {
      if (original.value) element.style.setProperty(property, original.value, original.priority);
      else element.style.removeProperty(property);
    }
  }
  touchedElements.clear();
}

/**
 * Function contract: getFirstSurface
 * Purpose: Return first surface from the supplied inputs or current layout integrity browser feature state.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested first surface; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getFirstSurface(main) {
  if (!main) return null;
  for (const selector of FIRST_SURFACE_SELECTORS) {
    const candidate = main.querySelector(`:scope > ${selector}`);
    if (candidate) return candidate;
  }
  return main.firstElementChild;
}

/**
 * Function contract: getVisibleHeading
 * Purpose: Retrieves get visible heading and returns it in the form expected by its caller.
 * Inputs: surface.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: getVisibleHeading
 * Purpose: Return visible heading from the supplied inputs or current layout integrity browser feature state.
 * Inputs: `surface`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested visible heading; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getVisibleHeading(surface) {
  return [...surface.querySelectorAll('h1, .hero-title')].find(/** Callback contract: Processes the callback step for [...surface.query selector all('h1, .hero title')] without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `element`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `element`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate/result. */ (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }) || null;
}

/**
 * Function contract: getHeadingAncestors
 * Purpose: Retrieves get heading ancestors and returns it in the form expected by its caller.
 * Inputs: heading, surface.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: getHeadingAncestors
 * Purpose: Return heading ancestors from the supplied inputs or current layout integrity browser feature state.
 * Inputs: `heading`: input consumed by this operation; `surface`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested heading ancestors; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getHeadingAncestors(heading, surface) {
  const ancestors = [];
  let current = heading?.parentElement;
  while (current && current !== surface && current.tagName !== 'MAIN') {
    ancestors.push(current);
    current = current.parentElement;
  }
  return ancestors;
}

/**
 * Function contract: getInitialContent
 * Purpose: Retrieves get initial content and returns it in the form expected by its caller.
 * Inputs: surface, heading.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: getInitialContent
 * Purpose: Return initial content from the supplied inputs or current layout integrity browser feature state.
 * Inputs: `surface`: input consumed by this operation; `heading`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested initial content; early-return/empty-state behavior follows the explicit branches in this function.
 */
function getInitialContent(surface, heading) {
  const elements = [surface.firstElementChild, heading];
  const wayfinding = surface.querySelector(
    ':scope > .nrs-wayfinding, :scope > .nrs-detail-breadcrumb, :scope > .nrs-blog-utility, .nrs-wayfinding, .nrs-detail-breadcrumb, .nrs-blog-utility'
  );
  if (wayfinding) elements.push(wayfinding);

  let sibling = heading?.previousElementSibling;
  while (sibling) {
    elements.push(sibling);
    sibling = sibling.previousElementSibling;
  }
  return [...new Set(elements.filter(Boolean))];
}

/**
 * Function contract: applyGeometryFallback
 * Purpose: Applies apply geometry fallback while preserving the surrounding repository/runtime contract.
 * Inputs: surface, heading.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: applyGeometryFallback
 * Purpose: Apply geometry fallback consistently while preserving the surrounding layout integrity browser feature contract.
 * Inputs: `surface`: input consumed by this operation; `heading`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function applyGeometryFallback(surface, heading) {
  window.cancelAnimationFrame(geometryFrame);
  geometryFrame = window.requestAnimationFrame(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so layout/state changes apply in a stable order. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so browser state settles in a predictable order. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
    window.requestAnimationFrame(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so layout/state changes apply in a stable order. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so browser state settles in a predictable order. Inputs: none. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ () => {
      if (!window.matchMedia(RESPONSIVE_QUERY).matches || !heading.isConnected) return;

      const phone = window.matchMedia(PHONE_QUERY).matches;
      const maximumHeadingTop = phone ? 230 : 300;
      const headingTop = heading.getBoundingClientRect().top;
      if (headingTop <= maximumHeadingTop) return;

      // This is a measured safety net, not a guessed selector. It only activates
      // when legacy layout layers still leave the real heading below the fold.
      const correction = Math.ceil(headingTop - maximumHeadingTop);
      setImportantStyles(surface, {
        'margin-block-start': `${-correction}px`,
        'margin-top': `${-correction}px`,
      });
      surface.dataset.nrsHeroGeometryCorrection = String(correction);
    });
  });
}

/**
 * Function contract: applyResponsiveTopSpacingFix
 * Purpose: Applies apply responsive top spacing fix while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: applyResponsiveTopSpacingFix
 * Purpose: Apply responsive top spacing fix consistently while preserving the surrounding layout integrity browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function applyResponsiveTopSpacingFix() {
  const main = document.querySelector('main');
  const surface = getFirstSurface(main);
  if (!main || !surface) return;

  if (!window.matchMedia(RESPONSIVE_QUERY).matches) {
    restoreInlineStyles();
    delete surface.dataset.nrsResponsiveTopSpacingFixed;
    delete surface.dataset.nrsHeroGeometryCorrection;
    return;
  }

  const phone = window.matchMedia(PHONE_QUERY).matches;
  document.documentElement.style.setProperty(
    '--nrs-runtime-header-clearance',
    phone ? 'calc(env(safe-area-inset-top, 0px) + 88px)' : 'calc(env(safe-area-inset-top, 0px) + 100px)'
  );
  document.documentElement.style.setProperty('--nrs-runtime-hero-end', phone ? '44px' : '52px');

  // Clear any prior measured correction before recalculating actual geometry.
  surface.style.setProperty('margin-block-start', '0', 'important');
  surface.style.setProperty('margin-top', '0', 'important');

  const heading = getVisibleHeading(surface);
  setImportantStyles(main, MAIN_PROPERTIES);
  setImportantStyles(surface, SURFACE_PROPERTIES);
  getHeadingAncestors(heading, surface).forEach(/** Callback contract: Processes the callback step for get heading ancestors(heading, surface) without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (element) => setImportantStyles(element, ANCESTOR_PROPERTIES));
  getInitialContent(surface, heading).forEach(/** Callback contract: Processes the callback step for get initial content(surface, heading) without leaking orchestration details to the caller. Inputs: element. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (element) => setImportantStyles(element, INITIAL_CONTENT_PROPERTIES));

  surface.dataset.nrsResponsiveTopSpacingFixed = 'true';
  if (heading) applyGeometryFallback(surface, heading);
}

/**
 * Function contract: applyLayoutIntegrity
 * Purpose: Applies apply layout integrity while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: applyLayoutIntegrity
 * Purpose: Apply layout integrity consistently while preserving the surrounding layout integrity browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function applyLayoutIntegrity() {
  let frame = 0;
  /**
   * Function contract: schedule
   * Purpose: Implements the schedule responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  /**
   * Function contract: schedule
   * Purpose: Implement the schedule responsibility owned by the layout integrity browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(applyResponsiveTopSpacingFix);
  };

  applyResponsiveTopSpacingFix();
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  window.setTimeout(applyResponsiveTopSpacingFix, 250);
  window.setTimeout(applyResponsiveTopSpacingFix, 1000);
  window.setTimeout(applyResponsiveTopSpacingFix, 2000);
}