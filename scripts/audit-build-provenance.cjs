const fs=require('node:fs');
const path=require('node:path');
const dist=path.resolve(__dirname,'..','dist');
const infoPath=path.join(dist,'build-info.json');
const issues=[];
if(!fs.existsSync(infoPath)){console.error('[provenance] build-info.json missing');process.exit(1)}
let info;try{info=JSON.parse(fs.readFileSync(infoPath,'utf8'))}catch{console.error('[provenance] invalid build-info.json');process.exit(1)}
if(!info.commit||!info.branch||!info.builtAt)issues.push('build metadata is incomplete');
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html')){const h=fs.readFileSync(p,'utf8');const m=h.match(/<meta name="nrs-build-commit" content="([^"]+)">/);if(!m)issues.push(`${path.relative(dist,p)}: missing commit marker`);else if(m[1]!==info.commit)issues.push(`${path.relative(dist,p)}: commit marker mismatch`)}}}
walk(dist);
if(issues.length){console.error('[provenance] Failed\n'+issues.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log(`[provenance] ${info.commit} on ${info.branch} verified.`);