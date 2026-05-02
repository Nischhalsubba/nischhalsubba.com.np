/*
 * Lightweight runtime polish for Nischhal Raj Subba portfolio.
 *
 * Build-time SEO handles static FAQ/context/schema for project and blog pages.
 * This file handles safe runtime enhancements:
 * - service page depth sections when missing
 * - author/entity profile visibility on blog pages
 * - stronger Person schema on key profile pages
 * - iframe click-to-load for performance
 * - media performance attributes
 * - canonical cleanup
 * - external link hardening
 */
(() => {
  const SITE = 'https://nischhalsubba.com.np';
  const UPDATED = '2026-05-02';

  const profileLinks = [
    'https://linktr.ee/nischhalsubba',
    'https://www.behance.net/nischhal',
    'https://app.uxcel.com/ux/nischhal',
    'https://github.com/Nischhalsubba',
    'https://linkedin.com/in/nischhal/',
    'https://www.coursera.org/user/d31199a0cf6fbdd1b736e446b896b7fd'
  ];

  const serviceContent = {
    '/product-design-nepal.html': {
      title: 'Product design support for teams that need clearer digital experiences',
      who: 'Startups, software companies, Web3 teams, SaaS teams, and service businesses that need product flows, interface design, prototypes, and developer-ready design clarity.',
      deliverables: ['UX review and product clarity notes', 'User flows and information architecture', 'Wireframes and high-fidelity UI', 'Figma prototype and component guidance', 'Developer handoff notes'],
      process: ['Understand the product and user goal', 'Map core flows and friction points', 'Design clear screens and states', 'Prototype important interactions', 'Prepare handoff and improvement notes'],
      faqs: [
        ['What product design services does Nischhal offer?', 'Nischhal offers product design, UX/UI design, prototypes, design systems, UX audits, and developer handoff.'],
        ['Where is Nischhal based?', 'Nischhal is based in Nepal and works on digital product design projects remotely.'],
        ['What types of products does Nischhal design?', 'He works across Web3 apps, SaaS dashboards, fintech products, service websites, and front-end-aware product experiences.']
      ]
    },
    '/web3-ux-designer.html': {
      title: 'Web3 UX support for wallet, signing, and transaction-heavy products',
      who: 'Web3 apps, protocol websites, wallet-enabled products, crypto tools, and teams that need users to understand sensitive wallet actions before signing or transferring.',
      deliverables: ['Wallet onboarding flow', 'Transaction review screen structure', 'Signing and permission clarity', 'Error, pending, and success states', 'Trust-focused microcopy and handoff notes'],
      process: ['Map wallet and transaction moments', 'Identify where users feel risk or confusion', 'Design review and confirmation states', 'Clarify status and recovery flows', 'Document the interaction logic'],
      faqs: [
        ['What does a Web3 UX designer do?', 'A Web3 UX designer makes wallet, transaction, signing, onboarding, and protocol experiences easier to understand and trust.'],
        ['Which Web3 projects has Nischhal worked on?', 'Relevant public projects include Yarsha and Mokshya.io.'],
        ['Why is Web3 UX different?', 'Web3 UX requires careful explanation of wallet actions, fees, signing, ownership, and transaction states.']
      ]
    },
    '/saas-ux-designer.html': {
      title: 'SaaS UX support for dashboards, admin tools, and workflow-heavy products',
      who: 'SaaS teams building dashboards, CRM-style tools, finance workflows, admin panels, internal tools, and modular business platforms.',
      deliverables: ['Dashboard information architecture', 'Table, filter, and status-state design', 'Role-based user flows', 'Reusable component direction', 'Workflow and handoff documentation'],
      process: ['Understand roles and repeated tasks', 'Map the dashboard hierarchy', 'Design key flows and states', 'Simplify navigation and actions', 'Prepare developer-ready notes'],
      faqs: [
        ['What does a SaaS UX designer focus on?', 'A SaaS UX designer focuses on dashboards, workflows, navigation, data clarity, roles, and repeated task efficiency.'],
        ['Which SaaS projects are relevant?', 'Orkest HQ and Masteriyo LMS are relevant public portfolio examples.'],
        ['Why is SaaS UX important?', 'Good SaaS UX reduces confusion in complex workflows and helps users complete business tasks faster.']
      ]
    },
    '/website-ux-design.html': {
      title: 'Website UX support for service businesses and software companies',
      who: 'Software companies, B2B consulting firms, SaaS websites, agencies, and service businesses that need clearer content, stronger trust signals, and better conversion paths.',
      deliverables: ['Homepage and service page structure', 'SEO-friendly heading hierarchy', 'Trust and proof sections', 'CTA and inquiry flow design', 'Responsive website UI and content guidance'],
      process: ['Clarify the business and audience', 'Structure the website around user intent', 'Rewrite page hierarchy and CTAs', 'Connect services to proof and case studies', 'Prepare responsive design and handoff notes'],
      faqs: [
        ['What is website UX design?', 'Website UX design shapes content, navigation, hierarchy, trust signals, and conversion paths so visitors understand and act.'],
        ['Which website projects are relevant?', 'Hamro Idea, Morajaa, Splashnode, and Grid Labs are relevant examples.'],
        ['How does SEO connect with website UX?', 'Good headings, useful page structure, internal links, and specific service copy help both users and search engines.']
      ]
    },
    '/figma-design-systems.html': {
      title: 'Figma design system support for reusable product interfaces',
      who: 'Product teams that need reusable Figma components, consistent UI states, design tokens, responsive behavior, and clearer developer handoff.',
      deliverables: ['Component inventory and cleanup', 'Reusable Figma components and variants', 'Color, type, spacing, and radius tokens', 'State and responsive behavior notes', 'Developer handoff documentation'],
      process: ['Audit repeated UI patterns', 'Define tokens and component structure', 'Create variants and states', 'Document usage rules', 'Prepare handoff guidance'],
      faqs: [
        ['What is a Figma design system?', 'A Figma design system organizes reusable components, styles, states, tokens, and documentation for consistent product design.'],
        ['Why does front-end awareness matter?', 'Front-end awareness helps designers create components and layouts that can be implemented more reliably.'],
        ['What should a design system include?', 'It should include components, variants, states, spacing, typography, color, accessibility notes, and handoff guidance.']
      ]
    },
    '/ux-audit.html': {
      title: 'UX audit support for websites, SaaS products, and mobile apps',
      who: 'Teams that need to find usability, hierarchy, content, conversion, accessibility, and handoff issues before redesigning or rebuilding a product.',
      deliverables: ['Page-by-page UX findings', 'Priority issue list', 'Content and CTA recommendations', 'Accessibility and responsive concerns', 'Actionable redesign or handoff notes'],
      process: ['Review goals and key pages', 'Audit user flows and page hierarchy', 'Find usability and content gaps', 'Prioritize issues by impact', 'Recommend clear next steps'],
      faqs: [
        ['What is a UX audit?', 'A UX audit reviews a product or website to identify usability, content, hierarchy, accessibility, and conversion problems.'],
        ['What does a UX audit include?', 'It can include heuristic review, page-by-page findings, priority fixes, content recommendations, and design improvement suggestions.'],
        ['Who needs a UX audit?', 'Startups, SaaS teams, service websites, and product teams that need clarity before redesign or development can benefit from a UX audit.']
      ]
    }
  };

  function currentPath() {
    if (window.location.pathname === '/blog') return '/blog/';
    return window.location.pathname;
  }

  function addJsonLd(id, data) {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  }

  function personSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${SITE}/#nischhal-raj-subba`,
      name: 'Nischhal Raj Subba',
      alternateName: 'Nischhal',
      jobTitle: 'Product Designer',
      description: 'Nischhal Raj Subba is a Product Designer in Nepal focused on Web3 UX, SaaS dashboards, fintech app experiences, website UX, design systems, UX audits, Figma prototypes, and front-end-aware product design.',
      url: `${SITE}/`,
      mainEntityOfPage: `${SITE}/nischhal-raj-subba.html`,
      image: 'https://i.imgur.com/ixsEpYM.png',
      email: 'mailto:hinischalsubba@gmail.com',
      nationality: { '@type': 'Country', name: 'Nepal' },
      address: { '@type': 'PostalAddress', addressCountry: 'Nepal' },
      knowsAbout: ['Product Design', 'UX Design', 'UI Design', 'Web3 UX', 'Wallet UX', 'Transaction Review UX', 'SaaS UX', 'Dashboard UX', 'Fintech UX', 'Website UX', 'Design Systems', 'Figma Prototyping', 'UX Writing', 'Developer Handoff', 'UX Audit', 'Front-End-Aware Design'],
      sameAs: profileLinks
    };
  }

  function ensureCanonical() {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    const path = currentPath();
    canonical.href = `${SITE}${path === '/home-v2.html' ? '/' : path}`;
  }

  function addEntitySchemaOnKeyPages() {
    const path = currentPath();
    if (path === '/' || path === '/home-v2.html' || path === '/about.html' || path === '/nischhal-raj-subba.html') {
      addJsonLd('nrs-entity-person-schema', personSchema());
    }
  }

  function addAuthorBlockToBlogs() {
    const path = currentPath();
    if (!path.includes('/blog/') || path === '/blog/' || document.querySelector('.nrs-author-block')) return;
    const main = document.querySelector('main') || document.body;
    const hero = document.querySelector('.hero-section, article.section-container, main > section');
    const block = document.createElement('section');
    block.className = 'section-container nrs-author-block';
    block.innerHTML = `
      <div style="max-width:980px;margin:0 auto;border:1px solid var(--border-faint);border-radius:24px;background:var(--bg-surface);padding:clamp(24px,4vw,40px);display:grid;grid-template-columns:96px 1fr;gap:24px;align-items:center;">
        <img src="https://i.imgur.com/ixsEpYM.png" alt="Nischhal Raj Subba, Product Designer in Nepal" width="96" height="96" loading="lazy" decoding="async" style="width:96px;height:96px;border-radius:20px;object-fit:cover;" />
        <div>
          <p class="eyebrow" style="margin-bottom:8px;">Written by</p>
          <h2 style="margin:0 0 8px;font-size:clamp(1.4rem,3vw,2rem);">Nischhal Raj Subba</h2>
          <p style="margin:0 0 16px;color:var(--text-secondary);line-height:1.7;">Product Designer in Nepal focused on Web3 UX, SaaS dashboards, fintech app experiences, website UX, design systems, UX audits, and front-end-aware product design.</p>
          <div class="support-links"><a class="link-pill" href="/nischhal-raj-subba.html">Author profile</a><a class="link-pill" href="/projects.html">View projects</a><a class="link-pill" href="https://linktr.ee/nischhalsubba" target="_blank" rel="noopener noreferrer">Social links</a></div>
        </div>
      </div>`;
    if (hero && hero.parentNode) hero.insertAdjacentElement('afterend', block);
    else main.prepend(block);

    addJsonLd('nrs-blog-author-schema', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: document.querySelector('h1')?.innerText || document.title,
      author: personSchema(),
      publisher: personSchema(),
      mainEntityOfPage: `${SITE}${path}`,
      dateModified: UPDATED
    });
  }

  function addServiceDepthAndFaq() {
    const path = currentPath();
    const data = serviceContent[path];
    if (!data || document.querySelector('.nrs-service-depth')) return;

    const section = document.createElement('section');
    section.className = 'section-container nrs-service-depth';
    section.innerHTML = `
      <div style="max-width:980px;margin:0 auto;">
        <p class="eyebrow">Service detail</p>
        <h2 class="section-title">${data.title}</h2>
        <div class="impact-summary-grid">
          <div class="impact-card"><span class="eyebrow">Who this is for</span><p>${data.who}</p></div>
          <div class="impact-card"><span class="eyebrow">Deliverables</span><ul>${data.deliverables.map(item => `<li>${item}</li>`).join('')}</ul></div>
          <div class="impact-card"><span class="eyebrow">Process</span><ol>${data.process.map(item => `<li>${item}</li>`).join('')}</ol></div>
        </div>
      </div>`;

    const faq = document.createElement('section');
    faq.className = 'section-container nrs-service-faq';
    faq.innerHTML = `
      <div style="max-width:980px;margin:0 auto;">
        <p class="eyebrow">Frequently asked questions</p>
        <h2 class="section-title">Questions this service page answers</h2>
        <div style="display:grid;gap:16px;">
          ${data.faqs.map(([question, answer]) => `
            <details class="impact-card">
              <summary>${question}</summary>
              <p>${answer}</p>
            </details>`).join('')}
        </div>
      </div>`;

    const footer = document.querySelector('footer, .nrs-auto-footer');
    const main = document.querySelector('main') || document.body;
    if (footer) {
      footer.insertAdjacentElement('beforebegin', section);
      footer.insertAdjacentElement('beforebegin', faq);
    } else {
      main.appendChild(section);
      main.appendChild(faq);
    }

    addJsonLd('nrs-service-faq-schema', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }))
    });
  }

  function addServiceBreadcrumbSchema() {
    const path = currentPath();
    if (!serviceContent[path]) return;
    const title = document.querySelector('h1')?.innerText?.trim() || document.title.split('|')[0].trim();
    addJsonLd('nrs-service-breadcrumb-schema', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE}/contact.html` },
        { '@type': 'ListItem', position: 3, name: title, item: `${SITE}${path}` }
      ]
    });
  }

  function convertIframesToClickToLoad() {
    document.querySelectorAll('iframe[src]').forEach((iframe) => {
      if (iframe.dataset.clickLoaded === 'true') return;
      const src = iframe.getAttribute('src');
      const title = iframe.getAttribute('title') || 'embedded prototype';
      const wrapper = document.createElement('div');
      wrapper.className = 'nrs-iframe-loader';
      wrapper.style.cssText = 'position:relative;display:grid;place-items:center;min-height:320px;border:1px solid var(--border-faint);border-radius:24px;background:var(--bg-surface);padding:32px;text-align:center;';
      wrapper.innerHTML = `
        <div>
          <p class="eyebrow">Prototype embed</p>
          <h3 style="margin:8px 0 14px;color:var(--text-primary);">Load ${title}</h3>
          <p style="color:var(--text-secondary);max-width:520px;margin:0 auto 20px;">This embed is loaded only when requested to improve mobile performance and reduce initial page weight.</p>
          <button type="button" class="btn btn-primary">Load prototype</button>
        </div>`;
      iframe.parentNode.insertBefore(wrapper, iframe);
      iframe.removeAttribute('src');
      iframe.loading = 'lazy';
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.dataset.clickLoaded = 'true';
      wrapper.querySelector('button')?.addEventListener('click', () => {
        iframe.setAttribute('src', src);
        wrapper.replaceWith(iframe);
      });
    });
  }

  function improveMediaPerformance() {
    document.querySelectorAll('img').forEach((img, index) => {
      if (!img.alt) img.alt = 'Nischhal Raj Subba product design portfolio visual';
      img.decoding = 'async';
      if (index > 1 && !img.loading) img.loading = 'lazy';
      if (index === 0) img.setAttribute('fetchpriority', 'high');
    });
  }

  function hardenExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach((link) => {
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) {
        link.target = link.target || '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  }

  function run() {
    ensureCanonical();
    addEntitySchemaOnKeyPages();
    addAuthorBlockToBlogs();
    addServiceDepthAndFaq();
    addServiceBreadcrumbSchema();
    convertIframesToClickToLoad();
    improveMediaPerformance();
    hardenExternalLinks();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
