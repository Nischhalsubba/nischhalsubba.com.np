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
      --border-faint: #444444 !important;
      --border-strong: #888888 !important;
      --nrs-divider: #444444 !important;
      --shadow-card: none !important;
      --shadow-soft: none !important;
      --motion-ease: cubic-bezier(.2, .8, .2, 1);
      --motion-ease-out: cubic-bezier(.16, 1, .3, 1);
      --motion-fast: 180ms;
      --motion-base: 340ms;
      --motion-slow: 620ms;
    }

    html[data-theme='light'] {
      --bg-page: #F2F0EF !important;
      --bg-surface: #F2F0EF !important;
      --bg-surface-2: #CCCBCA !important;
      --bg-pill: #F2F0EF !important;
      --bg-nav: #F2F0EF !important;
      --text-primary: #807E7E !important;
      --text-secondary: #807E7E !important;
      --text-tertiary: #A6A4A4 !important;
      --text-soft: #A6A4A4 !important;
      --accent-blue: #807E7E !important;
      --accent-cyan: #A6A4A4 !important;
      --accent-gold: #CCCBCA !important;
      --border-faint: #CCCBCA !important;
      --border-strong: #807E7E !important;
      --nrs-divider: #CCCBCA !important;
      color-scheme: light;
    }

    html,
    body,
    html[data-theme='dark'],
    html[data-theme='dark'] body {
      background: #121212 !important;
      background-color: #121212 !important;
      background-image: none !important;
      color: #E0E0E0 !important;
      font-family: var(--font-sans) !important;
    }

    html[data-theme='light'],
    html[data-theme='light'] body,
    html[data-theme='light'] body.nrs-uniform-shell,
    html[data-theme='light'] .nrs-uniform-shell,
    html[data-theme='light'] main,
    html[data-theme='light'] main.container {
      background: #F2F0EF !important;
      background-color: #F2F0EF !important;
      background-image: none !important;
      color: #807E7E !important;
    }

    body::before,
    body::after,
    html[data-theme='light'] body::before,
    html[data-theme='light'] body::after,
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

    body,
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
      background: var(--accent-blue) !important;
      color: var(--bg-page) !important;
      border-color: var(--border-strong) !important;
      box-shadow: none !important;
      filter: none !important;
    }

    .btn-primary,
    .footer-email-btn,
    .floating-resume-btn {
      background: var(--text-primary) !important;
      background-color: var(--text-primary) !important;
      border-color: var(--text-primary) !important;
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
      background: var(--bg-page) !important;
      background-color: var(--bg-page) !important;
      border-color: var(--border-faint) !important;
      color: var(--text-tertiary) !important;
      box-shadow: none !important;
      filter: none !important;
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
      filter: none !important;
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
      filter: none !important;
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
      filter: none !important;
    }

    html[data-theme='light'] .nrs-inner-page .hero-section,
    html[data-theme='light'] body.nrs-inner-page .hero-section,
    html[data-theme='light'] .nrs-inner-page main.container > .hero-section,
    html[data-theme='light'] body.nrs-inner-page main.container > .hero-section,
    html[data-theme='light'] main.container > .hero-section,
    html[data-theme='light'] body.nrs-uniform-shell main.container > .hero-section,
    html[data-theme='light'] .nrs-project-detail-page .section-container,
    html[data-theme='light'] body.nrs-project-detail-page .section-container,
    html[data-theme='light'] .nrs-blog-detail-page .section-container,
    html[data-theme='light'] body.nrs-blog-detail-page .section-container,
    html[data-theme='light'] .nrs-service-page .section-container,
    html[data-theme='light'] body.nrs-service-page .section-container,
    html[data-theme='light'] .nrs-inner-page .section-container,
    html[data-theme='light'] body.nrs-inner-page .section-container,
    html[data-theme='light'] main.container > section,
    html[data-theme='light'] body.nrs-uniform-shell main.container > section,
    html[data-theme='light'] article.section-container,
    html[data-theme='light'] body.nrs-uniform-shell article.section-container,
    html[data-theme='light'] .nrs-case-hero,
    html[data-theme='light'] .case-hero,
    html[data-theme='light'] .case-hero-container,
    html[data-theme='light'] .case-hero-panel,
    html[data-theme='light'] .project-hero,
    html[data-theme='light'] .project-hero-inner,
    html[data-theme='light'] .nrs-blog-detail-surface,
    html[data-theme='light'] .nrs-article-frame,
    html[data-theme='light'] .nrs-blog-hub-shell,
    html[data-theme='light'] .clarity-hero {
      background: #F2F0EF !important;
      background-color: #F2F0EF !important;
      background-image: none !important;
      border-color: #CCCBCA !important;
      box-shadow: none !important;
      filter: none !important;
      color: #807E7E !important;
    }

    html[data-theme='light'] .nrs-inner-page .hero-section::before,
    html[data-theme='light'] .hero-section::before,
    html[data-theme='light'] .section-container::before,
    html[data-theme='light'] main.container > section::before {
      background: transparent !important;
      background-image: none !important;
      opacity: 0 !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] .snapshot-grid > div,
    html[data-theme='light'] .journey-card,
    html[data-theme='light'] .comparison-card,
    html[data-theme='light'] .metric-plan-card,
    html[data-theme='light'] .story-card,
    html[data-theme='light'] .quote-card,
    html[data-theme='light'] .prototype-link-card,
    html[data-theme='light'] .blog-card-modern,
    html[data-theme='light'] .writing-item,
    html[data-theme='light'] .achieve-item,
    html[data-theme='light'] .impact-card,
    html[data-theme='light'] .contact-form,
    html[data-theme='light'] .blog-note,
    html[data-theme='light'] .blog-author-card,
    html[data-theme='light'] .blog-share-card,
    html[data-theme='light'] .blog-toc,
    html[data-theme='light'] .link-pill,
    html[data-theme='light'] .filter-btn,
    html[data-theme='light'] .case-list li,
    html[data-theme='light'] .nrs-blog-proof-grid article,
    html[data-theme='light'] .clarity-row-list article,
    html[data-theme='light'] .clarity-steps article,
    html[data-theme='light'] .stat-card,
    html[data-theme='light'] .service-card,
    html[data-theme='light'] .related-card,
    html[data-theme='light'] .nrs-related-card,
    html[data-theme='light'] .case-hero-img-container,
    html[data-theme='light'] .blog-hero-img-container,
    html[data-theme='light'] .embed-frame-wrapper,
    html[data-theme='light'] .case-hero-img,
    html[data-theme='light'] .case-hero-img-container img,
    html[data-theme='light'] .nrs-inner-page .section-container > .container > img,
    html[data-theme='light'] .nrs-article img {
      background: #F2F0EF !important;
      background-color: #F2F0EF !important;
      background-image: none !important;
      border-color: #CCCBCA !important;
      box-shadow: none !important;
      filter: none !important;
      color: #807E7E !important;
    }

    html[data-theme='light'] *,
    html[data-theme='light'] *::before,
    html[data-theme='light'] *::after {
      text-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] h1,
    html[data-theme='light'] h2,
    html[data-theme='light'] h3,
    html[data-theme='light'] h4,
    html[data-theme='light'] h5,
    html[data-theme='light'] h6,
    html[data-theme='light'] p,
    html[data-theme='light'] li,
    html[data-theme='light'] a,
    html[data-theme='light'] label,
    html[data-theme='light'] button,
    html[data-theme='light'] .btn,
    html[data-theme='light'] .nav-link,
    html[data-theme='light'] .hero-title,
    html[data-theme='light'] .section-title,
    html[data-theme='light'] .body-large,
    html[data-theme='light'] .section-lead {
      color: #807E7E !important;
    }

    html[data-theme='light'] .eyebrow,
    html[data-theme='light'] .meta-text,
    html[data-theme='light'] .w-date,
    html[data-theme='light'] .case-label,
    html[data-theme='light'] .badge-pill,
    html[data-theme='light'] .link-pill,
    html[data-theme='light'] .tag,
    html[data-theme='light'] .pill {
      color: #A6A4A4 !important;
    }

    html[data-theme='light'] .nav-link:hover,
    html[data-theme='light'] .nav-link:focus-visible,
    html[data-theme='light'] .nav-link.active,
    html[data-theme='light'] .nav-link[aria-current='page'],
    html[data-theme='light'] .btn-primary,
    html[data-theme='light'] .btn:hover,
    html[data-theme='light'] .filter-btn:hover,
    html[data-theme='light'] .filter-btn.active {
      background: #807E7E !important;
      background-color: #807E7E !important;
      border-color: #807E7E !important;
      color: #F2F0EF !important;
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
      filter: none !important;
      font-family: var(--font-sans) !important;
    }

    html[data-theme='light'] input,
    html[data-theme='light'] select,
    html[data-theme='light'] textarea,
    html[data-theme='light'] .search-input {
      background: #F2F0EF !important;
      background-color: #F2F0EF !important;
      border-color: #CCCBCA !important;
      color: #807E7E !important;
    }

    input::placeholder,
    textarea::placeholder,
    .search-input::placeholder { color: var(--text-tertiary) !important; }

    html[data-theme='light'] input::placeholder,
    html[data-theme='light'] textarea::placeholder,
    html[data-theme='light'] .search-input::placeholder { color: #A6A4A4 !important; }

    input:focus,
    select:focus,
    textarea:focus,
    .search-input:focus {
      outline: 3px solid var(--border-faint) !important;
      border-color: var(--border-strong) !important;
      background: var(--bg-page) !important;
      color: var(--text-primary) !important;
    }

    html[data-theme='light'] input:focus,
    html[data-theme='light'] select:focus,
    html[data-theme='light'] textarea:focus,
    html[data-theme='light'] .search-input:focus {
      outline-color: #CCCBCA !important;
      border-color: #807E7E !important;
      background: #F2F0EF !important;
      color: #807E7E !important;
    }

    option { background: var(--bg-page) !important; color: var(--text-primary) !important; }
    html[data-theme='light'] option { background: #F2F0EF !important; color: #807E7E !important; }

    hr,
    .section-divider,
    .clarity-section,
    .nrs-project-detail-page .section-container,
    .nrs-project-detail-page .hero-section,
    .site-footer { border-color: var(--nrs-divider) !important; }

    html[data-theme='light'] hr,
    html[data-theme='light'] .section-divider,
    html[data-theme='light'] .clarity-section,
    html[data-theme='light'] .nrs-project-detail-page .section-container,
    html[data-theme='light'] .nrs-project-detail-page .hero-section,
    html[data-theme='light'] .site-footer { border-color: #CCCBCA !important; }

    .w-arrow,
    .nrs-cursor-ring {
      background: transparent !important;
      border-color: var(--accent-blue) !important;
      box-shadow: none !important;
      filter: none !important;
    }

    .w-arrow::before { border-color: var(--accent-blue) !important; }

    .w-arrow::after,
    .nrs-cursor-dot {
      background: var(--accent-blue) !important;
      background-color: var(--accent-blue) !important;
      box-shadow: none !important;
      filter: none !important;
    }

    html[data-theme='light'] .w-arrow,
    html[data-theme='light'] .nrs-cursor-ring { border-color: #807E7E !important; }
    html[data-theme='light'] .w-arrow::before { border-color: #807E7E !important; }
    html[data-theme='light'] .w-arrow::after,
    html[data-theme='light'] .nrs-cursor-dot { background: #807E7E !important; background-color: #807E7E !important; }

    @keyframes nrsPageEnter {
      from { opacity: 0; transform: translate3d(0, 18px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }

    @keyframes nrsRevealUp {
      from { opacity: 0; transform: translate3d(0, 28px, 0); }
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
        background-color var(--motion-base) var(--motion-ease),
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
