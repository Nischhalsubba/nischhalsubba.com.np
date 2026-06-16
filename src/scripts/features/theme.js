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
      --bg-page: #121212 !important;
      --bg-surface: #121212 !important;
      --bg-surface-2: #444444 !important;
      --bg-pill: #121212 !important;
      --bg-nav: #121212 !important;
      --text-primary: #E0E0E0 !important;
      --text-secondary: #B0B0B0 !important;
      --text-tertiary: #888888 !important;
      --text-soft: #888888 !important;
      --accent-blue: #888888 !important;
      --accent-cyan: #B0B0B0 !important;
      --accent-gold: #E0E0E0 !important;
      --accent-glow: #888888 !important;
      --border-faint: #444444 !important;
      --border-strong: #888888 !important;
      --nrs-divider: #444444 !important;
      --shadow-card: none !important;
      --shadow-soft: none !important;
    }

    [data-theme='light'] {
      --bg-page: #E0E0E0 !important;
      --bg-surface: #E0E0E0 !important;
      --bg-surface-2: #B0B0B0 !important;
      --bg-pill: #E0E0E0 !important;
      --bg-nav: #E0E0E0 !important;
      --text-primary: #121212 !important;
      --text-secondary: #444444 !important;
      --text-tertiary: #888888 !important;
      --text-soft: #888888 !important;
      --accent-blue: #444444 !important;
      --accent-cyan: #888888 !important;
      --accent-gold: #121212 !important;
      --accent-glow: #444444 !important;
      --border-faint: #B0B0B0 !important;
      --border-strong: #444444 !important;
      --nrs-divider: #B0B0B0 !important;
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
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    .hero-title,
    .section-title,
    .nav-link,
    .btn {
      color: var(--text-primary) !important;
    }

    p,
    li,
    label,
    .body-large,
    .section-lead,
    .card-summary,
    .w-summary,
    .journey-card p,
    .project-card p,
    .writing-item p {
      color: var(--text-secondary) !important;
    }

    .eyebrow,
    .meta-text,
    .w-date,
    .card-meta-line,
    .case-label,
    .nrs-card-kicker,
    .badge-pill,
    .link-pill,
    .tag,
    .pill,
    .nrs-blog-tags b {
      color: var(--text-tertiary) !important;
    }

    a {
      color: var(--text-primary) !important;
    }

    a:hover {
      color: var(--text-tertiary) !important;
    }

    .nav-pill,
    .theme-toggle-btn,
    .mobile-logo,
    .mobile-nav-toggle,
    .mobile-nav-overlay,
    .site-footer {
      background: var(--bg-nav) !important;
      background-color: var(--bg-nav) !important;
      border-color: var(--border-faint) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
    }

    .nav-link,
    .mobile-nav-links a {
      background: transparent !important;
      color: var(--text-secondary) !important;
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
      border-color: var(--border-strong) !important;
      box-shadow: none !important;
    }

    [data-theme='light'] .nav-link:hover,
    [data-theme='light'] .nav-link:focus-visible,
    [data-theme='light'] .nav-link.active,
    [data-theme='light'] .nav-link[aria-current='page'] {
      background: var(--text-primary) !important;
      color: var(--bg-page) !important;
    }

    .btn-primary,
    .footer-email-btn,
    .floating-resume-btn {
      background: var(--text-primary) !important;
      background-color: var(--text-primary) !important;
      border-color: var(--text-primary) !important;
      color: var(--bg-page) !important;
      box-shadow: none !important;
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
      box-shadow: none !important;
    }

    .btn:hover,
    .footer-email-btn:hover,
    .floating-resume-btn:hover,
    .filter-btn:hover,
    .filter-btn.active,
    .badge-pill:hover,
    .link-pill:hover {
      background: var(--accent-blue) !important;
      background-color: var(--accent-blue) !important;
      border-color: var(--accent-blue) !important;
      color: var(--bg-page) !important;
      box-shadow: none !important;
    }

    .impact-card,
    .project-card,
    .writing-item,
    .journey-card,
    .comparison-card,
    .metric-plan-card,
    .story-card,
    .quote-card,
    .contact-form,
    .blog-note,
    .blog-toc,
    .blog-author-card,
    .blog-share-card,
    .nrs-uxcel-proof,
    .prototype-link-card,
    .embed-frame-wrapper,
    .nrs-case-proof,
    .snapshot-grid,
    .case-list li,
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

    .project-card:hover,
    .journey-card:hover,
    .writing-item:hover,
    .impact-card:hover,
    .nrs-blog-proof-grid article:hover,
    .clarity-row-list article:hover,
    .clarity-steps article:hover,
    .service-card:hover,
    .related-card:hover,
    .nrs-related-card:hover {
      background: var(--bg-surface-2) !important;
      background-color: var(--bg-surface-2) !important;
      background-image: none !important;
      border-color: var(--border-strong) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
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
      color: var(--text-tertiary) !important;
    }

    input:focus,
    select:focus,
    textarea:focus,
    .search-input:focus {
      outline: 3px solid var(--border-faint) !important;
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
