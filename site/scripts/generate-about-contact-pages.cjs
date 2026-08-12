/**
 * @fileoverview scripts/generate-about-contact-pages.cjs
 * Purpose: Generate the canonical About and Contact page source used by the portfolio build pipeline.
 * Responsibilities:
 * - Build About and Contact documents from one shared navigation, footer, metadata, and runtime contract.
 * - Keep public profile claims factual and consistent with visible portfolio evidence.
 * - Preserve contact form fields, fallback email behavior, and search/social metadata required by production.
 * - Write deterministic HTML so repeated source-generation runs produce the same page structure.
 * Execution context: Node.js source-generation stage invoked by `scripts/generate-source.cjs`.
 * Connected files:
 * - scripts/generate-source.cjs
 * - scripts/early-theme-bootstrap.cjs
 * - src/pages/core/about.html
 * - src/pages/core/contact.html
 * - src/runtime/script.js
 * Maintenance: Keep page content focused on human visitors and public portfolio evidence. Shared navigation, contact behavior, or metadata changes should remain synchronized with the rest of the site.
 */
const fs = require('fs');
const path = require('path');
const { EARLY_THEME_BOOTSTRAP } = require('./early-theme-bootstrap.cjs');

const root = path.resolve(__dirname, '..');
const email = 'hinischalsubba@gmail.com';

/**
 * Function contract: head
 * Purpose: Build the shared document head used by generated About and Contact pages.
 * Inputs: Object containing `title`, `description`, `canonical`, optional social `image`, and optional structured-data `schema`.
 * Side effects: None.
 * Returns: HTML from the doctype through the closing `</head>` tag.
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
 * Purpose: Generate the shared desktop and mobile navigation with the requested section marked as current.
 * Inputs: `active` - Logical navigation section for the current page.
 * Side effects: None.
 * Returns: Complete navigation HTML used at the top of generated pages.
 */
function nav(active) {
  /**
   * Function contract: item
   * Purpose: Build one navigation link and apply active-state classes and accessibility metadata when it matches the current section.
   * Inputs: `section` - navigation key; `href` - destination; `label` - visible text; `cls` - optional CSS class.
   * Side effects: None.
   * Returns: One anchor element as an HTML string.
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
 * Purpose: Write one complete generated page to its historical root compatibility path for the source-generation workflow.
 * Inputs: `name` - output filename; `html` - complete page document.
 * Side effects: Writes a UTF-8 HTML file in the repository root.
 * Returns: Nothing.
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
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Public profile</p>
          <h2 class="section-title">Work, experience, and profile links.</h2>
          <p class="section-lead">Use the portfolio, resume, and public profiles below to review the work and professional background directly.</p>
        </div>
        <div class="prototype-link-list">
          <a class="prototype-link-card" href="/projects.html"><span style="display:block;font-weight:850;">Selected work</span><span style="color:var(--text-secondary);">Case studies and product examples</span></a>
          <a class="prototype-link-card" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span style="display:block;font-weight:850;">Resume PDF</span><span style="color:var(--text-secondary);">Experience, skills, and contact details</span></a>
          <a class="prototype-link-card" href="https://www.linkedin.com/in/nischhal/" target="_blank" rel="noopener noreferrer"><span style="display:block;font-weight:850;">LinkedIn</span><span style="color:var(--text-secondary);">Professional profile and experience</span></a>
          <a class="prototype-link-card" href="https://www.behance.net/nischhal" target="_blank" rel="noopener noreferrer"><span style="display:block;font-weight:850;">Behance</span><span style="color:var(--text-secondary);">Public design profile</span></a>
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

console.log('Generated About and Contact pages.');
