/**
 * @fileoverview Editorial release contract for retained case studies and writing.
 * Purpose: Detect missing routes, misplaced project screenshots and inconsistent author/date metadata.
 * Responsibilities: Verify forty-one rewritten bodies, meaningful artifact provenance and accessible structured content.
 * Execution context: Node validation after the final workspace installers.
 * Connected files: render.cjs, portfolio-editorial.json, articles-editorial*.json, portfolio-evidence-images.json.
 * Maintenance: This is a content integrity check, not proof of client claims, editorial excellence or WCAG certification.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { projects, articles } = require('./render.cjs');
const publicCaptures = require('../public-site-captures.cjs');
const root = path.resolve(__dirname, '../..');
const images = JSON.parse(fs.readFileSync(path.join(root, 'src/content/portfolio-evidence-images.json'), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'dist/workspace-inner/seo-inventory.json'), 'utf8'));
assert.equal(projects.length, 14);
assert.equal(articles.length, 27);
assert.equal(new Set(articles.map(article => article.intent)).size, articles.length, 'Retained articles need distinct declared intents');
assert.equal(new Set(articles.map(article => article.slug)).size, articles.length);
assert.equal(new Set(articles.map(article => article.leadEvidence)).size, 27, 'Each article needs a distinct authentic lead source');
const used = new Set();
for (const data of [...projects, ...articles]) {
  const isProject = Boolean(data.decisions);
  const file = isProject ? `project-${data.slug}.html` : `blog/${data.slug}.html`;
  const record = inventory.find(item => item.file === file);
  assert.ok(record, 'Retain canonical URL: ' + file);
  const html = fs.readFileSync(path.join(root, 'dist', file), 'utf8');
  const updated = data.updatedAt || '2026-11-03';
  assert.match(updated, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(html.includes(`data-editorial-revision="${updated}"`));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(html, /[\x00-\x08\x0b\x0c\x0e-\x1f]/);
  const sections = isProject ? data.decisions : data.sections;
  if (isProject) {
    assert.equal(data.evaluation?.length, 2, 'Each case needs two specific proposed evaluation tasks');
    assert.doesNotMatch(html, /<h2[^>]*data-workspace-decode/, 'Body headings must be immediately readable');
    assert.ok(data.journey?.question && data.journey?.opening && data.journey?.reflection, 'A case needs a product question, connected account and reflection');
    assert.equal(data.journey.steps.length, sections.length, 'Each journey step must resolve to a chapter');
    assert.match(html, /aria-label="Case study chapters"/);
    for (const [index, section] of sections.entries()) {
      assert.ok(section.leadIn && section.tradeoff, 'Explain the transition and trade-off: ' + data.slug);
      assert.ok(html.includes(`href="#chapter-${index + 1}"`) && html.includes(`id="chapter-${index + 1}"`));
    }
  }
  for (const section of sections) {
    if (section.publicCapture) {
      const capture = publicCaptures.byId(section.publicCapture);
      assert.ok(html.includes(`data-site-capture="${capture.id}"`), 'Selected public reference must appear in its article body');
      assert.ok(html.includes(capture.socialSrc) && html.includes(capture.fullOriginal) && html.includes(capture.sourceUrl), 'Public reference must preserve image, original and source');
    }
    assert.ok(html.includes(section.heading.replace(/&/g, '&amp;')));
    for (const identity of section.images || (section.image ? [section.image] : [])) {
    const image = images.find(item => item.id === identity);
    assert.ok(image, 'Known original for illustration: ' + identity);
    if (isProject) assert.equal(image.project, data.title, 'A case must use its own project screenshot');
    used.add(image.id);
    }
  }
  if (!isProject) {
    const articleBody = html.match(/<article>([\s\S]*?)<\/article>/)?.[1] || html;
    const visualSources = new Set([...articleBody.matchAll(/<figure\b[^>]*data-(?:evidence-image|site-capture)="([^"]+)"/g)].map(match => match[1]));
    if (articleBody.includes('class="workspace-owner-screen"')) visualSources.add('owner-portrait');
    assert.ok(visualSources.size >= 2, 'Support each article with at least two distinct, contextual visual sources: ' + data.slug);
    const lead = images.find(image => image.id === data.leadEvidence) || publicCaptures.captures.find(image => image.id === data.leadEvidence);
    assert.ok(lead || data.leadEvidence === 'owner-portrait', 'Known article lead evidence: ' + data.slug);
    if (lead) {
      assert.notEqual(lead.useAsPreview, false, 'Context-only evidence cannot become a lead');
      assert.ok(html.includes(`data-evidence-image="${lead.id}"`) || html.includes(`data-site-capture="${lead.id}"`), 'Lead source must appear with article context');
    } else assert.match(html, /Owner-approved portrait identifying the author/);
    assert.match(html, /rel="author">Nischhal Raj Subba/);
    assert.ok(html.includes(`<time datetime="${updated}">`));
    assert.ok(html.includes(`property="article:modified_time" content="${updated}"`));
    assert.match(html, /aria-label="On this page"/);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const article = graph['@graph'].find(item => ['BlogPosting','Article'].includes(item['@type']));
    assert.ok(article);
    assert.equal(article.dateModified, updated, 'Visible and structured update dates agree');
  }
  for (const table of html.matchAll(/<table>([\s\S]*?)<\/table>/g)) {
    assert.match(table[1], /<caption>/);
    assert.match(table[1], /<th scope="col">/);
    assert.match(table[1], /<th scope="row">/);
  }
}
assert.deepEqual([...used].sort(), images.map(image => image.id).sort(), 'No orphan curated assets');
console.log(`[editorial] 14 project bodies, 27 distinct article intents, source-matched images, author/date/schema and semantic tables passed.`);
