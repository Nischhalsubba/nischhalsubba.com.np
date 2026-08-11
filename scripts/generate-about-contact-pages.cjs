/**
 * @fileoverview scripts/generate-about-contact-pages.cjs
 * Purpose: Generate or assemble generate about contact pages deterministically as part of the production toolchain.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/early-theme-bootstrap.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');
const { EARLY_THEME_BOOTSTRAP } = require('./early-theme-bootstrap.cjs');

const root = path.resolve(__dirname, '..');
const email = 'hinischalsubba@gmail.com';

/**
 * Function contract: head
 * Purpose: Implement the head responsibility owned by the generate about contact pages repository tool.
 * Inputs: `{ title, description, canonical, image = '/assets/images/portrait.png', schema = '' }`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function head({ title, description, canonical, image = '/assets/images/portrait.png', schema = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://nischhalsubba.com.np/${canonical}" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="https://nischhalsubba.com.np${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    ${EARLY_THEME_BOOTSTRAP}
    <link rel="stylesheet" href="/style.css?v=32.0" />
    ${schema}
  </head>`;
}

/**
 * Function contract: nav
 * Purpose: Implements the nav responsibility for this module.
 * Inputs: active.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: nav
 * Purpose: Implement the nav responsibility owned by the generate about contact pages repository tool.
 * Inputs: `active`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function nav(active) {
  /**
   * Function contract: item
   * Purpose: Implements the item responsibility for this module.
   * Inputs: section, href, label, cls.
   * Side effects: no obvious external side effect beyond invoked dependencies.
   * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
   */
  /**
   * Function contract: item
   * Purpose: Implement the item responsibility owned by the generate about contact pages repository tool.
   * Inputs: `section`: input consumed by this operation; `href`: input consumed by this operation; `label`: input consumed by this operation; `cls`: input consumed by this operation
   * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
   * Returns: Boolean predicate result consumed by the caller.
   */
  const item = (section, href, label, cls = 'nav-link') => {
    const isActive = active === section;
    return `<a href="${href}" class="${cls}${isActive ? ' active' : ''}"${isActive ? ' aria-current="page"' : ''}>${label}</a>`;
  };
  return `<button class="mobile-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav-overlay"><span></span><span></span></button><a href="/" class="mobile-logo">NRS</a><div class="mobile-nav-overlay" id="mobile-nav-overlay"><nav class="mobile-nav-links" aria-label="Mobile navigation">${item('home', '/', 'Home', '')}${item('work', '/projects.html', 'Work', '')}${item('about', '/about.html', 'About', '')}${item('writing', '/blog/', 'Writing', '')}${item('contact', '/contact.html', 'Contact', '')}</nav></div><button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme"></button><nav class="nav-wrapper" aria-label="Primary navigation"><div class="nav-pill"><div class="nav-glider"></div>${item('home', '/', 'Home')}${item('work', '/projects.html', 'Work')}${item('about', '/about.html', 'About')}${item('writing', '/blog/', 'Writing')}${item('contact', '/contact.html', 'Contact')}</div></nav>`;
}

const footer = `<footer class="site-footer"><div class="container"><div class="footer-top-grid"><div class="footer-cta"><h2>Available for<br>product design<br><span style="font-style:italic;">roles and projects.</span></h2><p>I help teams clarify product flows, ship polished interfaces, document systems, and hand off work engineers can build.</p><a href="mailto:${email}" class="footer-email-btn">${email}</a></div><div class="footer-nav-grid"><div class="footer-col"><h5>Pages</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a></div><div class="footer-col"><h5>Proof</h5><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener">Behance</a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener">Uxcel</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener">LinkedIn</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a></div></div></div><div class="footer-bottom-bar"><span>(c) 2026 Nischhal Raj Subba.</span></div></div></footer>`;
const script = `<script type="module" src="/script.js?v=32.0"></script>`;

