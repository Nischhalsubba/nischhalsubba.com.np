/**
 * @fileoverview src/scripts/features/navigation/navigation.js
 * Purpose: Browser runtime feature in the navigation domain responsible for navigation behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - docs/repository/file-map.md
 * - docs/seo-maintenance.md
 * - scripts/audit-build.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
import { $$ } from '../../shared/dom.js';

/**
 * Function contract: normalizePath
 * Purpose: Applies normalize path while preserving the surrounding repository/runtime contract.
 * Inputs: pathname.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizePath(pathname) {
  const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (path === '/home-v2' || path === '/home-v2.html' || path === '/home' || path === '/home.html' || path === '/index.html') return '/';
  if (path === '/projects') return '/projects.html';
  if (path === '/services') return '/services.html';
  if (path === '/about') return '/about.html';
  if (path === '/contact') return '/contact.html';
  if (path === '/blog.html') return '/blog';

  return path;
}

/**
 * Function contract: getActiveSection
 * Purpose: Retrieves get active section and returns it in the form expected by its caller.
 * Inputs: pathname.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getActiveSection(pathname) {
  const path = normalizePath(pathname);
  const file = path.split('/').filter(Boolean).pop() || '';

  if (path === '/') return 'home';
  if (path === '/projects.html' || file.startsWith('project-')) return 'work';
  if (path === '/services.html') return 'services';
  if (path === '/about.html') return 'about';
  if (path === '/contact.html') return 'contact';
  if (path === '/blog' || path.startsWith('/blog/') || file.startsWith('blog-')) return 'writing';

  const servicePages = new Set([
    'product-design-nepal.html',
    'web3-ux-designer.html',
    'saas-ux-designer.html',
    'website-ux-design.html',
    'figma-design-systems.html',
    'ux-audit.html',
  ]);

  if (servicePages.has(file)) return 'services';
  return '';
}

/**
 * Function contract: getLinkSection
 * Purpose: Retrieves get link section and returns it in the form expected by its caller.
 * Inputs: href.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getLinkSection(href) {
  const path = normalizePath(new URL(href, window.location.origin).pathname);

  if (path === '/') return 'home';
  if (path === '/projects.html') return 'work';
  if (path === '/services.html') return 'services';
  if (path === '/about.html') return 'about';
  if (path === '/contact.html') return 'contact';
  if (path === '/blog') return 'writing';

  return '';
}

/**
 * Function contract: initActiveNavigation
 * Purpose: Implements the init active navigation responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function initActiveNavigation() {
  const activeSection = getActiveSection(window.location.pathname);

  $$('.nav-link, .mobile-nav-links a, .footer-col a').forEach(/** Callback contract: Processes the callback step for $$('.nav link, .mobile nav links a, .footer col a') without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

    const linkSection = getLinkSection(href);
    const active = Boolean(linkSection && activeSection && linkSection === activeSection);

    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
