const RESPONSIVE_QUERY = '(max-width: 1100px)';
const PHONE_QUERY = '(max-width: 850px)';

const FIRST_SURFACE_SELECTORS = [
  '.hero-section',
  '.nrs-home-hero',
  '.nrs-home-hero-clean',
  '.nrs-about-v2-hero',
  '.nrs-contact-v2-hero',
  '.nrs-services-shell',
  '.nrs-services-hero',
  '.nrs-services-index-hero',
  '.nrs-services-v49',
  '.nrs-services-v49-hero',
  '.nrs-contact-v3-hero',
  '.nrs-contact-redesign-hero',
  '.nrs-page-hero',
  '.nrs-spacious-page',
  '.nrs-blog-hub-shell',
  '.nrs-blog-detail-surface',
  '.nrs-article-frame',
  '.nrs-case-study',
  '.nrs-case-hero',
  'article.section-container',
  'section',
  'article',
];

const MAIN_PROPERTIES = {
  display: 'block',
  'min-height': '0',
  height: 'auto',
  'margin-top': '0',
  'padding-top': '0',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'start',
  'place-content': 'start',
};

const SURFACE_PROPERTIES = {
  display: 'block',
  position: 'relative',
  inset: 'auto',
  top: 'auto',
  'min-height': '0',
  height: 'auto',
  'margin-block-start': '0',
  'margin-top': '0',
  'padding-block-start': 'var(--nrs-runtime-header-clearance)',
  'padding-top': 'var(--nrs-runtime-header-clearance)',
  'padding-bottom': 'var(--nrs-runtime-hero-end)',
  'grid-template-rows': 'none',
  'grid-auto-rows': 'auto',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'start',
  'place-content': 'start',
  'align-self': 'auto',
  'justify-self': 'auto',
  opacity: '1',
  transform: 'none',
};

const ANCESTOR_PROPERTIES = {
  position: 'static',
  inset: 'auto',
  top: 'auto',
  'min-height': '0',
  height: 'auto',
  'margin-block-start': '0',
  'margin-top': '0',
  'padding-block-start': '0',
  'padding-top': '0',
  'grid-template-rows': 'none',
  'grid-auto-rows': 'auto',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'start',
  'place-content': 'start',
  'align-self': 'auto',
  'justify-self': 'auto',
  opacity: '1',
  transform: 'none',
};

const INITIAL_CONTENT_PROPERTIES = {
  'min-height': '0',
  height: 'auto',
  'margin-block-start': '0',
  'margin-top': '0',
  'padding-block-start': '0',
  top: 'auto',
  opacity: '1',
  transform: 'none',
};

const touchedElements = new Set();
const originalInlineStyles = new WeakMap();
let geometryFrame = 0;

function rememberInlineStyle(element, property) {
  let styles = originalInlineStyles.get(element);
  if (!styles) {
    styles = new Map();
    originalInlineStyles.set(element, styles);
  }
  if (styles.has(property)) return;
  styles.set(property, {
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property),
  });
}

function setImportantStyles(element, properties) {
  if (!element) return;
  touchedElements.add(element);
  for (const [property, value] of Object.entries(properties)) {
    rememberInlineStyle(element, property);
    element.style.setProperty(property, value, 'important');
  }
}

function restoreInlineStyles() {
  for (const element of touchedElements) {
    const styles = originalInlineStyles.get(element);
    if (!styles) continue;
    for (const [property, original] of styles.entries()) {
      if (original.value) element.style.setProperty(property, original.value, original.priority);
      else element.style.removeProperty(property);
    }
  }
  touchedElements.clear();
}

function getFirstSurface(main) {
  if (!main) return null;
  for (const selector of FIRST_SURFACE_SELECTORS) {
    const candidate = main.querySelector(`:scope > ${selector}`);
    if (candidate) return candidate;
  }
  return main.firstElementChild;
}

