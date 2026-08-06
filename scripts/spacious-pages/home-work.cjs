const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;

const homeMain = `<main id="main-content" class="container nrs-editorial-home">
  <section class="nrs-editorial-hero" aria-labelledby="home-title">
    <div class="nrs-editorial-hero__copy">
      <p class="nrs-editorial-kicker" data-nrs-hero-reveal>Product Designer · Kathmandu, Nepal · UTC +05:45</p>
      <h1 id="home-title" class="nrs-editorial-hero__title" data-nrs-hero-reveal><span class="nrs-editorial-hero__title-line">Complex products,</span><span class="nrs-editorial-hero__title-line nrs-editorial-hero__title-line--accent">made obvious.</span></h1>
      <p class="nrs-editorial-hero__intro" data-nrs-hero-reveal>I design product experiences for Web3, SaaS and fintech teams, turning uncertain requirements into clear flows, polished interfaces and implementation-ready systems.</p>
      <div class="nrs-editorial-actions" data-nrs-hero-reveal><a class="nrs-editorial-action nrs-editorial-action--primary" href="#selected-work">Explore selected work</a><a class="nrs-editorial-action" href="/contact">Start a project</a></div>
      <div class="nrs-editorial-hero__meta" data-nrs-hero-reveal aria-label="Core disciplines"><span>Product UX</span><span>Interface systems</span><span>Developer handoff</span><span>6+ years</span></div>
    </div>
    <div class="nrs-hero-field" aria-hidden="true" data-nrs-hero-reveal><div class="nrs-hero-field__canvas" data-nrs-three-field></div><span class="nrs-hero-field__label nrs-hero-field__label--top">NRS / Spatial system / 01</span><span class="nrs-hero-field__label nrs-hero-field__label--bottom">27.7172° N / 85.3240° E<br>Product structure in motion</span></div>
  </section>

  <section id="selected-work" class="nrs-editorial-section" aria-labelledby="selected-work-heading">
    <div class="nrs-editorial-section__heading nrs-motion-reveal"><div class="nrs-editorial-section__heading-copy"><p class="nrs-editorial-section-label">01 / Selected work</p><h2 id="selected-work-heading" class="nrs-editorial-section__title"><span class="nrs-editorial-section__title-text">Product decisions, shown at useful scale.</span></h2></div><p class="nrs-editorial-section__aside">Case studies focus on the problem, the decisions, the states and the handoff. Evidence stays concrete, contribution stays scoped, and outcomes remain transparent.</p></div>

    <a class="nrs-editorial-project nrs-motion-reveal" href="/project-yarsha" data-nrs-project><div class="nrs-editorial-project__media" data-nrs-project-media><img src="/assets/images/project-yarsha-cover.svg" alt="Yarsha mobile product screens for messaging, wallet actions and transaction review" loading="eager" decoding="async"></div><div class="nrs-editorial-project__copy"><p class="nrs-editorial-project__index">01 / Web3 mobile product</p><h3 class="nrs-editorial-project__title"><span class="nrs-editorial-project__title-text">Yarsha</span></h3><p class="nrs-editorial-project__summary">A messaging-first Web3 experience that makes wallet actions, signing context and transaction review easier to understand.</p><div class="nrs-editorial-project__meta"><span>Product design</span><span>Mobile UX</span><span>2024</span></div></div></a>

    <div class="nrs-editorial-project-grid">
      <a class="nrs-editorial-project nrs-motion-reveal" href="/project-mokshya" data-nrs-project><div class="nrs-editorial-project__media" data-nrs-project-media><img src="/assets/images/project-mokshya-cover.svg" alt="Mokshya protocol website interface and product storytelling" loading="lazy" decoding="async"></div><div class="nrs-editorial-project__copy"><p class="nrs-editorial-project__index">02 / Web3 protocol website</p><h3 class="nrs-editorial-project__title"><span class="nrs-editorial-project__title-text">Mokshya.io</span></h3><p class="nrs-editorial-project__summary">A clearer product narrative and trust-focused hierarchy for a technical protocol audience.</p><div class="nrs-editorial-project__meta"><span>Website UX</span><span>Storytelling</span><span>2024–2025</span></div></div></a>
      <a class="nrs-editorial-project nrs-motion-reveal" href="/project-pihub" data-nrs-project><div class="nrs-editorial-project__media" data-nrs-project-media><img src="/assets/images/project-pihub-cover.svg" alt="piHub fintech dashboards and investor product flows" loading="lazy" decoding="async"></div><div class="nrs-editorial-project__copy"><p class="nrs-editorial-project__index">03 / Fintech product</p><h3 class="nrs-editorial-project__title"><span class="nrs-editorial-project__title-text">piHub</span></h3><p class="nrs-editorial-project__summary">Investor journeys, verification, credit requests and dashboard states structured for clearer decisions.</p><div class="nrs-editorial-project__meta"><span>App experience</span><span>Fintech UX</span><span>2024</span></div></div></a>
      <a class="nrs-editorial-project nrs-motion-reveal" href="/project-hamro-idea" data-nrs-project><div class="nrs-editorial-project__media" data-nrs-project-media><img src="/assets/images/project-hamro-idea-cover.svg" alt="Hamro Idea software studio website and brand interface" loading="lazy" decoding="async"></div><div class="nrs-editorial-project__copy"><p class="nrs-editorial-project__index">04 / Brand and website</p><h3 class="nrs-editorial-project__title"><span class="nrs-editorial-project__title-text">Hamro Idea</span></h3><p class="nrs-editorial-project__summary">A positioning, identity and static website system designed and built for a Nepal-based software studio.</p><div class="nrs-editorial-project__meta"><span>Design + development</span><span>SEO structure</span><span>2025</span></div></div></a>
    </div>
  </section>

  <section class="nrs-editorial-section" aria-labelledby="capability-heading">
    <div class="nrs-editorial-section__heading nrs-motion-reveal"><div class="nrs-editorial-section__heading-copy"><p class="nrs-editorial-section-label">02 / How I work</p><h2 id="capability-heading" class="nrs-editorial-section__title"><span class="nrs-editorial-section__title-text">From product ambiguity to build-ready clarity.</span></h2></div><p class="nrs-editorial-section__aside">The useful part of design is not the screenshot. It is the chain of decisions that lets the product survive contact with users, stakeholders and engineering.</p></div>
    <div class="nrs-capability-list nrs-motion-reveal">
      <a class="nrs-capability-row" href="/product-design-nepal"><span class="nrs-capability-row__number">01</span><span class="nrs-capability-row__title">Product UX</span><span class="nrs-capability-row__description">Flows, information architecture, interaction states and decision points.</span><span class="nrs-capability-row__arrow">↗</span></a>
      <a class="nrs-capability-row" href="/services"><span class="nrs-capability-row__number">02</span><span class="nrs-capability-row__title">Interface design</span><span class="nrs-capability-row__description">Responsive, high-fidelity interfaces shaped around the product rather than a trend.</span><span class="nrs-capability-row__arrow">↗</span></a>
      <a class="nrs-capability-row" href="/figma-design-systems"><span class="nrs-capability-row__number">03</span><span class="nrs-capability-row__title">Design systems</span><span class="nrs-capability-row__description">Reusable components, tokens, states and documentation that reduce guesswork.</span><span class="nrs-capability-row__arrow">↗</span></a>
      <a class="nrs-capability-row" href="/services"><span class="nrs-capability-row__number">04</span><span class="nrs-capability-row__title">Developer handoff</span><span class="nrs-capability-row__description">Responsive logic, edge cases, implementation notes and UI quality review.</span><span class="nrs-capability-row__arrow">↗</span></a>
    </div>
  </section>

  <section id="homepage-proof-discovery" class="nrs-home-proof-v49 nrs-motion-reveal" aria-labelledby="site-proof-heading">
    <div class="nrs-home-proof-v49__intro"><p class="nrs-editorial-section-label">03 / Practical proof</p><h2 id="site-proof-heading"><span class="nrs-proof-title-text">Design thinking that remains useful after approval.</span></h2><p>I connect product structure, visual craft and implementation detail, so teams move from an unclear problem to something people can use and engineers can build.</p></div>
    <div class="nrs-home-proof-v49__signals" aria-label="Professional proof"><a href="/projects"><span>01</span><strong>Selected product work</strong><p>Case studies across Web3, SaaS, fintech, mobile products and websites.</p></a><a href="/about"><span>02</span><strong>6+ years of experience</strong><p>Product teams, agencies, design systems and front-end-aware collaboration.</p></a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span>03</span><strong>Resume and experience</strong><p>Roles, skills, project history and practical contact details.</p></a></div>
    <div class="nrs-home-proof-v49__machine"><span>Structured profile</span><p>Machine-readable proof stays available without taking over the human experience.</p><div><a href="/llms.txt">llms.txt</a><a href="/ai-profile.json">ai-profile.json</a></div></div>
  </section>

  <section class="nrs-editorial-section" aria-labelledby="writing-heading">
    <div class="nrs-editorial-section__heading nrs-motion-reveal"><div class="nrs-editorial-section__heading-copy"><p class="nrs-editorial-section-label">04 / Writing</p><h2 id="writing-heading" class="nrs-editorial-section__title"><span class="nrs-editorial-section__title-text">Notes from the messy middle.</span></h2></div><p class="nrs-editorial-section__aside">Practical writing about product clarity, interface states, audits and developer-ready handoff.</p></div>
    <div class="nrs-writing-index nrs-motion-reveal"><a class="nrs-writing-row" href="/blog/web3-wallet-connection-ux.html"><span class="nrs-writing-row__date">Web3 UX</span><span class="nrs-writing-row__title">Designing clearer wallet connection and signing flows</span><span class="nrs-writing-row__arrow">↗</span></a><a class="nrs-writing-row" href="/blog/saas-dashboard-empty-states-that-help-users-recover.html"><span class="nrs-writing-row__date">SaaS UX</span><span class="nrs-writing-row__title">Empty states that help users recover</span><span class="nrs-writing-row__arrow">↗</span></a><a class="nrs-writing-row" href="/blog/figma-handoff-notes-for-developers.html"><span class="nrs-writing-row__date">Handoff</span><span class="nrs-writing-row__title">What developers actually need from Figma</span><span class="nrs-writing-row__arrow">↗</span></a></div>
  </section>

  <section class="nrs-editorial-closing nrs-motion-reveal" aria-labelledby="closing-heading"><div class="nrs-editorial-closing__copy"><p class="nrs-editorial-section-label">05 / Start here</p><h2 id="closing-heading" class="nrs-editorial-closing__title"><span class="nrs-editorial-closing__title-text">Have a complicated product? <em>That is usually where I am useful.</em></span></h2></div><div class="nrs-editorial-closing__action"><a class="nrs-editorial-action nrs-editorial-action--primary" href="/contact">Discuss the project</a></div></section>
</main>`;

