/**
 * @fileoverview Source-owned case-study and article composition for the workspace portfolio.
 * Purpose: Publish distinct evidence-led narratives in the approved homepage visual system.
 * Responsibilities: Render semantic prose, source figures, retained artifact links and truthful dates.
 * Execution context: Final inner installer, after legacy compatibility stages and before SEO finalization.
 * Connected files: src/content/portfolio-editorial.json, articles-editorial*.json, figma/curated-evidence.cjs.
 * Maintenance: Authored JSON owns final prose; never infer outcomes or publication rights from file access.
 */
const fs = require('node:fs');
const path = require('node:path');
const content = path.resolve(__dirname, '../../src/content');
const projects = JSON.parse(fs.readFileSync(path.join(content, 'portfolio-editorial.json'), 'utf8')).projects;
const articles = fs.readdirSync(content).filter(name => /^articles-editorial(?:-[a-z]+)?\.json$/.test(name)).flatMap(name => JSON.parse(fs.readFileSync(path.join(content, name), 'utf8')).articles);
const { figure } = require('../figma/curated-evidence.cjs');
const publicCaptures = require('../public-site-captures.cjs');
/** Function contract: escape
 * Purpose: Encode authored text. Inputs: value. Side effects: none. Returns: HTML-safe text.
 */
