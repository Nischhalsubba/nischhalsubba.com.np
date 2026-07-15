const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const targetRoot = process.argv.includes('--dist') ? path.join(root, 'dist') : root;

const proofSection = `<section id="homepage-proof-discovery" class="nrs-home-proof-v49 reveal-on-scroll" aria-labelledby="site-proof-heading">
  <div class="nrs-home-proof-v49__intro">
    <p class="eyebrow">Why teams work with me</p>
    <h2 id="site-proof-heading" class="section-title">Design thinking that stays useful after the Figma file is approved.</h2>
    <p>I connect product structure, visual craft and implementation detail so teams can move from an unclear problem to something people can actually use and engineers can actually build.</p>
  </div>
  <div class="nrs-home-proof-v49__signals" aria-label="Professional proof">
    <a href="/projects"><span>01</span><strong>Selected product work</strong><p>Case studies across SaaS, Web3, fintech, mobile products and websites.</p></a>
    <a href="/about"><span>02</span><strong>6+ years of experience</strong><p>Product teams, agencies, design systems and front-end-aware collaboration.</p></a>
    <a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span>03</span><strong>Resume and experience</strong><p>Roles, skills, project history and contact details in one practical document.</p></a>
  </div>
  <div class="nrs-home-proof-v49__machine"><span>Structured profile</span><p>Verification files remain available for search tools and agents without taking over the human experience.</p><div><a href="/llms.txt">llms.txt</a><a href="/ai-profile.json">ai-profile.json</a></div></div>
</section>`;

function updateHome(file) {
  const target = path.join(targetRoot, file);
  if (!fs.existsSync(target)) return;
  let html = fs.readFileSync(target, 'utf8');
  const existing = /<section id="homepage-proof-discovery"[\s\S]*?<\/section>/i;
  if (existing.test(html)) html = html.replace(existing, proofSection);
  else html = html.replace(/<\/main>/i, `${proofSection}\n</main>`);
  fs.writeFileSync(target, html, 'utf8');
}

function updateProjects() {
  const target = path.join(targetRoot, 'projects.html');
  if (!fs.existsSync(target)) throw new Error(`Missing target page: ${path.relative(root, target)}`);

  let html = fs.readFileSync(target, 'utf8');
  const controls = `<div class="work-controls nrs-work-toolbar-v49 reveal-on-scroll">
    <div class="nrs-work-toolbar-v49__top"><div><p class="eyebrow">Browse work</p><h2>Find the work most relevant to you.</h2></div><p id="nrs-work-summary" class="nrs-work-summary">Showing all projects.</p></div>
    <div class="nrs-work-toolbar-v49__controls"><div class="filter-row" role="group" aria-label="Filter projects by domain"><button class="filter-btn active" type="button" data-filter="all">All work</button><button class="filter-btn" type="button" data-filter="web3">Web3</button><button class="filter-btn" type="button" data-filter="fintech">Fintech</button><button class="filter-btn" type="button" data-filter="saas">SaaS</button><button class="filter-btn" type="button" data-filter="mobile">Mobile</button><button class="filter-btn" type="button" data-filter="website">Websites</button><button class="filter-btn" type="button" data-filter="frontend">Front-end</button></div><div class="nrs-work-search-v49"><label for="search-work">Search</label><div><input type="search" id="search-work" class="search-input" placeholder="Project, role or domain" aria-label="Search projects" /><button id="clear-work" type="button" aria-label="Clear project search">Clear</button></div></div></div>
  </div>`;

  html = html.replace(
    /<div class="work-controls[\s\S]*?<\/div><div class="project-grid">/i,
    `${controls}<div id="nrs-no-results" class="nrs-no-results"><h3>No matching projects.</h3><p>Try another domain or a broader search term.</p></div><div class="project-grid">`,
  );
  html = html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i, (_match, current = '', rest = '') => {
    const classes = `${current} nrs-inner-page nrs-work-page`.trim().replace(/\s+/g, ' ');
    return `<body class="${classes}"${rest}>`;
  });
  fs.writeFileSync(target, html, 'utf8');
}

updateHome('index.html');
updateHome('home-v2.html');
updateProjects();
console.log(`Redesigned homepage proof and project filtering surfaces in ${path.relative(root, targetRoot) || 'source'}.`);
