const FIGMA_HOSTS = new Set(['www.figma.com', 'figma.com', 'embed.figma.com']);

function ensureAuditStylesheet() {
  if (document.querySelector('link[data-audit-remediations]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/audit-remediations.css?v=1.0';
  link.dataset.auditRemediations = 'true';
  document.head.appendChild(link);
}

function ensureSkipLink() {
  const main = document.querySelector('main');
  if (!main) return;

  if (!main.id) main.id = 'main-content';

  let skipLink = document.querySelector('.skip-link');
  if (!skipLink) {
    skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
  }

  skipLink.setAttribute('href', `#${main.id}`);
}

function normalizeFigmaEmbedUrl(rawUrl) {
  try {
    const current = new URL(rawUrl, window.location.href);
    if (!FIGMA_HOSTS.has(current.hostname)) return rawUrl;

    if (current.hostname !== 'embed.figma.com' && current.pathname === '/embed') {
      const nested = current.searchParams.get('url');
      if (!nested) return rawUrl;
      const target = new URL(nested);
      target.hostname = 'embed.figma.com';
      target.searchParams.delete('m');
      target.searchParams.set('embed-host', 'share');
      return target.toString();
    }

    if (current.hostname === 'www.figma.com' || current.hostname === 'figma.com') {
      current.hostname = 'embed.figma.com';
      current.searchParams.delete('m');
      current.searchParams.set('embed-host', 'share');
      return current.toString();
    }

    current.searchParams.set('embed-host', 'share');
    return current.toString();
  } catch {
    return rawUrl;
  }
}

function getPublicFigmaUrl(rawUrl) {
  try {
    const url = new URL(normalizeFigmaEmbedUrl(rawUrl));
    url.hostname = 'www.figma.com';
    url.searchParams.delete('embed-host');
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function enhanceFigmaEmbeds() {
  const frames = [...document.querySelectorAll('iframe[src*="figma.com"]')];

  frames.forEach((frame, index) => {
    if (frame.dataset.auditEnhanced === 'true') return;
    frame.dataset.auditEnhanced = 'true';

    const originalSrc = frame.getAttribute('src') || '';
    const normalizedSrc = normalizeFigmaEmbedUrl(originalSrc);
    if (normalizedSrc && normalizedSrc !== originalSrc) frame.src = normalizedSrc;

    frame.loading = 'lazy';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.setAttribute('title', frame.getAttribute('title') || `Interactive Figma project preview ${index + 1}`);
    frame.setAttribute('allow', 'fullscreen');

    const wrapper = frame.closest('.embed-frame-wrapper') || frame.parentElement;
    if (!wrapper || wrapper.querySelector('.figma-embed-fallback')) return;

    wrapper.classList.add('figma-embed-enhanced');

    const fallback = document.createElement('div');
    fallback.className = 'figma-embed-fallback';
    fallback.innerHTML = `
      <div>
        <strong>Interactive preview</strong>
        <span>Figma embeds can be blocked by permissions, privacy tools or third-party outages.</span>
      </div>
      <a class="btn btn-secondary" href="${getPublicFigmaUrl(normalizedSrc || originalSrc)}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
    `;
    wrapper.appendChild(fallback);
  });
}

function protectExternalLinks() {
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    const rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
    rel.add('noopener');
    rel.add('noreferrer');
    link.setAttribute('rel', [...rel].join(' '));
  });
}

function initFloatingResumeVisibility() {
  const button = document.querySelector('.floating-resume-btn');
  if (!button || button.dataset.auditVisibilityReady === 'true') return;
  button.dataset.auditVisibilityReady = 'true';

  if (window.location.pathname === '/contact' || window.location.pathname === '/contact.html') {
    button.classList.add('is-obscured');
    return;
  }

  const footerTarget = document.querySelector('footer, .nrs-services-cta, .nrs-about-v2-cta, .nrs-contact-v2-footer-cta');
  if (!footerTarget || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    button.classList.toggle('is-obscured', entries.some((entry) => entry.isIntersecting));
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  observer.observe(footerTarget);
}

function improveImageDefaults() {
  document.querySelectorAll('img').forEach((image) => {
    if (!image.hasAttribute('decoding')) image.decoding = 'async';
    if (!image.hasAttribute('loading') && !image.closest('.hero-section, .nrs-about-v2-hero, .nrs-services-hero')) {
      image.loading = 'lazy';
    }
  });
}

function addAnchorOffsetTargets() {
  document.querySelectorAll('main [id]').forEach((element) => element.classList.add('nrs-anchor-target'));
}

export function applyAuditRemediations() {
  ensureAuditStylesheet();
  ensureSkipLink();
  enhanceFigmaEmbeds();
  protectExternalLinks();
  initFloatingResumeVisibility();
  improveImageDefaults();
  addAnchorOffsetTargets();
}
