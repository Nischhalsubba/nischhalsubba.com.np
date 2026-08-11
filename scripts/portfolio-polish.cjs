/**
 * @fileoverview scripts/portfolio-polish.cjs
 * Purpose: Apply final portfolio contrast, editorial density, About-page enrichment, sticky chrome, and responsive style hardening to the production build.
 * Responsibilities:
 * - Append the approved portfolio polish, responsive-hardening, and sticky-cascade style fragments to `dist/style.css`.
 * - Enrich the generated About page with practical capabilities, process, and fit sections when they are not already present.
 * - Expand the About-page action group with project, contact, and resume links.
 * Execution context: Node.js production-build stage invoked indirectly by `scripts/writing-redesign.cjs`.
 * Connected files:
 * - scripts/writing-redesign.cjs
 * - src/styles/fragments/agent/polish.cssfrag
 * - src/styles/fragments/agent/responsive-hardening.cssfrag
 * - src/styles/fragments/agent/sticky-cascade-lock.cssfrag
 * - dist/about.html
 * - dist/style.css
 * Maintenance: The current style-fragment paths and `.agent-*` selectors are historical compatibility contracts. Migrate them only as a coordinated path/selector change across generators, runtime code, styles, and browser audits.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const styleSources = [
  path.join(root, 'src', 'styles', 'fragments', 'agent', 'polish.cssfrag'),
  path.join(root, 'src', 'styles', 'fragments', 'agent', 'responsive-hardening.cssfrag'),
  path.join(root, 'src', 'styles', 'fragments', 'agent', 'sticky-cascade-lock.cssfrag'),
];
const distStyle = path.join(dist, 'style.css');
const aboutPath = path.join(dist, 'about.html');

const missingStyleSource = styleSources.some(
  /** Callback contract: Check whether one required portfolio style fragment is missing from canonical source. Inputs: `file` - absolute fragment path. Side effects: Reads filesystem state. Returns: `true` when the file does not exist. */
  (file) => !fs.existsSync(file),
);
if (missingStyleSource || !fs.existsSync(distStyle)) {
  throw new Error('[portfolio-polish] style source or production stylesheet is missing');
}

if (fs.existsSync(aboutPath)) {
  let html = fs.readFileSync(aboutPath, 'utf8');

  if (!html.includes('agent-about-process')) {
    const fitItems = ['SaaS dashboards', 'Web3 transaction flows', 'Fintech trust states', 'Mobile product UX', 'Product websites', 'Figma design systems', 'UX audits', 'Developer handoff'];
    const fitMarkup = fitItems.map(
      /** Callback contract: Render one numbered work-type row in the About-page fit list. Inputs: `item` - work type label; `index` - zero-based position. Side effects: None. Returns: HTML for one fit-list item. */
      (item, index) => `<div class="agent-about-fit-item" data-agent-reveal><span>${String(index + 1).padStart(2, '0')}</span><span>${item}</span></div>`,
    ).join('');

    const expansion = `<section class="agent-section agent-section--inverse" aria-labelledby="about-strengths-heading"><div class="agent-frame"><header class="agent-section-head" data-agent-reveal><span class="agent-kicker">What I bring</span><h2 class="agent-section-title" id="about-strengths-heading">Clear first. Polished second. Buildable always.</h2></header><div class="agent-capabilities"><article class="agent-capability" data-agent-reveal><span class="agent-meta">01 · Product clarity</span><div><h3>Clarify the product.</h3><p>Map users, goals, constraints, roles, edge cases, and the decisions the interface actually needs to support before visual polish starts hiding the structural problem.</p></div></article><article class="agent-capability" data-agent-reveal><span class="agent-meta">02 · UX structure</span><div><h3>Structure the journey.</h3><p>Turn messy requirements into navigable flows, states, forms, dashboards, filters, review moments, and confirmation patterns with an obvious hierarchy.</p></div></article><article class="agent-capability" data-agent-reveal><span class="agent-meta">03 · Interface craft</span><div><h3>Give clarity character.</h3><p>Build responsive, high-fidelity UI that feels specific to the product while keeping accessibility, density, state coverage, and real content intact.</p></div></article><article class="agent-capability" data-agent-reveal><span class="agent-meta">04 · Handoff</span><div><h3>Prepare the build.</h3><p>Document components, responsive behavior, interaction states, QA notes, and implementation context so engineering does not have to reverse-engineer design intent.</p></div></article></div></div></section><section class="agent-section" aria-labelledby="about-process-heading"><div class="agent-frame"><header class="agent-section-head" data-agent-reveal><span class="agent-kicker">How I work</span><h2 class="agent-section-title" id="about-process-heading">Four passes. Fewer loose ends.</h2></header><div class="agent-about-process"><article class="agent-about-step" data-agent-reveal><span class="agent-meta">01 · Context</span><div><h3>Product context</h3><p>Start with the goal, users, technical constraints, current friction, evidence, and the decision the product needs to make easier.</p></div></article><article class="agent-about-step" data-agent-reveal><span class="agent-meta">02 · Structure</span><div><h3>Flow + hierarchy</h3><p>Define page structure, screen sequence, content priority, states, permissions, and interaction rules before heavy visual work.</p></div></article><article class="agent-about-step" data-agent-reveal><span class="agent-meta">03 · System</span><div><h3>Interface system</h3><p>Turn the structure into reusable patterns, responsive layouts, polished screens, and a visual language that survives more than one happy path.</p></div></article><article class="agent-about-step" data-agent-reveal><span class="agent-meta">04 · Build</span><div><h3>Review + handoff</h3><p>Prepare states, specs, notes, QA checks, and implementation context, then stay close enough to the build to catch the details that screenshots cannot.</p></div></article></div></div></section><section class="agent-section agent-section--compact" aria-labelledby="about-fit-heading"><div class="agent-frame agent-about-fit"><div class="agent-about-fit-copy" data-agent-reveal><span class="agent-kicker">Best fit</span><h2 id="about-fit-heading">Complex enough to need judgment.</h2><p class="agent-lead">I am most useful when a product has real states, real constraints, and enough moving parts that a component library alone cannot make the decisions.</p></div><div class="agent-about-fit-list" aria-label="Best fit work types">${fitMarkup}</div></div></section>`;

    html = html.replace(
      '<section class="agent-section agent-section--inverse"><div class="agent-frame agent-manifesto">',
      `${expansion}<section class="agent-section agent-section--inverse"><div class="agent-frame agent-manifesto">`,
    );
  }

  html = html.replace(
    '<aside data-agent-reveal><a class="agent-btn" href="/projects">See selected work</a></aside>',
    '<aside data-agent-reveal><div class="agent-actions"><a class="agent-btn" href="/projects">See selected work</a><a class="agent-btn" href="/contact">Discuss a project</a><a class="agent-btn" href="/assets/resume.pdf" data-resume-download>Resume</a></div></aside>',
  );

  fs.writeFileSync(aboutPath, html, 'utf8');
}

for (const styleSource of styleSources) {
  fs.appendFileSync(distStyle, `\n${fs.readFileSync(styleSource, 'utf8')}\n`, 'utf8');
}

console.log('[portfolio-polish] Applied contrast, editorial density, About content, sticky site chrome, and responsive hardening.');
