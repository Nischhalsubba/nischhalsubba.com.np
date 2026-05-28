const PORTRAIT_URL = 'https://i.imgur.com/oFHdPUS.png';

function injectUpgradeStyles() {
  if (document.getElementById('nrs-portfolio-upgrade-styles')) return;

  const style = document.createElement('style');
  style.id = 'nrs-portfolio-upgrade-styles';
  style.textContent = `
    .nrs-home-hero {
      min-height: auto !important;
      padding-top: clamp(150px, 16vw, 220px) !important;
      padding-bottom: clamp(80px, 10vw, 140px) !important;
    }

    .hero-portrait-container {
      width: min(520px, 86vw) !important;
      margin: clamp(38px, 5vw, 72px) auto 0 !important;
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      overflow: visible !important;
      border-radius: 0 !important;
    }

    .hero-portrait-img {
      display: block;
      width: 100% !important;
      height: auto !important;
      aspect-ratio: auto !important;
      object-fit: contain !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
      filter: drop-shadow(0 36px 80px rgba(0, 0, 0, .38));
    }

    .nrs-senior-proof-grid,
    .nrs-process-grid,
    .nrs-hiring-grid,
    .nrs-case-study-grid {
      display: grid;
      gap: 18px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .nrs-senior-proof-card,
    .nrs-process-card,
    .nrs-hiring-card,
    .nrs-case-study-card {
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      border-radius: 28px;
      padding: clamp(24px, 3vw, 34px);
      background: color-mix(in srgb, var(--bg-surface, #0b0b0b) 84%, transparent);
      min-height: 100%;
      transition: border-color .25s ease, transform .25s ease, background-color .25s ease;
    }

    .nrs-senior-proof-card:hover,
    .nrs-process-card:hover,
    .nrs-hiring-card:hover,
    .nrs-case-study-card:hover {
      border-color: color-mix(in srgb, var(--accent-blue, #3B82F6) 45%, var(--border-faint, rgba(255,255,255,.1)));
      transform: translateY(-4px);
    }

    .nrs-card-kicker {
      display: block;
      margin-bottom: 12px;
      color: var(--text-tertiary, #9ca3af);
      font-size: .75rem;
      font-weight: 700;
      letter-spacing: .13em;
      text-transform: uppercase;
    }

    .nrs-senior-proof-card h3,
    .nrs-process-card h3,
    .nrs-hiring-card h3,
    .nrs-case-study-card h3 {
      margin: 0 0 12px;
      font-size: clamp(1.12rem, 1.7vw, 1.45rem);
      line-height: 1.2;
    }

    .nrs-senior-proof-card p,
    .nrs-process-card p,
    .nrs-hiring-card p,
    .nrs-case-study-card p {
      margin: 0;
      color: var(--text-secondary, #d4d4d8);
      line-height: 1.75;
    }

    .nrs-proof-strip {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 28px;
    }

    .nrs-proof-pill {
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      border-radius: 999px;
      padding: 10px 15px;
      color: var(--text-secondary, #d4d4d8);
      background: color-mix(in srgb, var(--bg-surface, #0b0b0b) 72%, transparent);
      font-size: .9rem;
    }

    .nrs-detail-list {
      display: grid;
      gap: 10px;
      margin-top: 18px;
    }

    .nrs-detail-list span {
      color: var(--text-secondary, #d4d4d8);
      line-height: 1.55;
    }

    .nrs-project-role-badge {
      display: inline-flex;
      margin-bottom: 12px;
      border: 1px solid var(--border-faint, rgba(255,255,255,.1));
      border-radius: 999px;
      padding: 7px 11px;
      color: var(--text-tertiary, #9ca3af);
      font-size: .75rem;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    @media (max-width: 900px) {
      .nrs-senior-proof-grid,
      .nrs-process-grid,
      .nrs-hiring-grid,
      .nrs-case-study-grid { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

function useRequestedPortrait() {
  document.querySelectorAll('.hero-portrait-img, .footer-portrait-img, .profile-img').forEach((image) => {
    image.src = PORTRAIT_URL;
    image.removeAttribute('style');
  });

  document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach((meta) => {
    meta.setAttribute('content', PORTRAIT_URL);
  });
}

function createSection({ id, kicker, title, lead, gridClass, cards }) {
  if (document.getElementById(id)) return null;

  const section = document.createElement('section');
  section.className = 'section-container reveal-on-scroll';
  section.id = id;
  section.innerHTML = `
    <div style="text-align:center;max-width:920px;margin:0 auto 52px;">
      <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.12em;">${kicker}</p>
      <h2 class="section-title" style="margin-bottom:18px;">${title}</h2>
      <p class="section-lead" style="margin:0 auto;">${lead}</p>
    </div>
    <div class="${gridClass}">
      ${cards.map((card) => `
        <article class="${gridClass.replace('grid', 'card')}">
          <span class="nrs-card-kicker">${card.kicker}</span>
          <h3>${card.title}</h3>
          <p>${card.body}</p>
        </article>`).join('')}
    </div>`;

  return section;
}

function addHomepageSections() {
  const main = document.querySelector('main.container');
  if (!main || !(location.pathname === '/' || location.pathname.endsWith('/home-v2') || location.pathname.endsWith('/home-v2.html') || location.pathname.endsWith('/index.html'))) return;

  const proofSection = document.getElementById('proof-heading')?.closest('section');
  const selectedWork = document.getElementById('selected-work-heading')?.closest('section');

  const hiring = createSection({
    id: 'hiring-proof',
    kicker: 'Why teams hire me',
    title: 'Senior design support beyond polished screens.',
    lead: 'The strongest value I bring is not only visual UI. It is the ability to structure product decisions, make flows understandable, prepare practical handoff, and keep design realistic for implementation.',
    gridClass: 'nrs-hiring-grid',
    cards: [
      { kicker: 'Product thinking', title: 'I clarify the flow before polishing the UI.', body: 'I look at user intent, information hierarchy, decisions, permissions, states, and edge cases before pushing a screen into high fidelity.' },
      { kicker: 'Design systems', title: 'I design components that survive real use.', body: 'Variants, empty states, loading states, responsive behavior, and developer notes are part of the work — not an afterthought.' },
      { kicker: 'Handoff', title: 'I make engineering collaboration easier.', body: 'I prepare interaction notes, visual specs, implementation expectations, and design QA feedback so the final product stays close to the intended experience.' },
    ],
  });

  const process = createSection({
    id: 'design-process',
    kicker: 'How I work',
    title: 'A practical design process for real product teams.',
    lead: 'Every project is different, but I usually move through the same decision path: understand the product, structure the flow, design the system, prototype the interaction, and support build quality.',
    gridClass: 'nrs-process-grid',
    cards: [
      { kicker: '01 / Understand', title: 'Context, constraints, and product intent', body: 'I start by understanding business goals, user needs, technical constraints, and what success realistically means for the current stage.' },
      { kicker: '02 / Structure', title: 'Flows, IA, and state mapping', body: 'Before final UI, I map the decisions, screens, empty states, errors, permissions, and next-step paths that make the product understandable.' },
      { kicker: '03 / Ship', title: 'UI, prototype, handoff, and QA', body: 'I move from high-fidelity interface design into prototypes, component notes, handoff specs, and implementation review.' },
    ],
  });

  const caseStudyExpectations = createSection({
    id: 'case-study-standards',
    kicker: 'Case study standards',
    title: 'Each project should make my role, constraints, and decisions clear.',
    lead: 'I am updating the portfolio around realistic contribution instead of inflated claims. The goal is to make each case study easier for founders, recruiters, and engineers to evaluate.',
    gridClass: 'nrs-case-study-grid',
    cards: [
      { kicker: 'Role clarity', title: 'What I owned vs. contributed to', body: 'Each project should clearly identify whether I led product design, contributed to a team, built the front end, or explored a concept.' },
      { kicker: 'Design decisions', title: 'Why the interface changed', body: 'Strong case studies should show the reasoning behind hierarchy, flows, trust states, content, and interaction details.' },
      { kicker: 'Next improvements', title: 'What I would improve next', body: 'Senior designers can explain limitations. I want each case study to include what I would test, refine, or improve next.' },
    ],
  });

  if (hiring && proofSection) proofSection.insertAdjacentElement('afterend', hiring);
  if (process && selectedWork) selectedWork.insertAdjacentElement('beforebegin', process);
  if (caseStudyExpectations && selectedWork) selectedWork.insertAdjacentElement('afterend', caseStudyExpectations);

  const proofStrip = document.querySelector('.nrs-proof-strip');
  if (!proofStrip) {
    const hero = document.querySelector('.nrs-home-hero');
    hero?.insertAdjacentHTML('beforeend', `
      <div class="nrs-proof-strip reveal-on-scroll" aria-label="Portfolio proof points">
        <span class="nrs-proof-pill">6+ years in UI/Product Design</span>
        <span class="nrs-proof-pill">Mobile apps, SaaS, Web3 and enterprise UX</span>
        <span class="nrs-proof-pill">Design systems, prototypes and handoff</span>
        <span class="nrs-proof-pill">Available for remote product design work</span>
      </div>`);
  }
}

function improveProjectCards() {
  document.querySelectorAll('.project-card[href]').forEach((card) => {
    if (card.querySelector('.nrs-project-role-badge')) return;
    const href = card.getAttribute('href') || '';
    const role = href.includes('masteriyo') || href.includes('designerex') ? 'Design contribution' : href.includes('sassboilerplate') || href.includes('neverwinter') ? 'Designed + built' : 'Product design';
    card.querySelector('.card-content')?.insertAdjacentHTML('afterbegin', `<span class="nrs-project-role-badge">${role}</span>`);
  });
}

function improveProjectDetailPages() {
  if (!location.pathname.includes('project-')) return;
  const main = document.querySelector('main.container, main');
  if (!main || document.getElementById('project-review-notes')) return;

  const section = document.createElement('section');
  section.id = 'project-review-notes';
  section.className = 'section-container reveal-on-scroll';
  section.innerHTML = `
    <div style="text-align:center;max-width:880px;margin:0 auto 46px;">
      <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.12em;">Senior review lens</p>
      <h2 class="section-title" style="margin-bottom:18px;">How I evaluate this work now</h2>
      <p class="section-lead" style="margin:0 auto;">For each project, I look at the product problem, what I personally owned, the constraints around the work, and what I would improve in a future iteration.</p>
    </div>
    <div class="nrs-case-study-grid">
      <article class="nrs-case-study-card"><span class="nrs-card-kicker">Role</span><h3>Contribution should be clear</h3><p>Good portfolio work separates leading, contributing, designing, building, and exploring so the viewer understands the actual scope.</p></article>
      <article class="nrs-case-study-card"><span class="nrs-card-kicker">Decision</span><h3>UI choices need product reasoning</h3><p>The strongest screens are supported by hierarchy, state logic, copy decisions, edge cases, and implementation constraints.</p></article>
      <article class="nrs-case-study-card"><span class="nrs-card-kicker">Next</span><h3>Every project can evolve</h3><p>I would continue improving these projects through user feedback, analytics, accessibility checks, design QA, and clearer system documentation.</p></article>
    </div>`;
  main.appendChild(section);
}

function improveBlogPages() {
  if (!location.pathname.startsWith('/blog/')) return;
  const article = document.querySelector('article');
  if (!article || document.getElementById('article-designer-note')) return;

  article.insertAdjacentHTML('beforeend', `
    <section id="article-designer-note" class="nrs-article-section">
      <h2>Designer note</h2>
      <p>This article is written from a practical product design perspective: what needs to be clear for users, what needs to be clear for teams, and what needs to survive implementation. The goal is not to make interfaces feel clever, but to make decisions easier for the people using them.</p>
    </section>`);
}

export function applyPortfolioUpgrades() {
  injectUpgradeStyles();
  useRequestedPortrait();
  addHomepageSections();
  improveProjectCards();
  improveProjectDetailPages();
  improveBlogPages();
}
