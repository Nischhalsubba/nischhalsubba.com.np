/**
 * @fileoverview scripts/spacious-pages/home-work.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for home work.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/ensure-spacious-core-pages.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const base=process.argv.includes('--dist')?path.join(root,'dist'):root;
const proof=`<section id="homepage-proof-discovery" class="nrs-home-proof-v49 reveal-on-scroll" aria-labelledby="site-proof-heading"><div class="nrs-home-proof-v49__intro"><p class="eyebrow">Why teams work with me</p><h2 id="site-proof-heading" class="section-title">Design thinking that stays useful after the Figma file is approved.</h2><p>I connect product structure, visual craft and implementation detail so teams can move from an unclear problem to something people can actually use and engineers can actually build.</p></div><div class="nrs-home-proof-v49__signals" aria-label="Professional proof"><a href="/projects"><span>01</span><strong>Selected product work</strong><p>Case studies across SaaS, Web3, fintech, mobile products and websites.</p></a><a href="/about"><span>02</span><strong>6+ years of experience</strong><p>Product teams, agencies, design systems and front-end-aware collaboration.</p></a><a href="/assets/resume.pdf" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download><span>03</span><strong>Resume and experience</strong><p>Roles, skills, project history and contact details in one practical document.</p></a></div><div class="nrs-home-proof-v49__machine"><span>Structured profile</span><p>Verification files remain available for search tools and agents without taking over the human experience.</p><div><a href="/llms.txt">llms.txt</a><a href="/ai-profile.json">ai-profile.json</a></div></div></section>`;
/**
 * Function contract: updateHome
 * Purpose: Applies update home while preserving the surrounding repository/runtime contract.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function updateHome(file){const target=path.join(base,file);if(!fs.existsSync(target))return;let html=fs.readFileSync(target,'utf8');html=/<section id="homepage-proof-discovery"[\s\S]*?<\/section>/i.test(html)?html.replace(/<section id="homepage-proof-discovery"[\s\S]*?<\/section>/i,proof):html.replace(/<\/main>/i,`${proof}\n</main>`);fs.writeFileSync(target,html);}
/**
 * Function contract: updateProjects
 * Purpose: Applies update projects while preserving the surrounding repository/runtime contract.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function updateProjects(){const target=path.join(base,'projects.html');if(!fs.existsSync(target))throw new Error(`Missing ${target}`);let html=fs.readFileSync(target,'utf8');const controls=`<div class="work-controls nrs-work-toolbar-v49 reveal-on-scroll"><div class="nrs-work-toolbar-v49__top"><div><p class="eyebrow">Browse work</p><h2>Find the work most relevant to you.</h2></div><p id="nrs-work-summary" class="nrs-work-summary">Showing all projects.</p></div><div class="nrs-work-toolbar-v49__controls"><div class="filter-row" role="group" aria-label="Filter projects by domain"><button class="filter-btn active" type="button" data-filter="all">All work</button><button class="filter-btn" type="button" data-filter="web3">Web3</button><button class="filter-btn" type="button" data-filter="fintech">Fintech</button><button class="filter-btn" type="button" data-filter="saas">SaaS</button><button class="filter-btn" type="button" data-filter="mobile">Mobile</button><button class="filter-btn" type="button" data-filter="website">Websites</button><button class="filter-btn" type="button" data-filter="frontend">Front-end</button></div><div class="nrs-work-search-v49"><label for="search-work">Search</label><div><input type="search" id="search-work" class="search-input" placeholder="Project, role or domain" aria-label="Search projects"><button id="clear-work" type="button" aria-label="Clear project search">Clear</button></div></div></div></div>`;const replacement=`${controls}<div id="nrs-no-results" class="nrs-no-results"><h3>No matching projects.</h3><p>Try another domain or a broader search term.</p></div><div class="project-grid">`;html=html.replace(/<div class="work-controls[\s\S]*?<\/div><div class="project-grid">/i,replacement);html=html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i,/** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: _m, current, rest. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ (_m,current='',rest='')=>`<body class="${`${current} nrs-inner-page nrs-work-page`.trim().replace(/\s+/g,' ')}"${rest}>`);fs.writeFileSync(target,html);}
updateHome('index.html');updateHome('home-v2.html');updateProjects();
console.log(`Redesigned homepage proof and project filtering surfaces in ${path.relative(root,base)||'source'}.`);
