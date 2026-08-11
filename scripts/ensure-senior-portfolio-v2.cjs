/**
 * @fileoverview scripts/ensure-senior-portfolio-v2.cjs
 * Purpose: Apply evidence-first case-study structure and performance safeguards to the portfolio source or production output.
 * Responsibilities:
 * - Replace selected production case-study bodies with concise problem, decision, evidence, and continuation chapters.
 * - Refine homepage featured-project rows and remove obsolete machine-profile proof markup.
 * - Keep source-mode evidence copy conservative when measured post-launch outcomes are unavailable.
 * - Tune the portfolio runtime for the current Three.js version and avoid expensive visual effects on lower-power devices.
 * - Append one idempotent CSS block for evidence links, responsive controls, and reduced-motion behavior.
 * Execution context: Node.js source-generation and `--dist` production-refinement stage.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - docs/design-dna.json
 * - src/scripts/features/portfolio/portfolio-runtime.js
 * - src/styles/style.css
 * Maintenance: Keep case-study claims tied to visible work. Runtime tuning should remain a small deterministic patch until the values are owned directly by the runtime module.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = process.argv.includes('--dist');
const base = dist ? path.join(root, 'dist') : root;

const cases = {
  'project-yarsha.html': {
    title: 'Yarsha',
    deck: 'A mobile Web3 product where messaging, wallet actions, blinks and transaction review need to feel like one conversation instead of separate systems.',
    chapters: [
      ['Product tension', 'Make financial actions understandable inside a social context.', 'Messaging is conversational and fast. Wallet actions are consequential and need deliberate review. The interface has to connect both mental models without turning every message into a banking screen.'],
      ['Transaction model', 'Treat the transaction as a stateful object, not a decorative chat message.', 'A wallet action needs context, review, intentional signing and a resolved state that stays understandable when the user returns to the thread.'],
      ['Failure states', 'Design the uncomfortable states before celebrating the happy path.', 'Pending, declined, failed and completed outcomes are first-class states because wallet trust is won or lost when the flow stops behaving ideally.'],
      ['Engineering contract', 'Handoff should describe behavior, not just screen appearance.', 'The useful artifact is a state model: what changes, what persists, what the user can do next and which transitions depend on the wallet or network.'],
    ],
    links: [['Open Yarsha design', 'https://www.figma.com/design/pYismUGSJo9vLjViMjZENz/Yarsha?node-id=2379-17138&m=dev']],
    next: ['/project-pihub', 'Next: piHub'],
  },
  'project-pihub.html': {
    title: 'piHub',
    deck: 'A fintech product spanning investor workflows, applications, credit requests, verification and profile management where status and next action need to earn confidence.',
    chapters: [
      ['Product problem', 'Financial workflows become difficult when status and next steps are ambiguous.', 'Several related journeys need to remain distinct while still feeling like one coherent product, especially when users are waiting on requirements or verification.'],
      ['Status architecture', 'Make current state, requirements and next action visible together.', 'Users should not need to remember where they are in a process or search a dashboard to understand what is blocking progress.'],
      ['Density strategy', 'Use density where comparison matters and space where decisions matter.', 'Dashboards can carry more information. Application and verification steps need focused pacing, stronger grouping and less competing information.'],
      ['Recovery states', 'A fintech flow is incomplete until waiting and failure states are designed.', 'Pending, incomplete, approved, rejected and recoverable error states need useful next steps rather than decorative status labels.'],
    ],
    links: [
      ['Creditor prototype', 'https://www.figma.com/proto/HILxD1DKnfALKo4Q5L1IfE/Pihub?node-id=2-8777&page-id=0%3A1'],
      ['Investor prototype', 'https://www.figma.com/proto/HILxD1DKnfALKo4Q5L1IfE/Pihub?node-id=2-36&page-id=1%3A2'],
      ['Admin prototype', 'https://www.figma.com/proto/HILxD1DKnfALKo4Q5L1IfE/Pihub?node-id=2-2821&page-id=1%3A3'],
    ],
    next: ['/project-zapp', 'Next: Zapp Today'],
  },
  'project-zapp.html': {
    title: 'Zapp Today',
    deck: 'A logistics product connecting customer booking, driver tasks, route tracking, delivery status and operational visibility across several roles.',
    chapters: [
      ['Coordination problem', 'Different roles need different interfaces but must agree on the same delivery reality.', 'Customers care about booking and confidence. Drivers care about actionable tasks. Operations care about visibility and exceptions. The experience has to keep those needs synchronized.'],
      ['Customer journey', 'Reduce uncertainty from booking through tracking.', 'The customer flow needs clear expectations around request details, progress, status and delivery completion rather than exposing internal operational complexity.'],
      ['Driver workflow', 'Turn the delivery lifecycle into an obvious sequence of tasks.', 'Driver screens need to prioritize the next operational action, route context and status updates while limiting distractions during active work.'],
      ['Operational visibility', 'Design for exceptions, not only the ideal delivery.', 'Admin and support views need enough state visibility to understand what happened when a task stalls, changes hands or fails to complete normally.'],
    ],
    links: [
      ['Read design case study', 'https://www.figma.com/design/UVuc0LuF7Ykb0yxfPmzOHX/Design-Case-Study?node-id=0-1'],
      ['Customer prototype', 'https://www.figma.com/proto/j0HdOWReS3ZxCJf0SgYPci/Project-Iron?node-id=3-8&page-id=0%3A1'],
      ['Driver prototype', 'https://www.figma.com/proto/j0HdOWReS3ZxCJf0SgYPci/Project-Iron?node-id=82-0&page-id=2%3A3'],
    ],
    next: ['/project-mokshya', 'Next: Mokshya.io'],
  },
  'project-mokshya.html': {
    title: 'Mokshya.io',
    deck: 'A technical protocol website that needs to earn trust from different audiences without flattening the technology into generic crypto marketing.',
    chapters: [
      ['Communication problem', 'Technical depth is useful only after visitors know why they should care.', 'The page has to establish a usable product promise quickly, then reveal deeper protocol context without forcing every visitor through the same level of detail.'],
      ['Audience architecture', 'Separate general understanding from developer depth without creating two disconnected websites.', 'The information sequence moves from outcome to mechanism to proof to developer path so each audience can enter at the right level.'],
      ['Credibility system', 'Use restraint so evidence carries more weight than decoration.', 'Hierarchy, pacing, terminology and proof signals should make technical material feel credible without leaning on ornamental Web3 tropes.'],
      ['Responsive delivery', 'Content structure and responsive behavior are one design problem.', 'Technical sections need readable measure, clear grouping and stable hierarchy as the layout compresses to smaller screens.'],
    ],
    links: [],
    next: ['/project-masteriyo', 'Next: Masteriyo'],
  },
  'project-masteriyo.html': {
    title: 'Masteriyo',
    deck: 'Team-based product design across course creation, learning flows, quizzes and admin states for a WordPress LMS used by creators, learners and administrators.',
    chapters: [
      ['Two mental models', 'Course creators and learners are using the same product for fundamentally different jobs.', 'Authoring needs structure, control and repeatability. Learning needs focus, progress and feedback. Reusing patterns is useful only when the interaction still fits the role.'],
      ['Authoring workflow', 'Make complex course setup feel progressive instead of exposing the entire system at once.', 'Course and quiz configuration benefits from clear grouping, reusable controls and progressive disclosure so creators can build confidently without losing context.'],
      ['Learning states', 'The learner needs progress and feedback, not the administration model behind the content.', 'Quiz, course and completion states should make the next action obvious and keep system language out of the learning experience wherever possible.'],
      ['Team contribution', 'Contribute consistently inside an existing product and design system.', 'This was multi-designer work. The contribution is strongest when new screens respect existing patterns, make missing states explicit and are easy for the team to review and extend.'],
    ],
    links: [['Open Masteriyo Figma file', 'https://www.figma.com/design/FdQeGFEGG7kP4q4FkDHQYP/LMS-Plugin--Copy-?node-id=277-1231']],
    next: ['/project-morajaa', 'Next: Morajaa'],
  },
  'project-morajaa.html': {
    title: 'Morajaa',
    deck: 'A consulting website for high-consideration B2B visitors who may arrive with a business problem but not know the internal name of the service they need.',
    chapters: [
      ['Discovery problem', 'Organize the site around visitor questions instead of internal consulting categories.', 'Service and sector content needs to help a visitor recognize their situation quickly, understand relevant expertise and find a sensible path forward.'],
      ['Information architecture', 'Connect services and sectors without creating duplicate dead ends.', 'Cross-linking service and sector contexts gives visitors more than one useful route while keeping the underlying structure coherent.'],
      ['Trust and tone', 'Premium communication should feel precise, not merely expensive.', 'Hierarchy, restrained visual treatment, proof and clear language do more for credibility than ornamental luxury cues or vague corporate claims.'],
      ['Lead path', 'The inquiry should begin with context, not a generic contact interruption.', 'Calls to action work best when they follow a relevant service or sector story and help visitors carry that context into the conversation.'],
    ],
    links: [['Open final prototype', 'https://www.figma.com/proto/E9BBrx6PdFTqoG3YLvqRX6/morajaa?node-id=680-15253&page-id=452%3A6769']],
    next: ['/projects', 'View all projects'],
  },
};

const featured = ['project-yarsha.html', 'project-pihub.html', 'project-zapp.html'];

/**
 * Function contract: esc
 * Purpose: Escape text before inserting it into generated HTML content or attributes.
 * Inputs: `value` - value to stringify and escape.
 * Side effects: None.
 * Returns: HTML-safe string.
 */