function escape(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
/** Function contract: links
 * Purpose: Render explicit editorial references. Inputs: label/URL pairs. Side effects: none. Returns: list markup.
 */
function links(pairs) {
  return `<ul>${pairs.map(/** Callback contract: Render one validated editorial reference. Inputs: URL and label. Side effects: none. Returns: an escaped list item. */ ([url, label]) => {
    if (!url.startsWith('/') && !url.startsWith('#') && !url.startsWith('https://')) throw new Error('Invalid editorial URL');
    return `<li><a href="${escape(url)}">${escape(label)}</a></li>`;
  }).join('')}</ul>`;
}
/** Function contract: paragraphs
 * Purpose: Render paragraphs without allowing raw authored markup. Inputs: text array. Side effects: none. Returns: prose markup.
 */
function paragraphs(values = []) { return values.map(text => `<p>${escape(text)}</p>`).join(''); }
/** Function contract: codeExcerpt
 * Purpose: Show a short inspectable source excerpt without presenting it as a product screenshot.
 * Inputs: authored excerpt with label, text and source URL. Side effects: none. Returns: escaped semantic code and source link.
 */
function codeExcerpt(value) {
  if (!value) return '';
  return `<figure class="editorial-code"><figcaption>${escape(value.label)}</figcaption><pre tabindex="0" aria-label="${escape(value.label)}"><code>${escape(value.text)}</code></pre><p><a href="${escape(value.source)}" target="_blank" rel="noopener noreferrer">Read the original source</a></p></figure>`;
}
/** Function contract: bullets
 * Purpose: Render parallel checklist items. Inputs: text array. Side effects: none. Returns: semantic list markup.
 */
function bullets(values = []) { return `<ul>${values.map(text => `<li>${escape(text)}</li>`).join('')}</ul>`; }
/** Function contract: table
 * Purpose: Keep structured comparisons accessible and locally scrollable. Inputs: columns and row arrays. Side effects: none. Returns: table markup.
 */
function table(value, heading) {
  return `<div class="editorial-table-scroll" role="region" aria-label="${escape(heading)}" tabindex="0"><table><caption>${escape(heading)}</caption><thead><tr>${value.columns.map(text => `<th scope="col">${escape(text)}</th>`).join('')}</tr></thead><tbody>${value.rows.map(row => `<tr>${row.map((text, index) => index === 0 ? `<th scope="row">${escape(text)}</th>` : `<td>${escape(text)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
/** Function contract: artifactLinks
 * Purpose: Preserve existing inspectable external artifacts across the prose rewrite.
 * Inputs: prior main HTML. Side effects: none. Returns: deduplicated semantic anchors.
 */
function artifactLinks(main) {
  const seen = new Set(); const anchors = [];
  for (const match of main.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const href = match[1].match(/href="([^"]+)"/)?.[1];
    if (!href || !/^https:\/\//.test(href) || seen.has(href)) continue;
    if (/linkedin\.com|github\.com\/Nischhalsubba\/?(?:"|$)|uxcel\.com|behance\.net/.test(href)) continue;
    seen.add(href);
    const label = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    anchors.push(`<li><a href="${href}" target="_blank" rel="noopener noreferrer">${escape(label.replace(/&amp;/g, '&'))}</a></li>`);
  }
  return anchors.length ? `<ul class="editorial-artifacts">${anchors.join('')}</ul>` : '<p>Public material for this case is limited. This account stays focused on my contribution, its design decisions and the questions that deserve further validation.</p>';
}
/** Function contract: renderProject
 * Purpose: Compose a complete project account with decisions and explicit scope.
 * Inputs: structured project and prior main. Side effects: none. Returns: replacement main HTML.
 */
function renderProject(data, oldMain) {
  const updated = data.updatedAt || '2026-11-03';
  const capture = publicCaptures.forRoute('/project-' + data.slug);
  const hasImages = data.decisions.some(decision => decision.image || decision.images?.length);
  const codeProject = ['neverwinter-parser', 'sassboilerplate'].includes(data.slug);
  const breadcrumb = oldMain.match(/<nav\b[^>]*class="[^"]*nrs-case-breadcrumb[^"]*"[^>]*>[\s\S]*?<\/nav>/)?.[0] || '';
  const continuation = oldMain.match(/<nav\b[^>]*class="[^"]*nrs-case-next[^"]*"[^>]*>[\s\S]*?<\/nav>/)?.[0] || '';
  const previousCover = capture || hasImages || codeProject ? '' : (oldMain.match(/<figure\b[^>]*class="[^"]*agent-case-cover[^\"]*"[^>]*>[\s\S]*?<\/figure>/)?.[0] || '');
  const preview = capture ? `<section class="agent-section editorial-section"><h2>Current public demo</h2>${publicCaptures.figure(capture)}</section>` : previousCover ? `<section class="agent-section editorial-section"><h2>Existing portfolio preview</h2>${previousCover}<p class="workspace-evidence-note">Retained portfolio presentation. ${codeProject ? 'Code and documentation are the appropriate source artifacts for this project.' : 'A matching original Figma screen has not been verified for this case.'}</p></section>` : '';
  const journey = data.journey;
  if (!journey || journey.steps.length !== data.decisions.length) throw new Error('Incomplete project journey: ' + data.slug);
  const chapterIndex = `<nav class="editorial-toc editorial-journey" aria-label="Case study chapters"><p class="mono">FOLLOW THE DESIGN PATH</p><ol>${journey.steps.map((step, index) => `<li><a href="#chapter-${index + 1}">${escape(step)}</a></li>`).join('')}</ol></nav>`;
  const opening = `<section class="agent-section editorial-section editorial-question"><p class="mono">THE PRODUCT QUESTION</p><h2>${escape(journey.question)}</h2><p>${escape(journey.opening)}</p></section>${chapterIndex}`;
  const decisions = data.decisions.map((decision, index) => `<section class="agent-section editorial-section editorial-chapter" id="chapter-${index + 1}" tabindex="-1"><span class="mono sec-label">${String(index + 1).padStart(2, '0')} / ${escape(journey.steps[index])}</span><p class="editorial-bridge">${escape(decision.leadIn)}</p><h2>${escape(decision.heading)}</h2>${paragraphs(decision.body)}${decision.images?.length ? `<div class="editorial-screen-sequence${decision.mediaLayout === 'mobile' ? ' is-mobile' : ''}">${decision.images.map(id => `<div class="editorial-screen-step">${figure(id)}</div>`).join('')}</div>` : decision.image ? figure(decision.image) : ''}${codeExcerpt(decision.code)}<aside class="editorial-tradeoff" aria-label="Design trade-off"><p><span>Trade-off</span> ${escape(decision.tradeoff)}</p></aside></section>`).join('');
  return `<main id="main-content" class="agent-main editorial-page" data-editorial-revision="${escape(updated)}"><header class="agent-case-hero">${breadcrumb}<p class="agent-kicker">${escape(data.category)}</p><h1 class="agent-case-title">${escape(data.title)}</h1><p class="agent-case-deck">${escape(data.summary)}</p><dl class="agent-case-facts"><div><dt>Contribution</dt><dd>${escape(data.role)}</dd></div><div><dt>Evidence</dt><dd>${capture ? 'Independently captured current public demo' : hasImages ? 'Complete original Figma screens · sample design content' : codeProject ? 'Public source files and implementation documentation' : 'Existing portfolio material; original screen evidence incomplete'}</dd></div></dl></header>${opening}<section class="agent-section editorial-section" id="context"><h2>Context and my contribution</h2>${paragraphs(data.context)}<h3>Constraints that shaped the work</h3>${bullets(data.constraints)}</section>${decisions}${preview}<section class="agent-section editorial-section" id="evidence"><h2>Artifacts and delivery boundary</h2><p>${escape(data.delivery)}</p>${data.artifacts ? links(data.artifacts) : artifactLinks(oldMain)}${data.publicReference ? links([[data.publicReference.url, data.publicReference.label]]) + `<p>${escape(data.publicReference.note)}</p>` : ''}</section><section class="agent-section editorial-section" id="validation"><h2>Where the work landed</h2><p>${escape(data.outcome)}</p><h3>How I would evaluate the design</h3><p>These are proposed review tasks, not reported research findings.</p>${bullets(data.evaluation || [])}<h3>Looking back</h3><p>${escape(journey.reflection)}</p></section><section class="agent-section editorial-section"><h2>Related work and reading</h2>${links(data.related)}<p><a href="/projects">Explore all project case studies</a></p></section>${continuation}</main>`;
}
/** Function contract: renderArticle
 * Purpose: Compose substantive distinct editorial content with real authorship and retained original publication metadata.
 * Inputs: article, prior main and document head. Side effects: none. Returns: replacement main HTML.
 */
function renderArticle(data, oldMain, head) {
  const updated = data.updatedAt || '2026-11-03';
  const updatedLabel = new Date(updated + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const title = oldMain.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, '').replace(/&amp;/g, '&') || data.slug;
  const published = head.match(/<meta\b[^>]*property="article:published_time"[^>]*content="([^"]+)"/)?.[1];
  const date = published && /^\d{4}-\d{2}-\d{2}/.test(published) ? `<span>Originally published <time datetime="${escape(published)}">${escape(published.slice(0, 10))}</time></span>` : '';
  const sections = data.sections.map((section, index) => `<section class="agent-section editorial-section" id="section-${index + 1}"><h2>${escape(section.heading)}</h2>${paragraphs(section.paragraphs)}${section.bullets ? bullets(section.bullets) : ''}${section.table ? table(section.table, section.heading) : ''}${section.image ? figure(section.image) : ''}${section.links ? links(section.links) : ''}</section>`).join('');
  return `<main id="main-content" class="agent-main editorial-page" data-editorial-revision="${escape(updated)}"><article><header class="agent-page-hero"><p class="agent-kicker">Product design / Practical notes</p><h1>${escape(title)}</h1><p class="agent-page-intro">${escape(data.dek)}</p><div class="editorial-byline"><a href="/about" rel="author">Nischhal Raj Subba</a>${date}<span>Updated <time datetime="${escape(updated)}">${escape(updatedLabel)}</time></span></div></header><nav class="editorial-toc" aria-label="On this page"><p class="mono">ON THIS PAGE</p>${links(data.sections.map((section, index) => ['#section-' + (index + 1), section.heading]))}</nav>${sections}<section class="agent-section editorial-section"><h2>Continue reading</h2>${links(data.related)}</section></article></main>`;
}
/** Function contract: applyEditorial
 * Purpose: Replace only the forty source-owned content routes, preserving the surrounding approved shell.
 * Inputs: main HTML, output-relative path and original document head. Side effects: none. Returns: rewritten or original main.
 */
function applyEditorial(main, relative, head) {
  const project = projects.find(item => relative === `project-${item.slug}.html`);
  if (project) return renderProject(project, main);
  const article = articles.find(item => relative === `blog/${item.slug}.html`);
  return article ? renderArticle(article, main, head) : main;
}
module.exports = { applyEditorial, projects, articles };
