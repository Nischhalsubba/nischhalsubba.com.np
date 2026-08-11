/**
 * @fileoverview scripts/ensure-senior-case-studies.cjs
 * Purpose: Apply the ensure senior case studies production transformation or maintenance step while preserving canonical source/build contracts.
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

const cases = {
  yarsha: {
    title: 'Yarsha',
    domain: 'Web3 messaging + wallet UX',
    audience: 'People using chat to share Solana actions, interact with bots, and approve wallet transactions',
    deck: 'I designed the point where conversation becomes transaction: a chat experience that keeps wallet actions understandable before, during, and after approval.',
    situation: 'The difficult part of Yarsha was not adding crypto actions to a messenger. It was deciding how much friction a financial action needs inside an interface built around speed. A message can be casual; a signature or transfer cannot. The experience therefore had to preserve conversational context while making consequence, status, and recovery unmistakable.',
    remit: 'My scope covered the messaging-to-wallet journey: transaction cards, Solana blinks, bot-triggered actions, review states, wallet handoff, pending behavior, failure states, and the final transaction record inside the thread. I worked at the interaction-model level, not just the screen level.',
    constraints: ['Wallet approval happens partly outside the product, so the interface cannot pretend every transition is instant or controllable.', 'Users need enough information to make a safe decision without turning every wallet action into a dense finance form.', 'A transaction has to remain legible when the user returns to the conversation hours or days later.'],
    moves: [['Keep intent attached to the action', 'The transaction starts in the thread, next to the message or bot context that caused it.'], ['Create a deliberate approval boundary', 'Review separates understanding an action from authorizing it, so signing never feels like an accidental continuation of chat.'], ['Model the states people actually meet', 'Pending, rejected, failed, and completed are treated as normal product states with their own copy and next actions.'], ['Write the outcome back into the conversation', 'The thread becomes the durable record of what was requested and what ultimately happened.']],
    system: ['Conversation establishes why the action exists.', 'Review establishes what will happen and what the user is authorizing.', 'Wallet and network states communicate progress without false certainty.', 'Resolution returns to the thread with enough context to stand on its own later.'],
    delivery: 'For engineering, I reduced the flow to a state model: entry conditions, required transaction data, wallet-dependent transitions, pending behavior, recoverable and terminal errors, and the information that persists after resolution. That makes the design implementable without reverse-engineering intent from mockups.',
    result: ['Wallet actions remain connected to the conversation that created them.', 'Approval is a distinct, deliberate step instead of a casual chat interaction.', 'Failure and waiting states have a defined place in the product model.', 'The conversation preserves a readable transaction history.'],
    success: ['Users can describe what they are about to approve before leaving the product for wallet confirmation.', 'Pending and failed transactions tell users whether to wait, retry, change something, or stop.', 'A completed transaction still makes sense when the conversation is revisited later.'],
    strengths: ['High-stakes state design', 'Web3 trust and clarity', 'Behavior-first handoff']
  },
  mokshya: {
    title: 'Mokshya.io',
    domain: 'Web3 protocol website',
    audience: 'Prospective users, technical evaluators, and developers',
    deck: 'I turned a technical protocol into a website that can be understood quickly without stripping away the depth technical visitors need to trust it.',
    situation: 'Mokshya had an audience split common to technical products: newcomers needed a useful mental model, while experienced visitors wanted mechanism, proof, and developer context. Leading with implementation detail would lose one group; hiding it behind generic marketing language would lose the other.',
    remit: 'I shaped the information architecture, page hierarchy, responsive composition, and the translation of protocol concepts into a product story. The work was mainly about sequencing: what a visitor needs to understand first, what can wait, and where proof should appear to support a claim.',
    constraints: ['Technical accuracy and accessibility had to coexist on the same site.', 'Web3 audiences are sensitive to vague claims, so credibility had to come from specificity rather than spectacle.', 'Long technical sections still needed comfortable reading measure and hierarchy on small screens.'],
    moves: [['Start with the useful outcome', 'The first scan explains why the protocol matters before asking visitors to learn how it works.'], ['Offer progressive technical depth', 'General explanation and developer detail are connected, but neither audience is forced through the other path.'], ['Attach evidence to the claim it supports', 'Terminology, proof, and supporting detail appear where they can answer doubt instead of living in a distant trust section.'], ['Design mobile as a reading experience', 'Responsive layouts preserve sequence and measure rather than collapsing desktop columns mechanically.']],
    system: ['Outcome creates the initial mental model.', 'Mechanism explains how the product produces that outcome.', 'Evidence gives the explanation credibility.', 'Developer detail extends the model for people who need implementation depth.'],
    delivery: 'I documented section logic, responsive reading order, content priority, and the relationship between summary and technical detail so the site could grow without losing its narrative structure.',
    result: ['The product can be understood before the visitor encounters protocol vocabulary.', 'General and technical audiences have distinct depths of reading within one coherent site.', 'Proof works as part of the explanation instead of decorative reassurance.', 'Technical content keeps a readable structure across breakpoints.'],
    success: ['A first-time visitor can explain the protocol in plain language after a short scan.', 'A developer can reach meaningful technical context without searching through the entire marketing site.', 'Visitors can distinguish product claims from the evidence that supports them.'],
    strengths: ['Technical information architecture', 'Product narrative design', 'Responsive editorial UX']
  },
  pihub: {
    title: 'piHub',
    domain: 'Fintech product workflows',
    audience: 'Investors, creditors, applicants, and administrative users',
    deck: 'I designed financial workflows around a simple promise: users should always know their current status, what is blocking progress, and what they can do next.',
    situation: 'piHub spans investment, credit, applications, verification, and account management. The complexity is procedural. Different users move through different review states, and some of the most important moments happen when the product is waiting on verification rather than offering an immediate action.',
    remit: 'My work covered product UX and UI across investor, creditor, application, verification, and account-management journeys. I focused on state language, forms, review moments, dashboard density, recovery, and the relationship between status and action.',
    constraints: ['Several user roles share infrastructure but need different information and permissions.', 'Verification introduces waiting periods where uncertainty can damage confidence.', 'Financial dashboards need density for scanning while applications need calm, focused decision-making.'],
    moves: [['Pair status with the next useful action', 'Users should not have to read one area to understand state and another to discover what to do about it.'], ['Change density with the job', 'Dashboards support scanning and comparison; forms and verification screens deliberately remove competing information.'], ['Turn errors into routes forward', 'Incomplete, rejected, and failed states explain what changed, what is still valid, and what the user can do next.'], ['Treat review as part of the journey', 'Submitted, waiting, approved, rejected, and resubmitted are designed states, not edge-case copy added at the end.']],
    system: ['Dashboards answer: what needs attention?', 'Applications answer: what information is required now?', 'Verification answers: who or what is the process waiting on?', 'Recovery states answer: what can I do from here?'],
    delivery: 'I organized the work around reusable status, form, review, dashboard, and recovery patterns, while documenting where investor, creditor, applicant, and admin workflows needed to diverge. The goal was consistent rules without pretending every role has the same job.',
    result: ['Status, requirements, and next actions are treated as one information problem.', 'High-density and high-attention surfaces use different layout rules.', 'Waiting and recovery states are designed as intentionally as successful completion.', 'Role-specific flows can diverge without feeling like separate products.'],
    success: ['Each role can identify its next required action without support.', 'Users can tell whether a delay is waiting on them, the system, or a reviewer.', 'Rejected or incomplete states provide a clear recovery path instead of a dead end.'],
    strengths: ['Fintech state architecture', 'Multi-role UX', 'Forms and recovery design']
  },
  'hamro-idea': {
    title: 'Hamro Idea',
    domain: 'Software studio brand + website',
    audience: 'Prospective clients evaluating a Nepal-based software studio',
    deck: 'I redesigned a software studio website from positioning through front-end implementation, using the build itself to test whether the design held up under real content and responsive constraints.',
    situation: 'The core problem was not visual identity in isolation. A prospective client needs to understand what the studio does, which service matches the problem, and why the team is credible enough to contact. The website needed to make those decisions easier before visual polish could do useful work.',
    remit: 'I worked across positioning, information architecture, responsive UI, reusable sections, conversion paths, semantic markup, and front-end implementation. Because I owned both design and code, responsive behavior and content density could be corrected during the design process rather than after handoff.',
    constraints: ['Internal service language is rarely the same language prospective clients use when looking for help.', 'A multi-page service site needs a shared system without making every page feel templated.', 'Accessibility, performance, SEO structure, and responsive behavior directly affect the quality of the delivered design.'],
    moves: [['Clarify the offer before styling it', 'The page structure answers who the studio helps and what each service means before adding visual emphasis.'], ['Organize services around client intent', 'Navigation and service pages follow the questions a prospective client is likely to ask, not the company org chart.'], ['Use implementation as a design test', 'Real breakpoints, content lengths, and browser behavior expose weak assumptions faster than static frames.'], ['Make semantics part of craft', 'Heading structure, accessibility, performance, and search readability are treated as interface decisions.']],
    system: ['Positioning establishes fit.', 'Service architecture helps visitors find the relevant capability.', 'Proof and project material support confidence.', 'Contextual calls to action turn evaluation into a conversation.'],
    delivery: 'The browser was part of the design loop. Reusable layout patterns, semantic structure, responsive behavior, and content rules were implemented and refined together, reducing the translation loss that usually appears between design files and production.',
    result: ['The service offer is organized around prospective-client needs.', 'Service pages have clearer paths to relevant detail and contact.', 'Responsive behavior was tested as part of design rather than deferred to implementation.', 'The site system is easier to maintain because structure and semantics are reusable.'],
    success: ['A prospect can identify the most relevant service without sales assistance.', 'Qualified visitors reach project proof and contact from the service context that matters to them.', 'The site attracts enquiries that match the work the studio is positioning itself to deliver.'],
    strengths: ['End-to-end ownership', 'Design-to-code execution', 'Service positioning and IA']
  },
  masteriyo: {
    title: 'Masteriyo',
    domain: 'WordPress LMS product design',
    audience: 'Course creators, learners, and administrators',
    deck: 'I contributed to an established LMS by designing authoring and learning states that fit the product system while respecting how differently creators and learners think about the same course.',
    situation: 'Masteriyo serves several roles inside one product. Creators think in curriculum, settings, and publishing. Learners think in progress, comprehension, and what comes next. Administrators need oversight. Reusing the same hierarchy for every role would make the system consistent in appearance and inconsistent in use.',
    remit: 'I worked as part of a larger design team on course authoring, quiz flows, learner states, hierarchy, and reusable interface patterns. My contribution had to fit an existing WordPress product and be clear enough for other designers and engineers to review, extend, and ship.',
    constraints: ['Course creation can expose a large number of settings and content relationships.', 'Learner screens should not inherit administrative language or density simply because the underlying data is shared.', 'New patterns need to work inside an established product and multi-designer workflow.'],
    moves: [['Share a system, not a hierarchy', 'Creators and learners reuse conventions while prioritizing different information based on their actual jobs.'], ['Break authoring into meaningful decisions', 'Course and quiz setup reveals complexity progressively instead of presenting one long configuration surface.'], ['Keep feedback near the next action', 'Learners see progress, attempt state, completion, and what to do next without admin concepts leaking into the experience.'], ['Design for team continuation', 'States, naming, and component behavior are explicit enough that another designer can continue the feature coherently.']],
    system: ['Creators move from course structure into progressive configuration.', 'Learners move from content into feedback and the next learning action.', 'Shared components provide familiarity without forcing identical density.', 'Empty, error, and completion states sit inside the same interaction model.'],
    delivery: 'I prepared the work for a collaborative product environment: reusable components, state coverage, consistent terminology, and interaction notes that explain intent rather than relying on a collection of final-looking screens.',
    result: ['Course authoring is framed as progressive configuration instead of a settings dump.', 'Learner states emphasize progress and feedback rather than product administration.', 'New interface work remains consistent with an existing LMS system.', 'My contribution is clearly scoped within the larger product team.'],
    success: ['Creators can move through setup without losing track of what is required to publish.', 'Learners can identify progress and the next action quickly.', 'Shared patterns reduce learning cost without forcing creator and learner experiences to behave the same way.'],
    strengths: ['Collaborative product design', 'Complex authoring UX', 'Design-system discipline']
  },
  orkest: {
    title: 'Orkest HQ',
    domain: 'Modular SaaS platform',
    audience: 'Business teams, operators, and administrators working across CRM, sales, inventory, and finance',
    deck: 'I designed the architecture behind a multi-module SaaS product so CRM, Sales, Inventory, and Finance could share a system without becoming the same interface with different labels.',
    situation: 'Orkest is a platform problem before it is a screen problem. Multiple business modules share navigation, components, permissions, and data conventions, but each module represents a different operational job. The challenge was defining what should repeat and what should be allowed to differ.',
    remit: 'My scope focused on UX architecture and product design across the shared workspace and module structure: navigation levels, dashboards, tables, record views, information density, reusable patterns, and the rules for intentional variation.',
    constraints: ['CRM, Sales, Inventory, and Finance share infrastructure but not task models.', 'Operational users need enough information for fast scanning without drowning in secondary detail.', 'A design system becomes a liability when consistency is enforced where the business task genuinely differs.'],
    moves: [['Define the product grammar first', 'Navigation, hierarchy, actions, and state conventions are established before individual modules are polished.'], ['Make location predictable', 'Global, module-level, and record-level actions live in consistent layers so users can build spatial memory.'], ['Design density around decisions', 'Tables and dashboards expose the information required for scanning, then move secondary detail into deliberate inspection.'], ['Document the exceptions', 'Variation is part of the system: when a workflow needs to break a shared pattern, the reason is explicit.']],
    system: ['The workspace establishes global context.', 'Each module exposes its own entities and tasks inside that shared shell.', 'Dashboards and tables support scanning before inspection.', 'Record-level actions become specific without changing the product language around them.'],
    delivery: 'The important handoff was not a stack of finished screens. It was a set of rules for navigation, density, states, shared components, and exceptions so engineering could extend the platform without re-deciding the interaction model for every new module.',
    result: ['Modules feel related without being flattened into one generic admin template.', 'Global, module, and record-level actions have clearer boundaries.', 'Dense operational surfaces follow a deliberate hierarchy.', 'The reusable system includes principled variation, not only repetition.'],
    success: ['Users can move between modules without losing orientation.', 'The first scan of a dense view exposes the information needed for the next decision.', 'New modules can reuse the platform grammar without forcing inappropriate interactions.'],
    strengths: ['SaaS architecture', 'Scalable design systems', 'Dense operational UI']
  },
  splashnode: {
    title: 'Splashnode',
    domain: 'Technical platform website + front-end',
    audience: 'Platform buyers evaluating content, device, and data-management capabilities',
    deck: 'I designed and built a technical product website that turns a dense feature set into a clear capability model, then lets buyers go deeper when they are ready.',
    situation: 'Splashnode had enough technical capability to overwhelm a first-time visitor. Content, devices, and data management make sense internally as features, but buyers first need to understand how those capabilities combine to solve a practical job.',
    remit: 'I owned website design and front-end implementation, including capability grouping, page hierarchy, responsive behavior, interaction polish, semantic structure, and the implementation details that determine whether the final site still feels intentional.',
    constraints: ['New visitors need a product model before technical depth becomes useful.', 'Responsive layouts must preserve the explanation order even when the composition changes.', 'Implementation decisions affect performance, semantics, maintainability, and visual quality.'],
    moves: [['Organize around buyer jobs', 'Capabilities are grouped by what teams are trying to manage, not by an internal feature inventory.'], ['Make the system scannable first', 'Visitors can understand the relationship between content, devices, and data before opening deeper detail.'], ['Protect the story on mobile', 'Responsive composition changes, but the explanation sequence does not.'], ['Use the browser as a design critic', 'Real content, spacing, performance, and semantics are tested during implementation instead of treated as someone else\'s problem.']],
    system: ['The opening establishes what the platform helps teams manage.', 'Capability groups create a coherent mental model.', 'Deeper product detail supports technical evaluation after orientation.', 'Calls to action match different stages of buyer intent.'],
    delivery: 'Because I also implemented the front end, responsive rules and interaction behavior were delivered as working code rather than left to interpretation. That let design decisions be tested against the actual browser, content, and performance constraints.',
    result: ['The platform is easier to understand as a connected system rather than a feature list.', 'Technical detail has a clear place after initial orientation.', 'Responsive behavior preserves the product narrative.', 'Design decisions survive into implementation with less translation loss.'],
    success: ['A first-time visitor can explain what the platform does after a short scan.', 'A technical evaluator can reach deeper capability information without losing context.', 'Different calls to action make sense for visitors at different stages of evaluation.'],
    strengths: ['Design plus implementation', 'Technical product storytelling', 'Responsive systems thinking']
  },
  morajaa: {
    title: 'Morajaa',
    domain: 'B2B consulting website',
    audience: 'Decision-makers exploring consulting support by business problem, service, or sector',
    deck: 'I structured a consulting website around the way prospects recognize problems, so visitors can find relevant expertise without first learning the firm\'s internal vocabulary.',
    situation: 'High-consideration buyers often know the business problem they need help with before they know the name of the consulting service. A site organized only around internal service categories makes the visitor translate their problem into the firm\'s language before they can even evaluate fit.',
    remit: 'I worked on information architecture, service and sector relationships, visual hierarchy, responsive composition, credibility content, and the path from exploration into a qualified enquiry.',
    constraints: ['Visitors may enter through a problem, a known service, or an industry sector.', 'Premium presentation cannot reduce clarity or reading comfort.', 'An enquiry is more valuable when the context that led to it is preserved.'],
    moves: [['Start with recognition', 'Visitors can enter through the business problem they recognize rather than a taxonomy they have to learn.'], ['Connect service and sector paths', 'Related pages reinforce one another instead of becoming isolated content silos.'], ['Make precision the premium signal', 'Clear language, evidence, and restrained hierarchy do more credibility work than vague luxury styling.'], ['Ask for contact after context', 'Inquiry points appear after relevant service or sector material so the conversation starts with more information.']],
    system: ['Problem-led entry helps a visitor recognize relevance.', 'Service pages explain the type of support available.', 'Sector pages make that expertise concrete in context.', 'Proof and enquiry close the evaluation loop.'],
    delivery: 'I organized the site around reusable relationships between service, sector, proof, and enquiry content so the information architecture could scale without duplicating entire page structures.',
    result: ['Prospects have multiple coherent ways to discover relevant expertise.', 'Service and sector content support one another instead of competing for navigation priority.', 'The premium tone comes from precision and pacing rather than decoration.', 'Inquiry paths retain more of the context a prospect was evaluating.'],
    success: ['A visitor can identify the relevant service without knowing its formal name beforehand.', 'Service and sector paths lead naturally to the proof most relevant to the decision.', 'Qualified prospects reach enquiry with enough context to start a useful conversation.'],
    strengths: ['B2B information architecture', 'Trust-led content design', 'Conversion without pressure']
  },
  'neverwinter-parser': {
    title: 'Neverwinter Live Parser',
    domain: 'Game combat-log analysis',
    audience: 'Neverwinter players using combat data to understand encounters and performance',
    deck: 'I designed an analysis layer for combat logs that starts with the questions players actually ask, then exposes deeper data without pretending the parser knows more than it does.',
    situation: 'Raw combat logs are detailed but rarely useful in their original form. Players want to understand an encounter, compare performance, and investigate why something changed. The interface needed to compress a large event stream into useful summaries while keeping the underlying data and uncertainty honest.',
    remit: 'My work focused on the product model for parser output: encounter summaries, comparison patterns, drill-down structure, filters, metric hierarchy, and the boundary between reliable data and interpretation.',
    constraints: ['Large event streams need strong hierarchy before they become readable.', 'Metrics can mislead when units, grouping, or comparison context is hidden.', 'The interface cannot promise insight that the parser cannot reliably derive from the source data.'],
    moves: [['Begin with the player question', 'The interface opens on encounter-level answers rather than raw event output.'], ['Use summary as orientation, not a dead end', 'Users can move from a quick interpretation into the exact metrics behind it.'], ['Keep comparison context explicit', 'Units, grouping, and scale remain visible so visual differences do not create false conclusions.'], ['Make data limits visible', 'Uncertainty and unsupported interpretation are exposed instead of being disguised as analytical confidence.']],
    system: ['Encounter summary provides orientation.', 'Metric groups support focused investigation.', 'Comparisons keep units and grouping consistent.', 'Filters narrow the question while keeping the active analysis state visible.'],
    delivery: 'I treated the parser data contract and interface as one system. Available fields, aggregation rules, uncertainty, and interaction states define what the UI is allowed to claim, which keeps the design from drifting ahead of the underlying data.',
    result: ['Combat data is organized around encounter questions instead of event streams.', 'Summary and diagnostic views have distinct jobs.', 'Comparison patterns make context and units explicit.', 'The interface stays aligned with what the parser can actually support.'],
    success: ['Players can identify a useful explanation from the encounter summary without reading raw logs.', 'Drill-down paths help answer a specific question rather than simply exposing more data.', 'Filters and comparisons do not create confidence beyond what the underlying data supports.'],
    strengths: ['Data-heavy product design', 'Analytical hierarchy', 'Technical constraint awareness']
  },
  'grid-labs': {
    title: 'Grid Labs',
    domain: 'Hosting service landing experience',
    audience: 'Visitors comparing hosting, domain, and service options',
    deck: 'I reduced a hosting landing page to the decisions a buyer actually needs to make: what fits, what it costs, what is included, and whether the provider is credible enough to continue.',
    situation: 'Hosting pages can become a pile of plans, badges, specifications, and promotional claims. The real buyer journey is simpler. Visitors need to identify the right service, compare options accurately, understand what is included, and decide whether to proceed.',
    remit: 'My contribution covered the marketing experience and static front-end structure: service hierarchy, pricing comparison, domain-search affordance, trust content, responsive layout, and the path toward contact or purchase intent.',
    constraints: ['Technical terminology can obscure a straightforward purchase decision.', 'Pricing becomes hard to compare when plans use inconsistent structure or feature order.', 'A static landing experience should not imply account or infrastructure functionality it does not actually provide.'],
    moves: [['Prioritize the buyer questions', 'Service type, price, included value, and trust appear before secondary technical detail.'], ['Standardize the comparison', 'Plans keep the same information order so users can compare without remembering a previous card.'], ['Use trust after clarity', 'Reassurance supports an understood offer instead of trying to replace explanation.'], ['Keep implementation proportional', 'The front end stays simple and maintainable because the project is a landing experience, not a hidden SaaS platform.']],
    system: ['Service selection narrows intent.', 'Plan comparison makes trade-offs visible.', 'Domain and supporting tools clarify the next commercial step.', 'Trust and contact help the visitor continue with confidence.'],
    delivery: 'I kept the static implementation deliberately lightweight: predictable sections, responsive rules, and reusable patterns without introducing a component architecture more complex than the site required.',
    result: ['The page sequence follows the buyer decision more closely.', 'Pricing and service options are easier to compare consistently.', 'Trust content reinforces a clear offer instead of competing with it.', 'The implementation remains honest about the actual project scope.'],
    success: ['Visitors can compare plans without opening multiple secondary views.', 'The purpose of domain-search UI is understood immediately.', 'The page exposes enough information for a visitor to know whether to continue, contact, or leave.'],
    strengths: ['Commercial hierarchy', 'Responsive front-end craft', 'Scope discipline']
  },
  'zakra-furniture': {
    title: 'Zakra Furniture',
    domain: 'WordPress / Elementor starter-site design',
    audience: 'Furniture shoppers and site owners maintaining catalogue content',
    deck: 'I designed a furniture starter site that leads with imagery for shoppers while remaining resilient enough for real site owners to edit inside WordPress and Elementor.',
    situation: 'Furniture discovery is visual, but a usable catalogue still needs category structure, product information, and clear navigation. As a starter site, the design also had to survive different photographs, copy lengths, and catalogue sizes rather than only looking good with demo content.',
    remit: 'My contribution focused on visual and structural patterns: category discovery, product cards, section flexibility, typography, spacing, responsive behavior, and editor-friendly choices that reduce the chance of routine content updates breaking the layout.',
    constraints: ['Product images vary widely in aspect ratio, crop, and visual weight.', 'Starter-site sections need to tolerate different quantities of content.', 'Site owners need useful editing freedom without having to redesign the page in Elementor.'],
    moves: [['Let imagery lead without removing structure', 'Photography gets visual priority while categories and labels keep browsing understandable.'], ['Design for content variance', 'Blocks tolerate different product counts and copy lengths instead of depending on perfect demo content.'], ['Keep comparison information available', 'Useful metadata supports decisions without competing with the product image.'], ['Treat editability as a user need', 'Section rules are simple enough for site owners to maintain inside the CMS.']],
    system: ['Category cues create the first browsing layer.', 'Product cards combine visual discovery with practical detail.', 'Flexible sections adapt to the business content around them.', 'Responsive behavior preserves image priority without sacrificing readability.'],
    delivery: 'The system was designed for a CMS, so image behavior, repeatable blocks, typography rules, and spacing conventions matter as much as the initial composition. The page should remain coherent after real content replaces the demo.',
    result: ['Visual browsing has clearer category structure.', 'Product cards balance photography with useful decision information.', 'Sections can absorb normal catalogue and copy changes.', 'The design remains manageable for non-designer site owners.'],
    success: ['Visitors can find a relevant category quickly from an image-led page.', 'Product cards carry enough information to support meaningful comparison.', 'Routine content updates do not break hierarchy or responsive behavior.'],
    strengths: ['CMS-aware design', 'Image-led commerce UX', 'Reusable template systems']
  },
  designerex: {
    title: 'Designerex',
    domain: 'Luxury fashion rental marketplace',
    audience: 'People browsing and comparing designer fashion rentals',
    deck: 'I contributed marketplace patterns that let luxury photography carry the emotion of the experience while practical listing information remains consistent enough for fast comparison.',
    situation: 'Luxury marketplaces have to support desire and decision at the same time. Large photography creates appeal, but rental confidence depends on practical details that need to be easy to find and compare. Too much visual treatment can make the product feel premium while making the task harder.',
    remit: 'This was a design contribution within a broader product. I focused on browsing and listing patterns, visual hierarchy, the relationship between imagery and metadata, and interaction conventions that fit the existing marketplace rather than claiming end-to-end ownership.',
    constraints: ['Photography should dominate without hiding practical rental information.', 'Comparison slows down when listing details move or change format between cards.', 'Premium visual treatment can easily introduce interaction noise that competes with the products.'],
    moves: [['Use photography as the lead, not the whole interface', 'Core listing information remains consistently available alongside the visual content.'], ['Make repeated patterns genuinely repeat', 'Stable positions and labels reduce the mental work of comparing multiple listings.'], ['Keep premium styling restrained', 'Polish supports product desirability without adding unnecessary interaction.'], ['Be precise about contribution', 'The case reflects the part of the marketplace I actually worked on rather than inflating team work into individual ownership.']],
    system: ['Browse emphasizes visual discovery.', 'Listing metadata supports quick comparison.', 'Product detail carries depth that would make the grid too dense.', 'Interaction remains secondary to the fashion itself.'],
    delivery: 'The work was prepared to fit an existing product context, using reusable listing patterns and consistent hierarchy that a larger team could review and extend without introducing a parallel design language.',
    result: ['Listing patterns support more consistent comparison.', 'Premium presentation and practical information are better balanced.', 'Repeated interactions reduce relearning between products.', 'The portfolio scope accurately reflects a team contribution.'],
    success: ['Users can compare the rental details that influence confidence without opening every listing.', 'Product imagery remains dominant without obscuring task-critical metadata.', 'Premium styling does not reduce browsing speed or interaction clarity.'],
    strengths: ['Marketplace UX', 'Luxury visual hierarchy', 'Accurate team attribution']
  },
  sassboilerplate: {
    title: 'SassBoilerplate',
    domain: 'Front-end developer utility',
    audience: 'Developers starting small static front-end projects',
    deck: 'I built a lightweight Sass starter around fewer repeated setup decisions, clear file responsibilities, and a low cost of changing or removing the conventions later.',
    situation: 'Boilerplate saves time only when it removes decisions without creating a private framework that every future project has to fight. The design problem here was developer experience: deciding which structure is useful enough to standardize and which assumptions should stay out.',
    remit: 'I defined the Sass structure, file responsibilities, naming conventions, and default workflow for small front-end projects. The goal was legibility and maintenance rather than demonstrating the maximum amount of tooling that could be assembled.',
    constraints: ['Unused boilerplate quickly becomes maintenance debt.', 'Folder and naming conventions help only when another developer can understand their responsibilities.', 'Small static projects do not benefit from enterprise-level complexity by default.'],
    moves: [['Give styles predictable homes', 'Responsibilities are separated so changes do not accumulate in one large stylesheet.'], ['Keep defaults intentionally small', 'Repeated setup is automated without assuming every project needs the same components or architecture.'], ['Make removal cheap', 'Conventions are loosely coupled enough to replace when a project has different needs.'], ['Optimize for the next developer', 'The structure should be understandable without a verbal tour from its author.']],
    system: ['A new project begins from a known file structure.', 'Imports and responsibilities remain predictable as styles grow.', 'Unused layers can be removed without unraveling the whole setup.', 'Documentation and naming explain the workflow without hidden conventions.'],
    delivery: 'For a developer utility, the handoff is the product. The repository structure, naming, and documentation need to communicate intent clearly enough that another developer can adopt or modify the starter without relying on tribal knowledge.',
    result: ['Small projects begin from a repeatable Sass structure.', 'Style responsibilities are easier to locate and maintain.', 'The starter reduces repeated setup without overcommitting future projects.', 'The workflow stays easy to adapt or remove.'],
    success: ['The starter reduces setup time across several real projects.', 'Most included structure is used often enough to justify its existence.', 'Another developer can understand and change the setup without explanation from the author.'],
    strengths: ['Front-end systems thinking', 'Developer experience', 'Maintainability over novelty']
  },
  zapp: {
    title: 'Zapp Today',
    domain: 'Logistics product',
    audience: 'Customers, drivers, and operations/support teams sharing one delivery lifecycle',
    deck: 'I designed a shared delivery state model across customer, driver, and operations experiences so each role gets the interface it needs without disagreeing about what is happening to the delivery.',
    situation: 'A logistics product is a coordination system. Customers need confidence, drivers need a clear next task, and operations teams need enough visibility to recover when the happy path breaks. All three roles look at the same delivery, but they should not see the same interface.',
    remit: 'My work focused on booking context, driver tasks, tracking and status, state transitions, and exception handling across customer, driver, and operational views. I used one delivery lifecycle underneath role-specific information priorities.',
    constraints: ['Each role needs different information from the same underlying delivery state.', 'Drivers need low-distraction interfaces while actively working.', 'Delayed, reassigned, interrupted, and failed deliveries create more UX risk than a straightforward completion flow.'],
    moves: [['Share the state model, not the screen', 'Customer, driver, and operations interfaces differ while using the same language for the delivery lifecycle.'], ['Put the next task first for drivers', 'Active-work screens prioritize action and route context over secondary operational detail.'], ['Expose detail progressively', 'Customers see enough information for confidence without inheriting internal operational complexity.'], ['Design exceptions before they become support tickets', 'Delay, interruption, reassignment, and failure have defined states and recovery paths.']],
    system: ['Booking creates the delivery request and baseline context.', 'Driver views turn the lifecycle into immediate operational tasks.', 'Customer tracking translates the same state into useful confidence.', 'Operations views preserve history and exception detail for recovery.'],
    delivery: 'Handoff centered on one shared lifecycle: state names, transition rules, actions available to each role, and exception behavior. That is more durable than separate screen sets that happen to look consistent but disagree about state.',
    result: ['Customer, driver, and operations views share a coherent delivery language.', 'Driver screens prioritize the next operational action.', 'Customers receive useful progress without unnecessary internal detail.', 'Operations has a clearer model for understanding and recovering from exceptions.'],
    success: ['The same delivery status means the same thing across all roles.', 'Drivers can identify the next required action quickly during active work.', 'Delayed or interrupted deliveries give customers and support enough context to understand what happens next.'],
    strengths: ['Multi-role service design', 'Operational state modeling', 'Exception and recovery UX']
  }
};

/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Function contract: strip
 * Purpose: Remove module behavior without disturbing required surrounding ensure senior case studies repository tool state.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function strip(value) {
  return String(value ?? '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Function contract: fact
 * Purpose: Implement the fact responsibility owned by the ensure senior case studies repository tool.
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
 * Purpose: Implement the year responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function year(main) {
  const badges = [...main.matchAll(/<span[^>]*class=["'][^"']*badge-pill[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi)].map(/** Callback contract: Processes the callback step for [...main.match all(/<span[^>]*class=["'][^"']*badge pill[^"']*["'][^>]*>([\s\s]*?)<\/span>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => strip(match[1]));
  return fact(main, 'Year') || badges.find(/** Callback contract: Processes the callback step for badges without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `value`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `value`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (value) => /\b20\d{2}/.test(value)) || '';
}

/**
 * Function contract: cover
 * Purpose: Implements the cover responsibility for this module.
 * Inputs: main, item.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: cover
 * Purpose: Implement the cover responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `main`: input consumed by this operation; `item`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function cover(main, item) {
  const source = main.match(/<figure[^>]*class=["'][^"']*agent-case-cover[^"']*["'][^>]*>[\s\S]*?<\/figure>/i)?.[0]
    || main.match(/<div[^>]*class=["'][^"']*case-hero-img-container[^"']*["'][^>]*>[\s\S]*?<\/div>/i)?.[0]
    || main;
  const img = source.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (!img) return '';
  const alt = /\balt=["']([^"']*)["']/i.exec(img[0])?.[1] || `${item.title} interface`;
  return `<figure class="agent-case-cover nrs-hireable-case-cover"><img src="${esc(img[1])}" alt="${esc(alt)}" loading="eager" decoding="async"></figure>`;
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
 * Purpose: Implement the external links responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function externalLinks(main) {
  const seen = new Set();
  const links = [];
  for (const match of main.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    if (/nischhalsubba\.com\.np/i.test(match[1]) || seen.has(match[1])) continue;
    seen.add(match[1]);
    links.push([strip(match[2]) || 'Open project artifact', match[1]]);
  }
  return links.slice(0, 6);
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
 * Purpose: Return module behavior from the supplied inputs or current ensure senior case studies repository tool state.
 * Inputs: `items`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: The requested module behavior; early-return/empty-state behavior follows the explicit branches in this function.
 */
