/**
 * @fileoverview scripts/ensure-flagship-case-study-proof-v27.cjs
 * Purpose: Prioritize the portfolio's strongest hiring evidence across complex SaaS, fintech, and design-to-engineering systems.
 * Responsibilities:
 * - Add a focused flagship-proof section to the Work archive.
 * - Add evidence-specific inspection guidance to the Orkest and piHub case studies.
 * - Link DesignOps Orchestrator as independently inspectable public systems work without conflating it with client-project evidence.
 * - Keep the transform idempotent across canonical source generation and production output.
 * Execution context: Node.js CLI during source generation and production build.
 * Connected files:
 * - scripts/generate-source.cjs
 * - scripts/build-dist.cjs
 * - assets/js/project-data.js
 * Maintenance: Keep claims evidence-bounded. Do not add business metrics or ownership claims that are not supported by public artifacts or recorded project scope.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const startMarker = '<!-- nrs-flagship-proof:start -->';
const endMarker = '<!-- nrs-flagship-proof:end -->';

const designOpsUrl = 'https://github.com/Nischhalsubba/design-ops-orchestrator';
const pihubCreditor = 'https://embed.figma.com/proto/HILxD1DKnfALKo4Q5L1IfE/Pihub?node-id=2-8777&p=f&viewport=396%2C301%2C0.12&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share';
const pihubInvestor = 'https://embed.figma.com/proto/HILxD1DKnfALKo4Q5L1IfE/Pihub?node-id=2-36&viewport=227%2C-238%2C0.53&scaling=min-zoom&content-scaling=fixed&page-id=1%3A2&embed-host=share';
const pihubAdmin = 'https://embed.figma.com/proto/HILxD1DKnfALKo4Q5L1IfE/Pihub?node-id=2-2821&p=f&viewport=25%2C237%2C0.12&scaling=min-zoom&content-scaling=fixed&page-id=1%3A3&embed-host=share';

const proofGridStyle = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:16px;width:100%;margin-top:clamp(30px,4vw,52px);';

/**
 * Function contract: readPage
 * Purpose: Read one required portfolio page from the selected source or production-output base directory.
 * Inputs: `name`
 * Side effects: Reads filesystem state and throws when the required page is absent.
 * Returns: The resolved file path and UTF-8 HTML content.
 */
function readPage(name) {
  const file = path.join(base, name);
  if (!fs.existsSync(file)) throw new Error(`[flagship-proof] Missing required page: ${file}`);
  return { file, html: fs.readFileSync(file, 'utf8') };
}

/**
 * Function contract: removeExisting
 * Purpose: Remove a previously generated flagship-proof block so repeated executions remain deterministic.
 * Inputs: `html`
 * Side effects: No external side effects; throws when marker structure is malformed.
 * Returns: HTML with all prior flagship-proof blocks removed.
 */
function removeExisting(html) {
  let next = html;
  while (next.includes(startMarker)) {
    const start = next.indexOf(startMarker);
    const end = next.indexOf(endMarker, start);
    if (end < 0) throw new Error('[flagship-proof] Found start marker without end marker.');
    next = `${next.slice(0, start)}${next.slice(end + endMarker.length)}`;
  }
  return next;
}

/**
 * Function contract: insertAfterLead
 * Purpose: Place the generated proof block immediately after the page's first lead header or section inside main content.
 * Inputs: `html`, `block`
 * Side effects: No external side effects; throws when the page lacks a usable main-content insertion point.
 * Returns: HTML with the proof block inserted near the page lead.
 */
function insertAfterLead(html, block) {
  const mainStart = html.search(/<main\b/i);
  if (mainStart < 0) throw new Error('[flagship-proof] Page is missing <main>.');
  const headerEnd = html.indexOf('</header>', mainStart);
  const sectionEnd = html.indexOf('</section>', mainStart);
  const candidates = [headerEnd >= 0 ? headerEnd + 9 : -1, sectionEnd >= 0 ? sectionEnd + 10 : -1].filter((value) => value >= 0);
  if (!candidates.length) throw new Error('[flagship-proof] Could not locate a lead section/header insertion point.');
  const point = Math.min(...candidates);
  return `${html.slice(0, point)}${block}${html.slice(point)}`;
}

/**
 * Function contract: identity
 * Purpose: Keep structured professional identity on the targeted routes aligned with the current Senior Product Designer positioning.
 * Inputs: `html`
 * Side effects: No external side effects.
 * Returns: HTML with legacy Product Designer structured-data job titles normalized where present.
 */
function identity(html) {
  return html
    .replaceAll('"jobTitle":"Product Designer"', '"jobTitle":"Senior Product Designer"')
    .replaceAll('"jobTitle": "Product Designer"', '"jobTitle": "Senior Product Designer"');
}

