/**
 * @fileoverview scripts/audit-content-voice.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for audit content voice.
 * Responsibilities:
 * - Own the behavior/content implied by this file's single responsibility.
 * - Keep public routes, build contracts, and imported module boundaries stable unless the connected owners are updated together.
 * Execution context: Node.js CLI during local development, CI, build, or maintenance.
 * Connected files:
 * - docs/repository/file-catalog.md
 * - package.json
 * - scripts/build-dist.cjs
 * Maintenance: Update this header when responsibility or dependencies change; generated/vendor files are documented at their source instead.
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const files=[];
/**
 * Function contract: walk
 * Purpose: Implements the walk responsibility for this module.
 * Inputs: dir.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}
if(!fs.existsSync(dist)){console.error('[voice-audit] dist missing');process.exit(1)}
walk(dist);
const banned=[/let'?s create something awesome/gi,/transform your vision/gi,/innovative solutions/gi,/world[- ]class digital experiences/gi,/game[- ]changing solutions/gi,/we craft digital experiences/gi];
const issues=[];
for(const file of files){const html=fs.readFileSync(file,'utf8');const rel=path.relative(dist,file).replaceAll(path.sep,'/');for(const rule of banned){rule.lastIndex=0;if(rule.test(html))issues.push(`${rel}: generic phrase ${rule}`)}}
const required={
 'index.html':['Product Designer','product'],
 'services.html':['Design support for software with too much complexity behind the screen.','services'],
 'about.html':['Product designer','experience'],
 'contact.html':['project','timeline','privacy']
};
for(const [name,phrases] of Object.entries(required)){const p=path.join(dist,name);if(!fs.existsSync(p)){issues.push(`${name}: missing`);continue}const html=fs.readFileSync(p,'utf8').toLowerCase();for(const phrase of phrases)if(!html.includes(phrase.toLowerCase()))issues.push(`${name}: missing practical voice signal "${phrase}"`)}
if(issues.length){console.error('[voice-audit] Failed\n'+issues.map(/** Callback contract: Processes the callback step for issues without leaking orchestration details to the caller. Inputs: x. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ x=>`- ${x}`).join('\n'));process.exit(1)}
console.log(`[voice-audit] ${files.length} canonical HTML files passed.`);