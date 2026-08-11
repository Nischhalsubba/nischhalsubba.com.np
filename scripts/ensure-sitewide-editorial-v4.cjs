/**
 * @fileoverview scripts/ensure-sitewide-editorial-v4.cjs
 * Purpose: Apply the ensure sitewide editorial v4 production transformation or maintenance step while preserving canonical source/build contracts.
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
const siteUrl = 'https://nischhalsubba.com.np';

const projectOrder = [
  'yarsha', 'mokshya', 'pihub', 'orkest', 'neverwinter-parser', 'masteriyo',
  'zapp', 'designerex', 'hamro-idea', 'morajaa', 'splashnode', 'grid-labs',
  'zakra-furniture', 'sassboilerplate',
];
const featuredProjects = new Set(['yarsha', 'mokshya', 'pihub', 'orkest', 'neverwinter-parser', 'masteriyo']);

const projects = {
  yarsha: {
    title: 'Yarsha', domain: 'Web3 messaging + wallet UX',
    card: 'A mobile chat product where wallet actions, Solana blinks and transaction states had to feel connected to conversation without making approval feel casual.',
    deck: 'Designing the moment where a familiar conversation becomes a consequential financial action.',
    problemTitle: 'Chat is fast. Money should make the interface slow down.',
    problem: 'Yarsha puts messages, bot actions and wallet-triggering interactions in the same thread. The product needed to preserve conversational context while making it unmistakable when a user was about to authorize something consequential. The hard part was not drawing a transaction card. It was deciding how intent, review, wallet handoff, waiting, failure and resolution should stay connected as one understandable event.',
    contribution: 'I designed the messaging-to-wallet interaction model, including transaction cards, review states, wallet handoff, pending behavior, rejection and failure recovery, and the resolved state that remains in the conversation. The work focused on behavior between screens as much as the screens themselves.',
    decisions: [['Keep intent beside the action', 'A transaction starts next to the message or bot context that caused it, so the reason for the request is not lost during approval.'], ['Create a deliberate review boundary', 'The interface separates reading a message from authorizing a transaction, giving the user one clear moment to check what will happen.'], ['Treat uncertainty as product state', 'Pending, rejected, failed and completed outcomes use explicit status language and a clear next action instead of optimistic loading copy.']],
    experienceTitle: 'The flow has four jobs',
    experience: ['Conversation explains why the action exists.', 'Review explains exactly what is about to be authorized.', 'Wallet and network states explain what is happening now.', 'Resolution records what happened and returns the user to context.'],
    outcomeTitle: 'A financial action that still belongs to the conversation',
    outcome: 'The resulting model keeps wallet behavior understandable without turning the thread into a finance dashboard. It also gives engineering explicit states to implement rather than a set of finished-looking mockups with the difficult behavior left between them.',
    strengths: ['High-stakes state design', 'Web3 trust UX', 'Behavior-first handoff'],
  },
  mokshya: {
    title: 'Mokshya.io', domain: 'Web3 protocol website',
    card: 'A technical protocol website structured so first-time visitors can understand the product while developers can reach mechanism, evidence and deeper context without wading through marketing filler.',
    deck: 'A technical product story designed for two reading depths: quick comprehension and serious evaluation.',
    problemTitle: 'Explain the value before asking people to learn the vocabulary.',
    problem: 'Mokshya had to speak to people who were curious about the product and people who wanted to inspect how it actually worked. Starting with protocol language would lose the first group; flattening the story into broad Web3 claims would lose the second. The design challenge was to control the order in which complexity appears.',
    contribution: 'I shaped the information architecture, section sequence, responsive composition and translation of protocol concepts into a readable product narrative. The work centered on what should be understood first, where technical detail belongs and how evidence supports the claims around it.',
    decisions: [['Lead with the useful outcome', 'The opening gives visitors a reason to care before introducing mechanism or protocol terminology.'], ['Build two depths into one page', 'Summary and technical detail stay connected, so people can go deeper without forcing every visitor through documentation-length explanation.'], ['Put proof where doubt appears', 'Evidence sits next to the claim it supports rather than being isolated in a generic trust section near the bottom.']],
    experienceTitle: 'A story that earns the right to become technical',
    experience: ['Outcome establishes relevance.', 'Mechanism explains how the product works.', 'Evidence gives the explanation credibility.', 'Developer context provides the deeper evaluation path.'],
    outcomeTitle: 'A protocol site that reads in the right order',
    outcome: 'The site gives non-technical and technical visitors different depths without making them feel like separate audiences on separate websites. Responsive behavior preserves the relationship between explanation and evidence instead of merely stacking desktop sections.',
    strengths: ['Technical information architecture', 'Product narrative design', 'Responsive editorial UX'],
  },
  pihub: {
    title: 'piHub', domain: 'Fintech product workflows',
    card: 'Investment, credit, application and verification experiences organized around the information financial users need most: current status, missing requirements and the next useful action.',
    deck: 'A multi-role fintech product designed around one recurring question: what is happening, what is blocking progress and what can I do next?',
    problemTitle: 'The real friction was uncertainty, not form length.',
    problem: 'piHub spans investor, creditor, applicant and administrative journeys. Users can be waiting on themselves, the system or a reviewer, and those states are easy to blur together. The experience needed to make progress legible without forcing every financial workflow into one generic template.',
    contribution: 'I worked across application, credit, verification, account and dashboard experiences. My focus was status language, forms, review moments, information density, permission-aware actions and recovery paths when a process could not move forward normally.',
    decisions: [['Keep status and next action together', 'Users should not have to inspect one part of the screen to understand state and another to discover what they can do about it.'], ['Change density with the job', 'Dashboards support scanning and comparison; application and verification screens reduce competing information when attention matters.'], ['Design recovery as part of the flow', 'Rejected or incomplete states explain what changed, what remains valid and what needs to happen next.']],
    experienceTitle: 'Different workflows, one language for progress',
    experience: ['Dashboards surface what needs attention.', 'Applications focus on the information required now.', 'Verification explains who or what the process is waiting on.', 'Recovery states show how progress can continue.'],
    outcomeTitle: 'Less guessing about where a process stands',
    outcome: 'The system treats status, requirements and next actions as one product problem. Shared patterns create consistency across roles while allowing the actual workflow to change when the user, permission or financial task changes.',
    strengths: ['Fintech state architecture', 'Multi-role UX', 'Forms and recovery design'],
  },
  orkest: {
    title: 'Orkest HQ', domain: 'Modular SaaS platform',
    card: 'A shared product grammar for CRM, Sales, Inventory and Finance, designed so the modules feel related without pretending their operational jobs are identical.',
    deck: 'A SaaS architecture problem solved from shared rules outward, not screen by screen.',
    problemTitle: 'Consistency only helps when the work is actually the same.',
    problem: 'Orkest brings several business modules into one platform. Navigation, records, tables, permissions and actions need enough consistency to feel like one product, but CRM, inventory and finance do not represent the same task model. The design work began by deciding what should repeat and where intentional difference was more useful than visual uniformity.',
    contribution: 'My scope covered UX architecture across the shared workspace and module structure: navigation levels, dashboards, tables, record views, information density, reusable patterns and the rules for when a module should depart from the shared grammar.',
    decisions: [['Define the product grammar first', 'Navigation, record structure, table behavior and action hierarchy are shared where they reduce relearning.'], ['Let the task justify the exception', 'A module can depart from the common pattern when the operational job genuinely needs different information or sequencing.'], ['Design density deliberately', 'High-volume operational views favor scanning, while record and action states make priority and consequence clearer.']],
    experienceTitle: 'A system with shared primitives and explicit exceptions',
    experience: ['Workspace navigation establishes location and scope.', 'Module dashboards prioritize the work unique to that domain.', 'Records and tables use shared interaction conventions.', 'Exceptions are documented instead of becoming accidental inconsistency.'],
    outcomeTitle: 'One platform without one generic admin screen',
    outcome: 'The architecture gives modules enough common language to feel related while protecting the differences that make each workflow useful. The result is a system engineering can extend without treating every new requirement as a one-off page.',
    strengths: ['SaaS product architecture', 'Information density', 'Design-system judgment'],
  },
  'neverwinter-parser': {
    title: 'Neverwinter Live Parser', domain: 'Real-time game data tool',
    card: 'A live parser that turns noisy combat events into readable performance information while keeping uncertainty and incomplete data visible instead of pretending every number is equally trustworthy.',
    deck: 'A technical side project about transforming raw events into useful evidence without hiding data quality.',
    problemTitle: 'Raw events are plentiful. Trustworthy information is harder.',
    problem: 'A live combat parser has to ingest repeated events, group them correctly, calculate useful summaries and communicate when the underlying data is incomplete or ambiguous. The interface therefore had two jobs: make dense performance data scannable and make the limits of that data visible enough that users do not over-trust a clean number.',
    contribution: 'I worked on the information model, parser-facing UI, aggregation logic presentation and the relationship between raw events, calculated summaries and confidence. The project also let me work directly with implementation constraints rather than handing the design to another discipline.',
    decisions: [['Keep the evidence chain inspectable', 'Summaries should be traceable back to the events that produced them instead of appearing as unexplained totals.'], ['Separate signal from noise', 'The interface prioritizes the comparisons and changes that affect a decision rather than rendering every available value with equal weight.'], ['Show uncertainty instead of polishing it away', 'Missing, delayed or ambiguous data is treated as a state the interface must explain.']],
    experienceTitle: 'From event stream to decision',
    experience: ['Capture raw combat events.', 'Normalize and group events into useful entities.', 'Aggregate metrics with explicit assumptions.', 'Present the result with enough context to judge confidence.'],
    outcomeTitle: 'A data tool that makes its assumptions visible',
    outcome: 'The project demonstrates the same design concern as a business dashboard: information is only useful when people understand where it came from, what it means and how confident they should be in it.',
    strengths: ['Data-product thinking', 'Technical implementation', 'Confidence and uncertainty UX'],
  },
  masteriyo: {
    title: 'Masteriyo', domain: 'WordPress LMS product design',
    card: 'Product-design work inside an established LMS, covering course authoring, quizzes, learner states and reusable patterns that had to fit an existing system and a larger design team.',
    deck: 'One LMS, different mental models for the people building a course and the people trying to learn from it.',
    problemTitle: 'Shared data does not mean shared hierarchy.',
    problem: 'Course creators think in curriculum, settings, publishing and repeatability. Learners think in progress, comprehension, feedback and what comes next. Administrators need oversight. The product needed reusable conventions without letting the underlying content model dictate the interface for every role.',
    contribution: 'I contributed within a larger product team, working on course and quiz flows, learner states, hierarchy and reusable interface patterns. The work had to fit an established WordPress LMS, existing conventions and a collaborative design process.',
    decisions: [['Share conventions, not priorities', 'Creators and learners can reuse familiar components while still seeing information ordered around their different jobs.'], ['Reveal authoring complexity progressively', 'Course and quiz setup is broken into meaningful decisions instead of exposing every configuration option at once.'], ['Keep learner feedback close to the next step', 'Progress, attempt state and completion are presented in the context of what the learner should do next.']],
    experienceTitle: 'One system, two different journeys',
    experience: ['Creators move from structure into progressive configuration.', 'Learners move from content into feedback and continuation.', 'Shared components reduce relearning without forcing equal density.', 'Empty, error and completion states stay inside the same product language.'],
    outcomeTitle: 'A contribution that fits the product instead of competing with it',
    outcome: 'The work demonstrates how to add features inside a mature product and a multi-designer team: respect established patterns, make contribution boundaries clear and document enough behavior for another person to continue the work.',
    strengths: ['Collaborative product design', 'Complex authoring UX', 'Design-system discipline'],
  },
  zapp: {
    title: 'Zapp Today', domain: 'Multi-role logistics product',
    card: 'Customer, driver and operations experiences built around one delivery lifecycle, with role-specific priorities and explicit handling for delays, reassignment and failure.',
    deck: 'Three interfaces looking at the same delivery, each needing a different answer from the same underlying state.',
    problemTitle: 'The roles should share the truth, not the screen.',
    problem: 'Customers want confidence, drivers need the next operational task and support teams need enough history to recover when something goes wrong. All three roles depend on one delivery lifecycle, but showing them the same information would make every experience worse.',
    contribution: 'My work focused on booking context, driver tasks, tracking, delivery status, state transitions and exception handling across customer, driver and operational views.',
    decisions: [['Share one lifecycle', 'The product uses consistent delivery states underneath role-specific interfaces.'], ['Put the next task first for drivers', 'Active-work screens reduce secondary information and prioritize the action needed now.'], ['Design exceptions before support has to explain them', 'Delay, reassignment, interruption and failure receive defined states and recovery paths.']],
    experienceTitle: 'One delivery lifecycle, three useful views',
    experience: ['Booking creates the shared delivery context.', 'Driver views translate state into immediate tasks.', 'Customer tracking translates state into useful confidence.', 'Operations preserve history and exception detail for recovery.'],
    outcomeTitle: 'Different interfaces telling one consistent delivery story',
    outcome: 'The design separates information priority by role without allowing status language to drift between them. That gives the product a stronger foundation for tracking, support and exception handling.',
    strengths: ['Multi-role service design', 'Operational state modeling', 'Exception and recovery UX'],
  },
  designerex: {
    title: 'Designerex', domain: 'Luxury fashion rental marketplace',
    card: 'Marketplace design work balancing luxury photography with stable rental information, comparison patterns and practical decision support.',
    deck: 'A marketplace where desire starts the browse, but structured information has to close the decision.',
    problemTitle: 'Luxury presentation cannot come at the cost of comparison.',
    problem: 'Fashion rental relies heavily on photography and brand perception, but users still need consistent information about size, availability, rental terms and the practical differences between listings. The interface had to preserve the emotional quality of the catalogue without making every decision depend on opening another page.',
    contribution: 'I contributed interface and marketplace UX patterns around listing presentation, browsing, comparison and the relationship between photography and rental information.',
    decisions: [['Let photography lead, not monopolize', 'Imagery carries the emotional weight while the information required to compare remains stable and visible.'], ['Standardize the decision details', 'Key rental attributes use consistent placement so users do not have to relearn each listing.'], ['Keep interaction conventions quiet', 'Filtering, navigation and actions support the catalogue rather than competing visually with it.']],
    experienceTitle: 'Browse emotionally, compare rationally',
    experience: ['Photography creates interest.', 'Stable listing information supports comparison.', 'Availability and rental detail reduce uncertainty.', 'Clear actions move the user from browsing into intent.'],
    outcomeTitle: 'A premium marketplace that still behaves like a useful product',
    outcome: 'The work shows how visual brand character and decision clarity can coexist when the interface assigns them different jobs instead of asking decoration to carry information.',
    strengths: ['Marketplace UX', 'Visual hierarchy', 'Comparison design'],
  },
  'hamro-idea': {
    title: 'Hamro Idea', domain: 'Software studio brand + website',
    card: 'A software-studio rebrand and multi-page website designed and built as one system, from positioning and service architecture to responsive implementation and search structure.',
    deck: 'A service website designed in the browser as much as in the design file.',
    problemTitle: 'The first job was making the offer easier to understand.',
    problem: 'Prospective clients need to know what the studio does, whether the work is relevant and where to go next. The redesign therefore began with positioning and information architecture rather than a visual refresh. It also had to survive real content, responsive constraints and future service pages.',
    contribution: 'I worked across positioning, information architecture, visual design, responsive UI, reusable sections, conversion paths, semantic markup and front-end implementation.',
    decisions: [['Organize around client intent', 'Service structure follows the questions prospective clients are likely to ask rather than internal company terminology.'], ['Use the browser as a design tool', 'Real content lengths, breakpoints and implementation constraints become feedback during design instead of after handoff.'], ['Treat semantics as part of craft', 'Heading structure, accessible markup and search readability are considered during composition, not as post-launch cleanup.']],
    experienceTitle: 'A service journey from fit to proof to contact',
    experience: ['Positioning establishes relevance.', 'Service architecture helps visitors find the right capability.', 'Project proof gives the offer credibility.', 'Contextual calls to action turn evaluation into conversation.'],
    outcomeTitle: 'A clearer offer with less distance between design and build',
    outcome: 'The finished system is easier to extend because the content structure, responsive behavior and front-end patterns were designed together. The case is also a useful example of my preference for staying close to implementation.',
    strengths: ['End-to-end ownership', 'Design-to-code execution', 'Service information architecture'],
  },
  morajaa: {
    title: 'Morajaa', domain: 'B2B consulting website',
    card: 'A consulting website organized around the way prospective clients describe their problems, with service and sector paths that lead toward a more relevant inquiry.',
    deck: 'Turning a broad consulting offer into a site that helps visitors recognize where they fit.',
    problemTitle: 'Consultancy taxonomies make sense internally. Clients arrive with problems.',
    problem: 'Morajaa needed to communicate a broad set of services and sectors without asking visitors to decode the company structure first. The site had to establish credibility while helping business owners and procurement teams move from a problem they recognize toward the right service and contact path.',
    contribution: 'I worked on information architecture, service and sector page structure, premium visual direction, responsive behavior and guided inquiry paths.',
    decisions: [['Start from client language', 'Navigation and page framing use terms a prospective client can recognize before introducing internal service categories.'], ['Connect service and sector context', 'Visitors can approach the offer from the work they need or the environment they operate in.'], ['Ask for better context at contact', 'The inquiry path gathers enough information to route the conversation without becoming a procurement form.']],
    experienceTitle: 'Problem, context, service, conversation',
    experience: ['A visitor recognizes the problem or sector.', 'The site explains the relevant service in practical terms.', 'Evidence and scope establish credibility.', 'The inquiry path carries the useful context into contact.'],
    outcomeTitle: 'A consulting offer that is easier to enter',
    outcome: 'The site makes a broad professional-services business more navigable without flattening it into generic service cards. The structure is designed to help the right visitor self-select and arrive at contact with more useful context.',
    strengths: ['B2B information architecture', 'Service positioning', 'Lead-path design'],
  },
  splashnode: {
    title: 'Splashnode', domain: 'Technical platform website',
    card: 'A website for a content, device and data-management platform, translating technical capability into a clearer buyer-facing story and responsive front-end.',
    deck: 'Technical product storytelling with the design and implementation close enough to correct each other.',
    problemTitle: 'Capabilities are not a story until the buyer can understand the outcome.',
    problem: 'Splashnode combines content, device and data-management capabilities. Listing those features would describe the platform without helping a prospective buyer understand where it fits. The website needed a hierarchy that moved from use case and value into technical capability without losing credibility.',
    contribution: 'I designed and coded the website experience, shaping section hierarchy, capability explanation, responsive behavior and front-end implementation.',
    decisions: [['Translate capability into consequence', 'Technical features are explained through the problem they solve before deeper detail appears.'], ['Keep the buyer path visible', 'The page gives people enough orientation to understand the offer and a clear route toward evaluation or contact.'], ['Let implementation test the composition', 'Responsive behavior and real browser constraints refine the design instead of being treated as a downstream task.']],
    experienceTitle: 'From capability to use case to confidence',
    experience: ['The opening establishes the platform outcome.', 'Use cases make capability concrete.', 'Technical detail supports evaluation.', 'Calls to action appear after enough context has been earned.'],
    outcomeTitle: 'A technical website that explains before it asks',
    outcome: 'The design gives platform capabilities a clearer narrative structure and demonstrates my design-to-front-end workflow on a technical B2B product.',
    strengths: ['Technical product storytelling', 'Responsive web design', 'Front-end implementation'],
  },
  'grid-labs': {
    title: 'Grid Labs', domain: 'Hosting and infrastructure website',
    card: 'Commercial website design focused on plan comparison, buyer questions and making technical hosting choices easier to scan.',
    deck: 'A hosting offer structured around the decisions a buyer needs to make, not the number of specifications the company can list.',
    problemTitle: 'Technical detail only helps when it answers a buying question.',
    problem: 'Hosting pages can become specification walls. Grid Labs needed to make plans comparable, establish what changes between tiers and help visitors understand which option fits without hiding the technical information serious buyers still need.',
    contribution: 'I worked on commercial hierarchy, plan presentation, comparison patterns, responsive layout and the balance between technical specification and purchase-oriented explanation.',
    decisions: [['Make plan differences obvious', 'The hierarchy emphasizes the few attributes that actually change the buying decision.'], ['Separate headline value from technical detail', 'Core differences stay scannable while deeper specifications remain available for serious evaluation.'], ['Keep comparison usable on small screens', 'Responsive behavior protects the relationship between plan, price and included capability.']],
    experienceTitle: 'A decision path, not a feature dump',
    experience: ['Understand the category and intended buyer.', 'Compare the meaningful differences between plans.', 'Inspect deeper technical detail when needed.', 'Move toward the plan or conversation that fits.'],
    outcomeTitle: 'A commercial page that makes technical choice easier',
    outcome: 'The work demonstrates how information hierarchy can support a buying decision without removing the technical depth that gives the offer credibility.',
    strengths: ['Commercial UX', 'Plan comparison', 'Technical content hierarchy'],
  },
  'zakra-furniture': {
    title: 'Zakra Furniture', domain: 'Furniture ecommerce template',
    card: 'A CMS-aware furniture storefront balancing image-led browsing with reusable catalogue patterns that can survive real content and non-designer editing.',
    deck: 'An ecommerce template designed for the content that arrives after the perfect mockup.',
    problemTitle: 'The design had to survive the CMS, not just the artboard.',
    problem: 'Furniture browsing is visual, but a reusable WordPress template has to work with different image crops, product names, category sizes and content entered by people who are not redesigning the page every time. The interface needed enough structure to keep the catalogue coherent under ordinary content variation.',
    contribution: 'I worked on image-led catalogue hierarchy, reusable storefront sections, product-card behavior and template rules that support real CMS content.',
    decisions: [['Give photography predictable space', 'Image treatment stays consistent enough for the catalogue to feel intentional even when source photography varies.'], ['Keep product information comparable', 'Names, categories and decision details follow stable patterns instead of moving with each card.'], ['Design the template for change', 'Spacing, type rules and reusable blocks account for longer copy and evolving catalogue content.']],
    experienceTitle: 'A storefront that remains coherent after launch',
    experience: ['Category structure supports visual browsing.', 'Product cards balance image and useful detail.', 'Reusable sections absorb normal content variation.', 'Template rules reduce accidental visual drift.'],
    outcomeTitle: 'A starter designed for real catalogue content',
    outcome: 'The work is less about one frozen homepage and more about building enough visual rules for a CMS-driven storefront to keep behaving after the demo content disappears.',
    strengths: ['CMS-aware design', 'Image-led commerce UX', 'Reusable template systems'],
  },
  sassboilerplate: {
    title: 'SassBoilerplate', domain: 'Front-end developer utility',
    card: 'A small Sass starter focused on predictable structure, low setup cost and conventions that are easy for another developer to understand or remove.',
    deck: 'A deliberately small developer-experience project about making structure useful without turning it into a framework.',
    problemTitle: 'A starter should remove repetition, not create dependency.',
    problem: 'Boilerplates often grow until developers have to learn the starter before they can build the actual project. This one focused on the opposite: a predictable Sass structure, clear responsibilities and as little hidden coupling as possible.',
    contribution: 'I shaped the file architecture, naming conventions and documentation around a lightweight front-end workflow that another developer could adopt, modify or discard without tribal knowledge.',
    decisions: [['Keep the structure legible', 'A developer should be able to infer where styles belong without reading a long setup guide.'], ['Avoid clever coupling', 'The starter does not require future projects to preserve abstractions they do not need.'], ['Make removal as easy as adoption', 'A useful starter should not punish a team for outgrowing it.']],
    experienceTitle: 'Small structure, explicit responsibility',
    experience: ['Start from a predictable file hierarchy.', 'Keep responsibilities easy to locate.', 'Document only the conventions that matter.', 'Allow the starter to shrink or disappear as the project changes.'],
    outcomeTitle: 'Less repeated setup without a miniature framework',
    outcome: 'The project is intentionally modest. It demonstrates developer-experience thinking, maintainability and a preference for systems that earn their complexity.',
    strengths: ['Front-end systems thinking', 'Developer experience', 'Maintainability over novelty'],
  },
};

const services = {
  'product-design-nepal': {
    title: 'Product Design in Nepal for Software Teams',
    description: 'Product design support from Nischhal Raj Subba for software teams that need clearer UX, stronger interface systems and implementation-ready handoff in Nepal or remotely.',
    kicker: 'Product design · Nepal + remote',
    h1: 'Product design for software that has outgrown simple screens.',
    intro: 'I help software teams turn incomplete requirements, dense workflows and inconsistent interfaces into product experiences people can understand and teams can build. The work can start with one difficult flow or extend across a larger product system.',
    problem: 'Useful when the product has real states, permissions, roles, data or technical constraints and the design work needs to resolve more than visual polish.',
    deliverables: ['Product flows and information architecture', 'High-fidelity responsive interface design', 'Interactive and state-complete prototypes', 'Reusable components and design-system decisions', 'Developer handoff, implementation notes and UI QA'],
    cases: ['pihub', 'orkest', 'masteriyo'],
  },
  'web3-ux-designer': {
    title: 'Web3 UX Designer for Wallet and Transaction Flows',
    description: 'Web3 UX design for wallet connection, signing, transaction review, protocol storytelling and trust-critical product states by Nischhal Raj Subba.',
    kicker: 'Web3 product UX',
    h1: 'Make wallet actions understandable before asking users to trust them.',
    intro: 'Web3 products often ask people to approve actions whose consequences are difficult to read from the interface alone. I design the context, review, wallet handoff, network states and recovery behavior that make those moments easier to understand.',
    problem: 'Useful for products where wallet connection, signing, transaction status or protocol language creates hesitation, support work or avoidable risk.',
    deliverables: ['Wallet onboarding and connection flows', 'Transaction review and signing context', 'Pending, rejected, failed and confirmed states', 'Trust-focused UX writing and hierarchy', 'Web3 product and protocol website structure'],
    cases: ['yarsha', 'mokshya'],
  },
  'saas-ux-designer': {
    title: 'SaaS UX Designer for Complex Dashboards and Workflows',
    description: 'SaaS UX design for dashboards, tables, roles, permissions, forms and multi-step workflows by product designer Nischhal Raj Subba.',
    kicker: 'SaaS product UX',
    h1: 'Complex SaaS should make the next decision easier, not expose the database.',
    intro: 'I design workflow-heavy software around what each role needs to understand and do next. That usually means working through navigation, information density, permissions, forms, states and the exceptions that create real operational friction.',
    problem: 'Useful when a dashboard has accumulated features, different roles need different views or important states are buried inside tables and forms.',
    deliverables: ['Dashboard and workspace architecture', 'Role and permission-aware journeys', 'Tables, filters, records and bulk actions', 'Forms, review states and recovery paths', 'Reusable patterns and design-system rules'],
    cases: ['orkest', 'pihub', 'masteriyo'],
  },
  'figma-design-systems': {
    title: 'Figma Design Systems for Product Teams',
    description: 'Figma design systems, component states, tokens, usage rules and developer handoff for software teams that need consistency without overbuilding.',
    kicker: 'Design systems + handoff',
    h1: 'A design system should remove repeated decisions without flattening the product.',
    intro: 'I build practical Figma systems around the decisions a product repeats: typography, spacing, components, states, responsive behavior and interaction rules. The goal is not a larger library. It is a shared language design and engineering can actually use.',
    problem: 'Useful when screens drift, teams rebuild the same component repeatedly or implementation depends on designers explaining the file from memory.',
    deliverables: ['Foundations and semantic tokens', 'Component variants and interaction states', 'Responsive behavior and content rules', 'Usage guidance and contribution conventions', 'Developer handoff and UI QA'],
    cases: ['orkest', 'masteriyo', 'hamro-idea'],
  },
  'ux-audit': {
    title: 'UX Audit for Software Products and Websites',
    description: 'Evidence-led UX audits for software products and websites, covering usability, accessibility, responsive behavior, states and implementation gaps.',
    kicker: 'UX audit + remediation',
    h1: 'Find the friction before paying to redesign everything.',
    intro: 'A useful UX audit separates visible symptoms from the product decisions causing them. I review flows, hierarchy, content, interaction states, responsive behavior, accessibility and implementation quality, then turn findings into a prioritized fix plan.',
    problem: 'Useful when a product feels inconsistent or difficult but the team needs evidence and priorities before committing to a larger redesign.',
    deliverables: ['Severity-ranked findings with evidence', 'Flow and information-architecture review', 'Accessibility and responsive checks', 'State, feedback and recovery review', 'Practical remediation guidance and priorities'],
    cases: ['neverwinter-parser', 'hamro-idea'],
  },
  'website-ux-design': {
    title: 'Website UX Design for Software and B2B Teams',
    description: 'Website UX design for software products and B2B services, including information architecture, responsive UI, proof, positioning and conversion paths.',
    kicker: 'Website UX + product storytelling',
    h1: 'A website should explain the offer before it asks for the conversion.',
    intro: 'I design product and service websites around the questions a serious visitor needs answered: what is this, is it relevant to me, why should I believe it and what should I do next? Visual design supports that sequence instead of replacing it.',
    problem: 'Useful when a technical product is hard to explain, a service catalogue reflects the company more than the buyer, or the site looks polished but leaves the next step vague.',
    deliverables: ['Positioning and page hierarchy', 'Information architecture and content sequence', 'Responsive interface design', 'Proof, case-study and trust patterns', 'Conversion paths and implementation-ready handoff'],
    cases: ['mokshya', 'morajaa', 'splashnode', 'hamro-idea'],
  },
};


/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}


/**
 * Function contract: strip
 * Purpose: Remove module behavior without disturbing required surrounding ensure sitewide editorial v4 repository tool state.
 * Inputs: `value`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function strip(value = '') {
  return String(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}


/**
 * Function contract: fileFor
 * Purpose: Implement the file for responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `route`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function fileFor(route) {
  if (route === '/') return path.join(base, 'index.html');
  if (route === '/blog/') return path.join(base, 'blog', 'index.html');
  return path.join(base, `${route.replace(/^\//, '')}.html`);
}


/**
 * Function contract: read
 * Purpose: Return module behavior from the supplied inputs or current ensure sitewide editorial v4 repository tool state.
 * Inputs: `route`
 * Side effects: reads filesystem state
 * Returns: The requested module behavior; explicit early-return branches define empty/fallback behavior.
 */
