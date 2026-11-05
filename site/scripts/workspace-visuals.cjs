/**
 * @fileoverview Shared visual discovery for workspace content.
 * Purpose: Keep blog discovery, breadcrumbs and related work in the homepage design language.
 * Responsibilities: Render accessible trails and image-led navigation using committed source images.
 * Execution context: Final inner-page build.
 * Connected files: install-workspace-inner.cjs, content JSON, parity.css.
 * Maintenance: Never turn generated artwork into claimed project evidence.
 */
const fs = require('node:fs');
const path = require('node:path');
const content = path.join(__dirname,'../src/content');
const projects = JSON.parse(fs.readFileSync(path.join(content,'portfolio-editorial.json'),'utf8')).projects;
const work = JSON.parse(fs.readFileSync(path.join(__dirname,'../src/workspace-home/index.html'),'utf8').match(/window\.__C=(.*?);<\/script>/)[1]).work;
const articles = fs.readdirSync(content).filter(n=>/^articles-editorial(?:-[a-z]+)?\.json$/.test(n)).flatMap(n=>JSON.parse(fs.readFileSync(path.join(content,n),'utf8')).articles);

/** Function contract: esc
 * Purpose: Encode visible labels. Inputs: text. Side effects: none. Returns: safe HTML text.
 */
