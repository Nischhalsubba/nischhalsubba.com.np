const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const target = path.join(base, 'project-yarsha.html');

const main = `<main id="main-content" class="container nrs-case-study nrs-case-editorial">
  <section class="nrs-case-hero" aria-labelledby="case-title">
    <div class="nrs-case-hero__copy">
      <p class="nrs-editorial-kicker nrs-motion-reveal">Case study / Web3 messaging / 2024</p>
      <h1 id="case-title" class="nrs-case-title nrs-motion-reveal"><span class="nrs-case-title__text">Yarsha</span></h1>
      <p class="nrs-case-deck nrs-motion-reveal">A messaging-first mobile experience designed to make wallet actions, transaction review, signing context and recovery easier to understand.</p>
    </div>
    <dl class="nrs-case-facts nrs-motion-reveal">
      <div class="nrs-case-fact"><dt>Role</dt><dd>Product Designer</dd></div>
      <div class="nrs-case-fact"><dt>Scope</dt><dd>UX, interface design, prototype and reusable patterns</dd></div>
      <div class="nrs-case-fact"><dt>Platform</dt><dd>Mobile product</dd></div>
      <div class="nrs-case-fact"><dt>Domain</dt><dd>Web3 messaging</dd></div>
    </dl>
  </section>

  <figure class="nrs-case-visual nrs-motion-reveal"><img src="/assets/images/project-yarsha-cover.svg" alt="Yarsha mobile product screens showing messaging, wallet actions, payments and settings" loading="eager" decoding="async"></figure>

  <section id="case-problem" class="nrs-case-chapter" aria-labelledby="case-problem-title">
    <header class="nrs-case-chapter__heading"><p class="nrs-case-chapter__index">01 / Product challenge</p><h2 id="case-problem-title" class="nrs-case-chapter__title"><span class="nrs-case-chapter__title-text">Keep messaging familiar while making commitment explicit.</span></h2></header>
    <div class="nrs-case-chapter__body"><p>Yarsha combined everyday chat behaviour with wallet-connected actions, groups, payments and bots. The design needed to make the moment a conversation became an irreversible product action unmistakable.</p><div class="nrs-flow-map" aria-label="Core wallet action flow"><article class="nrs-flow-step"><span>01</span><div><strong>Conversation</strong><p>Keep the familiar chat context and intent visible.</p></div></article><article class="nrs-flow-step"><span>02</span><div><strong>Review</strong><p>Surface asset, amount, recipient, fee and consequence.</p></div></article><article class="nrs-flow-step"><span>03</span><div><strong>Sign</strong><p>Separate approval from the preceding conversation.</p></div></article><article class="nrs-flow-step"><span>04</span><div><strong>Resolve</strong><p>Explain pending, complete, declined and failed outcomes.</p></div></article></div></div>
  </section>

  <section id="case-role" class="nrs-case-chapter" aria-labelledby="case-role-title">
    <header class="nrs-case-chapter__heading"><p class="nrs-case-chapter__index">02 / Role and scope</p><h2 id="case-role-title" class="nrs-case-chapter__title"><span class="nrs-case-chapter__title-text">Design the complete action, not isolated screens.</span></h2></header>
    <div class="nrs-case-chapter__body"><p>My contribution covered product UX, high-fidelity mobile UI, prototype structure and interaction states, with particular attention to signing, sending and recovery.</p><ul class="nrs-case-list"><li>Mapped chat context through transaction resolution.</li><li>Defined review and confirmation information priority.</li><li>Created reusable wallet-action patterns instead of one-off screens.</li><li>Prepared loading, empty, error, success and responsive decisions for engineering review.</li></ul></div>
  </section>

  <section id="case-decisions" class="nrs-case-chapter" aria-labelledby="case-decisions-title">
    <header class="nrs-case-chapter__heading"><p class="nrs-case-chapter__index">03 / Key decisions</p><h2 id="case-decisions-title" class="nrs-case-chapter__title"><span class="nrs-case-chapter__title-text">Three decisions shaped the experience.</span></h2></header>
    <div class="nrs-case-chapter__body"><p>The interface keeps conversation visually primary, adds a deliberate review boundary before commitment and treats recovery as part of the main flow.</p><div class="nrs-decision-stack">
      <article class="nrs-decision-panel"><div class="nrs-decision-panel__copy"><strong>Messaging remains primary</strong><p>Wallet activity expands only when a person chooses to continue, so the interface does not turn every chat into a financial dashboard.</p></div><div class="nrs-review-card" aria-label="Conversation action example"><div class="nrs-review-card__row"><span>Conversation</span><strong>Send 12 USDC</strong></div><div class="nrs-review-card__row"><span>Context</span><strong>Group expense</strong></div><div class="nrs-review-card__action">Review transaction</div></div></article>
      <article class="nrs-decision-panel"><div class="nrs-decision-panel__copy"><strong>Review before signing</strong><p>Asset, amount, recipient, network fee and consequence appear together before a wallet request is opened.</p></div><div class="nrs-review-card" aria-label="Transaction review example"><div class="nrs-review-card__row"><span>You send</span><strong>12 USDC</strong></div><div class="nrs-review-card__row"><span>Recipient</span><strong>0x42…91A</strong></div><div class="nrs-review-card__row"><span>Network fee</span><strong>0.0004 SOL</strong></div><div class="nrs-review-card__action">Continue to wallet</div></div></article>
      <article class="nrs-decision-panel"><div class="nrs-decision-panel__copy"><strong>Recovery is designed, not appended</strong><p>Pending, declined, failed and completed states explain what happened and which action remains available.</p></div><div class="nrs-state-matrix" aria-label="Transaction state coverage"><div class="nrs-state-cell"><span>Pending</span><strong>Waiting</strong><p>Keep context and allow safe dismissal.</p></div><div class="nrs-state-cell"><span>Declined</span><strong>Not signed</strong><p>Return without implying a failure.</p></div><div class="nrs-state-cell"><span>Failed</span><strong>Try again</strong><p>Explain cause and recovery path.</p></div><div class="nrs-state-cell"><span>Complete</span><strong>Confirmed</strong><p>Show result and transaction reference.</p></div></div></article>
    </div></div>
  </section>

  <section id="case-contribution" class="nrs-case-chapter" aria-labelledby="case-contribution-title">
    <header class="nrs-case-chapter__heading"><p class="nrs-case-chapter__index">04 / Intended design effect</p><h2 id="case-contribution-title" class="nrs-case-chapter__title"><span class="nrs-case-chapter__title-text">Reusable patterns make the product easier to extend.</span></h2></header>
    <div class="nrs-case-chapter__body"><p>The work aimed to reduce ambiguity around wallet-connected actions while keeping messaging coherent across direct chats, groups and bot-assisted flows.</p><div class="nrs-evidence-status" data-evidence-status="intended"><strong>Evidence status:</strong> Intended design effect, not a measured product result.</div></div>
  </section>

  <section id="proof" class="nrs-case-chapter" aria-labelledby="case-proof-title">
    <header class="nrs-case-chapter__heading"><p class="nrs-case-chapter__index">05 / Project evidence</p><h2 id="case-proof-title" class="nrs-case-chapter__title"><span class="nrs-case-chapter__title-text">Inspect the scoped design artifact.</span></h2></header>
    <div class="nrs-case-chapter__body"><p>The static story remains readable independently. The linked Figma resource provides additional public-safe interface evidence without embedding a third-party application in the page.</p><div class="nrs-evidence-status" data-evidence-status="artifact"><strong>Evidence status:</strong> Public or scoped portfolio artifacts are available below.</div><p><a class="nrs-editorial-action nrs-editorial-action--primary" href="https://www.figma.com/design/pYismUGSJo9vLjViMjZENz/Yarsha?node-id=2379-17138&amp;m=dev" target="_blank" rel="noopener noreferrer">Open Yarsha in Figma</a></p></div>
  </section>

  <section id="case-validation" class="nrs-case-chapter" aria-labelledby="case-validation-title">
    <header class="nrs-case-chapter__heading"><p class="nrs-case-chapter__index">06 / Next validation</p><h2 id="case-validation-title" class="nrs-case-chapter__title"><span class="nrs-case-chapter__title-text">Separate delivered work from what should be measured next.</span></h2></header>
    <div class="nrs-case-chapter__body"><p>The portfolio demonstrates designed flows, state coverage and artifacts. Product performance still requires production analytics and research.</p><div class="nrs-evidence-status" data-evidence-status="proposed"><strong>Evidence status:</strong> Proposed validation, not a measured outcome.</div><ul class="nrs-case-list"><li>Review-to-sign completion</li><li>Abandonment before confirmation</li><li>Recovery from declined or failed actions</li><li>Support requests related to wallet context</li></ul></div>
  </section>

  <nav class="nrs-case-pagination" aria-label="Project navigation"><a href="/projects">All selected work</a><a href="/project-mokshya">Next: Mokshya.io</a></nav>
</main>`;

function addBodyClass(html) {
  return html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i, (_match, current = '', rest = '') => {
    const classes = new Set(`${current} nrs-editorial-redesign nrs-case-study-page nrs-yarsha-editorial`.trim().split(/\s+/));
    return `<body class="${[...classes].join(' ')}"${rest}>`;
  });
}

if (!fs.existsSync(target)) throw new Error(`Missing Yarsha case study: ${target}`);
let html = fs.readFileSync(target, 'utf8');
if (!/<main\b[\s\S]*?<\/main>/i.test(html)) throw new Error('Yarsha case study has no main element.');
html = addBodyClass(html.replace(/<main\b[\s\S]*?<\/main>/i, main));
fs.writeFileSync(target, html, 'utf8');
console.log(`Composed revised editorial Yarsha case study in ${path.relative(root, target)}.`);
