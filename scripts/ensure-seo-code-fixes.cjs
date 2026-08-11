/**
 * @fileoverview scripts/ensure-seo-code-fixes.cjs
 * Purpose: Apply the ensure seo code fixes production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - blog/transaction-review-ux-crypto-apps.html
 * - blog/web3-wallet-ux-checklist.html
 * - blog/website-ux-checklist-software-companies.html
 * - package.json
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SITE = 'https://nischhalsubba.com.np';

const htmlTargets = [
  'index.html',
  'home.html',
  'home-v2.html',
  'projects.html',
  'about.html',
  'contact.html',
  'blog.html',
  'blog/index.html',
  'product-design-nepal.html',
  'web3-ux-designer.html',
  'saas-ux-designer.html',
  'website-ux-design.html',
  'figma-design-systems.html',
  'ux-audit.html',
  'project-yarsha.html',
  'project-mokshya.html',
  'project-hamro-idea.html',
  'project-morajaa.html',
  'project-pihub.html',
  'project-masteriyo.html',
  'project-zapp.html',
  'project-neverwinter-parser.html',
  'project-orkest.html',
  'project-splashnode.html',
  'project-grid-labs.html',
  'project-zakra-furniture.html',
  'project-designerex.html',
  'project-sassboilerplate.html',
  'blog/blog-web3-products.html',
  'blog/blog-good-handoff.html',
  'blog/blog-portfolio-product.html',
  'blog/blog-service-websites.html',
  'blog/blog-gaming-interface-clarity.html',
  'blog/blog-design-systems-front-end.html',
  'blog/web3-wallet-ux-checklist.html',
  'blog/transaction-review-ux-crypto-apps.html',
  'blog/saas-dashboard-ux-checklist.html',
  'blog/website-ux-checklist-software-companies.html',
  'blog/ux-audit-checklist-before-redesign.html',
  'blog/figma-handoff-notes-for-developers.html',
  'blog/hire-product-designer-nepal-saas-web3.html',
  'media-kit.html',
  'public/nischhal-raj-subba.html',
  'public/services.html',
];

const cleanRouteMap = new Map([
  ['/index.html', '/'],
  ['/home.html', '/'],
  ['/home-v2.html', '/'],
  ['/blog.html', '/blog/'],
  ['/projects.html', '/projects'],
  ['/about.html', '/about'],
  ['/contact.html', '/contact'],
  ['/media-kit.html', '/media-kit'],
  ['/services.html', '/services'],
  ['/nischhal-raj-subba.html', '/nischhal-raj-subba'],
  ['/product-design-nepal.html', '/product-design-nepal'],
  ['/web3-ux-designer.html', '/web3-ux-designer'],
  ['/saas-ux-designer.html', '/saas-ux-designer'],
  ['/website-ux-design.html', '/website-ux-design'],
  ['/figma-design-systems.html', '/figma-design-systems'],
  ['/ux-audit.html', '/ux-audit'],
  ['/project-yarsha.html', '/project-yarsha'],
  ['/project-mokshya.html', '/project-mokshya'],
  ['/project-hamro-idea.html', '/project-hamro-idea'],
  ['/project-morajaa.html', '/project-morajaa'],
  ['/project-pihub.html', '/project-pihub'],
  ['/project-masteriyo.html', '/project-masteriyo'],
  ['/project-zapp.html', '/project-zapp'],
  ['/project-neverwinter-parser.html', '/project-neverwinter-parser'],
  ['/project-orkest.html', '/project-orkest'],
  ['/project-splashnode.html', '/project-splashnode'],
  ['/project-grid-labs.html', '/project-grid-labs'],
  ['/project-zakra-furniture.html', '/project-zakra-furniture'],
  ['/project-designerex.html', '/project-designerex'],
  ['/project-sassboilerplate.html', '/project-sassboilerplate'],
  ['/blog/blog-web3-products.html', '/blog/blog-web3-products'],
  ['/blog/blog-good-handoff.html', '/blog/blog-good-handoff'],
  ['/blog/blog-portfolio-product.html', '/blog/blog-portfolio-product'],
  ['/blog/blog-service-websites.html', '/blog/blog-service-websites'],
  ['/blog/blog-gaming-interface-clarity.html', '/blog/blog-gaming-interface-clarity'],
  ['/blog/blog-design-systems-front-end.html', '/blog/blog-design-systems-front-end'],
  ['/blog/web3-wallet-ux-checklist.html', '/blog/web3-wallet-ux-checklist'],
  ['/blog/transaction-review-ux-crypto-apps.html', '/blog/transaction-review-ux-crypto-apps'],
  ['/blog/saas-dashboard-ux-checklist.html', '/blog/saas-dashboard-ux-checklist'],
  ['/blog/website-ux-checklist-software-companies.html', '/blog/website-ux-checklist-software-companies'],
  ['/blog/ux-audit-checklist-before-redesign.html', '/blog/ux-audit-checklist-before-redesign'],
  ['/blog/figma-handoff-notes-for-developers.html', '/blog/figma-handoff-notes-for-developers'],
  ['/blog/hire-product-designer-nepal-saas-web3.html', '/blog/hire-product-designer-nepal-saas-web3'],
]);

const seoOverrides = {
  'index.html': {
    title: 'Product Designer in Nepal for Web3, SaaS & Fintech UX | Nischhal Raj Subba',
    description: 'Nischhal Raj Subba is a Product Designer in Nepal helping Web3, SaaS, fintech and software teams design clearer flows, polished UI, design systems and developer-ready handoff.',
    canonical: '/',
    type: 'website',
  },
  'blog/index.html': {
    title: 'UX Writing on Web3, SaaS Dashboards & Design Handoff | Nischhal Raj Subba',
    description: 'Practical product design articles on Web3 wallet UX, SaaS dashboard UX, fintech verification, website UX, Figma handoff, design systems and UX audits.',
    canonical: '/blog/',
    type: 'website',
  },
  'blog.html': {
    title: 'Product Design Writing | Nischhal Raj Subba',
    description: 'Legacy writing index for Nischhal Raj Subba. The canonical writing page is the product design blog at /blog/.',
    canonical: '/blog/',
    robots: 'noindex, follow, max-image-preview:large',
    type: 'website',
  },
  'home.html': {
    title: 'Nischhal Raj Subba | Product Designer in Nepal',
    description: 'Legacy homepage path for Nischhal Raj Subba. The canonical homepage is nischhalsubba.com.np.',
    canonical: '/',
    robots: 'noindex, follow, max-image-preview:large',
    type: 'website',
  },
  'home-v2.html': {
    title: 'Nischhal Raj Subba | Product Designer in Nepal',
    description: 'Legacy homepage experiment for Nischhal Raj Subba. The canonical homepage is nischhalsubba.com.np.',
    canonical: '/',
    robots: 'noindex, follow, max-image-preview:large',
    type: 'website',
  },
  'project-morajaa.html': {
    title: 'Morajaa B2B Consulting Website UX Case Study: Services & Lead Flow | Nischhal Raj Subba',
    description: 'Morajaa case study on B2B consulting website UX, including service pages, sector pages, inquiry paths, content hierarchy and premium responsive presentation.',
    canonical: '/project-morajaa',
    type: 'article',
  },
  'project-mokshya.html': {
    title: 'Mokshya Web3 Protocol Website UX Case Study: Storytelling & Trust | Nischhal Raj Subba',
    description: 'Mokshya case study on designing a clearer Web3 protocol website with product storytelling, technical explanation, trust signals and responsive page hierarchy.',
    canonical: '/project-mokshya',
    type: 'article',
  },
  'blog/saas-dashboard-ux-checklist.html': {
    title: 'SaaS Dashboard UX Checklist: Tables, States, Filters & Handoff | Nischhal Raj Subba',
    description: 'A practical SaaS dashboard UX checklist for B2B product teams covering tables, filters, role-based views, empty states, metrics, alerts and developer handoff.',
    canonical: '/blog/saas-dashboard-ux-checklist',
    type: 'article',
  },
  'blog/web3-wallet-ux-checklist.html': {
    title: 'Web3 Wallet UX Checklist: Signing, Permissions & Transaction Review | Nischhal Raj Subba',
    description: 'A Web3 wallet UX checklist for safer signing flows, permissions, transaction review, fee clarity, risk language, loading states and confirmation feedback.',
    canonical: '/blog/web3-wallet-ux-checklist',
    type: 'article',
  },
  'blog/figma-handoff-notes-for-developers.html': {
    title: 'Figma Handoff Notes for Developers: States, Responsive Rules & QA | Nischhal Raj Subba',
    description: 'A practical guide to developer-ready Figma handoff notes covering component states, responsive behavior, edge cases, accessibility checks, QA and implementation context.',
    canonical: '/blog/figma-handoff-notes-for-developers',
    type: 'article',
  },
  'public/nischhal-raj-subba.html': {
    title: 'Nischhal Raj Subba | Product Designer in Nepal for Web3, SaaS & Fintech UX',
    description: 'Official profile for Nischhal Raj Subba, a Product Designer in Nepal focused on Web3 UX, SaaS dashboards, fintech app workflows, website UX, design systems and handoff.',
    canonical: '/nischhal-raj-subba',
    type: 'profile',
  },
  'public/services.html': {
    title: 'Product Design Services for Web3, SaaS, UX Audits & Handoff | Nischhal Raj Subba',
    description: 'Product design services by Nischhal Raj Subba for Web3 UX, SaaS dashboards, fintech workflows, website UX, design systems, Figma handoff and UX audits.',
    canonical: '/services',
    type: 'website',
  },
};

/**
 * Function contract: escapeHtml
 * Purpose: Implement the escape html responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Function contract: absoluteUrl
 * Purpose: Implement the absolute url responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `canonical`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function absoluteUrl(canonical) {
  if (canonical === '/') return `${SITE}/`;
  return `${SITE}${canonical}`;
}

/**
 * Function contract: routeForFile
 * Purpose: Implements the route for file responsibility for this module.
 * Inputs: relativePath.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: routeForFile
 * Purpose: Implement the route for file responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `relativePath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function routeForFile(relativePath) {
  if (relativePath === 'index.html') return '/';
  if (relativePath === 'blog/index.html') return '/blog/';
  if (relativePath === 'blog.html') return '/blog/';
  if (relativePath === 'home.html' || relativePath === 'home-v2.html') return '/';

  const publicStripped = relativePath.startsWith('public/') ? relativePath.slice('public'.length) : `/${relativePath}`;
  const normalized = publicStripped.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return cleanRouteMap.get(publicStripped) || normalized;
}

/**
 * Function contract: upsertTitle
 * Purpose: Implements the upsert title responsibility for this module.
 * Inputs: html, title.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertTitle
 * Purpose: Implement the upsert title responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `html`: input consumed by this operation; `title`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function upsertTitle(html, title) {
  const tag = `<title>${escapeHtml(title)}</title>`;
  return /<title>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title>[\s\S]*?<\/title>/i, tag)
    : html.replace(/<head[^>]*>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing ensure seo code fixes repository tool operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => `${match}\n    ${tag}`);
}

/**
 * Function contract: upsertMetaName
 * Purpose: Implements the upsert meta name responsibility for this module.
 * Inputs: html, name, content.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertMetaName
 * Purpose: Implement the upsert meta name responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `html`: input consumed by this operation; `name`: stable identifier or label for the current item; `content`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function upsertMetaName(html, name, content) {
  const tag = `<meta name="${name}" content="${escapeHtml(content)}" />`;
  const regex = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i');
  return regex.test(html)
    ? html.replace(regex, tag)
    : html.replace(/<meta\s+name="viewport"[^>]*>/i, /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => `${match}\n    ${tag}`);
}

/**
 * Function contract: upsertMetaProperty
 * Purpose: Implements the upsert meta property responsibility for this module.
 * Inputs: html, property, content.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertMetaProperty
 * Purpose: Implement the upsert meta property responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `html`: input consumed by this operation; `property`: input consumed by this operation; `content`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function upsertMetaProperty(html, property, content) {
  const tag = `<meta property="${property}" content="${escapeHtml(content)}" />`;
  const regex = new RegExp(`<meta\\s+property=["']${property}["'][^>]*>`, 'i');
  return regex.test(html)
    ? html.replace(regex, tag)
    : html.replace(/<\/title>/i, /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => `${match}\n    ${tag}`);
}

/**
 * Function contract: upsertCanonical
 * Purpose: Implements the upsert canonical responsibility for this module.
 * Inputs: html, canonical.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: upsertCanonical
 * Purpose: Implement the upsert canonical responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `html`: input consumed by this operation; `canonical`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function upsertCanonical(html, canonical) {
  const tag = `<link rel="canonical" href="${absoluteUrl(canonical)}" />`;
  return /<link\s+rel="canonical"[^>]*>/i.test(html)
    ? html.replace(/<link\s+rel="canonical"[^>]*>/i, tag)
    : html.replace(/<\/title>/i, /** Callback contract: Processes the callback step for html without leaking orchestration details to the caller. Inputs: match. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Perform the local callback step required by the enclosing ensure seo code fixes repository tool operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Perform the local callback step required by the immediately enclosing operation. Inputs: `match`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (match) => `${match}\n    ${tag}`);
}

/**
 * Function contract: stripMetaKeywords
 * Purpose: Implements the strip meta keywords responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: stripMetaKeywords
 * Purpose: Remove meta keywords without disturbing required surrounding ensure seo code fixes repository tool state.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function stripMetaKeywords(html) {
  return html.replace(/\s*<meta\s+name=["']keywords["'][^>]*>/gi, '');
}

/**
 * Function contract: rewriteCleanUrls
 * Purpose: Implements the rewrite clean urls responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: rewriteCleanUrls
 * Purpose: Implement the rewrite clean urls responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function rewriteCleanUrls(html) {
  let output = html;
  for (const [from, to] of cleanRouteMap.entries()) {
    output = output
      .replaceAll(`${SITE}${from}`, `${SITE}${to}`)
      .replaceAll(`href="${from}"`, `href="${to}"`)
      .replaceAll(`href='${from}'`, `href='${to}'`)
      .replaceAll(`url": "${SITE}${from}"`, `url": "${SITE}${to}"`)
      .replaceAll(`item": "${SITE}${from}"`, `item": "${SITE}${to}"`)
      .replaceAll(`mainEntityOfPage": "${SITE}${from}"`, `mainEntityOfPage": "${SITE}${to}"`);
  }
  return output;
}

/**
 * Function contract: ensureServicesNav
 * Purpose: Applies ensure services nav while preserving the surrounding repository/runtime contract.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: ensureServicesNav
 * Purpose: Apply services nav consistently while preserving the surrounding ensure seo code fixes repository tool contract.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function ensureServicesNav(html) {
  let output = html;

  output = output.replace(
    /<a href="\/projects(?:\.html)?" class="nav-link([^"/]*)">Work<\/a><a href="\/about(?:\.html)?"/g,
    '<a href="/projects" class="nav-link$1">Work</a><a href="/services" class="nav-link">Services</a><a href="/about"'
  );

  output = output.replace(
    /<a href="\/projects(?:\.html)?"([^>]*)>Work<\/a><a href="\/about(?:\.html)?"/g,
    '<a href="/projects"$1>Work</a><a href="/services">Services</a><a href="/about"'
  );

  output = output.replace(
    /<h5>Pages<\/h5><a href="\/">Home<\/a><a href="\/projects(?:\.html)?">Work<\/a><a href="\/about(?:\.html)?">About<\/a>/g,
    '<h5>Pages</h5><a href="/">Home</a><a href="/projects">Work</a><a href="/services">Services</a><a href="/about">About</a>'
  );

  return output;
}

/**
 * Function contract: addHomepageServiceBlock
 * Purpose: Implements the add homepage service block responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: addHomepageServiceBlock
 * Purpose: Implement the add homepage service block responsibility owned by the ensure seo code fixes repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function addHomepageServiceBlock(html) {
  if (!html.includes('nrs-home-services')) {
    const block = `
      <section class="section-container reveal-on-scroll nrs-home-services" style="border-top:1px solid var(--border-faint);">
        <div class="section-header"><p class="eyebrow">Services</p><h2 class="section-title">The pages Google and humans both need.</h2><p class="section-lead">Focused service paths for Web3 UX, SaaS dashboards, fintech flows, website UX, Figma systems, audits, and implementation-ready handoff.</p></div>
        <div class="impact-summary-grid">
          <a class="impact-card" href="/web3-ux-designer"><span class="eyebrow">Web3 UX</span><h3>Wallet and transaction clarity</h3><p>Signing context, permissions, transaction review, loading, failure, and trust states.</p></a>
          <a class="impact-card" href="/saas-ux-designer"><span class="eyebrow">SaaS UX</span><h3>Dashboards and workflows</h3><p>Tables, filters, role-based views, empty states, admin flows, and practical handoff.</p></a>
          <a class="impact-card" href="/services"><span class="eyebrow">All services</span><h3>Pick the right design support</h3><p>Compare product design, UX audit, website UX, design systems, and handoff support.</p></a>
        </div>
      </section>`;
    return html.replace(/(<section class="section-container reveal-on-scroll" style="border-top:1px solid var\(--border-faint\);border-bottom:1px solid var\(--border-faint\);">[\s\S]*?<\/section>)/, `$1${block}`);
  }
  return html;
}

/**
 * Function contract: applySeoOverride
 * Purpose: Applies apply seo override while preserving the surrounding repository/runtime contract.
 * Inputs: html, config.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: applySeoOverride
 * Purpose: Apply seo override consistently while preserving the surrounding ensure seo code fixes repository tool contract.
 * Inputs: `html`: input consumed by this operation; `config`: configuration values controlling this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function applySeoOverride(html, config) {
  let output = html;
  output = upsertTitle(output, config.title);
  output = upsertMetaName(output, 'description', config.description);
  output = upsertMetaName(output, 'robots', config.robots || 'index, follow, max-image-preview:large');
  output = upsertCanonical(output, config.canonical);
  output = upsertMetaProperty(output, 'og:title', config.title);
  output = upsertMetaProperty(output, 'og:description', config.description);
  output = upsertMetaProperty(output, 'og:url', absoluteUrl(config.canonical));
  if (config.type) output = upsertMetaProperty(output, 'og:type', config.type);
  output = upsertMetaName(output, 'twitter:title', config.title);
  output = upsertMetaName(output, 'twitter:description', config.description);
  return output;
}

/**
 * Function contract: applyGenericCleanCanonical
 * Purpose: Applies apply generic clean canonical while preserving the surrounding repository/runtime contract.
 * Inputs: html, relativePath.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: applyGenericCleanCanonical
 * Purpose: Apply generic clean canonical consistently while preserving the surrounding ensure seo code fixes repository tool contract.
 * Inputs: `html`: input consumed by this operation; `relativePath`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function applyGenericCleanCanonical(html, relativePath) {
  const cleanRoute = routeForFile(relativePath);
  let output = upsertCanonical(html, cleanRoute);
  output = upsertMetaProperty(output, 'og:url', absoluteUrl(cleanRoute));
  return output;
}

let touched = 0;

for (const relativePath of htmlTargets) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) continue;

  const before = fs.readFileSync(filePath, 'utf8');
  let after = stripMetaKeywords(before);
  after = rewriteCleanUrls(after);
  after = ensureServicesNav(after);
  if (relativePath === 'index.html') after = addHomepageServiceBlock(after);
  after = applyGenericCleanCanonical(after, relativePath);
  if (seoOverrides[relativePath]) after = applySeoOverride(after, seoOverrides[relativePath]);
  after = rewriteCleanUrls(after);

  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
    touched += 1;
  }
}

console.log(`Applied durable SEO code fixes with clean canonical URLs to ${touched} HTML source files.`);
