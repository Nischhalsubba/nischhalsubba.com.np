/**
 * @fileoverview scripts/update-portfolio-content.cjs
 * Purpose: Apply the update portfolio content production transformation or maintenance step while preserving canonical source/build contracts.
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
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { EARLY_THEME_BOOTSTRAP } = require("./early-theme-bootstrap.cjs");

const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/project-data.js"), "utf8"), sandbox);

const projects = sandbox.window.NRS_PROJECTS;

const info = {
  yarsha: ["2024", "Product Designer", "Web3 mobile app", "Mobile users, wallet holders", "Yarsha needed mobile chat, wallet actions, blinks, groups, settings, payments, and AI-bot interactions to feel understandable without making every action feel risky or technical.", "I worked on product UX, high-fidelity mobile UI, prototype structure, and interaction states that help users understand what they are doing before they sign or send anything.", ["Messaging-first Web3 UX", "Wallet and transfer review states", "Clear signing context", "Mobile design system patterns"], "The page uses the project cover and linked Figma resource where available instead of stock crypto imagery."],
  mokshya: ["2024-2025", "Product / Website Designer", "Web3 protocol website", "Developers, protocol users, partners", "Mokshya needed a public website that could explain a technical Web3 protocol with more trust, less jargon, and clearer paths for people who wanted to understand or explore the product.", "I designed the website structure, visual direction, content hierarchy, and responsive sections for a clearer protocol story.", ["Homepage hierarchy", "Protocol/product storytelling", "Developer-facing context", "Responsive website direction"], "Live website context is included where available; the case study avoids claiming private dashboard work that is not shown."],
  "hamro-idea": ["2025", "Brand + Website Designer", "Software studio website", "Prospective clients, founders, local businesses", "Hamro Idea needed a clearer public presence for a Nepal-based software studio, with stronger service hierarchy and a website that could turn visits into enquiries.", "I worked on the brand direction, static multi-page website, service content structure, responsive UI, and technical SEO basics.", ["Brand positioning", "Service-page structure", "Static front-end implementation", "SEO-ready page metadata"], "The case study is framed around actual brand and website work, without invented conversion numbers or testimonials."],
  morajaa: ["2025", "Website UX/UI Designer", "B2B consulting website", "Business owners, procurement teams, consultants", "Morajaa needed a consulting website that could communicate services, sectors, and lead pathways with enough clarity for high-consideration B2B visitors.", "I designed page structure, content hierarchy, visual presentation, and a final Figma prototype for the website experience.", ["Premium service-site structure", "Sector/service page hierarchy", "Guided lead paths", "Figma prototype"], "The Figma prototype link is included as the proof point."],
  "neverwinter-parser": ["2025", "Product Designer + Front-End Builder", "Desktop data tool", "Neverwinter players and analysts", "Raw combat logs are difficult to read during or after play. The tool needed a clearer interface for turning dense encounter data into useful feedback.", "I designed and built the product direction for a Windows desktop tool concept, focusing on readable dashboards, filters, and encounter review.", ["Combat-log readability", "Data-heavy interface layout", "Encounter summaries", "Performance feedback UI"], "The project is described as ongoing or conceptual where appropriate, not as a launched commercial product."],
  orkest: ["2025", "UX Architecture / Product Design", "Modular SaaS platform", "Business teams, operators, admins", "Orkest required a modular product structure that could make several business workflows feel connected without turning the interface into a generic admin template.", "I worked on UX structure and product architecture for modules such as CRM, Sales, Inventory, Finance, and shared workspace areas.", ["CRM, sales, inventory and finance IA", "Shared workspace patterns", "Dashboard hierarchy", "Reusable SaaS flows"], "The page keeps the scope at UX direction and architecture instead of inventing product metrics."],
  splashnode: ["2025", "Website Designer + Front-End Builder", "Digital display platform website", "Platform buyers, content/device managers", "Splashnode needed a website that could explain content, device, and data management capabilities without burying the value under technical language.", "I designed and coded the website experience, translating platform features into clearer sections and calls to action.", ["Technical product explanation", "Website UX", "Responsive front-end", "Capability-to-benefit translation"], "The work is framed as website design and front-end implementation."],
  zapp: ["2024", "Product Designer", "Logistics mobile app", "Customers, drivers, super admins", "Zapp Today needed connected customer, driver, and admin experiences for a delivery product, including booking, tracking, and operational visibility.", "I designed customer and driver app flows from wireframes to final prototype, with supporting dashboard exploration.", ["Customer app flows", "Driver task flows", "Booking and tracking states", "Super admin dashboard exploration"], "The Figma case study and prototype links are included."],
  masteriyo: ["2021-2023", "Design Contributor", "WordPress LMS product", "Course creators, students, admins", "Masteriyo needed product screens for a WordPress LMS experience, covering course creation, learning flows, and admin-facing product states.", "I contributed to the Figma design work as part of a multi-designer product team.", ["Learning-product UI contribution", "Quiz and course workflows", "Admin/student interface patterns", "Team-based Figma work"], "The case study is explicitly framed as a contribution, with the Figma file linked."],
  pihub: ["2024", "Product / App Experience Designer", "Fintech / CreditTech product", "Creditors, investors, admins", "piHub needed fintech workflows where account status, product applications, credit requests, and verification states stayed understandable and trustworthy.", "I worked on app experience and product context across creditor, investor, and admin flows, with attention to labels, states, and risk-sensitive interactions.", ["Creditor, investor and admin flows", "Verification-aware UX", "Product applications and credit requests", "Authenticated app states"], "Creditor, investor, and admin prototype links are included; the page avoids claiming original repository or engineering ownership."],
  "grid-labs": ["2023", "Website / Front-End Designer", "Hosting landing page", "Hosting buyers, small businesses", "Grid Labs Hosting needed a straightforward landing page with the common decision points hosting buyers expect: domain search, services, pricing, trust sections, and contact.", "I created a static Bootstrap-based landing page structure and UI for the hosting service.", ["Domain search UI", "Pricing tabs", "Service cards", "Static Bootstrap build"], "The page presents the work as static front-end and landing-page UI, not as a full hosting platform."],
  "zakra-furniture": ["2022", "WordPress / Elementor Designer", "Furniture starter website", "Furniture shops, WordPress site owners", "Zakra Furniture needed a clean starter website pattern for presenting products, categories, and business information in a WordPress context.", "I designed and built the furniture starter website using Zakra and Elementor patterns.", ["Starter-site layout", "Product presentation sections", "Elementor build", "Reusable business sections"], "The case study is scoped to starter-site design and build work."],
  designerex: ["2021", "Design Contributor", "Luxury fashion marketplace", "Fashion renters, marketplace operators", "Designerex required marketplace interface work where product discovery, listing quality, and premium presentation mattered to the rental experience.", "I contributed design work as part of a broader product design effort.", ["Marketplace UI contribution", "Listing and browsing patterns", "Luxury product presentation", "Team design support"], "The project is intentionally framed as contribution work rather than full ownership."],
  sassboilerplate: ["2020", "Front-End Creator", "Developer workflow toolkit", "Front-end developers", "Static website work needed a repeatable starting point for organizing styles and build workflow instead of recreating the same setup for every small project.", "I created a front-end starter project for faster static website development and cleaner styling organization.", ["Sass structure", "Static website workflow", "Reusable starter setup", "Developer productivity"], "This is presented as a developer workflow project, not as a client product."],
};

/**
 * Function contract: e
 * Purpose: Implement the e responsibility owned by the update portfolio content repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
const e = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/**
 * Function contract: nav
 * Purpose: Implement the nav responsibility owned by the update portfolio content repository tool.
 * Inputs: `active`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
const nav = (active) => `<button class="mobile-nav-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-nav-overlay"><span></span><span></span></button><a href="/" class="mobile-logo">NRS</a><div class="mobile-nav-overlay" id="mobile-nav-overlay"><nav class="mobile-nav-links" aria-label="Mobile navigation"><a href="/"${active === "home" ? ' class="active"' : ""}>Home</a><a href="/projects.html"${active === "work" ? ' class="active"' : ""}>Work</a><a href="/about.html"${active === "about" ? ' class="active"' : ""}>About</a><a href="/blog/">Writing</a><a href="/contact.html"${active === "contact" ? ' class="active"' : ""}>Contact</a></nav></div><button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle Theme"></button><nav class="nav-wrapper" aria-label="Primary navigation"><div class="nav-pill"><div class="nav-glider"></div><a href="/" class="nav-link${active === "home" ? " active" : ""}">Home</a><a href="/projects.html" class="nav-link${active === "work" ? " active" : ""}">Work</a><a href="/about.html" class="nav-link${active === "about" ? " active" : ""}">About</a><a href="/blog/" class="nav-link">Writing</a><a href="/contact.html" class="nav-link${active === "contact" ? " active" : ""}">Contact</a></div></nav>`;
/**
 * Function contract: head
 * Purpose: Implements the head responsibility for this module.
 * Inputs: { title, description, canonical, image = "/assets/images/portrait.png", type = "website" }.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: head
 * Purpose: Implement the head responsibility owned by the update portfolio content repository tool.
 * Inputs: `{ title, description, canonical, image = "/assets/images/portrait.png", type = "website" }`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
const head = ({ title, description, canonical, image = "/assets/images/portrait.png", type = "website" }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${e(title)}</title>
    <meta name="description" content="${e(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://nischhalsubba.com.np/${canonical}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${e(title)}" />
    <meta property="og:description" content="${e(description)}" />
    <meta property="og:image" content="https://nischhalsubba.com.np${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    ${EARLY_THEME_BOOTSTRAP}
    <link rel="stylesheet" href="/style.css?v=21.0" />
  </head>`;
const footer = `<footer class="site-footer"><div class="container"><div class="footer-top-grid"><div class="footer-cta"><h2>Available for<br>product design<br><span style="font-style:italic;">roles and projects.</span></h2><p>I help teams clarify product flows, ship polished interfaces, document systems, and hand off work engineers can build.</p><a href="mailto:hinischalsubba@gmail.com" class="footer-email-btn">hinischalsubba@gmail.com</a></div><div class="footer-nav-grid"><div class="footer-col"><h5>Pages</h5><a href="/">Home</a><a href="/projects.html">Work</a><a href="/about.html">About</a><a href="/blog/">Writing</a><a href="/contact.html">Contact</a></div><div class="footer-col"><h5>Proof</h5><a href="https://www.behance.net/nischhal" target="_blank" rel="noopener">Behance</a><a href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener">Uxcel</a><a href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener">LinkedIn</a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Resume</a></div></div></div><div class="footer-bottom-bar"><span>(c) 2026 Nischhal Raj Subba.</span></div></div></footer>`;
const script = `<script type="module" src="/script.js?v=21.0"></script>`;

/**
 * Function contract: card
 * Purpose: Implements the card responsibility for this module.
 * Inputs: project.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: card
 * Purpose: Implement the card responsibility owned by the update portfolio content repository tool.
 * Inputs: `project`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function card(project) {
  const details = info[project.id] || [];
  return `<a href="/${project.href}" class="project-card reveal-on-scroll" data-category="${e(project.category)}"><div class="card-media-wrap"><img src="/${project.thumbnail}" alt="${e(project.alt)}" loading="lazy" decoding="async"></div><div class="card-content"><span class="eyebrow">${e(project.meta[0])}</span><h3>${e(project.title)}</h3><div class="card-meta-line"><span>${e(project.meta[1] || details[1] || "Product design")}</span><span>${e(details[0] || "")}</span></div><p class="card-summary">${e(project.summary)}</p></div></a>`;
}

/**
 * Function contract: focusText
 * Purpose: Implements the focus text responsibility for this module.
 * Inputs: item.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: focusText
 * Purpose: Implement the focus text responsibility owned by the update portfolio content repository tool.
 * Inputs: `item`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function focusText(item) {
  const text = String(item).toLowerCase();
  if (text.includes("prototype") || text.includes("figma")) return "Turned the idea into a reviewable flow so decisions could be tested, shared, and discussed with less ambiguity.";
  if (text.includes("handoff") || text.includes("system") || text.includes("component")) return "Kept patterns reusable and documented enough for implementation instead of treating each screen as a one-off visual.";
  if (text.includes("verification") || text.includes("trust") || text.includes("wallet") || text.includes("signing")) return "Made risk, status, and next actions easier to understand before users committed to an action.";
  if (text.includes("website") || text.includes("seo") || text.includes("service") || text.includes("landing")) return "Structured content and sections so visitors could understand the offer, compare options, and move toward contact.";
  if (text.includes("dashboard") || text.includes("data") || text.includes("workflow")) return "Organized dense product information into clearer states, priorities, and repeatable interaction patterns.";
  return "Shaped the product experience around clearer hierarchy, practical UI decisions, and fewer ambiguous next steps.";
}

/**
 * Function contract: processItems
 * Purpose: Implements the process items responsibility for this module.
 * Inputs: project, details.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: processItems
 * Purpose: Implement the process items responsibility owned by the update portfolio content repository tool.
 * Inputs: `project`: input consumed by this operation; `details`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Array containing the values selected or transformed by this function.
 */
