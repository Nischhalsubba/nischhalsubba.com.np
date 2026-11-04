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
      <p class="body-large">I am Nischhal Raj Subba, a Senior Product Designer based in Kathmandu, Nepal. I focus on complex SaaS and fintech products, design systems, and design-to-engineering delivery, with additional experience across Web3, mobile products, websites and enterprise software.</p>
      ${actions}
    </div>
    <aside class="nrs-page-hero__aside" aria-label="Professional summary">
      <p class="nrs-aside-intro">My work connects product thinking, visual craft and implementation detail so teams can make decisions earlier and build with fewer assumptions.</p>
      <dl class="nrs-facts">
        <div><dt>Experience</dt><dd>6+ years</dd></div>
        <div><dt>Based in</dt><dd>Kathmandu, working remotely</dd></div>
        <div><dt>Focus</dt><dd>Complex SaaS, fintech and design systems</dd></div>
      </dl>
    </aside>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-approach">
    <header class="nrs-section-heading">
      <p class="eyebrow">Approach</p>
      <h2 id="about-approach" class="section-title">Clarity before polish. Systems before repetition.</h2>
    </header>
    <div class="nrs-section-copy nrs-longform">
      <p>I start with the product context: who is using it, what decision they need to make, where the current flow breaks, which permissions and states matter, and which engineering constraints are real.</p>
      <p>Then I shape journeys, information hierarchy, states and interaction rules. Visual design follows that structure, not the other way around. The goal is a calmer interface and a handoff that does not depend on developers guessing what the design meant.</p>
    </div>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-experience">
    <header class="nrs-section-heading">
      <p class="eyebrow">Selected experience</p>
      <h2 id="about-experience" class="section-title">A practical path through agencies, product teams and interface systems.</h2>
    </header>
    <div class="nrs-editorial-list">
      <article class="nrs-editorial-row"><span class="nrs-row-index">Now</span><h3>Complex product design and systems</h3><p>Multi-role workflows, SaaS dashboards, fintech trust states, Web3 interactions, design systems and implementation-ready handoff.</p></article>
      <article class="nrs-editorial-row"><span class="nrs-row-index">Recent</span><h3>Product and platform work</h3><p>Projects including Yarsha, piHub, Orkest HQ, Mokshya, Zapp Today, Masteriyo and enterprise software work.</p></article>
      <article class="nrs-editorial-row"><span class="nrs-row-index">Base</span><h3>Agency and product-team foundations</h3><p>Experience across Gurzu, Diagonal Softwares, ThemeGrill, ESR Tech, Tegzy and other collaborative product environments.</p></article>
    </div>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-capabilities">
    <header class="nrs-section-heading">
      <p class="eyebrow">Capabilities</p>
      <h2 id="about-capabilities" class="section-title">Four areas where I am most useful.</h2>
    </header>
    <ol class="nrs-editorial-list">
      <li class="nrs-editorial-row"><span class="nrs-row-index">01</span><h3>Product clarity</h3><p>Users, goals, constraints, requirements, permissions, edge cases and the decision each interface needs to support.</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">02</span><h3>UX structure</h3><p>Journeys, screen hierarchy, forms, dashboards, permissions, reviews, empty states and system feedback.</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">03</span><h3>Interface systems</h3><p>Responsive layouts, reusable components, visual direction and interaction patterns that stay consistent.</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">04</span><h3>Design-to-engineering</h3><p>Behavior notes, component states, responsive rules, design QA and implementation context engineers can act on.</p></li>
    </ol>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="about-proof">
    <header class="nrs-section-heading">
      <p class="eyebrow">Independent proof</p>
      <h2 id="about-proof" class="section-title">Review the work and verify the professional footprint.</h2>
    </header>
    <div class="nrs-editorial-list">
      <a class="nrs-editorial-row" href="/projects"><span class="nrs-row-index">01</span><h3>Selected case studies</h3><p>Product work across SaaS, fintech, Web3, mobile products, websites and enterprise workflows.</p></a>
      <a class="nrs-editorial-row" href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><span class="nrs-row-index">02</span><h3>Uxcel 2024 · #1 Designer and #1 Product Designer</h3><p>First place globally and in the Product Designer category of Uxcel’s 2024 annual rankings, confirmed by Uxcel.</p></a>
      <a class="nrs-editorial-row" href="https://uxcel.com/uxcel-rankings" target="_blank" rel="noopener"><span class="nrs-row-index">03</span><h3>Uxcel UX Rankings · #1</h3><p>Score 90/100, checked on 3 November 2026. This is a dated snapshot of Uxcel’s Pro-member UX rankings, which change weekly.</p></a>
      <a class="nrs-editorial-row" href="https://uxcel.com/designer-rankings/past-winners" target="_blank" rel="noopener"><span class="nrs-row-index">04</span><h3>Uxcel 2023 · #3 Product Designer</h3><p>Third place in Uxcel’s annual Product Designer rankings, confirmed by Uxcel and listed in its 2023 Hall of Fame.</p></a>
      <a class="nrs-editorial-row" href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><span class="nrs-row-index">05</span><h3>Uxcel Mentor profile</h3><p>Public mentor profile with professional certification, projects and design review activity.</p></a>
      <a class="nrs-editorial-row" href="https://github.com/Nischhalsubba" target="_blank" rel="noopener"><span class="nrs-row-index">06</span><h3>GitHub product work</h3><p>Public design-system, product and implementation work showing front-end collaboration and engineering literacy.</p></a>
      <a class="nrs-editorial-row" href="/assets/resume.pdf" download data-resume-download><span class="nrs-row-index">07</span><h3>Resume and experience</h3><p>Roles, skills, project history and contact details in one practical document.</p></a>
    </div>
