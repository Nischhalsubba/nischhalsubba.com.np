/**
 * @fileoverview scripts/enforce-home-work-contract.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for enforce home work contract.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - scripts/build-dist.cjs
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const useDist=process.argv.includes('--dist');
const base=useDist?path.join(root,'dist'):root;
const errors=[];
/**
 * Function contract: read
 * Purpose: Retrieves read and returns it in the form expected by its caller.
 * Inputs: file.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
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