function processItems(project, details) {
  return [
    ["Understand", `Mapped the product context, primary users, and domain risks for ${project.title} before shaping interface details.`],
    ["Structure", `Organized the core flows around ${details[6].slice(0, 2).join(" and ").toLowerCase()} so the page could explain the work without overclaiming impact.`],
    ["Prototype", "Used high-fidelity screens, linked resources, or scoped visual assets to make the design decisions reviewable."],
    ["Handoff", "Prepared the work around reusable patterns, states, and practical implementation notes for engineering or stakeholder review."],
  ];
}

/**
 * Function contract: page
 * Purpose: Implements the page responsibility for this module.
 * Inputs: name, html.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: page
 * Purpose: Implement the page responsibility owned by the update portfolio content repository tool.
 * Inputs: `name`: stable identifier or label for the current item; `html`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function page(name, html) {
  fs.writeFileSync(path.join(root, name), `${html}\n`, "utf8");
}

const selected = ["yarsha", "mokshya", "hamro-idea", "pihub", "zapp", "morajaa"]
  .map(/** Callback contract: Processes the callback step for ["yarsha", "mokshya", "hamro idea", "pihub", "zapp", "morajaa"] without leaking orchestration details to the caller. Inputs: id. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `id`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `id`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (id) => projects.find(/** Callback contract: Processes the callback step for projects without leaking orchestration details to the caller. Inputs: project. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `project`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `project`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (project) => project.id === id))
  .filter(Boolean);

const indexHtml = `${head({ title: "Nischhal Raj Subba | Senior UI/Product Designer", description: "Senior UI/Product Designer from Nepal helping teams design clearer mobile apps, SaaS products, Web3 flows, websites, dashboards, and design systems.", canonical: "", image: "/assets/images/portrait.png" }).replace("https://nischhalsubba.com.np/assets/images/portrait.png", "https://i.imgur.com/oFHdPUS.png")}
  <body>
    ${nav("home")}
    <main class="container">
      <section class="hero-section center-aligned-hero nrs-home-hero" style="min-height:auto;padding-top:160px;padding-bottom:80px;">
        <p class="eyebrow reveal-on-scroll" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;margin-bottom:22px;">Senior UI/Product Designer - Nepal / Remote</p>
        <h1 class="hero-title reveal-on-scroll" style="max-width:1020px;margin-left:auto;margin-right:auto;">I design product interfaces that make complex flows easier to understand, trust, and ship.</h1>
        <p class="body-large reveal-on-scroll" style="margin:28px auto 0;max-width:820px;">Senior UI/Product Designer with 6+ years across mobile apps, SaaS dashboards, Web3, fintech, service websites, and design systems. I help teams turn messy requirements into clear flows, polished UI, prototypes, and implementation-ready handoff.</p>
        <div class="hero-actions reveal-on-scroll cta-group" style="margin-top:40px;justify-content:center;"><a href="/projects.html" class="btn btn-primary">View selected work</a><a href="/assets/resume.pdf" class="btn btn-secondary" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download resume</a></div>
        <img src="/assets/images/portrait.png" alt="Nischhal Raj Subba, Product Designer" class="hero-portrait-img reveal-on-scroll" style="display:block;width:min(420px,82vw);height:auto;margin:48px auto 0;filter:drop-shadow(0 36px 90px rgba(0,0,0,.35));" width="900" height="900" loading="eager" />
      </section>
      <section class="section-container reveal-on-scroll" style="padding-top:36px;"><div class="impact-summary-grid" aria-label="Quick proof"><article class="impact-card"><span class="eyebrow">Experience</span><h3>6+ years</h3><p>Product teams, agencies, Web3, fintech, SaaS, WordPress product work, service websites, and front-end collaboration.</p></article><article class="impact-card"><span class="eyebrow">What I improve</span><h3>Flows + UI</h3><p>Onboarding, dashboards, transaction review, forms, verification, service pages, mobile app journeys, and design systems.</p></article><article class="impact-card"><span class="eyebrow">Handoff</span><h3>Build-ready</h3><p>State-complete Figma files, responsive decisions, UI QA, and notes engineers can use without guessing intent.</p></article></div></section>
      <section class="section-container" aria-labelledby="selected-work-heading"><div style="display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:34px;" class="reveal-on-scroll"><div><p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Selected work</p><h2 id="selected-work-heading" class="section-title" style="margin-bottom:0;">Real projects with visible product thinking.</h2></div><a href="/projects.html" class="btn btn-secondary">All work</a></div><div class="project-grid">${selected.map(card).join("")}</div></section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);border-bottom:1px solid var(--border-faint);"><div style="max-width:900px;margin:0 auto;text-align:center;"><p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">How I help</p><h2 class="section-title">Product work that is clear before it is beautiful.</h2><p class="section-lead" style="margin:18px auto 0;">I clarify user journeys, hierarchy, language, interaction states, and responsive behavior first, then push the UI until it feels polished enough for a portfolio and practical enough for engineering.</p></div></section>
      <section class="section-container reveal-on-scroll" style="text-align:center;padding-bottom:110px;"><h2 class="section-title">Hiring a product designer?</h2><p class="body-large" style="margin:16px auto 30px;max-width:720px;">Send the role, product, timeline, and the problem you need solved. I will reply with fit, availability, and the most useful next step.</p><a href="/contact.html" class="btn btn-primary">Start a conversation</a></section>
    </main>
    <a href="/assets/resume.pdf" class="floating-resume-btn" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download aria-label="Download Resume"><span class="btn-text">Download Resume</span></a>
    ${footer}
    ${script}
  </body>
</html>`;
page("index.html", indexHtml);
page("home-v2.html", indexHtml.replace('href="https://nischhalsubba.com.np/"', 'href="https://nischhalsubba.com.np/home-v2.html"'));

page("projects.html", `${head({ title: "Selected Product Design Work | Nischhal Raj Subba", description: "Product design case studies by Nischhal Raj Subba across mobile apps, Web3, fintech, SaaS, websites, marketplaces, WordPress, and front-end tools.", canonical: "projects.html", image: "/assets/images/project-yarsha-cover.svg" })}
  <body>
    ${nav("work")}
    <main class="container">
      <section class="hero-section" style="min-height:auto;padding-top:150px;padding-bottom:62px;align-items:flex-start;text-align:left;"><p class="eyebrow reveal-on-scroll" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Selected work</p><h1 class="hero-title reveal-on-scroll" style="max-width:980px;">Selected work for teams hiring a product designer.</h1><p class="body-large reveal-on-scroll" style="max-width:840px;color:var(--text-secondary);">A focused archive of real product, website, and interface work across mobile apps, SaaS, Web3, fintech, and service businesses. Each case study shows honest scope, available proof, and the design decisions I can discuss in an interview.</p></section>
      <section class="section-container" style="padding-top:0;"><div class="work-controls reveal-on-scroll" style="margin-bottom:34px;"><div class="filter-row" role="group" aria-label="Filter projects by domain"><button class="filter-btn active" type="button" data-filter="all">All</button><button class="filter-btn" type="button" data-filter="web3">Web3</button><button class="filter-btn" type="button" data-filter="fintech">Fintech</button><button class="filter-btn" type="button" data-filter="saas">SaaS</button><button class="filter-btn" type="button" data-filter="mobile">Mobile</button><button class="filter-btn" type="button" data-filter="website">Websites</button><button class="filter-btn" type="button" data-filter="frontend">Front-end</button></div><div class="search-wrapper" style="margin-top:18px;max-width:520px;"><label class="sr-only" for="search-work">Search projects</label><input type="search" id="search-work" class="search-input" placeholder="Search projects, domains, or tools..." aria-label="Search projects" /><button id="clear-work" class="btn btn-secondary" type="button" style="margin-top:12px;">Clear search</button></div></div><div class="project-grid">${projects.map(card).join("")}</div></section>
      <section class="section-container reveal-on-scroll" style="text-align:center;border-top:1px solid var(--border-faint);"><h2 class="section-title">Want the deeper walkthrough?</h2><p class="section-lead" style="margin:14px auto 28px;">I can walk through role, constraints, flows, design decisions, prototype links, and handoff details in an interview or project call.</p><a href="/contact.html" class="btn btn-primary">Get in touch</a></section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`);

page("contact.html", `${head({ title: "Hire Nischhal Raj Subba | Product Designer", description: "Contact Nischhal Raj Subba for product design roles, freelance UX/UI, mobile app design, SaaS dashboards, Web3 UX, fintech workflows, design systems, and website UX.", canonical: "contact.html", image: "/assets/images/portrait.png" })}
  <body>
    ${nav("contact")}
    <main class="container">
      <section class="hero-section" style="min-height:auto;padding-top:150px;padding-bottom:62px;align-items:flex-start;text-align:left;"><p class="eyebrow reveal-on-scroll" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Hire me</p><h1 class="hero-title reveal-on-scroll" style="max-width:980px;">Need a product designer who can clarify the product and ship clean UI?</h1><p class="body-large reveal-on-scroll" style="max-width:820px;color:var(--text-secondary);">Send the role, product, timeline, and the design problem you need solved. I am available for product design roles, contract UX/UI work, audits, design systems, mobile app flows, SaaS dashboards, Web3 UX, fintech interfaces, and website redesigns.</p></section>
      <section class="section-container" style="padding-top:0;"><div class="impact-summary-grid"><a class="impact-card" href="mailto:hinischalsubba@gmail.com"><span class="eyebrow">Email</span><h3>hinischalsubba@gmail.com</h3><p>Best for roles, freelance projects, design audits, and product conversations.</p></a><a class="impact-card" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span class="eyebrow">Resume</span><h3>Download PDF</h3><p>Experience, selected work, skills, and contact details in one file.</p></a><a class="impact-card" href="https://linkedin.com/in/nischhal/" target="_blank" rel="noopener"><span class="eyebrow">LinkedIn</span><h3>Connect professionally</h3><p>For hiring teams, recruiters, founders, and product leaders.</p></a></div></section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><div class="section-header" style="margin-bottom:28px;"><p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.12em;">Contact form</p><h2 class="section-title" style="margin-bottom:14px;">Send the useful context first.</h2><p class="section-lead">Use this form for hiring, freelance work, UX audits, portfolio questions, and product design collaborations.</p></div><form id="contact-form" class="contact-form" action="https://formsubmit.co/hinischalsubba@gmail.com" method="POST"><input type="hidden" name="_subject" value="Portfolio inquiry from nischhalsubba.com.np" /><input type="hidden" name="_template" value="table" /><input type="hidden" name="_captcha" value="false" /><input type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;" /><div class="form-grid"><label class="form-field">Name<input type="text" name="name" autocomplete="name" required placeholder="Your name" /></label><label class="form-field">Email<input type="email" name="email" autocomplete="email" required placeholder="you@example.com" /></label></div><label class="form-field">What do you need help with?<select name="need" required><option value="">Select a topic</option><option>Product design role</option><option>Freelance UX/UI project</option><option>UX audit</option><option>Design system</option><option>Website redesign</option><option>Other</option></select></label><label class="form-field">Message<textarea name="message" rows="7" required placeholder="Tell me about the role or product, users, timeline, current problem, and where you need design help."></textarea></label><div class="form-actions"><button class="btn btn-primary" type="submit">Submit message</button><a class="btn btn-secondary" href="mailto:hinischalsubba@gmail.com">Use email instead</a></div><p id="contact-form-status" class="form-status" role="status" aria-live="polite"></p><p class="form-note">The form sends through FormSubmit to my email without leaving this page. If your network blocks it, use the email button.</p></form></section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><h2 class="section-title">What to send</h2><div class="writing-list" style="margin-top:28px;"><div class="writing-item"><span class="w-date">Role</span><div class="w-info"><span class="w-title">Full-time, contract, or freelance?</span><span class="w-summary">Share the role type, location expectations, timeline, and hiring process.</span></div></div><div class="writing-item"><span class="w-date">Product</span><div class="w-info"><span class="w-title">What are you building?</span><span class="w-summary">Send the product, audience, current stage, and the main design problem.</span></div></div><div class="writing-item"><span class="w-date">Need</span><div class="w-info"><span class="w-title">Where should I help?</span><span class="w-summary">UX structure, UI polish, design system, prototype, handoff, QA, or website redesign.</span></div></div></div></section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`);

page("about.html", `${head({ title: "About Nischhal Raj Subba | Product Designer in Nepal", description: "About Nischhal Raj Subba, a Nepal-based product designer focused on UX/UI, design systems, Web3 onboarding, fintech interfaces, SaaS dashboards, and front-end-aware handoff.", canonical: "about.html", image: "/assets/images/portrait.png" })}
  <body>
    ${nav("about")}
    <main class="container">
      <section class="hero-section" style="min-height:auto;padding-top:150px;padding-bottom:62px;align-items:flex-start;text-align:left;"><p class="eyebrow reveal-on-scroll" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">About</p><h1 class="hero-title reveal-on-scroll" style="max-width:980px;">Product designer with a practical eye for systems, edge cases, and implementation.</h1><p class="body-large reveal-on-scroll" style="max-width:840px;color:var(--text-secondary);">I combine product UX, visual craft, business context, and front-end awareness so teams can move from unclear requirements to screens that are easier to review, build, and improve.</p></section>
      <section class="section-container" style="padding-top:0;"><div class="about-grid reveal-on-scroll"><div class="about-bio"><h2 class="section-title">How I work</h2><p class="body-large">I start by understanding the product, users, business constraints, and the decisions the interface needs to support. Then I map flows, states, hierarchy, and content before pushing visual polish.</p><p class="body-large">My resume shows a path from client-facing UX work into product systems: Gurzu and Diagonal Softwares for early UX foundations, ThemeGrill and ESR Tech for reusable UI and dashboards, Tegzy for design-system scale, Mokshya for Web3 product flows, and Idealaya for enterprise web software.</p><p class="body-large">That mix helps me move comfortably between strategy and production. I can design a new app flow, clean up an existing dashboard, shape a website direction, document a small design system, or work closely with developers during implementation.</p><div class="about-story-grid" aria-label="Product design strengths"><div class="story-card"><span class="eyebrow">UX</span><h3>Flows and states</h3><p>Onboarding, authenticated states, dashboards, transaction review, forms, verification, and operational workflows.</p></div><div class="story-card"><span class="eyebrow">UI</span><h3>High-fidelity craft</h3><p>Original visual direction, mobile UI, responsive layouts, component reuse, and production-ready screens.</p></div><div class="story-card"><span class="eyebrow">Systems</span><h3>Reusable decisions</h3><p>Design systems, component patterns, scalable consistency, interaction rules, and maintainable design files.</p></div><div class="story-card"><span class="eyebrow">Build</span><h3>Front-end-aware handoff</h3><p>Implementation-ready specs, design QA, build reviews, and PM/engineering alignment.</p></div></div></div></div></section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><h2 class="section-title">Resume highlights</h2><div class="impact-summary-grid" style="margin-top:34px;"><article class="impact-card"><span class="eyebrow">Education</span><h3>Business + design</h3><p>BA (Hons) Business Management from the University of Wolverhampton, 2014-2018. The business foundation supports research, planning, communication, and product execution.</p></article><article class="impact-card"><span class="eyebrow">Recognition</span><h3>Uxcel ranked</h3><p>Ranked #1 Designer and #1 Product Designer in Uxcel Global Rankings 2024, plus Top 10 Product Designer in 2023.</p></article><article class="impact-card"><span class="eyebrow">Certifications</span><h3>5 Uxcel certs</h3><p>UI Designer, Product Designer, UX Designer, UX Writer, and UX Researcher certifications from Uxcel.</p></article></div></section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><h2 class="section-title">Projects from the resume</h2><div class="writing-list" style="margin-top:28px;"><div class="writing-item"><span class="w-date">2025</span><div class="w-info"><span class="w-title">Enterprise data integration platform</span><span class="w-summary">Workflow-heavy UX for data integration and automation, including navigation, tables, panels, system states, prototypes, and UI specifications.</span></div></div><div class="writing-item"><span class="w-date">2024-2025</span><div class="w-info"><span class="w-title">Yarsha - Web3 chat and transfers</span><span class="w-summary">Messaging and transfer flows under Web3 constraints, including wallet connection, trust, permission guidance, and store-readiness UX.</span></div></div><div class="writing-item"><span class="w-date">2025</span><div class="w-info"><span class="w-title">Morajaa - consulting website and lead flow</span><span class="w-summary">Reusable service and sector page architecture, segmented contact flow, and procurement-focused microcopy.</span></div></div><div class="writing-item"><span class="w-date">2020-2021</span><div class="w-info"><span class="w-title">Zapp Today - delivery and scheduling app</span><span class="w-summary">End-to-end iOS and Android mobile UX/UI, wireframes to final UI, research, personas, and scheduled delivery flows.</span></div></div></div></section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><h2 class="section-title">Experience focus</h2><div class="writing-list" style="margin-top:34px;"><div class="writing-item"><span class="w-date">Now</span><div class="w-info"><span class="w-title">Product design, UX/UI, and design systems</span><span class="w-summary">Available for senior design roles, contract projects, audits, prototypes, and website/product redesigns.</span></div></div><div class="writing-item"><span class="w-date">Recent</span><div class="w-info"><span class="w-title">Web3, fintech, SaaS, and websites</span><span class="w-summary">Work includes Yarsha, Mokshya, piHub, Zapp Today, Hamro Idea, Morajaa, and other product/website projects.</span></div></div><div class="writing-item"><span class="w-date">Base</span><div class="w-info"><span class="w-title">Agency and product-team background</span><span class="w-summary">Experience across fast-moving project work, WordPress/product ecosystems, dashboards, marketplaces, and front-end collaboration.</span></div></div></div></section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`);

/**
 * Function contract: projectPage
 * Purpose: Implements the project page responsibility for this module.
 * Inputs: project, index.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: projectPage
 * Purpose: Implement the project page responsibility owned by the update portfolio content repository tool.
 * Inputs: `project`: input consumed by this operation; `index`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function projectPage(project, index) {
  const details = info[project.id] || ["", project.meta[1], project.meta[0], "Product users and internal teams", project.summary, "I worked on product design direction, interface structure, and UX decisions for this project.", project.meta, "The project page uses actual portfolio assets and avoids invented metrics, awards, or testimonials."];
  const links = project.links || [];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const linkCards = links.length
    ? links.map(/** Callback contract: Processes the callback step for links without leaking orchestration details to the caller. Inputs: link. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (link) => `<a class="prototype-link-card" href="${e(link.url)}" target="_blank" rel="noopener noreferrer" style="padding:22px;border:1px solid var(--border-faint);border-radius:18px;background:var(--bg-surface);"><span style="display:block;font-weight:700;">${e(link.label)}</span><span style="color:var(--text-secondary);font-size:.92rem;">Open ${e(link.type || "resource")}</span></a>`).join("")
    : `<div class="case-callout">No public prototype link is attached to this project yet. I can walk through the available file or context during a hiring conversation.</div>`;
  const embeds = links.length
    ? links.map(/** Callback contract: Processes the callback step for links without leaking orchestration details to the caller. Inputs: link. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (link) => `<div class="embed-frame-wrapper" style="margin-top:28px;border-radius:20px;overflow:hidden;border:1px solid var(--border-faint);background:var(--bg-surface);"><div style="padding:14px 18px;border-bottom:1px solid var(--border-faint);font-weight:700;">${e(link.label)}</div><iframe src="${e(link.url)}" width="100%" height="620" style="border:0;" allowfullscreen loading="eager"></iframe></div>`).join("")
    : "";
  return `${head({ title: `${project.title} Case Study | Nischhal Raj Subba`, description: project.summary, canonical: project.href, image: "/" + project.thumbnail, type: "article" })}
  <body>
    ${nav("work")}
    <main class="container">
      <section class="hero-section" style="padding-bottom:36px;min-height:auto;align-items:flex-start;text-align:left;"><a href="/projects.html" style="margin-bottom:28px;color:var(--text-secondary);display:inline-block;">&larr; Back to Work</a><div class="case-meta-chips" style="display:flex;gap:12px;margin-bottom:22px;flex-wrap:wrap;"><span class="badge-pill">${e(details[2])}</span><span class="badge-pill">${e(details[1])}</span><span class="badge-pill">${e(details[0])}</span></div><h1 class="hero-title" style="margin-bottom:14px;">${e(project.title)}</h1><p class="body-large" style="color:var(--text-secondary);max-width:860px;">${e(project.summary)}</p><div class="hero-actions" style="margin-top:28px;"><a href="#proof" class="btn btn-primary">View proof and resources</a><a href="/contact.html" class="btn btn-secondary">Discuss this work</a></div></section>
      <div class="case-hero-img-container reveal-on-scroll" style="margin-bottom:56px;"><img src="/${project.thumbnail}" class="case-hero-img" alt="${e(project.alt)}" style="width:100%;border-radius:16px;border:1px solid var(--border-faint);" loading="eager" /></div>
      <section class="section-container"><div class="snapshot-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:28px;"><div><h5 style="color:var(--text-tertiary);margin-bottom:8px;text-transform:uppercase;">Role</h5><p>${e(details[1])}</p></div><div><h5 style="color:var(--text-tertiary);margin-bottom:8px;text-transform:uppercase;">Domain</h5><p>${e(details[2])}</p></div><div><h5 style="color:var(--text-tertiary);margin-bottom:8px;text-transform:uppercase;">Users</h5><p>${e(details[3])}</p></div></div></section>
      <section class="section-container reveal-on-scroll"><div class="case-label">PRODUCT CONTEXT</div><h2 class="section-title" style="font-size:2rem;margin-bottom:20px;">What needed to be made clearer</h2><p class="body-large" style="color:var(--text-secondary);max-width:860px;">${e(details[4])}</p></section>
      <section class="section-container reveal-on-scroll"><h2 class="section-title" style="font-size:2rem;margin-bottom:20px;">My role</h2><p class="body-large" style="color:var(--text-secondary);max-width:860px;">${e(details[5])}</p><div class="journey-grid" style="margin-top:28px;">${details[6].map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item`, `itemIndex`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (item, itemIndex) => `<div class="journey-card"><span class="eyebrow">Focus ${itemIndex + 1}</span><h3>${e(item)}</h3><p>${e(focusText(item))}</p></div>`).join("")}</div></section>
      <section class="section-container reveal-on-scroll"><div class="case-label">DESIGN DECISIONS</div><h2 class="section-title" style="font-size:2rem;margin-bottom:20px;">How I approached the work</h2><div class="journey-grid">${processItems(project, details).map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[title, text]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([title, text]) => `<div class="journey-card"><span class="eyebrow">Decision</span><h3>${e(title)}</h3><p>${e(text)}</p></div>`).join("")}</div></section>
      <section class="section-container reveal-on-scroll"><div class="case-label">OUTCOME</div><h2 class="section-title" style="font-size:2rem;margin-bottom:20px;">What the design made easier</h2><ul class="case-list"><li>Clearer entry points for the main user roles and use cases.</li><li>More explicit labels, hierarchy, and state language around important actions.</li><li>Reusable UI decisions that can scale beyond one screen.</li><li>A stronger hiring walkthrough because scope, artifacts, and constraints are visible.</li></ul></section>
      <section id="proof" class="section-container reveal-on-scroll"><div class="section-header" style="margin-bottom:28px;"><p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.12em;">Proof</p><h2 class="section-title" style="margin-bottom:14px;">Project image and resources</h2><p class="section-lead">${e(details[7])}</p></div><div class="prototype-link-list" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:18px;">${linkCards}</div>${embeds}</section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><h2 class="section-title">What I would discuss in an interview</h2><ul class="case-list"><li>Product context, user roles, and constraints.</li><li>Flow decisions, screen states, and content hierarchy.</li><li>How design assets were prepared for handoff or implementation.</li><li>What I would measure next if the team wanted stronger product evidence.</li></ul><p class="case-callout">This page uses available project assets, linked resources, and clearly scoped contribution notes instead of invented impact numbers or stock imagery.</p></section>
      <section class="section-container reveal-on-scroll" style="border-top:1px solid var(--border-faint);"><div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;"><a href="/${prev.href}" class="btn btn-secondary">Previous: ${e(prev.title)}</a><a href="/${next.href}" class="btn btn-secondary">Next: ${e(next.title)}</a></div></section>
    </main>
    ${footer}
    ${script}
  </body>
</html>`;
}

projects.forEach(/** Callback contract: Processes the callback step for projects without leaking orchestration details to the caller. Inputs: project, index. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `project`, `index`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `project`, `index`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (project, index) => page(project.href, projectPage(project, index)));

page("products.html", `${head({ title: "Products Removed | Nischhal Raj Subba", description: "This page no longer lists digital products. Visit the work page for real product design case studies and portfolio projects by Nischhal Raj Subba.", canonical: "products.html", image: "/assets/images/portrait.png" })}
  <body>
    ${nav("work")}
    <main class="container"><section class="hero-section" style="min-height:auto;padding-top:160px;padding-bottom:90px;align-items:flex-start;text-align:left;"><p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">No products for sale</p><h1 class="hero-title" style="max-width:900px;">I removed the old product catalog.</h1><p class="body-large" style="max-width:760px;color:var(--text-secondary);">This website is now focused on real product design work, case studies, prototype links, and hiring information. The previous product cards are no longer part of the portfolio.</p><div class="hero-actions" style="margin-top:32px;"><a href="/projects.html" class="btn btn-primary">View real work</a><a href="/contact.html" class="btn btn-secondary">Hire me</a></div></section></main>
    ${footer}
    ${script}
  </body>
</html>`);

["project-detail.html", "project-archive.html", "project-jeweltrek.html"].forEach(/** Callback contract: Processes the callback step for ["project detail.html", "project archive.html", "project jeweltrek.html"] without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `name`. Side effects: no direct external side effect beyond invoked dependencies. Returns: undefined; callback is side-effect-only. */ (name) => {
  page(name, `${head({ title: "Work Archive | Nischhal Raj Subba", description: "This legacy page has been replaced by the current product design work archive.", canonical: "projects.html", image: "/assets/images/portrait.png" })}<body>${nav("work")}<main class="container"><section class="hero-section" style="min-height:auto;padding-top:160px;padding-bottom:90px;align-items:flex-start;text-align:left;"><p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Legacy page</p><h1 class="hero-title">This page has moved.</h1><p class="body-large" style="max-width:760px;color:var(--text-secondary);">I removed the older case-study content because it mixed outdated and placeholder material. The current work archive has the real, scoped project pages.</p><div class="hero-actions" style="margin-top:32px;"><a href="/projects.html" class="btn btn-primary">Go to current work</a></div></section></main>${footer}${script}</body></html>`);
});
