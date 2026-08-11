/**
 * @fileoverview scripts/ensure-blog-generated-covers.cjs
 * Purpose: Generate or assemble ensure blog generated covers deterministically as part of the production toolchain.
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

const ROOT = process.cwd();
const SITE_URL = 'https://nischhalsubba.com.np';

const COVER_BY_TOPIC = [
  {
    match: /saas|dashboard|empty-state|empty-states|enterprise|metric|data-dense/i,
    src: '/assets/images/blog-saas-empty-states-cover.png',
    alt: 'Generated product design cover showing SaaS dashboard empty states and product clarity artifacts',
  },
  {
    match: /handoff|figma|design-system|design-systems|front-end|developer/i,
    src: '/assets/images/blog-design-systems-handoff-cover.png',
    alt: 'Generated product design cover showing design system components, handoff notes, and interface states',
  },
  {
    match: /web3|wallet|crypto|transaction|governance/i,
    src: '/assets/images/blog-web3-wallet-ux-cover.png',
    alt: 'Generated product design cover showing Web3 wallet review, permissions, and trust-focused interface states',
  },
  {
    match: /audit|accessibility|research|redesign|emerging/i,
    src: '/assets/images/blog-ux-audit-research-cover.png',
    alt: 'Generated product design cover showing UX audit boards, research notes, and prioritization artifacts',
  },
  {
    match: /service|website|pricing|plans|software-companies|business/i,
    src: '/assets/images/blog-service-pricing-ux-cover.png',
    alt: 'Generated product design cover showing service website structure, pricing panels, and conversion paths',
  },
];

const DEFAULT_COVER = COVER_BY_TOPIC[1];

/**
 * Function contract: walk
 * Purpose: Implement the walk responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `dir`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Array containing the values selected or transformed by this function.
 */
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(/** Callback contract: Perform the local callback step required by the enclosing ensure blog generated covers repository tool operation. Inputs: `entry`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation. */ (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
  });
}