const esc = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

/**
 * Function contract: asset
 * Purpose: Resolve the project cover image for source mode or locate the hashed production copy in `dist/assets`.
 * Inputs: `file` - project HTML filename.
 * Side effects: Reads the production asset directory when running in `--dist` mode.
 * Returns: Public asset URL for the project cover.
 */
function asset(file) {
  const slug = file.replace('project-', '').replace('.html', '');
  if (!dist) return `/assets/images/project-${slug}-cover.svg`;

  const dir = path.join(base, 'assets');
  const hit = fs.existsSync(dir) && fs.readdirSync(dir).find(
    /** Callback contract: Find the hashed production cover whose filename begins with the project's expected cover prefix. Inputs: `name`. Side effects: None. Returns: `true` for the matching asset filename. */
    (name) => name.startsWith(`project-${slug}-cover-`),
  );
  return hit ? `/assets/${hit}` : `/assets/images/project-${slug}-cover.svg`;
}

/**
 * Function contract: replaceMain
 * Purpose: Replace the existing `<main>` element in a generated page with a complete redesigned case-study body.
 * Inputs: `html` - existing page document; `body` - replacement `<main>` markup.
 * Side effects: None.
 * Returns: Updated page HTML.
 */
function replaceMain(html, body) {
  return html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, body);
}