function read(route) {
  const file = fileFor(route);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}


/**
 * Function contract: write
 * Purpose: Implement the write responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `route`, `html`
 * Side effects: writes filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function write(route, html) {
  const file = fileFor(route);
  if (!fs.existsSync(path.dirname(file))) fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html, 'utf8');
}


/**
 * Function contract: meta
 * Purpose: Implement the meta responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `html`, `{ title, description, canonical, type = 'WebPage', image }`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function meta(html, { title, description, canonical, type = 'WebPage', image }) {
  const safeTitle = esc(title);
  const safeDescription = esc(description);
  const safeCanonical = esc(canonical);
  
  /**
   * Function contract: setName
   * Purpose: Synchronize name with the requested state while preserving related ensure sitewide editorial v4 repository tool invariants.
   * Inputs: `source`, `name`, `value`
   * Side effects: No direct external side effect beyond invoked dependencies.
   * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
   */
  const setName = (source, name, value) => {
    const pattern = new RegExp(`<meta\\s+[^>]*name=["']${name}["'][^>]*>`, 'i');
    const tag = `<meta name="${name}" content="${value}" />`;
    return pattern.test(source) ? source.replace(pattern, tag) : source.replace('</head>', `${tag}\n</head>`);
  };
  
  
  /**
   * Function contract: setProperty
   * Purpose: Synchronize property with the requested state while preserving related ensure sitewide editorial v4 repository tool invariants.
   * Inputs: `source`, `name`, `value`
   * Side effects: No direct external side effect beyond invoked dependencies.
   * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
   */
  const setProperty = (source, name, value) => {
    const pattern = new RegExp(`<meta\\s+[^>]*property=["']${name}["'][^>]*>`, 'i');
    const tag = `<meta property="${name}" content="${value}" />`;
    return pattern.test(source) ? source.replace(pattern, tag) : source.replace('</head>', `${tag}\n</head>`);
  };

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  html = setName(html, 'description', safeDescription);
  html = setName(html, 'twitter:title', safeTitle);
  html = setName(html, 'twitter:description', safeDescription);
  html = setProperty(html, 'og:title', safeTitle);
  html = setProperty(html, 'og:description', safeDescription);
  html = setProperty(html, 'og:url', safeCanonical);
  html = html.replace(/<meta\s+[^>]*name=["']nrs-search-intent["'][^>]*>\s*/gi, '');

  const canonicalTag = `<link rel="canonical" href="${safeCanonical}" />`;
  html = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, canonicalTag)
    : html.replace('</head>', `${canonicalTag}\n</head>`);

  if (image) {
    html = setProperty(html, 'og:image', esc(image));
    html = setName(html, 'twitter:image', esc(image));
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description,
    url: canonical,
    isPartOf: { '@type': 'WebSite', name: 'Nischhal Raj Subba', url: `${siteUrl}/` },
    author: { '@type': 'Person', name: 'Nischhal Raj Subba', url: `${siteUrl}/about` },
  };
  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>\n</head>`);
  return html;
}



/**
 * Function contract: asset
 * Purpose: Implement the asset responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `prefix`, `fallback`
 * Side effects: reads filesystem state
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function asset(prefix, fallback = '') {
  const assetsDir = path.join(base, 'assets');
  if (!fs.existsSync(assetsDir)) return fallback;
  const found = fs.readdirSync(assetsDir).find(   /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `name` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (name) => name.startsWith(prefix));
  return found ? `/assets/${found}` : fallback;
}

const coverPrefix = {
  yarsha: 'project-yarsha-cover-', mokshya: 'project-mokshya-cover-', pihub: 'project-pihub-cover-',
  masteriyo: 'project-masteriyo-cover-', orkest: 'project-orkest-cover-', 'hamro-idea': 'project-hamro-idea-cover-',
  morajaa: 'project-morajaa-cover-', splashnode: 'project-splashnode-cover-',
};



/**
 * Function contract: projectImage
 * Purpose: Implement the project image responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `slug`, `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function projectImage(slug, html = '') {
  const fromAsset = coverPrefix[slug] ? asset(coverPrefix[slug]) : '';
  if (fromAsset) return fromAsset;
  return html.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1] || '';
}



