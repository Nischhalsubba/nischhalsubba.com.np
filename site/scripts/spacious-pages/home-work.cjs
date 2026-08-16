/**
 * @fileoverview scripts/spacious-pages/home-work.cjs
 * Purpose: Apply the home work production transformation or maintenance step while preserving canonical source/build contracts.
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
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const base=process.argv.includes('--dist')?path.join(root,'dist'):root;
const proof=`<section id="homepage-proof-discovery" class="nrs-home-proof-v49 reveal-on-scroll" aria-labelledby="site-proof-heading"><div class="nrs-home-proof-v49__intro"><p class="eyebrow">Why teams work with me</p><h2 id="site-proof-heading" class="section-title">Senior product design for complex workflows, backed by work you can verify.</h2><p>I connect product structure, visual craft and implementation detail across complex SaaS, fintech, design systems and other software products so teams can move from unclear logic to something people can use and engineers can build.</p></div><div class="nrs-home-proof-v49__signals" aria-label="Professional proof"><a href="/projects"><span>01</span><strong>Complex product work</strong><p>Case studies across SaaS, fintech, Web3, multi-role workflows, mobile products and websites.</p></a><a href="/about"><span>02</span><strong>6+ years of experience</strong><p>Product teams, agencies, design systems, complex workflows and front-end-aware collaboration.</p></a><a href="https://uxcel.com/designer-rankings/past-winners" target="_blank" rel="noopener"><span>03</span><strong>Uxcel Hall of Fame</strong><p>Independent public recognition through Uxcel's past UX ranking winners, alongside an active mentor profile.</p></a></div><div class="nrs-home-proof-v49__machine"><span>Structured profile</span><p>Verification files remain available for search tools and agents without taking over the human experience.</p><div><a href="/llms.txt">llms.txt</a><a href="/ai-profile.json">ai-profile.json</a></div></div></section>`;

/**
 * Function contract: updateHome
 * Purpose: Apply home consistently while preserving the surrounding home work repository tool contract.
 * Inputs: `file`
 * Side effects: writes filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateHome(file){const target=path.join(base,file);if(!fs.existsSync(target))return;let html=fs.readFileSync(target,'utf8');html=/<section id="homepage-proof-discovery"[\s\S]*?<\/section>/i.test(html)?html.replace(/<section id="homepage-proof-discovery"[\s\S]*?<\/section>/i,proof):html.replace(/<\/main>/i,`${proof}\n</main>`);fs.writeFileSync(target,html);}


/**
 * Function contract: updateProjects
 * Purpose: Apply projects consistently while preserving the surrounding home work repository tool contract.
 * Inputs: None; derives required state from its enclosing module/runtime context.
 * Side effects: writes filesystem state
 * Returns: Undefined; the function exists for the documented side effects, validation, or orchestration.
 */
function updateProjects(){const target=path.join(base,'projects.html');if(!fs.existsSync(target))throw new Error(`Missing ${target}`);let html=fs.readFileSync(target,'utf8');const controls=`<div class="work-controls nrs-work-toolbar-v49 reveal-on-scroll"><div class="nrs-work-toolbar-v49__top"><div><p class="eyebrow">Browse work</p><h2>Find the work most relevant to you.</h2></div><p id="nrs-work-summary" class="nrs-work-summary">Showing all projects.</p></div><div class="nrs-work-toolbar-v49__controls"><div class="filter-row" role="group" aria-label="Filter projects by domain"><button class="filter-btn active" type="button" data-filter="all">All work</button><button class="filter-btn" type="button" data-filter="web3">Web3</button><button class="filter-btn" type="button" data-filter="fintech">Fintech</button><button class="filter-btn" type="button" data-filter="saas">SaaS</button><button class="filter-btn" type="button" data-filter="mobile">Mobile</button><button class="filter-btn" type="button" data-filter="website">Websites</button><button class="filter-btn" type="button" data-filter="frontend">Front-end</button></div><div class="nrs-work-search-v49"><label for="search-work">Search</label><div><input type="search" id="search-work" class="search-input" placeholder="Project, role or domain" aria-label="Search projects"><button id="clear-work" type="button" aria-label="Clear project search">Clear</button></div></div></div></div>`;const replacement=`${controls}<div id="nrs-no-results" class="nrs-no-results"><h3>No matching projects.</h3><p>Try another domain or a broader search term.</p></div><div class="project-grid">`;html=html.replace(/<div class="work-controls[\s\S]*?<\/div><div class="project-grid">/i,replacement);html=html.replace(/<body(?:\s+class="([^"]*)")?([^>]*)>/i,   /** Callback contract: Perform the local callback step required by the immediately enclosing home work repository tool operation. Inputs: `_m`, `current`, `rest` Side effects: No direct external side effect beyond invoked dependencies. Returns: Computed expression result consumed by the enclosing operation. */ (_m,current='',rest='')=>`<body class="${`${current} nrs-inner-page nrs-work-page`.trim().replace(/\s+/g,' ')}"${rest}>`);fs.writeFileSync(target,html);}
updateHome('index.html');updateHome('home-v2.html');updateProjects();
console.log(`Redesigned homepage proof and project filtering surfaces in ${path.relative(root,base)||'source'}.`);
