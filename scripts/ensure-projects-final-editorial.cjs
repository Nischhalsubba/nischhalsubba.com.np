/**
 * @fileoverview scripts/ensure-projects-final-editorial.cjs
 * Purpose: Apply the ensure projects final editorial production transformation or maintenance step while preserving canonical source/build contracts.
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
const stylePath = path.join(base, 'style.css');

const projects = {
  yarsha: {
    title: 'Yarsha', group: 'Product systems', domain: 'Web3 messaging + wallet UX', cardLabel: 'Mobile product · Web3',
    cardSummary: 'A chat product where wallet actions, Solana blinks, bots, and transaction states had to feel native to conversation without making financial approval feel casual.',
    audience: 'People messaging, using Solana actions, and approving wallet transactions',
    deck: 'A messaging product that knows when conversation should stay fast and when a financial action needs the interface to slow down.',
    briefTitle: 'Make money movement understandable without breaking the conversation',
    brief: 'Yarsha combines chat with actions that can trigger a wallet, move funds, or depend on a blockchain confirmation. Those interactions live in the same thread, but they should not carry the same level of friction. The design problem was to keep the reason for an action close to the conversation while making approval, waiting, failure, and completion unmistakable.',
    contribution: 'I designed the messaging-to-wallet journey: transaction cards, blinks, bot-triggered actions, review states, wallet handoff, pending behavior, failure recovery, and the resolved state that returns to the thread. My work focused on the interaction model between screens, not only the appearance of individual screens.',
    constraints: ['Wallet approval can happen outside the product, so the interface cannot promise instant progress.', 'Users need enough detail to make a safe decision without turning a chat thread into a finance dashboard.', 'Transaction history needs to remain understandable when someone revisits the conversation later.'],
    decisions: [['Keep the reason beside the request', 'The transaction begins next to the message or bot context that caused it, so intent is not lost during approval.'], ['Make approval a separate moment', 'Review creates a deliberate boundary between reading a message and authorizing a consequential action.'], ['Treat waiting and failure as normal states', 'Pending, rejected, failed, and completed outcomes receive their own copy, status, and next action.'], ['Return the result to the thread', 'The conversation becomes a durable record of what was requested and what actually happened.']],
    modelTitle: 'One conversation, four responsibilities',
    model: ['Conversation explains why the action exists.', 'Review explains what the user is about to authorize.', 'Wallet and network states explain what is happening now.', 'Resolution explains what happened and keeps that answer in the thread.'],
    edgeTitle: 'The happy path was the easy part',
    edge: ['Wallet rejection without losing the original transaction context.', 'Network delay where retrying too early could create confusion.', 'Completed transactions revisited long after the original conversation.'],
    delivery: 'I handed the flow over as a state model: entry conditions, required transaction data, wallet-dependent transitions, loading and pending behavior, recoverable versus terminal errors, and the information that persists after resolution. Engineering did not have to infer behavior from a set of static mockups.',
    outcomeTitle: 'A chat flow that knows when to slow down',
    outcomes: ['Wallet actions remain connected to the conversation that created them.', 'Signing is a deliberate step rather than an accidental continuation of chat.', 'Waiting and failure states have defined recovery behavior.', 'The thread preserves a readable transaction history.'],
    strengths: ['High-stakes state design', 'Web3 trust and clarity', 'Behavior-first handoff']
  },
  mokshya: {
    title: 'Mokshya.io', group: 'Websites + storytelling', domain: 'Web3 protocol website', cardLabel: 'Technical website · Web3',
    cardSummary: 'A protocol website structured so newcomers can understand the product quickly while technical visitors can reach mechanism, evidence, and developer context without wading through marketing copy.',
    audience: 'Prospective users, technical evaluators, and developers',
    deck: 'A technical product website with two depths of reading: enough clarity for a first visit, enough substance for someone deciding whether to trust the protocol.',
    briefTitle: 'Explain the protocol before asking people to understand it',
    brief: 'Mokshya had two audiences with different tolerance for technical depth. New visitors needed a useful mental model before protocol vocabulary became meaningful; technical visitors needed enough mechanism and proof to judge whether the product deserved attention. The site had to serve both without becoming either an oversimplified landing page or documentation disguised as marketing.',
    contribution: 'I shaped the information architecture, section hierarchy, responsive composition, and the translation of protocol concepts into a readable product story. The core work was sequencing: deciding what a visitor needs first, what should be progressively disclosed, and where evidence belongs in relation to each claim.',
    constraints: ['Technical accuracy and accessibility had to coexist on the same page.', 'Vague Web3 claims weaken trust quickly, so specificity had to do more work than visual spectacle.', 'Long technical sections needed a readable measure and clear hierarchy on smaller screens.'],
    decisions: [['Lead with the useful outcome', 'The opening establishes why the protocol matters before introducing the mechanism.'], ['Create two depths of reading', 'General explanation and developer detail remain connected without forcing either audience through the other path.'], ['Place evidence beside the claim', 'Supporting detail appears where doubt is likely to occur rather than in a remote trust section.'], ['Treat mobile as editorial design', 'Responsive layouts preserve reading order and measure instead of simply stacking desktop columns.']],
    modelTitle: 'A story that gets more technical only when it earns the right',
    model: ['Outcome establishes relevance.', 'Mechanism explains how the product works.', 'Evidence gives the explanation credibility.', 'Developer detail extends the model for technical evaluation.'],
    edgeTitle: 'Clarity without flattening the product',
    edge: ['Technical visitors should not feel the product has been reduced to marketing slogans.', 'New visitors should not encounter protocol vocabulary before they have context for it.', 'Responsive compression should not destroy the relationship between a claim and its evidence.'],
    delivery: 'I documented section logic, content priority, responsive reading order, and the relationship between summary and technical material so the site could expand without losing the structure of the story.',
    outcomeTitle: 'A technical site that reads in the right order',
    outcomes: ['Visitors can understand the product before encountering deep protocol detail.', 'General and technical audiences have distinct but connected reading paths.', 'Proof is part of the explanation rather than decorative reassurance.', 'Technical content stays readable across breakpoints.'],
    strengths: ['Technical information architecture', 'Product narrative design', 'Responsive editorial UX']
  },
  pihub: {
    title: 'piHub', group: 'Product systems', domain: 'Fintech product workflows', cardLabel: 'Fintech · Multi-role product',
    cardSummary: 'Investment, credit, application, and verification flows organized around the information users need most in financial products: current status, missing requirements, and the next useful action.',
    audience: 'Investors, creditors, applicants, and administrative users',
    deck: 'A fintech product designed around one recurring question: where am I in the process, what is holding it up, and what can I do next?',
    briefTitle: 'Turn procedural complexity into clear next actions',
    brief: 'piHub spans several financial journeys and user roles. The friction was not simply form length. It was uncertainty: whether a process was waiting on the user, the system, or a reviewer, and what a user should do after an incomplete, rejected, or delayed state. The experience needed continuity without forcing every financial task into the same interface pattern.',
    contribution: 'I worked across investor, creditor, application, verification, and account-management experiences. My focus was status language, forms, review moments, dashboard density, recovery paths, and the relationship between a visible state and the next action available to that role.',
    constraints: ['Several roles share infrastructure but need different information and permissions.', 'Verification creates periods where users may have nothing to do but still need confidence that progress is real.', 'Financial dashboards need scan density while applications need calm, focused decision-making.'],
    decisions: [['Keep status and action together', 'Current state, outstanding requirements, and the next step stay in the same information area.'], ['Change density with the job', 'Dashboards support scanning and comparison; applications and verification reduce competing detail.'], ['Make recovery actionable', 'Incomplete and rejected states explain what changed, what is still valid, and what can happen next.'], ['Design review as a journey', 'Submitted, waiting, approved, rejected, and resubmitted are product states rather than afterthought copy.']],
    modelTitle: 'Different workflows, one status language',
    model: ['Dashboards answer what needs attention.', 'Applications answer what information is required now.', 'Verification explains who or what the process is waiting on.', 'Recovery states explain how progress can continue.'],
    edgeTitle: 'Designing for the moments that create support tickets',
    edge: ['A user has submitted everything but review is still pending.', 'A document fails verification while the rest of the application remains valid.', 'A role has visibility into a process but not permission to act on it.'],
    delivery: 'I organized the work around reusable status, form, review, dashboard, and recovery patterns, while documenting where investor, creditor, applicant, and admin workflows needed to diverge. Consistency came from shared rules, not identical screens.',
    outcomeTitle: 'Less guessing about process state',
    outcomes: ['Status, requirements, and next actions are treated as one information problem.', 'High-density and high-attention screens use different layout rules.', 'Waiting and recovery states receive the same design attention as successful completion.', 'Role-specific flows can diverge without feeling like separate products.'],
    strengths: ['Fintech state architecture', 'Multi-role UX', 'Forms and recovery design']
  },
  'hamro-idea': {
    title: 'Hamro Idea', group: 'Websites + storytelling', domain: 'Software studio brand + website', cardLabel: 'Brand · Website · Front-end',
    cardSummary: 'A software-studio rebrand and multi-page website designed and built as one system, from positioning and service architecture to responsive implementation and search-friendly structure.',
    audience: 'Prospective clients evaluating a Nepal-based software studio',
    deck: 'A service website where positioning, interface design, responsive behavior, and front-end implementation were solved together instead of passed between disciplines.',
    briefTitle: 'Make the studio easier to understand before making it look impressive',
    brief: 'A prospective client needs to answer basic questions quickly: what does this team do, is the work relevant to my problem, and is there enough evidence to start a conversation? The redesign began with those decisions rather than with a visual refresh. The site needed to communicate the offer, support service discovery, and survive real content and responsive constraints.',
    contribution: 'I worked across positioning, information architecture, visual design, responsive UI, reusable sections, conversion paths, semantic markup, and front-end implementation. Being close to the build meant breakpoints, content lengths, accessibility, and performance could influence the design while it was still changing.',
    constraints: ['Internal service names are not always the language prospective clients use.', 'A multi-page site needs a shared system without making every service page feel cloned.', 'SEO, accessibility, performance, and responsive behavior affect whether the final design actually works.'],
    decisions: [['Clarify the offer before adding visual emphasis', 'Page hierarchy first explains who the studio helps and what each service means.'], ['Organize around client intent', 'Services are structured around the questions a prospective client is likely to ask, not the company org chart.'], ['Use code as design feedback', 'Real content, browser behavior, and responsive constraints expose weak assumptions earlier.'], ['Treat semantics as part of craft', 'Heading structure, accessibility, performance, and search readability are design decisions, not cleanup.']],
    modelTitle: 'A service journey from fit to proof to contact',
    model: ['Positioning establishes whether the studio is relevant.', 'Service architecture helps a visitor find the right capability.', 'Project proof gives the offer credibility.', 'Contextual calls to action turn evaluation into a conversation.'],
    edgeTitle: 'Designing for a site that will keep changing',
    edge: ['Service pages with very different amounts of copy.', 'Long project names and content that do not fit ideal mockup lengths.', 'Navigation and hierarchy that still need to work as new services are added.'],
    delivery: 'The browser was part of the design loop. Reusable layout patterns, semantic structure, responsive behavior, and content rules were implemented and refined together, reducing the usual translation loss between a design file and production.',
    outcomeTitle: 'A clearer offer and a smaller gap between design and build',
    outcomes: ['The service offer is organized around prospective-client needs.', 'Service pages have clearer paths to relevant proof and contact.', 'Responsive behavior was tested as part of design rather than deferred to implementation.', 'The site is easier to maintain because structure and semantics are reusable.'],
    strengths: ['End-to-end ownership', 'Design-to-code execution', 'Service positioning and IA']
  },
  masteriyo: {
    title: 'Masteriyo', group: 'Product systems', domain: 'WordPress LMS product design', cardLabel: 'EdTech · Product design',
    cardSummary: 'Product-design contribution inside an established LMS, covering course authoring, quizzes, learner states, and reusable patterns that had to fit an existing product and a larger design team.',
    audience: 'Course creators, learners, and administrators',
    deck: 'An LMS where creators and learners share a product system but should never feel like they are using the same interface with different labels.',
    briefTitle: 'Keep one product coherent across very different jobs',
    brief: 'Course creators think in curriculum, settings, publishing, and repeatability. Learners think in progress, comprehension, feedback, and what comes next. Administrators need oversight. The challenge was to reuse patterns where they lowered learning cost without letting the underlying data model dictate the hierarchy for every role.',
    contribution: 'I contributed product design within a larger team, working on course and quiz flows, learner states, hierarchy, and reusable interface patterns. The work had to fit an established WordPress LMS and be explicit enough for other designers and engineers to review, extend, and ship.',
    constraints: ['Course authoring can expose a large number of settings and content relationships.', 'Learner screens should not inherit administrative language or density because the data is shared.', 'New work has to respect an existing design system and a multi-designer workflow.'],
    decisions: [['Share conventions, not hierarchy', 'Creators and learners reuse familiar components while prioritizing different information based on their jobs.'], ['Reveal authoring complexity progressively', 'Course and quiz setup is broken into meaningful decisions rather than one long configuration surface.'], ['Keep learner feedback close to the next action', 'Progress, attempt state, completion, and what comes next stay visible without exposing admin concepts.'], ['Design so another teammate can continue', 'States, naming, and behavior are documented clearly enough for the feature to outlive one designer.']],
    modelTitle: 'One system, two very different mental models',
    model: ['Creators move from course structure into progressive configuration.', 'Learners move from content into feedback and the next learning action.', 'Shared components create familiarity without enforcing identical density.', 'Empty, error, and completion states remain part of the same interaction model.'],
    edgeTitle: 'The work between “create course” and “course complete”',
    edge: ['Partially configured courses that cannot be published yet.', 'Quiz attempts that need feedback without overwhelming the learner.', 'Features that must fit established patterns owned by a larger team.'],
    delivery: 'I prepared reusable components, state coverage, consistent terminology, and interaction notes so another designer or engineer could extend the flow without reconstructing intent from finished-looking screens.',
    outcomeTitle: 'A contribution that fits the product rather than competing with it',
    outcomes: ['Course authoring is framed as progressive configuration instead of a settings dump.', 'Learner states emphasize progress and feedback rather than administration.', 'New interface work remains consistent with the existing LMS system.', 'The scope of my contribution stays clear inside a larger team effort.'],
    strengths: ['Collaborative product design', 'Complex authoring UX', 'Design-system discipline']
  },
  orkest: {
    title: 'Orkest HQ', group: 'Product systems', domain: 'Modular SaaS platform', cardLabel: 'SaaS · Product architecture',
    cardSummary: 'A shared product grammar for CRM, Sales, Inventory, and Finance, designed so modules feel related without forcing genuinely different business workflows into one generic admin template.',
    audience: 'Business teams, operators, and administrators across CRM, sales, inventory, and finance',
    deck: 'A multi-module SaaS platform designed from the system outward: navigation, density, actions, and exceptions before individual screens were polished.',
    briefTitle: 'Decide what should repeat before designing what should differ',
    brief: 'Orkest is a platform problem before it is a screen problem. CRM, Sales, Inventory, and Finance share navigation, components, permissions, and data conventions, but each module represents a different operational job. The work therefore started by defining the product grammar that should remain stable across modules and the situations where variation is legitimate.',
    contribution: 'My scope focused on UX architecture and product design across the shared workspace and module structure: navigation levels, dashboards, tables, record views, information density, reusable patterns, and the rules for intentional variation.',
    constraints: ['Modules share infrastructure but not task models.', 'Operational users need enough information for fast scanning without drowning in secondary detail.', 'A design system becomes a liability when consistency is enforced where the business task genuinely differs.'],
    decisions: [['Define the grammar before the screen', 'Navigation, hierarchy, action placement, and state conventions are established before module-specific polish.'], ['Make location predictable', 'Global, module-level, and record-level actions live in consistent layers so users can build spatial memory.'], ['Design density around decisions', 'Tables and dashboards expose scan-level information first and move secondary detail into deliberate inspection.'], ['Document the exceptions', 'Variation is part of the system; when a workflow breaks a shared pattern, the reason is explicit.']],
    modelTitle: 'A stable shell with purposeful variation inside it',
    model: ['The workspace establishes global context.', 'Each module exposes its own entities and tasks inside that shared shell.', 'Dashboards and tables support scanning before inspection.', 'Record-level actions become specific without changing the product language around them.'],
    edgeTitle: 'Where “consistent” can become the wrong design decision',
    edge: ['A finance action that requires more confirmation than a CRM edit.', 'A dense inventory table that needs different scan priorities from a sales pipeline.', 'A new module that reuses navigation rules but introduces a new local workflow.'],
    delivery: 'The important handoff was a set of system rules, not a stack of finished screens: navigation levels, density conventions, shared components, state behavior, and explicit exceptions that engineering could apply when the platform grew.',
    outcomeTitle: 'A platform that can grow without redesigning its language every time',
    outcomes: ['Modules feel related without being flattened into one admin template.', 'Global, module, and record-level actions have clearer boundaries.', 'Dense operational surfaces follow deliberate information priorities.', 'The reusable system includes principled variation, not only repetition.'],
    strengths: ['SaaS architecture', 'Scalable design systems', 'Dense operational UI']
  },
  splashnode: {
    title: 'Splashnode', group: 'Websites + storytelling', domain: 'Technical platform website + front-end', cardLabel: 'Technical website · Front-end',
    cardSummary: 'A technical product website designed and built around a clear capability model, helping buyers understand how content, devices, and data fit together before diving into feature detail.',
    audience: 'Platform buyers evaluating content, device, and data-management capabilities',
    deck: 'A technical product website that turns a dense feature set into a product model a buyer can understand, scan, and then explore in depth.',
    briefTitle: 'Turn a feature inventory into a product people can explain',
    brief: 'Splashnode had enough technical capability to overwhelm a first-time visitor. Content, devices, and data management make sense internally as feature groups, but a buyer first needs to understand how those capabilities combine to solve a practical job. The website needed to establish that model before introducing deeper product detail.',
    contribution: 'I designed and coded the website experience: information hierarchy, capability grouping, responsive composition, interaction polish, semantic structure, and the front-end implementation that determined whether the final site still behaved like the design.',
    constraints: ['First-time visitors need orientation before technical depth becomes useful.', 'Responsive layouts must preserve the explanation order even when the composition changes.', 'Implementation choices affect performance, semantics, maintainability, and perceived quality.'],
    decisions: [['Organize around buyer jobs', 'Capabilities are grouped by what teams are trying to manage rather than by an internal feature inventory.'], ['Make the model scannable first', 'Visitors can understand the relationship between content, devices, and data before opening deeper detail.'], ['Protect the story on mobile', 'Composition changes at smaller widths, but the explanation sequence does not.'], ['Use implementation as design QA', 'Real content, spacing, browser behavior, and semantics are tested during the build rather than after it.']],
    modelTitle: 'Orientation first, technical depth second',
    model: ['The opening establishes what the platform helps teams manage.', 'Capability groups create a coherent mental model.', 'Deeper product detail supports technical evaluation after orientation.', 'Calls to action match different stages of buyer intent.'],
    edgeTitle: 'A website that still works when the browser gets involved',
    edge: ['Technical copy that becomes much longer than the ideal design frame.', 'Capability grids that collapse without changing the intended reading order.', 'Implementation choices that affect perceived polish, semantics, and performance.'],
    delivery: 'Because I also implemented the front end, responsive rules and interaction behavior were delivered as working code rather than left to interpretation. Design decisions could be tested against actual content and browser constraints.',
    outcomeTitle: 'A clearer product story with less design-to-build translation loss',
    outcomes: ['The platform is easier to understand as a connected system rather than a feature list.', 'Technical detail has a clear place after initial orientation.', 'Responsive behavior preserves the product narrative.', 'Design decisions survive into implementation more faithfully.'],
    strengths: ['Design plus implementation', 'Technical product storytelling', 'Responsive systems thinking']
  },
  morajaa: {
    title: 'Morajaa', group: 'Websites + storytelling', domain: 'B2B consulting website', cardLabel: 'B2B · Information architecture',
    cardSummary: 'A consulting website organized around the way prospects recognize business problems, connecting services, sectors, credibility, and enquiry without relying on internal consulting terminology.',
    audience: 'Decision-makers exploring consulting support by business problem, service, or sector',
    deck: 'A consulting website that lets prospects begin with the problem they recognize instead of asking them to learn the firm’s service taxonomy first.',
    briefTitle: 'Meet prospects in their language before introducing the firm’s language',
    brief: 'High-consideration buyers often know the business problem they need help with before they know the formal name of the consulting service. A site organized only around internal service categories makes the visitor do translation work before they can even evaluate fit. Morajaa needed several coherent routes into the same expertise.',
    contribution: 'I worked on information architecture, service and sector relationships, visual hierarchy, responsive composition, credibility content, and the path from exploration into a qualified enquiry.',
    constraints: ['Visitors may enter through a business problem, a known service, or an industry sector.', 'Premium presentation cannot reduce clarity or reading comfort.', 'An enquiry is more useful when the context that led to it is preserved.'],
    decisions: [['Start with recognition', 'Visitors can enter through the business problem they already understand rather than a taxonomy they have to learn.'], ['Connect service and sector paths', 'Related content reinforces itself instead of becoming isolated silos.'], ['Make precision the premium signal', 'Clear language, evidence, and pacing do more credibility work than decorative luxury cues.'], ['Ask for contact after context', 'Inquiry points appear after relevant material so the conversation starts with more useful information.']],
    modelTitle: 'Several paths into one coherent offer',
    model: ['Problem-led entry creates recognition.', 'Service pages explain the support available.', 'Sector pages make that expertise concrete in context.', 'Proof and enquiry close the evaluation loop.'],
    edgeTitle: 'Avoiding the usual B2B website traps',
    edge: ['Visitors arriving from a sector page without knowing the service name.', 'Similar services that need distinct explanations without duplicated pages.', 'Calls to action that should feel timely rather than permanently shouting for attention.'],
    delivery: 'I organized the site around reusable relationships between service, sector, proof, and enquiry content so the information architecture could scale without duplicating entire page structures.',
    outcomeTitle: 'A clearer route from “we have a problem” to “this firm can help”',
    outcomes: ['Prospects have multiple coherent ways to discover relevant expertise.', 'Service and sector content support one another instead of competing for navigation priority.', 'The premium tone comes from precision and pacing rather than decoration.', 'Inquiry paths retain more context from the visitor’s evaluation.'],
    strengths: ['B2B information architecture', 'Trust-led content design', 'Conversion without pressure']
  },
  'neverwinter-parser': {
    title: 'Neverwinter Live Parser', group: 'Product systems', domain: 'Game combat-log analysis', cardLabel: 'Data product · Gaming',
    cardSummary: 'A combat-log analysis interface that starts with encounter questions, then lets players drill into comparable metrics without presenting uncertain parser output as fact.',
    audience: 'Neverwinter players using combat data to understand encounters and performance',
    deck: 'A data-heavy interface that turns raw combat events into useful questions, summaries, and comparisons without pretending the parser knows more than it does.',
    briefTitle: 'Turn an event stream into something a player can act on',
    brief: 'Combat logs are rich in detail and poor in explanation. Players usually want to know what happened in an encounter, how performance changed, and where a build or rotation may have broken down. The interface needed a hierarchy that moves from orientation to diagnosis while keeping units, grouping, and uncertainty visible.',
    contribution: 'My work focused on the product model for parser output: encounter summaries, comparison patterns, drill-down structure, filters, metric hierarchy, and the boundary between reliable data and interpretation.',
    constraints: ['Large event streams need aggressive hierarchy before they become readable.', 'Metrics can mislead when units, grouping, or comparison context is hidden.', 'The interface cannot claim insight the parser cannot reliably derive from the source data.'],
    decisions: [['Begin with the player question', 'The interface opens on encounter-level answers rather than raw event output.'], ['Use summary as orientation, not a dead end', 'Users can move from a quick interpretation into the exact metrics behind it.'], ['Keep comparison context explicit', 'Units, grouping, and scale stay visible so visual differences do not create false conclusions.'], ['Expose data limits', 'Uncertainty and unsupported interpretation are shown instead of being disguised as analytical confidence.']],
    modelTitle: 'From encounter summary to evidence',
    model: ['Encounter summary provides orientation.', 'Metric groups support focused investigation.', 'Comparisons keep units and grouping consistent.', 'Filters narrow the question while preserving active analysis context.'],
    edgeTitle: 'Useful analysis without false certainty',
    edge: ['Incomplete combat data that should not be treated as a complete encounter.', 'Comparisons that look dramatic because their scale or grouping changed.', 'Filters that can remove context from the interpretation if their active state is not obvious.'],
    delivery: 'I treated the parser data contract and interface as one system. Available fields, aggregation rules, uncertainty, and interaction states define what the UI is allowed to claim, keeping the design aligned with technical capability.',
    outcomeTitle: 'A clearer path from raw data to a defensible conclusion',
    outcomes: ['Combat data is organized around encounter questions instead of event streams.', 'Summary and diagnostic views have distinct jobs.', 'Comparison patterns make context and units explicit.', 'The interface stays aligned with what the parser can actually support.'],
    strengths: ['Data-heavy product design', 'Analytical hierarchy', 'Technical constraint awareness']
  },
  'grid-labs': {
    title: 'Grid Labs', group: 'Websites + storytelling', domain: 'Hosting service landing experience', cardLabel: 'Commercial website · Front-end',
    cardSummary: 'A hosting landing experience stripped back to the buyer decisions that matter: service fit, plan comparison, included value, domain intent, and enough trust to continue.',
    audience: 'Visitors comparing hosting, domain, and service options',
    deck: 'A hosting page designed around buyer decisions rather than a wall of plans, badges, specifications, and promotional noise.',
    briefTitle: 'Make comparison easier than the hosting terminology',
    brief: 'Hosting pages often expose every possible technical detail before a visitor has decided what they actually need. The useful journey is simpler: identify the service, compare options, understand what is included, and decide whether to continue. The project focused on that commercial decision rather than pretending the static page was a full hosting platform.',
    contribution: 'I worked on service hierarchy, pricing comparison, domain-search affordance, trust content, responsive layout, and the lightweight front-end structure for the marketing experience.',
    constraints: ['Technical terminology can obscure a straightforward purchase decision.', 'Pricing becomes hard to compare when plans use inconsistent information order.', 'A static landing experience should not imply account functionality it does not provide.'],
    decisions: [['Prioritize the buyer questions', 'Service type, price, included value, and trust appear before secondary technical detail.'], ['Standardize the comparison', 'Plans use the same information order so users can compare without memorizing another card.'], ['Use trust after clarity', 'Reassurance supports an understood offer instead of trying to replace explanation.'], ['Keep implementation proportional', 'The front end stays lightweight because the project is a landing experience, not a hidden SaaS platform.']],
    modelTitle: 'A shorter route from intent to comparison',
    model: ['Service selection narrows intent.', 'Plan comparison makes trade-offs visible.', 'Domain and supporting tools clarify the next commercial step.', 'Trust and contact help the visitor continue with confidence.'],
    edgeTitle: 'Scope discipline is also a design decision',
    edge: ['Search controls that look functional should not promise unavailable account features.', 'Pricing cards need to remain comparable when copy lengths differ.', 'Technical detail should remain available without dominating the initial decision.'],
    delivery: 'I kept the static implementation deliberately simple: predictable sections, responsive rules, and reusable patterns without introducing a component architecture more complex than the site required.',
    outcomeTitle: 'A commercial page that asks less memory from the buyer',
    outcomes: ['The page follows the purchase decision more closely.', 'Pricing and service options are easier to compare consistently.', 'Trust content reinforces a clear offer instead of competing with it.', 'The implementation remains honest about the project scope.'],
    strengths: ['Commercial hierarchy', 'Responsive front-end craft', 'Scope discipline']
  },
  'zakra-furniture': {
    title: 'Zakra Furniture', group: 'Websites + storytelling', domain: 'WordPress / Elementor starter-site design', cardLabel: 'Commerce · WordPress',
    cardSummary: 'A furniture starter site designed for two users at once: shoppers browsing image-led products and site owners who need to update the catalogue without breaking the page.',
    audience: 'Furniture shoppers and site owners maintaining catalogue content',
    deck: 'An image-led furniture experience designed to stay coherent after real products, real copy, and real CMS edits replace the perfect demo content.',
    briefTitle: 'Design the template for the person who will edit it later',
    brief: 'Furniture discovery benefits from strong imagery, but a useful catalogue still needs categories, product information, and comparison cues. A starter site adds a second user: the site owner maintaining content. The design had to survive different images, copy lengths, and catalogue sizes rather than only working with carefully selected demo content.',
    contribution: 'I focused on category discovery, product cards, flexible section patterns, typography, spacing, responsive behavior, and editor-aware decisions for WordPress and Elementor.',
    constraints: ['Product photography varies widely in crop, aspect ratio, and visual weight.', 'Starter-site sections need to tolerate changing quantities of content.', 'Site owners need editing freedom without having to redesign the page each time.'],
    decisions: [['Let imagery lead without removing structure', 'Photography gets priority while categories and labels keep browsing understandable.'], ['Design for content variance', 'Blocks tolerate different product counts and copy lengths instead of depending on perfect demo content.'], ['Keep useful metadata nearby', 'Practical product information supports comparison without competing with the image.'], ['Treat editability as usability', 'Section rules are simple enough for ordinary CMS updates by non-designers.']],
    modelTitle: 'A visual catalogue with enough structure to stay usable',
    model: ['Category cues create the first browsing layer.', 'Product cards combine discovery with practical detail.', 'Flexible sections adapt to surrounding business content.', 'Responsive behavior preserves image priority without sacrificing readability.'],
    edgeTitle: 'The template still has to work after handoff',
    edge: ['Images with inconsistent crops or proportions.', 'Product names and descriptions that exceed demo lengths.', 'Section counts changing as the catalogue grows.'],
    delivery: 'The system was designed for a CMS, so image behavior, repeatable blocks, typography rules, and spacing conventions mattered as much as the initial composition. The page needed to remain coherent after real content replaced the demo.',
    outcomeTitle: 'A starter site built for content change, not a frozen screenshot',
    outcomes: ['Visual browsing has clearer category structure.', 'Product cards balance photography with useful decision information.', 'Sections can absorb normal catalogue and copy changes.', 'The design remains manageable for non-designer site owners.'],
    strengths: ['CMS-aware design', 'Image-led commerce UX', 'Reusable template systems']
  },
  designerex: {
    title: 'Designerex', group: 'Product systems', domain: 'Luxury fashion rental marketplace', cardLabel: 'Marketplace · Fashion',
    cardSummary: 'A marketplace design contribution balancing luxury product photography with stable listing information, comparison patterns, and interaction conventions that support practical rental decisions.',
    audience: 'People browsing and comparing designer fashion rentals',
    deck: 'Marketplace patterns that let luxury photography carry the emotion while practical rental information stays consistent enough for fast comparison.',
    briefTitle: 'Support desire and decision at the same time',
    brief: 'Luxury marketplaces need products to feel desirable without making comparison difficult. Photography should dominate the experience, but rental confidence still depends on stable, practical information. Too much premium styling can increase visual polish while slowing down the task.',
    contribution: 'This was a design contribution within a broader product. I focused on browsing and listing patterns, visual hierarchy, the relationship between imagery and metadata, and interaction conventions that fit the existing marketplace rather than claiming end-to-end ownership.',
    constraints: ['Photography should lead without hiding practical rental information.', 'Comparison becomes slower when listing details move or change format between cards.', 'Premium visual treatment can introduce interaction noise that competes with the products.'],
    decisions: [['Use photography as the lead, not the whole interface', 'Core listing information remains consistently available alongside the visual content.'], ['Make repeated patterns genuinely repeat', 'Stable positions and labels reduce the mental work of comparing several listings.'], ['Keep premium styling restrained', 'Polish supports desirability without adding unnecessary interaction.'], ['Be precise about contribution', 'The case reflects the part of the marketplace I actually worked on rather than inflating team work into individual ownership.']],
    modelTitle: 'Browse visually, compare consistently',
    model: ['Browse emphasizes visual discovery.', 'Listing metadata supports quick comparison.', 'Product detail carries depth that would make the grid too dense.', 'Interaction remains secondary to the fashion itself.'],
    edgeTitle: 'Premium does not have to mean precious',
    edge: ['Large imagery without consistent metadata placement.', 'Listing variations that create awkward empty or overloaded card states.', 'Hover and motion that should never become necessary for core information.'],
    delivery: 'The work was prepared to fit an existing product context, using reusable listing patterns and consistent hierarchy that a larger team could review and extend without introducing a parallel design language.',
    outcomeTitle: 'A more stable comparison experience inside a visually rich marketplace',
    outcomes: ['Listing patterns support more consistent comparison.', 'Premium presentation and practical information are better balanced.', 'Repeated interactions reduce relearning between products.', 'The portfolio scope accurately reflects a team contribution.'],
    strengths: ['Marketplace UX', 'Luxury visual hierarchy', 'Accurate team attribution']
  },
  sassboilerplate: {
    title: 'SassBoilerplate', group: 'Tools + front-end', domain: 'Front-end developer utility', cardLabel: 'Developer experience · Sass',
    cardSummary: 'A lightweight Sass starter focused on predictable file responsibilities, fewer repeated setup decisions, and a low cost of removing conventions when a project needs something different.',
    audience: 'Developers starting small static front-end projects',
    deck: 'A small front-end utility built around a deliberately boring idea: the starter should remove repeated work without becoming another framework to learn.',
    briefTitle: 'Standardize the setup without standardizing every future project',
    brief: 'Boilerplate is useful only when it removes repeated decisions without becoming maintenance debt. The project was a developer-experience exercise: which file structure, defaults, and naming conventions are valuable enough to repeat, and which assumptions should stay out because future projects may not need them?',
    contribution: 'I defined the Sass structure, file responsibilities, naming conventions, imports, and default workflow for small static front-end projects. The emphasis was legibility and maintenance rather than maximizing tooling.',
    constraints: ['Unused boilerplate quickly becomes maintenance debt.', 'Folder conventions help only when another developer can understand what belongs where.', 'Small static projects do not need enterprise-level complexity by default.'],
    decisions: [['Give styles predictable homes', 'Responsibilities are separated so changes do not accumulate in one large stylesheet.'], ['Keep defaults intentionally small', 'Repeated setup is automated without assuming every project needs the same component system.'], ['Make removal cheap', 'Conventions stay loosely coupled enough to replace when a project has different needs.'], ['Optimize for the next developer', 'The structure should be understandable without a verbal tour from its author.']],
    modelTitle: 'A starter that stays out of the way',
    model: ['A new project begins from a known structure.', 'Imports and responsibilities remain predictable as styles grow.', 'Unused layers can be removed without unraveling the setup.', 'Documentation and naming explain the workflow without hidden conventions.'],
    edgeTitle: 'The real test is the second project, not the first',
    edge: ['A project that needs only half the provided structure.', 'Another developer taking over without knowing the original conventions.', 'A starter that grows until deleting it becomes harder than using it.'],
    delivery: 'For a developer utility, the repository itself is the handoff. Structure, naming, and documentation need to communicate intent clearly enough that another developer can adopt, modify, or remove the starter without relying on tribal knowledge.',
    outcomeTitle: 'Less setup, less hidden coupling',
    outcomes: ['Small projects begin from a repeatable Sass structure.', 'Style responsibilities are easier to locate and maintain.', 'The starter reduces repeated setup without overcommitting future projects.', 'The workflow stays easy to adapt or remove.'],
    strengths: ['Front-end systems thinking', 'Developer experience', 'Maintainability over novelty']
  },
  zapp: {
    title: 'Zapp Today', group: 'Product systems', domain: 'Logistics product', cardLabel: 'Logistics · Multi-role product',
    cardSummary: 'A shared delivery lifecycle translated into different customer, driver, and operations experiences, with special attention to status consistency and the exceptions that create real support work.',
    audience: 'Customers, drivers, and operations/support teams sharing one delivery lifecycle',
    deck: 'A logistics product where each role gets a different interface but everyone still has to agree on what is happening to the same delivery.',
    briefTitle: 'Design one delivery reality for three very different users',
    brief: 'Customers want confidence and understandable status. Drivers need the next operational task with minimal distraction. Operations and support need enough history and exception context to recover when the happy path fails. All three roles see the same delivery, but they should not see the same screen.',
    contribution: 'My work focused on booking context, driver tasks, tracking and status, state transitions, and exception handling across customer, driver, and operational views. I used one delivery lifecycle underneath role-specific information priorities.',
    constraints: ['Each role needs different information from the same delivery state.', 'Drivers need low-distraction interfaces during active work.', 'Delayed, reassigned, interrupted, and failed deliveries create more UX risk than straightforward completion.'],
    decisions: [['Share the state model, not the screen', 'Customer, driver, and operations interfaces differ while using the same language for the delivery lifecycle.'], ['Put the next task first for drivers', 'Active-work screens prioritize action and route context over secondary operational detail.'], ['Expose detail progressively', 'Customers see enough information for confidence without inheriting internal operational complexity.'], ['Design exceptions before they become support tickets', 'Delay, interruption, reassignment, and failure have defined states and recovery paths.']],
    modelTitle: 'One lifecycle, three views of it',
    model: ['Booking creates the delivery request and baseline context.', 'Driver views turn the lifecycle into immediate operational tasks.', 'Customer tracking translates the same state into useful confidence.', 'Operations views preserve history and exception detail for recovery.'],
    edgeTitle: 'Logistics gets interesting when the delivery stops being normal',
    edge: ['A driver is reassigned while a customer is already tracking the order.', 'A delivery is delayed without a reliable new completion time.', 'Operations needs to understand what changed without exposing internal noise to the customer.'],
    delivery: 'Handoff centered on one shared lifecycle: state names, transition rules, actions available to each role, and exception behavior. That is more durable than separate screen sets that happen to look consistent but disagree about state.',
    outcomeTitle: 'Different interfaces, one consistent delivery story',
    outcomes: ['Customer, driver, and operations views share a coherent delivery language.', 'Driver screens prioritize the next operational action.', 'Customers receive useful progress without unnecessary internal detail.', 'Operations has a clearer model for understanding and recovering from exceptions.'],
    strengths: ['Multi-role service design', 'Operational state modeling', 'Exception and recovery UX']
  }
};

const groupOrder = ['Product systems', 'Websites + storytelling', 'Tools + front-end'];

/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function esc(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}
/**
 * Function contract: strip
 * Purpose: Remove module behavior without disturbing required surrounding ensure projects final editorial repository tool state.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function strip(value) {
  return String(value ?? '').replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
}
/**
 * Function contract: fact
 * Purpose: Implement the fact responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `main`: input consumed by this operation; `label`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function fact(main, label) {
  const dt = new RegExp(`<dt[^>]*>\\s*${label}\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`, 'i').exec(main);
  if (dt) return strip(dt[1]);
  const old = new RegExp(`<h5[^>]*>\\s*${label}\\s*<\\/h5>\\s*<p[^>]*>([\\s\\S]*?)<\\/p>`, 'i').exec(main);
  return old ? strip(old[1]) : '';
}
/**
 * Function contract: year
 * Purpose: Implements the year responsibility for this module.
 * Inputs: main.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: year
 * Purpose: Implement the year responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function year(main) {
  const direct = fact(main, 'Year');
  if (direct) return direct;
  const text = strip(main);
  return text.match(/\b20\d{2}(?:\s*[–-]\s*20?\d{2})?\b/)?.[0] || '';
}
/**
 * Function contract: cover
 * Purpose: Implements the cover responsibility for this module.
 * Inputs: main, title, loading.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: cover
 * Purpose: Implement the cover responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `main`: input consumed by this operation; `title`: input consumed by this operation; `loading`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function cover(main, title, loading = 'eager') {
  const source = main.match(/<figure[^>]*class=["'][^"']*(?:nrs-hireable-case-cover|agent-case-cover)[^"']*["'][^>]*>[\s\S]*?<\/figure>/i)?.[0] || main;
  const img = source.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (!img) return '';
  const alt = /\balt=["']([^"']*)["']/i.exec(img[0])?.[1] || `${title} interface`;
  return `<figure class="agent-case-cover nrs-hireable-case-cover"><img src="${esc(img[1])}" alt="${esc(alt)}" loading="${loading}" decoding="async"></figure>`;
}
/**
 * Function contract: coverImage
 * Purpose: Implements the cover image responsibility for this module.
 * Inputs: main, title.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: coverImage
 * Purpose: Implement the cover image responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `main`: input consumed by this operation; `title`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function coverImage(main, title) {
  const source = main.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (!source) return '';
  const alt = /\balt=["']([^"']*)["']/i.exec(source[0])?.[1] || `${title} project preview`;
  return `<img src="${esc(source[1])}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}
/**
 * Function contract: externalLinks
 * Purpose: Implements the external links responsibility for this module.
 * Inputs: main.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: externalLinks
 * Purpose: Implement the external links responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function externalLinks(main) {
  const seen = new Set(); const links = [];
  for (const match of main.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    if (/nischhalsubba\.com\.np/i.test(match[1]) || seen.has(match[1])) continue;
    seen.add(match[1]); links.push([strip(match[2]) || 'Open public artifact', match[1]]);
  }
  return links.slice(0, 5);
}
/**
 * Function contract: list
 * Purpose: Implements the list responsibility for this module.
 * Inputs: items.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: list
 * Purpose: Return module behavior from the supplied inputs or current ensure projects final editorial repository tool state.
 * Inputs: `items`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested module behavior; early-return/empty-state behavior follows the explicit branches in this function.
 */
