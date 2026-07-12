const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
if(!fs.existsSync(dist)){console.error('[build-metadata] dist missing');process.exit(1)}
const commit=process.env.CF_PAGES_COMMIT_SHA||process.env.GITHUB_SHA||process.env.VERCEL_GIT_COMMIT_SHA||'local';
const branch=process.env.CF_PAGES_BRANCH||process.env.GITHUB_REF_NAME||process.env.VERCEL_GIT_COMMIT_REF||'local';
const builtAt=new Date().toISOString();
const data={commit,branch,builtAt};
fs.writeFileSync(path.join(dist,'build-info.json'),JSON.stringify(data,null,2)+'\n','utf8');
const marker=`<meta name="nrs-build-commit" content="${commit}"><meta name="nrs-build-time" content="${builtAt}">`;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html')){let h=fs.readFileSync(p,'utf8');h=h.replace(/<meta name="nrs-build-(?:commit|time)"[^>]*>/g,'');h=h.replace(/<\/head>/i,`${marker}</head>`);fs.writeFileSync(p,h,'utf8')}}}
walk(dist);
console.log(`[build-metadata] ${commit} on ${branch}`);