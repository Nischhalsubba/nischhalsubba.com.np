/**
 * @fileoverview src/scripts/features/portfolio/project-images.js
 * Purpose: Implement project images behavior inside the portfolio browser-runtime domain.
 * Responsibilities:
 * - Own the portfolio behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const PROJECT_IMAGES = {
  '/project-yarsha.html': {
    src: '/assets/images/project-yarsha-cover.svg',
    alt: 'Yarsha Web3 mobile app product design case study cover',
  },
  '/project-mokshya.html': {
    src: '/assets/images/project-mokshya-cover.svg',
    alt: 'Mokshya Web3 protocol website UX case study cover',
  },
  '/project-hamro-idea.html': {
    src: '/assets/images/project-hamro-idea-cover.svg',
    alt: 'Hamro Idea software company website redesign case study cover',
  },
  '/project-morajaa.html': {
    src: '/assets/images/project-morajaa-cover.svg',
    alt: 'Morajaa consulting website UX and lead flow case study cover',
  },
  '/project-neverwinter-parser.html': {
    src: '/assets/images/project-neverwinter-parser-cover.svg',
    alt: 'Neverwinter Live Parser desktop tool case study cover',
  },
  '/project-orkest.html': {
    src: '/assets/images/project-orkest-cover.svg',
    alt: 'Orkest HQ modular SaaS dashboard UX case study cover',
  },
  '/project-splashnode.html': {
    src: '/assets/images/project-splashnode-cover.svg',
    alt: 'Splashnode technical website design and front-end case study cover',
  },
  '/project-zapp.html': {
    src: '/assets/images/project-zapp-cover.svg',
    alt: 'Zapp Today delivery and scheduling mobile app case study cover',
  },
  '/project-masteriyo.html': {
    src: '/assets/images/project-masteriyo-cover.svg',
    alt: 'Masteriyo LMS product design contribution case study cover',
  },
  '/project-pihub.html': {
    src: '/assets/images/project-pihub-cover.svg',
    alt: 'piHub fintech workflow and app experience case study cover',
  },
  '/project-grid-labs.html': {
    src: '/assets/images/project-grid-labs-cover.svg',
    alt: 'Grid Labs Hosting landing page and static front-end case study cover',
  },
  '/project-zakra-furniture.html': {
    src: '/assets/images/project-zakra-furniture-cover.svg',
    alt: 'Zakra Furniture WordPress starter website case study cover',
  },
  '/project-designerex.html': {
    src: '/assets/images/project-designerex-cover.svg',
    alt: 'Designerex luxury fashion marketplace design contribution case study cover',
  },
  '/project-sassboilerplate.html': {
    src: '/assets/images/project-sassboilerplate-cover.svg',
    alt: 'sassBoilerplate front-end toolkit and developer workflow case study cover',
  },
};


/**
 * Function contract: normalizeProjectPath
 * Purpose: Apply project path consistently while preserving the surrounding project images browser feature contract.
 * Inputs: `pathname`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function normalizeProjectPath(pathname) {
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}


/**
 * Function contract: absoluteUrl
 * Purpose: Implement the absolute url responsibility owned by the project images browser feature.
 * Inputs: `path`
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function absoluteUrl(path) {
  return new URL(path, window.location.origin).href;
}


/**
 * Function contract: ensureProjectHeroImage
 * Purpose: Apply project hero image consistently while preserving the surrounding project images browser feature contract.
 * Inputs: `project`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function ensureProjectHeroImage(project) {
  let image = document.querySelector('.case-hero-img, .project-detail-hero img, .case-hero-img-container img');
  let container = document.querySelector('.case-hero-img-container, .project-detail-hero');

  if (!container) {
    const hero = document.querySelector('main .hero-section, main section');
    container = document.createElement('div');
    container.className = 'case-hero-img-container reveal-on-scroll nrs-project-image-container';
    hero?.insertAdjacentElement('afterend', container);
  }

  if (!image) {
    image = document.createElement('img');
    image.className = 'case-hero-img';
    image.loading = 'eager';
    image.decoding = 'async';
    container.appendChild(image);
  }

  image.src = project.src;
  image.alt = project.alt;
  image.classList.add('nrs-project-detail-image');
  image.removeAttribute('style');
  container.classList.add('nrs-project-image-container');
}


/**
 * Function contract: updateProjectMeta
 * Purpose: Apply project meta consistently while preserving the surrounding project images browser feature contract.
 * Inputs: `project`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateProjectMeta(project) {
  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach( /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `meta` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (meta) => {
    meta.setAttribute('content', absoluteUrl(project.src));
  });

  const jsonLd = document.querySelector('script[type="application/ld+json"]');
  if (!jsonLd) return;

  try {
    const data = JSON.parse(jsonLd.textContent || '{}');
    if (data && typeof data === 'object' && 'image' in data) {
      data.image = absoluteUrl(project.src);
      jsonLd.textContent = JSON.stringify(data, null, 2);
    }
  } catch {
    // Leave existing structured data untouched if the JSON-LD is not parseable.
  }
}


/**
 * Function contract: injectProjectImageStyles
 * Purpose: Implement the inject project image styles responsibility owned by the project images browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function injectProjectImageStyles() {
  if (document.getElementById('nrs-project-image-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-project-image-styles';
  style.textContent = `
    .nrs-project-image-container {
      width: min(100%, 1180px);
      margin: 0 auto clamp(72px, 9vw, 120px);
      border-radius: 30px;
      overflow: hidden;
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      background: var(--bg-surface, #101010);
      box-shadow: 0 34px 120px rgba(0,0,0,.24);
    }

    .nrs-project-detail-image {
      display: block;
      width: 100%;
      height: auto;
      min-height: clamp(280px, 45vw, 560px);
      object-fit: cover;
      border: 0 !important;
      border-radius: 0 !important;
    }

    @media (max-width: 760px) {
      .nrs-project-image-container {
        border-radius: 20px;
        margin-bottom: 64px;
      }
    }
  `;
  document.head.appendChild(style);
}


/**
 * Function contract: useProjectDetailImages
 * Purpose: Implement the use project detail images responsibility owned by the project images browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function useProjectDetailImages() {
  const project = PROJECT_IMAGES[normalizeProjectPath(window.location.pathname)];
  if (!project) return;

  injectProjectImageStyles();
  ensureProjectHeroImage(project);
  updateProjectMeta(project);
}
