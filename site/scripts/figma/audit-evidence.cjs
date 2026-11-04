/**
 * @fileoverview Curated screenshot publication contract.
 * Purpose: Prevent private originals, missing files and temporary Figma assets reaching production.
 * Responsibilities: Check source provenance, responsive dimensions, local image bytes and canonical discovery parity.
 * Execution context: Final build validation after workspace SEO finalization.
 * Connected files: curated-evidence.cjs, portfolio-evidence-images.json, canonical-routes.json.
 * Maintenance: These checks establish build correctness, never client publication rights or WCAG certification.
 */
const fs = require('node:fs'); const path = require('node:path'); const assert = require('node:assert/strict'); const crypto = require('node:crypto');
const root = path.resolve(__dirname,'../..'); const dist = path.join(root,'dist');
const images = JSON.parse(fs.readFileSync(path.join(root,'src/content/portfolio-evidence-images.json')));
const records = JSON.parse(fs.readFileSync(path.join(dist,'workspace-inner/seo-inventory.json')));
const manifest = JSON.parse(fs.readFileSync(path.join(root,'config/canonical-routes.json')));
assert.deepEqual(records.map(record=>record.file).sort(),[...manifest.html].sort(),'One canonical inventory must cover every final page');
assert.ok(!fs.existsSync(path.join(dist,'artifacts')),'Private originals must never be deployed');
const routes = new Map(records.map(record=>[new URL(record.url).pathname,record]));
let references=0;
const recipes = JSON.parse(fs.readFileSync(path.join(root,'src/content/public-image-recipes.json')));
for (const recipe of recipes) { assert.equal((recipe.redactions || []).length, 0, 'Do not mask owner-confirmed dummy data: ' + recipe.id); assert.equal(recipe.crop, null, 'Publish the complete original frame: ' + recipe.id); }
const approvedFiles = new Set(images.flatMap(image => [...image.variants.map(v => path.basename(v.src)), path.basename(image.socialSrc)]));
for (const file of fs.readdirSync(path.join(root,'assets/images/evidence'))) assert.ok(approvedFiles.has(file), 'Retired image bytes must not remain public: ' + file);
for(const image of images) {
  assert.equal(image.permission,'OWNER_AUTHORIZED_REVIEW_BRANCH'); assert.match(image.source_sha256,/^[a-f0-9]{64}$/); assert.ok(image.alt.length>30);
  for(const variant of image.variants) {
    const bytes=fs.readFileSync(path.join(dist,variant.src));
    assert.equal(bytes.subarray(0,4).toString(),'RIFF'); assert.equal(bytes.subarray(8,12).toString(),'WEBP');
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),variant.sha256);
    assert.ok(variant.width>0 && variant.height>0 && variant.width<=1240);
    const byteBudget = image.variants.at(-1).height > 2000 ? Math.min(650000, 100000 + variant.width * variant.height * 0.08) : 100000;
    assert.ok(bytes.length<byteBudget, 'Bound complete long-page renders by pixel area; keep app screens below 100KB: ' + image.id);
  }
  assert.ok(fs.existsSync(path.join(dist,image.socialSrc)));
}
for(const record of records) {
  const html=fs.readFileSync(path.join(dist,record.file),'utf8');
  assert.doesNotMatch(html,/href="[^"]*figma\.com[^\"]*(?:amp;amp;|amp%3B)/i,'Figma query separators must be encoded exactly once');
  assert.doesNotMatch(html,/(?:src|srcset)="[^"]*(?:figma\.com\/api\/mcp\/asset|figma-exports|artifacts\/)/,'No ephemeral or private image source');
  for(const figure of html.matchAll(/<figure\b[^>]*data-evidence-image="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g)) {
    const image=images.find(item=>item.id===figure[1]); assert.ok(image);
    assert.ok(html.includes(`https://www.figma.com/design/${image.fileKey}/?node-id=${image.nodeId.replaceAll(':', '-')}`), 'Each published figure must link to its exact Figma frame');
    assert.match(figure[2],/loading="lazy"/); assert.match(figure[2],/decoding="async"/); assert.match(figure[2],/width="\d+" height="\d+"/); assert.match(figure[2],/srcset="/);assert.match(figure[2],/<figcaption>/); references++;
    assert.ok(record.contentImages.includes('https://nischhalsubba.com.np'+image.variants.at(-1).src));
  }
  for(const anchor of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const target=new URL(anchor[1].replaceAll('&amp;','&'),record.url);
    if(target.origin!=='https://nischhalsubba.com.np')continue;
    const route=routes.get(target.pathname);
    if(!route)continue;
    assert.ok(!target.pathname.endsWith('.html'),'Content links must target canonicals');
    if(target.hash && target.hash!=='#') {
      const targetHtml=fs.readFileSync(path.join(dist,route.file),'utf8');
      const id=decodeURIComponent(target.hash.slice(1));
      assert.ok(targetHtml.includes(`id="${id}"`) || targetHtml.includes(`id='${id}'`),`${record.file}: missing ${target.pathname}${target.hash}`);
    }
  }
}
const editorial = require('../editorial/render.cjs');
const authoredFigures = editorial.projects.flatMap(project => project.decisions.flatMap(decision => decision.images || (decision.image ? [decision.image] : []))).length + editorial.articles.flatMap(article => article.sections.filter(section => section.image)).length;
assert.equal(new Set(images.map(image => image.id)).size, images.length, 'Each curated image needs a unique identity');assert.equal(references,authoredFigures);
console.log(`[evidence] ${images.length} curated originals, ${references} figure placements, local responsive variants and 53 canonical source/output pairs passed.`);
