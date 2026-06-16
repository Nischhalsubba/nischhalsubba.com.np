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
      --bg-page: #181818 !important;
      --bg-surface: rgba(247, 247, 247, 0.07) !important;
      --bg-surface-2: rgba(247, 247, 247, 0.105) !important;
      --bg-pill: rgba(247, 247, 247, 0.08) !important;
      --bg-nav: rgba(24, 24, 24, 0.88) !important;
      --text-primary: #F7F7F7 !important;
      --text-secondary: rgba(247, 247, 247, 0.82) !important;
      --text-tertiary: rgba(247, 247, 247, 0.58) !important;
      --text-soft: rgba(247, 247, 247, 0.42) !important;
      --accent-blue: #FF5722 !important;
      --accent-cyan: #673AB7 !important;
      --accent-gold: #FFEB3B !important;
      --accent-glow: rgba(255, 87, 34, 0.24) !important;
      --border-faint: rgba(247, 247, 247, 0.14) !important;
      --border-strong: rgba(255, 87, 34, 0.48) !important;
      --nrs-divider: rgba(247, 247, 247, 0.11) !important;
    }

    [data-theme='light'] {
      --bg-page: #F7F7F7 !important;
      --bg-surface: #FFFFFF !important;
      --bg-surface-2: #ECECEC !important;
      --bg-pill: #FFFFFF !important;
      --bg-nav: rgba(247, 247, 247, 0.92) !important;
      --text-primary: #181818 !important;
      --text-secondary: rgba(24, 24, 24, 0.78) !important;
      --text-tertiary: rgba(24, 24, 24, 0.58) !important;
      --text-soft: rgba(24, 24, 24, 0.42) !important;
      --accent-blue: #673AB7 !important;
      --accent-cyan: #FF5722 !important;
      --accent-gold: #FFEB3B !important;
      --accent-glow: rgba(103, 58, 183, 0.18) !important;
      --border-faint: rgba(24, 24, 24, 0.14) !important;
      --border-strong: rgba(103, 58, 183, 0.42) !important;
      --nrs-divider: rgba(24, 24, 24, 0.11) !important;
      color-scheme: light;
    }

    body {
      background:
        radial-gradient(circle at 22% 0%, rgba(255, 87, 34, 0.20), transparent 26%),
        radial-gradient(circle at 78% 8%, rgba(103, 58, 183, 0.28), transparent 32%),
        linear-gradient(180deg, #202020 0%, #181818 48%, #101010 100%) !important;
      color: var(--text-primary) !important;
    }

    [data-theme='light'] body {
      background:
        radial-gradient(circle at 18% 0%, rgba(255, 87, 34, 0.10), transparent 26%),
        radial-gradient(circle at 78% 8%, rgba(103, 58, 183, 0.12), transparent 32%),
        linear-gradient(180deg, #FFFFFF 0%, #F7F7F7 52%, #ECECEC 100%) !important;
      color: var(--text-primary) !important;
    }

    body::before {
      background-image:
        linear-gradient(rgba(247, 247, 247, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(247, 247, 247, 0.03) 1px, transparent 1px) !important;
      opacity: 0.22 !important;
    }

    body::after {
      background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.44) 72%, rgba(0, 0, 0, 0.88) 100%) !important;
    }

    [data-theme='light'] body::before,
    [data-theme='light'] body::after,
    [data-theme='light'] #grid-canvas {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
    }

    .nav-pill,
    .theme-toggle-btn,
    .mobile-logo,
    .mobile-nav-toggle {
      background: var(--bg-nav) !important;
      border-color: var(--border-faint) !important;
      color: var(--text-primary) !important;
    }

    .nav-link:hover,
    .nav-link:focus-visible,
    .nav-link.active,
    .nav-link[aria-current='page'],
    .mobile-nav-links a:hover,
    .mobile-nav-links a.active,
    .mobile-nav-links a[aria-current='page'] {
      background: rgba(255, 87, 34, 0.18) !important;
      color: #F7F7F7 !important;
      box-shadow: inset 0 0 0 1px rgba(255, 235, 59, 0.22) !important;
    }

    [data-theme='light'] .nav-link:hover,
    [data-theme='light'] .nav-link:focus-visible,
    [data-theme='light'] .nav-link.active,
    [data-theme='light'] .nav-link[aria-current='page'],
    [data-theme='light'] .mobile-nav-links a:hover,
    [data-theme='light'] .mobile-nav-links a.active,
    [data-theme='light'] .mobile-nav-links a[aria-current='page'] {
      background: rgba(255, 235, 59, 0.72) !important;
      color: #181818 !important;
      box-shadow: inset 0 0 0 1px rgba(103, 58, 183, 0.20) !important;
    }

    .btn-primary,
    .footer-email-btn,
    .floating-resume-btn {
      background: #FF5722 !important;
      color: #181818 !important;
      border-color: rgba(255, 87, 34, 0.82) !important;
      box-shadow: 0 18px 48px rgba(255, 87, 34, 0.22) !important;
    }

    .btn-secondary,
    .badge-pill,
    .link-pill,
    .filter-btn {
      background: rgba(247, 247, 247, 0.06) !important;
      color: var(--text-primary) !important;
      border-color: var(--border-faint) !important;
    }

    .btn:hover,
    .footer-email-btn:hover,
    .floating-resume-btn:hover,
    .filter-btn:hover,
    .filter-btn.active {
      background: #FFEB3B !important;
      color: #181818 !important;
      border-color: #FFEB3B !important;
      box-shadow: 0 18px 48px rgba(255, 235, 59, 0.18) !important;
    }

    [data-theme='light'] .btn-primary,
    [data-theme='light'] .footer-email-btn,
    [data-theme='light'] .floating-resume-btn {
      background: #673AB7 !important;
      color: #F7F7F7 !important;
      border-color: rgba(103, 58, 183, 0.72) !important;
      box-shadow: 0 18px 44px rgba(103, 58, 183, 0.18) !important;
    }

    [data-theme='light'] .btn-secondary,
    [data-theme='light'] .badge-pill,
    [data-theme='light'] .link-pill,
    [data-theme='light'] .filter-btn {
      background: #FFFFFF !important;
      color: #181818 !important;
      border-color: rgba(24, 24, 24, 0.14) !important;
    }

    [data-theme='light'] .btn:hover,
    [data-theme='light'] .footer-email-btn:hover,
    [data-theme='light'] .floating-resume-btn:hover,
    [data-theme='light'] .filter-btn:hover,
    [data-theme='light'] .filter-btn.active {
      background: #FFEB3B !important;
      color: #181818 !important;
      border-color: rgba(24, 24, 24, 0.26) !important;
      box-shadow: 0 18px 40px rgba(103, 58, 183, 0.10) !important;
    }

    .impact-card, .project-card, .writing-item, .journey-card,
    .comparison-card, .metric-plan-card, .story-card, .quote-card,
    .contact-form, .blog-note, .blog-toc, .blog-author-card, .blog-share-card,
    .nrs-uxcel-proof, .prototype-link-card, .embed-frame-wrapper,
    .nrs-case-proof, .snapshot-grid, .case-list li,
    .nrs-blog-proof-grid article,
    .clarity-row-list article,
    .clarity-steps article {
      background:
        linear-gradient(145deg, rgba(103, 58, 183, 0.16), rgba(247, 247, 247, 0.035)) !important;
      border-color: rgba(247, 247, 247, 0.14) !important;
    }

    .project-card:hover, .journey-card:hover, .writing-item:hover,
    .impact-card:hover, .nrs-blog-proof-grid article:hover,
    .clarity-row-list article:hover, .clarity-steps article:hover {
      background:
        linear-gradient(145deg, rgba(255, 87, 34, 0.18), rgba(103, 58, 183, 0.14)) !important;
      border-color: rgba(255, 235, 59, 0.46) !important;
    }

    [data-theme='light'] .impact-card,
    [data-theme='light'] .project-card,
    [data-theme='light'] .writing-item,
    [data-theme='light'] .journey-card,
    [data-theme='light'] .comparison-card,
    [data-theme='light'] .metric-plan-card,
    [data-theme='light'] .story-card,
    [data-theme='light'] .quote-card,
    [data-theme='light'] .contact-form,
    [data-theme='light'] .blog-note,
    [data-theme='light'] .blog-toc,
    [data-theme='light'] .blog-author-card,
    [data-theme='light'] .blog-share-card,
    [data-theme='light'] .nrs-uxcel-proof,
    [data-theme='light'] .prototype-link-card,
    [data-theme='light'] .embed-frame-wrapper,
    [data-theme='light'] .nrs-case-proof,
    [data-theme='light'] .snapshot-grid,
    [data-theme='light'] .case-list li,
    [data-theme='light'] .nrs-blog-proof-grid article,
    [data-theme='light'] .clarity-row-list article,
    [data-theme='light'] .clarity-steps article {
      background: #FFFFFF !important;
      border-color: rgba(24, 24, 24, 0.13) !important;
      box-shadow: 0 18px 42px rgba(24, 24, 24, 0.06) !important;
    }

    [data-theme='light'] .project-card:hover,
    [data-theme='light'] .journey-card:hover,
    [data-theme='light'] .writing-item:hover,
    [data-theme='light'] .impact-card:hover,
    [data-theme='light'] .nrs-blog-proof-grid article:hover,
    [data-theme='light'] .clarity-row-list article:hover,
    [data-theme='light'] .clarity-steps article:hover {
      background: #FFEB3B !important;
      border-color: rgba(103, 58, 183, 0.36) !important;
      box-shadow: 0 20px 48px rgba(103, 58, 183, 0.10) !important;
    }

    .hero-proof-strip span, .tag, .pill, .nrs-blog-tags b,
    .journey-card::before, .clarity-row-list article > span, .clarity-steps article > span {
      background: rgba(255, 87, 34, 0.12) !important;
      border-color: rgba(255, 87, 34, 0.32) !important;
      color: #FFEB3B !important;
    }

    [data-theme='light'] .hero-proof-strip span,
    [data-theme='light'] .tag,
    [data-theme='light'] .pill,
    [data-theme='light'] .nrs-blog-tags b,
    [data-theme='light'] .journey-card::before,
    [data-theme='light'] .clarity-row-list article > span,
    [data-theme='light'] .clarity-steps article > span {
      background: rgba(103, 58, 183, 0.08) !important;
      border-color: rgba(103, 58, 183, 0.22) !important;
      color: #673AB7 !important;
    }

    input:focus, select:focus, textarea:focus, .search-input:focus {
      outline-color: rgba(255, 87, 34, 0.30) !important;
      border-color: #FF5722 !important;
    }

    [data-theme='light'] input:focus,
    [data-theme='light'] select:focus,
    [data-theme='light'] textarea:focus,
    [data-theme='light'] .search-input:focus {
      outline-color: rgba(103, 58, 183, 0.24) !important;
      border-color: #673AB7 !important;
    }

    .w-arrow,
    .nrs-cursor-ring {
      border-color: rgba(255, 87, 34, 0.56) !important;
    }

    .w-arrow::before { border-color: #FF5722 !important; }
    .w-arrow::after, .nrs-cursor-dot { background: #FF5722 !important; }

    [data-theme='light'] .w-arrow,
    [data-theme='light'] .nrs-cursor-ring {
      border-color: rgba(103, 58, 183, 0.48) !important;
    }

    [data-theme='light'] .w-arrow::before { border-color: #673AB7 !important; }
    [data-theme='light'] .w-arrow::after,
    [data-theme='light'] .nrs-cursor-dot { background: #673AB7 !important; }
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
