const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dir=path.join(root,'src','styles');
const legacy=new Set(['inner-page-system.css']);
const files=fs.readdirSync(dir).filter(n=>n.endsWith('.css')&&!legacy.has(n));
const issues=[];
for(const name of files){
 const css=fs.readFileSync(path.join(dir,name),'utf8');
 if(css.includes('!important'))issues.push(`${name}: !important is forbidden in modular CSS`);
 if(/@import\s+(?:url\()?['"]?https?:/i.test(css))issues.push(`${name}: remote CSS imports are forbidden`);
 if(/url\(['"]?data:/i.test(css))issues.push(`${name}: inline data URLs are forbidden`);
 if(/(^|[}\n])\s*(?:html|body|\*)\s*(?:[,>{.:#\[])/m.test(css))issues.push(`${name}: global document selectors are forbidden`);
}
if(!files.length)issues.push('No modular CSS files found');
if(issues.length){console.error('[css-architecture] Failed\n'+issues.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log(`[css-architecture] ${files.length} modular stylesheet(s) passed.`);
