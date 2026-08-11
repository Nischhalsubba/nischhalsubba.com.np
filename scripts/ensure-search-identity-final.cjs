/**
 * @fileoverview scripts/ensure-search-identity-final.cjs
 * Purpose: Apply the ensure search identity final production transformation or maintenance step while preserving canonical source/build contracts.
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
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const site = 'https://nischhalsubba.com.np';

const meta = {
  '/': {
    title: 'Nischhal Raj Subba | Senior Product Designer',
    description: 'Senior product designer based in Kathmandu, working across SaaS, Web3, fintech and complex software. I design workflows, interfaces, design systems and implementation-ready product experiences.',
  },
  '/projects': {
    title: 'Product Design Case Studies | Nischhal Raj Subba',
    description: 'Case studies from SaaS, Web3, fintech, LMS and software products, showing the product problem, my role, key design decisions, interface evidence and what shipped.',
  },
  '/services': {
    title: 'Product Design Services | Nischhal Raj Subba',
    description: 'Product design support for SaaS, Web3, fintech and software teams: workflow design, interface systems, UX audits, design systems, prototyping and developer-ready handoff.',
  },
  '/about': {
    title: 'About Nischhal Raj Subba | Senior Product Designer',
    description: 'I’m a product designer based in Kathmandu with 6+ years across product teams, agencies and front-end collaboration. Read about my experience, approach and working style.',
  },
  '/contact': {
    title: 'Contact Nischhal Raj Subba | Product Design',
    description: 'Contact me about senior product design roles or focused product work. Share the product context, current friction, timeline and any useful links.',
  },
  '/privacy': {
    title: 'Privacy | Nischhal Raj Subba',
    description: 'Plain-language privacy information for this portfolio, including contact-form data, limited site measurement, external links and deletion requests.',
  },
  '/blog/': {
    title: 'Product Design Notes | Nischhal Raj Subba',
    description: 'Practical notes from product design work on SaaS dashboards, Web3 UX, design systems, UX audits, responsive behavior, interface states and developer handoff.',
  },
  '/product-design-nepal': {
    title: 'Product Designer in Nepal for Software Teams | Nischhal Raj Subba',
    description: 'Product design support from Kathmandu for software teams in Nepal and remote teams that need clearer workflows, stronger interfaces, practical systems and build-ready handoff.',
  },
  '/web3-ux-designer': {
    title: 'Web3 Product Design for Wallets & Transactions | Nischhal Raj Subba',
    description: 'Web3 product design for wallet actions, signing, transaction review, pending and failure states, and technical concepts that need to feel understandable and trustworthy.',
  },
  '/saas-ux-designer': {
    title: 'SaaS Product Design for Complex Workflows | Nischhal Raj Subba',
    description: 'Product design for SaaS teams working through dashboards, role-based workflows, tables, filters, permissions, operational states and reusable interface systems.',
  },
  '/website-ux-design': {
    title: 'Website UX Design for Software & Service Teams | Nischhal Raj Subba',
    description: 'Website UX and interface design for software and service teams that need clearer positioning, information architecture, proof, responsive behavior and conversion paths.',
  },
  '/figma-design-systems': {
    title: 'Figma Design Systems for Product Teams | Nischhal Raj Subba',
    description: 'Practical Figma design systems for product teams: reusable components, states, tokens, responsive rules and documentation that stays useful during implementation.',
  },
  '/ux-audit': {
    title: 'UX Audits for Software Products | Nischhal Raj Subba',
    description: 'Evidence-led UX audits for software products, focused on task friction, missing states, accessibility, responsive behavior and changes worth prioritizing before redesign.',
  },
};

/**
 * Function contract: routeFor
 * Purpose: Implement the route for responsibility owned by the ensure search identity final repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function routeFor(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog/';
  return `/${file.replace(/\.html$/i, '')}`;
}

/**
 * Function contract: esc
 * Purpose: Implements the esc responsibility for this module.
 * Inputs: value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure search identity final repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function esc(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Function contract: setTitle
 * Purpose: Applies set title while preserving the surrounding repository/runtime contract.
 * Inputs: html, value.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: setTitle
 * Purpose: Synchronize title with the requested state while preserving related ensure search identity final repository tool invariants.
 * Inputs: `html`: input consumed by this operation; `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function setTitle(html, value) {
  const tag = `<title>${esc(value)}</title>`;
  return /<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, tag)
    : html.replace('</head>', `  ${tag}\n</head>`);
}

/**
 * Function contract: setMeta
 * Purpose: Applies set meta while preserving the surrounding repository/runtime contract.
 * Inputs: html, key, value, keyAttribute.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: setMeta
 * Purpose: Synchronize meta with the requested state while preserving related ensure search identity final repository tool invariants.
 * Inputs: `html`: input consumed by this operation; `key`: input consumed by this operation; `value`: input value being transformed or evaluated; `keyAttribute`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function setMeta(html, key, value, keyAttribute = 'name') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${keyAttribute}=["']${escapedKey}["'])[^>]*>`, 'i');
  const tag = `<meta ${keyAttribute}="${key}" content="${esc(value)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

/**
 * Function contract: removeMeta
 * Purpose: Removes or cleans remove meta while keeping required outputs intact.
 * Inputs: html, key, keyAttribute.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: removeMeta
 * Purpose: Remove meta without disturbing required surrounding ensure search identity final repository tool state.
 * Inputs: `html`: input consumed by this operation; `key`: input consumed by this operation; `keyAttribute`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function removeMeta(html, key, keyAttribute = 'name') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`\\s*<meta\\b(?=[^>]*\\b${keyAttribute}=["']${escapedKey}["'])[^>]*>`, 'gi'), '');
}

/**
 * Function contract: patchStructuredData
 * Purpose: Implement the patch structured data responsibility owned by the ensure search identity final repository tool.
 * Inputs: `html`: input consumed by this operation; `route`: input consumed by this operation; `pageMeta`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function patchStructuredData(html, route, pageMeta) {
  return html.replace(/<script\b([^>]*)type=["']application\/ld\+json["']([^>]*)>([\s\S]*?)<\/script>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: whole, before, after, raw. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Perform the local callback step required by the enclosing ensure search identity final repository tool operation. Inputs: `whole`, `before`, `after`, `raw`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `whole`, `before`, `after`, `raw`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed value consumed by the enclosing operation. */ (whole, before, after, raw) => {
    try {
      const data = JSON.parse(raw.trim());
      const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
      for (const node of graph) {
        const type = node?.['@type'];
        if (type === 'WebSite') {
          node.name = 'Nischhal Raj Subba';
          node.alternateName = ['Nischhal', 'nischhalsubba.com.np'];
          node.url = `${site}/`;
        }
        if (type === 'Person') {
          node.name = 'Nischhal Raj Subba';
          node.jobTitle = 'Senior Product Designer';
          node.description = 'Senior product designer based in Kathmandu, Nepal, working across SaaS, Web3, fintech and complex software products.';
          node.url = `${site}/`;
          node.image = `${site}/assets/images/portrait.png`;
        }
        if (route === '/' && type === 'ProfilePage') {
          node.name = pageMeta.title;
          node.description = pageMeta.description;
          node.url = `${site}/`;
        }
      }
      const next = Array.isArray(data['@graph']) ? { ...data, '@graph': graph } : graph[0];
      return `<script${before}type="application/ld+json"${after}>${JSON.stringify(next)}</script>`;
    } catch {
      return whole;
    }
  });
}

