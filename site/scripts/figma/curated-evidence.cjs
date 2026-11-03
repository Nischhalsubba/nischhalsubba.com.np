/**
 * @fileoverview Curated portfolio evidence composition.
 * Purpose: Place reviewed, locally hosted Figma-derived illustrations next to accurate explanations.
 * Responsibilities: Render responsive figures, preserve source attribution and distinguish design from measured results.
 * Execution context: Final inner-page installation, before heading animation and SEO finalization.
 * Connected files: src/content/portfolio-evidence-images.json, install-workspace-inner.cjs, workspace-inner/parity.css.
 * Maintenance: Never infer shipped behavior, ownership or permission from Figma read access; keep private originals outside git and dist.
 */
const fs = require('node:fs');
const path = require('node:path');
const images = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../src/content/portfolio-evidence-images.json'), 'utf8'));
/** Function contract: escape
 * Purpose: Encode authored text for HTML. Inputs: value. Side effects: none. Returns: safe text.
 */
function escape(value) { return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
/** Function contract: figure
 * Purpose: Render a locally hosted, sized screenshot with a visible evidence boundary.
 * Inputs: image ID. Side effects: none. Returns: semantic figure HTML; throws for missing approval or source.
 */
function figure(id) {
  const image = images.find(item => item.id === id);
  if (!image || image.permission !== 'OWNER_AUTHORIZED_REVIEW_BRANCH') throw new Error(`Unreviewed image: ${id}`);
  const largest = image.variants.at(-1);
  const source = `https://www.figma.com/design/${image.fileKey}/?node-id=${image.nodeId.replaceAll(':', '-')}`;
  return `<figure class="workspace-evidence-figure${largest.width < 600 ? ' workspace-evidence-mobile' : ''}" data-evidence-image="${escape(id)}"><img src="${escape(largest.src)}" srcset="${image.variants.map(item => `${escape(item.src)} ${item.width}w`).join(', ')}" sizes="${largest.width < 600 ? `(max-width: 460px) calc(100vw - 48px), ${largest.width}px` : '(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) calc(100vw - 80px), 1000px'}" width="${largest.width}" height="${largest.height}" loading="lazy" decoding="async" alt="${escape(image.alt)}"><figcaption>${escape(image.caption)}</figcaption></figure><p class="workspace-evidence-source"><a href="${escape(source)}" target="_blank" rel="noopener noreferrer">Inspect the original Figma frame (access may be required)</a></p>`;
}
const sections = {
  'project-orkest.html': { title:'CRM decisions in the current design', paragraphs:[
    'The leads screen separates ownership views from search and filters. “All leads”, “My leads” and “Unassigned” answer different questions without changing the table’s underlying record model. Labeled statuses keep qualification visible alongside ownership.',
    'The create-lead screen groups contact information and qualification, then explains capture, qualification, assignment and conversion in a side panel. Its note that a lead score is calculated after saving makes a dependency visible before the user commits.',
    'These are current-labeled design artifacts from the supplied Orkest file. They demonstrate interface decisions; they do not establish production adoption, research findings or a measured improvement. Validation should test whether people understand ownership, required information and the next step.'
  ], images:['orkest-lead-list','orkest-lead-capture'] },
  'project-pihub.html': { title:'Application status as comparison evidence', paragraphs:[
    'The creditor design keeps submitted applications in a table with service, industry, timing and explicit status. “Approved” and “Awaiting Approval” remain readable text rather than color alone. This helps explain the intended status model without presenting the mock rows as financial results.',
    'The screen is evidence of a designed list state. It does not verify the approval process, the accuracy of sample amounts or how quickly an application was processed. Investor and administrator prototypes remain separate artifacts.'
  ], images:['pihub-application-status'] },
  'project-zapp.html': { title:'A clear starting point for the customer journey', paragraphs:[
    'The primary customer iOS design introduces account creation and sign-in as separate routes, with a short explanation beneath each. The persistent primary action favors account creation while the returning-user route remains visible.',
    'This account-entry screen supports a specific discussion of onboarding hierarchy. It is not evidence that driver dispatch, delivery completion or business performance improved. The older customer and driver prototypes are retained as historical references.'
  ], images:['zapp-account-entry'] },
  'project-yarsha.html': { title:'An empty result inside a conversation product', paragraphs:[
    'The final-mobile page includes a contact-search state with “No contact found”, Contacts and Invite tabs, and the keyboard still visible. It is a concrete example of where an empty result needs an understandable continuation.',
    'The frame communicates the result, but it does not explain whether the query can be broadened or what Invite will do. Those are useful validation questions rather than claims that the design has already solved recovery. This is contact-search evidence, separate from wallet or transaction-signing behavior.'
  ], images:['yarsha-contact-empty'] },
  'blog/figma-handoff-notes-for-developers.html': { title:'A handoff note tied to an actual form', paragraphs:[
    'In the Orkest create-lead design below, the interface says required information is marked and the score is calculated after saving. A useful handoff must resolve what the image leaves open: which fields the server requires, when duplicate email checking runs, whether a draft can omit required values, and what remains after a failed save.',
    'Write acceptance criteria around those decisions. For example: a failed save preserves entered values; an invalid field receives a text error; focus moves to an error summary only when it helps recovery; and a successful draft is distinguished from a created lead. These are proposed checks for implementation, not claims that the screenshot proves them.'
  ], images:['orkest-lead-capture'] },
  'blog/saas-dashboard-filter-ux.html': { title:'Separate ownership views from filter conditions', paragraphs:[
    'The Orkest CRM design places All leads, My leads and Unassigned beside search and a Filters action. That hierarchy distinguishes a recurring ownership question from a temporary record condition. It also gives a review a concrete starting point: can someone tell which view is active before interpreting an empty result?',
    'The screenshot does not show the open filter panel, active filter chips or persistence rules. Do not infer those states from a closed button. During handoff, specify how combined conditions are displayed, how Clear all behaves, and whether changing an ownership view preserves or resets filters.'
  ], images:['orkest-lead-list'] },
  'blog/blog-good-handoff.html': { title:'Use a screen to expose unanswered behavior', paragraphs:[
    'A polished form can still leave important decisions unresolved. The Orkest example names contact details, qualification, an owner and an initial status. Before implementation, clarify which values a draft requires, who can assign an owner and what happens if creating the lead fails.',
    'Keep these decisions next to the relevant frame and assign an owner to each open question. A screenshot is evidence of layout and visible content; a short state contract supplies behavior. Review both together instead of treating export delivery as a completed handoff.'
  ], images:['orkest-lead-capture'] },
  'blog/role-based-saas-dashboard-ux.html': { title:'A view is not an authorization boundary', paragraphs:[
    'All leads, My leads and Unassigned are visible choices in the Orkest CRM design. They organize work by ownership, but the presence of a view does not prove who may read, edit or export a record.',
    'Document visibility and action permissions separately. Check a direct record URL, an export action and a stale session after access changes. These are implementation review scenarios; the design image cannot verify server authorization.'
  ], images:['orkest-lead-list'] },
  'blog/saas-dashboard-empty-state-ux-guide.html': { title:'Name the cause before choosing the action', paragraphs:[
    'Start with the evidence available to the interface. A new workspace with no records can offer a first-record action. An empty search should preserve the query and offer a clear way to broaden it. Restricted data needs an access explanation only when revealing that information is appropriate. A delayed synchronization needs an honest update state rather than a misleading “nothing here”.',
    'The Yarsha contact-search frame below is a mobile example of the same distinction, rather than a SaaS dashboard screenshot. It reports “No contact found” while retaining the search context. An Invite tab is visible, but the image alone does not establish what invitation does or whether it is the right recovery.',
    'Test the transition, not just the empty panel. Enter a query that matches nothing, clear it, change a filter, and return after data arrives. Check that result counts, focus and assistive-technology announcements stay useful. Keep destructive actions separate from recovery and preserve any input the user may need to revise.',
    'For a broader framework that compares setup, permissions and synchronization, read the related empty-state guide. This note focuses on the smaller decision: what explanation and next step belong in one observed zero-result state.'
  ], images:['yarsha-contact-empty'], related:'/blog/saas-dashboard-empty-states-product-clarity', relatedLabel:'Compare empty-state causes across a product' },
};
const reading = {
  'project-orkest.html': [['SaaS dashboard UX checklist','/blog/saas-dashboard-ux-checklist'],['Role-based dashboard UX','/blog/role-based-saas-dashboard-ux'],['SaaS product design','/saas-ux-designer']],
  'project-yarsha.html': [['Wallet connection UX','/blog/web3-wallet-connection-ux'],['Transaction review UX','/blog/transaction-review-ux-crypto-apps'],['Web3 product design','/web3-ux-designer']],
  'project-pihub.html': [['Reviewing product workflows before a redesign','/blog/ux-audit-checklist-before-redesign'],['UX audit service','/ux-audit']],
  'project-zapp.html': [['Reviewing mobile journeys before a redesign','/blog/ux-audit-checklist-before-redesign'],['Product design services','/services']],
  'project-masteriyo.html': [['Design systems and front-end constraints','/blog/blog-design-systems-front-end'],['Useful design handoff','/blog/blog-good-handoff']],
  'project-neverwinter-parser.html': [['Gaming interface clarity','/blog/blog-gaming-interface-clarity'],['Dashboard review checklist','/blog/saas-dashboard-ux-checklist']],
  'project-sassboilerplate.html': [['Design systems and front-end structure','/blog/blog-design-systems-front-end'],['Design-to-development handoff','/blog/figma-handoff-notes-for-developers']],
  'saas-ux-designer.html': [['A focused empty-result review','/blog/saas-dashboard-empty-state-ux-guide'],['Compare empty-state causes','/blog/saas-dashboard-empty-states-product-clarity'],['Orkest CRM design evidence','/project-orkest']],
  'about.html': [['Working with a product designer in Nepal','/product-design-nepal'],['Hiring for SaaS and Web3 work','/blog/hire-product-designer-nepal-saas-web3']],
  'services.html': [['Product design from Nepal','/product-design-nepal'],['Review my SaaS work','/project-orkest']],
};
for (const slug of ['mokshya','hamro-idea','morajaa','splashnode','grid-labs','zakra-furniture','designerex']) reading[`project-${slug}.html`] = [['Website UX for software and service businesses','/website-ux-design'],['Website review checklist','/blog/website-ux-checklist-software-companies'],['Service website clarity','/blog/blog-service-websites']];
/** Function contract: applyEvidence
 * Purpose: Append substantive, frame-grounded evidence to its relevant retained route.
 * Inputs: main HTML and relative output filename. Side effects: none. Returns: final main HTML.
 */
function applyEvidence(main, relative) {
  if (main.includes('data-editorial-revision=')) return main;
  const data = sections[relative];
  const section = data ? `<section class="agent-section workspace-evidence" aria-label="Design evidence"><span class="mono sec-label">DESIGN EVIDENCE / SOURCE REVIEW</span><h2>${escape(data.title)}</h2>${data.paragraphs.map(text => `<p>${escape(text)}</p>`).join('')}${data.images.map(figure).join('')}${data.related ? `<p><a href="${data.related}">${escape(data.relatedLabel)}</a></p>` : ''}<p class="workspace-evidence-note">Screens illustrate design work. Redactions and crops are identified in captions. No measured product outcome is implied.</p></section>` : '';
  const links = reading[relative] ? `<section class="agent-section workspace-evidence"><h2>Related reading and services</h2><ul>${reading[relative].map(([label,url]) => `<li><a href="${url}">${escape(label)}</a></li>`).join('')}</ul></section>` : '';
  return main.replace('</main>', section + links + '</main>');
}
module.exports = { applyEvidence, sections, figure };
