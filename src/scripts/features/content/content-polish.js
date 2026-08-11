/**
 * @fileoverview src/scripts/features/content/content-polish.js
 * Purpose: Browser runtime feature in the content domain responsible for content polish behavior.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Browser ES module loaded by the portfolio runtime.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - src/runtime/script.js
 * - src/scripts/entrypoints/main.js
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const projectCopy = {
  '/project-yarsha.html': {
    title: 'Yarsha',
    meta: ['Web3 mobile app', 'Product design'],
    summary: 'Designed mobile flows for Web3 messaging and transfers, focusing on wallet context, permission clarity, transaction review, and trust-building interface details.',
  },
  '/project-mokshya.html': {
    title: 'Mokshya.io',
    meta: ['Web3 protocol site', 'Website UX'],
    summary: 'Structured a protocol website experience around product explanation, developer context, credibility, and clearer paths for users exploring the ecosystem.',
  },
  '/project-hamro-idea.html': {
    title: 'Hamro Idea',
    meta: ['Software studio website', 'Design + front-end'],
    summary: 'Reworked a software company website around clearer services, stronger positioning, SEO-aware page structure, and a more direct inquiry path.',
  },
  '/project-morajaa.html': {
    title: 'Morajaa',
    meta: ['B2B consulting website', 'UX + content structure'],
    summary: 'Designed service and sector page patterns with a guided inquiry experience for a consulting website that needed clearer business communication.',
  },
  '/project-neverwinter-parser.html': {
    title: 'Neverwinter Live Parser',
    meta: ['Desktop tool', 'Product + front-end'],
    summary: 'Designed and built an ongoing Windows tool that turns raw combat logs into readable encounter insights, status feedback, and performance-oriented UI.',
  },
  '/project-orkest.html': {
    title: 'Orkest HQ',
    meta: ['Modular SaaS', 'UX architecture'],
    summary: 'Explored UX structure for a modular business platform across CRM, sales, inventory, finance, and shared workspace patterns.',
  },
  '/project-splashnode.html': {
    title: 'Splashnode',
    meta: ['Technical website', 'Front-end build'],
    summary: 'Designed and coded a website that explains content, device, and data management capabilities through clearer service hierarchy and presentation.',
  },
  '/project-zapp.html': {
    title: 'Zapp Today',
    meta: ['Delivery app', 'Mobile product design'],
    summary: 'Owned mobile UX/UI for customer and driver flows, moving from research and wireframes into final app screens for delivery and scheduled booking use cases.',
  },
  '/project-masteriyo.html': {
    title: 'Masteriyo LMS',
    meta: ['EdTech product', 'Design contribution'],
    summary: 'Contributed Figma design work for a WordPress LMS product as part of a broader product design team, with attention to reusable patterns and UI consistency.',
  },
  '/project-pihub.html': {
    title: 'piHub',
    meta: ['Fintech workflows', 'App experience'],
    summary: 'Worked on investor-facing fintech workflows including applications, credit requests, verification steps, profile management, and status-heavy product states.',
  },
  '/project-grid-labs.html': {
    title: 'Grid Labs Hosting',
    meta: ['Hosting landing page', 'Static front-end'],
    summary: 'Created a static landing page with domain search, service cards, pricing states, service sections, and contact UI for a hosting concept.',
  },
  '/project-zakra-furniture.html': {
    title: 'Zakra Furniture',
    meta: ['WordPress starter', 'Elementor build'],
    summary: 'Designed and built a furniture starter website using Zakra and Elementor, focused on clean product presentation and reusable business sections.',
  },
  '/project-designerex.html': {
    title: 'Designerex',
    meta: ['Marketplace', 'Design contribution'],
    summary: 'Contributed product design work to a luxury fashion rental marketplace within a broader team context, with focus on listing and browsing clarity.',
  },
  '/project-sassboilerplate.html': {
    title: 'sassBoilerplate',
    meta: ['Front-end toolkit', 'Developer workflow'],
    summary: 'Built a front-end starter workflow to organize static website development, Sass structure, and repeatable implementation patterns.',
  },
};

const writingCopy = {
  '/blog/blog-web3-products.html': {
    title: 'Designing Web3 Products Without Making Users Feel Lost',
    summary: 'A practical reflection on wallet clarity, transaction review, trust language, and how Web3 products can educate users before asking them to act.',
  },
  '/blog/blog-good-handoff.html': {
    title: 'Why Good Handoff Matters More Than Perfect Screens',
    summary: 'How states, edge cases, responsive rules, interaction notes, and acceptance criteria make design work easier to implement well.',
  },
  '/blog/blog-portfolio-product.html': {
    title: 'What I Learned Designing My Portfolio Like a Product',
    summary: 'A senior-level look at portfolio UX, contribution clarity, case-study hierarchy, SEO structure, and decision paths for recruiters and clients.',
  },
  '/blog/blog-service-websites.html': {
    title: 'Designing Service Websites That Explain the Business Clearly',
    summary: 'How service pages, positioning, trust signals, and conversion paths can help a business website communicate faster and with less friction.',
  },
  '/blog/blog-gaming-interface-clarity.html': {
    title: 'What Gaming Taught Me About Interface Clarity',
    summary: 'Lessons from real-time feedback, combat logs, status states, information density, and decision-making under pressure.',
  },
  '/blog/blog-design-systems-front-end.html': {
    title: 'How I Think About Design Systems as a Front-End-Aware Designer',
    summary: 'Components, tokens, accessibility notes, responsive behavior, and the practical design-to-code decisions behind maintainable UI systems.',
  },
};

/**
 * Function contract: normalizePath
 * Purpose: Applies normalize path while preserving the surrounding repository/runtime contract.
 * Inputs: href.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function normalizePath(href) {
  try {
    return new URL(href, window.location.origin).pathname;
  } catch {
    return href;
  }
}

/**
 * Function contract: updateProjectCards
 * Purpose: Applies update project cards while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function updateProjectCards() {
  document.querySelectorAll('.project-card[href]').forEach(/** Callback contract: Processes the callback step for document.query selector all('.project card[href]') without leaking orchestration details to the caller. Inputs: card. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (card) => {
    const copy = projectCopy[normalizePath(card.getAttribute('href'))];
    if (!copy) return;

    const title = card.querySelector('h2, h3');
    const summary = card.querySelector('.card-summary');
    const metaItems = card.querySelectorAll('.card-meta-line span');

    if (title) title.textContent = copy.title;
    if (summary) summary.textContent = copy.summary;
    metaItems.forEach(/** Callback contract: Processes the callback step for meta items without leaking orchestration details to the caller. Inputs: item, index. Side effects: may read or update browser DOM/state. No explicit return contract. */ (item, index) => {
      if (copy.meta[index]) item.textContent = copy.meta[index];
    });
  });
}

