/**
 * @fileoverview src/scripts/features/navigation/navigation.js
 * Purpose: Implement navigation behavior inside the navigation browser-runtime domain.
 * Responsibilities:
 * - Own the navigation behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/scripts/shared/dom.js
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import { $$ } from '../../shared/dom.js';

/**
 * Function contract: normalizePath
 * Purpose: Apply path consistently while preserving the surrounding navigation browser feature contract.
 * Inputs: `pathname`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
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
 * Purpose: Return active section from the supplied inputs or current navigation browser feature state.
 * Inputs: `pathname`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested active section; early-return/empty-state behavior follows the explicit branches in this function.
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
 * Purpose: Return link section from the supplied inputs or current navigation browser feature state.
 * Inputs: `href`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: The requested link section; early-return/empty-state behavior follows the explicit branches in this function.
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
 * Purpose: Initialize active navigation for the navigation browser feature, including the listeners/state needed for safe runtime use.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function initActiveNavigation() {
  const activeSection = getActiveSection(window.location.pathname);

  $$('.nav-link, .mobile-nav-links a, .footer-col a').forEach(/** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `link`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (link) => {
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