function list(items) {
  return `<ul class="nrs-case-list">${items.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

/**
 * Function contract: cards
 * Purpose: Implement the cards responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `items`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function cards(items) {
  return `<div class="agent-decision-grid nrs-case-decision-grid">${items.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[title, text]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([title, text]) => `<article class="agent-decision nrs-case-decision-card"><span class="agent-meta">Design move</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div>`;
}

/**
 * Function contract: section
 * Purpose: Implement the section responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `number`: input consumed by this operation; `label`: input consumed by this operation; `title`: input consumed by this operation; `body`: input consumed by this operation; `className`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function section(number, label, title, body, className = '') {
  return `<section class="agent-section ${className}"><div class="agent-frame nrs-case-section"><header class="nrs-case-section-head"><span class="agent-meta">${String(number).padStart(2, '0')} · ${esc(label)}</span><h2>${esc(title)}</h2></header><div class="nrs-case-section-body">${body}</div></div></section>`;
}

/**
 * Function contract: facts
 * Purpose: Implement the facts responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `main`: input consumed by this operation; `item`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function facts(main, item) {
  const role = fact(main, 'Role') || 'Product design contribution';
  const values = [
    ['Role', role],
    ['Year', year(main)],
    ['Domain', fact(main, 'Domain') || item.domain],
    ['Audience', fact(main, 'Users') || fact(main, 'Audience') || item.audience],
  ].filter(/** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `[, value]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ ([, value]) => value);
  return `<dl class="agent-case-facts nrs-hireable-case-facts">${values.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[label, value]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
}

/**
 * Function contract: evidence
 * Purpose: Implement the evidence responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function evidence(main) {
  const links = externalLinks(main);
  if (!links.length) {
    return '<p class="nrs-case-evidence-note">No public interactive artifact is attached to this case. The write-up is limited to work I can describe and defend publicly.</p>';
  }
  return `<div class="agent-evidence-links nrs-case-evidence-links">${links.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[label, url]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([label, url]) => `<a class="agent-btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join('')}</div>`;
}

/**
 * Function contract: render
 * Purpose: Implement the render responsibility owned by the ensure senior case studies repository tool.
 * Inputs: `slug`: input consumed by this operation; `main`: input consumed by this operation; `item`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function render(slug, main, item) {
  const hero = `<header class="agent-case-hero nrs-hireable-case-hero"><div class="agent-frame agent-case-grid"><nav class="nrs-case-breadcrumb" aria-label="Breadcrumb"><a href="/projects">Work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(item.title)}</span></nav><div class="agent-case-title-wrap"><span class="agent-kicker">${esc(item.domain)}</span><h1 class="agent-case-title">${esc(item.title)}</h1></div><p class="agent-case-deck">${esc(item.deck)}</p>${facts(main, item)}${cover(main, item)}</div></header>`;
  const context = section(1, 'Context', 'Where the complexity actually was', `<p>${esc(item.situation)}</p><div class="nrs-case-callout"><strong>Primary audience</strong><p>${esc(item.audience)}</p></div>`, 'agent-section--compact');
  const remit = section(2, 'My remit', 'What I was responsible for', `<p>${esc(item.remit)}</p><h3 class="nrs-case-subhead">Constraints that shaped the work</h3>${list(item.constraints)}`);
  const moves = section(3, 'Design moves', 'The choices that changed the experience', cards(item.moves), 'agent-section--inverse');
  const system = section(4, 'System logic', 'How the experience holds together', list(item.system));
  const delivery = section(5, 'Delivery', 'What engineering needed from the design', `<p>${esc(item.delivery)}</p>`, 'agent-section--compact');
  const result = section(6, 'Result', 'What the design resolved', `${list(item.result)}<p class="nrs-case-evidence-note">Quantitative product metrics are not public for this work, so this section describes the delivered design outcome rather than inventing business impact.</p>`);
  const success = section(7, 'Success criteria', 'How I would know it is working', list(item.success), 'agent-section--inverse');
  const proof = section(8, 'Evidence', 'Public work and references', evidence(main), 'agent-section--compact');
  const close = section(9, 'Takeaway', 'What this case says about my practice', `<div class="nrs-case-signal-grid">${item.strengths.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `strength`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (strength) => `<article><strong>${esc(strength)}</strong></article>`).join('')}</div><div class="agent-actions nrs-case-actions"><a class="agent-btn agent-btn--primary" href="/projects">View all work</a><a class="agent-btn" href="/contact">Discuss similar work</a></div>`);
  return `<main id="main-content" class="agent-main nrs-hireable-case nrs-senior-case nrs-editorial-case" data-project-slug="${esc(slug)}">${hero}${context}${remit}${moves}${system}${delivery}${result}${success}${proof}${close}</main>`;
}

const missing = [];
let count = 0;
for (const [slug, item] of Object.entries(cases)) {
  const file = path.join(base, `project-${slug}.html`);
  if (!fs.existsSync(file)) {
    missing.push(slug);
    continue;
  }
  let html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
  if (!main) {
    missing.push(`${slug}:main`);
    continue;
  }
  html = html.replace(main, render(slug, main, item));
  fs.writeFileSync(file, html, 'utf8');
  count += 1;
}

if (missing.length) throw new Error(`[senior-case-studies] Missing inputs: ${missing.join(', ')}`);
if (count !== Object.keys(cases).length) throw new Error(`[senior-case-studies] Expected ${Object.keys(cases).length}, got ${count}`);

for (const slug of Object.keys(cases)) {
  const html = fs.readFileSync(path.join(base, `project-${slug}.html`), 'utf8');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || '';
  if ((main.match(/<h1\b/gi) || []).length !== 1) throw new Error(`[senior-case-studies] ${slug}: expected one H1`);
  for (const required of ['Where the complexity actually was', 'The choices that changed the experience', 'What the design resolved', 'How I would know it is working']) {
    if (!main.includes(required)) throw new Error(`[senior-case-studies] ${slug}: missing ${required}`);
  }
}

console.log(`[senior-case-studies] Rewrote ${count} project pages with fresh editorial case-study content.`);
