/**
 * @fileoverview src/scripts/features/navigation/nav-consistency.js
 * Purpose: Browser runtime feature in the navigation domain responsible for nav consistency behavior.
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
 * Purpose: Implements the current key responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
 * Purpose: Implements the sync links responsibility for this module.
 * Inputs: container, selector, className.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function syncLinks(container, selector, className = '') {
  if (!container) return;
  const active = currentKey();
  const existing = Array.from(container.querySelectorAll(selector));

  const byLabel = new Map(existing.map(/** Callback contract: Processes the callback step for existing without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. No explicit return contract. */ (link) => [link.textContent.trim().toLowerCase(), link]));

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
 * Purpose: Applies normalize primary nav while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function normalizePrimaryNav() {
  const desktopPill = document.querySelector('.nav-pill');
  const mobileLinks = document.querySelector('.mobile-nav-links');

  syncLinks(desktopPill, 'a.nav-link', 'nav-link');
  syncLinks(mobileLinks, 'a');
}

/**
 * Function contract: normalizeFooterNav
 * Purpose: Applies normalize footer nav while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizeFooterNav() {
  const pagesHeading = Array.from(document.querySelectorAll('.footer-col h5'))
    .find(/** Callback contract: Processes the callback step for array.from(document.query selector all('.footer col h5')) without leaking orchestration details to the caller. Inputs: heading. Side effects: may read or update browser DOM/state. No explicit return contract. */ (heading) => heading.textContent.trim().toLowerCase() === 'pages');
  const footerColumn = pagesHeading?.parentElement;
  if (!footerColumn) return;

  const links = Array.from(footerColumn.querySelectorAll('a'));
  const byLabel = new Map(links.map(/** Callback contract: Processes the callback step for links without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. No explicit return contract. */ (link) => [link.textContent.trim().toLowerCase(), link]));

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
 * Purpose: Applies apply route classes while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function applyRouteClasses() {
  const path = window.location.pathname;
  document.body.classList.toggle('nrs-service-page', path.includes('services'));
  document.body.classList.toggle('nrs-inner-page', path !== '/');
}

/**
 * Function contract: enforceDesignSystemShell
 * Purpose: Applies enforce design system shell while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function enforceDesignSystemShell() {
  applyRouteClasses();
  normalizePrimaryNav();
  normalizeFooterNav();
}
