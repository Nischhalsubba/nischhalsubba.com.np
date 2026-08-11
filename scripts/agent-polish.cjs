/**
 * @fileoverview scripts/agent-polish.cjs
 * Purpose: Apply the agent polish production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - src/styles/fragments/agent/polish.cssfrag
 * - src/styles/fragments/agent/responsive-hardening.cssfrag
 * - src/styles/fragments/agent/sticky-cascade-lock.cssfrag
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
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

if (styleSources.some( /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `file` Side effects: reads filesystem state Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (file) => !fs.existsSync(file)) || !fs.existsSync(distStyle)) {
  throw new Error('[agent-polish] style source or production stylesheet is missing');
}

if (fs.existsSync(aboutPath)) {
  let html = fs.readFileSync(aboutPath, 'utf8');

  if (!html.includes('agent-about-process')) {
    const expansion = `<section class="agent-section agent-section--inverse" aria-labelledby="about-strengths-heading"><div class="agent-frame"><header class="agent-section-head" data-agent-reveal><span class="agent-kicker">What I bring</span><h2 class="agent-section-title" id="about-strengths-heading">Clear first. Polished second. Buildable always.</h2></header><div class="agent-capabilities"><article class="agent-capability" data-agent-reveal><span class="agent-meta">01 · Product clarity</span><div><h3>Clarify the product.</h3><p>Map users, goals, constraints, roles, edge cases, and the decisions the interface actually needs to support before visual polish starts hiding the structural problem.</p></div></article><article class="agent-capability" data-agent-reveal><span class="agent-meta">02 · UX structure</span><div><h3>Structure the journey.</h3><p>Turn messy requirements into navigable flows, states, forms, dashboards, filters, review moments, and confirmation patterns with an obvious hierarchy.</p></div></article><article class="agent-capability" data-agent-reveal><span class="agent-meta">03 · Interface craft</span><div><h3>Give clarity character.</h3><p>Build responsive, high-fidelity UI that feels specific to the product while keeping accessibility, density, state coverage, and real content intact.</p></div></article><article class="agent-capability" data-agent-reveal><span class="agent-meta">04 · Handoff</span><div><h3>Prepare the build.</h3><p>Document components, responsive behavior, interaction states, QA notes, and implementation context so engineering does not have to reverse-engineer design intent.</p></div></article></div></div></section><section class="agent-section" aria-labelledby="about-process-heading"><div class="agent-frame"><header class="agent-section-head" data-agent-reveal><span class="agent-kicker">How I work</span><h2 class="agent-section-title" id="about-process-heading">Four passes. Fewer loose ends.</h2></header><div class="agent-about-process"><article class="agent-about-step" data-agent-reveal><span class="agent-meta">01 · Context</span><div><h3>Product context</h3><p>Start with the goal, users, technical constraints, current friction, evidence, and the decision the product needs to make easier.</p></div></article><article class="agent-about-step" data-agent-reveal><span class="agent-meta">02 · Structure</span><div><h3>Flow + hierarchy</h3><p>Define page structure, screen sequence, content priority, states, permissions, and interaction rules before heavy visual work.</p></div></article><article class="agent-about-step" data-agent-reveal><span class="agent-meta">03 · System</span><div><h3>Interface system</h3><p>Turn the structure into reusable patterns, responsive layouts, polished screens, and a visual language that survives more than one happy path.</p></div></article><article class="agent-about-step" data-agent-reveal><span class="agent-meta">04 · Build</span><div><h3>Review + handoff</h3><p>Prepare states, specs, notes, QA checks, and implementation context, then stay close enough to the build to catch the details that screenshots cannot.</p></div></article></div></div></section><section class="agent-section agent-section--compact" aria-labelledby="about-fit-heading"><div class="agent-frame agent-about-fit"><div class="agent-about-fit-copy" data-agent-reveal><span class="agent-kicker">Best fit</span><h2 id="about-fit-heading">Complex enough to need judgment.</h2><p class="agent-lead">I am most useful when a product has real states, real constraints, and enough moving parts that a component library alone cannot make the decisions.</p></div><div class="agent-about-fit-list" aria-label="Best fit work types">${['SaaS dashboards','Web3 transaction flows','Fintech trust states','Mobile product UX','Product websites','Figma design systems','UX audits','Developer handoff'].map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (item, index) => `<div class="agent-about-fit-item" data-agent-reveal><span>${String(index + 1).padStart(2, '0')}</span><span>${item}</span></div>`).join('')}</div></div></section>`;
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
console.log('[agent-polish] Applied contrast, editorial density, About content, sticky site chrome, and responsive hardening.');
