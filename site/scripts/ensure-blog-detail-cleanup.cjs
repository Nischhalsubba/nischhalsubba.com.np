/**
 * @fileoverview scripts/ensure-blog-detail-cleanup.cjs
 * Purpose: Apply the ensure blog detail cleanup production transformation or maintenance step while preserving canonical source/build contracts.
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
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),target=process.argv.includes('--dist')?path.join(root,'dist'):root,file=path.join(target,'style.css');
if(!fs.existsSync(file))throw new Error('style.css missing');
const marker='/* nrs-blog-detail-cleanup-v1 */',css=`${marker}\n.nrs-blog-detail-page main.container>article.section-container:first-child,.nrs-blog-detail-page main.container>.nrs-article-frame:first-child,.nrs-blog-detail-page main.container>.nrs-blog-detail-surface:first-child{border-top:0!important}\n`;
let s=fs.readFileSync(file,'utf8').replace(/\/\* nrs-blog-detail-cleanup-v\d+ \*\/[\s\S]*$/g,'').trimEnd();
fs.writeFileSync(file,`${s}\n\n${css}`);
console.log('Removed blog detail top divider.');