/**
 * Function contract: projectImages
 * Purpose: Implement the project images responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function projectImages(html) {
  const seen = new Set();
  const images = [];
  for (const match of html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    const src = match[1];
    if (!src || seen.has(src) || /portrait|avatar|favicon/i.test(src)) continue;
    seen.add(src);
    const alt = match[0].match(/\balt=["']([^"']*)["']/i)?.[1] || '';
    images.push({ src, alt: strip(alt) });
  }
  return images;
}



/**
 * Function contract: externalLinks
 * Purpose: Implement the external links responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function externalLinks(html) {
  const links = [];
  const seen = new Set();
  for (const match of html.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/nischhalsubba\.com\.np/i.test(href) || seen.has(href)) continue;
    seen.add(href);
    links.push({ href, label: strip(match[2]) || 'Open public project link' });
  }
  return links.slice(0, 4);
}



/**
 * Function contract: fact
 * Purpose: Implement the fact responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `html`, `labels`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function fact(html, labels) {
  for (const label of labels) {
    const safe = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = html.match(new RegExp(`<dt[^>]*>\\s*${safe}\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`, 'i'));
    if (match) return strip(match[1]);
  }
  return '';
}



/**
 * Function contract: footer
 * Purpose: Implement the footer responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function footer() {
  return `<footer class="site-footer"><div class="agent-footer-grid"><div class="agent-footer-cta"><span class="agent-kicker">Open to senior product design roles and selected collaborations</span><p><a href="/contact">Need a designer who can make a complicated product easier to reason about?</a></p></div><nav class="agent-footer-links" aria-label="Footer navigation"><a href="/projects">Work</a><a href="/about">About</a><a href="/services">Services</a><a href="/blog/">Writing</a><a href="mailto:hinischalsubba@gmail.com">Email</a><a href="https://www.linkedin.com/in/nischhal/" rel="me">LinkedIn</a><a href="/assets/resume.pdf" data-resume-download>Resume</a></nav><div class="agent-footer-bottom"><span>© 2026 Nischhal Raj Subba</span><span>Kathmandu, Nepal · Remote-friendly</span></div></div></footer>`;
}



/**
 * Function contract: shellCopy
 * Purpose: Implement the shell copy responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function shellCopy(html) {
  html = html.replace(/aria-label=["']Open navigation menu["']/gi, 'aria-label="Open site navigation"');
  html = html.replace(/aria-label=["']Close navigation menu["']/gi, 'aria-label="Close site navigation"');
  html = html.replace(/aria-label=["']Toggle theme["']/gi, 'aria-label="Switch color theme"');
  html = html.replace(/<footer\b[^>]*class=["'][^"']*site-footer[^"']*["'][^>]*>[\s\S]*?<\/footer>/i, footer());
  return html;
}



/**
 * Function contract: projectRow
 * Purpose: Implement the project row responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `slug`, `index`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function projectRow(slug, index) {
  const item = projects[slug];
  const image = projectImage(slug, read(`/project-${slug}`));
  return `<a class="agent-project-row" href="/project-${slug}" data-agent-reveal><span class="agent-project-index">${String(index + 1).padStart(2, '0')}</span><div class="agent-project-copy"><h3>${esc(item.title)}</h3><p>${esc(item.card)}</p></div><div class="agent-project-meta"><span>${esc(item.domain)}</span><span>Case study</span></div>${image ? `<figure class="agent-project-media"><img src="${esc(image)}" alt="${esc(item.title)} project preview" loading="lazy" decoding="async"></figure>` : ''}<span class="agent-project-arrow" aria-hidden="true">↗</span></a>`;
}


/**
 * Function contract: workCard
 * Purpose: Implement the work card responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `slug`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function workCard(slug) {
  const item = projects[slug];
  const image = projectImage(slug, read(`/project-${slug}`));
  return `<a class="nrs-work-card${image ? '' : ' nrs-work-card--text-only'}" href="/project-${slug}">${image ? `<div class="nrs-work-card-media"><img src="${esc(image)}" alt="${esc(item.title)} case study preview" loading="lazy" decoding="async"></div>` : ''}<div class="nrs-work-card-copy"><span class="agent-meta">${esc(item.domain)}</span><h3>${esc(item.title)}</h3><p>${esc(item.card)}</p><span class="nrs-work-card-link">Read case study <span aria-hidden="true">↗</span></span></div></a>`;
}


/**
 * Function contract: renderHome
 * Purpose: Implement the render home responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderHome() {
  const featured = ['yarsha', 'mokshya', 'pihub', 'orkest'];
  return `<main id="main-content" class="agent-main nrs-editorial-home"><section class="agent-hero"><div class="agent-frame agent-hero-grid"><div class="agent-hero-copy"><span class="agent-kicker" data-agent-reveal>Senior product designer · Kathmandu, Nepal · Remote</span><h1 class="agent-display agent-hero-title" data-agent-reveal>I turn complicated product logic into interfaces people can act on.</h1><div class="agent-hero-support" data-agent-reveal><p class="agent-lead">I’m Nischhal Raj Subba. For 6+ years I’ve worked across SaaS, Web3, fintech, enterprise software and product websites, from early product structure through interface systems and implementation handoff.</p><div class="agent-actions"><a class="agent-btn agent-btn--primary" href="/projects">View selected work</a><a class="agent-btn" href="/about">Experience and approach</a></div></div></div><aside class="agent-hero-side" aria-label="Design approach visualization" data-agent-reveal><div class="agent-system-figure"><canvas class="agent-three-canvas" aria-hidden="true"></canvas><p class="agent-system-label">My job is usually the same: find the product logic, expose the important state and make the next decision easier.</p></div><div class="agent-hero-foot"><span>6+ years</span><span>SaaS · Web3 · Fintech</span><span>Design ↔ implementation</span></div></aside></div></section><section class="agent-section" id="selected-work" aria-labelledby="selected-work-heading"><div class="agent-frame"><header class="agent-section-head" data-agent-reveal><span class="agent-kicker">Selected case studies</span><h2 class="agent-section-title" id="selected-work-heading">The work, with the difficult decisions left in.</h2></header><div class="agent-project-list">${featured.map(projectRow).join('')}</div><div class="agent-actions agent-actions--section-end"><a class="agent-btn" href="/projects">See all project work</a></div></div></section><section class="agent-section agent-section--inverse" aria-labelledby="practice-heading"><div class="agent-frame"><header class="agent-section-head"><span class="agent-kicker">What I bring</span><h2 class="agent-section-title" id="practice-heading">Product thinking that survives implementation.</h2></header><div class="agent-capabilities"><article class="agent-capability"><span class="agent-meta">01 · Structure</span><div><h3>Find the real product problem.</h3><p>Clarify roles, states, constraints and decision points before visual polish makes a weak flow look finished.</p></div></article><article class="agent-capability"><span class="agent-meta">02 · Interface</span><div><h3>Make important information easy to act on.</h3><p>Use hierarchy, density, content and interaction states to make complex work feel deliberate rather than crowded.</p></div></article><article class="agent-capability"><span class="agent-meta">03 · Systems</span><div><h3>Reuse decisions, not just components.</h3><p>Build patterns that create consistency while leaving room for workflows that genuinely need to behave differently.</p></div></article><article class="agent-capability"><span class="agent-meta">04 · Delivery</span><div><h3>Close the gap between design and build.</h3><p>Document responsive behavior, states and implementation intent, then stay close enough to QA the real interface.</p></div></article></div></div></section><section class="agent-section nrs-home-experience"><div class="agent-frame"><div class="nrs-home-experience-head"><span class="agent-kicker">Selected experience</span><h2>Agency breadth, product depth and enough front-end proximity to know where handoff breaks.</h2></div><div class="nrs-home-experience-list"><article><span>2025</span><strong>Idealaya</strong><p>Product design for enterprise web software and a reusable interface system.</p></article><article><span>2024–25</span><strong>Mokshya Protocol</strong><p>Web3 product and website design, including wallet-native interaction and technical storytelling.</p></article><article><span>2023</span><strong>Tegzy</strong><p>Lead UX work with a focus on design-system consistency and design-to-development handoff.</p></article></div><a class="agent-btn" href="/about">See the full experience story</a></div></section><section class="agent-section agent-section--compact"><div class="agent-frame agent-contact-strip"><h2>Hiring for a product designer, or trying to untangle a difficult product problem?</h2><div class="agent-actions"><a class="agent-btn agent-btn--primary" href="/contact">Send the context</a><a class="agent-btn" href="/assets/resume.pdf" data-resume-download>View resume</a></div></div></section></main>`;
}



/**
 * Function contract: renderProjects
 * Purpose: Implement the render projects responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderProjects() {
  const featured = projectOrder.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `slug` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (slug) => featuredProjects.has(slug));
  const archive = projectOrder.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `slug` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (slug) => !featuredProjects.has(slug));
  return `<main id="main-content" class="agent-main nrs-projects-editorial nrs-editorial-work"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Product design case studies</span><h1>Work that shows the decisions behind the interface.</h1></div><div class="nrs-work-intro"><p>I’ve worked across mobile products, workflow-heavy SaaS, Web3, fintech, technical websites and design systems. The case studies focus on what I owned, what made the problem difficult and how the product logic changed.</p><p>No invented conversion lifts. No fictional research rounds. If a result is not public, I describe the design outcome I can actually defend.</p></div></div></header><section class="agent-section nrs-work-featured"><div class="agent-frame"><div class="nrs-work-group-head"><span class="agent-meta">Start here</span><h2>Six projects that show the range.</h2><p>These cases are the fastest way to evaluate my product judgment across high-stakes states, complex workflows, technical storytelling and collaborative systems work.</p></div><div class="nrs-work-grid">${featured.map(workCard).join('')}</div></div></section><section class="agent-section nrs-work-archive-section"><div class="agent-frame"><details class="nrs-work-archive"><summary><span><b>Additional work</b><small>${archive.length} more projects across logistics, marketplaces, websites, ecommerce and front-end systems.</small></span><span aria-hidden="true">+</span></summary><div class="nrs-work-grid">${archive.map(workCard).join('')}</div></details></div></section><section class="agent-section agent-section--inverse nrs-work-close"><div class="agent-frame nrs-work-close-grid"><div><span class="agent-meta">What to look for</span><h2>I’m most useful when the product has more complexity than the interface should reveal.</h2></div><div><p>That can mean states and permissions in SaaS, trust and signing in Web3, dense financial workflows, technical product storytelling or simply a handoff that needs fewer unanswered questions.</p><a class="agent-btn" href="/contact">Discuss a role or product</a></div></div></section></main>`;
}



/**
 * Function contract: renderServices
 * Purpose: Implement the render services responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderServices() {
  const items = [
    ['Product UX', 'Clarify roles, journeys, states and decision points before adding more screens.', '/product-design-nepal', '/project-pihub', 'piHub'],
    ['SaaS UX', 'Structure dashboards, permissions, tables, forms and operational workflows around the work each role needs to do.', '/saas-ux-designer', '/project-orkest', 'Orkest HQ'],
    ['Web3 + fintech UX', 'Make wallet, verification and transaction flows clear before users approve sensitive or irreversible actions.', '/web3-ux-designer', '/project-yarsha', 'Yarsha'],
    ['Design systems', 'Create components, states, tokens and usage rules that reduce repeated decisions across design and engineering.', '/figma-design-systems', '/project-masteriyo', 'Masteriyo'],
    ['Website UX', 'Explain technical products and B2B services with stronger information architecture, proof and responsive hierarchy.', '/website-ux-design', '/project-morajaa', 'Morajaa'],
    ['UX audit', 'Find usability, accessibility, responsive and implementation issues, then turn them into prioritized fixes.', '/ux-audit', '/project-neverwinter-parser', 'Neverwinter Live Parser'],
  ];
  return `<main id="main-content" class="agent-main nrs-editorial-services"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Product design services</span><h1>Design support for software with too much complexity behind the screen.</h1></div><p class="agent-page-intro">I work with product teams that need more than a polished layer: clearer product logic, stronger interface decisions, reusable systems and handoff that engineering can act on.</p></div></header><section class="agent-section"><div class="agent-frame agent-service-grid">${items.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[title, copy, href, caseHref, caseTitle]`, `index` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([title, copy, href, caseHref, caseTitle], index) => `<article class="agent-service"><span class="agent-meta">${String(index + 1).padStart(2, '0')}</span><div><h2>${esc(title)}</h2><p>${esc(copy)}</p><div class="agent-service-actions"><a class="agent-service-link" href="${href}">Explore service <span aria-hidden="true">↗</span></a><a class="agent-service-proof" href="${caseHref}">Related case: ${esc(caseTitle)}</a></div></div></article>`).join('')}</div></section><section class="agent-section agent-section--inverse"><div class="agent-frame"><header class="agent-section-head"><span class="agent-kicker">How engagements start</span><h2 class="agent-section-title">Frame the problem. Design the decision. Stay close to the build.</h2></header><div class="agent-capabilities"><article class="agent-capability"><span class="agent-meta">01 · Frame</span><div><h3>Understand what is actually stuck.</h3><p>Users, goals, evidence, constraints, existing product behavior and the decision the work needs to improve.</p></div></article><article class="agent-capability"><span class="agent-meta">02 · Design</span><div><h3>Resolve structure before decoration.</h3><p>Flows, hierarchy, states, content and reusable patterns become reviewable product decisions.</p></div></article><article class="agent-capability"><span class="agent-meta">03 · Ship</span><div><h3>Make implementation part of the design.</h3><p>Responsive rules, handoff, QA and iteration keep the product coherent after the Figma file stops being the source of truth.</p></div></article></div></div></section><section class="agent-section agent-section--compact"><div class="agent-frame agent-contact-strip"><h2>Have a product problem that does not fit neatly into a package?</h2><div class="agent-actions"><a class="agent-btn agent-btn--primary" href="/contact">Send the context</a><a class="agent-btn" href="/projects">Review the work</a></div></div></section></main>`;
}


/**
 * Function contract: renderAbout
 * Purpose: Implement the render about responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderAbout() {
  return `<main id="main-content" class="agent-main nrs-editorial-about"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">About Nischhal Raj Subba</span><h1>I design by staying close to the product and close to the build.</h1></div><p class="agent-page-intro">I’m a product designer based in Kathmandu, Nepal. My work spans UX architecture, interface design, design systems, technical websites and implementation handoff.</p></div></header><section class="agent-section"><div class="agent-frame agent-about-grid"><div class="agent-about-copy agent-rich-copy"><p>I started in agency and client work, which taught me to move between industries and explain design decisions to people with very different priorities. Product roles pushed the work deeper: more states, longer-lived systems, permissions, data, engineering constraints and the consequences of decisions that cannot be solved by a nicer component.</p><p>That is the part of design I enjoy most. I like products where the brief is incomplete and the interface has to make a complicated system easier to reason about. I care about hierarchy, state language, recovery, responsive behavior and the quiet rules that make a product feel predictable.</p><p>I also stay close to implementation. I do not need to own the front end on every project, but understanding browser behavior, component constraints and UI QA makes my design work more practical and my handoff less theatrical.</p></div><aside class="agent-about-aside"><span class="agent-kicker">Quick context</span><div class="agent-proof-stats agent-proof-stats--stacked"><div class="agent-stat"><strong>6+</strong><span>Years in product and UX/UI design</span></div><div class="agent-stat"><strong>Product ↔ code</strong><span>Design systems, handoff and implementation-aware work</span></div><div class="agent-stat"><strong>KTM</strong><span>Kathmandu, Nepal · remote-friendly</span></div></div></aside></div></section><section class="agent-section nrs-experience-section" aria-labelledby="experience-heading"><div class="agent-frame"><header class="nrs-experience-head"><span class="agent-kicker">Experience</span><h2 id="experience-heading">A career that moved from broad client work into deeper product systems.</h2><p>The short version for hiring teams. The resume carries the full chronology.</p></header><div class="nrs-experience-list"><article><div><span>2025</span><strong>Idealaya</strong></div><div><h3>Product Designer</h3><p>Enterprise web software, high-fidelity product design and design-system work aimed at clearer implementation.</p></div></article><article><div><span>2024–25</span><strong>Mokshya Protocol</strong></div><div><h3>Product Designer</h3><p>Web3 product and website design, including wallet-native behavior, prototypes and technical product storytelling.</p></div></article><article><div><span>2023</span><strong>Tegzy</strong></div><div><h3>Lead User Experience Designer</h3><p>Design-system consistency, reusable product patterns and stronger design-to-development handoff.</p></div></article><article><div><span>2021–23</span><strong>ESR Tech</strong></div><div><h3>Senior UI/UX Designer</h3><p>Dashboard and internal-tool UX alongside broader product and website work.</p></div></article><article><div><span>2021</span><strong>ThemeGrill</strong></div><div><h3>Senior UI/UX Designer</h3><p>Reusable UI components and prototypes inside a WordPress product environment.</p></div></article><article><div><span>2019–21</span><strong>Gurzu</strong></div><div><h3>UI/UX Designer</h3><p>Client-facing product design, prototyping and interface improvement across early-stage and existing products.</p></div></article></div><a class="agent-btn" href="/assets/resume.pdf" data-resume-download>View full resume</a></div></section><section class="agent-section agent-section--inverse"><div class="agent-frame"><header class="agent-section-head"><span class="agent-kicker">How I work</span><h2 class="agent-section-title">Three habits I bring into almost every product.</h2></header><div class="agent-capabilities"><article class="agent-capability"><span class="agent-meta">01 · Decision</span><div><h3>Start with what the user needs to decide.</h3><p>It keeps flows, content and visual hierarchy tied to a job instead of a collection of screens.</p></div></article><article class="agent-capability"><span class="agent-meta">02 · State</span><div><h3>Design what happens when the happy path stops.</h3><p>Waiting, errors, permissions, empty states and recovery are product behavior, not cleanup copy.</p></div></article><article class="agent-capability"><span class="agent-meta">03 · Build</span><div><h3>Make the handoff explicit.</h3><p>Responsive rules, component behavior and QA should survive without a designer narrating every frame.</p></div></article></div></div></section><section class="agent-section agent-section--compact"><div class="agent-frame agent-contact-strip"><h2>Want the work history, the product thinking, or both?</h2><div class="agent-actions"><a class="agent-btn agent-btn--primary" href="/projects">View case studies</a><a class="agent-btn" href="/contact">Contact me</a></div></div></section></main>`;
}


/**
 * Function contract: contactForm
 * Purpose: Implement the contact form responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function contactForm(html) {
  let form = html.match(/<form\b[^>]*id=["']contact-form["'][^>]*>[\s\S]*?<\/form>/i)?.[0] || '';
  if (!form) return '';
  form = form
    .replace(/Short project brief/gi, 'Start with the useful context')
    .replace(/Enough context to start a useful conversation\./gi, 'What are you trying to change or ship?')
    .replace(/No polished brief required\. A few honest details are better than a long deck\./gi, 'You do not need a polished brief. A few specific details are more useful than a presentation.')
    .replace(/>Project type</gi, '>What do you need?<')
    .replace(/Select a topic/gi, 'Choose the closest fit')
    .replace(/Freelance UX\/UI project/gi, 'Product design engagement')
    .replace(/UX audit/gi, 'UX audit or product review')
    .replace(/Website redesign/gi, 'Website or product marketing UX')
    .replace(/>Timeline</gi, '>When does it matter?<')
    .replace(/Select timeline/gi, 'Choose a rough timeline')
    .replace(/This week/gi, 'Now / next 2 weeks')
    .replace(/>Message</gi, '>Context<')
    .replace(/Tell me what you are building, who it is for, what is unclear, and where design should help\./gi, 'What are you building or hiring for? Who needs to use it? What feels unclear today? Add links if they help.')
    .replace(/Send project context/gi, 'Send the context')
    .replace(/Use email instead/gi, 'Email me instead')
    .replace(/Your name, email and project context are processed by FormSubmit only to deliver this inquiry\. Do not include passwords, financial information or confidential credentials\./gi, 'I only use these details to reply to this inquiry. Please do not include passwords, credentials or sensitive financial information.')
    .replace(/The form uses spam protection\. If it cannot send, your entries remain available and the email option can be used instead\./gi, 'If delivery fails, your text stays on this page and the email option remains available.');
  return form;
}


/**
 * Function contract: renderContact
 * Purpose: Implement the render contact responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `original`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderContact(original) {
  const form = contactForm(original);
  return `<main id="main-content" class="agent-main nrs-editorial-contact"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Contact</span><h1>Send the complicated version.</h1></div><p class="agent-page-intro">For product design roles or focused design work, tell me what you are building, where the friction is, who needs to use it and when the decision matters.</p></div></header><section class="agent-section"><div class="agent-frame agent-contact-grid"><div class="agent-contact-copy"><span class="agent-kicker">Direct contact</span><p class="agent-lead">Email works just as well: <a href="mailto:hinischalsubba@gmail.com">hinischalsubba@gmail.com</a></p><div class="nrs-contact-context"><div><strong>Good context</strong><span>Product or role · current friction · useful links · rough timeline</span></div><div><strong>Typical reply</strong><span>Within 1–2 working days</span></div><div><strong>Based in</strong><span>Kathmandu, Nepal · remote-friendly</span></div></div></div><div class="agent-contact-form-wrap">${form}</div></div></section><section class="agent-section agent-section--compact"><div class="agent-frame nrs-contact-prep-v4"><span class="agent-kicker">A useful first message answers three things</span><ol><li><strong>What are you trying to ship or improve?</strong><span>Enough product context to understand the job.</span></li><li><strong>Where is the uncertainty?</strong><span>User friction, business risk, design debt or a decision the team cannot resolve.</span></li><li><strong>What changes if we get it right?</strong><span>The user, team or product outcome that makes the work worth doing.</span></li></ol></div></section></main>`;
}



/**
 * Function contract: renderProfile
 * Purpose: Implement the render profile responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderProfile() {
  return `<main id="main-content" class="agent-main nrs-editorial-profile"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Nischhal Raj Subba</span><h1>Product designer in Nepal working across SaaS, Web3, fintech and software.</h1></div><p class="agent-page-intro">I design product flows, interfaces, systems and implementation-ready handoff, with 6+ years across product teams, agencies and front-end collaboration.</p></div></header><section class="agent-section"><div class="agent-frame agent-about-grid"><div class="agent-about-copy agent-rich-copy"><h2>A short professional profile</h2><p>My work sits between product structure and interface craft. I am usually brought into products where roles, states, data, technical constraints or an unfinished brief make the design problem larger than the screen.</p><p>Recent work includes enterprise software, Web3 product UX, fintech workflows, learning products, B2B websites and design systems. I prefer to describe contribution precisely: what I owned, what I influenced, what shipped and what remains private or unmeasured.</p><p>I’m based in Kathmandu and work remotely with product teams.</p></div><aside class="agent-about-aside"><div class="agent-proof-stats agent-proof-stats--stacked"><div class="agent-stat"><strong>6+</strong><span>Years</span></div><div class="agent-stat"><strong>Product</strong><span>UX · UI · systems · handoff</span></div><div class="agent-stat"><strong>Nepal</strong><span>Kathmandu · remote-friendly</span></div></div></aside></div></section><section class="agent-section agent-section--inverse"><div class="agent-frame"><header class="agent-section-head"><span class="agent-kicker">Selected evidence</span><h2 class="agent-section-title">Start with the work, then verify the profile.</h2></header><div class="agent-actions"><a class="agent-btn" href="/projects">Product case studies</a><a class="agent-btn" href="/assets/resume.pdf" data-resume-download>Resume</a><a class="agent-btn" href="https://www.linkedin.com/in/nischhal/">LinkedIn</a><a class="agent-btn" href="https://www.behance.net/nischhal">Behance</a><a class="agent-btn" href="https://github.com/Nischhalsubba">GitHub</a></div></div></section></main>`;
}



/**
 * Function contract: renderWriting
 * Purpose: Implement the render writing responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `original`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderWriting(original) {
  const itemPattern = /<a\b[^>]*class=["'][^"']*(?:agent-index-item|writing-item)[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi;
  const items = [...original.matchAll(itemPattern)].map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (match) => ({ href: match[1], html: match[0] }));
  const seen = new Set();
  const unique = items.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (item) => !seen.has(item.href) && seen.add(item.href));
  const picks = ['/blog/beautiful-interface-poor-ux', '/blog/design-systems-small-product-teams.html', '/blog/responsive-saas-dashboard-handoff-notes.html'];
  const featured = unique.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (item) => picks.includes(item.href)).slice(0, 3);
  const archive = unique.filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (item) => !featured.some(   /** Callback contract: Evaluate whether the current item satisfies the enclosing existential condition. Inputs: `pick` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (pick) => pick.href === item.href));
  return `<main id="main-content" class="agent-main nrs-writing-remediated nrs-editorial-writing"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">Writing</span><h1>Notes from the parts of product design that do not fit neatly in a component library.</h1></div><p class="agent-page-intro">Practical essays on product judgment, UX audits, SaaS workflows, Web3 trust, design systems, responsive behavior and the handoff between design and engineering.</p></div></header>${featured.length ? `<section class="agent-section nrs-writing-featured"><div class="agent-frame"><div class="nrs-writing-featured-head"><span class="agent-kicker">Start here</span><h2>Three pieces that show how I think.</h2><p>Less checklist theatre, more trade-offs, failure modes and decisions that affect the product after the mockup is done.</p></div><div class="nrs-writing-featured-grid">${featured.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (item) => item.html.replace(/agent-index-item|writing-item/, 'agent-index-item nrs-writing-featured-item')).join('')}</div></div></section>` : ''}<section class="agent-section agent-section--compact nrs-writing-archive"><div class="agent-frame"><header class="nrs-writing-archive-head"><span class="agent-kicker">Archive</span><h2>More product design notes</h2></header><div class="agent-index-list">${archive.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `item` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (item) => item.html.replace(/writing-item/, 'agent-index-item')).join('')}</div></div></section></main>`;
}



/**
 * Function contract: renderServiceDetail
 * Purpose: Implement the render service detail responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `slug`, `item`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderServiceDetail(slug, item) {
  const cases = item.cases.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `caseSlug` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (caseSlug) => workCard(caseSlug)).join('');
  return `<main id="main-content" class="agent-main nrs-editorial-service-detail"><header class="agent-page-hero"><div class="agent-frame agent-page-hero-grid"><div><span class="agent-kicker">${esc(item.kicker)}</span><h1>${esc(item.h1)}</h1></div><p class="agent-page-intro">${esc(item.intro)}</p></div></header><section class="agent-section"><div class="agent-frame nrs-service-detail-grid"><div><span class="agent-kicker">When this is useful</span><h2>${esc(item.problem)}</h2></div><div><span class="agent-kicker">Typical scope</span><ul class="nrs-editorial-list">${item.deliverables.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `entry` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (entry) => `<li>${esc(entry)}</li>`).join('')}</ul></div></div></section><section class="agent-section agent-section--inverse"><div class="agent-frame"><header class="agent-section-head"><span class="agent-kicker">How I approach it</span><h2 class="agent-section-title">Make the product decision explicit before making the screen look finished.</h2></header><div class="agent-capabilities"><article class="agent-capability"><span class="agent-meta">01 · Context</span><div><h3>Understand the job and the constraint.</h3><p>Users, evidence, business goal, technical limits and the current behavior that is creating friction.</p></div></article><article class="agent-capability"><span class="agent-meta">02 · Structure</span><div><h3>Resolve flow, hierarchy and states.</h3><p>Turn the problem into reviewable decisions before high-fidelity design makes ambiguity expensive.</p></div></article><article class="agent-capability"><span class="agent-meta">03 · Delivery</span><div><h3>Design for the implementation.</h3><p>Responsive rules, components, interaction notes and QA make the work useful after handoff.</p></div></article></div></div></section><section class="agent-section"><div class="agent-frame"><header class="nrs-work-group-head"><span class="agent-kicker">Relevant case studies</span><h2>See the decisions in real project context.</h2></header><div class="nrs-work-grid">${cases}</div></div></section><section class="agent-section agent-section--compact"><div class="agent-frame agent-contact-strip"><h2>Have a product or role that needs this kind of work?</h2><div class="agent-actions"><a class="agent-btn agent-btn--primary" href="/contact">Send the context</a><a class="agent-btn" href="/projects">Browse all work</a></div></div></section></main>`;
}



/**
 * Function contract: caseFacts
 * Purpose: Implement the case facts responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `original`, `item`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function caseFacts(original, item) {
  const values = [
    ['Role', fact(original, ['My role', 'Role']) || 'Product design contribution'],
    ['Year', fact(original, ['Year'])],
    ['Product', item.domain],
    ['Users', fact(original, ['Users'])],
  ].filter(   /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `[, value]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ ([, value]) => value);
  return `<dl class="agent-case-facts">${values.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[label, value]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
}


/**
 * Function contract: renderCase
 * Purpose: Implement the render case responsibility owned by the ensure sitewide editorial v4 repository tool.
 * Inputs: `slug`, `original`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function renderCase(slug, original) {
  const item = projects[slug];
  const images = projectImages(original);
  const cover = projectImage(slug, original) || images[0]?.src || '';
  const gallery = images.filter( /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `image` Side effects: No direct external side effect beyond invoked dependencies. Returns: Boolean predicate result consumed by the enclosing collection lookup/filter. */ (image) => image.src !== cover).slice(0, 3);
  const links = externalLinks(original);
  const index = projectOrder.indexOf(slug);
  const previous = projectOrder[index > 0 ? index - 1 : projectOrder.length - 1];
  const next = projectOrder[index < projectOrder.length - 1 ? index + 1 : 0];
  const evidence = gallery.length ? `<div class="nrs-case-v4-gallery">${gallery.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `image`, `i` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (image, i) => `<figure><img src="${esc(image.src)}" alt="${esc(image.alt || `${item.title} project artifact ${i + 1}`)}" loading="lazy" decoding="async"><figcaption>${esc(image.alt || `Project artifact ${i + 1}`)}</figcaption></figure>`).join('')}</div>` : `<p class="nrs-case-v4-note">This case has limited public visual material, so the write-up stays focused on the work I can describe accurately rather than filling the page with decorative substitutes.</p>`;
  const publicLinks = links.length ? `<div class="agent-actions">${links.map( /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `link` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (link) => `<a class="agent-btn" href="${esc(link.href)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join('')}</div>` : '<p class="nrs-case-v4-note">No public interactive artifact is attached to this case. I can discuss the available work and contribution boundaries in a hiring conversation.</p>';
  return `<main id="main-content" class="agent-main nrs-case-v4" data-project-slug="${esc(slug)}"><header class="agent-case-hero"><div class="agent-frame agent-case-grid"><nav class="nrs-case-breadcrumb" aria-label="Breadcrumb"><a href="/projects">Work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(item.title)}</span></nav><div class="agent-case-title-wrap"><span class="agent-kicker">${esc(item.domain)}</span><h1 class="agent-case-title">${esc(item.title)}</h1></div><p class="agent-case-deck">${esc(item.deck)}</p>${caseFacts(original, item)}${cover ? `<figure class="agent-case-cover"><img src="${esc(cover)}" alt="${esc(item.title)} product design case study" loading="eager" decoding="async"></figure>` : ''}</div></header><section class="agent-section nrs-case-v4-opening"><div class="agent-frame nrs-case-v4-two-col"><div><span class="agent-meta">The product problem</span><h2>${esc(item.problemTitle)}</h2></div><div class="agent-rich-copy"><p>${esc(item.problem)}</p><p><strong>My contribution.</strong> ${esc(item.contribution)}</p></div></div></section><section class="agent-section agent-section--inverse"><div class="agent-frame"><header class="agent-section-head"><span class="agent-kicker">Key decisions</span><h2 class="agent-section-title">Where the design judgment mattered.</h2></header><div class="agent-decision-grid nrs-case-v4-decisions">${item.decisions.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[title, text]` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ ([title, text]) => `<article class="agent-decision"><span class="agent-meta">Decision</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></div></section><section class="agent-section"><div class="agent-frame nrs-case-v4-two-col"><div><span class="agent-kicker">Experience model</span><h2>${esc(item.experienceTitle)}</h2><p>${esc(item.outcome)}</p></div><ol class="nrs-case-v4-steps">${item.experience.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `step`, `i` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (step, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(step)}</p></li>`).join('')}</ol></div></section><section class="agent-section nrs-case-v4-evidence"><div class="agent-frame"><header class="nrs-case-evidence-head"><span class="agent-kicker">Project evidence</span><h2>Screens, shipped material and public references.</h2><p>The artifacts sit inside the story because proof is more useful next to the decision it supports than in a ceremonial section at the end.</p></header>${evidence}${publicLinks}</div></section><section class="agent-section agent-section--compact"><div class="agent-frame nrs-case-v4-outcome"><div><span class="agent-kicker">What this work demonstrates</span><h2>${esc(item.outcomeTitle)}</h2><p>${esc(item.outcome)}</p></div><div class="nrs-case-v4-signals">${item.strengths.map(   /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `strength` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (strength) => `<span>${esc(strength)}</span>`).join('')}</div></div></section><nav class="agent-section nrs-case-next" aria-label="Project case study navigation"><div class="agent-frame"><a href="/project-${previous}"><span>Previous case</span><strong>${esc(projects[previous].title)}</strong></a><a href="/projects"><span>Index</span><strong>All work</strong></a><a href="/project-${next}"><span>Next case</span><strong>${esc(projects[next].title)}</strong></a></div></nav></main>`;
}


/**
 * Function contract: applyPage
 * Purpose: Apply page consistently while preserving the surrounding ensure sitewide editorial v4 repository tool contract.
 * Inputs: `route`, `main`, `seo`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function applyPage(route, main, seo) {
  let html = read(route);
  if (!html) return false;
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  html = meta(html, seo);
  html = shellCopy(html);
  write(route, html);
  return true;
}

const homeImage = `${siteUrl}/assets/images/portrait.png`;
applyPage('/', renderHome(), {
  title: 'Nischhal Raj Subba | Product Designer for SaaS, Web3 & Fintech',
  description: 'Product design portfolio of Nischhal Raj Subba, a Nepal-based designer with 6+ years across SaaS, Web3, fintech, enterprise software, design systems and implementation handoff.',
  canonical: `${siteUrl}/`, type: 'ProfilePage', image: homeImage,
});
applyPage('/projects', renderProjects(), {
  title: 'Product Design Case Studies | Nischhal Raj Subba',
  description: 'Product design case studies covering SaaS, Web3, fintech, logistics, marketplaces, technical websites and implementation-aware interface systems.',
  canonical: `${siteUrl}/projects`, type: 'CollectionPage',
});
applyPage('/services', renderServices(), {
  title: 'Product Design Services for Software Teams | Nischhal Raj Subba',
  description: 'Product UX, SaaS workflows, Web3 and fintech UX, design systems, website UX and evidence-led UX audits for software teams.',
  canonical: `${siteUrl}/services`, type: 'Service',
});
applyPage('/about', renderAbout(), {
  title: 'About Nischhal Raj Subba | Product Designer in Nepal',
  description: 'About Nischhal Raj Subba, a Kathmandu-based product designer with 6+ years across SaaS, Web3, enterprise software, design systems and implementation handoff.',
  canonical: `${siteUrl}/about`, type: 'ProfilePage', image: homeImage,
});
const contactOriginal = read('/contact');
applyPage('/contact', renderContact(contactOriginal), {
  title: 'Contact Nischhal Raj Subba | Product Design',
  description: 'Contact Nischhal Raj Subba about senior product design roles, SaaS and Web3 product work, UX audits, design systems or complex interface problems.',
  canonical: `${siteUrl}/contact`, type: 'ContactPage',
});
applyPage('/nischhal-raj-subba', renderProfile(), {
  title: 'Nischhal Raj Subba | Product Designer in Nepal',
  description: 'Official professional profile for Nischhal Raj Subba, a product designer in Kathmandu working across SaaS, Web3, fintech, design systems and implementation-aware UX.',
  canonical: `${siteUrl}/nischhal-raj-subba`, type: 'ProfilePage', image: homeImage,
});
const writingOriginal = read('/blog/');
if (writingOriginal) {
  applyPage('/blog/', renderWriting(writingOriginal), {
    title: 'Product Design Writing | Nischhal Raj Subba',
    description: 'Product design essays on UX audits, SaaS workflows, Web3 trust, design systems, responsive behavior and design-to-development handoff.',
    canonical: `${siteUrl}/blog/`, type: 'Blog',
  });
}

for (const [slug, item] of Object.entries(services)) {
  const route = `/${slug}`;
  if (!read(route)) continue;
  applyPage(route, renderServiceDetail(slug, item), {
    title: `${item.title} | Nischhal Raj Subba`,
    description: item.description,
    canonical: `${siteUrl}/${slug}`,
    type: 'Service',
  });
}

for (const slug of projectOrder) {
  const route = `/project-${slug}`;
  const original = read(route);
  if (!original) continue;
  const item = projects[slug];
  const image = projectImage(slug, original);
  applyPage(route, renderCase(slug, original), {
    title: `${item.title} Product Design Case Study | Nischhal Raj Subba`,
    description: item.card,
    canonical: `${siteUrl}/project-${slug}`,
    type: 'CreativeWork',
    image: image ? `${siteUrl}${image.startsWith('/') ? image : `/${image}`}` : undefined,
  });
}

// Preserve authored long-form article bodies. Improve their surrounding site microcopy
// and remove the non-standard search-intent metadata without machine-churning the essays.
const blogDir = path.join(base, 'blog');
if (fs.existsSync(blogDir)) {
  for (const entry of fs.readdirSync(blogDir)) {
    if (!entry.endsWith('.html') || entry === 'index.html') continue;
    const file = path.join(blogDir, entry);
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<meta\s+[^>]*name=["']nrs-search-intent["'][^>]*>\s*/gi, '');
    html = shellCopy(html);
    html = html.replace(/>Back to (?:Writing|Blog)</gi, '>All writing<');
    html = html.replace(/>Read more posts</gi, '>Browse more writing<');
    fs.writeFileSync(file, html, 'utf8');
  }
}

const start = '/* nrs-sitewide-editorial-v4:start */';
const end = '/* nrs-sitewide-editorial-v4:end */';
const marker = /\/\* nrs-sitewide-editorial-v\d+:start \*\/[\s\S]*?\/\* nrs-sitewide-editorial-v\d+:end \*\//g;
const css = `${start}
.agent-portfolio .nrs-home-experience,
.agent-portfolio .nrs-editorial-service-detail,
.agent-portfolio .nrs-editorial-profile { min-width: 0; }
.agent-portfolio .nrs-home-experience-head,
.agent-portfolio .nrs-service-detail-grid,
.agent-portfolio .nrs-case-v4-two-col,
.agent-portfolio .nrs-case-v4-outcome {
  display: grid;
  grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
  gap: clamp(2rem, 7vw, 8rem);
  align-items: start;
}
.agent-portfolio .nrs-home-experience-head { margin-bottom: 2rem; }
.agent-portfolio .nrs-home-experience-head h2,
.agent-portfolio .nrs-service-detail-grid h2,
.agent-portfolio .nrs-case-v4-two-col h2,
.agent-portfolio .nrs-case-v4-outcome h2 {
  margin: 0;
  color: var(--ap-ink);
  font: 730 clamp(2.4rem, 5vw, 5.2rem)/.92 var(--ap-font-display);
  letter-spacing: -.06em;
}
.agent-portfolio .nrs-home-experience-list { border-top: 1px solid var(--ap-line-strong); margin-bottom: 1.5rem; }
.agent-portfolio .nrs-home-experience-list article {
  display: grid;
  grid-template-columns: 7rem 12rem minmax(0, 1fr);
  gap: 1rem;
  padding: 1.2rem 0;
  border-bottom: 1px solid var(--ap-line);
}
.agent-portfolio .nrs-home-experience-list span { color: var(--ap-ink-faint); font: 600 .75rem/1.4 var(--ap-font-mono); }
.agent-portfolio .nrs-home-experience-list strong { color: var(--ap-ink); }
.agent-portfolio .nrs-home-experience-list p { margin: 0; color: var(--ap-ink-soft); }
.agent-portfolio .nrs-editorial-list { display: grid; gap: 0; margin: 1rem 0 0; padding: 0; border-top: 1px solid var(--ap-line-strong); list-style: none; }
.agent-portfolio .nrs-editorial-list li { padding: 1rem 0; border-bottom: 1px solid var(--ap-line); color: var(--ap-ink); }
.agent-portfolio .nrs-contact-context { display: grid; margin-top: 2rem; border-top: 1px solid var(--ap-line-strong); }
.agent-portfolio .nrs-contact-context > div { display: grid; gap: .25rem; padding: 1rem 0; border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-contact-context strong { color: var(--ap-ink); }
.agent-portfolio .nrs-contact-context span { color: var(--ap-ink-soft); }
.agent-portfolio .nrs-contact-prep-v4 ol { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin: 2rem 0 0; padding: 0; list-style: none; border-top: 1px solid var(--ap-line-strong); }
.agent-portfolio .nrs-contact-prep-v4 li { display: grid; gap: .6rem; padding: 1.2rem 1rem 0 0; border-right: 1px solid var(--ap-line); }
.agent-portfolio .nrs-contact-prep-v4 li:last-child { border-right: 0; }
.agent-portfolio .nrs-contact-prep-v4 li strong { color: var(--ap-ink); font-size: 1.15rem; }
.agent-portfolio .nrs-contact-prep-v4 li span { color: var(--ap-ink-soft); }
.agent-portfolio .nrs-case-v4-opening,
.agent-portfolio .nrs-case-v4-evidence { padding-block: clamp(3.5rem, 6vw, 6rem) !important; }
.agent-portfolio .nrs-case-v4-two-col .agent-rich-copy { max-width: 48rem; }
.agent-portfolio .nrs-case-v4-decisions { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.agent-portfolio .nrs-case-v4-decisions .agent-decision { min-height: 18rem; }
.agent-portfolio .nrs-case-v4-steps { margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--ap-line-strong); }
.agent-portfolio .nrs-case-v4-steps li { display: grid; grid-template-columns: 3rem minmax(0, 1fr); gap: 1rem; padding: 1rem 0; border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-case-v4-steps li span { color: var(--ap-signal); font: 700 .72rem/1.4 var(--ap-font-mono); }
.agent-portfolio .nrs-case-v4-steps p { margin: 0; color: var(--ap-ink); }
.agent-portfolio .nrs-case-v4-gallery { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin: 2rem 0; }
.agent-portfolio .nrs-case-v4-gallery figure { margin: 0; min-width: 0; border: 1px solid var(--ap-line); background: var(--ap-surface); }
.agent-portfolio .nrs-case-v4-gallery img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.agent-portfolio .nrs-case-v4-gallery figcaption { padding: .75rem; color: var(--ap-ink-soft); font: 600 .72rem/1.4 var(--ap-font-mono); }
.agent-portfolio .nrs-case-v4-note { max-width: 46rem; color: var(--ap-ink-soft); }
.agent-portfolio .nrs-case-v4-signals { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--ap-line-strong); }
.agent-portfolio .nrs-case-v4-signals span { min-height: 5rem; padding: 1rem 1rem 1rem 0; border-bottom: 1px solid var(--ap-line); color: var(--ap-ink); font-weight: 650; }
.agent-portfolio .nrs-case-v4-signals span + span { padding-left: 1rem; border-left: 1px solid var(--ap-line); }
.agent-portfolio .nrs-case-breadcrumb { display: flex; align-items: center; gap: .5rem; grid-column: 1 / -1; margin-bottom: 1rem; color: var(--ap-ink-faint); font: 600 .72rem/1.3 var(--ap-font-mono); text-transform: uppercase; }
.agent-portfolio .nrs-case-breadcrumb a { min-height: 44px; display: inline-flex; align-items: center; color: var(--ap-ink-soft); text-decoration: none; }
.agent-portfolio .agent-footer-cta { display: grid; gap: .75rem; }
.agent-portfolio .agent-footer-cta p { margin: 0; }
.agent-portfolio .agent-footer-cta p a { color: inherit; text-decoration: none; }
@media (max-width: 900px) {
  .agent-portfolio .nrs-home-experience-head,
  .agent-portfolio .nrs-service-detail-grid,
  .agent-portfolio .nrs-case-v4-two-col,
  .agent-portfolio .nrs-case-v4-outcome { grid-template-columns: minmax(0, 1fr); gap: 1.75rem; }
  .agent-portfolio .nrs-case-v4-decisions { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-case-v4-decisions .agent-decision { min-height: 0; }
  .agent-portfolio .nrs-case-v4-gallery { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-contact-prep-v4 ol { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-contact-prep-v4 li { border-right: 0; border-bottom: 1px solid var(--ap-line); padding-right: 0; }
}
@media (max-width: 640px) {
  .agent-portfolio .nrs-home-experience-list article { grid-template-columns: 5.5rem minmax(0, 1fr); }
  .agent-portfolio .nrs-home-experience-list article p { grid-column: 2; }
  .agent-portfolio .nrs-case-v4-signals { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-case-v4-signals span,
  .agent-portfolio .nrs-case-v4-signals span + span { padding-left: 0; border-left: 0; }
}
${end}`;

if (!fs.existsSync(stylePath)) throw new Error('[sitewide-editorial] Missing style.css');
let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(marker, '').trimEnd();
style += `\n\n${css}\n`;
fs.writeFileSync(stylePath, style, 'utf8');

const checks = [
  ['index.html', 'I turn complicated product logic into interfaces people can act on.'],
  ['projects.html', 'Work that shows the decisions behind the interface.'],
  ['services.html', 'Design support for software with too much complexity behind the screen.'],
  ['about.html', 'I design by staying close to the product and close to the build.'],
  ['contact.html', 'Send the complicated version.'],
  ['project-yarsha.html', 'Chat is fast. Money should make the interface slow down.'],
];
for (const [fileName, required] of checks) {
  const file = path.join(base, fileName);
  if (!fs.existsSync(file) || !fs.readFileSync(file, 'utf8').includes(required)) {
    throw new Error(`[sitewide-editorial] Missing final copy contract in ${fileName}: ${required}`);
  }
}

console.log('[sitewide-editorial] Rewrote portfolio, service, profile and project copy; refreshed metadata and sitewide microcopy while preserving authored long-form article bodies.');
