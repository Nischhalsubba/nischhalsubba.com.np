const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targets = ['index.html', 'home-v2.html'];
const SITE = 'https://nischhalsubba.com.np';
const email = 'hinischalsubba@gmail.com';

const hero = `      <section class="hero-section center-aligned-hero nrs-home-hero" style="min-height:auto;padding-top:160px;padding-bottom:80px;">
        <p class="eyebrow reveal-on-scroll" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;margin-bottom:22px;">Product Designer in Nepal / Remote</p>
        <h1 class="hero-title reveal-on-scroll" style="max-width:1040px;margin-left:auto;margin-right:auto;">I design clear product interfaces for Web3, SaaS, fintech, and software teams.</h1>
        <p class="body-large reveal-on-scroll" style="margin:28px auto 0;max-width:840px;">I am Nischhal Raj Subba, a Product Designer in Nepal with 6+ years of experience across mobile apps, SaaS dashboards, Web3 flows, fintech interfaces, service websites, design systems, and developer-ready handoff. I help teams turn unclear product requirements into flows, prototypes, and UI that are easier to review, build, and improve.</p>
        <div class="hero-actions reveal-on-scroll cta-group" style="margin-top:40px;justify-content:center;"><a href="/projects.html" class="btn btn-primary">View product design work</a><a href="/about.html" class="btn btn-secondary">About Nischhal</a><a href="/assets/resume.pdf" class="btn btn-secondary" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download resume</a></div>
        <img src="/assets/images/portrait.png" alt="Nischhal Raj Subba, Product Designer in Nepal" class="hero-portrait-img reveal-on-scroll" style="display:block;width:min(420px,82vw);height:auto;margin:48px auto 0;filter:drop-shadow(0 36px 90px rgba(0,0,0,.35));" width="900" height="900" loading="eager" />
      </section>`;

const proofSection = `
      <section id="homepage-proof-discovery" class="section-container reveal-on-scroll" aria-labelledby="site-proof-heading" style="border-top:1px solid var(--border-faint);">
        <div class="section-header" style="max-width:820px;margin-bottom:34px;">
          <p class="eyebrow" style="color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.14em;">Proof and discovery</p>
          <h2 id="site-proof-heading" class="section-title">Proof-backed product design, developer-ready handoff, and machine-readable profile data.</h2>
          <p class="section-lead">This homepage is structured so hiring teams, search engines, and AI tools can understand who I am, what I design, where to verify my work, and how to contact me without guessing.</p>
        </div>
        <div class="nrs-proof-grid">
          <a class="nrs-proof-card" href="/projects.html"><span class="eyebrow">Portfolio</span><h3>Product design case studies</h3><p>Selected work across Web3 UX, SaaS dashboards, fintech workflows, logistics apps, service websites, WordPress LMS, and front-end tools.</p></a>
          <a class="nrs-proof-card" href="/about.html"><span class="eyebrow">Entity</span><h3>About Nischhal Raj Subba</h3><p>Profile page with role, location, experience, proof links, resume, and AI-readable identity signals.</p></a>
          <a class="nrs-proof-card" href="https://app.uxcel.com/ux/nischhal" target="_blank" rel="noopener"><span class="eyebrow">Proof</span><h3>Uxcel profile</h3><p>Public proof for UX/UI learning progress. No unsupported rankings or fake awards are claimed.</p></a>
          <a class="nrs-proof-card" href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span class="eyebrow">Resume</span><h3>6+ years of experience</h3><p>Experience path across agencies, product teams, Web3, SaaS, websites, dashboards, and front-end-aware design.</p></a>
          <a class="nrs-proof-card" href="/llms.txt"><span class="eyebrow">AI discovery</span><h3>llms.txt</h3><p>Concise AI-readable site summary for agents and LLM crawlers that inspect plain-text discovery files.</p></a>
          <a class="nrs-proof-card" href="/ai-profile.json"><span class="eyebrow">Machine data</span><h3>ai-profile.json</h3><p>Structured profile data with role, focus areas, contact information, and key portfolio routes.</p></a>
        </div>
      </section>`;