function list(items) { return `<ul class="nrs-case-list">${items.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (item) => `<li>${esc(item)}</li>`).join('')}</ul>`; }
/**
 * Function contract: decisionCards
 * Purpose: Implement the decision cards responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `items`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function decisionCards(items) {
  return `<div class="agent-decision-grid nrs-case-decision-grid">${items.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[title, text]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([title, text]) => `<article class="agent-decision nrs-case-decision-card"><span class="agent-meta">Decision</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div>`;
}
/**
 * Function contract: section
 * Purpose: Implement the section responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `number`: input consumed by this operation; `label`: input consumed by this operation; `title`: input consumed by this operation; `body`: input consumed by this operation; `className`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function section(number, label, title, body, className = '') {
  return `<section class="agent-section ${className}"><div class="agent-frame nrs-case-section"><header class="nrs-case-section-head"><span class="agent-meta">${String(number).padStart(2, '0')} · ${esc(label)}</span><h2>${esc(title)}</h2></header><div class="nrs-case-section-body">${body}</div></div></section>`;
}
/**
 * Function contract: facts
 * Purpose: Implement the facts responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `main`: input consumed by this operation; `item`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function facts(main, item) {
  const values = [
    ['My role', fact(main, 'Role') || 'Product design contribution'],
    ['Year', year(main)],
    ['Product', item.domain],
    ['Users', item.audience],
  ].filter(/** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `[, value]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ ([, value]) => value);
  return `<dl class="agent-case-facts nrs-hireable-case-facts">${values.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[label, value]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
}
/**
 * Function contract: evidence
 * Purpose: Implement the evidence responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function evidence(main) {
  const links = externalLinks(main);
  if (!links.length) return '<p class="nrs-case-evidence-note">There is no public interactive link attached to this project. I keep the write-up limited to work I can discuss and defend publicly rather than filling the gap with invented proof.</p>';
  return `<div class="agent-evidence-links nrs-case-evidence-links">${links.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[label, url]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([label, url]) => `<a class="agent-btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join('')}</div><p class="nrs-case-evidence-note">These links are the public material currently available for the project. I do not claim private research or product metrics that are not available to show.</p>`;
}
/**
 * Function contract: renderCase
 * Purpose: Implement the render case responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `slug`: input consumed by this operation; `originalMain`: input consumed by this operation; `item`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function renderCase(slug, originalMain, item) {
  const hero = `<header class="agent-case-hero nrs-hireable-case-hero"><div class="agent-frame agent-case-grid"><nav class="nrs-case-breadcrumb" aria-label="Breadcrumb"><a href="/projects">Selected work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(item.title)}</span></nav><div class="agent-case-title-wrap"><span class="agent-kicker">${esc(item.domain)}</span><h1 class="agent-case-title">${esc(item.title)}</h1></div><p class="agent-case-deck">${esc(item.deck)}</p>${facts(originalMain, item)}${cover(originalMain, item.title)}</div></header>`;
  const brief = section(1, 'The brief', item.briefTitle, `<p>${esc(item.brief)}</p><div class="nrs-case-callout"><strong>Who this was for</strong><p>${esc(item.audience)}</p></div>`, 'agent-section--compact');
  const role = section(2, 'My contribution', 'What I was responsible for', `<p>${esc(item.contribution)}</p><h3 class="nrs-case-subhead">Constraints I could not design away</h3>${list(item.constraints)}`);
  const decisions = section(3, 'Product decisions', 'The choices that mattered most', decisionCards(item.decisions), 'agent-section--inverse');
  const model = section(4, 'Experience model', item.modelTitle, list(item.model));
  const edge = section(5, 'Reality checks', item.edgeTitle, list(item.edge));
  const delivery = section(6, 'From design to build', 'What the handoff needed to make explicit', `<p>${esc(item.delivery)}</p>`, 'agent-section--compact');
  const outcome = section(7, 'Outcome', item.outcomeTitle, `${list(item.outcomes)}<p class="nrs-case-evidence-note"><strong>About impact:</strong> I describe the delivered design outcome here. I do not manufacture conversion lifts, research findings, or business metrics that are not public.</p>`);
  const proof = section(8, 'Proof', 'Public work you can inspect', evidence(originalMain), 'agent-section--compact');
  const takeaway = section(9, 'What this demonstrates', 'The part of my practice this project made stronger', `<div class="nrs-case-signal-grid">${item.strengths.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `strength`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (strength) => `<article><strong>${esc(strength)}</strong></article>`).join('')}</div><div class="agent-actions nrs-case-actions"><a class="agent-btn agent-btn--primary" href="/projects">Back to selected work</a><a class="agent-btn" href="/contact">Start a project conversation</a></div>`);
  return `<main id="main-content" class="agent-main nrs-hireable-case nrs-final-case" data-project-slug="${esc(slug)}">${hero}${brief}${role}${decisions}${model}${edge}${delivery}${outcome}${proof}${takeaway}</main>`;
}

const originals = new Map();
for (const [slug, item] of Object.entries(projects)) {
  const file = path.join(base, `project-${slug}.html`);
  if (!fs.existsSync(file)) throw new Error(`[projects-final-editorial] Missing project-${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
  if (!main) throw new Error(`[projects-final-editorial] Missing main for ${slug}`);
  originals.set(slug, main);
  html = html.replace(main, renderCase(slug, main, item));
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(item.title)} — Product Design Case Study | Nischhal Raj Subba</title>`);
  fs.writeFileSync(file, html, 'utf8');
}

/**
 * Function contract: renderWorkCard
 * Purpose: Implements the render work card responsibility for this module.
 * Inputs: slug, item.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: renderWorkCard
 * Purpose: Implement the render work card responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: `slug`: input consumed by this operation; `item`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Boolean predicate result consumed by the caller.
 */
