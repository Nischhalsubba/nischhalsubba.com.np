/**
 * @fileoverview scripts/ensure-blog-editorial-v4.cjs
 * Purpose: Apply the ensure blog editorial v4 production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const blogDir = path.join(base, 'blog');
const siteUrl = 'https://nischhalsubba.com.np';

const articles = {
  'ux-audit-evidence-before-redesign': {
    title: 'What Evidence Should a UX Audit Collect Before a Redesign?',
    description: 'A practical guide to the evidence worth collecting before a UX redesign, from product behavior and support themes to accessibility, states and implementation constraints.',
    dek: 'A redesign gets more useful when the team can separate what looks old from what is actually making the product harder to use.',
    sections: [
      ['Start with behavior, not opinions', ['Screenshots and stakeholder reactions are useful context, but they are not enough to explain why an experience is failing. Look for evidence of where people stop, repeat an action, abandon a flow, contact support or take an unexpected route through the product.', 'The goal is not to collect every available metric. It is to connect observable behavior to a product decision the redesign can realistically change.']],
      ['Read support and sales language closely', ['Support tickets, onboarding calls, sales objections and customer-success notes often contain the clearest vocabulary for recurring friction. Group themes by task and consequence rather than by the department that recorded them.', 'If three different teams describe the same confusion in different words, that is usually more important than a single loud complaint.']],
      ['Audit the states between the polished screens', ['Review loading, empty, error, permission, validation, timeout and recovery states. These are easy to omit from redesign presentations because they are less photogenic, which is precisely why they often survive into production as inconsistent behavior.', 'Record whether each state explains what happened, what the user can do next and whether their previous work is still safe.']],
      ['Include accessibility and responsive evidence', ['Test keyboard navigation, focus order, contrast, labels, zoom, text scaling and common mobile widths. Responsive problems should be recorded as interaction failures, not just screenshots of awkward wrapping.', 'A desktop redesign that ignores these constraints usually postpones the hardest decisions until implementation.']],
      ['Finish with a decision-ready evidence map', ['For each finding, capture the evidence, affected task, likely consequence, confidence level and the next design question. That gives the team a better starting point than a long list of isolated usability comments.', 'A good audit should make the redesign scope narrower and clearer, not simply make the problem list longer.']],
    ],
    related: [['/ux-audit', 'UX audit and remediation'], ['/projects', 'Product design case studies']],
  },
  'beautiful-interface-poor-ux': {
    title: 'Why a Beautiful Interface Can Still Have Poor UX',
    description: 'A product-design review of how polished interfaces fail through weak hierarchy, missing states, unclear feedback, inaccessible interaction and poor recovery.',
    dek: 'Visual polish can make an interface pleasant to look at while quietly making the product harder to understand, recover from or trust.',
    sections: [
      ['The screen can look clear while the decision is unclear', ['Strong typography and spacing do not help if the user still cannot tell what matters, what changed or what the primary action will do. Visual hierarchy should reflect decision hierarchy.', 'When every card, metric and button receives equal emphasis, the interface may look balanced while the task feels directionless.']],
      ['Happy-path mockups hide product risk', ['A polished success state says very little about how the product behaves while data is loading, a payment fails, a permission is missing or an action cannot be reversed.', 'Those moments are UX, not implementation residue. Design them with the same attention given to the hero state.']],
      ['Feedback has to explain consequence', ['Animation and color can confirm that something happened without explaining what happened. Good feedback names the result, shows whether more action is required and preserves context when the user needs to recover.', 'This matters especially in financial, administrative and destructive workflows where a vague success message can create more anxiety than reassurance.']],
      ['Accessibility exposes weak interaction logic', ['Keyboard use, focus visibility, labels and readable contrast are accessibility requirements, but they are also diagnostic tools. If a flow only makes sense when someone can see a hover effect or infer an unlabeled icon, the interaction model is doing too much implicit work.']],
      ['Polish should make the product easier to read', ['The visual layer earns its value when it clarifies grouping, priority, state and action. Brand character can still be expressive, but it should make the product more legible rather than asking users to admire the composition before they understand the task.', 'The test is simple: remove the screenshot from the portfolio context and ask whether the interface still helps a person make the right next decision.']],
    ],
    related: [['/ux-audit', 'Review a product with an evidence-led UX audit'], ['/projects', 'See product decisions in case studies']],
  },
  'prioritize-ux-audit-findings-before-redesign': {
    title: 'How to Prioritize UX Audit Findings Before a Redesign',
    description: 'A practical prioritization method for UX audit findings using user consequence, frequency, confidence, accessibility risk and delivery effort.',
    dek: 'The useful output of an audit is not a longer issue list. It is a defensible order for deciding what deserves attention first.',
    sections: [
      ['Separate severity from annoyance', ['A frequent visual irritation is not automatically more important than a rare failure that blocks payment, deletes work or prevents access. Rank findings by the consequence for the task before considering how visible the problem is.', 'Use plain language such as blocks completion, creates a serious error risk, slows a common task or adds minor friction.']],
      ['Add frequency and reach', ['A serious problem in a rare administrative edge case may still matter, but its priority is different from a moderate issue affecting nearly every new user. Estimate how often the state occurs and how many roles or journeys it touches.', 'When reliable analytics are unavailable, label the estimate as uncertain rather than turning intuition into a pretend metric.']],
      ['Make confidence visible', ['Audit findings often combine direct evidence, expert review and inference. Those are not the same. Mark how confident the team is in the diagnosis and what would increase confidence.', 'Low-confidence, high-impact findings usually deserve targeted validation before a large redesign commitment.']],
      ['Treat accessibility as product risk', ['Keyboard blockers, missing labels, inaccessible contrast and interaction that depends on pointer precision should not be buried under cosmetic backlog work. Accessibility can affect task completion directly and should be represented explicitly in prioritization.']],
      ['Sequence fixes around product dependencies', ['Some findings are symptoms of the same structural problem. Fixing navigation, status language or a shared form pattern can remove several downstream issues at once.', 'Prioritization becomes more useful when it identifies these leverage points instead of treating every screenshot annotation as a separate project.']],
    ],
    related: [['/ux-audit', 'UX audit service'], ['/blog/ux-audit-evidence-before-redesign', 'Evidence to collect before redesign']],
  },
  'responsive-saas-dashboard-handoff-notes': {
    title: 'Responsive SaaS Dashboard Handoff Notes That Engineers Can Use',
    description: 'How to document responsive SaaS dashboard behavior for tables, filters, sidebars, cards, states and breakpoints without making engineering guess from static Figma frames.',
    dek: 'A responsive handoff should explain how the interface changes when space disappears, not merely provide three screenshots at familiar widths.',
    sections: [
      ['Document priority before breakpoints', ['Start by identifying which information must remain visible, which actions are primary and which elements can collapse, move or become progressively disclosed. That decision is more reusable than a list of pixel values.', 'Breakpoints then become moments where the existing hierarchy needs a different layout, not arbitrary device categories.']],
      ['Tables need a strategy, not horizontal optimism', ['For each table, document what remains visible on narrow screens, whether rows become cards, whether secondary columns can hide and how filters or row actions remain reachable.', 'If horizontal scrolling is necessary, make the important identifier sticky or persistent enough that values still have context.']],
      ['Explain filter and sidebar behavior', ['State whether filters become a sheet, drawer, collapsible region or inline control. Define how active filters remain visible after the panel closes and how users clear them without reopening the entire control surface.', 'Sidebars need the same treatment: what becomes navigation, what becomes contextual control and what can disappear.']],
      ['Include empty, loading and error layouts', ['Responsive handoff often documents the populated dashboard only. Empty states, skeletons, permission states and errors can have very different height and spacing behavior, especially on smaller screens.', 'Show the rules that keep those states legible without creating layout jumps or hidden actions.']],
      ['Give engineering acceptance criteria', ['Write a short set of outcomes the implementation should satisfy: no horizontal page overflow, primary actions remain reachable, 44px mobile targets, readable table context and no content hidden behind fixed navigation.', 'Acceptance criteria turn handoff from a visual reference into a shared definition of responsive quality.']],
    ],
    related: [['/saas-ux-designer', 'SaaS UX design'], ['/figma-design-systems', 'Design systems and handoff']],
  },
  'saas-dashboard-filter-ux': {
    title: 'SaaS Dashboard Filter UX for Real Operational Work',
    description: 'Design dashboard filters around visibility, defaults, active state, saved views, empty results and permissions so teams can find the right data without losing context.',
    dek: 'Filters are not a decoration above a table. In many SaaS products they are part of the user’s working memory.',
    sections: [
      ['Start with the questions users are filtering for', ['Before designing chips and dropdowns, identify the operational questions people need to answer: what requires attention, what belongs to me, what changed recently or which records match a known condition.', 'A filter set built from database fields usually exposes more options than the task needs and hides the combinations people actually repeat.']],
      ['Make active state impossible to miss', ['After the filter panel closes, users should still be able to see that the dataset is constrained. Show active filters near the results and make removal direct.', 'If a table looks unexpectedly empty because a hidden filter is still active, the interface has lost context.']],
      ['Use defaults carefully', ['A useful default can reduce repetitive setup, but an invisible default can distort interpretation. When the product pre-filters by date, ownership or status, make that state visible enough that users understand what they are seeing.', 'Defaults should accelerate common work without pretending to be the complete dataset.']],
      ['Design zero results as feedback', ['An empty filtered result should distinguish no matching records from no records at all. Show which conditions produced the result and provide an obvious way to broaden or clear the query.', 'This is especially important when permissions can also remove records from view.']],
      ['Save views when the work repeats', ['Saved views are valuable when teams revisit meaningful combinations of filters, sorting and columns. Name them around the job, not the implementation.', 'A good saved view reduces setup while preserving enough transparency for users to understand why the dataset looks different.']],
    ],
    related: [['/saas-ux-designer', 'SaaS dashboard UX'], ['/project-orkest', 'Orkest HQ case study']],
  },
  'role-based-saas-dashboard-ux': {
    title: 'Role-Based SaaS Dashboard UX Without Duplicating the Product',
    description: 'How to design SaaS dashboards for different roles and permissions while keeping shared product language, states and navigation coherent.',
    dek: 'Different roles need different priorities. They do not necessarily need different products.',
    sections: [
      ['Separate visibility from responsibility', ['A user may be allowed to see a record without being allowed to edit it. Another role may own the next action without needing every operational detail. Design those distinctions explicitly instead of treating permission as a binary show-or-hide rule.', 'The interface should make responsibility legible so people understand whether they can act, review or only observe.']],
      ['Share the state language', ['Role-specific screens can use different density and actions while still describing the same underlying state consistently. If one role sees “Awaiting review” and another sees “Processing” for the same event, support work starts immediately.', 'Define shared state names and then decide how much detail each role needs.']],
      ['Prioritize the work each role returns to', ['Dashboard hierarchy should reflect repeated responsibilities. An operator may need queues and exceptions; a manager may need trend and risk; an administrator may need configuration and access control.', 'Changing priority is more useful than copying one dashboard and hiding a few cards.']],
      ['Design restricted states deliberately', ['When an action is unavailable, explain whether the reason is role, record state, account configuration or another dependency. A disabled button without context turns permissions into mystery.', 'Where appropriate, show who can complete the action or what condition would make it available.']],
      ['Test role switching against the same scenario', ['Use one realistic record or workflow and inspect how it appears to each role. This exposes contradictions in status, ownership and available action much faster than reviewing separate polished screens.', 'The goal is different perspectives on the same product truth.']],
    ],
    related: [['/saas-ux-designer', 'SaaS UX design'], ['/project-pihub', 'piHub case study']],
  },
  'saas-dashboard-empty-states-that-help-users-recover': {
    title: 'SaaS Dashboard Empty States That Help Users Recover',
    description: 'Design empty states for first use, filters, permissions, setup, sync delays and errors so a blank dashboard explains what happened and what the user can do next.',
    dek: '“No data” is not one state. Treating it as one is how useful recovery information disappears.',
    sections: [
      ['Identify why the view is empty', ['A dashboard can be empty because the account is new, a filter removed every result, permissions hide the data, setup is incomplete, a sync has not finished or a request failed.', 'Those causes require different explanations and different next actions.']],
      ['First-use states should teach the model', ['A new account needs more than an illustration and “Create your first item.” Explain what will appear here, why it matters and the smallest useful action that begins the workflow.', 'Avoid turning onboarding into a wall of documentation inside the empty state.']],
      ['Filtered empties should preserve the query', ['Show the active conditions and offer a direct path to broaden or clear them. Do not silently reset filters just to make the table look populated again.', 'The user should understand that the data may exist outside the current query.']],
      ['Permission empties need honest language', ['If records exist but the user cannot access them, do not say there is no data. Explain the access limitation and, when appropriate, point to the role or administrator who can change it.', 'Accurate empty-state language protects trust in the underlying system.']],
      ['Loading and failure should never masquerade as empty', ['A blank panel while data is still loading can be interpreted as a real zero. Reserve space, show progress when needed and provide a retry path when the request fails.', 'State clarity matters more than decorative emptiness.']],
    ],
    related: [['/saas-ux-designer', 'SaaS UX design'], ['/blog/saas-dashboard-filter-ux', 'Dashboard filter UX']],
  },
  'design-systems-small-product-teams': {
    title: 'Design Systems for Small Product Teams Without Overbuilding',
    description: 'A practical approach to design systems for small teams: standardize repeated product decisions, state coverage and handoff without creating a component bureaucracy.',
    dek: 'A small team needs fewer repeated decisions, not a miniature design-ops department.',
    sections: [
      ['Start where inconsistency costs time', ['Look for components and decisions the team already repeats: buttons, inputs, status language, spacing, typography, modal behavior, responsive patterns and common data states.', 'A system becomes useful when it removes uncertainty from active product work. It does not need an impressive inventory on day one.']],
      ['Standardize behavior with the component', ['A component is not complete because its default state looks correct. Include hover, focus, disabled, loading, error, empty and permission behavior where the pattern requires them.', 'The behavior is often more valuable to engineering than another decorative variant.']],
      ['Use semantic tokens when meaning repeats', ['Tokens are most useful when they encode meaning such as surface, text, border, danger, focus or spacing roles. Naming raw values after their appearance alone makes future theme and accessibility changes harder.', 'Keep the token layer proportional to the product. A simple product does not need a taxonomy worthy of an operating system.']],
      ['Document the exception rule', ['Teams lose time when they cannot tell whether a new pattern should reuse, extend or deliberately differ from the system. Write short usage guidance and show examples of legitimate exceptions.', 'Consistency should reduce relearning, not prevent product-specific decisions.']],
      ['Measure the system by delivery quality', ['A useful system reduces duplicated design work, implementation drift and review ambiguity. Those outcomes matter more than component count.', 'If maintaining the library consumes more time than the product problems it removes, the system is probably overbuilt.']],
    ],
    related: [['/figma-design-systems', 'Figma design systems'], ['/project-masteriyo', 'Masteriyo case study']],
  },
  'design-handoff-checklist-startup-product-teams': {
    title: 'A Design Handoff Checklist for Startup Product Teams',
    description: 'A practical handoff checklist covering product intent, states, responsive behavior, content rules, accessibility, assets and UI QA for startup teams.',
    dek: 'Handoff is not the moment design stops. It is the moment ambiguity becomes expensive.',
    sections: [
      ['Explain the screen purpose', ['Give engineering the job the screen is solving, the primary user and the important action. This prevents implementation decisions from being made from visual proximity alone.', 'A sentence of product context can be more useful than a page of spacing measurements.']],
      ['List the states that change behavior', ['Document loading, empty, error, success, disabled, permission and partial states. For forms, include validation timing, error placement and what data should survive a failed submission.', 'If the implementation needs to invent these states, the design is not finished enough to hand off.']],
      ['Describe responsive rules', ['State what wraps, reorders, collapses, becomes a drawer or disappears as space changes. Explain the content priority behind the decision, not only the breakpoint.', 'This makes the rule easier to preserve when the codebase uses different layout primitives than the design file.']],
      ['Call out interaction and content constraints', ['Document keyboard behavior, focus, modal dismissal, destructive confirmation, content limits and any values that can become unexpectedly long.', 'Real product content has a habit of ignoring the dimensions of the perfect mockup.']],
      ['Stay available for UI QA', ['Review the implemented flow in the browser or app, including narrow widths and failure states. Handoff notes reduce ambiguity; they do not replace seeing the real product.', 'The fastest way to improve future handoff is to notice what still had to be explained during the build.']],
    ],
    related: [['/figma-design-systems', 'Design systems and handoff'], ['/contact', 'Discuss a product design engagement']],
  },
  'when-startup-needs-ux-audit-before-redesign': {
    title: 'When a Startup Needs a UX Audit Before a Redesign',
    description: 'How to decide whether to audit an existing product before redesigning it, and when a focused flow redesign is more useful than a full interface overhaul.',
    dek: 'A redesign is expensive evidence collection if the team has not first agreed on what is actually broken.',
    sections: [
      ['Audit first when the diagnosis is vague', ['If the brief is “the product feels dated” or “users seem confused,” an audit can separate visual debt from workflow, content, accessibility and implementation problems.', 'That prevents a visual refresh from preserving the same structural friction in cleaner components.']],
      ['Audit first when the product has history', ['Long-lived products accumulate exceptions, permissions and workflows that are easy to miss in a greenfield redesign. Reviewing the current experience exposes the behavior users and support teams have already learned.', 'The goal is not to preserve every legacy choice. It is to understand the cost of removing or changing it.']],
      ['Skip the broad audit when one failure is already clear', ['If a single high-value flow is demonstrably broken and the evidence is strong, a focused redesign may be more useful than auditing the entire product.', 'Do enough surrounding review to understand dependencies, then spend the effort on the decision that matters.']],
      ['Use the audit to define redesign boundaries', ['A useful audit should identify what needs structural change, what can be fixed inside the current system and what should remain untouched.', 'The result is a smaller, more defensible redesign scope rather than a license to rebuild every screen.']],
      ['Leave with priorities, not a presentation', ['The final output should connect evidence, severity, affected task and recommended next step. A deck full of annotated screenshots is not enough if nobody knows which decisions should happen first.', 'The best audit makes the next product conversation more specific.']],
    ],
    related: [['/ux-audit', 'UX audit and remediation'], ['/blog/prioritize-ux-audit-findings-before-redesign', 'Prioritize audit findings']],
  },
  'hire-product-designer-nepal-saas-web3': {
    title: 'Hiring a Product Designer in Nepal for SaaS or Web3 Work',
    description: 'What to evaluate when hiring a product designer in Nepal for SaaS, Web3 or technically constrained products, including product judgment, state design and implementation handoff.',
    dek: 'Location can affect collaboration logistics. The more important question is whether the designer can make the product easier for users and the team to reason about.',
    sections: [
      ['Look for decisions, not only polished screens', ['A strong portfolio should explain what made the product difficult, what the designer owned and why a particular flow or hierarchy changed.', 'Beautiful screenshots are useful evidence of craft, but senior product work also needs evidence of judgment.']],
      ['Ask about states and constraints', ['SaaS and Web3 products are full of permissions, waiting, failures, signing, review and operational exceptions. Ask how the designer handles the parts that do not fit the happy path.', 'The answer reveals whether the work is screen decoration or product behavior.']],
      ['Evaluate collaboration with engineering', ['Look for responsive rules, state coverage, design-system thinking and examples of implementation QA. A designer does not need to be a front-end engineer, but understanding how decisions survive the build reduces expensive ambiguity.', 'Ask what typically changes after engineering sees the design.']],
      ['Check whether the domain language is earned', ['A portfolio can mention SaaS, fintech or Web3 without demonstrating the trust, workflow or technical constraints that make those products different. Read the case study closely enough to see whether the domain changed the design decisions.', 'Specificity is more convincing than a long tool list.']],
      ['Use the first conversation to test product thinking', ['Bring a real problem, not a hypothetical design exercise. See how the designer asks about users, evidence, business constraints, engineering limits and the decision the interface needs to improve.', 'The quality of those questions often predicts the quality of the collaboration.']],
    ],
    related: [['/about', 'About Nischhal Raj Subba'], ['/projects', 'Product design case studies'], ['/contact', 'Contact']],
  },
  'saas-dashboard-ux-checklist': {
    title: 'A SaaS Dashboard UX Checklist for Complex Workflows',
    description: 'A practical SaaS dashboard UX checklist for navigation, hierarchy, tables, filters, roles, states, empty results, feedback and responsive behavior.',
    dek: 'A dashboard works when people can understand what needs attention and act without reconstructing the product model from the interface.',
    sections: [
      ['Navigation and location', ['Can users tell which workspace, account, module or record they are in? Is the path back predictable? Complex SaaS needs location cues because the same entity can appear in several workflows.', 'Avoid using the sidebar as a storage drawer for every feature the product has accumulated.']],
      ['Priority and density', ['Put high-frequency decisions and exceptions before secondary metrics. Dense interfaces can be efficient when hierarchy is strong; sparse interfaces can still be confusing when every card competes equally.', 'Review what the user needs to notice in the first few seconds.']],
      ['Tables, filters and bulk work', ['Check column priority, sorting, active filters, zero results, row actions and bulk selection. Make sure the identifier remains understandable when horizontal space gets tight.', 'Operational tools need efficiency without turning every action into an unlabeled icon.']],
      ['States and recovery', ['Review loading, empty, error, permission, stale data and destructive-action feedback. The dashboard should explain whether the user can recover and whether their previous work is safe.', 'These states usually matter more to trust than another chart animation.']],
      ['Responsive behavior', ['At narrow widths, protect task priority rather than mechanically stacking every desktop block. Decide what becomes a drawer, what can hide and which actions must remain visible.', 'Test real content at 375, 768 and common desktop widths rather than relying on one ideal mobile frame.']],
    ],
    related: [['/saas-ux-designer', 'SaaS UX design'], ['/project-orkest', 'Orkest HQ case study']],
  },
  'web3-wallet-ux-checklist': {
    title: 'A Web3 Wallet UX Checklist for Safer Transaction Flows',
    description: 'A practical Web3 wallet UX checklist covering connection, signing context, transaction review, fees, pending states, rejection, failure and confirmation.',
    dek: 'Wallet UX is strongest when the interface makes intent and consequence clear before the signature request appears.',
    sections: [
      ['Explain why the wallet is needed', ['Do not make “Connect wallet” the first unexplained requirement. Show what connecting enables and whether the user can still explore useful product context before doing it.', 'The request should feel like a product step, not a protocol ritual.']],
      ['Keep signing context visible', ['Before handing off to a wallet, summarize the action in product language: what changes, what asset or amount is involved, who receives it and whether the action can be reversed.', 'Raw transaction detail can remain available without becoming the only explanation.']],
      ['Design pending as a real state', ['Blockchain confirmation can take time and the product may not control the delay. Explain that waiting is expected, show what is known and prevent repeated submission when it could create duplicate intent.', 'Users need confidence that the product has not simply frozen.']],
      ['Distinguish rejection from failure', ['A user declining a signature is different from a network or contract failure. The recovery path and tone should reflect that difference.', 'Keep enough original context that retrying does not require reconstructing the action from memory.']],
      ['Bring the result back into the product', ['After confirmation, show the resolved state where the action began. If the transaction belongs to a conversation, order or workflow, that context should remain durable.', 'A wallet popup should not be the only place the user learns what happened.']],
    ],
    related: [['/web3-ux-designer', 'Web3 UX design'], ['/project-yarsha', 'Yarsha case study']],
  },
  'figma-handoff-notes-for-developers': {
    title: 'How to Write Figma Handoff Notes Developers Can Use',
    description: 'Write better Figma handoff notes by documenting screen purpose, states, responsive rules, interactions, content constraints, accessibility and acceptance criteria.',
    dek: 'A handoff note should explain what the product should do when a screenshot stops being enough.',
    sections: [
      ['State the purpose before the specification', ['Start with the user, task and expected result. That context helps engineering make sensible decisions when the implementation cannot match the artboard literally.', 'A short purpose statement often prevents more confusion than another measurement annotation.']],
      ['Document behavior by state', ['List default, hover, focus, loading, empty, error, success, disabled and permission behavior where relevant. For complex components, explain the transition between those states.', 'Static frames should not force developers to infer product logic.']],
      ['Write responsive rules in plain language', ['Describe what wraps, reorders, hides, becomes sticky or moves into a drawer. Explain which content is more important when the layout cannot preserve everything.', 'Use breakpoint examples, but do not make the rule depend entirely on one device width.']],
      ['Call out content and accessibility constraints', ['Mention long labels, empty values, keyboard behavior, focus order, accessible names and any interaction that must not rely on hover alone.', 'These notes turn edge cases into shared product requirements rather than QA surprises.']],
      ['End with acceptance criteria', ['Give QA and engineering a short list of outcomes: the action remains reachable, errors preserve input, no horizontal page overflow, focus returns after closing a modal, and the mobile target meets the agreed minimum.', 'Acceptance criteria make handoff testable instead of ceremonial.']],
    ],
    related: [['/figma-design-systems', 'Figma design systems'], ['/blog/responsive-saas-dashboard-handoff-notes', 'Responsive dashboard handoff']],
  },
  'ux-audit-checklist-before-redesign': {
    title: 'A UX Audit Checklist to Use Before a Redesign',
    description: 'Review product goals, user journeys, hierarchy, states, accessibility, responsive behavior, content and implementation quality before redesigning the interface.',
    dek: 'The checklist is useful only if it helps the team decide what should change and what should not.',
    sections: [
      ['Product and user context', ['Write down the primary tasks, user roles, business constraints and available evidence. A redesign without context tends to optimize the most visible screen rather than the most important work.', 'Include known technical or regulatory limits early so they do not arrive as late-stage exceptions.']],
      ['Journey and information architecture', ['Review navigation, task sequence, naming and whether users know where they are. Look for duplicated routes, dead ends and places where the product model leaks into the interface unnecessarily.', 'Map the important decisions, not every click.']],
      ['Interaction states', ['Inspect loading, empty, error, validation, disabled, permission and recovery behavior. Check whether feedback explains consequence and whether users can continue without losing work.', 'These states often reveal more about product maturity than the default screen.']],
      ['Accessibility and responsive behavior', ['Test keyboard use, focus visibility, labels, contrast, zoom and small screens. Look for content hidden behind fixed controls, horizontal overflow and tap targets that require precision.', 'Record the affected task, not just the CSS symptom.']],
      ['Prioritize the redesign', ['Group findings by root cause and consequence. Identify what needs structural change, what can be repaired in the current system and what requires more evidence.', 'The final checklist item is deciding what not to redesign.']],
    ],
    related: [['/ux-audit', 'UX audit service'], ['/blog/ux-audit-evidence-before-redesign', 'Evidence before redesign']],
  },
  'website-ux-checklist-software-companies': {
    title: 'A Website UX Checklist for Software Companies',
    description: 'Review software and B2B websites for positioning, information architecture, product explanation, proof, calls to action, responsive behavior and accessibility.',
    dek: 'A software website should help a serious visitor understand the product before asking them to admire the brand or book a call.',
    sections: [
      ['Can a visitor identify the product quickly?', ['The opening should establish who the product is for, what problem it addresses and why the visitor should continue. Avoid forcing people to decode internal category language before they understand the outcome.', 'Specificity is more trustworthy than a headline that could belong to any software company.']],
      ['Does the information architecture match buyer questions?', ['Organize pages around the evaluation journey: problem, use case, capability, proof, implementation or trust detail, then next step. A navigation menu that mirrors the company org chart rarely helps an external visitor.', 'Use descriptive links so people know what they will get before clicking.']],
      ['Is proof attached to the claim?', ['Case studies, screenshots, product detail, customer evidence or public artifacts are strongest near the statement they support. A remote logo wall cannot rescue vague product language.', 'If evidence is limited, narrow the claim rather than filling the gap with generic confidence copy.']],
      ['Are calls to action timed well?', ['A visitor should always know the next useful step, but not every section needs a “Book a demo” button. Match the action to the amount of context the page has earned.', 'Documentation, examples or case studies can be better intermediate actions for technical buyers.']],
      ['Does mobile preserve the story?', ['Responsive design should preserve reading order, proof relationships and key actions. Test navigation, long headings, forms, tables and media rather than assuming stacked columns equal mobile UX.', 'A software website is part of the product’s credibility. Treat its failure states accordingly.']],
    ],
    related: [['/website-ux-design', 'Website UX design'], ['/project-mokshya', 'Mokshya.io case study']],
  },
};


/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure blog editorial v4 repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function esc(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}


/**
 * Function contract: canonicalFor
 * Purpose: Implement the canonical for responsibility owned by the ensure blog editorial v4 repository tool.
 * Inputs: `slug`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function canonicalFor(slug) {
  return `${siteUrl}/blog/${slug}`;
}



/**
 * Function contract: updateMeta
 * Purpose: Apply meta consistently while preserving the surrounding ensure blog editorial v4 repository tool contract.
 * Inputs: `html`, `article`, `slug`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function updateMeta(html, article, slug) {
  const title = `${article.title} | Nischhal Raj Subba`;
  const description = article.description;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  
  
  /**
   * Function contract: setName
   * Purpose: Synchronize name with the requested state while preserving related ensure blog editorial v4 repository tool invariants.
   * Inputs: `name`, `value`
   * Side effects: No direct external side effect beyond invoked dependencies.
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
   */
  const setName = (name, value) => {
    const re = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, 'i');
    const tag = `<meta name="${name}" content="${esc(value)}" />`;
    html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}\n</head>`);
  };
  
  
  /**
   * Function contract: setProperty
   * Purpose: Synchronize property with the requested state while preserving related ensure blog editorial v4 repository tool invariants.
   * Inputs: `name`, `value`
   * Side effects: No direct external side effect beyond invoked dependencies.
   * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
   */
  const setProperty = (name, value) => {
    const re = new RegExp(`<meta\\s+[^>]*property=["']${name}["'][^>]*>`, 'i');
    const tag = `<meta property="${name}" content="${esc(value)}" />`;
    html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `${tag}\n</head>`);
  };
  setName('description', description);
  setName('twitter:title', title);
  setName('twitter:description', description);
  setProperty('og:title', title);
  setProperty('og:description', description);
  setProperty('og:url', canonicalFor(slug));
  const canonical = `<link rel="canonical" href="${canonicalFor(slug)}" />`;
  html = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, canonical)
    : html.replace('</head>', `${canonical}\n</head>`);
  html = html.replace(/<meta\s+[^>]*name=["']nrs-search-intent["'][^>]*>\s*/gi, '');
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description, url: canonicalFor(slug), author: { '@type': 'Person', name: 'Nischhal Raj Subba', url: `${siteUrl}/about` }, isPartOf: { '@type': 'Blog', name: 'Product Design Writing by Nischhal Raj Subba', url: `${siteUrl}/blog/` } };
  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n</head>`);
  return html;
}



/**
 * Function contract: renderArticle
 * Purpose: Implement the render article responsibility owned by the ensure blog editorial v4 repository tool.
 * Inputs: `article`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderArticle(article) {
  const sections = article.sections.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[heading, paragraphs]`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([heading, paragraphs], index) => `<section class="nrs-article-v4-section"><span class="agent-meta">${String(index + 1).padStart(2, '0')}</span><div><h2>${esc(heading)}</h2>${paragraphs.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `p` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (p) => `<p>${esc(p)}</p>`).join('')}</div></section>`).join('');
  const related = article.related.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[href, label]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([href, label]) => `<a class="agent-btn" href="${esc(href)}">${esc(label)}</a>`).join('');
  return `<main id="main-content" class="agent-main nrs-article-v4"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Product design writing</span><h1>${esc(article.title)}</h1></div><p class="agent-page-intro">${esc(article.dek)}</p></div></header><article class="agent-section"><div class="agent-frame nrs-article-v4-frame"><div class="nrs-article-v4-intro"><span class="agent-meta">Practical note · Nischhal Raj Subba</span><p>This article is written as a working review tool rather than a universal formula. Apply the parts that match the product, evidence and constraints in front of you.</p></div>${sections}<footer class="nrs-article-v4-close"><span class="agent-kicker">Continue</span><h2>Use the framework to make a decision, not to create another checklist nobody owns.</h2><div class="agent-actions">${related}<a class="agent-btn" href="/blog/">All writing</a></div></footer></div></article></main>`;
}



