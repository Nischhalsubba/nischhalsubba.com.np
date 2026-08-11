/**
 * @fileoverview scripts/ensure-homepage-hero-layout.cjs
 * Purpose: Apply the ensure homepage hero layout production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/generate-source.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = ['index.html', 'home-v2.html'];

const cleanHero = `      <section class="hero-section nrs-home-hero-clean">
        <p class="eyebrow reveal-on-scroll">Product designer in Nepal - Web3, SaaS, fintech and software teams</p>
        <h1 class="hero-title reveal-on-scroll">I design clearer product flows, interfaces, and handoff.</h1>
        <p class="body-large reveal-on-scroll">I help teams turn messy product requirements into understandable UX, polished UI, practical design systems, and implementation-ready Figma work.</p>
        <div class="hero-actions reveal-on-scroll cta-group"><a href="/projects.html" class="btn btn-primary">View selected work</a><a href="/contact.html" class="btn btn-secondary">Discuss a project</a><a href="/assets/resume.pdf" class="btn btn-secondary" download="Nischhal-Raj-Subba-Resume.pdf" data-resume-download>Download resume</a></div>
        <div class="hero-proof-strip reveal-on-scroll" aria-label="Core design strengths"><span>UX strategy</span><span>Interface design</span><span>Design systems</span><span>UX writing</span><span>Developer handoff</span></div>
      </section>`;


/**
 * Function contract: replaceHero
 * Purpose: Implement the replace hero responsibility owned by the ensure homepage hero layout repository tool.
 * Inputs: `html`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
function replaceHero(html) {
  const heroPattern = /      <section class="hero-section center-aligned-hero nrs-home-hero"[\s\S]*?      <\/section>/;
  if (heroPattern.test(html)) return html.replace(heroPattern, cleanHero);

  const cleanPattern = /      <section class="hero-section nrs-home-hero-clean">[\s\S]*?      <\/section>/;
  if (cleanPattern.test(html)) return html.replace(cleanPattern, cleanHero);

  return html;
}

let changed = 0;
for (const fileName of files) {
  const filePath = path.join(root, fileName);
  if (!fs.existsSync(filePath)) continue;
  const before = fs.readFileSync(filePath, 'utf8');
  const after = replaceHero(before);
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
    changed += 1;
  }
}

console.log(`Ensured clean homepage hero layout in ${changed} file(s).`);