function getVisibleHeading(surface) {
  return [...surface.querySelectorAll('h1, .hero-title')].find((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }) || null;
}

function getHeadingAncestors(heading, surface) {
  const ancestors = [];
  let current = heading?.parentElement;
  while (current && current !== surface && current.tagName !== 'MAIN') {
    ancestors.push(current);
    current = current.parentElement;
  }
  return ancestors;
}

function getInitialContent(surface, heading) {
  const elements = [surface.firstElementChild, heading];
  const wayfinding = surface.querySelector(
    ':scope > .nrs-wayfinding, :scope > .nrs-detail-breadcrumb, :scope > .nrs-blog-utility, .nrs-wayfinding, .nrs-detail-breadcrumb, .nrs-blog-utility'
  );
  if (wayfinding) elements.push(wayfinding);

  let sibling = heading?.previousElementSibling;
  while (sibling) {
    elements.push(sibling);
    sibling = sibling.previousElementSibling;
  }
  return [...new Set(elements.filter(Boolean))];
}

function applyGeometryFallback(surface, heading) {
  window.cancelAnimationFrame(geometryFrame);
  geometryFrame = window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      if (!window.matchMedia(RESPONSIVE_QUERY).matches || !heading.isConnected) return;

      const phone = window.matchMedia(PHONE_QUERY).matches;
      const maximumHeadingTop = phone ? 230 : 300;
      const headingTop = heading.getBoundingClientRect().top;
      if (headingTop <= maximumHeadingTop) return;

      // This is a measured safety net, not a guessed selector. It only activates
      // when legacy layout layers still leave the real heading below the fold.
      const correction = Math.ceil(headingTop - maximumHeadingTop);
      setImportantStyles(surface, {
        'margin-block-start': `${-correction}px`,
        'margin-top': `${-correction}px`,
      });
      surface.dataset.nrsHeroGeometryCorrection = String(correction);
    });
  });
}

function applyResponsiveTopSpacingFix() {
  const main = document.querySelector('main');
  const surface = getFirstSurface(main);
  if (!main || !surface) return;

  if (!window.matchMedia(RESPONSIVE_QUERY).matches) {
    restoreInlineStyles();
    delete surface.dataset.nrsResponsiveTopSpacingFixed;
    delete surface.dataset.nrsHeroGeometryCorrection;
    return;
  }

  const phone = window.matchMedia(PHONE_QUERY).matches;
  document.documentElement.style.setProperty(
    '--nrs-runtime-header-clearance',
    phone ? 'calc(env(safe-area-inset-top, 0px) + 88px)' : 'calc(env(safe-area-inset-top, 0px) + 100px)'
  );
  document.documentElement.style.setProperty('--nrs-runtime-hero-end', phone ? '44px' : '52px');

  // Clear any prior measured correction before recalculating actual geometry.
  surface.style.setProperty('margin-block-start', '0', 'important');
  surface.style.setProperty('margin-top', '0', 'important');

  const heading = getVisibleHeading(surface);
  setImportantStyles(main, MAIN_PROPERTIES);
  setImportantStyles(surface, SURFACE_PROPERTIES);
  getHeadingAncestors(heading, surface).forEach((element) => setImportantStyles(element, ANCESTOR_PROPERTIES));
  getInitialContent(surface, heading).forEach((element) => setImportantStyles(element, INITIAL_CONTENT_PROPERTIES));

  surface.dataset.nrsResponsiveTopSpacingFixed = 'true';
  if (heading) applyGeometryFallback(surface, heading);
}

export function applyLayoutIntegrity() {
  let frame = 0;
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(applyResponsiveTopSpacingFix);
  };

  applyResponsiveTopSpacingFix();
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  window.setTimeout(applyResponsiveTopSpacingFix, 250);
  window.setTimeout(applyResponsiveTopSpacingFix, 1000);
  window.setTimeout(applyResponsiveTopSpacingFix, 2000);
}