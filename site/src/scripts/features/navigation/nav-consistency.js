/**
 * @fileoverview src/scripts/features/navigation/nav-consistency.js
 * Purpose: Implement nav consistency behavior inside the navigation browser-runtime domain.
 * Responsibilities:
 * - Own the navigation behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const NAV_ITEMS = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/projects.html', label: 'Work', key: 'work' },
  { href: '/services.html', label: 'Services', key: 'services' },
  { href: '/about.html', label: 'About', key: 'about' },
  { href: '/blog/', label: 'Writing', key: 'writing' },
  { href: '/contact.html', label: 'Contact', key: 'contact' },
];


/**
 * Function contract: currentKey
 * Purpose: Implement the current key responsibility owned by the nav consistency browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function currentKey() {
  const path = window.location.pathname;
  if (path === '/' || path.includes('home')) return 'home';
  if (path.includes('services')) return 'services';
  if (path.includes('about')) return 'about';
  if (path.includes('contact')) return 'contact';
  if (path.startsWith('/blog')) return 'writing';
  if (path.includes('project') || path.includes('projects')) return 'work';
  return '';
}


/**
 * Function contract: syncLinks
 * Purpose: Synchronize links with the requested state while preserving related nav consistency browser feature invariants.
 * Inputs: `container`, `selector`, `className`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function syncLinks(container, selector, className = '') {
  if (!container) return;
  const active = currentKey();
  const existing = Array.from(container.querySelectorAll(selector));

  const byLabel = new Map(existing.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link` Side effects: reads or updates DOM/browser state Returns: Computed expression result consumed by the enclosing operation. */ (link) => [link.textContent.trim().toLowerCase(), link]));

  for (const item of NAV_ITEMS) {
    let link = byLabel.get(item.label.toLowerCase());
    if (!link) {
      link = document.createElement('a');
      link.textContent = item.label;
      if (className) link.className = className;
      const before = byLabel.get('about');
      if (item.key === 'services' && before) container.insertBefore(link, before);
      else container.appendChild(link);
    }

    link.href = item.href;
    link.classList.toggle('active', item.key === active);
    if (item.key === active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
}


/**
 * Function contract: normalizePrimaryNav
 * Purpose: Apply primary nav consistently while preserving the surrounding nav consistency browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function normalizePrimaryNav() {
  const desktopPill = document.querySelector('.nav-pill');
  const mobileLinks = document.querySelector('.mobile-nav-links');

  syncLinks(desktopPill, 'a.nav-link', 'nav-link');
  syncLinks(mobileLinks, 'a');
}


/**
 * Function contract: normalizeFooterNav
 * Purpose: Apply footer nav consistently while preserving the surrounding nav consistency browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function normalizeFooterNav() {
  const pagesHeading = Array.from(document.querySelectorAll('.footer-col h5'))
    .find( /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `heading` Side effects: reads or updates DOM/browser state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (heading) => heading.textContent.trim().toLowerCase() === 'pages');
  const footerColumn = pagesHeading?.parentElement;
  if (!footerColumn) return;

  const links = Array.from(footerColumn.querySelectorAll('a'));
  const byLabel = new Map(links.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link` Side effects: reads or updates DOM/browser state Returns: Computed expression result consumed by the enclosing operation. */ (link) => [link.textContent.trim().toLowerCase(), link]));

  for (const item of NAV_ITEMS) {
    let link = byLabel.get(item.label.toLowerCase());
    if (!link) {
      link = document.createElement('a');
      link.textContent = item.label;
      const before = byLabel.get('about');
      if (item.key === 'services' && before) footerColumn.insertBefore(link, before);
      else footerColumn.appendChild(link);
    }
    link.href = item.href;
  }
}


/**
 * Function contract: applyRouteClasses
 * Purpose: Apply route classes consistently while preserving the surrounding nav consistency browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function applyRouteClasses() {
  const path = window.location.pathname;
  document.body.classList.toggle('nrs-service-page', path.includes('services'));
  document.body.classList.toggle('nrs-inner-page', path !== '/');
}


/**
 * Function contract: enforceDesignSystemShell
 * Purpose: Apply design system shell consistently while preserving the surrounding nav consistency browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function enforceDesignSystemShell() {
  applyRouteClasses();
  normalizePrimaryNav();
  normalizeFooterNav();
}
