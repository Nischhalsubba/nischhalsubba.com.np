/**
 * @fileoverview scripts/enforce-home-work-contract.cjs
 * Purpose: Apply the enforce home work contract production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const useDist=process.argv.includes('--dist');
const base=useDist?path.join(root,'dist'):root;
const errors=[];
/**
 * Function contract: read
 * Purpose: Return module behavior from the supplied inputs or current enforce home work contract repository tool state.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: reads repository/filesystem state.
 * Returns: The requested module behavior; early-return/empty-state behavior follows the explicit branches in this function.
 */
function read(file){const target=path.join(base,file);if(!fs.existsSync(target)){errors.push(`Missing ${file}`);return '';}return fs.readFileSync(target,'utf8');}
const home=read('index.html');
const work=read('projects.html');
for(const marker of ['homepage-proof-discovery','site-proof-heading','nrs-home-proof-v49__signals'])if(!home.includes(marker))errors.push(`Homepage missing ${marker}`);
for(const marker of ['nrs-work-toolbar-v49','nrs-work-summary','search-work','clear-work','nrs-no-results'])if(!work.includes(marker))errors.push(`Work page missing ${marker}`);
if((work.match(/id="search-work"/g)||[]).length!==1)errors.push('Work page must contain one search input.');
if((work.match(/id="nrs-work-summary"/g)||[]).length!==1)errors.push('Work page must contain one result summary.');
if(errors.length){console.error('Home/work contract failed:\n- '+errors.join('\n- '));process.exit(1);}
console.log(`Home/work contract passed for ${useDist?'production':'source'} output.`);
