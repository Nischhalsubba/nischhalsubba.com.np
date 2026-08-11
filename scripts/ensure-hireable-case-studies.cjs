/**
 * @fileoverview scripts/ensure-hireable-case-studies.cjs
 * Purpose: Apply the ensure hireable case studies production transformation or maintenance step while preserving canonical source/build contracts.
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

const projects = {
  'yarsha': {
    title: 'Yarsha',
    domain: 'Web3 messaging + wallet UX',
    audience: 'People messaging, sharing Solana actions, and reviewing wallet transactions',
    summary: 'A mobile Web3 product where chat, wallet actions, Solana blinks, transaction review, and bot interactions had to behave like one coherent conversation instead of a collection of crypto features.',
    brief: [
      'Yarsha combined the speed and informality of messaging with actions that can move money or trigger wallet approval. That creates a product tension: chat should feel lightweight, but financial actions need context, deliberate review, and trustworthy state feedback.',
      'The design problem was not simply placing a send button inside a message thread. The work had to explain what an action would do, separate conversational context from signing responsibility, and keep the transaction understandable after the user returned to the thread.'
    ],
    role: [
      'My contribution focused on product UX and interface design for the messaging-to-wallet journey. I treated transaction cards, review moments, signing, bot actions, and resolved states as connected parts of one state model rather than isolated screens.',
      'The handoff emphasis was behavioral: what information persists, what changes after wallet interaction, what the user can do next, and how pending, declined, failed, and completed states appear inside the conversation.'
    ],
    constraints: [
      'Financial actions need more friction than ordinary chat messages without making every conversation feel like a banking interface.',
      'Wallet and network behavior can introduce waiting, rejection, failure, or delayed confirmation outside the app’s direct control.',
      'Transaction context has to remain readable when a user comes back to a conversation later.'
    ],
    decisions: [
      ['Conversation first', 'Wallet actions enter through the thread so the reason for the action remains visible instead of sending users into a disconnected finance flow.'],
      ['Review before signing', 'Consequential details get a deliberate review step before wallet approval, creating a clear boundary between reading a message and authorizing an action.'],
      ['State completeness', 'Pending, declined, failed, and completed outcomes are designed explicitly because trust is usually tested when the happy path stops being happy.'],
      ['Return to context', 'Resolved transaction status stays legible in the conversation so users do not have to reconstruct what happened from wallet history alone.']
    ],
    flows: [
      'Message or bot interaction introduces a wallet-related action with enough context to understand why it is there.',
      'A focused review state shows the consequential details before approval or signing.',
      'The product reflects wallet/network progress instead of pretending confirmation is instant.',
      'The final state returns to the thread as a durable part of the conversation history.'
    ],
    handoff: 'I framed the work as a state and transition contract for engineering: entry conditions, required information, wallet-dependent transitions, loading/pending behavior, failure recovery, and what persists in the thread. That makes the design useful beyond a set of polished mockups.',
    outcomes: [
      'A clearer relationship between conversational context and wallet actions.',
      'A deliberate review boundary before signing or sending consequential transactions.',
      'Explicit transaction states that remain understandable when the network or wallet does not follow the ideal path.',
      'A handoff model organized around behavior and state changes instead of disconnected screens.'
    ],
    validation: [
      'Can users explain what will happen before they approve a wallet action?',
      'Do pending and failure states provide enough context to recover without leaving the conversation?',
      'Does the resolved transaction remain understandable when users revisit the thread later?'
    ],
    signals: ['Complex product-state thinking', 'Fintech/Web3 trust design', 'Implementation-aware handoff']
  },
  'mokshya': {
    title: 'Mokshya.io',
    domain: 'Web3 protocol website',
    audience: 'Prospective users, technical evaluators, and developers',
    summary: 'A technical protocol website designed to make a complex Web3 product understandable enough to evaluate, while still giving technical audiences a credible path into deeper protocol and developer information.',
    brief: [
      'Protocol websites often make one of two mistakes: they lead with technical detail before visitors understand the value, or they simplify so aggressively that experienced users stop trusting the explanation. Mokshya needed a structure that could serve both audiences.',
      'The core problem was information architecture and trust. The page needed to establish the outcome first, explain how the product works second, then introduce proof and developer depth without turning the entire site into either marketing copy or documentation.'
    ],
    role: [
      'My work centered on website UX, hierarchy, responsive composition, and the translation of protocol concepts into a readable product narrative.',
      'I treated technical storytelling as an interface problem: deciding what belongs in the first scan, what needs progressive disclosure, and how general and developer paths stay connected without duplicating the site.'
    ],
    constraints: [
      'Different audiences arrive with very different technical knowledge and evaluation criteria.',
      'Claims need enough supporting context to feel credible in a category where vague hype damages trust quickly.',
      'Dense technical sections still need readable hierarchy and measure on smaller screens.'
    ],
    decisions: [
      ['Outcome before mechanism', 'The page gives visitors a useful mental model before asking them to understand protocol mechanics.'],
      ['Audience paths', 'General explanation and developer depth are kept distinct but connected so visitors can choose the amount of detail they need.'],
      ['Proof over hype', 'Hierarchy, precise terminology, and supporting context do more trust work than ornamental Web3 effects or inflated claims.'],
      ['Responsive reading', 'Technical sections are designed around reading order and measure, not merely collapsed from desktop columns.']
    ],
    flows: [
      'A first-time visitor can understand the product promise without knowing the underlying protocol vocabulary.',
      'The mechanism is introduced only after the outcome is clear enough to create context.',
      'Proof and supporting information appear near the claims they are meant to substantiate.',
      'Developers can move into deeper technical context without forcing every visitor through the same material.'
    ],
    handoff: 'The handoff focused on reusable section logic, reading order, content hierarchy, responsive behavior, and the relationship between product explanation and deeper technical material so content could evolve without breaking the story.',
    outcomes: [
      'A clearer sequence from product promise to technical depth.',
      'More distinct paths for general visitors and developer audiences.',
      'A restrained credibility system based on hierarchy, evidence, and terminology rather than decoration.',
      'Responsive technical content designed to remain readable as the layout compresses.'
    ],
    validation: [
      'Can first-time visitors explain the protocol in plain language after a short scan?',
      'Can developers reach the technical context they need without searching through marketing sections?',
      'Which proof signals most strongly influence trust and continued exploration?'
    ],
    signals: ['Information architecture', 'Technical product communication', 'Responsive website UX']
  },
  'pihub': {
    title: 'piHub',
    domain: 'Fintech workflows',
    audience: 'Investors, creditors, applicants, and administrative users',
    summary: 'A fintech product spanning investment, credit, applications, verification, and profile management where status, requirements, and the next action needed to stay obvious across several user roles.',
    brief: [
      'Financial products become stressful when users do not know what state they are in, what information is missing, or what will happen next. piHub combined several related journeys, each with different decisions and different levels of information density.',
      'The design challenge was to make those workflows feel like one product without flattening them into the same screen pattern. Dashboards needed scanability and comparison; application and verification steps needed focused pacing and stronger reassurance.'
    ],
    role: [
      'My contribution focused on product UX and UI across investor, creditor, application, verification, and account-management flows.',
      'I worked on hierarchy, state visibility, task-based density, forms and review moments, with particular attention to waiting, incomplete requirements, rejection, recoverable errors, and other states that affect confidence.'
    ],
    constraints: [
      'Different roles need different information without making the product feel fragmented.',
      'Verification and review introduce waiting states where the user may have no immediate action to take.',
      'Dense financial information has to remain scannable without making decision-heavy forms feel overwhelming.'
    ],
    decisions: [
      ['Status beside action', 'Current state, outstanding requirements, and the next available action stay visually adjacent so users do not have to reconstruct process state from memory.'],
      ['Task-based density', 'Comparison and dashboard surfaces can be denser, while application and verification steps reduce competing information around important decisions.'],
      ['Recovery paths', 'Incomplete and failed states explain what is wrong and what can happen next instead of ending in a passive status label.'],
      ['Verification as a journey', 'Waiting, review, approval, rejection, and resubmission are treated as product states rather than edge cases.']
    ],
    flows: [
      'Users can identify the current process state and next required action from the same area.',
      'Application steps group related information so progress feels manageable rather than administrative.',
      'Verification screens explain both what the product is doing and what the user can still control.',
      'Dashboard density changes according to whether the task is scanning, comparing, editing, or deciding.'
    ],
    handoff: 'I organized the interface around reusable status, form, review, dashboard, and recovery patterns while documenting where role-specific workflows needed to diverge. That gives engineering a clearer component model without forcing every financial task into one generic template.',
    outcomes: [
      'Stronger visibility of status and next actions across the documented fintech journeys.',
      'More deliberate information density between dashboards and decision-heavy steps.',
      'Recovery paths designed to reduce dead-end states.',
      'Verification and waiting states treated as first-class parts of the experience.'
    ],
    validation: [
      'Can each role identify the next required action without support?',
      'Where do users stall or lose confidence during verification?',
      'Which status messages are understood correctly without additional explanation?'
    ],
    signals: ['Multi-role product architecture', 'Fintech state design', 'Forms, review, and recovery UX']
  },
  'hamro-idea': {
    title: 'Hamro Idea',
    domain: 'Software studio brand + website',
    audience: 'Prospective clients evaluating a Nepal-based software studio',
    summary: 'A rebrand and multi-page software-studio website where positioning, service architecture, responsive front-end implementation, and search structure were treated as one product communication problem.',
    brief: [
      'A service website cannot convert confusion into trust with visual polish alone. Visitors first need to understand what the company does, which service fits their problem, and why the team is credible enough to contact.',
      'For Hamro Idea, the work combined positioning, information architecture, visual design, front-end implementation, and SEO-minded semantic structure. Building the site also became a way to test the design under real responsive and content constraints.'
    ],
    role: [
      'My contribution covered design and front-end implementation. I worked from positioning and page structure through responsive layouts, reusable patterns, service pages, calls to action, and production-oriented semantic markup.',
      'Because I was close to the build, responsive behavior and content density were tested during design rather than deferred to a handoff document.'
    ],
    constraints: [
      'Service names that make sense internally are not always the language prospective clients use.',
      'A multi-page site needs enough repetition to feel coherent without making every page structurally identical.',
      'Responsive, performance, accessibility, and SEO decisions affect whether the final site still reflects the intended design.'
    ],
    decisions: [
      ['Positioning first', 'Clarify who the studio helps and what each service means before styling the individual sections.'],
      ['Service architecture', 'Organize services around visitor questions and needs instead of mirroring the company’s internal structure.'],
      ['Design in code', 'Use implementation to expose weak hierarchy, awkward responsive behavior, and unrealistic content assumptions early.'],
      ['Semantic delivery', 'Treat accessibility, performance, and search structure as part of the interface rather than post-design cleanup.']
    ],
    flows: [
      'Visitors can move from a broad capability to a service page that explains the work in more specific terms.',
      'Calls to action follow enough context that contact feels like a continuation of the page rather than an interruption.',
      'Reusable sections support consistent rhythm while allowing different services to carry different amounts of content.',
      'Responsive layouts preserve the hierarchy instead of simply stacking desktop blocks.'
    ],
    handoff: 'This project reduced the usual design-to-development gap because implementation was part of the design loop. Reusable page patterns, semantic hierarchy, responsive decisions, and content structures were tested directly in the front end.',
    outcomes: [
      'A clearer service hierarchy for prospective clients.',
      'More direct paths from a visitor problem to relevant service detail and contact.',
      'Responsive patterns tested during implementation rather than deferred to engineering.',
      'A maintainable multi-page structure with reusable patterns and semantic hierarchy.'
    ],
    validation: [
      'Which service descriptions are understood without a sales explanation?',
      'What pages and proof points do qualified prospects visit before contacting the studio?',
      'Which enquiries indicate that the site is attracting the right type of work?'
    ],
    signals: ['End-to-end website ownership', 'Design-to-code workflow', 'Positioning + conversion architecture']
  },
  'masteriyo': {
    title: 'Masteriyo',
    domain: 'WordPress LMS product design',
    audience: 'Course creators, learners, and administrators',
    summary: 'Team-based product design for a WordPress LMS across course authoring, quizzes, learning states, and administration, with new work needing to fit an existing product and design system.',
    brief: [
      'Masteriyo serves people doing fundamentally different jobs inside one product. Course creators need structure, configuration, and repeatability. Learners need focus, progress, feedback, and a clear next action. Administrators need enough control to manage the system.',
      'The design challenge was to reuse product patterns where they reduced learning cost while allowing creator and learner experiences to diverge when their mental models genuinely differed.'
    ],
    role: [
      'I contributed product design within a larger team rather than claiming sole ownership of the LMS. My work covered course and quiz flows, product states, hierarchy, and interface patterns that had to remain consistent with the existing system.',
      'A major part of the contribution was making new states explicit enough for review and implementation while respecting patterns other designers and engineers were already using.'
    ],
    constraints: [
      'Authoring workflows can expose a large number of settings and content relationships.',
      'Learner-facing screens should not inherit administrative language just because the underlying data model is shared.',
      'New interface work has to fit an established WordPress product and a multi-designer workflow.'
    ],
    decisions: [
      ['Role-aware patterns', 'Use one product system without pretending course creators and learners have the same goals or the same tolerance for complexity.'],
      ['Progressive authoring', 'Group course and quiz configuration into manageable decisions instead of exposing the entire setup model at once.'],
      ['Learning feedback', 'Keep progress, quiz state, completion, and the next action visible without leaking administrative complexity into the learning experience.'],
      ['Team consistency', 'Introduce screens and states in a way that can be reviewed, implemented, and extended by the larger product team.']
    ],
    flows: [
      'Course creation is structured as a sequence of manageable configuration decisions.',
      'Quiz states make attempt status, feedback, and next steps understandable to learners.',
      'Creator and learner interfaces reuse visual language while prioritizing different information.',
      'Missing and edge states are documented so the feature does not exist only as a happy-path mockup.'
    ],
    handoff: 'The work was prepared for a collaborative product environment: reusable components, state coverage, consistent naming, and enough interaction context for other designers and engineers to review or extend the flow without reverse-engineering intent from screenshots.',
    outcomes: [
      'Course-authoring patterns organized around progressive configuration.',
      'Learner states focused on progress and feedback rather than administration concepts.',
      'New interface work aligned with an existing WordPress LMS product system.',
      'Clear attribution of the work as a contribution within a larger team.'
    ],
    validation: [
      'Where do creators abandon or misunderstand course setup?',
      'Can learners identify progress and the next action quickly?',
      'Which shared patterns work across creator and learner roles, and where should they intentionally diverge?'
    ],
    signals: ['Product-team collaboration', 'Complex authoring UX', 'Design-system consistency']
  },
  'orkest': {
    title: 'Orkest HQ',
    domain: 'Modular SaaS platform',
    audience: 'Business teams, operators, and administrators working across CRM, sales, inventory, and finance',
    summary: 'UX architecture for a modular business platform spanning CRM, Sales, Inventory, Finance, and shared workspace areas, with a focus on predictable navigation and usable information density.',
    brief: [
      'Orkest needed to connect several business modules without collapsing them into one generic admin interface. Users should be able to move between areas predictably, but each module still has different tasks, data, and local actions.',
      'The core design problem was the system model: deciding what should remain globally consistent, what belongs to a module, what belongs to a specific record or task, and how much information should be visible at scan level.'
    ],
    role: [
      'My contribution focused on UX architecture and product design across the shared workspace and module-level structure. The work included navigation hierarchy, dashboard/table density, shared patterns, and the rules for where module-specific behavior should intentionally differ.',
      'Rather than designing each screen independently, I worked from a repeatable product grammar so future modules could be added without creating a new interaction model every time.'
    ],
    constraints: [
      'CRM, Sales, Inventory, and Finance share product infrastructure but represent different business tasks.',
      'Dense operational views need enough information for scanning without overwhelming users with secondary detail.',
      'Reusable patterns become harmful if they force genuinely different workflows into identical interactions.'
    ],
    decisions: [
      ['System model', 'Define what stays consistent across modules before designing module-level detail.'],
      ['Navigation', 'Use a stable workspace shell so people can predict where shared, module-level, and local actions live.'],
      ['Density', 'Prioritize scan-level information first and move secondary detail behind deliberate inspection.'],
      ['Variation rules', 'Document where shared patterns should diverge because the business task actually changes.']
    ],
    flows: [
      'Global navigation establishes the workspace and shared product destinations.',
      'Module navigation exposes the tasks and entities specific to CRM, Sales, Inventory, or Finance.',
      'Tables and dashboards surface scan-level information before record-level detail.',
      'Shared patterns stay recognizable while module-specific actions remain appropriate to the task.'
    ],
    handoff: 'The useful handoff is a set of system rules, not just finished pages: navigation levels, shared components, density conventions, state behavior, and explicit exceptions. That gives engineering a scalable model for building modules without treating the design system as a straightjacket.',
    outcomes: [
      'A shared workspace model that connects modules without pretending every workflow is identical.',
      'Clearer boundaries between global navigation, module navigation, and local actions.',
      'More deliberate information density for dashboards, tables, and detail views.',
      'Reusable SaaS patterns with explicit rules for legitimate variation.'
    ],
    validation: [
      'Can users move between modules without losing orientation?',
      'Do dense views expose the right information at scan level?',
      'Which shared patterns reduce learning cost, and which become restrictive in real workflows?'
    ],
    signals: ['SaaS information architecture', 'Design systems at product scale', 'Dense operational UI']
  },
  'splashnode': {
    title: 'Splashnode',
    domain: 'Technical platform website + front-end',
    audience: 'Platform buyers and people evaluating content, device, and data-management capabilities',
    summary: 'Website design and front-end implementation for a technical platform, translating content, device, and data-management capabilities into a clearer product story that works across desktop and mobile.',
    brief: [
      'Splashnode had a technical capability set that could easily turn into a feature inventory. Visitors needed to understand how content, devices, and data relate before deeper product detail would be useful.',
      'The website therefore needed a product model, not just sections. The design had to connect capabilities to practical jobs, create a useful reading sequence, and survive implementation and responsive compression without losing that logic.'
    ],
    role: [
      'I designed and coded the website experience. My work included information hierarchy, capability grouping, responsive layouts, interface polish, and front-end implementation.',
      'Working in the browser made implementation a design feedback loop: spacing, semantics, performance, content density, and responsive behavior could be tested against real constraints rather than assumed from a static frame.'
    ],
    constraints: [
      'Technical buyers may need feature depth, while first-time visitors need an understandable product model first.',
      'Responsive layout changes must preserve narrative order, not merely fit smaller widths.',
      'Implementation choices affect performance, semantics, maintainability, and perceived polish.'
    ],
    decisions: [
      ['Value model', 'Translate content, device, and data capabilities into the jobs visitors are trying to accomplish.'],
      ['Capability hierarchy', 'Group technical features into a product model that can be scanned before deeper detail.'],
      ['Responsive narrative', 'Preserve reading order and hierarchy when the layout compresses.'],
      ['Build feedback', 'Use front-end implementation to test spacing, semantics, performance, and content density.']
    ],
    flows: [
      'The top-level story establishes what the platform helps teams manage before listing individual features.',
      'Capability groups help visitors connect related content, device, and data functions.',
      'Deeper detail is available after the product model is established, supporting more technical evaluation.',
      'Responsive behavior preserves the same explanation order on smaller screens.'
    ],
    handoff: 'Because I also implemented the front end, the final deliverable included the actual responsive behavior rather than an interpretation of it. Design decisions were tested against semantic structure, real content, layout constraints, and browser behavior.',
    outcomes: [
      'A clearer mental model for how content, device, and data capabilities relate.',
      'Technical features framed around useful product outcomes instead of feature inventory alone.',
      'A responsive page sequence that remains understandable on smaller screens.',
      'Design decisions tested against implementation rather than left as static assumptions.'
    ],
    validation: [
      'Can first-time visitors explain what the platform does after scanning the page?',
      'Can technical buyers reach deeper capability detail quickly?',
      'Which calls to action best match buyers at different stages of evaluation?'
    ],
    signals: ['Design + front-end execution', 'Technical product storytelling', 'Responsive implementation']
  },
  'morajaa': {
    title: 'Morajaa',
    domain: 'B2B consulting website',
    audience: 'Decision-makers exploring consulting support by business problem, service, or sector',
    summary: 'A consulting website structured around how prospective clients recognize their problems, connecting services, sectors, credibility, and inquiry paths without relying on vague corporate language.',
    brief: [
      'High-consideration B2B visitors may know the problem they are trying to solve without knowing the consulting firm’s internal name for the relevant service. A site organized only around internal categories makes those visitors do translation work before they can evaluate fit.',
      'Morajaa needed connected service and sector paths, a premium but restrained visual system, and inquiry points that appear after enough relevant context to support a serious conversation.'
    ],
    role: [
      'My work focused on website UX, information architecture, visual hierarchy, service/sector relationships, responsive composition, and the path from exploration to inquiry.',
      'The design treated credibility as a content and hierarchy problem. Clear language, relevant proof, and deliberate pacing had to carry more weight than decorative luxury cues.'
    ],
    constraints: [
      'Visitors may enter through a business need, a sector, or a known service, so the site needs multiple coherent discovery paths.',
      'Premium presentation cannot come at the cost of clarity or content accessibility.',
      'Inquiry calls to action should retain the context of what a visitor was evaluating.'
    ],
    decisions: [
      ['Problem-led discovery', 'Let visitors enter through a need, service, or sector instead of requiring internal consulting vocabulary.'],
      ['Connected content', 'Cross-link services and sectors so multiple discovery paths remain coherent rather than becoming duplicate dead ends.'],
      ['Trust through precision', 'Use clear language, proof, and restrained hierarchy instead of vague premium claims.'],
      ['Contextual inquiry', 'Place lead paths after relevant service or sector context so the conversation starts with more useful information.']
    ],
    flows: [
      'Visitors can recognize a relevant business problem before knowing the exact service name.',
      'Service and sector pages connect to each other where context overlaps.',
      'Proof and credibility content appears alongside the decisions it is meant to support.',
      'Inquiry paths follow the content being evaluated so prospects can carry that context into contact.'
    ],
    handoff: 'I organized the site around reusable content relationships and section patterns so the service/sector model could scale without duplicating the entire site structure. Responsive behavior preserves the same discovery logic on smaller screens.',
    outcomes: [
      'More coherent paths between services, sectors, and enquiry.',
      'A clearer premium communication system based on precision rather than ornament.',
      'Service information structured around visitor recognition rather than internal labels.',
      'Inquiry points that retain the context of what the visitor was exploring.'
    ],
    validation: [
      'Can visitors identify the right service without already knowing its internal name?',
      'Which sector or proof content creates the most confidence?',
      'Where do serious prospects decide they have enough context to make contact?'
    ],
    signals: ['B2B information architecture', 'Trust + conversion design', 'Content-heavy responsive UX']
  },
  'neverwinter-parser': {
    title: 'Neverwinter Live Parser',
    domain: 'Game combat-log analysis',
    audience: 'Neverwinter players using combat data to understand encounters and performance',
    summary: 'An interface concept for turning combat-log parser output into encounter-level answers, emphasizing interpretable summaries, drill-down analysis, consistent comparisons, and an honest contract with the data the parser can actually produce.',
    brief: [
      'Raw combat logs are technically detailed but cognitively expensive. Players usually do not want an event stream; they want answers to questions such as what happened during an encounter, how performance differed, and where a build or rotation may have broken down.',
      'The product challenge was to create a hierarchy from raw data to useful interpretation without pretending the parser knows more than it actually does.'
    ],
    role: [
      'My contribution focused on the product and interface model for presenting parser data: encounter summaries, comparison patterns, drill-down structure, filters, and the boundary between reliable data and inferred interpretation.',
      'The design stays constrained by the parser’s available data rather than inventing analytics that the underlying log cannot support.'
    ],
    constraints: [
      'Large event streams need aggressive hierarchy before they become useful to ordinary players.',
      'Metrics can become misleading when units, grouping, or comparison context is not explicit.',
      'The interface cannot promise insights the parser cannot reliably derive from the log.'
    ],
    decisions: [
      ['Question first', 'Start with the encounter questions players are trying to answer rather than exposing raw parser output as the primary interface.'],
      ['Summary then drill-down', 'Use high-level encounter summaries for orientation and deeper diagnostic views when users choose to investigate.'],
      ['Comparable context', 'Keep units, grouping, and scales explicit so differences remain interpretable instead of merely visual.'],
      ['Data contract', 'Design only around data the parser can reliably produce and expose uncertainty when information is incomplete.']
    ],
    flows: [
      'An encounter summary provides quick orientation before deeper analysis.',
      'Users can drill into the metrics relevant to a specific question rather than reading the full event stream.',
      'Comparison views preserve units and context so differences are not exaggerated by presentation.',
      'Filters narrow the analysis while keeping the active comparison state understandable.'
    ],
    handoff: 'The design and parser capability need to evolve together. I treated the available data fields, grouping rules, uncertainty, and interaction states as part of the interface contract so the UI does not drift away from what the parser can support.',
    outcomes: [
      'Combat-log data organized around encounter-level questions instead of raw event streams.',
      'A clearer separation between summary insight and deeper diagnostic detail.',
      'More consistent comparison patterns for performance metrics.',
      'A tighter relationship between parser capability and interface design.'
    ],
    validation: [
      'Which summaries actually change a player’s decision after an encounter?',
      'How much information remains readable when users are switching between gameplay and analysis?',
      'Where do filters or comparisons risk creating false confidence?'
    ],
    signals: ['Data-heavy product design', 'Analytical hierarchy', 'Design constrained by technical capability']
  },
  'grid-labs': {
    title: 'Grid Labs',
    domain: 'Hosting service landing experience',
    audience: 'Visitors comparing hosting, domain, and service options',
    summary: 'A focused hosting landing experience organized around buyer questions, comparable service and pricing information, trust, and a lightweight static implementation rather than pretending the page was a full hosting platform.',
    brief: [
      'Hosting pages often become a wall of plans, badges, technical specifications, and promotional claims. Buyers still need to answer a smaller set of questions: what service fits, what it costs, what is included, and whether the provider feels credible enough to continue.',
      'The work focused on the landing and comparison experience, not on inventing account management or infrastructure features that were outside the actual project scope.'
    ],
    role: [
      'My contribution focused on interface structure and static front-end delivery for the marketing experience: service hierarchy, pricing comparison, domain/search affordance, trust content, and responsive layout.',
      'The implementation scope stayed intentionally lightweight, matching the reality of a static promotional experience instead of presenting it as a complete hosting product.'
    ],
    constraints: [
      'Hosting terminology can overwhelm visitors who are trying to compare a relatively simple purchase decision.',
      'Pricing cards become difficult to compare when plan structure or included features shift between columns.',
      'Trust badges are ineffective if visitors still do not understand the offer.'
    ],
    decisions: [
      ['Buyer questions', 'Prioritize domain, service type, pricing, and trust before secondary hosting detail.'],
      ['Pricing comparison', 'Keep plan structure stable so people can compare without remembering information from another card or tab.'],
      ['Trust timing', 'Place reassurance after the offer is understood instead of using badges as a substitute for clarity.'],
      ['Implementation scope', 'Keep the static build simple and honest about the page’s role in the larger service journey.']
    ],
    flows: [
      'Visitors can identify the relevant hosting/service category before comparing plans.',
      'Pricing cards keep the comparison dimensions stable across options.',
      'Domain/search UI communicates its purpose without implying unsupported account functionality.',
      'Trust content supports an understood offer and leads toward contact or the next service step.'
    ],
    handoff: 'The front-end structure favored clear sections, predictable responsive behavior, and simple reusable patterns. The goal was maintainability for a static site, not introducing a component system more complex than the project needed.',
    outcomes: [
      'A clearer sequence from hosting intent to service comparison and contact.',
      'More comparable pricing and service-card patterns.',
      'Trust content positioned to reinforce an understood offer.',
      'A reusable static front-end structure without overstating product scope.'
    ],
    validation: [
      'Can visitors compare plans accurately without opening additional detail?',
      'Does the domain/search affordance communicate its purpose immediately?',
      'What information is still missing before a visitor is ready to purchase or contact?'
    ],
    signals: ['Commercial information hierarchy', 'Responsive static front-end', 'Scope discipline']
  },
  'zakra-furniture': {
    title: 'Zakra Furniture',
    domain: 'WordPress / Elementor starter-site design',
    audience: 'Furniture shoppers and site owners maintaining catalogue content',
    summary: 'A furniture-oriented WordPress starter-site experience balancing image-led discovery, useful product metadata, flexible content sections, and editor-friendly patterns that site owners can update without breaking the hierarchy.',
    brief: [
      'Furniture discovery is visual, but a useful commerce-oriented page still needs category structure, product labels, comparison information, and clear paths through the catalogue. A starter site adds another constraint: the design must survive different images, copy lengths, and catalogue sizes.',
      'Because the site is intended to be editable in WordPress/Elementor, the design also had to account for the person maintaining the content after launch.'
    ],
    role: [
      'My contribution focused on the visual and structural patterns for a furniture starter site: category discovery, product cards, section flexibility, typography, spacing, and editor-aware layout decisions.',
      'I treated editability as part of usability. A polished template is not successful if routine content updates immediately destroy the layout.'
    ],
    constraints: [
      'Product photography varies dramatically in crop, aspect ratio, and visual weight.',
      'Starter-site sections need to tolerate different catalogue sizes and copy lengths.',
      'Site owners need enough flexibility to edit in Elementor without requiring design expertise for every update.'
    ],
    decisions: [
      ['Visual discovery', 'Let product imagery lead while categories and labels preserve navigational structure.'],
      ['Flexible sections', 'Design content blocks that tolerate different catalogue sizes and text lengths.'],
      ['Useful metadata', 'Keep product information available for comparison without competing with the photography.'],
      ['Editor constraints', 'Use WordPress/Elementor patterns that site owners can update without easily breaking hierarchy.']
    ],
    flows: [
      'Category cues help visitors move from broad visual browsing into more specific product groups.',
      'Product cards balance imagery with enough descriptive information to support comparison.',
      'Section patterns can expand or contract without requiring a redesign for ordinary content changes.',
      'Responsive states keep the image-first hierarchy while preserving readable product information.'
    ],
    handoff: 'The work was designed for a CMS editing environment, so repeatable blocks, image behavior, typography, and spacing rules matter as much as the initial composition. The intention is a starter site that remains usable after real content replaces the demo content.',
    outcomes: [
      'A more structured visual browsing experience for furniture categories and products.',
      'Reusable business sections that can adapt to changing catalogue content.',
      'A clearer balance between photography and decision-supporting text.',
      'Patterns designed to remain manageable inside WordPress and Elementor.'
    ],
    validation: [
      'Can visitors find relevant categories quickly from an image-led page?',
      'Do product cards contain enough information to support comparison?',
      'Can site owners update ordinary content without breaking layout or hierarchy?'
    ],
    signals: ['CMS-aware design', 'Image-led commerce UX', 'Reusable template systems']
  },
  'designerex': {
    title: 'Designerex',
    domain: 'Luxury fashion rental marketplace',
    audience: 'People browsing and comparing designer fashion rentals',
    summary: 'A design contribution to a luxury fashion rental marketplace, focused on image-led browsing, stable listing patterns, practical product information, and premium presentation that does not get in the way of comparison.',
    brief: [
      'Luxury marketplace experiences have two simultaneous jobs: make products desirable and make the practical decision easy. Large photography can create confidence and aspiration, but users still need consistent information about the listing to compare options efficiently.',
      'The work therefore balanced premium visual treatment with marketplace conventions that reduce relearning as users move between listings.'
    ],
    role: [
      'This was a design contribution within a broader product rather than sole product ownership. My work focused on browsing/listing patterns, visual hierarchy, and the relationship between product imagery and decision-supporting metadata.',
      'I keep that scope explicit because the value of a portfolio case is stronger when ownership is accurate enough to discuss in detail during an interview.'
    ],
    constraints: [
      'High-quality product imagery should lead without forcing users to hunt for practical listing details.',
      'Marketplace comparison becomes slower when information changes position or format between cards.',
      'Premium styling can easily introduce unnecessary interaction or visual noise.'
    ],
    decisions: [
      ['Image-led browsing', 'Keep luxury product photography dominant while metadata supports practical decisions.'],
      ['Listing consistency', 'Use stable marketplace patterns so comparison does not require relearning the interface.'],
      ['Premium restraint', 'Use polish to reinforce clarity rather than replacing it with decorative interaction.'],
      ['Contribution scope', 'Keep team contribution boundaries explicit rather than claiming full product ownership.']
    ],
    flows: [
      'Browsing surfaces prioritize product imagery while keeping core listing information consistently placed.',
      'Repeated patterns let users compare options quickly across a visually rich catalogue.',
      'Product detail can carry more information without making the listing grid excessively dense.',
      'Interaction styling supports the marketplace task rather than competing with the product photography.'
    ],
    handoff: 'The contribution was designed to fit the existing product context and marketplace conventions. Reusable listing patterns and clear content hierarchy make the work easier for a larger team to review and extend.',
    outcomes: [
      'More consistent product-listing patterns for marketplace browsing.',
      'A clearer balance between premium presentation and practical product information.',
      'Reusable interaction conventions that reduce comparison friction.',
      'Transparent attribution of the work as a design contribution.'
    ],
    validation: [
      'Which listing details have the greatest effect on rental confidence?',
      'Do browsing and filtering patterns support fast comparison?',
      'Where does premium visual treatment begin to interfere with usability?'
    ],
    signals: ['Marketplace UX', 'Visual hierarchy', 'Team contribution with accurate scope']
  },
  'sassboilerplate': {
    title: 'SassBoilerplate',
    domain: 'Front-end developer utility',
    audience: 'Developers starting small static front-end projects',
    summary: 'A lightweight Sass starter structure built to reduce repeated setup decisions, separate styling responsibilities, and remain easy to understand, adapt, or remove when a project needs something different.',
    brief: [
      'Front-end boilerplate can save time, but it can also create a new maintenance problem when the starter is more opinionated or complex than the projects using it. The useful question was not how much tooling could be included, but which repeated setup decisions were worth standardizing.',
      'The project focused on predictable structure, small defaults, and developer experience rather than presenting a starter repository as a framework.'
    ],
    role: [
      'I structured the Sass workflow around clear styling responsibilities and conventions that could be reused across small projects.',
      'The design decision here is mostly architectural: optimize for comprehension and low removal cost so another developer can change the starter without first learning a private framework.'
    ],
    constraints: [
      'Boilerplate becomes harmful when most projects immediately delete or override large parts of it.',
      'Folder and naming conventions only help if their responsibilities remain obvious to another developer.',
      'A small static project does not need enterprise-level tooling to be maintainable.'
    ],
    decisions: [
      ['Predictable structure', 'Give style files clear responsibilities instead of accumulating one monolithic stylesheet.'],
      ['Light defaults', 'Automate repeated setup without assuming every project needs the same component library.'],
      ['Easy removal', 'Keep conventions simple enough to replace when a project has different needs.'],
      ['Developer experience', 'Optimize for fewer repeated decisions and easier maintenance, not tooling for its own sake.']
    ],
    flows: [
      'A new project starts from a known structure rather than rebuilding the same folders and imports manually.',
      'Styles are grouped by responsibility so changes have a predictable place to live.',
      'Unused conventions can be removed without unraveling the entire setup.',
      'The starter remains understandable without special build knowledge beyond the intended Sass workflow.'
    ],
    handoff: 'For a developer utility, documentation and predictability are part of the interface. The structure is meant to be legible to another developer who did not create it, with minimal hidden coupling between files.',
    outcomes: [
      'A repeatable starting structure for small static front-end projects.',
      'Cleaner separation of styling responsibilities.',
      'Fewer setup decisions repeated across projects.',
      'A lightweight workflow utility that remains easy to adapt or remove.'
    ],
    validation: [
      'Does the starter meaningfully reduce setup time across several real projects?',
      'How much boilerplate remains unused in typical implementations?',
      'Can another developer understand and modify the structure without verbal explanation?'
    ],
    signals: ['Front-end systems thinking', 'Developer experience', 'Maintainability over novelty']
  },
  'zapp': {
    title: 'Zapp Today',
    domain: 'Logistics product',
    audience: 'Customers, drivers, and operations/support teams sharing one delivery lifecycle',
    summary: 'A logistics product connecting booking, driver tasks, route/tracking context, delivery status, and operational visibility across several roles that need different interfaces but must agree on the same delivery reality.',
    brief: [
      'Delivery products are coordination systems. Customers want confidence and a clear status. Drivers need the next operational task without distraction. Operations and support need enough visibility to understand exceptions and recover from them.',
      'The design challenge was to give each role the right interface while keeping state language consistent enough that everyone is talking about the same delivery lifecycle.'
    ],
    role: [
      'My work focused on product UX across the customer, driver, and operational journeys: booking context, active tasks, tracking/status, state transitions, and exception handling.',
      'Rather than reuse the same screens across roles, I used a shared delivery state model while changing information priority and interaction density according to the job each role is doing.'
    ],
    constraints: [
      'Customer, driver, and operations users need different information from the same delivery state.',
      'Drivers need low-distraction task priority during active work.',
      'Delayed, interrupted, reassigned, or failed deliveries create more UX risk than the ideal completed journey.'
    ],
    decisions: [
      ['Role priority', 'Give customer, driver, and operations interfaces different priorities while sharing one delivery state model.'],
      ['Shared status language', 'Keep delivery states consistent across roles so one part of the system does not contradict another.'],
      ['Progressive detail', 'Expose operational detail only when it becomes useful to the current role.'],
      ['Exception paths', 'Design delayed, interrupted, and failed delivery states instead of treating completion as the only real journey.']
    ],
    flows: [
      'Customer booking establishes the delivery request and the information needed for confidence later.',
      'Driver views prioritize the next action, route context, and state update during active work.',
      'Customer tracking exposes useful progress without leaking unnecessary internal operational complexity.',
      'Operations views carry enough state history and exception context to understand what happened when a delivery stalls.'
    ],
    handoff: 'The design is organized around one shared delivery lifecycle with role-specific views. Handoff therefore needs consistent state names, transition rules, available actions by role, and exception behavior rather than separate sets of screens with no common model.',
    outcomes: [
      'A more coherent state model across customer, driver, and operational views.',
      'Clearer task priority for drivers during active work.',
      'Reduced exposure of internal complexity in the customer journey.',
      'More room for operations to understand and recover from delivery exceptions.'
    ],
    validation: [
      'Do cross-role statuses stay consistent when real deliveries change state?',
      'Can drivers identify the next required action quickly during active work?',
      'Where do delayed or interrupted deliveries create the most confusion for customers or support?'
    ],
    signals: ['Multi-role service design', 'Operational state modeling', 'Exception and recovery UX']
  }
};

/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure hireable case studies repository tool.
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
 * Purpose: Remove module behavior without disturbing required surrounding ensure hireable case studies repository tool state.
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
    .replace(/&rarr;|&larr;|↗|→|←/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Function contract: fact
 * Purpose: Implement the fact responsibility owned by the ensure hireable case studies repository tool.
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
 * Function contract: badgeYear
 * Purpose: Implements the badge year responsibility for this module.
 * Inputs: main.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: badgeYear
 * Purpose: Implement the badge year responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function badgeYear(main) {
  const badges = [...main.matchAll(/<span[^>]*class=["'][^"']*badge-pill[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi)].map(/** Callback contract: Processes the callback step for [...main.match all(/<span[^>]*class=["'][^"']*badge pill[^"']*["'][^>]*>([\s\s]*?)<\/span>/gi)] without leaking orchestration details to the caller. Inputs: m. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `m`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (m) => strip(m[1]));
  return badges.find(/** Callback contract: Processes the callback step for badges without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `value`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (value) => /\b20\d{2}(?:\s*[–-]\s*\d{2,4})?\b/.test(value)) || '';
}

/**
 * Function contract: cover
 * Purpose: Implements the cover responsibility for this module.
 * Inputs: main, project.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: cover
 * Purpose: Implement the cover responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `main`: input consumed by this operation; `project`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function cover(main, project) {
  const figure = main.match(/<figure[^>]*class=["'][^"']*agent-case-cover[^"']*["'][^>]*>[\s\S]*?<\/figure>/i)?.[0]
    || main.match(/<div[^>]*class=["'][^"']*case-hero-img-container[^"']*["'][^>]*>[\s\S]*?<\/div>/i)?.[0]
    || main;
  const img = figure.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (!img) return '';
  const alt = /\balt=["']([^"']*)["']/i.exec(img[0])?.[1] || `${project.title} interface`;
  return `<figure class="agent-case-cover nrs-hireable-case-cover"><img src="${esc(img[1])}" alt="${esc(alt)}" loading="eager" decoding="async"></figure>`;
}

/**
 * Function contract: evidenceLinks
 * Purpose: Implements the evidence links responsibility for this module.
 * Inputs: main.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: evidenceLinks
 * Purpose: Implement the evidence links responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `main`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function evidenceLinks(main) {
  const seen = new Set();
  const links = [];
  for (const match of main.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const url = match[1];
    if (/nischhalsubba\.com\.np/i.test(url) || seen.has(url)) continue;
    const label = strip(match[2]) || 'Open project artifact';
    seen.add(url);
    links.push([label, url]);
  }
  return links.slice(0, 6);
}

/**
 * Function contract: paragraphs
 * Purpose: Implements the paragraphs responsibility for this module.
 * Inputs: items.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: paragraphs
 * Purpose: Implement the paragraphs responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `items`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function paragraphs(items) {
  return items.map(/** Callback contract: Processes the callback step for items without leaking orchestration details to the caller. Inputs: item. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (item) => `<p>${esc(item)}</p>`).join('');
}

/**
 * Function contract: bullets
 * Purpose: Implements the bullets responsibility for this module.
 * Inputs: items.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: bullets
 * Purpose: Implement the bullets responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `items`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function bullets(items) {
  return `<ul class="nrs-case-list">${items.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
}

/**
 * Function contract: decisions
 * Purpose: Implement the decisions responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `items`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function decisions(items) {
  return `<div class="agent-decision-grid nrs-case-decision-grid">${items.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[title, text]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ ([title, text]) => `<article class="agent-decision"><span class="agent-meta">Decision</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div>`;
}

/**
 * Function contract: section
 * Purpose: Implement the section responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `index`: input consumed by this operation; `kicker`: input consumed by this operation; `title`: input consumed by this operation; `body`: input consumed by this operation; `className`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function section(index, kicker, title, body, className = '') {
  return `<section class="agent-section ${className}"><div class="agent-frame nrs-case-section"><header class="nrs-case-section-head"><span class="agent-meta">${String(index).padStart(2, '0')} · ${esc(kicker)}</span><h2>${esc(title)}</h2></header><div class="nrs-case-section-body">${body}</div></div></section>`;
}

/**
 * Function contract: renderFacts
 * Purpose: Implement the render facts responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `main`: input consumed by this operation; `project`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function renderFacts(main, project) {
  const role = fact(main, 'Role') || 'Product design contribution';
  const year = fact(main, 'Year') || badgeYear(main);
  const domain = fact(main, 'Domain') || project.domain;
  const users = fact(main, 'Users') || fact(main, 'Audience') || project.audience;
  const items = [['Role', role], ['Domain', domain], ['Audience', users]];
  if (year) items.splice(1, 0, ['Year', year]);
  return `<dl class="agent-case-facts nrs-hireable-case-facts">${items.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[label, value]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ ([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
}

/**
 * Function contract: renderEvidence
 * Purpose: Implement the render evidence responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `links`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function renderEvidence(links) {
  if (!links.length) {
    return `<p class="nrs-case-evidence-note">No public interactive artifact is linked for this project. I am keeping the case limited to the work and decisions that can be shown publicly rather than filling the gap with invented proof.</p>`;
  }
  return `<div class="agent-evidence-links nrs-case-evidence-links">${links.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[label, url]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ ([label, url]) => `<a class="agent-btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join('')}</div><p class="nrs-case-evidence-note">The links above are the public artifacts currently attached to this case. Product metrics or research findings are not claimed where they are not available.</p>`;
}

/**
 * Function contract: renderMain
 * Purpose: Implement the render main responsibility owned by the ensure hireable case studies repository tool.
 * Inputs: `slug`: input consumed by this operation; `main`: input consumed by this operation; `project`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function renderMain(slug, main, project) {
  const image = cover(main, project);
  const links = evidenceLinks(main);
  const role = fact(main, 'Role') || 'Product design contribution';

  const hero = `<header class="agent-case-hero nrs-hireable-case-hero"><div class="agent-frame agent-case-grid"><nav class="nrs-case-breadcrumb" aria-label="Breadcrumb"><a href="/projects">Work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(project.title)}</span></nav><div class="agent-case-title-wrap"><span class="agent-kicker">${esc(project.domain)}</span><h1 class="agent-case-title">${esc(project.title)}</h1></div><p class="agent-case-deck">${esc(project.summary)}</p>${renderFacts(main, project)}${image}</div></header>`;

  const overview = section(1, 'The brief', 'What had to become clearer', `${paragraphs(project.brief)}<div class="nrs-case-callout"><strong>Primary audience</strong><p>${esc(project.audience)}</p></div>`, 'agent-section--compact');
  const contribution = section(2, 'Role and scope', 'What I contributed', `${paragraphs(project.role)}<div class="nrs-case-callout"><strong>Recorded role</strong><p>${esc(role)}</p></div><h3 class="nrs-case-subhead">Constraints I designed around</h3>${bullets(project.constraints)}`);
  const decisionSection = section(3, 'Product decisions', 'Decisions that shaped the work', decisions(project.decisions), 'agent-section--inverse');
  const flowSection = section(4, 'Experience model', 'Flows, states, and hierarchy', `${bullets(project.flows)}<p class="nrs-case-supporting">The point of these flows is not screen count. It is making the state of the product and the user’s next decision understandable.</p>`);
  const handoff = section(5, 'Collaboration and handoff', 'How the work becomes buildable', `<p>${esc(project.handoff)}</p><div class="nrs-case-handoff-grid"><article><strong>What engineering needs</strong><p>Behavior, states, responsive rules, content priority, and intentional exceptions.</p></article><article><strong>What review needs</strong><p>Enough context to discuss tradeoffs and product decisions instead of commenting only on visual polish.</p></article></div>`, 'agent-section--compact');
  const outcome = section(6, 'Delivered design effect', 'What changed in the design', `${bullets(project.outcomes)}<p class="nrs-case-evidence-note"><strong>Evidence boundary:</strong> these are observable design changes. I am not converting design intent into fabricated business metrics.</p>`);
  const validation = section(7, 'Next validation', 'What I would measure or test next', `${bullets(project.validation)}<p class="nrs-case-supporting">If product analytics or research becomes available, these are the questions I would use to test whether the design decisions are producing the intended user behavior.</p>`, 'agent-section--inverse');
  const proof = section(8, 'Evidence', 'Inspect the artifacts, not just the adjectives', renderEvidence(links), 'agent-section--compact');
  const hiring = section(9, 'What this demonstrates', 'The capability behind this project', `<div class="nrs-case-signal-grid">${project.signals.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `signal`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (signal) => `<article><strong>${esc(signal)}</strong></article>`).join('')}</div><div class="agent-actions nrs-case-actions"><a class="agent-btn agent-btn--primary" href="/projects">View all work</a><a class="agent-btn" href="/contact">Discuss similar work</a></div>`);

  return `<main id="main-content" class="agent-main nrs-hireable-case" data-project-slug="${esc(slug)}">${hero}${overview}${contribution}${decisionSection}${flowSection}${handoff}${outcome}${validation}${proof}${hiring}</main>`;
}

const missing = [];
let rewritten = 0;
for (const [slug, project] of Object.entries(projects)) {
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
  html = html.replace(main, renderMain(slug, main, project));
  fs.writeFileSync(file, html, 'utf8');
  rewritten += 1;
}

if (missing.length) {
  throw new Error(`[hireable-case-studies] Missing project inputs: ${missing.join(', ')}`);
}
if (rewritten !== Object.keys(projects).length) {
  throw new Error(`[hireable-case-studies] Expected ${Object.keys(projects).length} rewrites, got ${rewritten}`);
}

for (const [slug] of Object.entries(projects)) {
  const html = fs.readFileSync(path.join(base, `project-${slug}.html`), 'utf8');
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || '';
  if ((main.match(/<h1\b/gi) || []).length !== 1) throw new Error(`[hireable-case-studies] ${slug}: expected one H1`);
  for (const required of ['What I contributed', 'Decisions that shaped the work', 'How the work becomes buildable', 'What I would measure or test next', 'Inspect the artifacts, not just the adjectives']) {
    if (!main.includes(required)) throw new Error(`[hireable-case-studies] ${slug}: missing ${required}`);
  }
}

console.log(`[hireable-case-studies] Rewrote ${rewritten} project case studies with evidence-bounded hiring content.`);
