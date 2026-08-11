/**
 * @fileoverview scripts/spacious-pages/about.cjs
 * Purpose: Apply the about production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/spacious-pages/shared.cjs
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const { replaceMain, actions } = require('./shared.cjs');

const markup = `<main id="main-content" class="container nrs-spacious-page nrs-about-spacious">
  <section class="nrs-page-hero reveal-on-scroll" aria-labelledby="about-title">
    <div class="nrs-page-hero__title">
      <p class="eyebrow">About</p>
      <h1 id="about-title" class="hero-title">I design clear product experiences for complicated software.</h1>
      <p class="body-large">I am Nischhal Raj Subba, a Product Designer based in Nepal. I work across SaaS, Web3, fintech, mobile products, websites and design systems, usually where the product needs more structure before it needs more decoration.</p>
      ${actions}
    </div>
    <aside class="nrs-page-hero__aside" aria-label="Professional summary">
      <p class="nrs-aside-intro">My work connects product thinking, visual craft and implementation detail so teams can make decisions earlier and build with fewer assumptions.</p>
      <dl class="nrs-facts">
        <div><dt>Experience</dt><dd>6+ years</dd></div>
        <div><dt>Based in</dt><dd>Nepal, working remotely</dd></div>
        <div><dt>Focus</dt><dd>Product UX, interface systems and handoff</dd></div>
      </dl>
    </aside>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-approach">
    <header class="nrs-section-heading">
      <p class="eyebrow">Approach</p>
      <h2 id="about-approach" class="section-title">Clarity before polish. Systems before repetition.</h2>
    </header>
    <div class="nrs-section-copy nrs-longform">
      <p>I start with the product context: who is using it, what decision they need to make, where the current flow breaks, and which engineering constraints are real.</p>
      <p>Then I shape journeys, information hierarchy, states and interaction rules. Visual design follows that structure, not the other way around. The goal is a calmer interface and a handoff that does not depend on developers guessing what the design meant.</p>
    </div>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-experience">
    <header class="nrs-section-heading">
      <p class="eyebrow">Selected experience</p>
      <h2 id="about-experience" class="section-title">A practical path through agencies, product teams and interface systems.</h2>
    </header>
    <div class="nrs-editorial-list">
      <article class="nrs-editorial-row"><span class="nrs-row-index">Now</span><h3>Product design and systems</h3><p>Complex product flows, SaaS dashboards, Web3 and fintech interactions, websites, design systems and implementation-ready handoff.</p></article>
      <article class="nrs-editorial-row"><span class="nrs-row-index">Recent</span><h3>Product and platform work</h3><p>Projects including Yarsha, Mokshya, Morajaa, Zapp Today, Masteriyo and enterprise software work.</p></article>
      <article class="nrs-editorial-row"><span class="nrs-row-index">Base</span><h3>Agency and product-team foundations</h3><p>Experience across Gurzu, Diagonal Softwares, ThemeGrill, ESR Tech, Tegzy and other collaborative product environments.</p></article>
    </div>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-capabilities">
    <header class="nrs-section-heading">
      <p class="eyebrow">Capabilities</p>
      <h2 id="about-capabilities" class="section-title">Four areas where I am most useful.</h2>
    </header>
    <ol class="nrs-editorial-list">
      <li class="nrs-editorial-row"><span class="nrs-row-index">01</span><h3>Product clarity</h3><p>Users, goals, constraints, requirements, edge cases and the decision each interface needs to support.</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">02</span><h3>UX structure</h3><p>Journeys, screen hierarchy, forms, dashboards, permissions, reviews, empty states and system feedback.</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">03</span><h3>Interface systems</h3><p>Responsive layouts, reusable components, visual direction and interaction patterns that stay consistent.</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">04</span><h3>Developer handoff</h3><p>Behavior notes, component states, responsive rules, design QA and implementation context.</p></li>
    </ol>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-proof">
    <header class="nrs-section-heading">
      <p class="eyebrow">Proof</p>
      <h2 id="about-proof" class="section-title">Review the work instead of relying on claims.</h2>
    </header>
    <div class="nrs-editorial-list">
      <a class="nrs-editorial-row" href="/projects"><span class="nrs-row-index">01</span><h3>Selected case studies</h3><p>Product work across SaaS, Web3, fintech, mobile products, websites and front-end tools.</p></a>
      <a class="nrs-editorial-row" href="/assets/resume.pdf" download data-resume-download><span class="nrs-row-index">02</span><h3>Resume and experience</h3><p>Roles, skills, project history and contact details in one practical document.</p></a>
      <a class="nrs-editorial-row" href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><span class="nrs-row-index">03</span><h3>Public learning profile</h3><p>Visible UX and product-design learning progress through Uxcel.</p></a>
    </div>
  </section>

  <section class="nrs-section nrs-section--closing reveal-on-scroll">
    <div><p class="eyebrow">Next step</p><h2 class="section-title">See the work, then send the product problem.</h2></div>
    <div class="nrs-closing-copy"><p>Case studies show the available proof. The contact page is the fastest way to share a role, project, audit or redesign brief.</p>${actions}</div>
  </section>
</main>`;

replaceMain('about.html', markup, 'nrs-about-spacious-page');
