/**
 * @fileoverview scripts/normalize-detail-wayfinding.cjs
 * Purpose: Node-based build, content transformation, QA, or maintenance tool for normalize detail wayfinding.
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
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),base=process.argv.includes('--dist')?path.join(root,'dist'):root;
const services=new Set(['product-design-nepal.html','web3-ux-designer.html','saas-ux-designer.html','website-ux-design.html','figma-design-systems.html','ux-audit.html']);
/**
 * Function contract: files
 * Purpose: Implements the files responsibility for this module.
 * Inputs: d, out.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function files(d,out=[]){if(!fs.existsSync(d))return out;for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==='node_modules'||e.name==='.git')continue;const f=path.join(d,e.name);e.isDirectory()?files(f,out):e.name.endsWith('.html')&&out.push(f)}return out}
/**
 * Function contract: parent
 * Purpose: Implements the parent responsibility for this module.
 * Inputs: rel.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function parent(rel){const n=path.basename(rel);if(/^project-.*\.html$/.test(n))return['/projects','Work'];if(rel.startsWith('blog/')&&n!=='index.html')return['/blog/','Writing'];if(services.has(n))return['/services','Services'];return null}
/**
 * Function contract: clean
 * Purpose: Removes or cleans clean while keeping required outputs intact.
 * Inputs: h.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
function clean(h){return h.replace(/\s*<nav\b[^>]*(?:aria-label=["']Breadcrumb["']|class=["'][^"']*(?:nrs-detail-breadcrumb|nrs-wayfinding|nrs-blog-utility|nrs-blog-breadcrumbs)[^"']*["'])[^>]*>[\s\S]*?<\/nav>\s*/gi,'\n').replace(/\s*<a\b[^>]*class=["'][^"']*(?:nrs-back-link|nrs-blog-back-btn)[^"']*["'][\s\S]*?<\/a>\s*/gi,'\n').replace(/\s*<a\b[^>]*href=["'](?:\/projects|\/services|\/blog\/)["'][^>]*>\s*(?:&larr;|←)?\s*Back to[^<]*<\/a>\s*/gi,'\n')}
let count=0;for(const f of files(base)){const rel=path.relative(base,f).replaceAll(path.sep,'/'),p=parent(rel);if(!p)continue;const before=fs.readFileSync(f,'utf8'),h=clean(before),title=(h.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||'Detail').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(),nav=`<nav class="nrs-detail-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="${p[0]}">${p[1]}</a></li><li><span aria-current="page">${title}</span></li></ol></nav>`,anchor=/(<(?:section|article)\b[^>]*class=["'][^"']*(?:hero|article|section-container)[^"']*["'][^>]*>)/i,out=anchor.test(h)?h.replace(anchor,`$1\n${nav}`):h.replace(/(<main\b[^>]*>)/i,`$1\n${nav}`);if(out!==before){fs.writeFileSync(f,out);count++}}
console.log(`Normalized ${count} detail page(s) to one breadcrumb.`);