/**
 * Function contract: proofCard
 * Purpose: Render one inspectable flagship evidence card with separated copy and action so links remain readable at narrow widths.
 * Inputs: `{ href, kicker, title, text, detail, external, action }`
 * Side effects: No external side effects.
 * Returns: HTML for one internal or external evidence card.
 */
function proofCard({ href, kicker, title, text, detail, external = false, action = 'Inspect evidence' }) {
  const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<article style="display:grid;gap:13px;align-content:start;min-width:0;padding:clamp(22px,3vw,34px);border:1px solid var(--border-faint);border-radius:16px;background:var(--bg-surface-1,transparent);"><span class="eyebrow">${kicker}</span><h3 style="margin:0;">${title}</h3><p style="margin:0;color:var(--text-secondary);line-height:1.7;">${text}</p><p class="nrs-evidence-note" style="margin:0;">${detail}</p><a class="btn btn-secondary" href="${href}"${attrs} style="justify-self:start;margin-top:4px;">${action}</a></article>`;
}

/**
 * Function contract: flagshipIndexBlock
 * Purpose: Render the Work archive section that prioritizes SaaS, fintech, and design-to-engineering hiring evidence.
 * Inputs: None.
 * Side effects: No external side effects.
 * Returns: Marker-wrapped HTML for the flagship evidence section.
 */
function flagshipIndexBlock() {
  return `${startMarker}<section id="flagship-evidence" class="section-container reveal-on-scroll nrs-flagship-proof"><div class="section-header"><p class="eyebrow">Flagship evidence</p><h2 class="section-title">Three systems that show the range I want to be hired for.</h2><p class="section-lead">Complex SaaS architecture, financial-product state design, and design-to-engineering systems. The point is not project count. It is showing how I reason when the product has real structure, risk, and implementation constraints.</p></div><div style="${proofGridStyle}">${proofCard({ href: '/project-orkest', kicker: 'Complex SaaS / enterprise', title: 'Orkest HQ', text: 'A shared product grammar across CRM, Sales, Inventory, Finance, and workspace modules without flattening different business tasks into one admin template.', detail: 'Inspect navigation scopes, information density, reusable patterns, and legitimate variation.', action: 'Read Orkest case study' })}${proofCard({ href: '/project-pihub', kicker: 'Fintech / multi-role product', title: 'piHub', text: 'Investor, creditor, application, verification, and admin journeys organized around status, requirements, next actions, and recovery.', detail: 'Inspect role divergence, verification states, task-based density, and recovery paths.', action: 'Read piHub case study' })}${proofCard({ href: designOpsUrl, kicker: 'Design systems / design-to-engineering', title: 'DesignOps Orchestrator', text: 'A public workflow connecting design tokens, content, media, motion, accessibility, performance, implementation, and release tasks.', detail: 'Public proof includes token transformation, audit tasks, asset pipelines, release automation, and handoff-oriented documentation.', external: true, action: 'Inspect public repository' })}</div><p class="nrs-evidence-note" style="margin-top:24px;"><strong>Evidence boundary:</strong> public artifacts vary by project. Where client metrics, research data, or private files are unavailable, the portfolio stays explicit about that instead of manufacturing impact.</p></section>${endMarker}`;
}

/**
 * Function contract: orkestBlock
 * Purpose: Render evidence-specific inspection guidance for the Orkest complex-SaaS case study.
 * Inputs: None.
 * Side effects: No external side effects.
 * Returns: Marker-wrapped HTML describing the system, navigation, density, variation, and related public systems proof.
 */
function orkestBlock() {
  return `${startMarker}<section id="flagship-proof" class="section-container reveal-on-scroll nrs-flagship-proof"><div class="section-header"><p class="eyebrow">Hiring evidence</p><h2 class="section-title">What to inspect in the Orkest work.</h2><p class="section-lead">The useful evidence here is systems thinking: deciding what should stay consistent across modules, where density changes with the task, and where a shared pattern should intentionally stop being shared.</p></div><div class="journey-grid"><article class="journey-card"><span class="eyebrow">System model</span><h3>Shared product grammar</h3><p>CRM, Sales, Inventory, Finance, and workspace areas use common structural rules without pretending their workflows are identical.</p></article><article class="journey-card"><span class="eyebrow">Navigation</span><h3>Global, module, and local scope</h3><p>Actions and navigation are separated by scope so users can move between business areas without losing orientation.</p></article><article class="journey-card"><span class="eyebrow">Density</span><h3>Scan first, inspect second</h3><p>Dense operational surfaces prioritize what must be readable at a glance, then move secondary detail behind deliberate inspection.</p></article><article class="journey-card"><span class="eyebrow">Variation</span><h3>Consistency with exceptions</h3><p>Reusable SaaS patterns are valuable only when the team also documents where the business task requires a different interaction.</p></article></div><div style="${proofGridStyle}">${proofCard({ href: designOpsUrl, kicker: 'Related public systems proof', title: 'DesignOps Orchestrator', text: 'Inspect a separate public repository showing how I think about tokens, components, audits, implementation contracts, and release workflow.', detail: 'This evidence is separate from the Orkest client-project scope.', external: true, action: 'Inspect public repository' })}</div><p class="nrs-evidence-note" style="margin-top:24px;"><strong>Orkest evidence boundary:</strong> this case publicly shows architecture and interface work. No product-performance metric or public Orkest prototype is claimed where one is not available.</p></section>${endMarker}`;
}

/**
 * Function contract: pihubBlock
 * Purpose: Render evidence-specific inspection guidance and direct public prototype entry points for the piHub fintech case study.
 * Inputs: None.
 * Side effects: No external side effects.
 * Returns: Marker-wrapped HTML describing state, density, verification, role behavior, and the three public prototype flows.
 */
function pihubBlock() {
  return `${startMarker}<section id="flagship-proof" class="section-container reveal-on-scroll nrs-flagship-proof"><div class="section-header"><p class="eyebrow">Hiring evidence</p><h2 class="section-title">What to inspect in the piHub prototypes.</h2><p class="section-lead">The strongest proof is not visual polish. It is whether each role can understand current state, outstanding requirements, available actions, waiting, failure, and recovery without the product contradicting itself.</p></div><div class="journey-grid"><article class="journey-card"><span class="eyebrow">State + action</span><h3>Keep process state actionable</h3><p>Status, missing requirements, and the next available action stay close enough that users do not have to reconstruct the process from memory.</p></article><article class="journey-card"><span class="eyebrow">Density</span><h3>Change information density with the job</h3><p>Dashboards can support scanning and comparison while application and verification steps reduce competing information around consequential decisions.</p></article><article class="journey-card"><span class="eyebrow">Verification</span><h3>Waiting is a real product state</h3><p>Submitted, reviewing, approved, rejected, and resubmission states receive explicit treatment instead of being reduced to a passive badge.</p></article><article class="journey-card"><span class="eyebrow">Roles</span><h3>Share rules, not identical screens</h3><p>Investor, creditor, applicant, and admin journeys can diverge where permissions or tasks differ while retaining one understandable status language.</p></article></div><div style="${proofGridStyle}">${proofCard({ href: pihubCreditor, kicker: 'Public prototype', title: 'Creditor flow', text: 'Inspect application, account, status, and credit-oriented interaction patterns.', detail: 'Figma prototype for the creditor-facing flow.', external: true, action: 'Open creditor prototype' })}${proofCard({ href: pihubInvestor, kicker: 'Public prototype', title: 'Investor flow', text: 'Inspect role-specific information hierarchy and investment-oriented product states.', detail: 'Figma prototype for the investor-facing flow.', external: true, action: 'Open investor prototype' })}${proofCard({ href: pihubAdmin, kicker: 'Public prototype', title: 'Admin flow', text: 'Inspect the operational side of the same product model and where permissions change available actions.', detail: 'Figma prototype for the administrative flow.', external: true, action: 'Open admin prototype' })}</div><p class="nrs-evidence-note" style="margin-top:24px;"><strong>Evidence boundary:</strong> these Figma prototypes are public design artifacts. The case does not claim confidential financial metrics, production conversion data, or engineering ownership.</p></section>${endMarker}`;
}

/**
 * Function contract: patch
 * Purpose: Normalize identity, remove stale generated proof, insert the current block, validate marker count, and persist one targeted route.
 * Inputs: `name`, `block`
 * Side effects: Reads and writes the selected HTML page and throws when the transform contract cannot be satisfied.
 * Returns: Undefined; the function exists for deterministic filesystem transformation and validation.
 */
function patch(name, block) {
  const page = readPage(name);
  let html = identity(removeExisting(page.html));
  html = insertAfterLead(html, block);
  if ((html.match(/<!-- nrs-flagship-proof:start -->/g) || []).length !== 1) {
    throw new Error(`[flagship-proof] ${name}: expected exactly one flagship block.`);
  }
  fs.writeFileSync(page.file, html, 'utf8');
}

patch('projects.html', flagshipIndexBlock());
patch('project-orkest.html', orkestBlock());
patch('project-pihub.html', pihubBlock());

for (const [name, required] of [
  ['projects.html', ['Orkest HQ', 'piHub', designOpsUrl]],
  ['project-orkest.html', ['Shared product grammar', 'DesignOps Orchestrator']],
  ['project-pihub.html', ['Creditor flow', 'Investor flow', 'Admin flow']],
]) {
  const html = fs.readFileSync(path.join(base, name), 'utf8');
  for (const value of required) {
    if (!html.includes(value)) throw new Error(`[flagship-proof] ${name}: missing required proof value: ${value}`);
  }
}

console.log(`[flagship-proof] Added flagship hiring evidence to ${process.argv.includes('--dist') ? 'production output' : 'canonical generated source'}.`);
