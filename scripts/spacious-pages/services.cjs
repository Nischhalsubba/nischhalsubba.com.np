const { replaceMain } = require('./shared.cjs');

const services = [
  ['01', 'Product design', 'Turn an unclear product idea or existing workflow into a coherent experience with understandable hierarchy, states and responsive behavior.', 'Flows, wireframes, high-fidelity UI, prototypes', '/product-design-nepal'],
  ['02', 'SaaS and dashboard UX', 'Make dense operational work easier to scan and complete across tables, filters, roles, permissions, forms and system states.', 'Dashboards, admin tools, role-based workflows', '/saas-ux-designer'],
  ['03', 'Web3 and fintech UX', 'Give users enough context to understand wallets, verification, balances, approvals and irreversible actions before they commit.', 'Wallet flows, review states, trust and risk', '/web3-ux-designer'],
  ['04', 'Design systems', 'Create reusable components, tokens and behavior rules that keep design and implementation aligned as the product grows.', 'Figma libraries, states, responsive rules, handoff', '/figma-design-systems'],
  ['05', 'Website product UX', 'Clarify positioning, page architecture, proof and conversion paths for software products and service businesses.', 'Information architecture, responsive UI, conversion', '/website-ux-design'],
  ['06', 'UX audit and remediation', 'Find the usability, accessibility, responsive and implementation issues that matter, then turn them into a practical fix plan.', 'Evidence, severity, priorities and fix guidance', '/ux-audit'],
];

const serviceRows = services.map(([number, title, description, scope, href]) => `
  <article class="nrs-service-index-row">
    <span class="nrs-service-index-number">${number}</span>
    <h3>${title}</h3>
    <div class="nrs-service-index-copy"><p>${description}</p><span>${scope}</span></div>
    <a class="nrs-service-index-link" href="${href}">Details <span aria-hidden="true">↗</span></a>
  </article>`).join('');

const process = [
  ['01', 'Understand', 'Product context, users, constraints and the decision the interface needs to support.'],
  ['02', 'Structure', 'Journeys, hierarchy, content priority, states and edge cases before visual polish.'],
  ['03', 'Design', 'Reusable interface patterns, responsive screens and prototypes that can be reviewed.'],
  ['04', 'Ship', 'Implementation notes, assets, design QA and support while the product is being built.'],
].map(([number, title, description]) => `<li><span>${number}</span><h3>${title}</h3><p>${description}</p></li>`).join('');

const markup = `<main id="main-content" class="container nrs-spacious-page nrs-services-v49">
  <section class="nrs-services-v49-hero reveal-on-scroll" aria-labelledby="services-title">
    <div class="nrs-services-v49-intro">
      <p class="eyebrow">Product design services</p>
      <h1 id="services-title" class="hero-title">Design the product clearly before adding more screens.</h1>
      <p class="body-large">I help software teams untangle complex flows, improve interface systems and prepare design work that engineers can build without filling in the missing decisions themselves.</p>
      <div class="nrs-actions"><a class="btn btn-primary" href="/contact">Discuss your product</a><a class="btn btn-secondary" href="/projects">View selected work</a></div>
    </div>
    <aside class="nrs-services-v49-summary" aria-label="Best-fit work">
      <p class="eyebrow">Best fit</p>
      <p>Products with real workflow complexity, inconsistent UI or an upcoming build that needs clearer design decisions.</p>
      <dl>
        <div><dt>Products</dt><dd>SaaS, Web3, fintech, mobile and product websites</dd></div>
        <div><dt>Engagements</dt><dd>Product roles, focused projects, audits and systems</dd></div>
        <div><dt>Output</dt><dd>Flows, UI, prototypes, documentation and QA</dd></div>
      </dl>
    </aside>
  </section>

  <section class="nrs-services-v49-index reveal-on-scroll" aria-labelledby="service-index-title">
    <header><p class="eyebrow">What I can help with</p><h2 id="service-index-title" class="section-title">Six ways to move a product from unclear to buildable.</h2><p>Each engagement is scoped around the product problem rather than a ceremonial pile of deliverables.</p></header>
    <div class="nrs-service-index-list">${serviceRows}</div>
  </section>

  <section class="nrs-services-v49-process reveal-on-scroll" aria-labelledby="service-process-title">
    <header><p class="eyebrow">Working process</p><h2 id="service-process-title" class="section-title">A simple sequence for reducing uncertainty.</h2></header>
    <ol>${process}</ol>
  </section>

  <section class="nrs-services-v49-cta reveal-on-scroll">
    <div><p class="eyebrow">Start with the problem</p><h2 class="section-title">Send the product, the friction and the timeline.</h2></div>
    <div><p>I will reply with the most useful scope and next step, not a generic package menu.</p><a class="btn btn-primary" href="/contact">Start a conversation</a></div>
  </section>
</main>`;

replaceMain('services.html', markup, 'nrs-services-v49-page');