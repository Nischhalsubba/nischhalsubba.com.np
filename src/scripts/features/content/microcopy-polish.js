/**
 * @fileoverview src/scripts/features/content/microcopy-polish.js
 * Purpose: Implement microcopy polish behavior inside the content browser-runtime domain.
 * Responsibilities:
 * - Own the content behavior represented by this module and keep unrelated domains outside the file.
 * - Read or update only the DOM/runtime state needed for this feature and preserve accessibility semantics.
 * - Expose stable initializer/helper exports consumed by runtime entrypoints or closely related features.
 * Execution context: Browser ES module loaded through the portfolio runtime.
 * Connected files:
 * - src/runtime/script.js
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const PAGE_COPY = {
  '/': {
    eyebrow: 'Product designer for digital product teams',
    title: 'I design clearer product flows, interfaces, and handoff for teams that need practical design support.',
    lead: 'I work across mobile apps, dashboards, Web3 experiences, websites, design systems, and Figma prototypes. The focus is straightforward: understand the problem, reduce interface confusion, and prepare work that teams can review and build.',
    primaryCta: 'View selected work',
    secondaryCta: 'Discuss a project',
    proof: ['Product strategy', 'Interface systems', 'UX writing', 'Developer handoff', 'Prototype clarity'],
  },
  '/index.html': null,
  '/projects.html': {
    eyebrow: 'Selected work',
    title: 'Product design work with context, constraints, and visible decisions.',
    lead: 'A focused archive of product, website, and interface work across Web3, fintech, SaaS, mobile apps, and service teams. Each project is framed around role, scope, available proof, and the design decisions behind the interface.',
  },
  '/contact.html': {
    eyebrow: 'Contact',
    title: 'Send the product, role, or design problem.',
    lead: 'Share what you are building, who it is for, what feels unclear, and when you need help. I will reply with fit, availability, and a practical next step.',
  },
};

PAGE_COPY['/index.html'] = PAGE_COPY['/'];

const PROJECT_DETAIL_COPY = {
  eyebrow: 'Product design case study',
  leadSuffix: 'The focus was clearer hierarchy, practical interaction states, and handoff decisions that could be reviewed with product and engineering.',
  outcomeTitle: 'What the design clarified',
  processTitle: 'Design decisions',
};

const BLOG_COPY = {
  eyebrow: 'Design writing',
  title: 'Notes on product clarity, interface decisions, and handoff.',
  lead: 'Short, practical writing on UX patterns, Web3 product flows, dashboards, design systems, and the small decisions that make interfaces easier to review, build, and use.',
};


/**
 * Function contract: setText
 * Purpose: Synchronize text with the requested state while preserving related microcopy polish browser feature invariants.
 * Inputs: `element`, `text`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function setText(element, text) {
  if (!element || !text) return;
  element.textContent = text;
}


/**
 * Function contract: updateHeroCopy
 * Purpose: Apply hero copy consistently while preserving the surrounding microcopy polish browser feature contract.
 * Inputs: `copy`
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateHeroCopy(copy) {
  if (!copy) return;

  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  setText(hero.querySelector('.eyebrow'), copy.eyebrow);
  setText(hero.querySelector('.hero-title'), copy.title);
  setText(hero.querySelector('.body-large, .section-lead'), copy.lead);

  const actions = hero.querySelectorAll('.hero-actions .btn, .cta-group .btn');
  if (actions[0] && copy.primaryCta) actions[0].textContent = copy.primaryCta;
  if (actions[1] && copy.secondaryCta) actions[1].textContent = copy.secondaryCta;

  const proofItems = hero.querySelectorAll('.hero-proof-strip span');
  if (copy.proof && proofItems.length) {
    proofItems.forEach( /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `item`, `index` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (item, index) => {
      if (copy.proof[index]) item.textContent = copy.proof[index];
    });
  }
}


/**
 * Function contract: polishProjectDetailCopy
 * Purpose: Apply project detail copy consistently while preserving the surrounding microcopy polish browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function polishProjectDetailCopy() {
  if (!document.body.classList.contains('nrs-project-detail-page')) return;

  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  const eyebrow = hero.querySelector('.eyebrow, .case-label');
  if (eyebrow && /selected work|project|case/i.test(eyebrow.textContent || '')) {
    eyebrow.textContent = PROJECT_DETAIL_COPY.eyebrow;
  }

  const lead = hero.querySelector('.body-large, .section-lead');
  if (lead && !lead.dataset.microcopyPolished) {
    const current = lead.textContent.trim().replace(/\s+/g, ' ');
    lead.textContent = current.includes('The focus was') ? current : `${current} ${PROJECT_DETAIL_COPY.leadSuffix}`;
    lead.dataset.microcopyPolished = 'true';
  }

  document.querySelectorAll('.section-title, h2').forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `heading` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (heading) => {
    const text = heading.textContent.trim();
    if (/what the design made easier/i.test(text)) heading.textContent = PROJECT_DETAIL_COPY.outcomeTitle;
    if (/how i approached the work/i.test(text)) heading.textContent = PROJECT_DETAIL_COPY.processTitle;
  });
}



/**
 * Function contract: polishBlogCopy
 * Purpose: Apply blog copy consistently while preserving the surrounding microcopy polish browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function polishBlogCopy() {
  const path = window.location.pathname;
  const isBlogListing = path === '/blog/' || path.endsWith('/blog/index.html') || path.endsWith('/blog.html');
  const isBlogDetail = document.body.classList.contains('nrs-blog-detail-page');

  if (isBlogListing) {
    updateHeroCopy(BLOG_COPY);
  }

  if (isBlogDetail) {
    const article = document.querySelector('.nrs-article, article');
    const intro = article?.querySelector('p');
    if (intro && !intro.dataset.microcopyPolished) {
      intro.textContent = intro.textContent.trim();
      intro.dataset.microcopyPolished = 'true';
    }
  }
}



/**
 * Function contract: polishCardCopy
 * Purpose: Apply card copy consistently while preserving the surrounding microcopy polish browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function polishCardCopy() {
  document.querySelectorAll('.project-card .card-summary').forEach(   /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `summary` Side effects: reads or updates DOM/browser state Returns: Undefined; this callback is side-effect-only. */ (summary) => {
    const text = summary.textContent.trim();
    if (!text || summary.dataset.microcopyPolished) return;

    summary.textContent = text
      .replace(/pretty rectangles/gi, 'surface polish')
      .replace(/brochure fog/gi, 'unclear service messaging')
      .replace(/alarmingly mysterious/gi, 'clear enough to review');
    summary.dataset.microcopyPolished = 'true';
  });
}



/**
 * Function contract: polishMicrocopy
 * Purpose: Apply microcopy consistently while preserving the surrounding microcopy polish browser feature contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: reads or updates DOM/browser state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
export function polishMicrocopy() {
  const copy = PAGE_COPY[window.location.pathname];
  updateHeroCopy(copy);
  polishProjectDetailCopy();
  polishBlogCopy();
  polishCardCopy();
}