function entitySchema(canonical) {
  const url = canonical === 'home-v2.html' ? `${SITE}/home-v2.html` : `${SITE}/`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE}/#nischhal-raj-subba`,
        name: 'Nischhal Raj Subba',
        alternateName: 'Nischhal',
        url: `${SITE}/about.html`,
        image: `${SITE}/assets/images/portrait.png`,
        jobTitle: 'Product Designer',
        email: `mailto:${email}`,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'Nepal',
        },
        knowsAbout: [
          'Product design',
          'UX design',
          'UI design',
          'Web3 UX',
          'SaaS dashboard UX',
          'Fintech workflows',
          'Mobile app design',
          'Website UX',
          'Design systems',
          'Developer-ready handoff',
        ],
        sameAs: [
          'https://www.behance.net/nischhal',
          'https://app.uxcel.com/ux/nischhal',
          'https://linkedin.com/in/nischhal/',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: 'Nischhal Raj Subba Portfolio',
        url: `${SITE}/`,
        description: 'Product design portfolio of Nischhal Raj Subba, a Product Designer in Nepal focused on UX/UI, Web3, SaaS, fintech, service websites, design systems, and developer-ready handoff.',
        publisher: { '@id': `${SITE}/#nischhal-raj-subba` },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#homepage`,
        url,
        name: 'Product Designer in Nepal for Web3, SaaS and Fintech UX',
        description: 'Homepage for Nischhal Raj Subba, a Product Designer in Nepal helping teams design clearer product flows, polished UI, design systems and developer-ready handoff.',
        about: { '@id': `${SITE}/#nischhal-raj-subba` },
        isPartOf: { '@id': `${SITE}/#website` },
        primaryImageOfPage: `${SITE}/assets/images/portrait.png`,
      },
    ],
  };

  return `<script type="application/ld+json" id="nrs-homepage-entity-schema">${JSON.stringify(graph)}</script>`;
}

function replaceHero(html) {
  return html.replace(/      <section class="hero-section center-aligned-hero nrs-home-hero"[\s\S]*?      <\/section>/, hero);
}

function upsertProofSection(html) {
  html = html.replace(/\s*<section id="homepage-proof-discovery"[\s\S]*?<\/section>/, '');
  html = html.replace(/\s*<section class="section-container reveal-on-scroll" aria-labelledby="site-proof-heading"[\s\S]*?<\/section>/, '');

  const anchor = '      <section class="section-container reveal-on-scroll" style="text-align:center;padding-bottom:110px;">';
  if (html.includes(anchor)) {
    return html.replace(anchor, `${proofSection}\n${anchor}`);
  }

  return html.replace('</main>', `${proofSection}\n    </main>`);
}

function upsertEntitySchema(html, target) {
  html = html.replace(/\s*<script\s+type="application\/ld\+json"\s+id="nrs-homepage-entity-schema">[\s\S]*?<\/script>/, '');
  return html.replace('</head>', `    ${entitySchema(target)}\n  </head>`);
}

function cleanOutdatedCopy(html) {
  return html
    .replace(/Senior UI\/Product Designer/g, 'Product Designer')
    .replace(/Senior UI\/Product Designer from Nepal/g, 'Product Designer in Nepal')
    .replace(/building in the fog like Victorian sailors/gi, 'building from unclear requirements')
    .replace(/recognized in Uxcel global rankings/gi, 'showing public UX learning progress on Uxcel');
}

for (const target of targets) {
  const filePath = path.join(root, target);
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');
  html = cleanOutdatedCopy(html);
  html = replaceHero(html);
  html = upsertProofSection(html);
  html = upsertEntitySchema(html, target);
  fs.writeFileSync(filePath, html, 'utf8');
}

console.log('Ensured homepage entity, proof, and AI discovery copy.');
