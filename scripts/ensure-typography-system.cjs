const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const target=process.argv.includes('--dist')?path.join(root,'dist'):root;
const file=path.join(target,'style.css');
if(!fs.existsSync(file))throw new Error(`Missing ${file}`);
let css=fs.readFileSync(file,'utf8');
css=css
 .replace(/^\s*500;600;700;800&display=swap'\);\s*$/gm,'')
 .replace(/\s*--font-(?:sans|display|body):[^;]+;/g,'')
 .replace(/var\(--font-display\)/g,'var(--font-primary)')
 .replace(/var\(--font-body\)/g,'var(--font-secondary)')
 .replace(/var\(--font-sans\)/g,'var(--font-secondary)')
 .replace(/font-family:\s*["']?(?:Playfair Display|Inter|Aptos Display|Aptos|Segoe UI Variable Display|Segoe UI Variable Text)[^;]*;/gi,'font-family:var(--font-secondary);')
 .replace(/\/\* nrs-two-role-typography-v\d+ \*\/[\s\S]*$/g,'')
 .trimEnd();
const final=`
/* nrs-two-role-typography-v52 */
:root{
 --font-primary:"Aptos Display","Segoe UI Variable Display","Helvetica Neue",Arial,sans-serif;
 --font-secondary:"Inter","Aptos","Segoe UI Variable Text","Segoe UI",Arial,sans-serif;
}
html,body,button,input,textarea,select,option,nav,footer,p,li,dd,dt,label,.eyebrow,.meta-text,.card-meta-line,.nrs-blog-meta,.nrs-blog-utility{font-family:var(--font-secondary)!important}
body :is(h1,h2,h3,h4,h5,h6,.hero-title,.section-title,.footer-cta h2,.w-title,.card-content h3){font-family:var(--font-primary)!important;font-weight:650!important;letter-spacing:-.045em!important}
body :is(h1,.hero-title){font-size:clamp(3rem,5vw,5.5rem)!important;line-height:.98!important;max-width:920px!important}
body :is(h2,.section-title){font-size:clamp(2rem,3.4vw,3.8rem)!important;line-height:1.02!important}
body :is(h3,.card-content h3){font-size:clamp(1.3rem,1.8vw,1.8rem)!important;line-height:1.12!important}
body{font-size:1rem;line-height:1.72}
.body-large,.section-lead,.nrs-blog-dek{font-size:clamp(1.05rem,1.2vw,1.25rem)!important;line-height:1.72!important}
.eyebrow,.meta-text,.card-meta-line,.nrs-blog-meta,.nrs-blog-utility{font-size:max(.8rem,13px)!important;letter-spacing:.06em!important}
@media(max-width:720px){body :is(h1,.hero-title){font-size:clamp(2.55rem,12vw,4.2rem)!important}body :is(h2,.section-title){font-size:clamp(1.9rem,9vw,3rem)!important}}
`;
css+=`\n\n${final.trim()}\n`;
fs.writeFileSync(file,css);
console.log(`Enforced two-role typography in ${path.relative(root,file)}`);
