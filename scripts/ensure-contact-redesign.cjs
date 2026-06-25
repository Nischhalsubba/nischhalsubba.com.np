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
    <link rel="stylesheet" href="/contact-redesign.css?v=2.0" />
  </head>
  <body class="nrs-contact-page nrs-contact-v3 nrs-inner-page">
    ${nav}

    <main class="container">
      <section class="nrs-contact-v3-hero" aria-labelledby="contact-title">
        <div class="nrs-contact-v3-copy">
          <p class="nrs-contact-kicker reveal-on-scroll">Contact</p>
          <h1 id="contact-title" class="nrs-contact-title reveal-on-scroll">Tell me what is unclear. I will help make it usable.</h1>
          <p class="nrs-contact-lead reveal-on-scroll">Use this page for product design roles, UX/UI projects, Web3 or fintech flows, SaaS dashboards, design systems, UX audits, app design, and website redesigns.</p>
          <div class="nrs-contact-actions reveal-on-scroll"><a class="btn btn-primary" href="#contact-form">Write a message</a><a class="btn btn-secondary" href="mailto:${email}">Email directly</a></div>
          <div class="nrs-contact-v3-meta reveal-on-scroll" aria-label="Quick contact links">
            <a href="mailto:${email}"><span>Email</span><strong>${email}</strong></a>
            <a href="/projects.html"><span>Proof</span><strong>Selected work</strong></a>
            <a href="/services.html"><span>Services</span><strong>What I help with</strong></a>
          </div>
        </div>

        <form id="contact-form" class="nrs-contact-v3-form reveal-on-scroll" action="https://formsubmit.co/${email}" method="POST">
          <div class="nrs-contact-form-head"><p class="nrs-contact-kicker">Project note</p><h2>Start with the messy version.</h2><p>Five useful lines are better than a polished brief nobody believes.</p></div>
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
          <div class="nrs-contact-form-footer"><p class="nrs-contact-note">Your message goes to my email and is only used to reply to your inquiry.</p><div class="form-actions"><button class="btn btn-primary" type="submit">Submit message</button><a class="btn btn-secondary" href="mailto:${email}">Use email instead</a></div></div>
          <p id="contact-form-status" class="form-status" role="status" aria-live="polite"></p>
        </form>
      </section>

      <section class="nrs-contact-v3-guidance" aria-label="What to include">
        <article><span>01</span><h2>Product or role</h2><p>What is being designed, improved, audited, hired for, or shipped.</p></article>
        <article><span>02</span><h2>Current friction</h2><p>Where users, stakeholders, or engineers are getting stuck right now.</p></article>
        <article><span>03</span><h2>Scope and timing</h2><p>When you need help and whether this is a role, audit, sprint, or redesign.</p></article>
      </section>
    </main>

    ${footer}
    <script type="module" src="/script.js?v=32.0"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(root, 'contact.html'), `${html}\n`, 'utf8');
console.log('Generated zero-based contact page redesign v3.');
