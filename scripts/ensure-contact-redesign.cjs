const fs = require('fs');
const path = require('path');
const { EARLY_THEME_BOOTSTRAP } = require('./early-theme-bootstrap.cjs');

const root = path.resolve(__dirname, '..');
const email = 'hinischalsubba@gmail.com';

const nav = `<button class="mobile-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav-overlay"><span></span><span></span></button><a href="/" class="mobile-logo">NRS</a><div class="mobile-nav-overlay" id="mobile-nav-overlay"><nav class="mobile-nav-links" aria-label="Mobile navigation"><a href="/">Home</a><a href="/projects.html">Work</a><a href="/services.html">Services</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html" class="active" aria-current="page">Contact</a></nav></div><button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme"></button><nav class="nav-wrapper" aria-label="Primary navigation"><div class="nav-pill"><div class="nav-glider"></div><a href="/" class="nav-link">Home</a><a href="/projects.html" class="nav-link">Work</a><a href="/services.html" class="nav-link">Services</a><a href="/about.html" class="nav-link">About</a><a href="/blog/" class="nav-link">Writing</a><a href="/contact.html" class="nav-link active" aria-current="page">Contact</a></div></nav>`;

const footer = `<footer class="site-footer"><div class="container"><div class="footer-top-grid"><div class="footer-cta"><h2>Available for<br>product design<br><span style="font-style:italic;">roles and projects.</span></h2><p>I help teams clarify product flows, polish interfaces, document systems and hand off work engineers can actually build.</p><a href="mailto:${email}" class="footer-email-btn">${email}</a></div><div class="footer-nav-grid"><div class="footer-col"><h5>Pages</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/services.html">Services</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a></div><div class="footer-col"><h5>Proof</h5><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener">Behance</a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener">Uxcel</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener">LinkedIn</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a></div><div class="footer-col"><h5>For agents</h5><a href="/llms.txt">LLMs.txt</a><a href="/ai-profile.json">AI profile</a><a href="/sitemap.xml">Sitemap</a></div></div></div><div class="footer-bottom-bar"><span>(c) 2026 Nischhal Raj Subba.</span></div></div></footer>`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Nischhal Raj Subba | Product Design, UX/UI and Design Systems</title>
    <meta name="description" content="Contact Nischhal Raj Subba for product design roles, UX/UI projects, Web3 UX, SaaS dashboards, fintech workflows, design systems, UX audits, and website redesigns." />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="https://nischhalsubba.com.np/contact" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Contact Nischhal Raj Subba | Product Designer" />
    <meta property="og:description" content="Send a product design role, freelance project, UX audit request, design system brief, Web3 UX issue, SaaS dashboard problem, or website redesign inquiry." />
    <meta property="og:url" content="https://nischhalsubba.com.np/contact" />
    <meta property="og:image" content="https://nischhalsubba.com.np/assets/images/portrait.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    ${EARLY_THEME_BOOTSTRAP}
    <link rel="stylesheet" href="/style.css?v=32.0" />
    <link rel="stylesheet" href="/site-design-system.css?v=1.0" />
    <link rel="stylesheet" href="/contact-redesign.css?v=1.0" />
  </head>
  <body class="nrs-contact-page nrs-inner-page">
    ${nav}

    <main class="container">
      <section class="nrs-contact-hero" aria-labelledby="contact-title">
        <div>
          <p class="nrs-contact-kicker reveal-on-scroll">Contact</p>
          <h1 id="contact-title" class="nrs-contact-title reveal-on-scroll">Send the product problem, not a perfect brief.</h1>
          <p class="nrs-contact-lead reveal-on-scroll">Use this page for product design roles, UX/UI projects, Web3 or fintech flows, SaaS dashboards, design systems, UX audits, app design, and website redesigns.</p>
          <div class="nrs-contact-actions reveal-on-scroll"><a class="btn btn-primary" href="#contact-form">Write a message</a><a class="btn btn-secondary" href="mailto:${email}">Email directly</a></div>
        </div>
        <aside class="nrs-contact-panel reveal-on-scroll" aria-label="Contact overview">
          <p class="nrs-contact-kicker">Best use</p>
          <h2>Send enough context for a useful first reply.</h2>
          <p>I usually reply with fit, availability, and the clearest next step. If the project is not a fit, I will still try to point you in a useful direction instead of performing inbox theater.</p>
          <div class="nrs-contact-proof">
            <div><strong>Email</strong><span><a href="mailto:${email}">${email}</a></span></div>
            <div><strong>Good for</strong><span>Roles, audits, product UX, systems, websites</span></div>
            <div><strong>Useful links</strong><span><a href="/projects.html">Work</a> · <a href="/services.html">Services</a> · <a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a></span></div>
          </div>
        </aside>
      </section>

      <section class="nrs-contact-section" aria-label="Contact methods">
        <div class="nrs-contact-methods">
          <article class="nrs-contact-card reveal-on-scroll"><small>01 / Roles</small><div><h3>Product design role</h3><p>Send role type, product context, team setup, expected responsibilities, location or remote preference, and hiring timeline.</p></div><a href="#contact-form">Use the form</a></article>
          <article class="nrs-contact-card reveal-on-scroll"><small>02 / Projects</small><div><h3>UX/UI or website project</h3><p>Send the product, audience, current friction, target pages or flows, deadline, and what already exists.</p></div><a href="#contact-form">Start with context</a></article>
          <article class="nrs-contact-card reveal-on-scroll"><small>03 / Direct</small><div><h3>Email without the form</h3><p>Better if your browser, network, or extension stack blocks forms. Yes, even contacting someone is apparently a system design problem now.</p></div><a href="mailto:${email}">${email}</a></article>
        </div>
      </section>

      <section class="nrs-contact-section" aria-labelledby="contact-form-heading">
        <div class="nrs-contact-form-shell reveal-on-scroll">
          <div class="nrs-contact-form-copy">
            <p class="nrs-contact-kicker">Project brief</p>
            <h2 id="contact-form-heading">A short, useful message is enough.</h2>
            <p>You do not need polished requirements. Send the situation, what feels unclear, and when it matters. I will translate the fog into a next step, because apparently that is my contribution to civilization.</p>
            <div class="nrs-contact-steps" aria-label="What to include">
              <article class="nrs-contact-step"><span>01</span><h3>Product or role</h3><p>What is being designed, improved, audited, hired for, or shipped.</p></article>
              <article class="nrs-contact-step"><span>02</span><h3>Current friction</h3><p>Where users, stakeholders, or engineers are getting stuck.</p></article>
              <article class="nrs-contact-step"><span>03</span><h3>Timeline and scope</h3><p>When you need help and whether this is a role, audit, sprint, or redesign.</p></article>
            </div>
          </div>

          <form id="contact-form" class="nrs-contact-form" action="https://formsubmit.co/${email}" method="POST">
            <input type="hidden" name="_subject" value="Portfolio inquiry from nischhalsubba.com.np" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;" />
            <div class="nrs-contact-form-grid">
              <label class="form-field">Name<input type="text" name="name" autocomplete="name" required placeholder="Your name" /></label>
              <label class="form-field">Email<input type="email" name="email" autocomplete="email" required placeholder="you@example.com" /></label>
              <label class="form-field">Project type<select name="need" required><option value="">Select a topic</option><option>Product design role</option><option>Freelance UX/UI project</option><option>UX audit</option><option>Design system</option><option>Web3 or fintech UX</option><option>SaaS dashboard</option><option>Website redesign</option><option>Other</option></select></label>
              <label class="form-field">Timeline<select name="timeline"><option value="">Select timeline</option><option>Now or this month</option><option>1-3 months</option><option>Flexible</option><option>Hiring pipeline</option></select></label>
            </div>
            <label class="form-field">Message<textarea name="message" rows="7" required placeholder="Tell me what you are building, who it is for, what is unclear, and where design should help."></textarea></label>
            <p class="nrs-contact-note">Your message is only used to respond to your inquiry. The form sends to my email; the email button is the fallback.</p>
            <div class="form-actions"><button class="btn btn-primary" type="submit">Submit message</button><a class="btn btn-secondary" href="mailto:${email}">Use email instead</a></div>
            <p id="contact-form-status" class="form-status" role="status" aria-live="polite"></p>
          </form>
        </div>
      </section>

      <section class="nrs-contact-section" style="border-top:0;padding-top:0;">
        <div class="nrs-contact-cta reveal-on-scroll">
          <p class="nrs-contact-kicker">Before sending</p>
          <h2>Clarity beats a long brief.</h2>
          <p>Send the real problem in plain language. Screenshots, links, Figma files, product notes, and messy context are welcome.</p>
          <div class="nrs-contact-actions"><a href="#contact-form" class="btn btn-primary">Write the message</a><a href="/projects.html" class="btn btn-secondary">Review selected work</a></div>
        </div>
      </section>
    </main>

    ${footer}
    <script type="module" src="/script.js?v=32.0"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(root, 'contact.html'), `${html}\n`, 'utf8');
console.log('Generated zero-based contact page redesign.');
