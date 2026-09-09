/**
 * @fileoverview src/scripts/features/content/blog-visuals.js
 * Purpose: Implement lightweight blog cover behavior inside the content browser-runtime domain.
 * Responsibilities:
 * - Resolve an approved article-specific or topic-level SVG cover for blog detail pages.
 * - Keep the visible cover aligned with the production build without rewriting static social metadata at runtime.
 * - Preserve intrinsic dimensions, accessible alternative text, and deterministic cover styling.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * - scripts/ensure-blog-lightweight-covers.cjs
 * - scripts/generate-social-previews.cjs
 * Maintenance: Keep cover mappings synchronized with the production build transformer and approved assets.
 */
const EXACT_COVERS = [
  {
    match: /\/blog-web3-products(?:\.html)?$/i,
    src: '/assets/images/blog-web3-products.svg',
    alt: 'Editorial cover showing wallet review, transaction clarity, and Web3 product trust patterns',
  },
  {
    match: /\/blog-good-handoff(?:\.html)?$/i,
    src: '/assets/images/blog-good-handoff.svg',
    alt: 'Editorial cover showing Figma handoff notes, interface states, and developer-ready product decisions',
  },
  {
    match: /\/blog-portfolio-product(?:\.html)?$/i,
    src: '/assets/images/blog-portfolio-product.svg',
    alt: 'Editorial cover showing portfolio project cards, contribution labels, case study blocks, and SEO structure',
  },
  {
    match: /\/blog-service-websites(?:\.html)?$/i,
    src: '/assets/images/blog-service-websites.svg',
    alt: 'Editorial cover showing service website structure, proof, pricing, and conversion paths',
  },
  {
    match: /\/blog-gaming-interface-clarity(?:\.html)?$/i,
    src: '/assets/images/blog-gaming-interface-clarity.svg',
    alt: 'Editorial cover showing real-time feedback, status states, combat data, and interface clarity',
  },
  {
    match: /\/blog-design-systems-front-end(?:\.html)?$/i,
    src: '/assets/images/blog-design-systems-front-end.svg',
    alt: 'Editorial cover showing reusable components, design tokens, responsive behavior, and front-end-aware design systems',
  },
];

const TOPIC_COVERS = [
  {
    match: /saas|dashboard|empty-state|empty-states|enterprise|metric|data-dense/i,
    src: '/assets/images/blog-saas-dashboard-cover.svg',
    alt: 'SaaS dashboard UX cover showing filters, data cards, status states, and a trend chart',
  },
  {
    match: /handoff|figma|design-system|design-systems|front-end|developer/i,
    src: '/assets/images/blog-design-systems-handoff-cover.svg',
    alt: 'Design systems and handoff cover showing components, interface states, specifications, and QA notes',
  },
  {
    match: /web3|wallet|crypto|transaction|governance/i,
    src: '/assets/images/blog-web3-wallet-ux-cover.svg',
    alt: 'Web3 wallet UX cover showing review, permissions, signing clarity, and transaction trust patterns',
  },
  {
    match: /audit|accessibility|research|redesign|emerging|usability/i,
    src: '/assets/images/blog-ux-audit-research-cover.svg',
    alt: 'UX audit and research cover showing evidence, usability findings, accessibility checks, and prioritization',
  },
  {
    match: /service|website|pricing|plans|software-companies|business/i,
    src: '/assets/images/blog-service-pricing-ux-cover.svg',
    alt: 'Service website UX cover showing service hierarchy, pricing structure, proof, and conversion paths',
  },
];

const DEFAULT_COVER = TOPIC_COVERS[1];

/**
 * Function contract: isBlogDetailPage
 * Purpose: Determine whether the current route is a blog detail page.
 * Inputs: None; reads browser location.
 * Side effects: Reads browser state only.
 * Returns: Boolean indicating whether blog-detail cover behavior should run.
 */
function isBlogDetailPage() {
  const path = window.location.pathname;
  return path.startsWith('/blog/') && path !== '/blog/' && !path.endsWith('/blog/index.html');
}

/**
 * Function contract: currentCover
 * Purpose: Resolve the most specific approved lightweight cover for the current article.
 * Inputs: None; reads pathname, title, and primary heading.
 * Side effects: Reads DOM/browser state only.
 * Returns: Cover descriptor with `src` and `alt`.
 */
function currentCover() {
  const path = window.location.pathname;
  for (const cover of EXACT_COVERS) {
    if (cover.match.test(path)) return cover;
  }

  const title = document.title || '';
  const heading = document.querySelector('h1')?.textContent || '';
  const key = `${path} ${title} ${heading}`;
  for (const cover of TOPIC_COVERS) {
    if (cover.match.test(key)) return cover;
  }
  return DEFAULT_COVER;
}

/**
 * Function contract: ensureCoverImage
 * Purpose: Apply the selected lightweight SVG to the primary article cover while preserving accessibility and layout stability.
 * Inputs: `cover` - approved cover descriptor.
 * Side effects: Reads and updates article DOM state.
 * Returns: Undefined; mutates the primary cover element when an article is present.
 */
function ensureCoverImage(cover) {
  const article = document.querySelector('article');
  if (!article) return;

  let image = article.querySelector('img[src*="blog-"], img[src*="unsplash"]');
  if (!image) {
    const figure = document.createElement('figure');
    figure.className = 'nrs-blog-cover';
    image = document.createElement('img');
    image.className = 'nrs-blog-cover-img';
    figure.appendChild(image);

    const intro = article.querySelector('.body-large, h1 + p, header + section');
    if (intro?.tagName === 'SECTION') intro.prepend(figure);
    else intro?.insertAdjacentElement('afterend', figure);
  }

  image.src = cover.src;
  image.alt = cover.alt;
  image.classList.add('nrs-blog-cover-img');
  image.width = 1200;
  image.height = 675;
  image.loading = 'eager';
  image.decoding = 'async';
}

/**
 * Function contract: injectBlogVisualStyles
 * Purpose: Install the shared detail-cover and readable-article style contract once per page.
 * Inputs: None.
 * Side effects: Inserts one style element into the document head.
 * Returns: Undefined.
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
 * Purpose: Apply the lightweight visible-cover contract to blog detail pages without mutating static SEO/social metadata.
 * Inputs: None.
 * Side effects: Adds cover styles and normalizes the primary article image.
 * Returns: Undefined.
 */
export function ensureBlogGeneratedVisuals() {
  if (!isBlogDetailPage()) return;
  injectBlogVisualStyles();
  ensureCoverImage(currentCover());
}
