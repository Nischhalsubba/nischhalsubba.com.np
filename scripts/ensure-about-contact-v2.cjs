/**
 * @fileoverview scripts/ensure-about-contact-v2.cjs
 * Purpose: Apply the ensure about contact v2 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const email = 'hinischalsubba@gmail.com';


/**
 * Function contract: head
 * Purpose: Implement the head responsibility owned by the ensure about contact v2 repository tool.
 * Inputs: `{ title, description, canonical }`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function head({ title, description, canonical }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="https://nischhalsubba.com.np${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://nischhalsubba.com.np${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="https://nischhalsubba.com.np/assets/images/portrait.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="https://nischhalsubba.com.np/assets/images/portrait.png" />
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
    <link rel="stylesheet" href="/style.css?v=42.0" />
  </head>`;
}



/**
 * Function contract: nav
 * Purpose: Implement the nav responsibility owned by the ensure about contact v2 repository tool.
 * Inputs: `active`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function nav(active) {
  const items = [
    ['/', 'Home', 'home'],
    ['/projects', 'Work', 'work'],
    ['/services', 'Services', 'services'],
    ['/about', 'About', 'about'],
    ['/blog/', 'Writing', 'writing'],
    ['/contact', 'Contact', 'contact'],
  ];

  const desktop = items.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[href, label, key]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([href, label, key]) => `<a href="${href}" class="nav-link${active === key ? ' active' : ''}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  const mobile = items.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[href, label, key]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([href, label, key]) => `<a href="${href}"${active === key ? ' class="active" aria-current="page"' : ''}>${label}</a>`).join('');

  return `    <button class="mobile-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav-overlay"><span></span><span></span></button>
    <a href="/" class="mobile-logo">NRS</a>
    <div class="mobile-nav-overlay" id="mobile-nav-overlay"><nav class="mobile-nav-links" aria-label="Mobile navigation">${mobile}</nav></div>
    <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle theme"></button>
    <nav class="nav-wrapper" aria-label="Primary navigation"><div class="nav-pill"><div class="nav-glider"></div>${desktop}</div></nav>`;
}



/**
 * Function contract: scripts
 * Purpose: Implement the scripts responsibility owned by the ensure about contact v2 repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function scripts() {
  return `    <a class="floating-resume-btn" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a>
    <script type="module" src="/script.js?v=32.0"></script>`;
}

const aboutHtml = `${head({
  title: 'About Nischhal Raj Subba | Product Designer in Nepal',
  description: 'About Nischhal Raj Subba, a Nepal-based product designer helping software teams clarify product flows, interface systems, responsive UX and developer-ready handoff.',
  canonical: '/about',
})}
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
${nav('about')}
    <main id="main-content" class="container nrs-about-v2">
      <section class="nrs-about-v2-hero reveal-on-scroll">
        <div class="nrs-about-v2-copy">
          <p class="eyebrow">About</p>
          <h1 class="hero-title">I turn unclear product work into screens teams can understand, review and build.</h1>
          <p class="body-large">I am Nischhal Raj Subba, a Product Designer based in Nepal. I work across SaaS dashboards, Web3 flows, fintech interfaces, mobile apps, product websites, design systems and developer handoff.</p>
          <div class="cta-group"><a class="btn btn-primary" href="/projects">View selected work</a><a class="btn btn-secondary" href="/contact">Discuss a project</a></div>
        </div>
        <aside class="nrs-about-v2-panel" aria-label="Profile summary">
          <span class="eyebrow">Useful when</span>
          <h2>There is a product idea, but the flow is still foggy.</h2>
          <p>I help teams define hierarchy, states, content, components and responsive behavior before the work reaches engineering.</p>
          <dl>
            <div><dt>Experience</dt><dd>6+ years</dd></div>
            <div><dt>Focus</dt><dd>UX/UI, systems, handoff</dd></div>
            <div><dt>Based in</dt><dd>Nepal, remote-friendly</dd></div>
          </dl>
        </aside>
      </section>

      <section class="nrs-about-v2-proof reveal-on-scroll" aria-label="Core strengths">
        <article><span class="eyebrow">01</span><h2>Clarify the product</h2><p>Map users, goals, constraints and edge cases so the interface solves the right problem instead of decorating confusion.</p></article>
        <article><span class="eyebrow">02</span><h2>Structure the UX</h2><p>Turn messy flows into navigable journeys, states, forms, dashboards, filters, review steps and confirmation patterns.</p></article>
        <article><span class="eyebrow">03</span><h2>Prepare the build</h2><p>Document components, behavior, responsive rules and handoff notes so implementation does not depend on guessing.</p></article>
      </section>

      <section class="nrs-about-v2-section reveal-on-scroll">
        <div class="nrs-section-intro"><p class="eyebrow">How I work</p><h2 class="section-title">Clear first. Polished second. Buildable always.</h2></div>
        <div class="nrs-about-v2-steps">
          <article><span>01</span><h3>Product context</h3><p>I start with the goal, users, constraints, current friction and the decision the interface needs to support.</p></article>
          <article><span>02</span><h3>Flow and hierarchy</h3><p>I define page structure, screen sequence, content priority, states and interaction rules before heavy visual work.</p></article>
          <article><span>03</span><h3>Interface system</h3><p>I turn the structure into reusable UI patterns, responsive layouts and polished production-ready screens.</p></article>
          <article><span>04</span><h3>Review and handoff</h3><p>I prepare notes, states, QA checks and implementation context so teams can build with fewer loose ends.</p></article>
        </div>
      </section>

      <section class="nrs-about-v2-section nrs-about-v2-split reveal-on-scroll">
        <div><p class="eyebrow">Best fit</p><h2 class="section-title">I am most useful when the product is complex enough to need design judgment.</h2></div>
        <div class="nrs-about-v2-tags" aria-label="Best-fit work types"><span>SaaS dashboards</span><span>Web3 transaction flows</span><span>Fintech trust states</span><span>Mobile product UX</span><span>Product websites</span><span>Figma design systems</span><span>UX audits</span><span>Developer handoff</span></div>
      </section>

      <section class="nrs-about-v2-cta reveal-on-scroll">
        <p class="eyebrow">Next step</p>
        <h2>Want to see how I think through product work?</h2>
        <p>Start with the case studies, then send the product, role or problem if you want a practical design conversation.</p>
        <div class="cta-group"><a class="btn btn-primary" href="/projects">See case studies</a><a class="btn btn-secondary" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a></div>
      </section>
    </main>
${scripts()}
  </body>
</html>`;

const contactHtml = `${head({
  title: 'Contact Nischhal Raj Subba | Product Design Support',
  description: 'Contact Nischhal Raj Subba for product design, UX/UI, design systems, UX audits, website UX, SaaS dashboards, Web3 flows and developer handoff.',
  canonical: '/contact',
})}
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>
${nav('contact')}
    <main id="main-content" class="container nrs-contact-v2">
      <section class="nrs-contact-v2-hero reveal-on-scroll">
        <div class="nrs-contact-v2-copy">
          <p class="eyebrow">Contact</p>
          <h1 class="hero-title">Send the product context. I will reply with the useful next step.</h1>
          <p class="body-large">Use this page for product design roles, freelance UX/UI, design systems, UX audits, website redesigns, SaaS dashboards, Web3 flows and implementation-ready handoff.</p>
          <div class="nrs-contact-v2-meta">
            <a href="mailto:${email}"><span>Email</span><strong>${email}</strong></a>
            <a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span>Resume</span><strong>Download PDF</strong></a>
          </div>
        </div>
        <form id="contact-form" class="nrs-contact-v2-form" action="https://formsubmit.co/${email}" method="POST">
          <input type="hidden" name="_subject" value="Portfolio inquiry from nischhalsubba.com.np" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_replyto" value="" />
          <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" class="nrs-hidden-field" />
          <div class="nrs-contact-form-head"><p class="eyebrow">Project brief</p><h2>Keep it short. Make it useful.</h2><p>Share enough context for me to understand fit, timeline and what kind of design support would actually help.</p></div>
          <div class="nrs-contact-form-grid">
            <label>Name<input type="text" name="name" autocomplete="name" minlength="2" required placeholder="Your name" /></label>
            <label>Email<input type="email" name="email" autocomplete="email" required placeholder="you@example.com" /></label>
            <label>Project type<select name="need" required><option value="">Select a topic</option><option>Product design role</option><option>Freelance UX/UI project</option><option>UX audit</option><option>Design system</option><option>Website redesign</option><option>SaaS dashboard</option><option>Web3 UX</option><option>Other</option></select></label>
            <label>Timeline<select name="timeline" required><option value="">Select timeline</option><option>This week</option><option>This month</option><option>1-3 months</option><option>Flexible</option></select></label>
          </div>
          <label>Message<textarea name="message" rows="7" minlength="20" required placeholder="Tell me what you are building, who it is for, what is unclear, and where design should help."></textarea></label>
          <p class="nrs-contact-privacy">Your name, email and project context are processed by FormSubmit only to deliver this inquiry. Do not include passwords, financial information or confidential credentials.</p>
          <div class="nrs-contact-form-actions"><button class="btn btn-primary" type="submit">Send message</button><a class="btn btn-secondary" href="mailto:${email}">Use email instead</a></div>
          <p id="contact-form-status" class="form-status" role="status" aria-live="polite">The form uses spam protection. If it cannot send, your entries remain available and the email option can be used instead.</p>
        </form>
      </section>

      <section class="nrs-contact-v2-context reveal-on-scroll">
        <article><span class="eyebrow">01</span><h2>Product or role</h2><p>What is being designed, improved, audited, hired for or shipped?</p></article>
        <article><span class="eyebrow">02</span><h2>Current friction</h2><p>Where are users, stakeholders or engineers getting stuck?</p></article>
        <article><span class="eyebrow">03</span><h2>Timeline</h2><p>When do you need first review, design direction, audit findings or production handoff?</p></article>
        <article><span class="eyebrow">04</span><h2>Useful proof</h2><p>Share links, screenshots, Figma files, docs or examples if they help explain the situation.</p></article>
      </section>

      <section class="nrs-contact-v2-footer-cta reveal-on-scroll">
        <div><p class="eyebrow">Not ready to send a brief?</p><h2>Start with work samples and the resume.</h2></div>
        <div class="cta-group"><a class="btn btn-secondary" href="/projects">View work</a><a class="btn btn-secondary" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download Resume</a></div>
      </section>
    </main>
${scripts()}
  </body>
</html>`;

fs.writeFileSync(path.join(root, 'about.html'), `${aboutHtml}\n`, 'utf8');
fs.writeFileSync(path.join(root, 'contact.html'), `${contactHtml}\n`, 'utf8');

console.log('Generated accessible About and Contact pages with clean routes and protected form behavior.');
