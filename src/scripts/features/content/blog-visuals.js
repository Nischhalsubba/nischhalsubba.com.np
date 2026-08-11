/**
 * @fileoverview src/scripts/features/content/blog-visuals.js
 * Purpose: Browser runtime feature in the content domain responsible for blog visuals behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/scripts/entrypoints/main.js
 * - src/runtime/script.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const BLOG_COVERS = [
  {
    match: /saas|dashboard|empty-state|empty-states|enterprise|metric|data-dense/i,
    src: '/assets/images/blog-saas-empty-states-cover.png',
    alt: 'Generated product design cover showing SaaS dashboard empty states and product clarity artifacts',
  },
  {
    match: /handoff|figma|design-system|design-systems|front-end|developer/i,
    src: '/assets/images/blog-design-systems-handoff-cover.png',
    alt: 'Generated product design cover showing design system components, handoff notes, and interface states',
  },
  {
    match: /web3|wallet|crypto|transaction|governance/i,
    src: '/assets/images/blog-web3-wallet-ux-cover.png',
    alt: 'Generated product design cover showing Web3 wallet review, permissions, and trust-focused interface states',
  },
  {
    match: /audit|accessibility|research|redesign|emerging/i,
    src: '/assets/images/blog-ux-audit-research-cover.png',
    alt: 'Generated product design cover showing UX audit boards, research notes, and prioritization artifacts',
  },
  {
    match: /service|website|pricing|plans|software-companies|business/i,
    src: '/assets/images/blog-service-pricing-ux-cover.png',
    alt: 'Generated product design cover showing service website structure, pricing panels, and conversion paths',
  },
];

const DEFAULT_COVER = BLOG_COVERS[1];

/**
 * Function contract: isBlogDetailPage
 * Purpose: Implements the is blog detail page responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function isBlogDetailPage() {
  const path = window.location.pathname;
  return path.startsWith('/blog/') && path !== '/blog/' && !path.endsWith('/blog/index.html');
}

/**
 * Function contract: currentCover
 * Purpose: Implements the current cover responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function currentCover() {
  const title = document.title || '';
  const heading = document.querySelector('h1')?.textContent || '';
  const path = window.location.pathname;
  const key = `${path} ${title} ${heading}`;
  return BLOG_COVERS.find(/** Callback contract: Processes the callback step for blog covers without leaking orchestration details to the caller. Inputs: cover. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (cover) => cover.match.test(key)) || DEFAULT_COVER;
}

/**
 * Function contract: absoluteUrl
 * Purpose: Implements the absolute url responsibility for this module.
 * Inputs: src.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function absoluteUrl(src) {
  return new URL(src, window.location.origin).href;
}

/**
 * Function contract: upsertMeta
 * Purpose: Implements the upsert meta responsibility for this module.
 * Inputs: selector, attrs.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function upsertMeta(selector, attrs) {
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    document.head.appendChild(meta);
  }
  Object.entries(attrs).forEach(/** Callback contract: Processes the callback step for object.entries(attrs) without leaking orchestration details to the caller. Inputs: [key, value]. Side effects: may read or update browser DOM/state. No explicit return contract. */ ([key, value]) => meta.setAttribute(key, value));
}

/**
 * Function contract: ensureCoverImage
 * Purpose: Applies ensure cover image while preserving the surrounding repository/runtime contract.
 * Inputs: cover.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function ensureCoverImage(cover) {
  const article = document.querySelector('article');
  if (!article) return;

  let image = article.querySelector('img[src*="blog-"][src$=".png"], img[src*="blog-"][src$=".svg"], img[src*="unsplash"]');
  if (!image) {
    const figure = document.createElement('figure');
    figure.className = 'nrs-blog-cover';
    image = document.createElement('img');
    image.className = 'nrs-blog-cover-img';
    image.width = 1600;
    image.height = 900;
    image.loading = 'eager';
    image.decoding = 'async';
    figure.appendChild(image);

    const intro = article.querySelector('.body-large, h1 + p, header + section');
    if (intro?.tagName === 'SECTION') intro.prepend(figure);
    else intro?.insertAdjacentElement('afterend', figure);
  }

  image.src = cover.src;
  image.alt = cover.alt;
  image.classList.add('nrs-blog-cover-img');
  image.width = image.width || 1600;
  image.height = image.height || 900;
  image.loading = 'eager';
  image.decoding = 'async';
}

/**
 * Function contract: injectBlogVisualStyles
 * Purpose: Implements the inject blog visual styles responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function injectBlogVisualStyles() {
  if (document.getElementById('nrs-blog-visuals-style')) return;

  const style = document.createElement('style');
  style.id = 'nrs-blog-visuals-style';
  style.textContent = `
    .nrs-blog-detail-page {
      --nrs-readable-width: 760px;
      --nrs-article-wide: min(1040px, 100%);
    }

    .nrs-blog-detail-page .nrs-blog-cover {
      width: var(--nrs-article-wide);
      margin: clamp(32px, 5vw, 58px) 0 clamp(42px, 6vw, 72px);
    }

    .nrs-blog-detail-page .nrs-blog-cover-img,
    .nrs-blog-detail-page article img[src*="blog-"] {
      display: block;
      width: 100% !important;
      aspect-ratio: 16 / 9;
      height: auto !important;
      max-height: none !important;
      object-fit: cover;
      border: 1px solid var(--border-faint) !important;
      border-radius: clamp(18px, 2.4vw, 28px) !important;
      background: var(--bg-surface) !important;
      box-shadow: 0 28px 86px rgba(0, 0, 0, .24) !important;
    }

    .nrs-blog-detail-page article.section-container > h1,
    .nrs-blog-detail-page article.section-container > .hero-title,
    .nrs-blog-detail-page .nrs-article-header h1 {
      max-width: 980px !important;
      letter-spacing: 0 !important;
      text-wrap: balance;
    }

    .nrs-blog-detail-page article.section-container > p,
    .nrs-blog-detail-page article.section-container li,
    .nrs-blog-detail-page .blog-prose p,
    .nrs-blog-detail-page .blog-prose li {
      max-width: var(--nrs-readable-width) !important;
      font-size: clamp(1rem, 1.05vw, 1.125rem) !important;
      line-height: 1.78 !important;
      letter-spacing: 0 !important;
    }

    .nrs-blog-detail-page article.section-container > h2,
    .nrs-blog-detail-page .blog-prose h2,
    .nrs-blog-detail-page .body-large h3 {
      max-width: var(--nrs-readable-width) !important;
      margin-top: clamp(44px, 6vw, 76px) !important;
      letter-spacing: 0 !important;
      text-wrap: balance;
    }

    .nrs-blog-detail-page blockquote {
      max-width: var(--nrs-readable-width) !important;
      margin-block: clamp(34px, 5vw, 58px) !important;
      padding-left: clamp(20px, 2.5vw, 30px) !important;
      border-left: 2px solid var(--text-primary) !important;
      color: var(--text-primary) !important;
    }

    @media (max-width: 760px) {
      .nrs-blog-detail-page .nrs-blog-cover {
        margin-top: 28px;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Function contract: ensureBlogGeneratedVisuals
 * Purpose: Applies ensure blog generated visuals while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
export function ensureBlogGeneratedVisuals() {
  if (!isBlogDetailPage()) return;

  const cover = currentCover();
  injectBlogVisualStyles();
  ensureCoverImage(cover);
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteUrl(cover.src) });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteUrl(cover.src) });
}
