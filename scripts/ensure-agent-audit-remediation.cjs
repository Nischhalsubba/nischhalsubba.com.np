/**
 * @fileoverview scripts/ensure-agent-audit-remediation.cjs
 * Purpose: Validate ensure agent audit remediation and fail with actionable diagnostics when the production contract is violated.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - scripts/build-dist.cjs
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = process.argv.includes('--dist') ? path.join(root, 'dist') : root;
const stylePath = path.join(base, 'style.css');

const projectOrder = [
  'yarsha', 'mokshya', 'pihub', 'orkest', 'neverwinter-parser', 'masteriyo',
  'zapp', 'designerex', 'hamro-idea', 'morajaa', 'splashnode', 'grid-labs',
  'zakra-furniture', 'sassboilerplate',
];
const featured = new Set(['yarsha', 'mokshya', 'pihub', 'orkest', 'neverwinter-parser', 'masteriyo']);
const projectTitles = {
  yarsha: 'Yarsha',
  mokshya: 'Mokshya.io',
  pihub: 'piHub',
  orkest: 'Orkest HQ',
  'neverwinter-parser': 'Neverwinter Live Parser',
  masteriyo: 'Masteriyo',
  zapp: 'Zapp Today',
  designerex: 'Designerex',
  'hamro-idea': 'Hamro Idea',
  morajaa: 'Morajaa',
  splashnode: 'Splashnode',
  'grid-labs': 'Grid Labs',
  'zakra-furniture': 'Zakra Furniture',
  sassboilerplate: 'SassBoilerplate',
};

/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Function contract: strip
 * Purpose: Remove module behavior without disturbing required surrounding ensure agent audit remediation repository tool state.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function strip(value) {
  return String(value ?? '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Function contract: truncate
 * Purpose: Implement the truncate responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `value`: input value being transformed or evaluated; `max`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function truncate(value, max = 210) {
  const text = strip(value);
  if (text.length <= max) return text;
  const slice = text.slice(0, max + 1);
  const breakAt = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf(' '));
  return `${slice.slice(0, breakAt > max * .65 ? breakAt : max).trim()}…`;
}

/**
 * Function contract: sourceProject
 * Purpose: Implements the source project responsibility for this module.
 * Inputs: slug.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: sourceProject
 * Purpose: Implement the source project responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `slug`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function sourceProject(slug) {
  const file = path.join(root, `project-${slug}.html`);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

/**
 * Function contract: sourceImages
 * Purpose: Implements the source images responsibility for this module.
 * Inputs: slug.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: sourceImages
 * Purpose: Implement the source images responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `slug`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function sourceImages(slug) {
  const html = sourceProject(slug);
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] || html;
  const images = [];
  const seen = new Set();
  for (const match of main.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    const src = match[1];
    if (!src || seen.has(src) || /portrait|avatar|favicon/i.test(src)) continue;
    seen.add(src);
    const alt = /\balt=["']([^"']*)["']/i.exec(match[0])?.[1] || '';
    images.push({ src, alt: strip(alt) });
  }
  return images;
}

/**
 * Function contract: sectionByLabel
 * Purpose: Implements the section by label responsibility for this module.
 * Inputs: main, label.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: sectionByLabel
 * Purpose: Implement the section by label responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `main`: input consumed by this operation; `label`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function sectionByLabel(main, label) {
  const sections = [...main.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)].map(/** Callback contract: Processes the callback step for [...main.match all(/<section\b[^>]*>[\s\s]*?<\/section>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => match[0]);
  return sections.find(/** Callback contract: Processes the callback step for sections without leaking orchestration details to the caller. Inputs: section. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `section`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `section`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate/result. */ (section) => {
    const meta = section.match(/<span\b[^>]*class=["'][^"']*agent-meta[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] || '';
    return strip(meta).replace(/^\d+\s*·\s*/, '').toLowerCase() === label.toLowerCase();
  }) || '';
}