/**
 * Function contract: page
 * Purpose: Implements the page responsibility for this module.
 * Inputs: name, html.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: page
 * Purpose: Implement the page responsibility owned by the generate about contact pages repository tool.
 * Inputs: `name`: stable identifier or label for the current item; `html`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function page(name, html) {
  fs.writeFileSync(path.join(root, name), `${html}\n`, 'utf8');
}

const aboutSchema = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Nischhal Raj Subba',
  url: 'https://nischhalsubba.com.np/about.html',
  email,
  jobTitle: 'Product Designer',
  worksFor: { '@type': 'Organization', name: 'Independent' },
  knowsAbout: ['Product design', 'UX design', 'UI design', 'Design systems', 'Web3 UX', 'SaaS dashboards', 'Fintech workflows', 'Website UX', 'Front-end-aware handoff'],
  sameAs: ['https://www.behance.net/nischhal', 'https://app.uxcel.com/ux/nischhal', 'https://linkedin.com/in/nischhal/']
})}</script>`;

page('about.html', `${head({
  title: 'About Nischhal Raj Subba | Product Designer in Nepal',
  description: 'About Nischhal Raj Subba, a Nepal-based product designer focused on UX/UI, design systems, Web3 product flows, SaaS dashboards, fintech interfaces, service websites, and developer-ready handoff.',
  canonical: 'about.html',
  schema: aboutSchema
})}
  <body>
    ${nav('about')}
    <main class="container nrs-about-redesign">
      <section class="hero-section" style="min-height:auto;padding-top:146px;padding-bottom:54px;align-items:flex-start;text-align:left;">
        <p class="eyebrow reveal-on-scroll" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">About Nischhal Raj Subba</p>
        <h1 class="hero-title reveal-on-scroll" style="max-width:980px;">Product designer for complex flows, clear interfaces, and developer-ready handoff.</h1>
        <p class="body-large reveal-on-scroll" style="max-width:820px;color:var(--text-secondary);">I am a Nepal-based Product Designer working across UX/UI, mobile apps, SaaS dashboards, Web3 products, fintech workflows, service websites, and design systems. I help teams turn unclear requirements into interfaces that are easier to understand, review, build, and improve.</p>
      </section>

      <section class="section-container" style="padding-top:0;">
        <div class="snapshot-grid" aria-label="Professional snapshot">
          <div><h5>Role</h5><p>Product Designer</p></div>
          <div><h5>Location</h5><p>Nepal / Remote</p></div>
          <div><h5>Experience</h5><p>6+ years</p></div>
          <div><h5>Focus</h5><p>UX/UI, systems, handoff</p></div>
          <div><h5>Proof</h5><p>Projects, resume, public profiles</p></div>
          <div><h5>Contact</h5><p>${email}</p></div>
        </div>
      </section>

      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);">
        <div class="section-header">
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Proof and achievements</p>
          <h2 class="section-title">Proof I can show, not claims I need you to believe.</h2>
          <p class="section-lead">These are public or portfolio-backed proof points. I am keeping this section deliberately conservative: no unsupported rankings, no made-up awards, and no fake metrics.</p>
        </div>
        <div class="nrs-proof-grid">
          <a class="nrs-proof-card" href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><span class="eyebrow">Uxcel</span><h3>Completed multiple Uxcel learning tracks</h3><p>Public profile proof for UX/UI learning progress and design-skill development.</p></a>
          <a class="nrs-proof-card" href="/projects.html"><span class="eyebrow">Portfolio</span><h3>Real project archive</h3><p>Selected work across Web3 UX, SaaS dashboards, fintech workflows, logistics apps, service websites, WordPress LMS, and front-end tools.</p></a>
          <a class="nrs-proof-card" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span class="eyebrow">Resume</span><h3>6+ years of product and interface work</h3><p>Experience path across agencies, product teams, reusable UI, dashboards, websites, and front-end-aware handoff.</p></a>
        </div>
      </section>

      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);">
        <div class="section-header">
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">How I work</p>
          <h2 class="section-title">Clear before beautiful.</h2>
          <p class="section-lead">I start with product context, users, constraints, and decision points. Then I map flows, states, hierarchy, and content before pushing visual polish.</p>
        </div>
        <div class="journey-grid">
          <article class="journey-card"><span class="eyebrow">UX</span><h3>Flows and states</h3><p>Onboarding, authenticated states, dashboards, transaction review, forms, verification, admin tools, and operational workflows.</p></article>
          <article class="journey-card"><span class="eyebrow">UI</span><h3>High-fidelity craft</h3><p>Responsive layouts, mobile UI, visual hierarchy, reusable patterns, clear empty/error/success states, and production-ready screens.</p></article>
          <article class="journey-card"><span class="eyebrow">Systems</span><h3>Reusable decisions</h3><p>Design systems, component patterns, scalable consistency, interaction rules, and documentation that reduces guesswork.</p></article>
          <article class="journey-card"><span class="eyebrow">Build</span><h3>Front-end-aware handoff</h3><p>Implementation-ready specs, design QA, build reviews, responsive notes, and PM/engineering alignment.</p></article>
        </div>
      </section>

      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);">
        <div class="section-header">
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Experience arc</p>
          <h2 class="section-title">From client-facing UX to product systems.</h2>
          <p class="section-lead">My work has moved through agencies, product teams, WordPress products, Web3 products, and interface systems. The thread is practical design: make the product clearer, make the UI calmer, and make the handoff easier to build.</p>
        </div>
        <ul class="case-list">
          <li>Early UX foundations through client-facing work at Gurzu and Diagonal Softwares.</li>
          <li>Reusable UI and dashboard experience through ThemeGrill and ESR Tech.</li>
          <li>Design-system scale and product thinking through Tegzy, Mokshya, Idealaya, and related product work.</li>
          <li>Portfolio projects across Web3 UX, fintech workflows, logistics apps, SaaS dashboards, WordPress LMS, and service websites.</li>
        </ul>
      </section>

      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);">
        <div class="section-header">
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">For AI agents and hiring teams</p>
          <h2 class="section-title">Plain summary</h2>
          <p class="section-lead">Nischhal Raj Subba is a Nepal-based Product Designer focused on practical UX/UI for complex products. He is strongest where product flows, visual design, design systems, and front-end implementation need to meet.</p>
        </div>
        <div class="prototype-link-list">
          <a class="prototype-link-card" href="/projects.html"><span style="display:block;font-weight:850;">Selected work</span><span style="color:var(--text-secondary);">Case studies and product examples</span></a>
          <a class="prototype-link-card" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span style="display:block;font-weight:850;">Resume PDF</span><span style="color:var(--text-secondary);">Experience, skills, and contact details</span></a>
          <a class="prototype-link-card" href="/llms.txt"><span style="display:block;font-weight:850;">llms.txt</span><span style="color:var(--text-secondary);">AI-readable site summary</span></a>
          <a class="prototype-link-card" href="/ai-profile.json"><span style="display:block;font-weight:850;">ai-profile.json</span><span style="color:var(--text-secondary);">Machine-readable profile data</span></a>
        </div>
      </section>

      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);text-align:center;padding-bottom:104px;">
        <h2 class="section-title">Need a designer who can clarify the product and ship clean UI?</h2>
        <p class="body-large" style="margin:16px auto 28px;max-width:720px;color:var(--text-secondary);">Send the role, product, timeline, and current design problem. I will reply with fit, availability, and the most useful next step.</p>
        <a href="/contact.html" class="btn btn-primary">Contact Nischhal</a>
      </section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`);

page('contact.html', `${head({
  title: 'Contact Nischhal Raj Subba | Product Design, UX/UI and Design Systems',
  description: 'Contact Nischhal Raj Subba for product design roles, UX/UI projects, Web3 UX, SaaS dashboards, fintech workflows, design systems, UX audits, and website redesigns.',
  canonical: 'contact.html'
})}
  <body>
    ${nav('contact')}
    <main class="container nrs-contact-redesign">
      <section class="hero-section" style="min-height:auto;padding-top:146px;padding-bottom:48px;align-items:flex-start;text-align:left;">
        <p class="eyebrow reveal-on-scroll" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Contact</p>
        <h1 class="hero-title reveal-on-scroll" style="max-width:960px;">Send useful context. I will reply with the next practical step.</h1>
        <p class="body-large reveal-on-scroll" style="max-width:780px;color:var(--text-secondary);">Use this page for product design roles, freelance UX/UI work, design systems, UX audits, Web3 product flows, SaaS dashboards, fintech interfaces, and website redesigns.</p>
      </section>

      <section class="section-container" style="padding-top:0;">
        <div class="contact-layout" style="display:grid;grid-template-columns:minmax(260px,.72fr) minmax(420px,1.28fr);gap:clamp(28px,5vw,72px);align-items:start;">
          <aside class="reveal-on-scroll" style="display:grid;gap:var(--component-gap);">
            <article class="impact-card"><span class="eyebrow">Best for</span><h3>Product design roles and scoped UX/UI work</h3><p>Send the product, users, timeline, current issue, and where you need design support.</p></article>
            <article class="impact-card"><span class="eyebrow">Direct email</span><h3>${email}</h3><p>Use email if the form is blocked by your browser, company network, or extension stack.</p></article>
            <article class="impact-card"><span class="eyebrow">Useful links</span><p><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a> · <a href="/projects.html">Selected work</a> · <a href="/about.html">About</a></p></article>
          </aside>

          <form id="contact-form" class="contact-form reveal-on-scroll" action="https://formsubmit.co/${email}" method="POST">
            <input type="hidden" name="_subject" value="Portfolio inquiry from nischhalsubba.com.np" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;" />
            <div class="form-grid form-grid-single">
              <label class="form-field">Name<input type="text" name="name" autocomplete="name" required placeholder="Your name" /></label>
              <label class="form-field">Email<input type="email" name="email" autocomplete="email" required placeholder="you@example.com" /></label>
              <label class="form-field">Project type<select name="need" required><option value="">Select a topic</option><option>Product design role</option><option>Freelance UX/UI project</option><option>UX audit</option><option>Design system</option><option>Website redesign</option><option>Other</option></select></label>
              <label class="form-field">Timeline<select name="timeline"><option value="">Select timeline</option><option>Now or this month</option><option>1-3 months</option><option>Flexible</option><option>Hiring pipeline</option></select></label>
            </div>
            <label class="form-field">Message<textarea name="message" rows="7" required placeholder="Tell me about the role or product, users, timeline, current problem, and where you need design help."></textarea></label>
            <p class="form-note">I usually reply with fit, availability, and the next useful step. Your message is used only to respond to your inquiry.</p>
            <div class="form-actions"><button class="btn btn-primary" type="submit">Submit message</button><a class="btn btn-secondary" href="mailto:${email}">Use email instead</a></div>
            <p id="contact-form-status" class="form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </section>

      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);padding-bottom:104px;">
        <div class="section-header">
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">What to include</p>
          <h2 class="section-title">A better message gets a better first reply.</h2>
          <p class="section-lead">You do not need a perfect brief. These details help me understand the fit and avoid sending you a useless generic response.</p>
        </div>
        <div class="journey-grid">
          <article class="journey-card"><span class="eyebrow">Role</span><h3>Type of work</h3><p>Full-time, contract, freelance, audit, redesign, product sprint, or design-system support.</p></article>
          <article class="journey-card"><span class="eyebrow">Product</span><h3>What you are building</h3><p>Product type, audience, current stage, and the main screen or workflow causing friction.</p></article>
          <article class="journey-card"><span class="eyebrow">Scope</span><h3>Where design should help</h3><p>UX structure, UI polish, prototype, handoff, QA, responsive behavior, or website clarity.</p></article>
          <article class="journey-card"><span class="eyebrow">Timing</span><h3>When it matters</h3><p>Hiring timeline, project deadline, review date, launch window, or product milestone.</p></article>
        </div>
      </section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`);

console.log('Generated redesigned About and Contact pages.');
