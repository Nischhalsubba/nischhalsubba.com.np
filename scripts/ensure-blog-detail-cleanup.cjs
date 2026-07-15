const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),target=process.argv.includes('--dist')?path.join(root,'dist'):root,file=path.join(target,'style.css');
if(!fs.existsSync(file))throw new Error('style.css missing');
const marker='/* nrs-blog-detail-cleanup-v1 */',css=`${marker}\n.nrs-blog-detail-page main.container>article.section-container:first-child,.nrs-blog-detail-page main.container>.nrs-article-frame:first-child,.nrs-blog-detail-page main.container>.nrs-blog-detail-surface:first-child{border-top:0!important}\n`;
let s=fs.readFileSync(file,'utf8').replace(/\/\* nrs-blog-detail-cleanup-v\d+ \*\/[\s\S]*$/g,'').trimEnd();
fs.writeFileSync(file,`${s}\n\n${css}`);
console.log('Removed blog detail top divider.');
