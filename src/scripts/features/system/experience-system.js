/**
 * @fileoverview src/scripts/features/system/experience-system.js
 * Purpose: Implement experience system behavior inside the system browser-runtime domain.
 * Responsibilities:
 * - Own the system behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const ROUTE_LABELS = new Map([
  ['/', 'Home'],
  ['/projects', 'Work'],
  ['/services', 'Services'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/blog', 'Writing'],
  ['/privacy', 'Privacy'],
]);

/**
 * Function contract: canonicalPath
 * Purpose: Implement the canonical path responsibility owned by the experience system browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function canonicalPath() {
  const path = window.location.pathname || '/';
  if (path === '/') return '/';
  return path.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
}

/**
 * Function contract: pageTitle
 * Purpose: Implement the page title responsibility owned by the experience system browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function pageTitle() {
  const heading = document.querySelector('main h1, main .hero-title');
  const text = heading?.textContent?.trim();
  if (text) return text;
  return document.title.split('|')[0].trim() || 'Page';
}

/**
 * Function contract: routeContext
 * Purpose: Implement the route context responsibility owned by the experience system browser feature.
 * Inputs: `path`: path identifying the resource being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function routeContext(path) {
  if (/^\/project-[^/]+$/.test(path)) return { parentHref: '/projects', parentLabel: 'Work', backLabel: 'Back to work', showBack: true };
  if (path.startsWith('/blog/') && path !== '/blog') return { parentHref: '/blog/', parentLabel: 'Writing', backLabel: 'Back to writing', showBack: true };
  if (['/product-design-nepal', '/web3-ux-designer', '/saas-ux-designer', '/website-ux-design', '/figma-design-systems', '/ux-audit'].includes(path)) {
    return { parentHref: '/services', parentLabel: 'Services', backLabel: 'Back to services', showBack: true };
  }
  return { parentHref: '/', parentLabel: 'Home', backLabel: '', showBack: false };
}

/**
 * Function contract: ensureExperienceStylesheet
 * Purpose: Apply experience stylesheet consistently while preserving the surrounding experience system browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureExperienceStylesheet() {
  // Experience-system styles are compiled into /style.css.
}

/**
 * Function contract: addWayfinding
 * Purpose: Implement the add wayfinding responsibility owned by the experience system browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function addWayfinding() {
  const path = canonicalPath();
  const isBlogDetail = path.startsWith('/blog/') && path !== '/blog';
  if (path === '/' || isBlogDetail || document.querySelector('.nrs-detail-breadcrumb, .nrs-wayfinding, .nrs-blog-utility')) return;

  const main = document.querySelector('main');
  if (!main) return;

  const context = routeContext(path);
  const currentLabel = ROUTE_LABELS.get(path) || pageTitle();
  const nav = document.createElement('nav');
  nav.className = 'nrs-wayfinding';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const crumbs = document.createElement('ol');
  crumbs.className = 'nrs-breadcrumbs';

  const homeItem = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeItem.appendChild(homeLink);
  crumbs.appendChild(homeItem);

  if (context.parentHref !== '/') {
    const parentItem = document.createElement('li');
    const parentLink = document.createElement('a');
    parentLink.href = context.parentHref;
    parentLink.textContent = context.parentLabel;
    parentItem.appendChild(parentLink);
    crumbs.appendChild(parentItem);
  }

  if (currentLabel !== context.parentLabel) {
    const currentItem = document.createElement('li');
    const current = document.createElement('span');
    current.setAttribute('aria-current', 'page');
    current.textContent = currentLabel;
    currentItem.appendChild(current);
    crumbs.appendChild(currentItem);
  }

  nav.appendChild(crumbs);
  const anchor = main.querySelector('.hero-section, .nrs-services-index-hero, .nrs-contact-redesign-hero, .nrs-about-v2-hero, .nrs-contact-v2-hero, .nrs-services-hero, .nrs-contact-v3-hero, article, section');
  if (anchor) anchor.prepend(nav);
  else main.prepend(nav);
}

/**
 * Function contract: addSkeleton
 * Purpose: Implement the add skeleton responsibility owned by the experience system browser feature.
 * Inputs: `media`: input consumed by this operation
 * Side effects: registers or removes browser event listeners; reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function addSkeleton(media) {
  if (media.dataset.nrsLoadingReady === 'true') return;
  media.dataset.nrsLoadingReady = 'true';
  media.classList.add('nrs-lazy-media');

  const parent = media.parentElement;
  if (!parent) {
    media.classList.add('nrs-standalone-skeleton');
    return;
  }

  parent.classList.add('nrs-skeleton-host');
  let skeleton = parent.querySelector(':scope > .nrs-skeleton-layer');
  if (!skeleton) {
    skeleton = document.createElement('span');
    skeleton.className = 'nrs-skeleton-layer';
    skeleton.setAttribute('aria-hidden', 'true');
    parent.prepend(skeleton);
  }

  /**
   * Function contract: ready
   * Purpose: Implement the ready responsibility owned by the experience system browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const ready = () => {
    media.classList.add('is-loaded');
    parent.classList.add('nrs-media-ready');
  };
  /**
   * Function contract: failed
   * Purpose: Implement the failed responsibility owned by the experience system browser feature.
   * Inputs: None; derives required state from the enclosing module/runtime context.
   * Side effects: reads or updates DOM/browser state.
   * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
   */
  const failed = () => parent.classList.add('nrs-media-error');

  if (media instanceof HTMLImageElement) {
    if (media.complete && media.naturalWidth > 0) ready();
    else {
      media.addEventListener('load', ready, { once: true });
      media.addEventListener('error', failed, { once: true });
    }
  } else {
    media.addEventListener('load', ready, { once: true });
    media.addEventListener('error', failed, { once: true });
  }
}

