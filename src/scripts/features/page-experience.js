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
      position: fixed !important;
      inset: 0 auto auto 0 !important;
      z-index: 2147483647 !important;
      display: block !important;
      width: 100vw !important;
      height: 6px !important;
      min-height: 6px !important;
      max-height: 6px !important;
      pointer-events: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      background: rgba(255, 255, 255, 0.18) !important;
      transform: none !important;
      translate: none !important;
      scale: none !important;
      rotate: none !important;
      overflow: hidden !important;
      contain: paint !important;
      isolation: isolate !important;
      border: 0 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.10) !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    #${SCROLL_BAR_ID}::before {
      content: '' !important;
      position: absolute !important;
      inset: 0 auto 0 0 !important;
      display: block !important;
      width: 100% !important;
      height: 100% !important;
      transform: scaleX(var(--nrs-scroll-progress-scale, .02)) !important;
      transform-origin: left center !important;
      background: #E0E0E0 !important;
      transition: transform 80ms linear, background-color 180ms ease !important;
      will-change: transform !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    html[data-theme='light'] #${SCROLL_BAR_ID} {
      background: rgba(68, 68, 68, 0.18) !important;
      border-bottom-color: rgba(68, 68, 68, 0.10) !important;
    }

    html[data-theme='light'] #${SCROLL_BAR_ID}::before {
      background: #444444 !important;
    }

    html[data-theme='dark'] #${SCROLL_BAR_ID}::before,
    html:not([data-theme='light']) #${SCROLL_BAR_ID}::before {
      background: #E0E0E0 !important;
    }

    body {
      opacity: 1;
      transform: none !important;
    }

    body.nrs-page-visible {
      opacity: 1;
      transform: none !important;
    }

    body.nrs-page-exiting {
      opacity: 0;
      transform: none !important;
      transition: opacity 180ms ease;
    }

    @media (max-width: 760px) {
      #${SCROLL_BAR_ID} {
        height: 5px !important;
        min-height: 5px !important;
        max-height: 5px !important;
      }
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

      #${SCROLL_BAR_ID},
      #${SCROLL_BAR_ID}::before {
        transition: none !important;
      }
    }
  `;
}

function forceProgressBarStyles(bar) {
  const isMobile = window.matchMedia('(max-width: 760px)').matches;
  Object.assign(bar.style, {
    position: 'fixed',
    top: '0px',
    left: '0px',
    right: 'auto',
    bottom: 'auto',
    zIndex: '2147483647',
    display: 'block',
    width: '100vw',
    height: isMobile ? '5px' : '6px',
    minHeight: isMobile ? '5px' : '6px',
    maxHeight: isMobile ? '5px' : '6px',
    pointerEvents: 'none',
    opacity: '1',
    visibility: 'visible',
    transform: 'none',
    overflow: 'hidden',
    borderRadius: '0',
    border: '0',
    background: document.documentElement.dataset.theme === 'light'
      ? 'rgba(68, 68, 68, 0.18)'
      : 'rgba(255, 255, 255, 0.18)',
  });
}

function ensureScrollProgressBar() {
  let bar = document.getElementById(SCROLL_BAR_ID);
  if (!bar) {
    bar = document.createElement('div');
    bar.id = SCROLL_BAR_ID;
    bar.setAttribute('aria-hidden', 'true');
  }

  if (bar.parentElement !== document.documentElement) {
    document.documentElement.prepend(bar);
  }

  forceProgressBarStyles(bar);
  return bar;
}

function updateScrollProgress() {
  ensurePageExperienceStyle();
  const bar = ensureScrollProgressBar();
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0.02, window.scrollY / scrollable)) : 1;
  document.documentElement.style.setProperty('--nrs-scroll-progress-scale', String(progress));
  forceProgressBarStyles(bar);
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
    }, 160);
  });
}

function keepProgressBarAlive() {
  const observer = new MutationObserver(() => {
    updateScrollProgress();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: false,
    attributes: true,
    attributeFilter: ['data-theme', 'style', 'class'],
  });

  window.setInterval(updateScrollProgress, 1000);
}

export function initPageExperience() {
  ensurePageExperienceStyle();
  ensureScrollProgressBar();
  updateScrollProgress();
  initPageTransitions();
  keepProgressBarAlive();

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  window.addEventListener('visibilitychange', updateScrollProgress);
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('nrs-page-exiting');
    document.body.classList.add('nrs-page-visible');
    updateScrollProgress();
  });

  requestAnimationFrame(updateScrollProgress);
  window.setTimeout(updateScrollProgress, 250);
  window.setTimeout(updateScrollProgress, 1000);
}
