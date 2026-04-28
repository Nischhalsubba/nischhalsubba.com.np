/*
 * Portfolio improvements layer.
 * Adds visible service navigation, proof blocks, page-specific case/article context,
 * footer service links, and mobile performance safeguards.
 */
(() => {
  const projectContext = {
    '/project-yarsha.html': {
      focus: 'Web3 messaging, wallet actions, blinks, and transaction review clarity.',
      role: 'Product design for mobile Web3 flows, with emphasis on understandable wallet interactions.',
      decisions: ['Explain wallet-related actions before confirmation.', 'Use clear status language for transfer and review moments.', 'Keep messaging and transaction context connected instead of making them feel like separate products.'],
      links: [['Read Web3 UX article', '/blog/blog-web3-products.html'], ['Explore Web3 UX service', '/web3-ux-designer.html']]
    },
    '/project-mokshya.html': {
      focus: 'Web3 protocol website clarity and developer-focused product storytelling.',
      role: 'Website design focused on hierarchy, positioning, trust, and technical explanation.',
      decisions: ['Lead with the protocol value before technical detail.', 'Create stronger CTA paths for developer and product interest.', 'Use content hierarchy to reduce Web3 explanation friction.'],
      links: [['Explore Web3 UX service', '/web3-ux-designer.html'], ['Read Web3 UX article', '/blog/blog-web3-products.html']]
    },
    '/project-hamro-idea.html': {
      focus: 'Software studio rebrand, service clarity, SEO structure, and static website implementation.',
      role: 'Brand direction, website content structure, UI design, and front-end implementation.',
      decisions: ['Clarify service categories instead of using generic agency language.', 'Build SEO-friendly sections that explain business value.', 'Create a conversion path from service discovery to inquiry.'],
      links: [['Explore Website UX service', '/website-ux-design.html'], ['Read service website article', '/blog/blog-service-websites.html']]
    },
    '/project-morajaa.html': {
      focus: 'B2B consulting website UX, service pages, sector pages, and segmented lead collection.',
      role: 'UX and content structure for a premium consulting website experience.',
      decisions: ['Break broad services into more specific pages.', 'Use sector-specific framing for clearer visitor intent.', 'Guide inquiries through a more structured lead flow.'],
      links: [['Explore Website UX service', '/website-ux-design.html'], ['Read service website article', '/blog/blog-service-websites.html']]
    },
    '/project-pihub.html': {
      focus: 'Fintech workflows for investor, creditor, and admin experiences.',
      role: 'Fintech app UX around applications, verification, credit requests, and profile management.',
      decisions: ['Make role-specific actions easy to distinguish.', 'Use clear states for verification and financial decision points.', 'Reduce ambiguity in forms and workflow progression.'],
      links: [['Explore Product Design service', '/product-design-nepal.html'], ['View all projects', '/projects.html']]
    },
    '/project-masteriyo.html': {
      focus: 'WordPress LMS product interface and contribution-based design work.',
      role: 'Figma design contribution as part of a multi-designer product team.',
      decisions: ['Keep contribution language honest and specific.', 'Focus on LMS usability around learning and admin tasks.', 'Support product consistency through reusable interface patterns.'],
      links: [['Explore design systems service', '/figma-design-systems.html'], ['Read design systems article', '/blog/blog-design-systems-front-end.html']]
    },
    '/project-zapp.html': {
      focus: 'Logistics mobile app UX for customer, driver, and admin flows.',
      role: 'Mobile product design from wireframe to final prototype.',
      decisions: ['Separate customer and driver needs clearly.', 'Make delivery status and scheduling easier to follow.', 'Design flows around task completion and real-world timing.'],
      links: [['Explore Product Design service', '/product-design-nepal.html'], ['View all projects', '/projects.html']]
    },
    '/project-orkest.html': {
      focus: 'Modular SaaS UX architecture for CRM, Sales, Inventory, and Finance.',
      role: 'UX direction for a business platform with shared modules and workflows.',
      decisions: ['Create a clear modular structure.', 'Separate shared app areas from business-specific modules.', 'Reduce complexity across repeated business workflows.'],
      links: [['Explore SaaS UX service', '/saas-ux-designer.html'], ['Read design systems article', '/blog/blog-design-systems-front-end.html']]
    }
  };

  const blogContext = {
    '/blog/blog-web3-products.html': {
      note: 'This article connects Web3 product clarity with real interface decisions around wallet actions, signing, transaction review, and protocol explanation.',
      links: [['Yarsha case study', '/project-yarsha.html'], ['Mokshya.io case study', '/project-mokshya.html'], ['Web3 UX service', '/web3-ux-designer.html']]
    },
    '/blog/blog-good-handoff.html': {
      note: 'This article focuses on how product designers can reduce implementation ambiguity through states, edge cases, responsive behavior, and clear acceptance criteria.',
      links: [['Figma design systems', '/figma-design-systems.html'], ['UX audit service', '/ux-audit.html'], ['Design systems article', '/blog/blog-design-systems-front-end.html']]
    },
    '/blog/blog-portfolio-product.html': {
      note: 'This article explains how a portfolio can be treated like a product, with honest contribution framing, content hierarchy, proof, and decision paths.',
      links: [['View projects', '/projects.html'], ['About Nischhal', '/about.html'], ['Product design service', '/product-design-nepal.html']]
    },
    '/blog/blog-service-websites.html': {
      note: 'This article focuses on making service websites clearer through specific page structure, service explanation, trust signals, SEO-friendly headings, and conversion paths.',
      links: [['Hamro Idea case study', '/project-hamro-idea.html'], ['Morajaa case study', '/project-morajaa.html'], ['Website UX service', '/website-ux-design.html']]
    },
    '/blog/blog-gaming-interface-clarity.html': {
      note: 'This article looks at interface clarity through real-time feedback, combat logs, status states, dense information, and fast decision-making.',
      links: [['Neverwinter parser case study', '/project-neverwinter-parser.html'], ['UX audit service', '/ux-audit.html'], ['View all writing', '/blog/']]
    },
    '/blog/blog-design-systems-front-end.html': {
      note: 'This article focuses on design systems as practical bridges between Figma and implementation: tokens, components, states, accessibility, and responsive behavior.',
      links: [['Figma design systems', '/figma-design-systems.html'], ['Masteriyo case study', '/project-masteriyo.html'], ['Good handoff article', '/blog/blog-good-handoff.html']]
    }
  };

  const services = [
    ['Product Design', 'UX/UI, prototypes, product flows, and developer-ready handoff.', '/product-design-nepal.html'],
    ['Web3 UX', 'Wallet onboarding, signing clarity, transaction review, and protocol websites.', '/web3-ux-designer.html'],
    ['SaaS UX', 'Dashboards, CRM flows, admin tools, and workflow-heavy products.', '/saas-ux-designer.html'],
    ['Website UX', 'Service pages, SEO structure, trust signals, and conversion paths.', '/website-ux-design.html'],
    ['Figma Systems', 'Components, tokens, UI states, responsive rules, and handoff notes.', '/figma-design-systems.html'],
    ['UX Audit', 'Usability, hierarchy, content, accessibility, and conversion review.', '/ux-audit.html']
  ];

  function addStyles() {
    if (document.getElementById('nrs-portfolio-improvements-styles')) return;
    const style = document.createElement('style');
    style.id = 'nrs-portfolio-improvements-styles';
    style.textContent = `
      .nrs-services-grid, .nrs-proof-grid, .nrs-context-grid { display:grid; gap:24px; }
      .nrs-services-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .nrs-proof-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .nrs-context-grid { grid-template-columns: 1.1fr .9fr; }
      .nrs-panel { border:1px solid var(--border-faint); background:var(--bg-surface); border-radius:24px; padding:clamp(24px,4vw,36px); }
      .nrs-panel h3 { font-size:clamp(1.25rem,2vw,1.7rem); margin:0 0 12px; }
      .nrs-panel p, .nrs-panel li { color:var(--text-secondary); line-height:1.75; }
      .nrs-panel ul { padding-left:1.2rem; display:grid; gap:10px; }
      .nrs-kicker { color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.12em; font-size:.78rem; margin:0 0 12px; }
      .nrs-proof-number { font-family:var(--font-serif,serif); font-size:clamp(2.3rem,5vw,4rem); line-height:1; margin-bottom:12px; }
      .nrs-link-row { display:flex; flex-wrap:wrap; gap:12px; margin-top:22px; }
      .nrs-link-pill { border:1px solid var(--border-faint); border-radius:999px; padding:10px 16px; color:var(--text-secondary); }
      .nrs-link-pill:hover { border-color:var(--text-primary); color:var(--text-primary); }
      @media (max-width: 900px) { .nrs-services-grid, .nrs-proof-grid, .nrs-context-grid { grid-template-columns: 1fr; } }
      @media (max-width: 768px), (prefers-reduced-motion: reduce) {
        #grid-canvas, .custom-cursor-dot, .custom-cursor-outline { display:none !important; }
        .ticker { animation:none !important; }
        .page-transition-overlay, .page-skeleton { display:none !important; }
        .project-card:hover .card-media-wrap img { transform:none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function createServicesSection() {
    const section = document.createElement('section');
    section.className = 'section-container nrs-services-section';
    section.innerHTML = `
      <div style="text-align:center;max-width:860px;margin:0 auto 48px;">
        <p class="nrs-kicker">Services and focus areas</p>
        <h2 class="section-title" style="margin-bottom:18px;">Focused design help for products, websites, and complex workflows.</h2>
        <p class="section-lead" style="margin:0 auto;">These pages explain the kinds of work I can support, with related projects and writing for each focus area.</p>
      </div>
      <div class="nrs-services-grid">
        ${services.map(([title, copy, url]) => `<a class="nrs-panel" href="${url}"><p class="nrs-kicker">Focus area</p><h3>${title}</h3><p>${copy}</p></a>`).join('')}
      </div>`;
    return section;
  }

  function createProofSection() {
    const section = document.createElement('section');
    section.className = 'section-container nrs-proof-section';
    section.innerHTML = `
      <div style="text-align:center;max-width:860px;margin:0 auto 48px;">
        <p class="nrs-kicker">Proof and credibility</p>
        <h2 class="section-title" style="margin-bottom:18px;">Public work, verified learning, and visible design presence.</h2>
        <p class="section-lead" style="margin:0 auto;">I keep this section factual: public portfolio pages, writing, learning records, and external profiles that can be checked.</p>
      </div>
      <div class="nrs-proof-grid">
        <a class="nrs-panel" href="/projects.html"><div class="nrs-proof-number">14</div><h3>Project pages</h3><p>Public portfolio pages across Web3, SaaS, fintech, websites, mobile apps, and front-end work.</p></a>
        <a class="nrs-panel" href="/blog/"><div class="nrs-proof-number">6</div><h3>Design articles</h3><p>Writing on Web3 UX, handoff, service websites, portfolios, gaming interfaces, and design systems.</p></a>
        <a class="nrs-panel" href="https://app.uxcel.com/ux/nischhal"><div class="nrs-proof-number">Uxcel</div><h3>Public profile</h3><p>Design learning, skill profile, and ranking presence. Exact ranking numbers should only be shown when verified.</p></a>
        <a class="nrs-panel" href="https://www.coursera.org/user/d31199a0cf6fbdd1b736e446b896b7fd"><div class="nrs-proof-number">UX</div><h3>Google certificate</h3><p>Google UX Design Professional Certificate and additional public learning records.</p></a>
      </div>`;
    return section;
  }

  function addHomeEnhancements() {
    const path = window.location.pathname;
    if (!(path === '/' || path === '/home-v2.html') || document.querySelector('.nrs-services-section')) return;
    const selectedWork = Array.from(document.querySelectorAll('.section-container')).find((section) => section.textContent.includes('Selected Work'));
    if (selectedWork) {
      selectedWork.insertAdjacentElement('beforebegin', createServicesSection());
      selectedWork.insertAdjacentElement('beforebegin', createProofSection());
    }
  }

  function createContextSection(type, data) {
    const section = document.createElement('section');
    section.className = 'section-container nrs-context-section';
    const title = type === 'project' ? 'Case study structure' : 'Article context';
    const intro = type === 'project' ? 'A clearer look at what this project page is about.' : 'A clearer look at what this article is meant to connect.';
    section.innerHTML = `
      <div style="max-width:980px;margin:0 auto 40px;">
        <p class="nrs-kicker">${title}</p>
        <h2 class="section-title" style="margin-bottom:18px;">${intro}</h2>
      </div>
      <div class="nrs-context-grid">
        <div class="nrs-panel">
          <p class="nrs-kicker">Focus</p>
          <h3>${data.focus || 'Focused product design context'}</h3>
          <p>${data.role || data.note || ''}</p>
        </div>
        <div class="nrs-panel">
          <p class="nrs-kicker">Related paths</p>
          <h3>Continue with relevant work</h3>
          <div class="nrs-link-row">${(data.links || []).map(([label, url]) => `<a class="nrs-link-pill" href="${url}">${label}</a>`).join('')}</div>
        </div>
      </div>
      ${data.decisions ? `<div class="nrs-panel" style="margin-top:24px;"><p class="nrs-kicker">Design decisions</p><h3>What this page should help explain</h3><ul>${data.decisions.map((item) => `<li>${item}</li>`).join('')}</ul></div>` : ''}`;
    return section;
  }

  function addDetailContext() {
    const path = window.location.pathname;
    if (document.querySelector('.nrs-context-section')) return;
    const data = projectContext[path];
    const blog = blogContext[path];
    if (!data && !blog) return;
    const faq = document.querySelector('.nrs-seo-faq');
    const continuation = document.querySelector('.nrs-detail-continuation, .detail-continuation');
    const footer = document.querySelector('footer, .nrs-auto-footer');
    const target = faq || continuation || footer;
    const section = createContextSection(data ? 'project' : 'blog', data || blog);
    if (target) target.insertAdjacentElement('beforebegin', section);
    else document.querySelector('main')?.appendChild(section);
  }

  function addFooterServiceLinks() {
    const footers = document.querySelectorAll('footer');
    footers.forEach((footer) => {
      if (footer.querySelector('.nrs-footer-services')) return;
      const block = document.createElement('div');
      block.className = 'nrs-footer-services';
      block.style.cssText = 'max-width:1200px;margin:40px auto 0;padding:0 var(--container-padding);';
      block.innerHTML = `<div class="nrs-link-row" style="justify-content:center;">${services.map(([title,, url]) => `<a class="nrs-link-pill" href="${url}">${title}</a>`).join('')}</div>`;
      footer.appendChild(block);
    });
  }

  function run() {
    addStyles();
    addHomeEnhancements();
    addDetailContext();
    addFooterServiceLinks();
    setTimeout(() => { addDetailContext(); addFooterServiceLinks(); }, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