/**
 * Function contract: updateWritingItems
 * Purpose: Applies update writing items while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function updateWritingItems() {
  document.querySelectorAll('.writing-item[href]').forEach(/** Callback contract: Processes the callback step for document.query selector all('.writing item[href]') without leaking orchestration details to the caller. Inputs: item. Side effects: may read or update browser DOM/state. Returns a value to the invoking API. */ (item) => {
    const copy = writingCopy[normalizePath(item.getAttribute('href'))];
    if (!copy) return;

    const title = item.querySelector('.w-title');
    const summary = item.querySelector('.w-summary');

    if (title) title.textContent = copy.title;
    if (summary) summary.textContent = copy.summary;
  });
}

/**
 * Function contract: updatePageIntros
 * Purpose: Applies update page intros while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or update browser DOM/state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function updatePageIntros() {
  const path = window.location.pathname;
  const heroParagraph = document.querySelector('.hero-section .body-large');

  if (path.endsWith('/projects.html') && heroParagraph) {
    heroParagraph.textContent = 'Selected product design work across consumer mobile apps, Web3 flows, SaaS and enterprise workflows, fintech experiences, service websites, and front-end-aware UI systems. Each project is framed around realistic contribution, constraints, and product decisions.';
  }

  if ((path === '/blog/' || path.endsWith('/blog.html')) && heroParagraph) {
    heroParagraph.textContent = 'Writing from my product design practice: notes on Web3 clarity, developer handoff, portfolio thinking, service website UX, gaming interfaces, and design systems that survive real implementation.';
  }
}

/**
 * Function contract: polishContent
 * Purpose: Applies polish content while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
export function polishContent() {
  updateProjectCards();
  updateWritingItems();
  updatePageIntros();
}
