const PAGE_COPY = {
  '/': {
    eyebrow: 'Product designer for Web3, SaaS, fintech and service teams',
    title: 'I clarify complex product flows so people can understand, trust, and use them.',
    lead: 'I design mobile apps, dashboards, Web3 experiences, websites, design systems and Figma prototypes for teams that need sharper decisions before engineering starts.',
    primaryCta: 'View selected work',
    secondaryCta: 'Discuss a project',
    proof: ['Product strategy', 'Interface systems', 'UX writing', 'Developer handoff', 'Prototype clarity'],
  },
  '/index.html': null,
  '/projects.html': {
    eyebrow: 'Selected work',
    title: 'Product design case studies with context, constraints, and outcomes.',
    lead: 'A focused archive of product, website, and interface work across Web3, fintech, SaaS, mobile apps, and service teams. Each project highlights the design decisions behind the final interface.',
  },
  '/contact.html': {
    eyebrow: 'Project inquiry',
    title: 'Send a clear brief.',
    lead: 'Share what you are building, who it is for, what feels unclear, and when you need help. I will reply with fit, availability, and the next useful step.',
  },
};

PAGE_COPY['/index.html'] = PAGE_COPY['/'];

const PROJECT_DETAIL_COPY = {
  eyebrow: 'Product design case study',
  leadSuffix: 'The focus was clearer hierarchy, stronger trust signals, practical interaction states, and handoff decisions that engineers could use.',
  outcomeTitle: 'What became easier to understand',
  processTitle: 'How I approached the work',
};

const BLOG_COPY = {
  eyebrow: 'Design writing',
  title: 'Notes on product clarity, interface decisions, and better handoff.',
  lead: 'Short, practical writing on UX patterns, Web3 product flows, dashboards, design systems, and the small decisions that make interfaces easier to build and use.',
};

function setText(element, text) {
  if (!element || !text) return;
  element.textContent = text;
}

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
    proofItems.forEach((item, index) => {
      if (copy.proof[index]) item.textContent = copy.proof[index];
    });
  }
}

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

  document.querySelectorAll('.section-title, h2').forEach((heading) => {
    const text = heading.textContent.trim();
    if (/what the design made easier/i.test(text)) heading.textContent = PROJECT_DETAIL_COPY.outcomeTitle;
    if (/how i approached the work/i.test(text)) heading.textContent = PROJECT_DETAIL_COPY.processTitle;
  });
}

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

function polishCardCopy() {
  document.querySelectorAll('.project-card .card-summary').forEach((summary) => {
    const text = summary.textContent.trim();
    if (!text || summary.dataset.microcopyPolished) return;

    summary.textContent = text
      .replace(/pretty rectangles/gi, 'surface polish')
      .replace(/brochure fog/gi, 'unclear service messaging')
      .replace(/alarmingly mysterious/gi, 'clear enough to review');
    summary.dataset.microcopyPolished = 'true';
  });
}

export function polishMicrocopy() {
  const copy = PAGE_COPY[window.location.pathname];
  updateHeroCopy(copy);
  polishProjectDetailCopy();
  polishBlogCopy();
  polishCardCopy();
}
