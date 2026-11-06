/**
 * @fileoverview Final search, entity and social-preview contract for the workspace portfolio.
 * Purpose: Publish readable metadata and real branded PNG previews after visual installers.
 * Responsibilities: Preserve verified copy/dates, connect entities, expose canonical content and prevent orphan pages.
 * Execution context: Node production build, after workspace inner installation.
 * Connected files: package.json, audit-workspace-seo.cjs, workspace-home, workspace-inner.
 * Maintenance: Never manufacture reviews, employment, publication dates, rankings or search performance.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Resvg } = require('@resvg/resvg-js');
const root = path.resolve(__dirname, '..'); const dist = path.join(root, 'dist');
const site = 'https://nischhalsubba.com.np';
const inventory = JSON.parse(fs.readFileSync(path.join(dist, 'workspace-inner/routes.json'), 'utf8'));
const files = ['index.html', ...inventory.map(route => route.file)];
const evidenceImages = JSON.parse(fs.readFileSync(path.join(root, 'src/content/portfolio-evidence-images.json'), 'utf8'));
const publicCaptures = require('./public-site-captures.cjs');
const { articles: editorialArticles } = require('./editorial/render.cjs');
const searchMetadata = JSON.parse(fs.readFileSync(path.join(root, 'src/content/search-metadata.json'), 'utf8'));
const fontDirectory = path.join(root, 'src/workspace-home/vendor/fonts.gstatic.com');
const fontFiles = fs.readdirSync(fontDirectory).filter(file => file.endsWith('.ttf')).map(file => path.join(fontDirectory, file));
const socialDirectory = path.join(dist, 'assets/workspace-social'); fs.mkdirSync(socialDirectory, { recursive: true });
const person = { '@type': 'Person', '@id': site + '/#nischhal-raj-subba', name: 'Nischhal Raj Subba', alternateName: 'Nischhal Subba', jobTitle: 'Senior Product Designer', url: site + '/', image: site + '/workspace-home/assets/portrait.webp', sameAs: ['https://www.linkedin.com/in/nischhal/', 'https://www.behance.net/nischhal', 'https://github.com/Nischhalsubba', 'https://app.uxcel.com/ux/nischhal'] };
// A weekly leaderboard snapshot is not an annual award. Only verified historical recognition belongs here.
const recognition = JSON.parse(fs.readFileSync(path.join(root, 'src/content/uxcel-recognition.json'), 'utf8'));
person.hasCredential = recognition.certifications.map(item => ({ '@type': 'EducationalOccupationalCredential', name: `Uxcel ${item.name}`, credentialCategory: 'Professional certification', url: item.source, recognizedBy: { '@type': 'Organization', name: 'Uxcel', url: 'https://uxcel.com/' } }));
person.award = recognition.historical.map(item => `${item.recognition} — ${item.exactPosition ? '#' + item.exactPosition : item.placementGroup || ''} ${item.category} (${item.year})`);
/** Function contract: escape
 * Purpose: Encode text for XML and HTML attributes. Inputs: text. Side effects: none. Returns: escaped text.
 */