/**
 * Function contract: locate
 * Purpose: Resolve module behavior from the supplied inputs and current ensure blog editorial v4 repository tool context.
 * Inputs: `slug`
 * Side effects: reads filesystem state
 * Returns: The requested module behavior; explicit early-return branches define empty/fallback behavior.
 */
function locate(slug) {
  if (!fs.existsSync(blogDir)) return null;
  const candidates = [`${slug}.html`, slug];
  for (const name of candidates) {
    const file = path.join(blogDir, name);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

let rewritten = 0;
for (const [slug, article] of Object.entries(articles)) {
  const file = locate(slug);
  if (!file) continue;
  let html = fs.readFileSync(file, 'utf8');
  const main = renderArticle(article);
  html = /<main\b[^>]*>[\s\S]*?<\/main>/i.test(html)
    ? html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main)
    : html.replace(/<footer\b/i, `${main}<footer`);
  html = updateMeta(html, article, slug);
  html = html.replace(/aria-label=["']Open navigation menu["']/gi, 'aria-label="Open site navigation"');
  html = html.replace(/aria-label=["']Toggle theme["']/gi, 'aria-label="Switch color theme"');
  fs.writeFileSync(file, html, 'utf8');
  rewritten += 1;
}

const stylePath = path.join(base, 'style.css');
if (fs.existsSync(stylePath)) {
  const start = '/* nrs-blog-editorial-v4:start */';
  const end = '/* nrs-blog-editorial-v4:end */';
  const marker = /\/\* nrs-blog-editorial-v\d+:start \*\/[\s\S]*?\/\* nrs-blog-editorial-v\d+:end \*\//g;
  const css = `${start}
.agent-portfolio .nrs-article-v4-frame { width: min(100%, 74rem); margin-inline: auto; }
.agent-portfolio .nrs-article-v4-intro { display: grid; grid-template-columns: minmax(10rem, .55fr) minmax(0, 1.45fr); gap: 2rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--ap-line-strong); }
.agent-portfolio .nrs-article-v4-intro p { max-width: 46rem; margin: 0; color: var(--ap-ink-soft); font-size: 1.05rem; line-height: 1.7; }
.agent-portfolio .nrs-article-v4-section { display: grid; grid-template-columns: minmax(4rem, .28fr) minmax(0, 1.72fr); gap: clamp(1.5rem, 5vw, 5rem); padding: clamp(2.75rem, 5vw, 4.75rem) 0; border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-article-v4-section h2 { max-width: 18ch; margin: 0 0 1.4rem; color: var(--ap-ink); font: 720 clamp(2rem, 4vw, 4rem)/.95 var(--ap-font-display); letter-spacing: -.055em; }
.agent-portfolio .nrs-article-v4-section p { max-width: 45rem; margin: 0 0 1.2rem; color: var(--ap-ink-soft); font-size: clamp(1rem, 1.2vw, 1.12rem); line-height: 1.75; }
.agent-portfolio .nrs-article-v4-close { display: grid; gap: 1.5rem; padding-top: clamp(3rem, 6vw, 6rem); }
.agent-portfolio .nrs-article-v4-close h2 { max-width: 15ch; margin: 0; color: var(--ap-ink); font: 730 clamp(2.4rem, 5vw, 5.2rem)/.92 var(--ap-font-display); letter-spacing: -.06em; }
@media (max-width: 700px) {
  .agent-portfolio .nrs-article-v4-intro,
  .agent-portfolio .nrs-article-v4-section { grid-template-columns: minmax(0, 1fr); gap: 1rem; }
  .agent-portfolio .nrs-article-v4-section { padding-block: 2.75rem; }
}
${end}`;
  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(marker, '').trimEnd();
  style += `\n\n${css}\n`;
  fs.writeFileSync(stylePath, style, 'utf8');
}

if (rewritten < 10) throw new Error(`[blog-editorial] Expected to rewrite at least 10 articles; rewrote ${rewritten}`);
console.log(`[blog-editorial] Rewrote ${rewritten} product-design article(s) with distinct editorial content and metadata.`);
