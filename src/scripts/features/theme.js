import { $, getStorage } from '../utils/dom.js';

const PORTRAIT_IMG = 'https://i.imgur.com/oFHdPUS.png';
const FALLBACK_PORTRAIT_IMG = '/assets/images/portrait.svg';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 109 9 7 7 0 01-9-9z"/></svg>';

function injectRequestedThemePalette() {
  if (document.getElementById('nrs-requested-theme-palette')) return;

  const style = document.createElement('style');
  style.id = 'nrs-requested-theme-palette';
  style.textContent = `
    :root {
      --palette-dark: #181818;
      --palette-light: #F7F7F7;
      --palette-orange: #FF5722;
      --palette-purple: #673AB7;
      --palette-yellow: #FFEB3B;

      --bg-page: #181818 !important;
      --bg-surface: #181818 !important;
      --bg-surface-2: #181818 !important;
      --bg-pill: #181818 !important;
      --bg-nav: #181818 !important;
      --text-primary: #F7F7F7 !important;
      --text-secondary: #F7F7F7 !important;
      --text-tertiary: #FFEB3B !important;
      --text-soft: #F7F7F7 !important;
      --accent-blue: #FF5722 !important;
      --accent-cyan: #673AB7 !important;
      --accent-gold: #FFEB3B !important;
      --accent-glow: #FF5722 !important;
      --border-faint: #673AB7 !important;
      --border-strong: #FF5722 !important;
      --nrs-divider: #673AB7 !important;
      --shadow-card: none !important;
      --shadow-soft: none !important;
    }

    [data-theme='light'] {
      --bg-page: #F7F7F7 !important;
      --bg-surface: #F7F7F7 !important;
      --bg-surface-2: #F7F7F7 !important;
      --bg-pill: #F7F7F7 !important;
      --bg-nav: #F7F7F7 !important;
      --text-primary: #181818 !important;
      --text-secondary: #181818 !important;
      --text-tertiary: #673AB7 !important;
      --text-soft: #181818 !important;
      --accent-blue: #673AB7 !important;
      --accent-cyan: #FF5722 !important;
      --accent-gold: #FFEB3B !important;
      --accent-glow: #673AB7 !important;
      --border-faint: #673AB7 !important;
      --border-strong: #FF5722 !important;
      --nrs-divider: #673AB7 !important;
      color-scheme: light;
    }

    html,
    body {
      background: var(--bg-page) !important;
      background-color: var(--bg-page) !important;
      background-image: none !important;
      color: var(--text-primary) !important;
    }

    body::before,
    body::after,
    #grid-canvas,
    .background-grid,
    .ambient-glow,
    .cursor-glow,
    .page-glow,
    .noise-layer {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      background: transparent !important;
      background-image: none !important;
    }

    body *:not(img):not(video):not(canvas):not(svg):not(path) {
      background-image: none !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    body,
    h1, h2, h3, h4, h5, h6,
    p, li, label, small, strong, em,
    .hero-title, .section-title, .body-large, .section-lead,
    .card-summary, .w-summary, .nav-link, .btn,
    .filter-btn, .badge-pill, .link-pill,
    .case-label, .eyebrow, .meta-text, .w-date,
    .card-meta-line, .nrs-card-kicker {
      color: var(--text-primary) !important;
    }

    .eyebrow,
    .meta-text,
    .w-date,
    .card-meta-line,
    .case-label,
    .nrs-card-kicker,
    .clarity-snapshot dt,
    .nrs-project-detail-page .eyebrow,
    .nrs-project-detail-page .case-label,
    .badge-pill,
    .link-pill,
    .tag,
    .pill,
    .nrs-blog-tags b {
      color: var(--text-tertiary) !important;
    }

    a:not(.btn):not(.nav-link):not(.project-card):not(.writing-item) {
      color: var(--accent-blue) !important;
    }

    a:not(.btn):not(.nav-link):not(.project-card):not(.writing-item):hover {
      color: var(--accent-gold) !important;
    }

    .container,
    main.container,
    section,
    article,
    .hero-section,
    .section-container,
    .site-footer {
      background-image: none !important;
    }

    .nav-pill,
    .theme-toggle-btn,
    .mobile-logo,
    .mobile-nav-toggle,
    .mobile-nav-overlay {
      background: var(--bg-nav) !important;
      background-color: var(--bg-nav) !important;
      border-color: var(--border-faint) !important;
      color: var(--text-primary) !important;
    }

    .nav-link,
    .mobile-nav-links a {
      background: transparent !important;
      color: var(--text-primary) !important;
      border-color: transparent !important;
    }

    .nav-link:hover,
    .nav-link:focus-visible,
    .nav-link.active,
    .nav-link[aria-current='page'],
    .mobile-nav-links a:hover,
    .mobile-nav-links a.active,
    .mobile-nav-links a[aria-current='page'] {
      background: var(--accent-blue) !important;
      color: var(--bg-page) !important;
      border-color: var(--accent-gold) !important;
      box-shadow: none !important;
    }

    [data-theme='light'] .nav-link:hover,
    [data-theme='light'] .nav-link:focus-visible,
    [data-theme='light'] .nav-link.active,
    [data-theme='light'] .nav-link[aria-current='page'],
    [data-theme='light'] .mobile-nav-links a:hover,
    [data-theme='light'] .mobile-nav-links a.active,
    [data-theme='light'] .mobile-nav-links a[aria-current='page'] {
      background: var(--accent-blue) !important;
      color: var(--bg-page) !important;
      border-color: var(--accent-gold) !important;
    }

    .btn-primary,
    .footer-email-btn,
    .floating-resume-btn {
      background: var(--accent-blue) !important;
      background-color: var(--accent-blue) !important;
      border-color: var(--accent-blue) !important;
      color: var(--bg-page) !important;
    }

    [data-theme='light'] .btn-primary,
    [data-theme='light'] .footer-email-btn,
    [data-theme='light'] .floating-resume-btn {
      background: var(--accent-blue) !important;
      background-color: var(--accent-blue) !important;
      border-color: var(--accent-blue) !important;
      color: var(--bg-page) !important;
    }

    .btn-secondary,
    .badge-pill,
    .link-pill,
    .filter-btn,
    .hero-proof-strip span,
    .tag,
    .pill,
    .nrs-blog-tags b,
    .journey-card::before,
    .clarity-row-list article > span,
    .clarity-steps article > span {
      background: var(--bg-page) !important;
      background-color: var(--bg-page) !important;
      border-color: var(--border-faint) !important;
      color: var(--text-tertiary) !important;
    }

    [data-theme='light'] .btn-secondary,
    [data-theme='light'] .badge-pill,
    [data-theme='light'] .link-pill,
    [data-theme='light'] .filter-btn,
    [data-theme='light'] .hero-proof-strip span,
    [data-theme='light'] .tag,
    [data-theme='light'] .pill,
    [data-theme='light'] .nrs-blog-tags b,
    [data-theme='light'] .journey-card::before,
    [data-theme='light'] .clarity-row-list article > span,
    [data-theme='light'] .clarity-steps article > span {
      background: var(--bg-page) !important;
      background-color: var(--bg-page) !important;
      border-color: var(--border-faint) !important;
      color: var(--text-tertiary) !important;
    }

    .btn:hover,
    .footer-email-btn:hover,
    .floating-resume-btn:hover,
    .filter-btn:hover,
    .filter-btn.active,
    .badge-pill:hover,
    .link-pill:hover {
      background: var(--accent-gold) !important;
      background-color: var(--accent-gold) !important;
      border-color: var(--accent-gold) !important;
      color: #181818 !important;
    }

    .impact-card, .project-card, .writing-item, .journey-card,
    .comparison-card, .metric-plan-card, .story-card, .quote-card,
    .contact-form, .blog-note, .blog-toc, .blog-author-card, .blog-share-card,
    .nrs-uxcel-proof, .prototype-link-card, .embed-frame-wrapper,
    .nrs-case-proof, .snapshot-grid, .case-list li,
    .nrs-blog-proof-grid article,
    .clarity-row-list article,
    .clarity-steps article,
    .stat-card,
    .service-card,
    .related-card,
    .nrs-related-card {
      background: var(--bg-surface) !important;
      background-color: var(--bg-surface) !important;
      background-image: none !important;
      border-color: var(--border-faint) !important;
      box-shadow: none !important;
      color: var(--text-primary) !important;
    }

    .project-card:hover, .journey-card:hover, .writing-item:hover,
    .impact-card:hover, .nrs-blog-proof-grid article:hover,
    .clarity-row-list article:hover, .clarity-steps article:hover,
    .service-card:hover,
    .related-card:hover,
    .nrs-related-card:hover {
      background: var(--accent-cyan) !important;
      background-color: var(--accent-cyan) !important;
      background-image: none !important;
      border-color: var(--accent-gold) !important;
      color: #F7F7F7 !important;
    }

    [data-theme='light'] .project-card:hover,
    [data-theme='light'] .journey-card:hover,
    [data-theme='light'] .writing-item:hover,
    [data-theme='light'] .impact-card:hover,
    [data-theme='light'] .nrs-blog-proof-grid article:hover,
    [data-theme='light'] .clarity-row-list article:hover,
    [data-theme='light'] .clarity-steps article:hover,
    [data-theme='light'] .service-card:hover,
    [data-theme='light'] .related-card:hover,
    [data-theme='light'] .nrs-related-card:hover {
      background: var(--accent-gold) !important;
      background-color: var(--accent-gold) !important;
      border-color: var(--accent-blue) !important;
      color: #181818 !important;
    }

    .project-card:hover *, .journey-card:hover *, .writing-item:hover *,
    .impact-card:hover *, .nrs-blog-proof-grid article:hover *,
    .clarity-row-list article:hover *, .clarity-steps article:hover *,
    .service-card:hover *, .related-card:hover *, .nrs-related-card:hover * {
      color: inherit !important;
    }

    input,
    select,
    textarea,
    .search-input {
      background: var(--bg-page) !important;
      background-color: var(--bg-page) !important;
      border-color: var(--border-faint) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
    }

    input::placeholder,
    textarea::placeholder,
    .search-input::placeholder {
      color: var(--text-primary) !important;
    }

    input:focus,
    select:focus,
    textarea:focus,
    .search-input:focus {
      outline: 3px solid var(--accent-gold) !important;
      border-color: var(--border-strong) !important;
      background: var(--bg-page) !important;
      color: var(--text-primary) !important;
    }

    option {
      background: var(--bg-page) !important;
      color: var(--text-primary) !important;
    }

    hr,
    .section-divider,
    .clarity-section,
    .nrs-project-detail-page .section-container,
    .nrs-project-detail-page .hero-section,
    .site-footer {
      border-color: var(--nrs-divider) !important;
    }

    .w-arrow,
    .nrs-cursor-ring {
      background: transparent !important;
      border-color: var(--accent-blue) !important;
      box-shadow: none !important;
    }

    .w-arrow::before {
      border-color: var(--accent-blue) !important;
    }

    .w-arrow::after,
    .nrs-cursor-dot {
      background: var(--accent-blue) !important;
      background-color: var(--accent-blue) !important;
      box-shadow: none !important;
    }

    .site-footer,
    [data-theme='light'] .site-footer {
      background: var(--bg-page) !important;
      background-color: var(--bg-page) !important;
      background-image: none !important;
      border-top-color: var(--nrs-divider) !important;
    }
  `;

  document.head.appendChild(style);
}

function updatePortraitImages() {
  ['.hero-portrait-img', '.footer-portrait-img', '.profile-img'].forEach((selector) => {
    const image = $(selector);
    if (!image) return;

    image.src = PORTRAIT_IMG;
    image.onerror = () => {
      image.onerror = null;
      image.src = FALLBACK_PORTRAIT_IMG;
    };
  });
}

function setTheme(theme, button, storage) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  storage?.setItem('theme', nextTheme);

  if (button) {
    button.innerHTML = nextTheme === 'light' ? moonIcon : sunIcon;
    button.setAttribute('aria-label', nextTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }

  updatePortraitImages();
}

export function initTheme() {
  injectRequestedThemePalette();

  const button = $('#theme-toggle');
  const storage = getStorage();
  const savedTheme = storage?.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  setTheme(savedTheme || (systemPrefersLight ? 'light' : 'dark'), button, storage);

  button?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme === 'light' ? 'dark' : 'light', button, storage);
  });
}
