const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const files=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name.endsWith('.html'))files.push(p)}}
if(!fs.existsSync(dist)){console.error('[voice-audit] dist missing');process.exit(1)}
walk(dist);
const banned=[/let'?s create something awesome/gi,/transform your vision/gi,/innovative solutions/gi,/world[- ]class digital experiences/gi,/game[- ]changing solutions/gi,/we craft digital experiences/gi];
const issues=[];
for(const file of files){const html=fs.readFileSync(file,'utf8');const rel=path.relative(dist,file).replaceAll(path.sep,'/');for(const rule of banned){rule.lastIndex=0;if(rule.test(html))issues.push(`${rel}: generic phrase ${rule}`)}}
const required={
 'index.html':['Product Designer','product'],
 'services.html':['Design the product clearly','services'],
 'about.html':['Product designer','experience'],
 'contact.html':['project','timeline','privacy']
};
for(const [name,phrases] of Object.entries(required)){const p=path.join(dist,name);if(!fs.existsSync(p)){issues.push(`${name}: missing`);continue}const html=fs.readFileSync(p,'utf8').toLowerCase();for(const phrase of phrases)if(!html.includes(phrase.toLowerCase()))issues.push(`${name}: missing practical voice signal "${phrase}"`)}
if(issues.length){console.error('[voice-audit] Failed\n'+issues.map(x=>`- ${x}`).join('\n'));process.exit(1)}
console.log(`[voice-audit] ${files.length} canonical HTML files passed.`);