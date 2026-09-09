/**
 * @fileoverview scripts/ensure-blog-lightweight-covers.cjs
 * Purpose: Keep visible blog-cover delivery lightweight while preserving independent social-preview metadata.
 * Responsibilities:
 * - Replace visible multi-megabyte blog PNG covers with local 16:9 SVG editorial covers.
 * - Preserve route-specific social preview metadata instead of reusing in-page cover assets for crawlers.
 * - Keep intrinsic dimensions and decoding/loading hints on the primary article cover to avoid layout shift.
 * - Remove unused heavyweight legacy blog PNGs from final production output while preserving generated social previews.
 * - Fail when a transformed target still contains a visible blog PNG or an oversized SVG cover.
 * Execution context: Node.js CLI during canonical source generation and final production build normalization.
 * Connected files:
 * - scripts/generate-source.cjs
 * - package.json
 * - src/scripts/features/content/blog-visuals.js
 * - assets/images/README.md
 * Maintenance: Keep exact-article and topic mappings aligned with approved blog cover assets and production metadata ownership.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const useDist = process.argv.includes('--dist');
const TARGET = useDist ? path.join(ROOT, 'dist') : ROOT;
const MAX_DISPLAY_COVER_BYTES = 64 * 1024;

const EXACT_COVERS = new Map([
  ['blog-web3-products.html', {
    src: '/assets/images/blog-web3-products.svg',
    alt: 'Editorial cover showing wallet review, transaction clarity, and Web3 product trust patterns',
  }],
  ['blog-good-handoff.html', {
    src: '/assets/images/blog-good-handoff.svg',
    alt: 'Editorial cover showing Figma handoff notes, interface states, and developer-ready product decisions',
  }],
  ['blog-portfolio-product.html', {
    src: '/assets/images/blog-portfolio-product.svg',
    alt: 'Editorial cover showing portfolio project cards, contribution labels, case study blocks, and SEO structure',
  }],
  ['blog-service-websites.html', {
    src: '/assets/images/blog-service-websites.svg',
    alt: 'Editorial cover showing service website structure, proof, pricing, and conversion paths',
  }],
  ['blog-gaming-interface-clarity.html', {
    src: '/assets/images/blog-gaming-interface-clarity.svg',
    alt: 'Editorial cover showing real-time feedback, status states, combat data, and interface clarity',
  }],
  ['blog-design-systems-front-end.html', {
    src: '/assets/images/blog-design-systems-front-end.svg',
    alt: 'Editorial cover showing reusable components, design tokens, responsive behavior, and front-end-aware design systems',
  }],
]);

const TOPIC_COVERS = [
  {
    match: /saas|dashboard|empty-state|empty-states|enterprise|metric|data-dense/i,
    src: '/assets/images/blog-saas-dashboard-cover.svg',
    alt: 'SaaS dashboard UX cover showing filters, data cards, status states, and a trend chart',
  },
  {
    match: /handoff|figma|design-system|design-systems|front-end|developer/i,
    src: '/assets/images/blog-design-systems-handoff-cover.svg',
    alt: 'Design systems and handoff cover showing components, interface states, specifications, and QA notes',
  },
  {
    match: /web3|wallet|crypto|transaction|governance/i,
    src: '/assets/images/blog-web3-wallet-ux-cover.svg',
    alt: 'Web3 wallet UX cover showing review, permissions, signing clarity, and transaction trust patterns',
  },
  {
    match: /audit|accessibility|research|redesign|emerging|usability/i,
    src: '/assets/images/blog-ux-audit-research-cover.svg',
    alt: 'UX audit and research cover showing evidence, usability findings, accessibility checks, and prioritization',
  },
  {
    match: /service|website|pricing|plans|software-companies|business/i,
    src: '/assets/images/blog-service-pricing-ux-cover.svg',
    alt: 'Service website UX cover showing service hierarchy, pricing structure, proof, and conversion paths',
  },
];

const DEFAULT_COVER = TOPIC_COVERS[1];

/**
 * Function contract: walkFiles
 * Purpose: Recursively list every file below the supplied directory without callback-based traversal.
 * Inputs: `dir` - directory to inspect.
 * Side effects: Reads filesystem directory state.
 * Returns: Array of absolute file paths.
 */
function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

/**
 * Function contract: walkHtml
 * Purpose: Recursively list HTML files below the supplied directory.
 * Inputs: `dir` - directory to inspect.
 * Side effects: Reads filesystem directory state.
 * Returns: Array of absolute HTML file paths.
 */
function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(
    /** Callback contract: Expand each directory entry into nested HTML paths or the matching file path. Inputs: `entry` Side effects: Reads nested directory state through `walkHtml`. Returns: Array of HTML paths for the current entry. */
    (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walkHtml(fullPath);
      return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
    },
  );
}

/**
 * Function contract: pageKey
 * Purpose: Build a stable topic-matching key from route path, title, and primary heading.
 * Inputs: `filePath`, `html`.
 * Side effects: None.
 * Returns: Normalized text used by topic cover selection.
 */