/**
 * Function contract: patchIdentityHead
 * Purpose: Implements the patch identity head responsibility for this module.
 * Inputs: html.
 * Side effects: may read or update browser DOM/state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: patchIdentityHead
 * Purpose: Implement the patch identity head responsibility owned by the ensure search identity final repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: reads or updates DOM/browser state.
 * Returns: Boolean predicate result consumed by the caller.
 */
function patchIdentityHead(html) {
  html = html
    .replace(/\s*<link\b[^>]*rel=["'](?:shortcut\s+icon|icon|apple-touch-icon|apple-touch-icon-precomposed|mask-icon|manifest)["'][^>]*>/gi, '')
    .replace(/\s*<meta\b[^>]*name=["'](?:theme-color|color-scheme|msapplication-TileColor)["'][^>]*>/gi, '')
    .replace(/\s*<script\b[^>]*id=["']nrs-theme-chrome-sync["'][^>]*>[\s\S]*?<\/script>/gi, '');

  const block = [
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
    '<link rel="icon" href="/favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />',
    '<link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />',
    '<link rel="mask-icon" href="/favicon.svg" color="#ff4d00" />',
    '<link rel="manifest" href="/site.webmanifest" />',
    '<meta name="color-scheme" content="light dark" />',
    '<meta name="theme-color" id="nrs-theme-color" content="#11110f" />',
    '<meta name="msapplication-TileColor" content="#11110f" />',
    '<script id="nrs-theme-chrome-sync">(function(){var root=document.documentElement;var meta=document.getElementById("nrs-theme-color");function sync(){var theme=root.getAttribute("data-theme")||((window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches)?"light":"dark");if(meta)meta.setAttribute("content",theme==="light"?"#f2efe7":"#11110f");}sync();new MutationObserver(sync).observe(root,{attributes:true,attributeFilter:["data-theme"]});})();</script>',
  ].join('\n  ');

  return html.replace('</head>', `  ${block}\n</head>`);
}

const failures = [];
let updated = 0;

for (const file of manifest.html) {
  const route = routeFor(file);
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) {
    failures.push(`${file}: missing`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const pageMeta = meta[route];

  if (pageMeta) {
    html = setTitle(html, pageMeta.title);
    html = setMeta(html, 'description', pageMeta.description);
    html = setMeta(html, 'og:title', pageMeta.title, 'property');
    html = setMeta(html, 'og:description', pageMeta.description, 'property');
    html = setMeta(html, 'twitter:title', pageMeta.title);
    html = setMeta(html, 'twitter:description', pageMeta.description);
  }

  html = removeMeta(html, 'keywords');
  html = removeMeta(html, 'nrs-search-intent');
  html = setMeta(html, 'og:site_name', 'Nischhal Raj Subba', 'property');
  html = patchStructuredData(html, route, pageMeta || { title: '', description: '' });
  html = patchIdentityHead(html);

  if (/nrs-search-intent|name=["']keywords["']/i.test(html)) failures.push(`${file}: search-engine-first metadata survived`);
  if (!/href=["']\/favicon\.svg["']/i.test(html)) failures.push(`${file}: stable favicon missing`);
  if (!/href=["']\/site\.webmanifest["']/i.test(html)) failures.push(`${file}: manifest missing`);
  if (!/name=["']theme-color["']/i.test(html)) failures.push(`${file}: theme color missing`);

  fs.writeFileSync(filePath, html, 'utf8');
  updated += 1;
}

if (failures.length) throw new Error(`[search-identity-final] ${failures.join('; ')}`);
console.log(`[search-identity-final] Applied stable favicons, theme chrome and human search identity to ${updated} route(s).`);