/**
 * Function contract: caseMain
 * Purpose: Render the evidence-first case-study body for one configured project.
 * Inputs: `file` - project filename; `project` - case-study content definition.
 * Side effects: May read the production asset directory through `asset`.
 * Returns: Complete `<main>` HTML for the case-study page.
 */
function caseMain(file, project) {
  const chapterRail = project.chapters.map(
    /** Callback contract: Render one numbered chapter link for the case-study rail. Inputs: `_chapter`, `index`. Side effects: None. Returns: Anchor element HTML. */
    (_chapter, index) => `<a href="#chapter-${index + 1}">0${index + 1}</a>`,
  ).join('');

  const chapters = project.chapters.map(
    /** Callback contract: Render one narrative chapter from its label, heading, body, and position. Inputs: `[label, heading, body]`, `index`. Side effects: None. Returns: Section HTML. */
    ([label, heading, body], index) => `<section class="agent-case-chapter" id="chapter-${index + 1}" data-agent-reveal><span class="agent-meta">0${index + 1} · ${esc(label)}</span><h2>${esc(heading)}</h2><p>${esc(body)}</p></section>`,
  ).join('');

  const evidence = project.links.length
    ? `<div class="agent-evidence-links">${project.links.map(
        /** Callback contract: Render one public evidence link from its label and URL. Inputs: `[label, url]`. Side effects: None. Returns: External anchor HTML. */
        ([label, url]) => `<a class="agent-btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`,
      ).join('')}</div>`
    : '<p class="agent-evidence-empty">No public interactive artifact is linked for this project. The case stays within work that can be shown publicly.</p>';

  return `<main id="main-content" class="agent-main"><header class="agent-case-hero"><div class="agent-frame agent-case-grid"><div class="agent-case-title-wrap"><span class="agent-kicker">Case study</span><h1 class="agent-case-title">${esc(project.title)}</h1></div><p class="agent-case-deck">${esc(project.deck)}</p><figure class="agent-case-cover"><img src="${asset(file)}" alt="${esc(project.title)} interface" decoding="async"></figure></div></header><section class="agent-frame agent-case-chapters"><nav class="agent-case-rail" aria-label="Case study chapters">${chapterRail}<a href="#evidence">05</a></nav><div class="agent-case-body">${chapters}<section class="agent-case-chapter agent-case-evidence" id="evidence" data-agent-reveal><span class="agent-meta">05 · Evidence</span><h2>Inspect the artifact, not just the adjectives.</h2>${evidence}<p class="agent-case-evidence-note">Delivered design decisions and visible artifacts are shown here. Unmeasured intent is not converted into invented product metrics.</p></section><section class="agent-case-chapter" data-agent-reveal><span class="agent-meta">Continue</span><h2>Keep reading the work.</h2><a class="agent-btn agent-btn--primary" href="${project.next[0]}">${esc(project.next[1])}</a><a class="agent-btn" href="/projects">All projects</a></section></div></section></main>`;
}

/**
 * Function contract: projectRow
 * Purpose: Render one featured-project row for the redesigned homepage project list.
 * Inputs: `file` - configured project filename; `index` - zero-based display position.
 * Side effects: May resolve a production image through `asset`.
 * Returns: Linked project-row HTML.
 */
function projectRow(file, index) {
  const project = cases[file];
  return `<a class="agent-project-row" href="/${file.replace('.html', '')}" data-agent-reveal><span class="agent-project-index">0${index + 1}</span><div class="agent-project-copy"><h3>${esc(project.title)}</h3><p>${esc(project.deck)}</p></div><figure class="agent-project-media"><img src="${asset(file)}" alt="${esc(project.title)} project interface" loading="lazy" decoding="async"></figure><span class="agent-project-arrow" aria-hidden="true">↗</span></a>`;
}

/**
 * Function contract: patchHome
 * Purpose: Remove obsolete machine-profile proof markup and refine featured work on redesigned production homepages.
 * Inputs: `html` - homepage document.
 * Side effects: None.
 * Returns: Updated homepage HTML; source-mode pages without the redesigned hero otherwise pass through unchanged.
 */
function patchHome(html) {
  let output = html.replace(/<div class="nrs-home-proof-v49__machine">[\s\S]*?<\/div><\/section>/i, '</section>');
  if (!dist || !output.includes('agent-hero')) return output;

  output = output.replace(
    'I design product flows, interfaces, systems, and implementation-ready handoff for Web3, SaaS, fintech, and software teams that have more complexity than their users should ever need to see.',
    'I design complex software products so users see the decision they need to make, not the system complexity behind it. My work spans product UX, interface systems, and implementation-aware handoff for SaaS, fintech, Web3, and operational software.',
  );

  return output.replace(
    /<div class="agent-project-list">[\s\S]*?<\/div><div class="agent-actions agent-actions--section-end"/i,
    `<div class="agent-project-list">${featured.map(projectRow).join('')}</div><div class="agent-actions agent-actions--section-end"`,
  );
}

/**
 * Function contract: patchSourceCase
 * Purpose: Replace generic evidence-status scaffolding in canonical source cases with plain language about what still needs validation.
 * Inputs: `html` - source case-study document.
 * Side effects: None.
 * Returns: Updated source HTML with redundant evidence-status blocks removed or simplified.
 */
function patchSourceCase(html) {
  return html
    .replace(
      /<div class="nrs-evidence-status" data-evidence-status="intended"><strong>Evidence status:<\/strong> Intended design effect, not a measured product result\.<\/div>/gi,
      '<p class="nrs-evidence-note">Post-launch analytics are not available for this case, so this section stays focused on delivered design changes.</p>',
    )
    .replace(/<div class="nrs-evidence-status"[^>]*>[\s\S]*?<\/div>/gi, '')
    .replace(/What I would discuss in an interview|What still needs evidence/gi, 'What I would validate next');
}

if (fs.existsSync(base)) {
  for (const home of ['index.html', 'home-v2.html']) {
    const file = path.join(base, home);
    if (fs.existsSync(file)) {
      fs.writeFileSync(file, patchHome(fs.readFileSync(file, 'utf8')), 'utf8');
    }
  }

  for (const [fileName, project] of Object.entries(cases)) {
    const file = path.join(base, fileName);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, dist ? replaceMain(html, caseMain(fileName, project)) : patchSourceCase(html), 'utf8');
  }
}

const runtime = path.join(base, 'src', 'scripts', 'features', 'portfolio', 'portfolio-runtime.js');
if (fs.existsSync(runtime)) {
  let js = fs.readFileSync(runtime, 'utf8');
  js = js.replace('three@0.180.0/build/three.module.js', 'three@0.185.0/build/three.module.js');
  js = js.replace(
    'const saveData = Boolean(navigator.connection && navigator.connection.saveData);',
    'const saveData = Boolean(navigator.connection && navigator.connection.saveData);\n  const lowPowerDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);',
  );
  js = js.replace(
    'if (reduceMotion.matches || saveData || !finePointer.matches || !desktop.matches) return;',
    'if (reduceMotion.matches || saveData || lowPowerDevice || !finePointer.matches || !desktop.matches) return;',
  );
  fs.writeFileSync(runtime, js, 'utf8');
}

const style = path.join(base, 'style.css');
if (fs.existsSync(style)) {
  const start = '/* senior-portfolio-v2:start */';
  const end = '/* senior-portfolio-v2:end */';
  let css = fs.readFileSync(style, 'utf8')
    .replace(/\/\* senior-portfolio-v2:start \*\/[\s\S]*?\/\* senior-portfolio-v2:end \*\//g, '')
    .trimEnd();

  css += `\n\n${start}\n.agent-portfolio .agent-evidence-links{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem}.agent-portfolio .agent-case-evidence-note,.agent-portfolio .agent-evidence-empty{max-width:48rem;margin-top:1.5rem;color:var(--ap-ink-faint);font-size:.95rem}.agent-portfolio .agent-case-chapter>.agent-btn+.agent-btn{margin-left:.65rem}@media(max-width:640px){.agent-portfolio .agent-evidence-links{display:grid}.agent-portfolio .agent-evidence-links .agent-btn{width:100%}.agent-portfolio .agent-case-chapter>.agent-btn+.agent-btn{margin-left:0;margin-top:.65rem}}@media(prefers-reduced-motion:reduce){.agent-portfolio [data-agent-reveal]{opacity:1!important;transform:none!important}.agent-portfolio .agent-project-media img{transform:none!important}}\n${end}\n`;
  fs.writeFileSync(style, css, 'utf8');
}

console.log(`[senior-portfolio-v2] Applied evidence-first refinements to ${dist ? 'dist' : 'source'}.`);
