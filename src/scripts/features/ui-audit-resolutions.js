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

function removeLegacyArtifacts() {
  document.querySelectorAll(LEGACY_ARTIFACT_SELECTORS).forEach((node) => node.remove());
}

function normalizeNavigationA11y() {
  const path = window.location.pathname === '/index.html' ? '/' : window.location.pathname;

  document.querySelectorAll('.nav-wrapper').forEach((nav) => {
    nav.setAttribute('aria-label', 'Primary navigation');
  });

  document.querySelectorAll('.mobile-nav-links').forEach((nav) => {
    nav.setAttribute('aria-label', 'Mobile navigation');
  });

  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach((link) => {
    const href = new URL(link.getAttribute('href') || '/', window.location.origin).pathname;
    const normalizedHref = href === '/index.html' ? '/' : href;
    const isActive = normalizedHref === path || (path.startsWith('/blog/') && normalizedHref === '/blog/');
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function improveContactTrustCopy() {
  const form = document.getElementById('contact-form');
  if (!form || form.querySelector('.nrs-form-trust-note')) return;

  const note = document.createElement('p');
  note.className = 'nrs-form-trust-note';
  note.textContent = 'I usually reply with fit, availability, and the next useful step. Your message is used only to respond to your inquiry.';
  form.querySelector('.form-actions')?.before(note);
}

function renamePublicCaseStudyPlaceholders() {
  document.querySelectorAll('.case-label, .section-title').forEach((node) => {
    const text = node.textContent?.trim();
    if (text === 'Visual story plan') node.textContent = 'Evidence';
    if (text === 'What to show in the walkthrough') node.textContent = 'Evidence to review';
  });
}

function tagProjectCardsByDepth() {
  document.querySelectorAll('.project-card').forEach((card) => {
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
    ].some((slug) => href.includes(slug));

    if (!hasFullRuntimeStudy || card.querySelector('.nrs-card-depth')) return;
    const depth = document.createElement('span');
    depth.className = 'badge-pill nrs-card-depth';
    depth.textContent = 'Case study';
    card.querySelector('.card-meta-line')?.appendChild(depth);
  });
}

export function resolveUiAuditIssues() {
  ensureAuditResolutionStyles();
  removeLegacyArtifacts();
  normalizeNavigationA11y();
  improveContactTrustCopy();
  renamePublicCaseStudyPlaceholders();
  tagProjectCardsByDepth();

  requestAnimationFrame(() => {
    ensureAuditResolutionStyles();
    removeLegacyArtifacts();
    normalizeNavigationA11y();
    improveContactTrustCopy();
    renamePublicCaseStudyPlaceholders();
    tagProjectCardsByDepth();
  });
}
