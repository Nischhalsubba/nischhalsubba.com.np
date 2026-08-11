/**
 * @fileoverview scripts/audit-shared-shell.cjs
 * Purpose: Validate audit shared shell and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs=require('node:fs');
const path=require('node:path');
const dist=path.resolve(__dirname,'..','dist');
if(!fs.existsSync(dist)){console.error('[shell] dist missing');process.exit(1)}
const files=[];
/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the audit shared shell repository tool.
 * Inputs: `dir`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}
walk(dist);
const issues=[];
for(const file of files){
 const html=fs.readFileSync(file,'utf8');
 const rel=path.relative(dist,file).replaceAll(path.sep,'/');
 const h1=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
 const nav=(html.match(/<nav\b[^>]*class=["'][^"']*nav-wrapper/gi)||[]).length;
 const mobile=(html.match(/<nav\b[^>]*class=["'][^"']*mobile-nav-links/gi)||[]).length;
 const footer=(html.match(/<footer\b[^>]*class=["'][^"']*site-footer/gi)||[]).length;
 if(h1.length!==1)issues.push(`${rel}: ${h1.length} H1 elements`);
 if(nav!==1)issues.push(`${rel}: ${nav} primary navs`);
 if(mobile!==1)issues.push(`${rel}: ${mobile} mobile navs`);
 if(footer!==1)issues.push(`${rel}: ${footer} footers`);
 if(!html.includes('href="/services"'))issues.push(`${rel}: Services missing from navigation`);
 if(!html.includes('© 2026 Nischhal Raj Subba'))issues.push(`${rel}: copyright missing`);
 if(/\(c\)\s*2026/i.test(html))issues.push(`${rel}: stale copyright`);
}
if(issues.length){console.error('[shell] Failed\n'+issues.map(/** Callback contract: Processes the callback step for issues without leaking orchestration details to the caller. Inputs: x. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `x`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `x`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ x=>`- ${x}`).join('\n'));process.exit(1)}
console.log(`[shell] ${files.length} HTML files passed.`);