/**
 * Function contract: firstParagraph
 * Purpose: Implements the first paragraph responsibility for this module.
 * Inputs: section.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: firstParagraph
 * Purpose: Implement the first paragraph responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `section`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function firstParagraph(section) {
  return section.match(/<div\b[^>]*class=["'][^"']*nrs-case-section-body[^"']*["'][^>]*>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1]
    || section.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1]
    || '';
}

/**
 * Function contract: firstListItem
 * Purpose: Implements the first list item responsibility for this module.
 * Inputs: section.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: firstListItem
 * Purpose: Implement the first list item responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `section`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function firstListItem(section) {
  return section.match(/<li\b[^>]*>([\s\S]*?)<\/li>/i)?.[1] || '';
}

/**
 * Function contract: decisionTitles
 * Purpose: Implements the decision titles responsibility for this module.
 * Inputs: section.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: decisionTitles
 * Purpose: Implement the decision titles responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `section`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function decisionTitles(section) {
  return [...section.matchAll(/<article\b[^>]*class=["'][^"']*nrs-case-decision-card[^"']*["'][^>]*>[\s\S]*?<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)]
    .map(/** Callback contract: Processes the callback step for [...section.match all(/<article\b[^>]*class=["'][^"']*nrs case decision card[^"']*["'][^>]*>[\s\s]*?<h3\b[^>]*>([\s\s]*?)<\/h3>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => strip(match[1]))
    .filter(Boolean)
    .slice(0, 3);
}

/**
 * Function contract: removeLegacyBackLinks
 * Purpose: Removes or cleans remove legacy back links while keeping required outputs intact.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: removeLegacyBackLinks
 * Purpose: Remove legacy back links without disturbing required surrounding ensure agent audit remediation repository tool state.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function removeLegacyBackLinks(html) {
  return html.replace(/\s*<a\b[^>]*>\s*(?:&larr;|←|&#8592;)?\s*Back to Work\s*<\/a>/gi, '');
}

/**
 * Function contract: evidenceGallery
 * Purpose: Implements the evidence gallery responsibility for this module.
 * Inputs: slug, currentMain.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: evidenceGallery
 * Purpose: Implement the evidence gallery responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `slug`: input consumed by this operation; `currentMain`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function evidenceGallery(slug, currentMain) {
  const images = sourceImages(slug);
  if (!images.length) return '';
  const heroSrc = currentMain.match(/<header\b[^>]*class=["'][^"']*agent-case-hero[^"']*["'][^>]*>[\s\S]*?<img\b[^>]*src=["']([^"']+)["']/i)?.[1] || '';
  let selected = images.filter(/** Callback contract: Processes the callback step for images without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `image`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `image`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (image) => image.src !== heroSrc).slice(0, 4);
  if (!selected.length) selected = images.slice(0, 1);
  return `<section class="agent-section nrs-case-evidence-gallery" aria-labelledby="evidence-gallery-${esc(slug)}"><div class="agent-frame"><header class="nrs-case-evidence-head"><span class="agent-meta">Project evidence</span><h2 id="evidence-gallery-${esc(slug)}">Screens and shipped artifacts</h2><p>Visual material from the project, placed near the decisions instead of making the reader hunt for proof at the end.</p></header><div class="nrs-case-evidence-grid">${selected.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `image`, `index`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ (image, index) => `<figure><img src="${esc(image.src)}" alt="${esc(image.alt || `${slug} project artifact ${index + 1}`)}" loading="lazy" decoding="async"><figcaption>${String(index + 1).padStart(2, '0')} · ${esc(image.alt || 'Project artifact')}</figcaption></figure>`).join('')}</div></div></section>`;
}

/**
 * Function contract: compactSectionMeta
 * Purpose: Implement the compact section meta responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `section`: input consumed by this operation; `label`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function compactSectionMeta(section, label) {
  if (!section) return '';
  return section.replace(/<span\b([^>]*class=["'][^"']*agent-meta[^"']*["'][^>]*)>\s*\d+\s*·\s*[^<]+<\/span>/i, `<span$1>${esc(label)}</span>`);
}

/**
 * Function contract: transformCase
 * Purpose: Implement the transform case responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: `slug`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function transformCase(slug) {
  const file = path.join(base, `project-${slug}.html`);
  if (!fs.existsSync(file)) return { changed: false, evidence: 0 };
  let html = removeLegacyBackLinks(fs.readFileSync(file, 'utf8'));
  const main = html.match(/<main\b[^>]*class=["'][^"']*nrs-final-case[^"']*["'][^>]*>[\s\S]*?<\/main>/i)?.[0];
  if (!main) {
    fs.writeFileSync(file, html, 'utf8');
    return { changed: false, evidence: sourceImages(slug).length };
  }

  const hero = main.match(/<header\b[^>]*class=["'][^"']*agent-case-hero[^"']*["'][^>]*>[\s\S]*?<\/header>/i)?.[0] || '';
  const brief = sectionByLabel(main, 'The brief');
  const role = sectionByLabel(main, 'My contribution');
  const decisions = sectionByLabel(main, 'Product decisions');
  const model = sectionByLabel(main, 'Experience model');
  const reality = sectionByLabel(main, 'Reality checks');
  const delivery = sectionByLabel(main, 'From design to build');
  const outcome = sectionByLabel(main, 'Outcome');
  const proof = sectionByLabel(main, 'Proof');
  const takeaway = sectionByLabel(main, 'What this demonstrates');

  if (![hero, brief, role, decisions, outcome, proof, takeaway].every(Boolean)) {
    fs.writeFileSync(file, html, 'utf8');
    return { changed: false, evidence: sourceImages(slug).length };
  }

  const problem = truncate(firstParagraph(brief), 190);
  const responsibility = truncate(firstParagraph(role), 190);
  const choices = decisionTitles(decisions);
  const result = truncate(firstListItem(outcome), 150);
  const sourceEvidence = sourceImages(slug);
  const proofHasLink = /<a\b[^>]*href=["']https?:\/\//i.test(proof);
  const evidenceLabel = sourceEvidence.length
    ? `${sourceEvidence.length} project artifact${sourceEvidence.length === 1 ? '' : 's'} available in the case`
    : proofHasLink ? 'Public project link available below' : 'Public write-up and scoped project evidence';

  const summary = `<section class="agent-section nrs-case-skim" aria-labelledby="case-skim-${esc(slug)}"><div class="agent-frame"><div class="nrs-case-skim-head"><span class="agent-meta">30-second read</span><h2 id="case-skim-${esc(slug)}">The case, before the deep dive</h2></div><dl class="nrs-case-skim-grid"><div><dt>Problem</dt><dd>${esc(problem)}</dd></div><div><dt>My role</dt><dd>${esc(responsibility)}</dd></div><div><dt>Key decisions</dt><dd>${choices.length ? esc(choices.join(' · ')) : 'See the decision chapter below.'}</dd></div><div><dt>Evidence</dt><dd>${esc(evidenceLabel)}</dd></div><div><dt>Outcome</dt><dd>${esc(result || 'Delivered design decisions and implementation-ready behavior are documented below.')}</dd></div></dl></div></section>`;

  const chapterOne = `<div class="nrs-case-chapter" data-chapter="context">${compactSectionMeta(brief, 'Context')}${compactSectionMeta(role, 'Responsibility')}</div>`;
  const gallery = evidenceGallery(slug, main);
  const chapterTwo = `<div class="nrs-case-chapter" data-chapter="decisions">${compactSectionMeta(decisions, 'Key decisions')}${gallery}</div>`;
  const deepSections = [compactSectionMeta(model, 'Experience model'), compactSectionMeta(reality, 'Edge cases'), compactSectionMeta(delivery, 'Handoff')].filter(Boolean).join('');
  const depth = deepSections ? `<section class="agent-section nrs-case-depth-wrap"><div class="agent-frame"><details class="nrs-case-depth"><summary><span><b>Optional deep dive</b><small>System logic, edge cases and handoff</small></span><span aria-hidden="true">+</span></summary><div class="nrs-case-depth-body">${deepSections}</div></details></div></section>` : '';
  const chapterThree = `<div class="nrs-case-chapter" data-chapter="outcome">${compactSectionMeta(outcome, 'Outcome')}${compactSectionMeta(proof, 'Proof')}${compactSectionMeta(takeaway, 'Takeaway')}</div>`;

  const index = projectOrder.indexOf(slug);
  const previous = index > 0 ? projectOrder[index - 1] : projectOrder.at(-1);
  const next = index >= 0 && index < projectOrder.length - 1 ? projectOrder[index + 1] : projectOrder[0];
  const nextNav = `<nav class="agent-section nrs-case-next" aria-label="Project case study navigation"><div class="agent-frame"><a href="/project-${esc(previous)}"><span>Previous case</span><strong>${esc(projectTitles[previous] || previous.replaceAll('-', ' '))}</strong></a><a href="/projects"><span>Index</span><strong>Selected work</strong></a><a href="/project-${esc(next)}"><span>Next case</span><strong>${esc(projectTitles[next] || next.replaceAll('-', ' '))}</strong></a></div></nav>`;

  const rebuilt = `<main id="main-content" class="agent-main nrs-hireable-case nrs-final-case nrs-audit-remediated-case" data-project-slug="${esc(slug)}">${hero}${summary}${chapterOne}${chapterTwo}${depth}${chapterThree}${nextNav}</main>`;
  html = html.replace(main, rebuilt);
  html = removeLegacyBackLinks(html);
  fs.writeFileSync(file, html, 'utf8');
  return { changed: true, evidence: sourceEvidence.length };
}

/**
 * Function contract: repairWorkPage
 * Purpose: Implements the repair work page responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: repairWorkPage
 * Purpose: Apply work page consistently while preserving the surrounding ensure agent audit remediation repository tool contract.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function repairWorkPage() {
  const file = path.join(base, 'projects.html');
  if (!fs.existsSync(file)) return { cards: 0, repaired: 0, textOnly: 0 };
  let html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*class=["'][^"']*nrs-projects-editorial[^"']*["'][^>]*>[\s\S]*?<\/main>/i)?.[0];
  if (!main) return { cards: 0, repaired: 0, textOnly: 0 };

  const hero = main.match(/<header\b[^>]*class=["'][^"']*agent-page-hero[^"']*["'][^>]*>[\s\S]*?<\/header>/i)?.[0] || '';
  const close = main.match(/<section\b[^>]*class=["'][^"']*nrs-work-close[^"']*["'][^>]*>[\s\S]*?<\/section>/i)?.[0] || '';
  const cards = [...main.matchAll(/<a\b[^>]*class=["'][^"']*nrs-work-card[^"']*["'][^>]*href=["']\/project-([^"']+)["'][^>]*>[\s\S]*?<\/a>/gi)]
    .map(/** Callback contract: Processes the callback step for [...main.match all(/<a\b[^>]*class=["'][^"']*nrs work card[^"']*["'][^>]*href=["']\/project ([^"']+)["'][^>]*>[\s\s]*?<\/a>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => ({ slug: match[1].replace(/\.html$/i, ''), html: match[0] }));

  let repaired = 0;
  let textOnly = 0;
  const cardMap = new Map();
  for (const { slug, html: raw } of cards) {
    let card = raw.replace(/<a\b([^>]*class=["'][^"']*nrs-work-card[^"']*["'][^>]*)>/i, `<a$1 data-project-slug="${esc(slug)}">`);
    const mediaMatch = card.match(/<div\b[^>]*class=["'][^"']*nrs-work-card-media[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    const hasImage = mediaMatch && /<img\b/i.test(mediaMatch[1]);
    if (!hasImage && mediaMatch) {
      const image = sourceImages(slug)[0];
      if (image) {
        const media = `<div class="nrs-work-card-media"><img src="${esc(image.src)}" alt="${esc(image.alt || `${slug} project preview`)}" loading="lazy" decoding="async"></div>`;
        card = card.replace(mediaMatch[0], media);
        repaired += 1;
      } else {
        card = card.replace(mediaMatch[0], '');
        card = card.replace(/class=["']([^"']*nrs-work-card[^"']*)["']/i, /** Callback contract: Processes the callback step for card without leaking orchestration details to the caller. Inputs: _m, classes. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing ensure agent audit remediation repository tool operation. Inputs: `_m`, `classes`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `_m`, `classes`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (_m, classes) => `class="${classes} nrs-work-card--text-only"`);
        textOnly += 1;
      }
    }
    cardMap.set(slug, card);
  }

  const sorted = projectOrder.map(/** Callback contract: Processes the callback step for project order without leaking orchestration details to the caller. Inputs: slug. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `slug`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `slug`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (slug) => [slug, cardMap.get(slug)]).filter(/** Callback contract: Processes the callback step for project order.map((slug) => [slug, card map.get(slug)]) without leaking orchestration details to the caller. Inputs: [, card]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `[, card]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `[, card]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ ([, card]) => card);
  const featuredCards = sorted.filter(/** Callback contract: Processes the callback step for sorted without leaking orchestration details to the caller. Inputs: [slug]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `[slug]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `[slug]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ ([slug]) => featured.has(slug)).map(/** Callback contract: Processes the callback step for sorted.filter(([slug]) => featured.has(slug)) without leaking orchestration details to the caller. Inputs: [, card]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[, card]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[, card]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ ([, card]) => card).join('');
  const archiveCards = sorted.filter(/** Callback contract: Processes the callback step for sorted without leaking orchestration details to the caller. Inputs: [slug]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `[slug]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `[slug]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate result. */ ([slug]) => !featured.has(slug)).map(/** Callback contract: Processes the callback step for sorted.filter(([slug]) => !featured.has(slug)) without leaking orchestration details to the caller. Inputs: [, card]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[, card]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[, card]`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ ([, card]) => card).join('');
  const featuredSection = `<section class="agent-section nrs-work-featured"><div class="agent-frame"><div class="nrs-work-group-head"><span class="agent-meta">Start here</span><h2>Six case studies that show the range.</h2><p>Product systems, technical storytelling, data-heavy work and collaborative product design. These are the fastest route to how I think.</p></div><div class="nrs-work-grid">${featuredCards}</div></div></section>`;
  const archiveSection = `<section class="agent-section nrs-work-archive-section"><div class="agent-frame"><details class="nrs-work-archive"><summary><span><b>Additional work</b><small>${sorted.length - featured.size} more projects across websites, marketplaces, logistics and front-end systems.</small></span><span aria-hidden="true">+</span></summary><div class="nrs-work-grid">${archiveCards}</div></details></div></section>`;
  const rebuilt = `<main id="main-content" class="agent-main nrs-projects-editorial nrs-audit-remediated-work">${hero}${featuredSection}${archiveSection}${close}</main>`;
  html = html.replace(main, rebuilt);
  fs.writeFileSync(file, html, 'utf8');
  return { cards: sorted.length, repaired, textOnly };
}

/**
 * Function contract: dedupeAboutProcess
 * Purpose: Implements the dedupe about process responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: dedupeAboutProcess
 * Purpose: Implement the dedupe about process responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function dedupeAboutProcess() {
  const file = path.join(base, 'about.html');
  if (!fs.existsSync(file)) return 0;
  let html = fs.readFileSync(file, 'utf8');
  const sections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)]
    .filter(/** Callback contract: Processes the callback step for [...html.match all(/<section\b[^>]*>[\s\s]*?<\/section>/gi)] without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Decide whether the current item remains in the filtered result consumed by the enclosing operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => /Four passes\.\s*Fewer loose ends\./i.test(match[0]));
  if (sections.length <= 1) return 0;
  for (let i = sections.length - 1; i >= 1; i -= 1) {
    html = html.slice(0, sections[i].index) + html.slice(sections[i].index + sections[i][0].length);
  }
  fs.writeFileSync(file, html, 'utf8');
  return sections.length - 1;
}

/**
 * Function contract: appendStyles
 * Purpose: Implements the append styles responsibility for this module.
 * Inputs: none; the function derives state from its enclosing module/runtime context.
 * Side effects: may read or write repository/filesystem state.
 * Returns: no explicit value unless an invoked dependency throws/rejects.
 */
/**
 * Function contract: appendStyles
 * Purpose: Implement the append styles responsibility owned by the ensure agent audit remediation repository tool.
 * Inputs: None; derives required state from the enclosing module/runtime context.
 * Side effects: writes repository/filesystem state.
 * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
 */
function appendStyles() {
  if (!fs.existsSync(stylePath)) throw new Error(`[agent-audit-remediation] Missing ${stylePath}`);
  const start = '/* nrs-agent-audit-remediation-v1:start */';
  const end = '/* nrs-agent-audit-remediation-v1:end */';
  const marker = /\/\* nrs-agent-audit-remediation-v\d+:start \*\/[\s\S]*?\/\* nrs-agent-audit-remediation-v\d+:end \*\//g;
  const css = `${start}
.agent-portfolio .nrs-case-skim {
  padding-block: clamp(3rem, 5vw, 5rem) !important;
  background: var(--ap-surface) !important;
  border-top: 1px solid var(--ap-line) !important;
  border-bottom: 1px solid var(--ap-line) !important;
}
.agent-portfolio .nrs-case-skim-head {
  display: grid;
  grid-template-columns: minmax(10rem, .7fr) minmax(0, 1.3fr);
  gap: 1.5rem clamp(2rem, 6vw, 7rem);
  align-items: end;
  margin-bottom: clamp(1.75rem, 3vw, 2.75rem);
}
.agent-portfolio .nrs-case-skim-head h2 {
  max-width: 14ch;
  margin: 0;
  color: var(--ap-ink) !important;
  font: 740 clamp(2.25rem, 4.5vw, 4.75rem)/.92 var(--ap-font-display);
  letter-spacing: -.055em;
}
.agent-portfolio .nrs-case-skim-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
  margin: 0;
  border-top: 1px solid var(--ap-line-strong);
  border-bottom: 1px solid var(--ap-line);
}
.agent-portfolio .nrs-case-skim-grid > div { min-width: 0; padding: 1.25rem 1rem 1.4rem 0; }
.agent-portfolio .nrs-case-skim-grid > div + div { padding-left: 1rem; border-left: 1px solid var(--ap-line); }
.agent-portfolio .nrs-case-skim-grid dt {
  margin-bottom: .7rem;
  color: var(--ap-ink-soft);
  font: 650 .75rem/1.3 var(--ap-font-mono);
  letter-spacing: .055em;
  text-transform: uppercase;
}
.agent-portfolio .nrs-case-skim-grid dd { margin: 0; color: var(--ap-ink); font-size: .98rem; line-height: 1.55; }
.agent-portfolio .nrs-case-chapter { border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-case-chapter > .agent-section { padding-block: clamp(3.25rem, 5.25vw, 5.5rem) !important; }
.agent-portfolio .nrs-case-chapter > .agent-section + .agent-section { border-top: 1px solid var(--ap-line) !important; }
.agent-portfolio .nrs-case-evidence-gallery { padding-block: clamp(3rem, 5vw, 5rem) !important; }
.agent-portfolio .nrs-case-evidence-head {
  display: grid;
  grid-template-columns: minmax(10rem, .7fr) minmax(0, 1.3fr);
  gap: .75rem clamp(2rem, 6vw, 7rem);
  margin-bottom: 1.75rem;
}
.agent-portfolio .nrs-case-evidence-head .agent-meta { grid-row: 1 / 3; }
.agent-portfolio .nrs-case-evidence-head h2 { margin: 0; color: var(--ap-ink); font-size: clamp(2rem, 3.7vw, 3.8rem); line-height: .96; }
.agent-portfolio .nrs-case-evidence-head p { max-width: 44rem; margin: 0; color: var(--ap-ink-soft); }
.agent-portfolio .nrs-case-evidence-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.agent-portfolio .nrs-case-evidence-grid figure { min-width: 0; margin: 0; border: 1px solid var(--ap-line); background: var(--ap-surface); }
.agent-portfolio .nrs-case-evidence-grid img { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; }
.agent-portfolio .nrs-case-evidence-grid figcaption { padding: .85rem 1rem; color: var(--ap-ink-soft); font: 600 .75rem/1.45 var(--ap-font-mono); }
.agent-portfolio .nrs-case-depth-wrap { padding-block: clamp(2rem, 3vw, 3rem) !important; }
.agent-portfolio .nrs-case-depth { border: 1px solid var(--ap-line); background: var(--ap-surface); }
.agent-portfolio .nrs-case-depth > summary,
.agent-portfolio .nrs-work-archive > summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 64px;
  padding: 1.15rem 1.25rem;
  cursor: pointer;
  list-style: none;
  color: var(--ap-ink);
}
.agent-portfolio .nrs-case-depth > summary::-webkit-details-marker,
.agent-portfolio .nrs-work-archive > summary::-webkit-details-marker { display: none; }
.agent-portfolio .nrs-case-depth summary span:first-child,
.agent-portfolio .nrs-work-archive summary span:first-child { display: grid; gap: .2rem; }
.agent-portfolio .nrs-case-depth summary b,
.agent-portfolio .nrs-work-archive summary b { font-size: 1rem; }
.agent-portfolio .nrs-case-depth summary small,
.agent-portfolio .nrs-work-archive summary small { color: var(--ap-ink-soft); font-size: .85rem; }
.agent-portfolio .nrs-case-depth[open] > summary > span:last-child,
.agent-portfolio .nrs-work-archive[open] > summary > span:last-child { transform: rotate(45deg); }
.agent-portfolio .nrs-case-depth-body { border-top: 1px solid var(--ap-line); }
.agent-portfolio .nrs-case-depth-body > .agent-section { padding-block: 2.75rem !important; border-top: 0 !important; }
.agent-portfolio .nrs-case-depth-body > .agent-section + .agent-section { border-top: 1px solid var(--ap-line) !important; }
.agent-portfolio .nrs-case-next { padding-block: 2rem !important; }
.agent-portfolio .nrs-case-next .agent-frame { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--ap-line); }
.agent-portfolio .nrs-case-next a { display: grid; gap: .35rem; min-height: 78px; padding: 1rem 1.2rem; color: var(--ap-ink); text-decoration: none; }
.agent-portfolio .nrs-case-next a + a { border-left: 1px solid var(--ap-line); }
.agent-portfolio .nrs-case-next a:nth-child(2) { text-align: center; }
.agent-portfolio .nrs-case-next a:nth-child(3) { text-align: right; }
.agent-portfolio .nrs-case-next span { color: var(--ap-ink-soft); font: 600 .72rem/1.3 var(--ap-font-mono); text-transform: uppercase; }
.agent-portfolio .nrs-work-featured,
.agent-portfolio .nrs-work-archive-section { padding-block: clamp(3.75rem, 6vw, 6rem); }
.agent-portfolio .nrs-work-archive-section { padding-top: 0; }
.agent-portfolio .nrs-work-archive { border-top: 1px solid var(--ap-line-strong); border-bottom: 1px solid var(--ap-line); }
.agent-portfolio .nrs-work-archive > summary { padding-inline: 0; }
.agent-portfolio .nrs-work-archive .nrs-work-grid { padding-block: 1.5rem 3rem; }
.agent-portfolio .nrs-work-card--text-only { grid-template-rows: 1fr; min-height: 22rem; }
.agent-portfolio .nrs-work-card[data-project-slug='hamro-idea'] img,
.agent-portfolio .nrs-work-card[data-project-slug='morajaa'] img,
.agent-portfolio .nrs-work-card[data-project-slug='splashnode'] img { object-position: center top; }
.agent-portfolio .nrs-service-rows article,
.agent-portfolio .agent-service-row,
.agent-portfolio .agent-service-item { position: relative; }
.agent-portfolio .nrs-service-rows article > a::after,
.agent-portfolio .agent-service-row > a::after,
.agent-portfolio .agent-service-item > a::after { content: ''; position: absolute; inset: 0; }
.agent-portfolio .nrs-service-rows article:has(a):hover,
.agent-portfolio .agent-service-row:has(a):hover,
.agent-portfolio .agent-service-item:has(a):hover { background: var(--ap-surface); }
.agent-portfolio .nav-link { min-height: 44px !important; font-size: .8125rem !important; }
.agent-portfolio .agent-meta,
.agent-portfolio .agent-kicker { font-size: max(.75rem, 12px) !important; }
.agent-portfolio .nrs-work-card-copy p,
.agent-portfolio .nrs-case-section-body p,
.agent-portfolio .nrs-case-section-body li { font-size: max(1rem, 16px); }
@media (max-width: 430px) {
  .agent-portfolio .agent-mobile-brand {
    display: flex !important;
    align-items: center !important;
    min-height: 44px !important;
    max-width: calc(100vw - 148px) !important;
    overflow: hidden !important;
  }
  .agent-portfolio .agent-mobile-brand strong {
    display: block !important;
    margin: 0 !important;
    color: inherit !important;
    font-size: 12.5px !important;
    line-height: 1.08 !important;
    white-space: nowrap !important;
  }
  .agent-portfolio .agent-mobile-brand span { display: none !important; }
}
@media (max-width: 1023px) {
  .agent-portfolio .nrs-case-skim-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .agent-portfolio .nrs-case-skim-grid > div { padding: 1rem 0; border-left: 0 !important; border-bottom: 1px solid var(--ap-line); }
  .agent-portfolio .nrs-case-skim-grid > div:nth-child(even) { padding-left: 1rem; border-left: 1px solid var(--ap-line) !important; }
  .agent-portfolio .nrs-case-skim-grid > div:last-child { grid-column: 1 / -1; }
}
@media (max-width: 767px) {
  .agent-portfolio .nrs-case-skim,
  .agent-portfolio .nrs-case-chapter > .agent-section,
  .agent-portfolio .nrs-case-evidence-gallery { padding-block: 2.75rem !important; }
  .agent-portfolio .nrs-case-skim-head,
  .agent-portfolio .nrs-case-evidence-head { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-case-evidence-head .agent-meta { grid-row: auto; }
  .agent-portfolio .nrs-case-skim-grid { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-case-skim-grid > div,
  .agent-portfolio .nrs-case-skim-grid > div:nth-child(even),
  .agent-portfolio .nrs-case-skim-grid > div:last-child { grid-column: auto; padding: 1rem 0; border-left: 0 !important; }
  .agent-portfolio .nrs-case-evidence-grid { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-case-next .agent-frame { grid-template-columns: minmax(0, 1fr); }
  .agent-portfolio .nrs-case-next a + a { border-left: 0; border-top: 1px solid var(--ap-line); }
  .agent-portfolio .nrs-case-next a:nth-child(2),
  .agent-portfolio .nrs-case-next a:nth-child(3) { text-align: left; }
}
@media (prefers-reduced-motion: reduce) {
  .agent-portfolio .nrs-case-depth > summary > span:last-child,
  .agent-portfolio .nrs-work-archive > summary > span:last-child { transition: none !important; }
}
${end}`;

  let style = fs.readFileSync(stylePath, 'utf8');
  style = style.replace(marker, '').trimEnd();
  style += `\n\n${css}\n`;
  fs.writeFileSync(stylePath, style, 'utf8');
}

const caseResults = projectOrder.map(/** Callback contract: Processes the callback step for project order without leaking orchestration details to the caller. Inputs: slug. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `slug`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `slug`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (slug) => [slug, transformCase(slug)]);
const workResult = repairWorkPage();
const removedAboutDuplicates = dedupeAboutProcess();
appendStyles();

const failures = [];
for (const [slug, result] of caseResults) {
  const file = path.join(base, `project-${slug}.html`);
  const html = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (!html.includes('30-second read')) failures.push(`${slug}: missing 30-second summary`);
  if (/Back to Work/i.test(html)) failures.push(`${slug}: legacy Back to Work remains`);
  if (!html.includes('nrs-case-next')) failures.push(`${slug}: previous/next navigation missing`);
  if (result.evidence > 0 && !html.includes('nrs-case-evidence-gallery')) failures.push(`${slug}: source evidence was not surfaced`);
}

const projectsHtml = fs.readFileSync(path.join(base, 'projects.html'), 'utf8');
if (!projectsHtml.includes('Six case studies that show the range.')) failures.push('projects: featured recruiter path missing');
if (!projectsHtml.includes('Additional work')) failures.push('projects: additional work archive missing');
if (/nrs-work-card-media["'][^>]*>\s*<\/div>/i.test(projectsHtml)) failures.push('projects: blank media well remains');

const aboutHtml = fs.readFileSync(path.join(base, 'about.html'), 'utf8');
if ((aboutHtml.match(/Four passes\.\s*Fewer loose ends\./gi) || []).length > 1) failures.push('about: duplicate Four passes section remains');

const finalStyle = fs.readFileSync(stylePath, 'utf8');
for (const required of ['nrs-agent-audit-remediation-v1:start', 'max-width: calc(100vw - 148px)', '.nrs-case-skim-grid', '.nrs-work-archive']) {
  if (!finalStyle.includes(required)) failures.push(`style: missing ${required}`);
}

if (failures.length) {
  throw new Error(`[agent-audit-remediation] ${failures.length} failure(s): ${failures.join('; ')}`);
}

console.log(`[agent-audit-remediation] Remediated ${caseResults.length} case studies; work cards=${workResult.cards}, repaired media=${workResult.repaired}, text-only=${workResult.textOnly}; removed ${removedAboutDuplicates} duplicate About section(s).`);