function pageKey(filePath, html) {
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1] || '';
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1] || '';
  return `${filePath} ${title} ${h1}`.replace(/<[^>]*>/g, ' ');
}

/**
 * Function contract: pickCover
 * Purpose: Resolve the most specific approved lightweight cover for an article.
 * Inputs: `filePath`, `html`.
 * Side effects: None.
 * Returns: Cover descriptor with `src` and `alt`.
 */
function pickCover(filePath, html) {
  const exact = EXACT_COVERS.get(path.basename(filePath));
  if (exact) return exact;
  const key = pageKey(filePath, html);
  return TOPIC_COVERS.find((cover) => cover.match.test(key)) || DEFAULT_COVER;
}

/**
 * Function contract: setAttribute
 * Purpose: Set or insert one HTML attribute on a single tag string.
 * Inputs: `tag`, `name`, `value`.
 * Side effects: None.
 * Returns: Updated tag string.
 */
function setAttribute(tag, name, value) {
  const expression = new RegExp(`\\b${name}=["'][^"']*["']`, 'i');
  if (expression.test(tag)) return tag.replace(expression, `${name}="${value}"`);
  return tag.replace(/^<img\b/i, `<img ${name}="${value}"`);
}

/**
 * Function contract: ensureClass
 * Purpose: Ensure the primary cover image carries the shared blog-cover class without discarding existing classes.
 * Inputs: `tag` - image tag string.
 * Side effects: None.
 * Returns: Updated tag string.
 */
function ensureClass(tag) {
  const match = tag.match(/\bclass=["']([^"']*)["']/i);
  if (!match) return tag.replace(/^<img\b/i, '<img class="nrs-blog-cover-img"');
  const classes = new Set(match[1].split(/\s+/).filter(Boolean));
  classes.add('nrs-blog-cover-img');
  return tag.replace(/\bclass=["'][^"']*["']/i, `class="${[...classes].join(' ')}"`);
}

/**
 * Function contract: replaceVisibleCover
 * Purpose: Replace the first visible blog cover image with its approved lightweight SVG and stable layout attributes.
 * Inputs: `html`, `cover`.
 * Side effects: None.
 * Returns: Updated HTML string.
 */
