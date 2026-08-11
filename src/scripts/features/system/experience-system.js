/**
 * @fileoverview src/scripts/features/system/experience-system.js
 * Purpose: Browser runtime feature in the system domain responsible for experience system behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
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
 * Purpose: Implements the canonical path responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function canonicalPath() {
  const path = window.location.pathname || '/';
  if (path === '/') return '/';
  return path.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
}

/**
 * Function contract: pageTitle
 * Purpose: Implements the page title responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function pageTitle() {
  const heading = document.querySelector('main h1, main .hero-title');
  const text = heading?.textContent?.trim();
  if (text) return text;
  return document.title.split('|')[0].trim() || 'Page';
}

/**
 * Function contract: routeContext
 * Purpose: Implements the route context responsibility for this module.
 * Inputs: path.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Applies ensure experience stylesheet while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureExperienceStylesheet() {
  // Experience-system styles are compiled into /style.css.
}

/**
 * Function contract: addWayfinding
 * Purpose: Implements the add wayfinding responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the add skeleton responsibility for this module.
 * Inputs: media.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
   * Purpose: Retrieves ready and returns it in the form expected by its caller.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
   */
  const ready = () => {
    media.classList.add('is-loaded');
    parent.classList.add('nrs-media-ready');
  };
  /**
   * Function contract: failed
   * Purpose: Implements the failed responsibility for this module.
   * Inputs: none; the function derives state from its enclosing module/runtime context.
   * Side effects: may read or update browser DOM/state.
   * Returns: no explicit value unless an invoked dependency throws/rejects.
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
 * Purpose: Implements the improve media loading responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function improveMediaLoading() {
  const heroMedia = new Set(document.querySelectorAll('.hero-section img, .nrs-services-hero img, .nrs-contact-v3-hero img, .case-hero-img-container img'));
  document.querySelectorAll('main img').forEach(/** Callback contract: Processes the callback step for document.query selector all('main img') without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (image) => {
    image.decoding = 'async';
    if (heroMedia.has(image)) {
      image.loading = 'eager';
      image.fetchPriority = 'high';
    } else image.loading = 'lazy';
    addSkeleton(image);
  });
  document.querySelectorAll('main iframe').forEach(/** Callback contract: Processes the callback step for document.query selector all('main iframe') without leaking orchestration details to the caller. Inputs: frame. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (frame) => {
    frame.loading = 'lazy';
    addSkeleton(frame);
  });
}

/**
 * Function contract: markInteractiveElements
 * Purpose: Implements the mark interactive elements responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function markInteractiveElements() {
  const selector = [
    'a', 'button', 'input', 'textarea', 'select', 'summary', 'label',
    '[role="button"]', '[tabindex]:not([tabindex="-1"])',
    '.project-card', '.writing-item', '.journey-card', '.impact-card',
    '.prototype-link-card', '.nrs-service-card', '.nrs-services-step',
    '.case-list li', '.filter-btn', '.btn', '.nav-link', '.mobile-nav-links a',
  ].join(',');

  document.querySelectorAll(selector).forEach(/** Callback contract: Processes the callback step for document.query selector all(selector) without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. No explicit return contract. */ (element) => element.classList.add('nrs-cursor-target'));
  document.querySelectorAll('main img, main video, main iframe').forEach(/** Callback contract: Processes the callback step for document.query selector all('main img, main video, main iframe') without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. No explicit return contract. */ (element) => element.setAttribute('data-cursor-mode', 'media'));
  document.querySelectorAll('main p, main li, main h1, main h2, main h3, main h4').forEach(/** Callback contract: Processes the callback step for document.query selector all('main p, main li, main h1, main h2, main h3, main h4') without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. No explicit return contract. */ (element) => element.setAttribute('data-cursor-mode', 'text'));
  document.querySelectorAll('[data-cursor-label]').forEach(/** Callback contract: Processes the callback step for document.query selector all('[data cursor label]') without leaking orchestration details to the caller. Inputs: element. Side effects: may read or update browser DOM/state. No explicit return contract. */ (element) => element.classList.add('nrs-cursor-target'));
}

/**
 * Function contract: initExperienceSystem
 * Purpose: Implements the init experience system responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function initExperienceSystem() {
  ensureExperienceStylesheet();
  addWayfinding();
  improveMediaLoading();
  markInteractiveElements();
}