function esc(text){return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');}
/** Function contract: preview
 * Purpose: Find a committed preview for a destination. Inputs: route. Side effects: reads generated image manifest. Returns: image URL.
 */
function preview(href){
 const slug=href.replace(/\.html$/,'').split('/').pop();
 if(slug==='project-grid-labs')return '/assets/images/owner/grid-labs-cover.webp';
 const tile=work.find(p=>p.url.endsWith('/'+slug));
 const project=projects.find(p=>'project-'+p.slug===slug);const article=articles.find(p=>p.slug===slug);
 const id=project?.decisions.find(d=>d.image)?.image || article?.sections.find(s=>s.image)?.image;
 const files=fs.readdirSync(path.join(__dirname,'../dist/assets/images/evidence'));
 const match=id&&files.find(f=>f.startsWith(id+'-')&&f.endsWith('.webp'));
 if(match)return '/assets/images/evidence/'+match;
 if(tile)return tile.img;
 return '/assets/images/owner/field-notes.svg';
}
/** Function contract: breadcrumb
 * Purpose: Render a single accessible location trail. Inputs: page title, category flags and filename. Side effects: none. Returns: navigation markup.
 */
function breadcrumb(title,isBlog,isProject,relative){const parent=isBlog?['/blog/','Blog']:isProject?['/projects','Work']:null;return `<nav class="workspace-filebar workspace-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Nischhal</a></li>${parent&&relative!=='blog/index.html'?`<li><a href="${parent[0]}">${parent[1]}</a></li>`:''}<li aria-current="page">${esc(relative==='blog/index.html'?'Blog':title)}</li></ol></nav>`;}
/** Function contract: card
 * Purpose: Create a screenshot-led destination link. Inputs: URL, label and context. Side effects: none. Returns: anchor markup.
 */
function card(href,label,context='Explore'){return `<a class="workspace-story-card" href="${esc(href.replace(/\.html$/,''))}"><div class="workspace-story-image"><img src="${preview(href)}" alt="" loading="lazy" decoding="async" width="640" height="400"><span aria-hidden="true">↗</span></div><div class="workspace-story-copy"><span class="mono">${esc(context)}</span><h3>${esc(label)}</h3></div></a>`;}
/** Function contract: present
 * Purpose: Normalize legacy blog cards and duplicate trails; enhance related destinations. Inputs: main HTML and filename. Side effects: none. Returns: presentation markup.
 */
function present(main,relative){
 main=main.replaceAll('/workspace-home/assets/projects/grid-labs.svg','/assets/images/owner/grid-labs-cover.webp');
 main=main.replace(/(<a[^>]*href="\/project-grid-labs"[^>]*>[\s\S]*?<img[^>]*src=")[^"]+("[^>]*>)/g,'$1/assets/images/owner/grid-labs-cover.webp$2');
 main=main.replace(/<nav\b[^>]*class="[^"]*(?:nrs-case-breadcrumb|nrs-breadcrumbs|nrs-detail-breadcrumb)[^"]*"[^>]*>[\s\S]*?<\/nav>/g,'');
 if(relative==='blog/index.html'){
  const entries=articles.filter(a=>a.slug!=='designing-handoffs-between-people').map(/** Callback contract: Read each canonical article title for the archive. Inputs: article record. Side effects: reads built HTML. Returns: archive link and title. */ a=>{const html=fs.readFileSync(path.join(__dirname,'../dist/blog',a.slug+'.html'),'utf8');return {href:'/blog/'+a.slug,title:html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g,'')||a.slug};});
  entries.unshift({href:'/blog/designing-handoffs-between-people',title:'Designing the Handoffs Between People'});
  main=`<main id="main-content" class="agent-main workspace-blog"><header class="agent-page-hero"><p class="agent-kicker">THE FIELD NOTES / ${entries.length} ARTICLES</p><h1>Behind the interface.</h1><p class="agent-page-intro">Decisions, trade-offs and the details that make a product work. Notes from designing SaaS, fintech, learning tools and everyday journeys.</p></header><section class="workspace-blog-feature" aria-label="Latest article">${card(entries[0].href,entries[0].title,'NEW / 4 NOVEMBER 2026')}<div><p class="agent-kicker">FOLLOW THE RESPONSIBILITY</p><h2>What happens when the next step belongs to someone else?</h2><p>Original Orkest, piHub and Zapp screens trace ownership, waiting and recovery across roles.</p></div></section><section class="agent-section"><p class="agent-kicker">THE ARCHIVE</p><h2>Ideas grounded in the work.</h2><div class="workspace-story-grid">${entries.slice(1).map(e=>card(e.href,e.title,'PRODUCT DESIGN NOTES')).join('')}</div></section></main>`;
 }
 main=main.replace(/(<nav\b[^>]*class="[^"]*nrs-case-next[^\"]*"[^>]*>)([\s\S]*?)(<\/nav>)/g,(tag,open,inside,close)=>open+'<div class="workspace-story-grid">'+[...inside.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(/** Callback contract: Recover the existing next-link title. Inputs: matched anchor. Side effects: none. Returns: story-card markup. */ m=>{const title=m[2].match(/<strong[^>]*>(.*?)<\/strong>/)?.[1]||m[2].replace(/<[^>]+>/g,'');return card(m[1],title,'CONTINUE THE JOURNEY');}).join('')+'</div>'+close);
 main=main.replace(/(<h2>)(Related work and reading|Continue reading)(<\/h2>)\s*<ul>([\s\S]*?)<\/ul>/g,(tag,b,title,e,items)=>b+title+e+'<div class="workspace-story-grid">'+[...items.matchAll(/href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(m=>card(m[1],m[2],'RELATED EXPLORATION')).join('')+'</div>');
 if(relative==='project-grid-labs.html')main=main.replace('Existing portfolio preview','From hosting offer to live page').replace('Existing portfolio material; original screen evidence incomplete','Owner-supplied website capture and original portfolio artwork').replace('Retained portfolio presentation. A matching original Figma screen has not been verified for this case.','Original artwork and a website capture supplied by Nischhal; placeholder text belongs to the source design.').replace(/(<figure\b[^>]*class="[^"]*agent-case-cover[^"]*"[^>]*>)[\s\S]*?<\/figure>/,`$1<img src="/assets/images/owner/grid-labs-cover.webp" width="1440" height="720" alt="Grid Labs hosting website presentation with purple brand artwork and website screens."><figcaption>Original portfolio artwork supplied by Nischhal.</figcaption></figure><figure class="workspace-owner-screen"><img src="/assets/images/owner/grid-labs-website.webp" width="1440" height="744" loading="lazy" alt="Grid Labs website showing the domain-search hero and hosting service categories."><figcaption>Owner-supplied website capture. Placeholder copy belongs to the original design.</figcaption></figure>`);
 return main;
}
module.exports={breadcrumb,present};
