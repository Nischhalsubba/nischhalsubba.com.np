const MOBILE_QUERY = '(max-width: 850px)';

const FIRST_SURFACE_SELECTORS = [
  '.hero-section',
  '.nrs-home-hero',
  '.nrs-home-hero-clean',
  '.nrs-about-v2-hero',
  '.nrs-contact-v2-hero',
  '.nrs-services-shell',
  '.nrs-services-hero',
  '.nrs-services-index-hero',
  '.nrs-contact-v3-hero',
  '.nrs-contact-redesign-hero',
  '.nrs-page-hero',
  '.nrs-spacious-page',
  '.nrs-blog-detail-surface',
  '.nrs-article-frame',
  'article.section-container',
  'section',
  'article',
];

const MOBILE_SURFACE_PROPERTIES = {
  'min-height': '0',
  height: 'auto',
  'margin-top': '0',
  'padding-top': 'calc(env(safe-area-inset-top, 0px) + 88px)',
  'padding-bottom': '48px',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'start',
  'place-content': 'start',
  opacity: '1',
  transform: 'none',
};

const MOBILE_CHILD_PROPERTIES = {
  'margin-top': '0',
  opacity: '1',
  transform: 'none',
};

function setImportantStyles(element, properties) {
  if (!element) return;
  for (const [property, value] of Object.entries(properties)) {
    element.style.setProperty(property, value, 'important');
  }
}

function clearStyles(element, properties) {
  if (!element) return;
  for (const property of Object.keys(properties)) {
    element.style.removeProperty(property);
  }
}

function getFirstSurface() {
  const main = document.querySelector('main');
  if (!main) return null;

  for (const selector of FIRST_SURFACE_SELECTORS) {
    const candidate = main.querySelector(`:scope > ${selector}`);
    if (candidate) return candidate;
  }

  return main.firstElementChild;
}

function getInitialContent(surface) {
  if (!surface) return [];

  const elements = [surface.firstElementChild];
  const heading = surface.querySelector(':scope > h1, :scope > .hero-title, h1, .hero-title');
  if (heading) elements.push(heading);

  const wayfinding = surface.querySelector(':scope > .nrs-wayfinding, :scope > .nrs-detail-breadcrumb, :scope > .nrs-blog-utility');
  if (wayfinding) elements.push(wayfinding);

  return [...new Set(elements.filter(Boolean))];
}

function applyMobileTopSpacingFix() {
  const surface = getFirstSurface();
  if (!surface) return;

  const initialContent = getInitialContent(surface);
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;

  if (isMobile) {
    setImportantStyles(surface, MOBILE_SURFACE_PROPERTIES);
    initialContent.forEach((element) => setImportantStyles(element, MOBILE_CHILD_PROPERTIES));
    surface.dataset.nrsMobileTopSpacingFixed = 'true';
    return;
  }

  if (surface.dataset.nrsMobileTopSpacingFixed === 'true') {
    clearStyles(surface, MOBILE_SURFACE_PROPERTIES);
    initialContent.forEach((element) => clearStyles(element, MOBILE_CHILD_PROPERTIES));
    delete surface.dataset.nrsMobileTopSpacingFixed;
  }
}

export function applyLayoutIntegrity() {
  let frame = 0;
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(applyMobileTopSpacingFix);
  };

  applyMobileTopSpacingFix();
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  window.setTimeout(applyMobileTopSpacingFix, 250);
  window.setTimeout(applyMobileTopSpacingFix, 1000);
}