function escape(text) { return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
/** Function contract: plain
 * Purpose: Read human text from existing HTML without adding keyword variants. Inputs: markup. Side effects: none. Returns: normalized text.
 */
function plain(html) { return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim(); }
/** Function contract: metadata
 * Purpose: Read an existing meta property. Inputs: HTML and key. Side effects: none. Returns: content or empty text.
 */
function metadata(html, key) {
  for (const tag of html.matchAll(/<meta\b[^>]+>/g)) {
    if (tag[0].includes(`name="${key}"`) || tag[0].includes(`property="${key}"`)) return plain(tag[0].match(/content="([^"]*)"/)?.[1] || '');
  }
  return '';
}
/** Function contract: setMeta
 * Purpose: Write a single unambiguous metadata property. Inputs: HTML, attribute, key, content. Side effects: none. Returns: updated HTML.
 */
function setMeta(html, attribute, key, content) {
  const tags = /<meta\b[^>]+>/g;
  html = html.replace(tags, tag => tag.includes(`${attribute}="${key}"`) ? '' : tag);
  return html.replace('</head>', `<meta ${attribute}="${key}" content="${escape(content)}">\n</head>`);
}
/** Function contract: wrap
 * Purpose: Lay out readable card text on a fixed 1200x630 canvas. Inputs: text, maximum characters per line and maximum lines. Side effects: none. Returns: line array.
 */
function wrap(text, width, maximum = 4) {
  const words = text.split(/\s+/); const lines = []; let line = '';
  for (const word of words) { if ((line + ' ' + word).trim().length > width && line) { lines.push(line); line = word; } else line = (line + ' ' + word).trim(); }
  if (line) lines.push(line);
  if (lines.length > maximum) { lines.length = maximum; lines[maximum - 1] = lines[maximum - 1].replace(/\s+\S*$/, '') + '…'; }
  return lines;
}
/** Function contract: card
 * Purpose: Render the homepage's exact type and palette into an interoperable PNG social card.
 * Inputs: title, description, category and optional project cover file. Side effects: reads local media. Returns: PNG bytes.
 */
function card(title, description, category, cover) {
  const titleLines = wrap(title.toUpperCase(), cover ? 24 : 34, 4);
  const fontSize = cover ? 43 : 52;
  const titleMarkup = titleLines.map((line, index) => `<text x="72" y="${218 + index * (fontSize + 9)}" fill="#f4f4f2" font-family="Doto" font-weight="900" font-size="${fontSize}">${escape(line)}</text>`).join('');
  const descriptionMarkup = wrap(description, cover ? 48 : 78, 2).map((line, index) => `<text x="72" y="${458 + index * 29}" fill="#b9b9c0" font-family="Geist" font-size="20">${escape(line)}</text>`).join('');
  let media = '<path d="M920 135V430M770 285H1070" stroke="#0d99ff" stroke-opacity=".4"/><circle cx="920" cy="285" r="108" fill="none" stroke="#a259ff" stroke-opacity=".5"/><circle cx="920" cy="285" r="68" fill="none" stroke="#0d99ff"/><rect x="907" y="272" width="26" height="26" fill="#0d99ff"/>';
  if (cover?.endsWith('.webp') && fs.existsSync(cover.replace(/\.webp$/, '.png'))) cover = cover.replace(/\.webp$/, '.png');
  if (cover && fs.existsSync(cover)) {
    try {
      const png = cover.endsWith('.png') ? fs.readFileSync(cover) : new Resvg(fs.readFileSync(cover, 'utf8'), { fitTo: { mode: 'width', value: 680 }, font: { fontFiles, loadSystemFonts: false } }).render().asPng();
      media = `<rect x="730" y="143" width="398" height="304" fill="#0b1020" stroke="#a259ff"/><image href="data:image/png;base64,${png.toString('base64')}" x="732" y="145" width="394" height="300" preserveAspectRatio="xMidYMid meet"/><g fill="#f4f4f2" stroke="#a259ff"><rect x="725" y="138" width="10" height="10"/><rect x="1123" y="138" width="10" height="10"/><rect x="725" y="442" width="10" height="10"/><rect x="1123" y="442" width="10" height="10"/></g>`;
    } catch (error) { throw new Error(`Cannot render project media ${cover}: ${error.message}`); }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="1" height="1" fill="#242734"/></pattern><linearGradient id="line"><stop stop-color="#0d99ff"/><stop offset=".5" stop-color="#a259ff"/><stop offset="1" stop-color="#ff6e28"/></linearGradient></defs><rect width="1200" height="630" fill="#07070a"/><rect width="1200" height="630" fill="url(#grid)"/><rect x="28" y="28" width="1144" height="574" fill="none" stroke="#23334c"/><path d="M28 44V28H44M1156 28H1172V44M1172 586V602H1156M44 602H28V586" stroke="#0d99ff" stroke-width="2" fill="none"/><circle cx="94" cy="92" r="24" fill="#0b1020" stroke="#0d99ff"/><text x="82" y="102" font-family="Geist" font-size="28" fill="#f4f4f2">N</text><text x="135" y="98" font-family="Geist Mono" font-size="13" fill="#a7a7b0">NISCHHAL / ${escape(category.toUpperCase())}</text><path d="M72 135H1128" stroke="#23334c"/>${cover ? media : ''}${titleMarkup}${descriptionMarkup}<path d="M72 542H1128" stroke="url(#line)"/><text x="72" y="578" font-family="Geist Mono" font-size="13" fill="#7cc6ff">NISCHHALSUBBA.COM.NP</text><text x="1128" y="578" text-anchor="end" font-family="Geist Mono" font-size="12" fill="#a7a7b0">PRODUCT DESIGN · NEPAL</text></svg>`;
  return new Resvg(svg, { font: { fontFiles, loadSystemFonts: false } }).render().asPng();
}
fs.writeFileSync(path.join(dist, 'workspace-inner/discovery.css'), '.workspace-site-links{display:flex;justify-content:center;gap:24px;flex-wrap:wrap;padding:24px 20px 38px;border-top:1px solid rgba(255,255,255,.08);position:relative;z-index:1;color:#a7a7b0;font:11px Geist Mono,monospace;text-transform:uppercase;letter-spacing:.08em}.workspace-site-links a:hover{color:#7cc6ff}');
const records = [];
for (const file of files) {
  const absolute = path.join(dist, file); let html = fs.readFileSync(absolute, 'utf8');
  const url = html.match(/rel="canonical" href="([^"]+)"/)?.[1]; if (!url || !url.startsWith(site)) throw new Error(`Canonical missing: ${file}`);
  const title = plain(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || 'Nischhal Raj Subba');
  const heading = plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || 'Nischhal Raj Subba');
  const description = searchMetadata[file]?.description || metadata(html, 'description');
  if (searchMetadata[file]?.description) html = setMeta(html, 'name', 'description', description);
  const isArticle = file.startsWith('blog/') && file !== 'blog/index.html'; const isProject = file.startsWith('project-');
  const category = isProject ? 'Case study' : isArticle ? 'Design writing' : file === 'index.html' ? 'Senior Product Designer' : 'Portfolio';
  const slug = file.replace(/\.html$/, '').replaceAll('/', '--');

  const contentImages = [...html.matchAll(/data-evidence-image="([^"]+)"/g)].map(match => evidenceImages.find(image => image.id === match[1])).filter(Boolean);
  for (const match of html.matchAll(/data-site-capture="([^"]+)"/g)) {
    const capture = publicCaptures.captures.find(/** Callback contract: Resolve the independently captured figure. Inputs: record. Side effects: none. Returns: ID equality. */ item => item.id === match[1]);
    if (capture) contentImages.push(capture);
  }
  const editorialRevision = html.match(/data-editorial-revision="(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (isArticle && editorialRevision) html = setMeta(html, 'property', 'article:modified_time', editorialRevision);
  const leadId = isArticle ? editorialArticles.find(article => file === 'blog/' + article.slug + '.html')?.leadEvidence : null;
  const lead = leadId ? [...evidenceImages, ...publicCaptures.captures].find(image => image.id === leadId) : null;
  const leadSrc = leadId === 'owner-portrait' ? '/workspace-home/assets/portrait-source.png' : lead?.socialSrc;
  const coverSrc = leadSrc || contentImages.find(/** Callback contract: Keep context-only issuer references out of primary social covers. Inputs: image record. Side effects: none. Returns: preview eligibility. */ image => image.useAsPreview !== false)?.socialSrc || (isProject ? html.match(/class="agent-case-cover"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/)?.[1] : null);
  const cardBytes = card(file === 'index.html' ? 'Nischhal Raj Subba' : heading, description, category, coverSrc ? path.join(dist, coverSrc) : null);
  const cardName = `${slug}-${crypto.createHash('sha256').update(cardBytes).digest('hex').slice(0,12)}.png`;
  const imageUrl = `${site}/assets/workspace-social/${cardName}`;
  fs.writeFileSync(path.join(socialDirectory, cardName), cardBytes);
  for (const [key, value] of Object.entries({ 'og:title': title, 'og:description': description, 'og:url': url, 'og:type': isArticle ? 'article' : 'website', 'og:site_name': 'Nischhal Raj Subba', 'og:locale': 'en_US', 'og:image': imageUrl, 'og:image:secure_url': imageUrl, 'og:image:type': 'image/png', 'og:image:width': '1200', 'og:image:height': '630', 'og:image:alt': `${heading} — Nischhal Raj Subba` })) html = setMeta(html, 'property', key, value);
  for (const [key, value] of Object.entries({ 'twitter:card': 'summary_large_image', 'twitter:title': title, 'twitter:description': description, 'twitter:image': imageUrl, 'twitter:image:alt': `${heading} — Nischhal Raj Subba`, 'robots': 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1', 'author': 'Nischhal Raj Subba' })) html = setMeta(html, 'name', key, value);
  const graph = [];
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) { const data = JSON.parse(match[1]); graph.push(...(data['@graph'] || [data])); }
  const merged = graph.filter(node => !['Person', 'WebSite'].includes(node['@type']) && !(html.includes('data-editorial-revision=') && node['@type'] === 'FAQPage'));
  const website = { '@type': 'WebSite', '@id': site + '/#website', name: 'Nischhal Raj Subba', alternateName: 'Nischhal', url: site + '/', inLanguage: 'en', publisher: { '@id': person['@id'] } };
  let webpage = merged.find(node => ['WebPage','ProfilePage','CollectionPage','ContactPage','AboutPage'].includes(node['@type']));
  if (!webpage) { webpage = { '@type': file === 'index.html' ? 'ProfilePage' : 'WebPage', '@id': url + '#webpage', url }; merged.push(webpage); }
  Object.assign(webpage, { name: title, description, inLanguage: 'en', isPartOf: { '@id': website['@id'] }, author: { '@id': person['@id'] }, primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl, width:1200, height:630 } });
  for (const node of merged) {
    if (['BlogPosting','Article','CreativeWork'].includes(node['@type'])) {
      node.image = { '@type':'ImageObject', url:imageUrl, width:1200, height:630 }; node.inLanguage = 'en'; node.author = { '@id':person['@id'] };
      if (html.includes('data-editorial-revision=')) { node.description = description; delete node.articleBody; if (node['@type'] === 'CreativeWork') { node.name = heading + ' — design case study'; node.genre = 'Product design case study'; } else node.headline = heading; }
    }
    if (node['@type'] === 'BlogPosting') { const published = metadata(html, 'article:published_time'); const modified = metadata(html, 'article:modified_time'); if (published) node.datePublished = published; if (modified) node.dateModified = modified; }
  }
  if (isArticle && !merged.some(node => ['BlogPosting','Article'].includes(node['@type']))) merged.push({ '@type':'BlogPosting', '@id':url+'#article', headline:heading, description, url, image:imageUrl, author:{'@id':person['@id']}, mainEntityOfPage:{'@id':webpage['@id']}, inLanguage:'en' });
  if (file === 'index.html') webpage.mainEntity = { '@id':person['@id'] };
  html = html.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '');
  html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':[website,person,...merged]}).replace(/</g,'\\u003c')}</script>\n</head>`);
  records.push({ file, url, title, heading, description, image:imageUrl, category, isArticle, contentImages:contentImages.map(image => site + image.variants.at(-1).src) }); fs.writeFileSync(absolute, html);
}
// Make every retained article findable through real HTML rather than hidden browser-only data.
const articles = records.filter(record => record.isArticle);
const writingFile = path.join(dist, 'blog/index.html'); let writing = fs.readFileSync(writingFile, 'utf8');
const articleIndex = `<section class="agent-section workspace-all-writing"><span class="mono sec-label">WRITING / COMPLETE INDEX</span><h2 data-workspace-decode>All ${articles.length} design notes.</h2><div class="workspace-writing-index">${articles.map(record => `<a href="${new URL(record.url).pathname}"><span>${escape(record.heading)}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
writing = writing.replace('</main>', articleIndex + '</main>'); fs.writeFileSync(writingFile, writing);
for (const file of files) {
  const absolute = path.join(dist, file); let html = fs.readFileSync(absolute, 'utf8');
  const links = `<nav class="workspace-site-links mono" aria-label="Explore portfolio"><a href="/projects">Work</a><a href="/blog/">Writing</a><a href="/about">About</a><a href="/services">Services</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a></nav>`;
  html = html.replace('</body>', links + '</body>');
  if (file === 'index.html') html = html.replace('</head>', `<style data-workspace-inline="/workspace-inner/discovery.css">${fs.readFileSync(path.join(dist, 'workspace-inner/discovery.css'), 'utf8')}</style></head>`); fs.writeFileSync(absolute, html);
}
for (const route of inventory) { const html = fs.readFileSync(path.join(dist, route.file), 'utf8'); route.contentHash = crypto.createHash('sha256').update(html.match(/<main\b[\s\S]*?<\/main>/)[0]).digest('hex'); }
fs.writeFileSync(path.join(dist, 'workspace-inner/routes.json'), JSON.stringify(inventory,null,2)+'\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${records.map(record => `<url><loc>${escape(record.url)}</loc>${[record.image,...record.contentImages].map(image => `<image:image><image:loc>${escape(image)}</image:loc></image:image>`).join('')}</url>`).join('')}</urlset>\n`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
const markdown = ['# Nischhal Raj Subba', '> Senior Product Designer. 7+ years across enterprise SaaS, mobile, fintech and Web3.', '', 'This is a public portfolio, not a product documentation or support service. Case studies describe contribution boundaries and publicly available evidence.', '', '## Portfolio', ...records.filter(record=>!record.isArticle).map(record=>`- [${record.heading}](${record.url}): ${record.description}`), '', '## Writing', ...articles.map(record=>`- [${record.heading}](${record.url}): ${record.description}`), '', '## Contact', '- Email: hinischalsubba@gmail.com', '- Location: Nepal', '- Availability and complete current résumé: '+site+'/about', ''].join('\n');
fs.writeFileSync(path.join(dist, 'llms.txt'), markdown);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nUser-agent: OAI-SearchBot\nAllow: /\nDisallow: /api/\n\nSitemap: ${site}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist, 'workspace-inner/seo-inventory.json'), JSON.stringify(records,null,2)+'\n');
console.log(`[workspace-seo] ${records.length} real PNG previews, entity graphs, image sitemap and crawlable article links generated.`);
require('./workspace-icons.cjs').publishIcons(root, dist, files);
