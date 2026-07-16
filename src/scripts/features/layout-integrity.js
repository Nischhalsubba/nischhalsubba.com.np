const HOME_PATHS = new Set(['/', '/index.html', '/home', '/home.html', '/home-v2', '/home-v2.html']);
const MOBILE_QUERY = '(max-width: 850px)';
const HERO_PROPERTIES = {
  display: 'grid',
  'min-height': '0',
  height: 'auto',
  'margin-top': '0',
  'padding-top': '96px',
  'padding-bottom': '48px',
  'align-content': 'start',
  'align-items': 'start',
  'justify-content': 'initial',
  'place-content': 'start',
};

function isHomePage() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  return HOME_PATHS.has(pathname);
}

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

function applyMobileHomeHeroFix() {
  if (!isHomePage()) return;

  const hero = document.querySelector(
    'main.container > .hero-section:first-child, main.container > .nrs-home-hero:first-child, main.container > .nrs-home-hero-clean:first-child',
  );
  if (!hero) return;

  const firstChild = hero.firstElementChild;
  const heading = hero.querySelector(':scope > h1, :scope > .hero-title');
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;

  if (isMobile) {
    setImportantStyles(hero, HERO_PROPERTIES);
    setImportantStyles(firstChild, { 'margin-top': '0' });
    setImportantStyles(heading, { 'margin-top': '0' });
    hero.dataset.nrsMobileHomeHeroFixed = 'true';
    return;
  }

  if (hero.dataset.nrsMobileHomeHeroFixed === 'true') {
    clearStyles(hero, HERO_PROPERTIES);
    clearStyles(firstChild, { 'margin-top': '0' });
    clearStyles(heading, { 'margin-top': '0' });
    delete hero.dataset.nrsMobileHomeHeroFixed;
  }
}

export function applyLayoutIntegrity() {
  if (!isHomePage()) return;

  let frame = 0;
  const schedule = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(applyMobileHomeHeroFix);
  };

  applyMobileHomeHeroFix();
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('orientationchange', schedule, { passive: true });
  window.addEventListener('pageshow', schedule, { passive: true });
  window.setTimeout(applyMobileHomeHeroFix, 250);
  window.setTimeout(applyMobileHomeHeroFix, 1000);
}
