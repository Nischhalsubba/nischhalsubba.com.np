/**
 * @fileoverview src/scripts/features/layout/final-spacing-nav-proof.js
 * Purpose: Browser runtime feature in the layout domain responsible for final spacing nav proof behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/runtime/script.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const FINAL_SPACING_NAV_STYLE_ID = 'nrs-final-spacing-nav-proof';

/**
 * Function contract: getSectionForPath
 * Purpose: Retrieves get section for path and returns it in the form expected by its caller.
 * Inputs: pathname.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getSectionForPath(pathname) {
  const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const file = path.split('/').filter(Boolean).pop() || '';

  if (!file || path === '/index.html' || path === '/home.html' || path === '/home-v2.html') return 'home';
  if (path === '/projects.html' || path === '/projects' || file.startsWith('project-')) return 'work';
  if (path === '/about.html' || path === '/about') return 'about';
  if (path === '/contact.html' || path === '/contact') return 'contact';
  if (path === '/blog' || path === '/blog.html' || path.startsWith('/blog/') || file.startsWith('blog-')) return 'writing';

  const servicePages = new Set([
    'product-design-nepal.html',
    'web3-ux-designer.html',
    'saas-ux-designer.html',
    'website-ux-design.html',
    'figma-design-systems.html',
    'ux-audit.html',
  ]);

  if (servicePages.has(file)) return 'work';
  return '';
}

/**
 * Function contract: getSectionForHref
 * Purpose: Retrieves get section for href and returns it in the form expected by its caller.
 * Inputs: href.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function getSectionForHref(href) {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return '';
  try {
    return getSectionForPath(new URL(href, window.location.origin).pathname);
  } catch (error) {
    return '';
  }
}

/**
 * Function contract: syncActiveNavigation
 * Purpose: Implements the sync active navigation responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function syncActiveNavigation() {
  const activeSection = getSectionForPath(window.location.pathname);
  document.querySelectorAll('.nav-link, .mobile-nav-links a, .footer-col a').forEach(/** Callback contract: Processes the callback step for document.query selector all('.nav link, .mobile nav links a, .footer col a') without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. No explicit return contract. */ (link) => {
    const section = getSectionForHref(link.getAttribute('href'));
    const active = Boolean(section && activeSection && section === activeSection);
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/**
 * Function contract: ensureFinalSpacingNavStyles
 * Purpose: Applies ensure final spacing nav styles while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function ensureFinalSpacingNavStyles() {
  let style = document.getElementById(FINAL_SPACING_NAV_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FINAL_SPACING_NAV_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --nrs-page-max: min(1080px, calc(100vw - var(--pad-x) * 2));
      --nrs-section-pad-y: clamp(40px, 5.2vw, 72px);
      --nrs-section-pad-y-tight: clamp(28px, 4vw, 52px);
      --nrs-block-gap: clamp(22px, 3vw, 36px);
      --nrs-card-grid-gap: clamp(18px, 2.4vw, 28px);
    }

    .container,
    .nrs-about-redesign,
    .nrs-contact-redesign,
    .nrs-project-detail-page,
    .nrs-case-study,
    main:has(.case-hero-img-container) {
      max-width: var(--nrs-page-max) !important;
    }

    .section-container,
    .nrs-about-redesign .section-container,
    .nrs-contact-redesign .section-container,
    main:has(.case-hero-img-container) .section-container.reveal-on-scroll:not(#proof) {
      max-width: var(--nrs-page-max) !important;
      margin-inline: auto !important;
      padding-block: var(--nrs-section-pad-y) !important;
    }

    .section-container:first-of-type,
    .nrs-about-redesign .section-container:first-of-type,
    .nrs-contact-redesign .section-container:first-of-type {
      padding-top: 0 !important;
    }

    .hero-section + .section-container,
    .nrs-about-redesign .hero-section + .section-container,
    .nrs-contact-redesign .hero-section + .section-container {
      padding-top: var(--nrs-section-pad-y-tight) !important;
    }

    .section-header,
    .nrs-about-redesign .section-header,
    .nrs-contact-redesign .section-header,
    .nrs-case-section-head {
      display: grid !important;
      gap: 14px !important;
      max-width: 780px !important;
      margin: 0 0 var(--nrs-block-gap) !important;
    }

    .section-title,
    .section-header .section-title,
    .nrs-case-section-head .section-title {
      margin: 0 !important;
    }

    .section-lead,
    .section-header .section-lead,
    .body-large {
      margin-top: 0 !important;
    }

    .section-header + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid),
    .section-title + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid),
    .section-lead + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid),
    .body-large + :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid) {
      margin-top: 0 !important;
    }

    :where(.journey-grid, .case-list, .snapshot-grid, .prototype-link-list, .project-grid, .impact-summary-grid, .writing-list, .nrs-blog-proof-grid) {
      gap: var(--nrs-card-grid-gap) !important;
    }

    .snapshot-grid,
    .nrs-about-redesign .snapshot-grid,
    main:has(.case-hero-img-container) .snapshot-grid {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: var(--nrs-card-grid-gap) !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      overflow: visible !important;
      padding: 0 !important;
    }

    .snapshot-grid > div,
    .nrs-about-redesign .snapshot-grid > div,
    main:has(.case-hero-img-container) .snapshot-grid > div {
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: var(--card-bg) !important;
      padding: var(--card-padding) !important;
      border-right: 1px solid var(--card-border) !important;
      min-height: 126px !important;
      display: grid !important;
      align-content: center !important;
      gap: 10px !important;
    }

    html[data-theme='light'] .snapshot-grid > div {
      background: #fff !important;
      border-color: rgba(23, 23, 23, 0.14) !important;
    }

    .snapshot-grid h5,
    .snapshot-grid p {
      margin: 0 !important;
    }

    .case-list,
    .nrs-about-redesign .case-list,
    main:has(.case-hero-img-container) .case-list {
      margin-top: 0 !important;
      padding: 0 !important;
    }

    .case-list li {
      min-height: 106px !important;
      display: flex !important;
      align-items: flex-start !important;
      padding: var(--card-padding) !important;
      padding-left: calc(var(--card-padding) + 28px) !important;
    }

    .case-list li::before {
      left: var(--card-padding) !important;
      top: calc(var(--card-padding) + 0.72em) !important;
      transform: none !important;
      width: 7px !important;
      height: 7px !important;
      background: var(--text-tertiary) !important;
      box-shadow: none !important;
    }

    .nav-link,
    .mobile-nav-links a {
      border: 1px solid transparent !important;
      color: var(--text-secondary) !important;
    }

    .nav-link.active,
    .nav-link[aria-current='page'],
    .mobile-nav-links a.active,
    .mobile-nav-links a[aria-current='page'] {
      color: var(--text-primary) !important;
      border-color: var(--card-border-hover) !important;
      background: rgba(255, 255, 255, 0.075) !important;
      font-weight: 900 !important;
    }

    html[data-theme='light'] .nav-link.active,
    html[data-theme='light'] .nav-link[aria-current='page'],
    html[data-theme='light'] .mobile-nav-links a.active,
    html[data-theme='light'] .mobile-nav-links a[aria-current='page'] {
      background: rgba(23, 23, 23, 0.06) !important;
    }

    .nav-glider {
      display: none !important;
    }

    .nrs-proof-grid {
      display: grid !important;
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: var(--nrs-card-grid-gap) !important;
    }

    .nrs-proof-card {
      display: grid !important;
      gap: 12px !important;
      align-content: start !important;
      min-height: 180px !important;
      border: 1px solid var(--card-border) !important;
      border-radius: var(--radius-card) !important;
      background: var(--card-bg) !important;
      padding: var(--card-padding) !important;
      text-decoration: none !important;
    }

    .nrs-proof-card:hover {
      transform: translateY(-2px) !important;
      border-color: var(--card-border-hover) !important;
      background: var(--card-bg-hover) !important;
    }

    .nrs-proof-card h3,
    .nrs-proof-card p {
      margin: 0 !important;
    }

    .nrs-proof-card p {
      color: var(--text-secondary) !important;
      line-height: 1.65 !important;
    }

    @media (max-width: 980px) {
      .snapshot-grid,
      .nrs-about-redesign .snapshot-grid,
      .nrs-proof-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 850px) {
      .nav-wrapper {
        display: none !important;
      }

      .mobile-nav-toggle,
      .mobile-logo,
      .theme-toggle-btn {
        position: fixed !important;
        top: calc(env(safe-area-inset-top, 0px) + 18px) !important;
        z-index: 2147483000 !important;
      }

      .mobile-nav-toggle {
        display: inline-flex !important;
        left: calc(env(safe-area-inset-left, 0px) + 18px) !important;
        right: auto !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        min-height: 52px !important;
        transform: none !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .mobile-logo {
        display: inline-flex !important;
        left: 50% !important;
        right: auto !important;
        transform: translateX(-50%) !important;
        width: auto !important;
        max-width: calc(100vw - 190px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
        min-width: 0 !important;
        min-height: 52px !important;
        padding: 0 16px !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
      }

      .theme-toggle-btn {
        right: calc(env(safe-area-inset-right, 0px) + 18px) !important;
        left: auto !important;
        width: 52px !important;
        height: 52px !important;
        min-width: 52px !important;
        min-height: 52px !important;
        transform: none !important;
      }

      .mobile-nav-overlay {
        padding-top: calc(env(safe-area-inset-top, 0px) + 104px) !important;
      }
    }

    @media (max-width: 720px) {
      :root {
        --nrs-section-pad-y: clamp(32px, 8vw, 50px);
        --nrs-block-gap: 24px;
      }

      .snapshot-grid > div {
        min-height: auto !important;
      }
    }

    @media (max-width: 390px) {
      .mobile-logo {
        max-width: calc(100vw - 176px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) !important;
        padding-inline: 12px !important;
        font-size: .84rem !important;
      }
    }
  `;
}

/**
 * Function contract: applyFinalSpacingNavProof
 * Purpose: Applies apply final spacing nav proof while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function applyFinalSpacingNavProof() {
  ensureFinalSpacingNavStyles();
  syncActiveNavigation();
  requestAnimationFrame(/** Callback contract: Processes the callback step for request animation frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
    ensureFinalSpacingNavStyles();
    syncActiveNavigation();
  });
  window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
    ensureFinalSpacingNavStyles();
    syncActiveNavigation();
  }, 250);
  window.setTimeout(/** Callback contract: Processes the callback step for window without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ () => {
    ensureFinalSpacingNavStyles();
    syncActiveNavigation();
  }, 1000);
}
