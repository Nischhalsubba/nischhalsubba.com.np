const fs=require('node:fs');
const path=require('node:path');
const dist=path.resolve(__dirname,'..','dist');
if(!fs.existsSync(dist)){console.error('[shell] dist missing');process.exit(1)}
const files=[];
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
if(issues.length){console.error('[shell] Failed\n'+issues.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log(`[shell] ${files.length} HTML files passed.`);