/**
 * Function contract: pageKey
 * Purpose: Implement the page key responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `filePath`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function pageKey(filePath, html) {
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1] || '';
  const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/is)?.[1] || '';
  return `${filePath} ${title} ${h1}`.replace(/<[^>]*>/g, ' ');
}

/**
 * Function contract: pickCover
 * Purpose: Implements the pick cover responsibility for this module.
 * Inputs: filePath, html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: pickCover
 * Purpose: Implement the pick cover responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `filePath`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function pickCover(filePath, html) {
  const key = pageKey(filePath, html);
  return COVER_BY_TOPIC.find(/** Callback contract: Processes the callback step for cover by topic without leaking orchestration details to the caller. Inputs: cover. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `cover`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (cover) => cover.match.test(key)) || DEFAULT_COVER;
}

/**
 * Function contract: absolute
 * Purpose: Implements the absolute responsibility for this module.
 * Inputs: src.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: absolute
 * Purpose: Implement the absolute responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `src`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function absolute(src) {
  return `${SITE_URL}${src}`;
}

/**
 * Function contract: upsertMeta
 * Purpose: Implements the upsert meta responsibility for this module.
 * Inputs: html, selector, attrs.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertMeta
 * Purpose: Implement the upsert meta responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `html`: input consumed by this operation; `selector`: input consumed by this operation; `attrs`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function upsertMeta(html, selector, attrs) {
  const attrText = Object.entries(attrs).map(/** Callback contract: Processes the callback step for object.entries(attrs) without leaking orchestration details to the caller. Inputs: [key, value]. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `[key, value]`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ ([key, value]) => `${key}="${value}"`).join(' ');
  const tag = `<meta ${attrText}>`;
  const regex = selector === 'og:image'
    ? /<meta[^>]+property=["']og:image["'][^>]*>/i
    : /<meta[^>]+name=["']twitter:image["'][^>]*>/i;

  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace(/<\/head>/i, `${tag}</head>`);
}

/**
 * Function contract: updateJsonLdImages
 * Purpose: Applies update json ld images while preserving the surrounding repository/runtime contract.
 * Inputs: html, cover.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: updateJsonLdImages
 * Purpose: Apply json ld images consistently while preserving the surrounding ensure blog generated covers repository tool contract.
 * Inputs: `html`: input consumed by this operation; `cover`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function updateJsonLdImages(html, cover) {
  return html.replace(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match, rawJson. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing ensure blog generated covers repository tool operation. Inputs: `match`, `rawJson`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation. */ (match, rawJson) => {
    try {
      const data = JSON.parse(rawJson.trim());
      /**
       * Function contract: setImage
       * Purpose: Applies set image while preserving the surrounding repository/runtime contract.
       * Inputs: node.
       * Side effects: no obvious external side effect beyond invoked dependencies.
       * Returns: no explicit value unless an invoked dependency throws/rejects.
       */
      /**
       * Function contract: setImage
       * Purpose: Synchronize image with the requested state while preserving related ensure blog generated covers repository tool invariants.
       * Inputs: `node`: input consumed by this operation
       * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
       * Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects.
       */
      const setImage = (node) => {
        if (node && typeof node === 'object') {
          if (['Article', 'BlogPosting'].includes(node['@type']) || node.headline) {
            node.image = absolute(cover.src);
          }
          Object.values(node).forEach(/** Callback contract: Processes the callback step for object.values(node) without leaking orchestration details to the caller. Inputs: value. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Apply the enclosing side-effect operation to the current collection item. Inputs: `value`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (value) => {
            if (Array.isArray(value)) value.forEach(setImage);
            else setImage(value);
          });
        }
      };
      setImage(data);
      return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
    } catch {
      return match;
    }
  });
}

/**
 * Function contract: replaceExistingCover
 * Purpose: Implements the replace existing cover responsibility for this module.
 * Inputs: html, cover.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: replaceExistingCover
 * Purpose: Implement the replace existing cover responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `html`: input consumed by this operation; `cover`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function replaceExistingCover(html, cover) {
  const imgRegex = /<img\b([^>]*?)\bsrc=["']([^"']*(?:unsplash|blog-[^"']+\.(?:svg|png))[^"']*)["']([^>]*)>/i;
  if (!imgRegex.test(html)) return html;

  return html.replace(imgRegex, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match, before, _src, after. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing ensure blog generated covers repository tool operation. Inputs: `match`, `before`, `_src`, `after`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation. */ (match, before, _src, after) => {
    let next = match
      .replace(/\bsrc=["'][^"']+["']/i, `src="${cover.src}"`)
      .replace(/\balt=["'][^"']*["']/i, `alt="${cover.alt}"`);

    if (!/\balt=/i.test(next)) next = next.replace('<img ', `<img alt="${cover.alt}" `);
    if (!/\bclass=/i.test(next)) next = next.replace('<img ', '<img class="nrs-blog-cover-img" ');
    if (!/\bloading=/i.test(next)) next = next.replace('<img ', '<img loading="eager" ');
    if (!/\bdecoding=/i.test(next)) next = next.replace('<img ', '<img decoding="async" ');
    if (!/\bwidth=/i.test(next)) next = next.replace('<img ', '<img width="1600" ');
    if (!/\bheight=/i.test(next)) next = next.replace('<img ', '<img height="900" ');
    return next;
  });
}

/**
 * Function contract: insertCover
 * Purpose: Implements the insert cover responsibility for this module.
 * Inputs: html, cover.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: insertCover
 * Purpose: Implement the insert cover responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `html`: input consumed by this operation; `cover`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function insertCover(html, cover) {
  if (/<img\b[^>]+src=["'][^"']*blog-[^"']+\.(?:png|svg)["']/i.test(html)) return html;

  const figure = `<figure class="nrs-blog-cover"><img class="nrs-blog-cover-img" src="${cover.src}" alt="${cover.alt}" width="1600" height="900" loading="eager" decoding="async"></figure>`;

  if (/<p class=["']body-large["'][^>]*>[\s\S]*?<\/p>/i.test(html)) {
    return html.replace(/(<p class=["']body-large["'][^>]*>[\s\S]*?<\/p>)/i, `$1${figure}`);
  }

  if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i, `$1${figure}`);
  }

  return html;
}

/**
 * Function contract: processFile
 * Purpose: Implements the process file responsibility for this module.
 * Inputs: filePath.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: processFile
 * Purpose: Implement the process file responsibility owned by the ensure blog generated covers repository tool.
 * Inputs: `filePath`: input consumed by this operation
 * Side effects: writes repository/filesystem state.
 * Returns: Boolean predicate result consumed by the caller.
 */
function processFile(filePath) {
  if (path.basename(filePath) === 'index.html') return false;

  const original = fs.readFileSync(filePath, 'utf8');
  if (!/<article\b/i.test(original) && !/blog/i.test(filePath)) return false;

  const cover = pickCover(filePath, original);
  let html = original;
  html = upsertMeta(html, 'og:image', { property: 'og:image', content: absolute(cover.src) });
  html = upsertMeta(html, 'twitter:image', { name: 'twitter:image', content: absolute(cover.src) });
  html = updateJsonLdImages(html, cover);
  html = replaceExistingCover(html, cover);
  html = insertCover(html, cover);

  if (html === original) return false;
  fs.writeFileSync(filePath, html);
  return true;
}

const files = [
  ...walk(path.join(ROOT, 'blog')),
  ...walk(path.join(ROOT, 'public', 'blog')),
  ...fs.readdirSync(ROOT)
    .filter(/** Callback contract: Processes the callback step for fs.readdir sync(root) without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Decide whether the current item should remain in the filtered result used by the enclosing operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (name) => /^blog-.+\.html$/.test(name))
    .map(/** Callback contract: Processes the callback step for fs.readdir sync(root)
    .filter((name) => /^blog .+\.html$/.test(name)) without leaking orchestration details to the caller. Inputs: name. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `name`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (name) => path.join(ROOT, name)),
];

let changed = 0;
for (const file of files) {
  if (processFile(file)) changed += 1;
}

const tempPost = path.join(ROOT, 'blog', 'test-empty-state-temp.html');
if (fs.existsSync(tempPost)) {
  fs.unlinkSync(tempPost);
  changed += 1;
}

console.log(`Ensured generated blog covers on ${changed} file(s).`);
