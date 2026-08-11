/**
 * @fileoverview src/scripts/features/content/blog-visuals.js
 * Purpose: Implement blog visuals behavior inside the content browser-runtime domain.
 * Responsibilities:
 * - Own the content behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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
 * Purpose: Determine whether blog detail page satisfies the condition represented by this blog visuals browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Boolean indicating whether blog detail page satisfies the documented condition.
 */
function isBlogDetailPage() {
  const path = window.location.pathname;
  return path.startsWith('/blog/') && path !== '/blog/' && !path.endsWith('/blog/index.html');
}


/**
 * Function contract: currentCover
 * Purpose: Implement the current cover responsibility owned by the blog visuals browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function currentCover() {
  const title = document.title || '';
  const heading = document.querySelector('h1')?.textContent || '';
  const path = window.location.pathname;
  const key = `${path} ${title} ${heading}`;
  return BLOG_COVERS.find(   /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `cover` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (cover) => cover.match.test(key)) || DEFAULT_COVER;
}



/**
 * Function contract: absoluteUrl
 * Purpose: Implement the absolute url responsibility owned by the blog visuals browser feature.
 * Inputs: `src`
 * Side effects: reads or updates DOM/browser state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function absoluteUrl(src) {
  return new URL(src, window.location.origin).href;
}



/**
 * Function contract: upsertMeta
 * Purpose: Implement the upsert meta responsibility owned by the blog visuals browser feature.
 * Inputs: `selector`, `attrs`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function upsertMeta(selector, attrs) {
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    document.head.appendChild(meta);
  }
  Object.entries(attrs).forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `[key, value]` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ ([key, value]) => meta.setAttribute(key, value));
}



/**
 * Function contract: ensureCoverImage
 * Purpose: Apply cover image consistently while preserving the surrounding blog visuals browser feature contract.
 * Inputs: `cover`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Implement the inject blog visual styles responsibility owned by the blog visuals browser feature.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
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
 * Purpose: Apply blog generated visuals consistently while preserving the surrounding blog visuals browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function ensureBlogGeneratedVisuals() {
  if (!isBlogDetailPage()) return;

  const cover = currentCover();
  injectBlogVisualStyles();
  ensureCoverImage(cover);
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: absoluteUrl(cover.src) });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absoluteUrl(cover.src) });
}
