import { $, getStorage } from '../utils/dom.js';

const PORTRAIT_IMG = 'https://i.imgur.com/oFHdPUS.png';
const FALLBACK_PORTRAIT_IMG = '/assets/images/portrait.svg';
const sunIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const moonIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 109 9 7 7 0 01-9-9z"/></svg>';

function loadRequestedFonts() {
  if (document.getElementById('nrs-requested-fonts')) return;

  const preconnectFonts = document.createElement('link');
  preconnectFonts.rel = 'preconnect';
  preconnectFonts.href = 'https://fonts.googleapis.com';

  const preconnectStatic = document.createElement('link');
  preconnectStatic.rel = 'preconnect';
  preconnectStatic.href = 'https://fonts.gstatic.com';
  preconnectStatic.crossOrigin = '';

  const fontLink = document.createElement('link');
  fontLink.id = 'nrs-requested-fonts';
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Roboto:wght@300;400;500;700;900&display=swap';

  document.head.append(preconnectFonts, preconnectStatic, fontLink);
}

function ensureThemeStyle(id, css) {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement('style');
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

function injectRequestedThemePalette() {
  ensureThemeStyle('nrs-requested-theme-palette', `
    :root {
      --font-serif: 'Playfair Display', Georgia, 'Times New Roman', serif !important;
      --font-sans: 'Roboto', Arial, Helvetica, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      --bg-page: #121212 !important;
      --text-primary: #E0E0E0 !important;
      --text-secondary: #B0B0B0 !important;
      --text-tertiary: #888888 !important;
      --accent: #888888 !important;
      --border-faint: #444444 !important;
      --border-strong: #888888 !important;
      --nrs-divider: #444444 !important;
      --motion-ease: cubic-bezier(.2, .8, .2, 1);
      --motion-ease-out: cubic-bezier(.16, 1, .3, 1);
      --motion-fast: 180ms;
      --motion-base: 340ms;
      --motion-slow: 620ms;
    }

    html[data-theme='light'] {
      --bg-page: #FFFFFF !important;
      --text-primary: #1A1A1A !important;
      --text-secondary: #555555 !important;
      --text-tertiary: #555555 !important;
      --accent: #444444 !important;
      --border-faint: #E5E5E5 !important;
      --border-strong: #444444 !important;
      --nrs-divider: #E5E5E5 !important;
      color-scheme: light;
    }

    html,
    body {
      background: var(--bg-page) !important;
      background-color: var(--bg-page) !important;
      background-image: none !important;
      color: var(--text-primary) !important;
      font-family: var(--font-sans) !important;
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
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
    }

    body *:not(img):not(video):not(canvas):not(svg):not(path) {
      background-image: none !important;
      text-shadow: none !important;
    }

    h1,
    h2,
    .hero-title,
    .section-title,
    .w-title,
    .card-content h3,
    .footer-cta h2,
    .nrs-related-pages h2,
    .nrs-blog-detail-page article.section-container > h1,
    .nrs-blog-detail-page article.section-container > .hero-title {
      font-family: var(--font-serif) !important;
      font-weight: 600 !important;
      letter-spacing: -0.045em !important;
      color: var(--text-primary) !important;
    }

    h3,
    h4,
    h5,
    h6,
    p,
    li,
    label,
    small,
    strong,
    em,
    button,
    input,
    select,
    textarea,
    .body-large,
    .section-lead,
    .card-summary,
    .w-summary,
    .nav-link,
    .btn,
    .filter-btn,
    .badge-pill,
    .link-pill,
    .case-label,
    .eyebrow,
    .meta-text,
    .w-date,
    .card-meta-line,
    .nrs-card-kicker,
    .journey-card h3,
    .clarity-row-list h3,
    .clarity-steps h3 {
      font-family: var(--font-sans) !important;
    }

    h3,
    h4,
    h5,
    h6,
    .nav-link,
    .btn,
    a {
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

    a:hover { color: var(--text-tertiary) !important; }

    main,
    main.container,
    .container,
    section,
    article,
    footer,
    header,
    .hero-section,
    .section-container,
    .nrs-inner-page .hero-section,
    .nrs-inner-page .section-container,
    .nrs-project-detail-page .section-container,
    .nrs-blog-detail-page .section-container,
    .nrs-service-page .section-container,
    .nrs-case-hero,
    .case-hero,
    .case-hero-container,
    .case-hero-panel,
    .project-hero,
    .project-hero-inner,
    .nrs-blog-detail-surface,
    .nrs-article-frame,
    .nrs-blog-hub-shell,
    .clarity-hero,
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
    .snapshot-grid > div,
    .case-list li,
    .nrs-blog-proof-grid article,
    .clarity-row-list article,
    .clarity-steps article,
    .stat-card,
    .service-card,
    .related-card,
    .nrs-related-card,
    .blog-card-modern,
    .achieve-item,
    .case-hero-img-container,
    .blog-hero-img-container,
    .case-hero-img,
    .nrs-article img,
    .site-footer {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
      border-color: var(--border-faint) !important;
    }

    main::before,
    main::after,
    section::before,
    section::after,
    article::before,
    article::after,
    .hero-section::before,
    .hero-section::after,
    .section-container::before,
    .section-container::after {
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      filter: none !important;
      opacity: 0 !important;
    }

    .nav-pill,
    .theme-toggle-btn,
    .mobile-logo,
    .mobile-nav-toggle,
    .mobile-nav-overlay {
      background: transparent !important;
      background-color: transparent !important;
      border-color: var(--border-faint) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
      filter: none !important;
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
      background: var(--accent) !important;
      background-color: var(--accent) !important;
      color: var(--bg-page) !important;
      border-color: var(--accent) !important;
      box-shadow: none !important;
      filter: none !important;
    }

    .btn-primary,
    .footer-email-btn,
    .floating-resume-btn,
    .btn:hover,
    .footer-email-btn:hover,
    .floating-resume-btn:hover,
    .filter-btn:hover,
    .filter-btn.active,
    .badge-pill:hover,
    .link-pill:hover {
      background: var(--accent) !important;
      background-color: var(--accent) !important;
      border-color: var(--accent) !important;
      color: var(--bg-page) !important;
      box-shadow: none !important;
      filter: none !important;
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
      background: transparent !important;
      background-color: transparent !important;
      border-color: var(--border-faint) !important;
      color: var(--text-tertiary) !important;
      box-shadow: none !important;
      filter: none !important;
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
      background: transparent !important;
      background-color: transparent !important;
      background-image: none !important;
      border-color: var(--border-strong) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
      filter: none !important;
    }

    input,
    select,
    textarea,
    .search-input {
      background: transparent !important;
      background-color: transparent !important;
      border-color: var(--border-faint) !important;
      color: var(--text-primary) !important;
      box-shadow: none !important;
      filter: none !important;
      font-family: var(--font-sans) !important;
    }

    input::placeholder,
    textarea::placeholder,
    .search-input::placeholder { color: var(--text-tertiary) !important; }

    input:focus,
    select:focus,
    textarea:focus,
    .search-input:focus {
      outline: 3px solid var(--border-faint) !important;
      border-color: var(--border-strong) !important;
      background: transparent !important;
      color: var(--text-primary) !important;
    }

    option { background: var(--bg-page) !important; color: var(--text-primary) !important; }
    hr,
    .section-divider,
    .clarity-section,
    .nrs-project-detail-page .section-container,
    .nrs-project-detail-page .hero-section,
    .site-footer { border-color: var(--nrs-divider) !important; }

    .w-arrow,
    .nrs-cursor-ring {
      background: transparent !important;
      border-color: var(--accent) !important;
      box-shadow: none !important;
      filter: none !important;
    }

    .w-arrow::before { border-color: var(--accent) !important; }

    .w-arrow::after,
    .nrs-cursor-dot {
      background: var(--accent) !important;
      background-color: var(--accent) !important;
      box-shadow: none !important;
      filter: none !important;
    }

    @keyframes nrsPageEnter {
      from { opacity: 0; transform: translate3d(0, 18px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }

    body.page-ready main,
    body.js-enabled main {
      animation: nrsPageEnter var(--motion-slow) var(--motion-ease-out) both;
    }

    .reveal-on-scroll,
    .project-card,
    .writing-item,
    .impact-card,
    .journey-card,
    .clarity-row-list article,
    .clarity-steps article,
    .nrs-blog-proof-grid article {
      transition:
        opacity var(--motion-slow) var(--motion-ease-out),
        transform var(--motion-slow) var(--motion-ease-out),
        border-color var(--motion-base) var(--motion-ease),
        color var(--motion-base) var(--motion-ease) !important;
      will-change: opacity, transform;
    }

    .motion-ready .reveal-on-scroll:not(.is-visible) {
      opacity: 0;
      transform: translate3d(0, 28px, 0);
    }

    .motion-ready .reveal-on-scroll.is-visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    .project-card:hover,
    .writing-item:hover,
    .impact-card:hover,
    .journey-card:hover,
    .clarity-row-list article:hover,
    .clarity-steps article:hover,
    .nrs-blog-proof-grid article:hover,
    .btn:hover,
    .filter-btn:hover,
    .nav-link:hover,
    .link-pill:hover {
      transform: translate3d(0, -4px, 0) !important;
    }

    .btn:active,
    .filter-btn:active,
    .nav-link:active,
    .project-card:active,
    .writing-item:active,
    .journey-card:active {
      transform: translate3d(0, -1px, 0) scale(.985) !important;
      transition-duration: 90ms !important;
    }

    .btn,
    .filter-btn,
    .nav-link,
    .link-pill,
    .badge-pill,
    .theme-toggle-btn,
    .mobile-nav-toggle,
    input,
    select,
    textarea,
    .search-input {
      transition:
        background-color var(--motion-fast) var(--motion-ease),
        border-color var(--motion-fast) var(--motion-ease),
        color var(--motion-fast) var(--motion-ease),
        transform var(--motion-fast) var(--motion-ease) !important;
    }

    :focus-visible {
      transition: outline-color var(--motion-fast) var(--motion-ease), outline-offset var(--motion-fast) var(--motion-ease) !important;
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .001ms !important;
      }
    }
  `);
}

function reinforceThemePalette() {
  requestAnimationFrame(injectRequestedThemePalette);
  window.setTimeout(injectRequestedThemePalette, 0);
  window.setTimeout(injectRequestedThemePalette, 250);
  window.setTimeout(injectRequestedThemePalette, 700);
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

  reinforceThemePalette();
  updatePortraitImages();
}

export function initTheme() {
  loadRequestedFonts();
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
