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
const publicCaptures = require('./public-site-captures.cjs');
const retainedImages = require('../src/content/portfolio-evidence-images.json');
const { figure: retainedFigure } = require('./figma/curated-evidence.cjs');
const projects = JSON.parse(fs.readFileSync(path.join(content,'portfolio-editorial.json'),'utf8')).projects;
const work = JSON.parse(fs.readFileSync(path.join(__dirname,'../src/workspace-home/index.html'),'utf8').match(/window\.__C=(.*?);<\/script>/)[1]).work;
const articles = fs.readdirSync(content).filter(n=>/^articles-editorial(?:-[a-z]+)?\.json$/.test(n)).flatMap(n=>JSON.parse(fs.readFileSync(path.join(content,n),'utf8')).articles);

/** Function contract: esc
 * Purpose: Encode visible labels. Inputs: text. Side effects: none. Returns: safe HTML text.
 */
function esc(text){return String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');}
/** Function contract: captureForDestination
 * Purpose: Resolve the same reviewed public reference used in an article or case body.
 * Inputs: destination URL. Side effects: none. Returns: preview-approved capture or undefined.
 */
function captureForDestination(href){
 const direct=publicCaptures.forPreview(href);if(direct)return direct;
 const slug=new URL(href,'https://portfolio.invalid').pathname.replace(/\.html$/,'').split('/').pop();
 const article=articles.find(/** Callback contract: Match canonical editorial destination. Inputs: record. Side effects: none. Returns: slug match. */ record=>record.slug===slug);
 const id=article?.leadEvidence || article?.sections.find(/** Callback contract: Find the first explicit public source selection. Inputs: section. Side effects: none. Returns: source ID presence. */ section=>section.publicCapture)?.publicCapture;
 const capture=id?publicCaptures.captures.find(record=>record.id===id):undefined;return capture?.useAsPreview===false?undefined:capture;
}
/** Function contract: preview
 * Purpose: Find a committed preview for a destination. Inputs: route. Side effects: reads generated image manifest. Returns: image URL.
 */
function preview(href){
 const slugForLead=new URL(href,'https://portfolio.invalid').pathname.split('/').pop();
 if(articles.some(a=>a.slug===slugForLead&&a.leadEvidence==='owner-portrait'))return '/workspace-home/assets/portrait.webp';
 const capture=captureForDestination(href);
 if(capture)return capture.variants.at(-1).src;
 const slug=href.replace(/\.html$/,'').split('/').pop();
 if(slug==='project-grid-labs')return '/assets/images/owner/grid-labs-cover.webp';
 const image=retainedEvidence(href);
 if(image)return image.variants.at(-1).src;
 const tile=work.find(p=>p.url.endsWith('/'+slug));
 return tile ? tile.img : null;
}
/** Function contract: retainedEvidence
 * Purpose: Reuse a published approved frame for a route, including multi-screen decision sequences.
 * Inputs: canonical route. Side effects: none. Returns: retained provenance record or undefined.
 */
function retainedEvidence(href){
 const slug=new URL(href,'https://portfolio.invalid').pathname.replace(/\.html$/,'').split('/').pop();
 const project=projects.find(p=>'project-'+p.slug===slug);const article=articles.find(p=>p.slug===slug);
 const decision=project?.decisions.find(d=>d.image||d.images?.length);
 const id=({orkest:'orkest-lead-list',pihub:'pihub-application-status'})[project?.slug]||decision?.image||decision?.images?.[0]||article?.leadEvidence||article?.sections.find(section=>section.image)?.image;
 return retainedImages.find(image=>image.id===id&&image.permission==='OWNER_AUTHORIZED_REVIEW_BRANCH');
}
/** Function contract: cardMedia
 * Purpose: Render a complete approved viewport/frame with responsive sources instead of a generic diagram.
 * Inputs: route. Side effects: none. Returns: decorative preview markup, or empty text when source evidence is unavailable.
 */
function cardMedia(href){
 if(new URL(href,'https://portfolio.invalid').pathname.replace(/\.html$/,'')==='/project-designerex')return '<div class="thumbnail-source-pending" data-source-pending="designerex"><span>FASHION RENTAL MARKETPLACE</span><strong>Designerex</strong><p>Screen evidence pending</p></div>';
 const slug=new URL(href,'https://portfolio.invalid').pathname.split('/').pop();
 if(articles.some(a=>a.slug===slug&&a.leadEvidence==='owner-portrait'))return '<img src="/workspace-home/assets/portrait.webp" width="540" height="720" alt="" loading="lazy" decoding="async" data-owner-portrait-preview>';
 const capture=captureForDestination(href);if(capture)return publicCaptures.picture(capture,true);
 const image=retainedEvidence(href);if(!image)return '';
 return retainedFigure(image.id).match(/<img\b[^>]+>/)[0].replace(/alt="[^"]*"/,'alt=""').replace('<img ',`<img data-retained-evidence-preview="${esc(image.id)}" `);
}
/** Function contract: thumbnailProject
 * Purpose: Share homepage art direction across discovery cards.
 * Inputs: destination URL. Side effects: none. Returns: project palette key.
 */
function thumbnailProject(href){
 const route=new URL(href,'https://portfolio.invalid').pathname.replace(/\.html$/,'');
 if(route.startsWith('/project-'))return route.slice(9);
 const image=retainedEvidence(href);const capture=captureForDestination(href);
 return capture?.route?.replace('/project-','')||projects.find(p=>p.title===image?.project)?.slug||image?.id?.split('-')[0]||'notes';
}
/** Function contract: breadcrumb
 * Purpose: Render a single accessible location trail. Inputs: page title, category flags and filename. Side effects: none. Returns: navigation markup.
 */
function breadcrumb(title,isBlog,isProject,relative){const parent=isBlog?['/blog/','Blog']:isProject?['/projects','Work']:null;return `<nav class="workspace-filebar workspace-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Nischhal</a></li>${parent&&relative!=='blog/index.html'?`<li><a href="${parent[0]}">${parent[1]}</a></li>`:''}<li aria-current="page">${esc(relative==='blog/index.html'?'Blog':title)}</li></ol></nav>`;}
/** Function contract: card
 * Purpose: Create a screenshot-led destination link. Inputs: URL, label and context. Side effects: none. Returns: anchor markup.
 */
function card(href,label,context='Explore'){const source=preview(href);const media=cardMedia(href)||(source?`<img src="${source}" alt="" loading="lazy" decoding="async" width="640" height="400">`:'');return `<a class="workspace-story-card" data-thumbnail="${esc(thumbnailProject(href))}" href="${esc(href.replace(/\.html$/,''))}"><div class="workspace-story-image">${media}<span aria-hidden="true">↗</span></div><div class="workspace-story-copy"><span class="mono">${esc(context)}</span><h3>${esc(label)}</h3></div></a>`;}
/** Function contract: present
 * Purpose: Normalize legacy blog cards and duplicate trails; enhance related destinations. Inputs: main HTML and filename. Side effects: none. Returns: presentation markup.
 */
function present(main,relative){
 if(relative==='project-designerex.html')main=main.replace(/<figure\b[^>]*class="[^"]*agent-case-cover[^"]*"[^>]*>[\s\S]*?<\/figure>/,'<figure class="agent-case-cover thumbnail-evidence-pending"><div><p class="agent-kicker">DESIGNEREX / HISTORICAL CONTRIBUTION</p><h2>Browsing and listing design</h2><p>Authentic screen evidence is still being verified.</p></div><figcaption>Historical design contribution. A verified original screen is not available for publication; no current marketplace interface or checkout outcome is shown.</figcaption></figure>');
 main=main.replace(/(<a\b[^>]*href="([^"]+)"[^>]*>)([\s\S]*?)(<\/a>)/g,/** Callback contract: Replace only archive-card preview images with approved source media. Inputs: full anchor, opening tag, route, body, closing tag. Side effects: none. Returns: unchanged or equivalent source-led card. */ (tag,opening,href,body,closing)=>{if(!/\bnrs-work-card\b/.test(opening))return tag;const media=cardMedia(href);return opening.replace('class=','data-thumbnail="'+esc(thumbnailProject(href))+'" class=')+(media?body.replace(/<img\b[^>]+>/,media):body)+closing;});

 for(const capture of publicCaptures.captures){if(capture.useAsPreview===false||!capture.route.startsWith('/project-'))continue;const slug=capture.route.replace('/project-','');main=main.replaceAll('/workspace-home/assets/projects/'+slug+'.svg',capture.variants.at(-1).src);}
 main=main.replaceAll('/workspace-home/assets/projects/grid-labs.svg','/assets/images/owner/grid-labs-cover.webp');
 if(!publicCaptures.forRoute('/project-grid-labs'))main=main.replace(/(<a[^>]*href="\/project-grid-labs"[^>]*>[\s\S]*?<img[^>]*src=")[^"]+("[^>]*>)/g,'$1/assets/images/owner/grid-labs-cover.webp$2');
 main=main.replace(/<nav\b[^>]*class="[^"]*(?:nrs-case-breadcrumb|nrs-breadcrumbs|nrs-detail-breadcrumb)[^"]*"[^>]*>[\s\S]*?<\/nav>/g,'');
 if(relative==='blog/index.html'){
  const entries=articles.filter(a=>a.slug!=='designing-handoffs-between-people').map(/** Callback contract: Read each canonical article title for the archive. Inputs: article record. Side effects: reads built HTML. Returns: archive link and title. */ a=>{const html=fs.readFileSync(path.join(__dirname,'../dist/blog',a.slug+'.html'),'utf8');return {href:'/blog/'+a.slug,title:html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g,'')||a.slug};});
  entries.unshift({href:'/blog/designing-handoffs-between-people',title:'Designing the Handoffs Between People'});
  main=`<main id="main-content" class="agent-main workspace-blog"><header class="agent-page-hero"><p class="agent-kicker">THE FIELD NOTES / ${entries.length} ARTICLES</p><h1>Behind the interface.</h1><p class="agent-page-intro">Decisions, trade-offs and the details that make a product work. Notes from designing SaaS, fintech, learning tools and everyday journeys.</p></header><section class="workspace-blog-feature" aria-label="Latest article">${card(entries[0].href,entries[0].title,'NEW / 4 NOVEMBER 2026')}<div><p class="agent-kicker">FOLLOW THE RESPONSIBILITY</p><h2>What happens when the next step belongs to someone else?</h2><p>Original Orkest, piHub and Zapp screens trace ownership, waiting and recovery across roles.</p></div></section><section class="agent-section"><p class="agent-kicker">THE ARCHIVE</p><h2>Ideas grounded in the work.</h2><div class="workspace-story-grid">${entries.slice(1).map(e=>card(e.href,e.title,'PRODUCT DESIGN NOTES')).join('')}</div></section></main>`;
 }
 main=main.replace(/(<nav\b[^>]*class="[^"]*nrs-case-next[^\"]*"[^>]*>)([\s\S]*?)(<\/nav>)/g,(tag,open,inside,close)=>open+'<div class="workspace-story-grid">'+[...inside.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(/** Callback contract: Recover the existing next-link title. Inputs: matched anchor. Side effects: none. Returns: story-card markup. */ m=>{const title=m[2].match(/<strong[^>]*>(.*?)<\/strong>/)?.[1]||m[2].replace(/<[^>]+>/g,'');return card(m[1],title,'CONTINUE THE JOURNEY');}).join('')+'</div>'+close);
 main=main.replace(/(<h2>)(Related work and reading|Continue reading)(<\/h2>)\s*<ul>([\s\S]*?)<\/ul>/g,(tag,b,title,e,items)=>b+title+e+'<div class="workspace-story-grid">'+[...items.matchAll(/href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(m=>card(m[1],m[2],'RELATED EXPLORATION')).join('')+'</div>');
 if(relative==='project-grid-labs.html'&&!publicCaptures.forRoute('/project-grid-labs'))main=main.replace('Existing portfolio preview','From hosting offer to live page').replace('Existing portfolio material; original screen evidence incomplete','Owner-supplied website capture and original portfolio artwork').replace('Retained portfolio presentation. A matching original Figma screen has not been verified for this case.','Original artwork and a website capture supplied by Nischhal; placeholder text belongs to the source design.').replace(/(<figure\b[^>]*class="[^"]*agent-case-cover[^"]*"[^>]*>)[\s\S]*?<\/figure>/,`$1<img src="/assets/images/owner/grid-labs-cover.webp" width="1440" height="720" alt="Grid Labs hosting website presentation with purple brand artwork and website screens."><figcaption>Original portfolio artwork supplied by Nischhal.</figcaption></figure><figure class="workspace-owner-screen"><img src="/assets/images/owner/grid-labs-website.webp" width="1440" height="744" loading="lazy" alt="Grid Labs website showing the domain-search hero and hosting service categories."><figcaption>Owner-supplied website capture. Placeholder copy belongs to the original design.</figcaption></figure>`);
 if(relative==='project-grid-labs.html'&&publicCaptures.forRoute('/project-grid-labs'))main=main.replace('</main>','<section class="agent-section"><h2>Earlier portfolio artwork</h2><figure class="workspace-owner-screen"><img src="/assets/images/owner/grid-labs-cover.webp" width="1440" height="720" loading="lazy" alt="Earlier Grid Labs portfolio artwork supplied by Nischhal."><figcaption>Earlier owner-supplied portfolio artwork, preserved separately from the independently captured public implementation.</figcaption></figure><figure class="workspace-owner-screen"><img src="/assets/images/owner/grid-labs-website.webp" width="1440" height="744" loading="lazy" alt="Earlier owner-supplied Grid Labs website capture."><figcaption>Earlier owner-supplied website capture; placeholder copy belongs to the source design.</figcaption></figure></section></main>');
 return main;
}
module.exports={breadcrumb,present};