/**
 * Function contract: improveMediaLoading
 * Purpose: Implement the improve media loading responsibility owned by the experience system browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function improveMediaLoading() {
  const heroMedia = new Set(document.querySelectorAll('.hero-section img, .nrs-services-hero img, .nrs-contact-v3-hero img, .case-hero-img-container img'));
  document.querySelectorAll('main img').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `image`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (image) => {
    image.decoding = 'async';
    if (heroMedia.has(image)) {
      image.loading = 'eager';
      image.fetchPriority = 'high';
    } else image.loading = 'lazy';
    addSkeleton(image);
  });
  document.querySelectorAll('main iframe').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `frame`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (frame) => {
    frame.loading = 'lazy';
    addSkeleton(frame);
  });
}

/**
 * Function contract: markInteractiveElements
 * Purpose: Implement the mark interactive elements responsibility owned by the experience system browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function markInteractiveElements() {
  const selector = [
    'a', 'button', 'input', 'textarea', 'select', 'summary', 'label',
    '[role="button"]', '[tabindex]:not([tabindex="-1"])',
    '.project-card', '.writing-item', '.journey-card', '.impact-card',
    '.prototype-link-card', '.nrs-service-card', '.nrs-services-step',
    '.case-list li', '.filter-btn', '.btn', '.nav-link', '.mobile-nav-links a',
  ].join(',');

  document.querySelectorAll(selector).forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ (element) => element.classList.add('nrs-cursor-target'));
  document.querySelectorAll('main img, main video, main iframe').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ (element) => element.setAttribute('data-cursor-mode', 'media'));
  document.querySelectorAll('main p, main li, main h1, main h2, main h3, main h4').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ (element) => element.setAttribute('data-cursor-mode', 'text'));
  document.querySelectorAll('[data-cursor-label]').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `element`. Side effects: reads or updates DOM/browser state. Returns: computed expression result consumed by the enclosing operation. */ (element) => element.classList.add('nrs-cursor-target'));
}

/**
 * Function contract: initExperienceSystem
 * Purpose: Initialize experience system for the experience system browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initExperienceSystem() {
  ensureExperienceStylesheet();
  addWayfinding();
  improveMediaLoading();
  markInteractiveElements();
}