function addBodyClass(html, className) {
  return html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i, (_match, current = '', rest = '') => {
    const classes = new Set(`${current} ${className}`.trim().split(/\s+/).filter(Boolean));
    return `<body class="${[...classes].join(' ')}"${rest}>`;
  });
}

function updateHome(file) {
  const target = path.join(base, file);
  if (!fs.existsSync(target)) return;
  let html = fs.readFileSync(target, 'utf8');
  if (!/<main\b[\s\S]*?<\/main>/i.test(html)) throw new Error(`Homepage main element missing in ${target}`);
  html = html.replace(/<main\b[\s\S]*?<\/main>/i, homeMain);
  html = addBodyClass(html, 'nrs-editorial-redesign nrs-home-page');
  fs.writeFileSync(target, html, 'utf8');
}

function updateProjects() {
  const target = path.join(base, 'projects.html');
  if (!fs.existsSync(target)) throw new Error(`Missing ${target}`);
  let html = fs.readFileSync(target, 'utf8');
  const controls = `<div class="work-controls nrs-work-toolbar-v49 reveal-on-scroll"><div class="nrs-work-toolbar-v49__top"><div><p class="eyebrow">Browse work</p><h2>Find the work most relevant to you.</h2></div><p id="nrs-work-summary" class="nrs-work-summary">Showing all projects.</p></div><div class="nrs-work-toolbar-v49__controls"><div class="filter-row" role="group" aria-label="Filter projects by domain"><button class="filter-btn active" type="button" data-filter="all">All work</button><button class="filter-btn" type="button" data-filter="web3">Web3</button><button class="filter-btn" type="button" data-filter="fintech">Fintech</button><button class="filter-btn" type="button" data-filter="saas">SaaS</button><button class="filter-btn" type="button" data-filter="mobile">Mobile</button><button class="filter-btn" type="button" data-filter="website">Websites</button><button class="filter-btn" type="button" data-filter="frontend">Front-end</button></div><div class="nrs-work-search-v49"><label for="search-work">Search</label><div><input type="search" id="search-work" class="search-input" placeholder="Project, role or domain" aria-label="Search projects"><button id="clear-work" type="button" aria-label="Clear project search">Clear</button></div></div></div></div>`;
  const replacement = `${controls}<div id="nrs-no-results" class="nrs-no-results"><h3>No matching projects.</h3><p>Try another domain or a broader search term.</p></div><div class="project-grid">`;
  html = html.replace(/<div class="work-controls[\s\S]*?<\/div><div class="project-grid">/i, replacement);
  html = addBodyClass(html, 'nrs-editorial-redesign nrs-inner-page nrs-work-page');
  fs.writeFileSync(target, html, 'utf8');
}

updateHome('index.html');
updateHome('home-v2.html');
updateProjects();
console.log(`Composed the technical editorial homepage and work surfaces in ${path.relative(root, base) || 'source'}.`);