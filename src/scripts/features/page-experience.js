const PAGE_EXPERIENCE_STYLE_ID = 'nrs-page-experience-style';
const SCROLL_BAR_ID = 'nrs-scroll-progress';

function ensurePageExperienceStyle() {
  let style = document.getElementById(PAGE_EXPERIENCE_STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = PAGE_EXPERIENCE_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    html {
      scroll-behavior: smooth;
    }

    #${SCROLL_BAR_ID} {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2147483647;
      width: 100%;
      height: 3px;
      pointer-events: none;
      transform: scaleX(0);
      transform-origin: left center;
      opacity: 0;
      background: var(--accent, #888888);
      transition: opacity 160ms ease, background-color 180ms ease;
      will-change: transform, opacity;
    }

    #${SCROLL_BAR_ID}.is-active {
      opacity: 1;
    }

    html[data-theme='light'] #${SCROLL_BAR_ID} {
      background: #444444 !important;
    }

    html[data-theme='dark'] #${SCROLL_BAR_ID} {
      background: #E0E0E0 !important;
    }

    body {
      opacity: 0;
      transform: translate3d(0, 14px, 0);
      transition: opacity 520ms cubic-bezier(.16, 1, .3, 1), transform 520ms cubic-bezier(.16, 1, .3, 1);
    }

    body.nrs-page-visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    body.nrs-page-exiting {
      opacity: 0;
      transform: translate3d(0, -10px, 0);
      transition-duration: 220ms;
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      body,
      body.nrs-page-visible,
      body.nrs-page-exiting {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }

      #${SCROLL_BAR_ID} {
        transition: none !important;
      }
    }
  `;
}

function ensureScrollProgressBar() {
  let bar = document.getElementById(SCROLL_BAR_ID);
  if (!bar) {
    bar = document.createElement('div');
    bar.id = SCROLL_BAR_ID;
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
  }
  return bar;
}

function updateScrollProgress() {
  const bar = ensureScrollProgressBar();
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  bar.style.transform = `scaleX(${progress})`;
  bar.classList.toggle('is-active', progress > 0.01 && progress < 0.995);
}

function initPageTransitions() {
  requestAnimationFrame(() => document.body.classList.add('nrs-page-visible'));

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    const isSameOrigin = url.origin === window.location.origin;
    const isModifiedClick = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    const shouldSkip =
      !isSameOrigin ||
      isModifiedClick ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      link.href.startsWith('mailto:') ||
      link.href.startsWith('tel:') ||
      url.href === window.location.href ||
      url.pathname === window.location.pathname && url.hash;

    if (shouldSkip) return;

    event.preventDefault();
    document.body.classList.add('nrs-page-exiting');
    window.setTimeout(() => {
      window.location.href = url.href;
    }, 180);
  });
}

export function initPageExperience() {
  ensurePageExperienceStyle();
  ensureScrollProgressBar();
  updateScrollProgress();
  initPageTransitions();

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('nrs-page-exiting');
    document.body.classList.add('nrs-page-visible');
    updateScrollProgress();
  });
}
