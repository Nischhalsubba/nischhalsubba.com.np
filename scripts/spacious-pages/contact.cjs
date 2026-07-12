const { replaceMain, email } = require('./shared.cjs');

const markup = `<main id="main-content" class="container nrs-spacious-page nrs-contact-spacious">
  <section class="nrs-page-hero reveal-on-scroll" aria-labelledby="contact-title">
    <div class="nrs-page-hero__title">
      <p class="eyebrow">Contact</p>
      <h1 id="contact-title" class="hero-title">Tell me what is unclear. I will reply with a practical next step.</h1>
      <p class="body-large">Use this page for product design roles, focused UX/UI projects, audits, design systems, SaaS dashboards, Web3 flows and website redesigns.</p>
    </div>
    <aside class="nrs-page-hero__aside" aria-label="Contact details">
      <p class="eyebrow">Direct email</p>
      <a class="nrs-direct-email" href="mailto:${email}">${email}</a>
      <dl class="nrs-facts">
        <div><dt>Response</dt><dd>Usually within 1–2 working days</dd></div>
        <div><dt>Useful context</dt><dd>Product, users, current friction, scope and timeline</dd></div>
        <div><dt>Proof</dt><dd><a href="/projects">Selected work</a> and <a href="/assets/resume.pdf" download data-resume-download>resume PDF</a></dd></div>
      </dl>
    </aside>
  </section>

  <section class="nrs-section nrs-contact-layout reveal-on-scroll" aria-labelledby="project-brief">
    <header class="nrs-section-heading">
      <p class="eyebrow">Project brief</p>
      <h2 id="project-brief" class="section-title">A short, honest message is enough.</h2>
      <p class="section-lead">Describe what you are building, who it serves, what is currently unclear and when the first useful decision is needed.</p>
    </header>
    <form id="contact-form" class="nrs-open-form" action="https://formsubmit.co/${email}" method="POST" novalidate>
      <input type="hidden" name="_subject" value="Portfolio inquiry from nischhalsubba.com.np">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_replyto" value="">
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" class="nrs-hidden-field">

      <div class="nrs-form-grid">
        <label for="contact-name">Name</label>
        <input id="contact-name" type="text" name="name" autocomplete="name" minlength="2" required placeholder="Your name">

        <label for="contact-email">Email</label>
        <input id="contact-email" type="email" name="email" autocomplete="email" required placeholder="you@example.com">

        <label for="contact-need">Project type</label>
        <select id="contact-need" name="need" required>
          <option value="">Select a topic</option>
          <option>Product design role</option>
          <option>Freelance UX/UI project</option>
          <option>UX audit</option>
          <option>Design system</option>
          <option>Website redesign</option>
          <option>SaaS dashboard</option>
          <option>Web3 UX</option>
          <option>Other</option>
        </select>

        <label for="contact-timeline">Timeline</label>
        <select id="contact-timeline" name="timeline" required>
          <option value="">Select timeline</option>
          <option>This week</option>
          <option>This month</option>
          <option>1–3 months</option>
          <option>Flexible</option>
        </select>
      </div>

      <label for="contact-message">Product context and current problem</label>
      <textarea id="contact-message" name="message" rows="8" minlength="20" required placeholder="What are you building, who is it for, what is unclear, and where should design help?"></textarea>

      <p class="nrs-form-note" id="contact-privacy-note">Your name, email and project context are used only to deliver and respond to this inquiry. Do not include passwords, payment details or confidential credentials.</p>
      <div class="nrs-form-actions"><button class="btn btn-primary" type="submit">Send project context</button><a class="btn btn-secondary" href="mailto:${email}">Use email instead</a></div>
      <p id="contact-form-status" class="form-status" role="status" aria-live="polite"></p>
    </form>
  </section>

  <section class="nrs-section reveal-on-scroll" aria-labelledby="contact-help">
    <header class="nrs-section-heading"><p class="eyebrow">What helps</p><h2 id="contact-help" class="section-title">Three details improve the first reply.</h2></header>
    <ol class="nrs-editorial-list">
      <li class="nrs-editorial-row"><span class="nrs-row-index">01</span><h3>The product or role</h3><p>What is being designed, improved, audited, hired for or shipped?</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">02</span><h3>The current friction</h3><p>Where are users, stakeholders or engineers getting stuck?</p></li>
      <li class="nrs-editorial-row"><span class="nrs-row-index">03</span><h3>The timing</h3><p>When do you need the first useful design direction, review or production handoff?</p></li>
    </ol>
  </section>

  <section class="nrs-section nrs-section--closing reveal-on-scroll">
    <div><p class="eyebrow">Need proof first?</p><h2 class="section-title">Review the work before starting the conversation.</h2></div>
    <div class="nrs-closing-copy"><p>The case studies and resume provide the fastest overview of my scope and working style.</p><div class="nrs-actions"><a class="btn btn-primary" href="/projects">View selected work</a><a class="btn btn-secondary" href="/assets/resume.pdf" download data-resume-download>Download resume</a></div></div>
  </section>
</main>`;

replaceMain('contact.html', markup, 'nrs-contact-spacious-page');