<div class="uxcel-award-badges" role="group" aria-label="Official Uxcel award badges"><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><img src="/assets/images/awards/uxcel-2024-global-first-1cb3fe8d65b2.svg" width="440" height="440" loading="lazy" decoding="async" alt="Official Uxcel badge: The Best Designer, 2024"></a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><img src="/assets/images/awards/uxcel-2024-product-first-01d6ecf1c5f3.svg" width="440" height="440" loading="lazy" decoding="async" alt="Official Uxcel badge: The Best Product Designer, 2024"></a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><img src="/assets/images/awards/uxcel-2023-product-top10-0187eafd7a8b.svg" width="440" height="440" loading="lazy" decoding="async" alt="Official Uxcel badge: Top 10 Product Designer, 2023"></a></div>
  </section>

<section class="nrs-section reveal-on-scroll" aria-labelledby="uxcel-learning"><header class="nrs-section-heading"><p class="eyebrow">Continuous learning</p><h2 id="uxcel-learning" class="section-title">Professional certifications and focused learning.</h2></header><h3>Uxcel professional certifications</h3><ul class="uxcel-learning-list"><li><a href="https://app.uxcel.com/certificates/XSXW99G6EE2R" target="_blank" rel="noopener">Product Designer</a><span>Professional certification · 2024</span></li><li><a href="https://app.uxcel.com/certificates/DKNOJSV20WQ7" target="_blank" rel="noopener">UX Designer</a><span>Professional certification · 2024</span></li><li><a href="https://app.uxcel.com/certificates/LSF8UPX6EGN5" target="_blank" rel="noopener">UX Researcher</a><span>Professional certification · 2024</span></li><li><a href="https://app.uxcel.com/certificates/S9YU2TUDMMT1" target="_blank" rel="noopener">UX Writer</a><span>Professional certification · 2025</span></li><li><a href="https://app.uxcel.com/certificates/I4YTY0556KCY" target="_blank" rel="noopener">UI Designer</a><span>Professional certification · 2025</span></li></ul><h3>Additional course completions</h3><ul class="uxcel-learning-list"><li><a href="https://app.uxcel.com/certificates/C17333VT6OIN" target="_blank" rel="noopener">Human-Centered AI</a><span>Course completion · 2025</span></li><li><a href="https://app.uxcel.com/certificates/DG1LQ8WZA7MN" target="_blank" rel="noopener">AI Fundamentals for UX</a><span>Course completion · 2025</span></li><li><a href="https://app.uxcel.com/certificates/8B2XWEOITTQ9" target="_blank" rel="noopener">Introduction to ChatGPT</a><span>Course completion · 2025</span></li><li><a href="https://app.uxcel.com/certificates/IV0SES53BBDE" target="_blank" rel="noopener">AI Prompts Foundations</a><span>Course completion · 2025</span></li><li><a href="https://app.uxcel.com/certificates/L4KGTW9W8TOK" target="_blank" rel="noopener">Building Agile Teams</a><span>Course completion · 2025</span></li></ul></section>
  <section class="nrs-section nrs-section--closing reveal-on-scroll">
    <div><p class="eyebrow">Next step</p><h2 class="section-title">See the work, then send the product problem.</h2></div>
    <div class="nrs-closing-copy"><p>Case studies show the available proof. The contact page is the fastest way to share a role, project, audit or redesign brief.</p>${actions}</div>
  </section>
</main>`;

replaceMain('about.html', markup, 'nrs-about-spacious-page');