function renderWorkCard(slug, item) {
  const detail = fs.readFileSync(path.join(base, `project-${slug}.html`), 'utf8');
  const main = detail.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || detail;
  return `<a class="nrs-work-card" href="/project-${esc(slug)}"><div class="nrs-work-card-media">${coverImage(main, item.title)}</div><div class="nrs-work-card-copy"><span class="agent-meta">${esc(item.cardLabel)}</span><h3>${esc(item.title)}</h3><p>${esc(item.cardSummary)}</p><span class="nrs-work-card-link">Read the case <span aria-hidden="true">↗</span></span></div></a>`;
}
/**
 * Function contract: renderProjectsMain
 * Purpose: Implements the render projects main responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: renderProjectsMain
 * Purpose: Implement the render projects main responsibility owned by the ensure projects final editorial repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function renderProjectsMain() {
  const groups = groupOrder.map(/** Callback contract: Processes the callback step for group order without leaking orchestration details to the caller. Inputs: group, index. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `group`, `index`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `group`, `index`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate/result. */ (group, index) => {
    const entries = Object.entries(projects).filter(/** Callback contract: Processes the callback step for object.entries(projects) without leaking orchestration details to the caller. Inputs: [, item]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `[, item]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `[, item]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([, item]) => item.group === group);
    const descriptions = {
      'Product systems': 'Multi-role products, state-heavy workflows, data interfaces, and systems where the hard work sits between the screens.',
      'Websites + storytelling': 'Websites where information architecture, positioning, responsive behavior, and implementation carry as much weight as visual polish.',
      'Tools + front-end': 'Smaller technical work that shows how I think about maintainability, developer experience, and sensible scope.',
    };
    return `<section class="agent-section nrs-work-group"><div class="agent-frame"><div class="nrs-work-group-head"><span class="agent-meta">0${index + 1} · ${esc(group)}</span><h2>${esc(group)}</h2><p>${esc(descriptions[group])}</p></div><div class="nrs-work-grid">${entries.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[slug, item]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ ([slug, item]) => renderWorkCard(slug, item)).join('')}</div></div></section>`;
  }).join('');
  return `<main id="main-content" class="agent-main nrs-projects-editorial"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Selected product work</span><h1>Work that shows how I think when the product gets complicated.</h1></div><div class="nrs-work-intro"><p>These are not gallery pieces. They are case studies about constraints, product decisions, state design, information architecture, implementation, and the details that determine whether an interface is actually buildable.</p><p>I keep the scope honest. When public metrics or research are unavailable, I show the decisions and delivered work I can defend in a hiring conversation.</p></div></div></header>${groups}<section class="agent-section agent-section--inverse nrs-work-close"><div class="agent-frame nrs-work-close-grid"><div><span class="agent-meta">Looking for a product designer?</span><h2>I am most useful when the brief is incomplete and the product has real constraints.</h2></div><div><p>I work across product UX, interface systems, responsive design, and implementation handoff. The common thread is turning ambiguity into a product the team can reason about and build.</p><a class="agent-btn" href="/contact">Talk about the role or project</a></div></div></section></main>`;
}

const projectsFile = path.join(base, 'projects.html');
if (!fs.existsSync(projectsFile)) throw new Error('[projects-final-editorial] Missing projects.html');
let projectsHtml = fs.readFileSync(projectsFile, 'utf8');
const projectsMain = projectsHtml.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
if (!projectsMain) throw new Error('[projects-final-editorial] Missing projects main');
projectsHtml = projectsHtml.replace(projectsMain, renderProjectsMain());
projectsHtml = projectsHtml.replace(/<title>[\s\S]*?<\/title>/i, '<title>Product Design Case Studies | Nischhal Raj Subba</title>');
projectsHtml = projectsHtml.replace(/<meta\s+name=["']description["'][^>]*>/i, '<meta name="description" content="Product design case studies by Nischhal Raj Subba covering SaaS, fintech, Web3, data-heavy products, websites, design systems, and front-end implementation." />');
projectsHtml = projectsHtml.replace(/<meta\s+property=["']og:title["'][^>]*>/i, '<meta property="og:title" content="Product Design Case Studies | Nischhal Raj Subba" />');
projectsHtml = projectsHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/i, '<meta property="og:description" content="Case studies focused on product decisions, constraints, state design, information architecture, implementation, and honest scope." />');
fs.writeFileSync(projectsFile, projectsHtml, 'utf8');

if (!fs.existsSync(stylePath)) throw new Error('[projects-final-editorial] Missing style.css');
const start = '/* nrs-projects-final-editorial-v1:start */';
const end = '/* nrs-projects-final-editorial-v1:end */';
const marker = /\/\* nrs-projects-final-editorial-v\d+:start \*\/[\s\S]*?\/\* nrs-projects-final-editorial-v\d+:end \*\//g;
const css = `${start}
/* Hard contrast contract for dark editorial sections. Do not inherit heading colors from light-theme rules. */
.agent-portfolio .nrs-final-case .agent-section--inverse,
.agent-portfolio .nrs-projects-editorial .agent-section--inverse {
  background: #10110f !important;
  color: #f7f2e8 !important;
}
.agent-portfolio .nrs-final-case .agent-section--inverse .nrs-case-section-head h2,
.agent-portfolio .nrs-final-case .agent-section--inverse .nrs-case-section-head .agent-meta,
.agent-portfolio .nrs-final-case .agent-section--inverse .nrs-case-decision-card h3,
.agent-portfolio .nrs-final-case .agent-section--inverse .nrs-case-decision-card .agent-meta,
.agent-portfolio .nrs-projects-editorial .agent-section--inverse h2,
.agent-portfolio .nrs-projects-editorial .agent-section--inverse .agent-meta {
  color: #f7f2e8 !important;
  opacity: 1 !important;
  visibility: visible !important;
  mix-blend-mode: normal !important;
  -webkit-text-fill-color: #f7f2e8 !important;
}
.agent-portfolio .nrs-final-case .agent-section--inverse .nrs-case-decision-card p,
.agent-portfolio .nrs-projects-editorial .agent-section--inverse p {
  color: #d8d1c5 !important;
  opacity: 1 !important;
}
.agent-portfolio .nrs-final-case .agent-section--inverse .nrs-case-decision-card {
  background: #191a17 !important;
  border-color: rgba(247,242,232,.28) !important;
}

.agent-portfolio .nrs-projects-editorial .agent-page-hero {
  padding-block: clamp(5rem, 9vw, 9rem) clamp(4rem, 7vw, 7rem);
  border-bottom: 1px solid var(--ap-line);
}
.agent-portfolio .nrs-projects-editorial .agent-page-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(20rem, .8fr);
  gap: clamp(2.5rem, 7vw, 8rem);
  align-items: end;
}
.agent-portfolio .nrs-projects-editorial .agent-page-hero h1 {
  max-width: 12ch;
  margin: 1rem 0 0;
  font: 760 clamp(3.6rem, 7.5vw, 8rem)/.88 var(--ap-font-display);
  letter-spacing: -.075em;
  text-wrap: balance;
}
.agent-portfolio .nrs-work-intro {
  max-width: 39rem;
  color: var(--ap-ink-soft);
  font-size: clamp(1.05rem, 1.35vw, 1.25rem);
  line-height: 1.65;
}
.agent-portfolio .nrs-work-intro p { margin: 0 0 1rem; }
.agent-portfolio .nrs-work-group { padding-block: clamp(4.5rem, 7vw, 7rem); }
.agent-portfolio .nrs-work-group + .nrs-work-group { border-top: 1px solid var(--ap-line); }
.agent-portfolio .nrs-work-group-head {
  display: grid;
  grid-template-columns: minmax(12rem, .8fr) minmax(0, 1.2fr);
  column-gap: clamp(2rem, 6vw, 7rem);
  row-gap: 1rem;
  margin-bottom: clamp(2.5rem, 4vw, 4rem);
}
.agent-portfolio .nrs-work-group-head .agent-meta { grid-column: 1 / -1; }
.agent-portfolio .nrs-work-group-head h2 {
  margin: 0;
  font: 740 clamp(2.5rem, 5vw, 5rem)/.92 var(--ap-font-display);
  letter-spacing: -.06em;
}
.agent-portfolio .nrs-work-group-head p {
  max-width: 40rem;
  margin: 0;
  color: var(--ap-ink-soft);
  font-size: 1.05rem;
  line-height: 1.7;
}
.agent-portfolio .nrs-work-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
}
.agent-portfolio .nrs-work-card {
  display: grid;
  grid-template-rows: auto 1fr;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  border: 1px solid var(--ap-line);
  background: transparent;
  transition: background-color 180ms ease, border-color 180ms ease;
}
.agent-portfolio .nrs-work-card:hover,
.agent-portfolio .nrs-work-card:focus-visible {
  background: var(--ap-surface);
  border-color: var(--ap-line-strong);
}
.agent-portfolio .nrs-work-card:focus-visible { outline: 2px solid var(--ap-signal); outline-offset: 3px; }
.agent-portfolio .nrs-work-card-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid var(--ap-line);
  background: var(--ap-surface);
}
.agent-portfolio .nrs-work-card-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.agent-portfolio .nrs-work-card-copy { display: grid; align-content: start; gap: .9rem; padding: clamp(1.25rem, 2vw, 1.8rem); }
.agent-portfolio .nrs-work-card-copy h3 {
  margin: .25rem 0 0;
  color: var(--ap-ink);
  font: 740 clamp(2rem, 3.4vw, 3.35rem)/.95 var(--ap-font-display);
  letter-spacing: -.055em;
}
.agent-portfolio .nrs-work-card-copy p { max-width: 42rem; margin: 0; color: var(--ap-ink-soft); font-size: 1rem; line-height: 1.65; }
.agent-portfolio .nrs-work-card-link { margin-top: .5rem; color: var(--ap-ink); font: 650 .75rem/1.3 var(--ap-font-mono); letter-spacing: .055em; text-transform: uppercase; }
.agent-portfolio .nrs-work-close { padding-block: clamp(4.5rem, 7vw, 7rem); }
.agent-portfolio .nrs-work-close-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(2.5rem, 7vw, 8rem); align-items: end; }
.agent-portfolio .nrs-work-close h2 { max-width: 14ch; margin: 1rem 0 0; font: 740 clamp(2.8rem, 5vw, 5.5rem)/.92 var(--ap-font-display); letter-spacing: -.06em; }
.agent-portfolio .nrs-work-close p { max-width: 38rem; line-height: 1.7; }
.agent-portfolio .nrs-work-close .agent-btn { margin-top: 1.25rem; }

@media (max-width: 1023px) {
  .agent-portfolio .nrs-projects-editorial .agent-page-hero-grid,
  .agent-portfolio .nrs-work-close-grid { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-work-group-head { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-work-group-head .agent-meta { grid-column: auto; }
}
@media (max-width: 767px) {
  .agent-portfolio .nrs-projects-editorial .agent-page-hero { padding-block: 3.5rem 3rem; }
  .agent-portfolio .nrs-projects-editorial .agent-page-hero h1 { font-size: clamp(3.1rem, 16vw, 5rem); }
  .agent-portfolio .nrs-work-grid { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-work-group { padding-block: 3.5rem; }
  .agent-portfolio .nrs-work-card-copy { padding: 1.2rem; }
}
@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .nrs-work-card { transition: none !important; }
}
${end}`;
let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

for (const [slug] of Object.entries(projects)) {
  const html = fs.readFileSync(path.join(base, `project-${slug}.html`), 'utf8');
  for (const required of ['The choices that mattered most', 'What the handoff needed to make explicit', 'Public work you can inspect', 'Back to selected work']) {
    if (!html.includes(required)) throw new Error(`[projects-final-editorial] ${slug}: missing ${required}`);
  }
}
const finalProjects = fs.readFileSync(projectsFile, 'utf8');
if (!finalProjects.includes('Work that shows how I think when the product gets complicated.')) throw new Error('[projects-final-editorial] Projects hero rewrite missing');
if ((finalProjects.match(/class="nrs-work-card"/g) || []).length !== Object.keys(projects).length) throw new Error('[projects-final-editorial] Expected one index card per project');
if (!fs.readFileSync(stylePath, 'utf8').includes('-webkit-text-fill-color: #f7f2e8 !important')) throw new Error('[projects-final-editorial] Hard contrast contract missing');

console.log(`[projects-final-editorial] Rewrote ${Object.keys(projects).length} project detail pages, the projects index, microcopy, and final contrast styles.`);