function replaceVisibleCover(html, cover) {
  const expression = /<img\b[^>]*\bsrc=["'][^"']*(?:blog-[^"']+\.(?:png|svg|webp)|unsplash[^"']*)["'][^>]*>/i;
  if (!expression.test(html)) return html;
  return html.replace(
    expression,
    /** Callback contract: Rewrite the matched primary cover tag to the approved SVG while preserving unrelated attributes. Inputs: `tag` Side effects: None. Returns: Updated image tag string. */
    (tag) => {
      let next = tag;
      next = setAttribute(next, 'src', cover.src);
      next = setAttribute(next, 'alt', cover.alt);
      next = setAttribute(next, 'width', '1200');
      next = setAttribute(next, 'height', '675');
      next = setAttribute(next, 'loading', 'eager');
      next = setAttribute(next, 'decoding', 'async');
      next = ensureClass(next);
      return next;
    },
  );
}

/**
 * Function contract: socialImage
 * Purpose: Read the final static Open Graph image URL without executing browser JavaScript.
 * Inputs: `html`.
 * Side effects: None.
 * Returns: Social image URL or null when unavailable.
 */
function socialImage(html) {
  return html.match(/<meta\b(?=[^>]*\bproperty=["']og:image["'])[^>]*\bcontent=["']([^"']+)["'][^>]*>/i)?.[1] || null;
}

/**
 * Function contract: updateStructuredImages
 * Purpose: Align Article and BlogPosting JSON-LD image fields with the static social-preview image generated for production.
 * Inputs: `html`, `imageUrl`.
 * Side effects: None.
 * Returns: Updated HTML string.
 */
function updateStructuredImages(html, imageUrl) {
  if (!imageUrl) return html;
  return html.replace(
    /<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi,
    /** Callback contract: Parse one JSON-LD block and align article image fields to the generated static social preview. Inputs: `match`, `rawJson` Side effects: None. Returns: Updated JSON-LD script tag or the original tag when parsing fails. */
    (match, rawJson) => {
      try {
        const data = JSON.parse(rawJson.trim());
        /**
         * Function contract: visit
         * Purpose: Recursively align article-like JSON-LD nodes with the static social preview image.
         * Inputs: `node` - current JSON-LD object or nested value.
         * Side effects: Mutates matching object nodes inside the parsed JSON-LD data structure.
         * Returns: Undefined; recursion updates the parsed structure in place.
         */
        const visit = (node) => {
          if (!node || typeof node !== 'object') return;
          if (['Article', 'BlogPosting'].includes(node['@type']) || node.headline) node.image = imageUrl;
          Object.values(node).forEach((value) => {
            if (Array.isArray(value)) value.forEach(visit);
            else visit(value);
          });
        };
        visit(data);
        return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
      } catch {
        return match;
      }
    },
  );
}

/**
 * Function contract: visibleBlogPngs
 * Purpose: Find heavyweight PNG references that remain in visible image elements after transformation.
 * Inputs: `html`.
 * Side effects: None.
 * Returns: Array of matching image tags.
 */
function visibleBlogPngs(html) {
  return html.match(/<img\b[^>]*\bsrc=["'][^"']*blog-[^"']+\.png["'][^>]*>/gi) || [];
}

/**
 * Function contract: assertCoverAsset
 * Purpose: Verify that a referenced display SVG exists in the selected target and remains below the delivery budget.
 * Inputs: `cover`.
 * Side effects: Reads filesystem metadata.
 * Returns: Undefined; throws on missing or oversized assets.
 */
function assertCoverAsset(cover) {
  const relativePath = cover.src.replace(/^\//, '');
  const assetPath = path.join(TARGET, relativePath);
  if (!fs.existsSync(assetPath)) throw new Error(`Missing lightweight blog cover: ${relativePath}`);
  const bytes = fs.statSync(assetPath).size;
  if (bytes > MAX_DISPLAY_COVER_BYTES) throw new Error(`Blog cover exceeds ${MAX_DISPLAY_COVER_BYTES} bytes: ${relativePath} (${bytes})`);
}

/**
 * Function contract: removeHeavyweightProductionBlogPngs
 * Purpose: Remove obsolete multi-megabyte blog PNG artifacts after production HTML and social previews have been finalized.
 * Inputs: None; uses the configured production target and byte budget.
 * Side effects: Deletes matching legacy blog PNG files from `dist/assets` except generated `dist/assets/social` previews.
 * Returns: Number of legacy production PNG files removed.
 */
function removeHeavyweightProductionBlogPngs() {
  if (!useDist) return 0;
  const assetsRoot = path.join(TARGET, 'assets');
  let removed = 0;
  for (const filePath of walkFiles(assetsRoot)) {
    const relative = path.relative(TARGET, filePath).replaceAll(path.sep, '/');
    if (relative.startsWith('assets/social/')) continue;
    if (!/^blog-.+\.png$/i.test(path.basename(filePath))) continue;
    if (fs.statSync(filePath).size <= MAX_DISPLAY_COVER_BYTES) continue;
    fs.rmSync(filePath, { force: true });
    removed += 1;
  }
  return removed;
}

/**
 * Function contract: heavyweightProductionBlogPngs
 * Purpose: List any oversized non-social blog PNGs that survive production cleanup.
 * Inputs: None; uses the configured production target and byte budget.
 * Side effects: Reads final production asset metadata.
 * Returns: Array of relative production paths that still violate the legacy raster budget.
 */
function heavyweightProductionBlogPngs() {
  if (!useDist) return [];
  const assetsRoot = path.join(TARGET, 'assets');
  const offenders = [];
  for (const filePath of walkFiles(assetsRoot)) {
    const relative = path.relative(TARGET, filePath).replaceAll(path.sep, '/');
    if (relative.startsWith('assets/social/')) continue;
    if (!/^blog-.+\.png$/i.test(path.basename(filePath))) continue;
    if (fs.statSync(filePath).size > MAX_DISPLAY_COVER_BYTES) offenders.push(relative);
  }
  return offenders;
}

const files = [
  ...walkHtml(path.join(TARGET, 'blog')),
  ...fs.existsSync(TARGET)
    ? fs.readdirSync(TARGET)
      .filter((name) => /^blog-.+\.html$/.test(name))
      .map((name) => path.join(TARGET, name))
    : [],
];

if (!files.length) throw new Error(`No blog HTML files found in ${TARGET}`);
[...EXACT_COVERS.values(), ...TOPIC_COVERS].forEach(assertCoverAsset);

let changed = 0;
const failures = [];
for (const filePath of files) {
  if (path.basename(filePath) === 'index.html') continue;
  const original = fs.readFileSync(filePath, 'utf8');
  if (!/<article\b/i.test(original) && !/blog/i.test(filePath)) continue;

  const cover = pickCover(filePath, original);
  let html = replaceVisibleCover(original, cover);
  if (useDist) html = updateStructuredImages(html, socialImage(html));

  const remaining = visibleBlogPngs(html);
  if (remaining.length) failures.push(`${path.relative(TARGET, filePath)} still contains ${remaining.length} visible blog PNG reference(s)`);
  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    changed += 1;
  }
}

const removedLegacyPngs = removeHeavyweightProductionBlogPngs();
const remainingLegacyPngs = heavyweightProductionBlogPngs();
if (remainingLegacyPngs.length) {
  failures.push(`production still contains oversized legacy blog PNGs: ${remainingLegacyPngs.join(', ')}`);
}

if (failures.length) {
  throw new Error(`[blog-cover-performance] ${failures.length} failure(s)\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
}

console.log(`[blog-cover-performance] ${useDist ? 'Production' : 'Source'} blog covers verified; ${changed} file(s) normalized to lightweight SVG delivery; ${removedLegacyPngs} oversized legacy production PNG(s) removed.`);
