/**
 * @fileoverview src/scripts/features/accessibility/ui-audit-resolutions.js
 * Purpose: Implement ui audit resolutions behavior inside the accessibility browser-runtime domain.
 * Responsibilities:
 * - Own the accessibility behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const UI_AUDIT_STYLE_ID = 'nrs-ui-audit-resolutions';

const LEGACY_ARTIFACT_SELECTORS = [
  '#grid-canvas',
  '.custom-cursor-dot',
  '.custom-cursor-outline',
  '.background-grid',
  '.ambient-glow',
  '.page-glow',
  '.noise-layer',
].join(',');

/**
 * Function contract: ensureAuditResolutionStyles
 * Purpose: Apply audit resolution styles consistently while preserving the surrounding ui audit resolutions browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function ensureAuditResolutionStyles() {
  let style = document.getElementById(UI_AUDIT_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = UI_AUDIT_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    :root {
      --nrs-focus-ring: rgba(224, 224, 224, 0.34);
      --nrs-progress-track: rgba(255, 255, 255, 0.16);
      --nrs-progress-fill: #E0E0E0;
    }

    html[data-theme='light'] {
      --nrs-focus-ring: rgba(68, 68, 68, 0.22);
      --nrs-progress-track: rgba(68, 68, 68, 0.16);
      --nrs-progress-fill: #444444;
    }

    html,
    body {
      background-image: none !important;
    }

    body::before,
    body::after,
    ${LEGACY_ARTIFACT_SELECTORS} {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
    }

    #nrs-scroll-progress {
      height: 6px !important;
      background: var(--nrs-progress-track) !important;
      opacity: 1 !important;
      transform: none !important;
      overflow: hidden !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    #nrs-scroll-progress::before {
      background: var(--nrs-progress-fill) !important;
      box-shadow: none !important;
    }

    html[data-theme='light'] #nrs-scroll-progress {
      border-bottom-color: rgba(68, 68, 68, 0.08) !important;
    }

    .project-card:hover,
    .writing-item:hover,
    .journey-card:hover,
    .comparison-card:hover,
    .metric-plan-card:hover,
    .story-card:hover,
    .quote-card:hover,
    .impact-card:hover,
    .nrs-related-card:hover,
    .link-pill:hover,
    .filter-btn:hover,
    .filter-btn.active {
      border-color: var(--border-strong) !important;
      background-image: none !important;
      box-shadow: none !important;
    }

    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .impact-card,
    .blog-card-modern,
    .nrs-blog-proof-grid article,
    .clarity-row-list article,
    .clarity-steps article,
    .case-list li {
      background-image: none !important;
      box-shadow: none !important;
      border-color: var(--border-faint) !important;
    }

    .journey-card:nth-child(2n),
    .journey-card:nth-child(3n) {
      background-image: none !important;
    }

    input:focus,
    select:focus,
    textarea:focus,
    .search-input:focus,
    .filter-btn:focus-visible,
    .nav-link:focus-visible,
    .btn:focus-visible,
    .project-card:focus-visible,
    .writing-item:focus-visible,
    .link-pill:focus-visible,
    .theme-toggle-btn:focus-visible,
    .mobile-nav-toggle:focus-visible,
    .mobile-logo:focus-visible {
      outline: 3px solid var(--nrs-focus-ring) !important;
      outline-offset: 3px !important;
      border-color: var(--border-strong) !important;
      box-shadow: none !important;
    }

    .w-arrow::before {
      border-color: var(--accent-blue) !important;
    }

    .w-arrow::after {
      background: var(--accent-blue) !important;
    }

    .contact-form {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: clamp(18px, 2vw, 26px) !important;
    }

    .contact-form .form-grid {
      display: grid !important;
      grid-template-columns: 1fr !important;
      gap: clamp(18px, 2vw, 26px) !important;
      margin: 0 !important;
    }

    .contact-form .nrs-form-trust-note {
      margin: 0 !important;
      color: var(--text-tertiary) !important;
      font-size: 0.92rem !important;
      line-height: 1.6 !important;
    }

    .nrs-case-study-snapshot,
    .snapshot-grid {
      border-color: var(--border-faint) !important;
      box-shadow: none !important;
    }

    .case-label,
    .eyebrow,
    .meta-text,
    .w-date {
      color: var(--text-tertiary) !important;
    }

    @media (max-width: 760px) {
      #nrs-scroll-progress {
        height: 5px !important;
      }

      .writing-item,
      .writing-list[data-blog-posts] .writing-item {
        grid-template-columns: 1fr 34px !important;
      }

      .writing-item .w-date {
        grid-column: 1 / -1 !important;
      }
    }
  `;
}

/**
 * Function contract: removeLegacyArtifacts
 * Purpose: Removes or cleans remove legacy artifacts while keeping required outputs intact.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: removeLegacyArtifacts
 * Purpose: Remove legacy artifacts without disturbing required surrounding ui audit resolutions browser feature state.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function removeLegacyArtifacts() {
  document.querySelectorAll(LEGACY_ARTIFACT_SELECTORS).forEach(/** Callback contract: Processes the callback step for document.query selector all(legacy artifact selectors) without leaking orchestration details to the caller. Inputs: node. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (node) => node.remove());
}

/**
 * Function contract: normalizeNavigationA11y
 * Purpose: Applies normalize navigation a11y while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: normalizeNavigationA11y
 * Purpose: Apply navigation a11y consistently while preserving the surrounding ui audit resolutions browser feature contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function normalizeNavigationA11y() {
  const path = window.location.pathname === '/index.html' ? '/' : window.location.pathname;

  document.querySelectorAll('.nav-wrapper').forEach(/** Callback contract: Processes the callback step for document.query selector all('.nav wrapper') without leaking orchestration details to the caller. Inputs: nav. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `nav`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `nav`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (nav) => {
    nav.setAttribute('aria-label', 'Primary navigation');
  });

  document.querySelectorAll('.mobile-nav-links').forEach(/** Callback contract: Processes the callback step for document.query selector all('.mobile nav links') without leaking orchestration details to the caller. Inputs: nav. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `nav`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `nav`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (nav) => {
    nav.setAttribute('aria-label', 'Mobile navigation');
  });

  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach(/** Callback contract: Processes the callback step for document.query selector all('.nav link, .mobile nav links a') without leaking orchestration details to the caller. Inputs: link. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `link`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `link`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (link) => {
    const href = new URL(link.getAttribute('href') || '/', window.location.origin).pathname;
    const normalizedHref = href === '/index.html' ? '/' : href;
    const isActive = normalizedHref === path || (path.startsWith('/blog/') && normalizedHref === '/blog/');
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

/**
 * Function contract: improveContactTrustCopy
 * Purpose: Implements the improve contact trust copy responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: improveContactTrustCopy
 * Purpose: Implement the improve contact trust copy responsibility owned by the ui audit resolutions browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function improveContactTrustCopy() {
  const form = document.getElementById('contact-form');
  if (!form || form.querySelector('.nrs-form-trust-note')) return;

  const note = document.createElement('p');
  note.className = 'nrs-form-trust-note';
  note.textContent = 'I usually reply with fit, availability, and the next useful step. Your message is used only to respond to your inquiry.';
  form.querySelector('.form-actions')?.before(note);
}

/**
 * Function contract: renamePublicCaseStudyPlaceholders
 * Purpose: Implements the rename public case study placeholders responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: renamePublicCaseStudyPlaceholders
 * Purpose: Implement the rename public case study placeholders responsibility owned by the ui audit resolutions browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function renamePublicCaseStudyPlaceholders() {
  document.querySelectorAll('.case-label, .section-title').forEach(/** Callback contract: Processes the callback step for document.query selector all('.case label, .section title') without leaking orchestration details to the caller. Inputs: node. Side effects: may read or update browser DOM/state. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `node`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (node) => {
    const text = node.textContent?.trim();
    if (text === 'Visual story plan') node.textContent = 'Evidence';
    if (text === 'What to show in the walkthrough') node.textContent = 'Evidence to review';
  });
}

/**
 * Function contract: softenUnlinkedProofClaims
 * Purpose: Implements the soften unlinked proof claims responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: softenUnlinkedProofClaims
 * Purpose: Implement the soften unlinked proof claims responsibility owned by the ui audit resolutions browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function softenUnlinkedProofClaims() {
  if (window.location.pathname !== '/about.html') return;

  document.querySelectorAll('.journey-card').forEach(/** Callback contract: Processes the callback step for document.query selector all('.journey card') without leaking orchestration details to the caller. Inputs: card. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `card`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `card`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (card) => {
    const heading = card.querySelector('h3');
    const body = card.querySelector('p');
    if (!heading || !body) return;

    if (heading.textContent?.includes('UX/UI, product design')) {
      body.textContent = 'Completed multiple Uxcel tracks and keep public proof links available for review instead of relying on unsupported claims.';

      if (!card.querySelector('.nrs-proof-link')) {
        const link = document.createElement('a');
        link.className = 'link-pill nrs-proof-link';
        link.href = 'https://app.uxcel.com/ux/nischhal';
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'View Uxcel profile';
        card.appendChild(link);
      }
    }
  });
}

/**
 * Function contract: tagProjectCardsByDepth
 * Purpose: Implements the tag project cards by depth responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: tagProjectCardsByDepth
 * Purpose: Implement the tag project cards by depth responsibility owned by the ui audit resolutions browser feature.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function tagProjectCardsByDepth() {
  document.querySelectorAll('.project-card').forEach(/** Callback contract: Processes the callback step for document.query selector all('.project card') without leaking orchestration details to the caller. Inputs: card. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `card`. Side effects: reads or updates DOM/browser state. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `card`. Side effects: reads or updates DOM/browser state. Returns: undefined; callback is side-effect-only. */ (card) => {
    const href = card.getAttribute('href') || '';
    const hasFullRuntimeStudy = [
      'project-yarsha.html',
      'project-mokshya.html',
      'project-hamro-idea.html',
      'project-pihub.html',
      'project-zapp.html',
      'project-morajaa.html',
      'project-masteriyo.html',
      'project-neverwinter-parser.html',
      'project-orkest.html',
      'project-splashnode.html',
      'project-grid-labs.html',
      'project-zakra-furniture.html',
      'project-designerex.html',
      'project-sassboilerplate.html',
    ].some(/** Callback contract: Processes the callback step for [
      'project yarsha.html',
      'project mokshya.html',
      'project hamro idea.html',
      'project pihub.html',
      'project zapp.html',
      'project morajaa.html',
      'project masteriyo.html',
      'project neverwinter parser.html',
      'project orkest.html',
      'project splashnode.html',
      'project grid labs.html',
      'project zakra furniture.html',
      'project designerex.html',
      'project sassboilerplate.html',
    ] without leaking orchestration details to the caller. Inputs: slug. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Evaluate whether the current item satisfies the condition needed for the enclosing existential check. Inputs: `slug`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `slug`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (slug) => href.includes(slug));

    if (!hasFullRuntimeStudy || card.querySelector('.nrs-card-depth')) return;
    const depth = document.createElement('span');
    depth.className = 'badge-pill nrs-card-depth';
    depth.textContent = 'Case study';
    card.querySelector('.card-meta-line')?.appendChild(depth);
  });
}

/**
 * Function contract: resolveUiAuditIssues
 * Purpose: Resolves resolve ui audit issues using the current inputs and repository/runtime context.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: resolveUiAuditIssues
 * Purpose: Resolve ui audit issues from the supplied inputs and the current repository/runtime context.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
export function resolveUiAuditIssues() {
  ensureAuditResolutionStyles();
  removeLegacyArtifacts();
  normalizeNavigationA11y();
  improveContactTrustCopy();
  renamePublicCaseStudyPlaceholders();
  softenUnlinkedProofClaims();
  tagProjectCardsByDepth();

  requestAnimationFrame(/** Callback contract: Processes the callback step for request animation frame without leaking orchestration details to the caller. Inputs: no explicit parameters. Side effects: may read or write repository/filesystem state. No explicit return contract. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so layout/state changes apply in a stable order. Inputs: none. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Defer the enclosed DOM update until the next animation frame so browser state settles in a predictable order. Inputs: none. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ () => {
    ensureAuditResolutionStyles();
    removeLegacyArtifacts();
    normalizeNavigationA11y();
    improveContactTrustCopy();
    renamePublicCaseStudyPlaceholders();
    softenUnlinkedProofClaims();
    tagProjectCardsByDepth();
  });
}
