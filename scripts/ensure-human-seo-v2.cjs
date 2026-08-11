/**
 * @fileoverview scripts/ensure-human-seo-v2.cjs
 * Purpose: Apply the ensure human seo v2 production transformation or maintenance step while preserving canonical source/build contracts.
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
const site = 'https://nischhalsubba.com.np';
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'config', 'canonical-routes.json'), 'utf8'));
const portrait = `${site}/assets/images/portrait.png`;
const personId = `${site}/#nischhal-raj-subba`;
const websiteId = `${site}/#website`;

const coreMeta = {
  '/': ['Nischhal Raj Subba | Senior Product Designer', 'Product designer based in Kathmandu. I work on complex SaaS, Web3, fintech and software products, from product structure and interface design to design systems and handoff.'],
  '/projects': ['Product Design Case Studies | Nischhal Raj Subba', 'Selected case studies showing the product problems, constraints, design decisions and evidence behind my work across SaaS, Web3, fintech and software.'],
  '/services': ['Product Design Services | Nischhal Raj Subba', 'Product design support for teams that need clearer workflows, stronger interfaces, practical design systems, UX audits or better design-to-engineering handoff.'],
  '/about': ['About Nischhal Raj Subba | Product Designer', 'I am a product designer based in Kathmandu with 6+ years across product teams, agencies and front-end collaboration. Read about my experience, approach and working style.'],
  '/contact': ['Contact Nischhal Raj Subba', 'Get in touch about senior product design roles or focused product work. Share the product, current friction, timeline and any useful links.'],
  '/privacy': ['Privacy | Nischhal Raj Subba', 'A plain-language explanation of what this portfolio collects through the contact form, how limited site measurement is used and how to request deletion.'],
  '/blog/': ['Product Design Notes | Nischhal Raj Subba', 'Notes from product design work: complex workflows, SaaS dashboards, Web3 UX, design systems, audits, responsive behavior and handoff.'],
  '/product-design-nepal': ['Product Design for Software Teams in Nepal | Nischhal Raj Subba', 'Product design support for software teams in Nepal and remote teams that need clearer product structure, polished interfaces and implementation-ready handoff.'],
  '/web3-ux-designer': ['Web3 Product Design for Wallets & Transactions | Nischhal Raj Subba', 'Product design for Web3 products where wallet actions, signing, transaction states and technical concepts need to feel understandable and trustworthy.'],
  '/saas-ux-designer': ['SaaS Product Design for Complex Workflows | Nischhal Raj Subba', 'Product design for SaaS teams working through dashboards, role-based workflows, tables, filters, permissions, states and reusable interface systems.'],
  '/website-ux-design': ['Website UX Design for Software & Service Teams | Nischhal Raj Subba', 'Website UX and interface design for software and service teams that need clearer positioning, information architecture, proof and responsive conversion paths.'],
  '/figma-design-systems': ['Figma Design Systems for Product Teams | Nischhal Raj Subba', 'Practical Figma design systems for product teams: reusable components, states, tokens, responsive rules and documentation engineers can actually work from.'],
  '/ux-audit': ['UX Audits for Software Products | Nischhal Raj Subba', 'Evidence-led UX audits for software products, focused on task friction, missing states, accessibility, responsive behavior and changes worth prioritizing.'],
};

const projectMeta = {
  '/project-yarsha': ['Yarsha: Web3 Messaging & Wallet UX | Nischhal Raj Subba'],
  '/project-mokshya': ['Mokshya.io: Web3 Protocol Website | Nischhal Raj Subba'],
  '/project-pihub': ['piHub: Fintech Product UX | Nischhal Raj Subba'],
  '/project-orkest': ['Orkest HQ: Modular SaaS Product Design | Nischhal Raj Subba'],
  '/project-neverwinter-parser': ['Neverwinter Live Parser: Data Product Case Study | Nischhal Raj Subba'],
  '/project-masteriyo': ['Masteriyo: LMS Product Design | Nischhal Raj Subba'],
  '/project-zapp': ['Zapp Today: Logistics Product Design | Nischhal Raj Subba'],
  '/project-designerex': ['Designerex: Fashion Marketplace UX | Nischhal Raj Subba'],
  '/project-hamro-idea': ['Hamro Idea: Software Studio Website | Nischhal Raj Subba'],
  '/project-morajaa': ['Morajaa: B2B Consulting Website UX | Nischhal Raj Subba'],
  '/project-splashnode': ['Splashnode: Technical Platform Website | Nischhal Raj Subba'],
  '/project-grid-labs': ['Grid Labs: Hosting Website Design | Nischhal Raj Subba'],
  '/project-zakra-furniture': ['Zakra Furniture: Ecommerce Template UX | Nischhal Raj Subba'],
  '/project-sassboilerplate': ['SassBoilerplate: Front-End Starter System | Nischhal Raj Subba'],
};

const proofRoute = {
  '/projects': '/project-yarsha',
  '/services': '/project-orkest',
  '/product-design-nepal': '/project-pihub',
  '/web3-ux-designer': '/project-yarsha',
  '/saas-ux-designer': '/project-orkest',
  '/website-ux-design': '/project-hamro-idea',
  '/figma-design-systems': '/project-masteriyo',
  '/ux-audit': '/project-pihub',
};

const serviceRoutes = new Set(['/product-design-nepal', '/web3-ux-designer', '/saas-ux-designer', '/website-ux-design', '/figma-design-systems', '/ux-audit']);

/**
 * Function contract: routeFor
 * Purpose: Implements the route for responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: routeFor
 * Purpose: Implement the route for responsibility owned by the ensure human seo v2 repository tool.
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
 * Function contract: fileFor
 * Purpose: Implements the file for responsibility for this module.
 * Inputs: route.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: fileFor
 * Purpose: Implement the file for responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `route`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function fileFor(route) {
  if (route === '/') return path.join(base, 'index.html');
  if (route === '/blog/') return path.join(base, 'blog', 'index.html');
  return path.join(base, `${route.replace(/^\//, '')}.html`);
}

/**
 * Function contract: esc
 * Purpose: Implement the esc responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function esc(value = '') {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

/**
 * Function contract: strip
 * Purpose: Remove module behavior without disturbing required surrounding ensure human seo v2 repository tool state.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function strip(value = '') {
  return String(value)
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Function contract: attribute
 * Purpose: Implement the attribute responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `tag`: input consumed by this operation; `name`: stable identifier or label for the current item
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}

/**
 * Function contract: metaValue
 * Purpose: Implements the meta value responsibility for this module.
 * Inputs: html, key, keyAttribute.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: metaValue
 * Purpose: Implement the meta value responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `html`: input consumed by this operation; `key`: input consumed by this operation; `keyAttribute`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function metaValue(html, key, keyAttribute = 'name') {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (attribute(tag, keyAttribute).toLowerCase() === key.toLowerCase()) return attribute(tag, 'content');
  }
  return '';
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
 * Purpose: Synchronize meta with the requested state while preserving related ensure human seo v2 repository tool invariants.
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
 * Purpose: Remove meta without disturbing required surrounding ensure human seo v2 repository tool state.
 * Inputs: `html`: input consumed by this operation; `key`: input consumed by this operation; `keyAttribute`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function removeMeta(html, key, keyAttribute = 'name') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(new RegExp(`\\s*<meta\\b(?=[^>]*\\b${keyAttribute}=["']${escapedKey}["'])[^>]*>`, 'gi'), '');
}

/**
 * Function contract: setTitle
 * Purpose: Synchronize title with the requested state while preserving related ensure human seo v2 repository tool invariants.
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
 * Function contract: setCanonical
 * Purpose: Applies set canonical while preserving the surrounding repository/runtime contract.
 * Inputs: html, canonical.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: setCanonical
 * Purpose: Synchronize canonical with the requested state while preserving related ensure human seo v2 repository tool invariants.
 * Inputs: `html`: input consumed by this operation; `canonical`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function setCanonical(html, canonical) {
  const tag = `<link rel="canonical" href="${esc(canonical)}" />`;
  return /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i.test(html)
    ? html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, tag)
    : html.replace('</head>', `  ${tag}\n</head>`);
}

/**
 * Function contract: currentTitle
 * Purpose: Implements the current title responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: currentTitle
 * Purpose: Implement the current title responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function currentTitle(html) {
  return strip(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
}

/**
 * Function contract: h1
 * Purpose: Implements the h1 responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: h1
 * Purpose: Implement the h1 responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function h1(html) {
  return strip(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
}

/**
 * Function contract: classText
 * Purpose: Implements the class text responsibility for this module.
 * Inputs: html, className.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: classText
 * Purpose: Implement the class text responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `html`: input consumed by this operation; `className`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function classText(html, className) {
  const pattern = new RegExp(`<[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i');
  return strip(pattern.exec(html)?.[1] || '');
}

/**
 * Function contract: absoluteImage
 * Purpose: Implement the absolute image responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `src`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function absoluteImage(src) {
  if (!src || /^data:/i.test(src)) return '';
  try { return new URL(src, `${site}/`).href; } catch { return ''; }
}

/**
 * Function contract: pageImages
 * Purpose: Implements the page images responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: pageImages
 * Purpose: Implement the page images responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function pageImages(html) {
  const images = [];
  const seen = new Set();
  for (const match of html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    const src = absoluteImage(match[1]);
    if (!src || seen.has(src) || /favicon|logo|icon|social\//i.test(src)) continue;
    seen.add(src);
    images.push(src);
  }
  return images;
}

/**
 * Function contract: realImage
 * Purpose: Implements the real image responsibility for this module.
 * Inputs: route, html.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: realImage
 * Purpose: Implement the real image responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `route`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function realImage(route, html) {
  if (['/', '/about', '/contact', '/blog/', '/privacy'].includes(route) || (route.startsWith('/blog/') && route !== '/blog/')) return portrait;
  const proof = proofRoute[route];
  if (proof) {
    const proofFile = fileFor(proof);
    if (fs.existsSync(proofFile)) {
      const images = pageImages(fs.readFileSync(proofFile, 'utf8'));
      if (images.length) return images.find(/** Callback contract: Processes the callback step for images without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `image`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `image`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (image) => /\.(?:png|jpe?g|webp|avif)(?:[?#]|$)/i.test(image)) || images[0];
    }
  }
  const images = pageImages(html);
  return images.find(/** Callback contract: Processes the callback step for images without leaking orchestration details to the caller. Inputs: image. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `image`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ /** Callback contract: Identify whether the current item matches the lookup condition for the enclosing search. Inputs: `image`. Side effects: no direct external side effect beyond invoked dependencies. Returns: computed expression result consumed by the enclosing operation. */ (image) => /\.(?:png|jpe?g|webp|avif)(?:[?#]|$)/i.test(image)) || images[0] || portrait;
}

/**
 * Function contract: pageTitle
 * Purpose: Implements the page title responsibility for this module.
 * Inputs: route, html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: pageTitle
 * Purpose: Implement the page title responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `route`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function pageTitle(route, html) {
  if (coreMeta[route]) return coreMeta[route][0];
  if (projectMeta[route]) return projectMeta[route][0];
  if (route.startsWith('/blog/') && route !== '/blog/') {
    const article = h1(html) || currentTitle(html).replace(/\s*[|–—-]\s*Nischhal Raj Subba\s*$/i, '').trim();
    return article || 'Product Design Notes';
  }
  return currentTitle(html) || h1(html) || 'Nischhal Raj Subba';
}

/**
 * Function contract: pageDescription
 * Purpose: Implements the page description responsibility for this module.
 * Inputs: route, html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: pageDescription
 * Purpose: Implement the page description responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `route`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function pageDescription(route, html) {
  if (coreMeta[route]) return coreMeta[route][1];
  if (projectMeta[route]) return classText(html, 'agent-case-deck') || metaValue(html, 'description');
  return metaValue(html, 'description') || classText(html, 'agent-page-intro') || classText(html, 'article-dek') || 'Product design work and writing by Nischhal Raj Subba.';
}

/**
 * Function contract: breadcrumbs
 * Purpose: Implements the breadcrumbs responsibility for this module.
 * Inputs: route, name.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: breadcrumbs
 * Purpose: Implement the breadcrumbs responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `route`: input consumed by this operation; `name`: stable identifier or label for the current item
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function breadcrumbs(route, name) {
  if (route === '/') return null;
  const entries = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` }];
  if (route.startsWith('/project-')) entries.push({ '@type': 'ListItem', position: 2, name: 'Work', item: `${site}/projects` });
  else if (route.startsWith('/blog/') && route !== '/blog/') entries.push({ '@type': 'ListItem', position: 2, name: 'Writing', item: `${site}/blog/` });
  else if (serviceRoutes.has(route)) entries.push({ '@type': 'ListItem', position: 2, name: 'Services', item: `${site}/services` });
  entries.push({ '@type': 'ListItem', position: entries.length + 1, name, item: `${site}${route}` });
  return { '@type': 'BreadcrumbList', itemListElement: entries };
}

/**
 * Function contract: structuredData
 * Purpose: Implements the structured data responsibility for this module.
 * Inputs: route, title, description, image, html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: structuredData
 * Purpose: Implement the structured data responsibility owned by the ensure human seo v2 repository tool.
 * Inputs: `route`: input consumed by this operation; `title`: input consumed by this operation; `description`: input consumed by this operation; `image`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function structuredData(route, title, description, image, html) {
  const canonical = route === '/' ? `${site}/` : `${site}${route}`;
  const pageName = h1(html) || title.replace(/\s*[|–—-]\s*Nischhal Raj Subba\s*$/i, '');
  const graph = [
    { '@type': 'WebSite', '@id': websiteId, url: `${site}/`, name: 'Nischhal Raj Subba' },
    {
      '@type': 'Person', '@id': personId, name: 'Nischhal Raj Subba', jobTitle: 'Senior Product Designer', url: `${site}/`, image: portrait,
      address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
      sameAs: ['https://www.linkedin.com/in/nischhal/', 'https://www.behance.net/nischhal', 'https://github.com/Nischhalsubba', 'https://app.uxcel.com/ux/nischhal'],
    },
  ];

  let type = 'WebPage';
  if (route === '/') type = 'ProfilePage';
  else if (route === '/about') type = 'AboutPage';
  else if (route === '/contact') type = 'ContactPage';
  else if (['/projects', '/services', '/blog/'].includes(route)) type = 'CollectionPage';

  const page = {
    '@type': type,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': websiteId },
    primaryImageOfPage: { '@type': 'ImageObject', url: image },
  };
  if (route === '/') page.mainEntity = { '@id': personId };
  graph.push(page);

  if (route.startsWith('/project-')) {
    graph.push({ '@type': 'CreativeWork', name: pageName, url: canonical, description, image, creator: { '@id': personId }, mainEntityOfPage: { '@id': `${canonical}#webpage` } });
  } else if (route.startsWith('/blog/') && route !== '/blog/') {
    graph.push({ '@type': 'BlogPosting', headline: pageName, url: canonical, description, image, author: { '@id': personId }, mainEntityOfPage: { '@id': `${canonical}#webpage` } });
  } else if (serviceRoutes.has(route)) {
    graph.push({ '@type': 'Service', name: pageName, url: canonical, description, image, provider: { '@id': personId }, areaServed: ['Nepal', 'Remote'] });
  }

  const crumbs = breadcrumbs(route, pageName);
  if (crumbs) graph.push(crumbs);
  return { '@context': 'https://schema.org', '@graph': graph };
}

/**
 * Function contract: setJsonLd
 * Purpose: Applies set json ld while preserving the surrounding repository/runtime contract.
 * Inputs: html, data.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: setJsonLd
 * Purpose: Synchronize json ld with the requested state while preserving related ensure human seo v2 repository tool invariants.
 * Inputs: `html`: input consumed by this operation; `data`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function setJsonLd(html, data) {
  html = html.replace(/\s*<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  return html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(data)}</script>\n</head>`);
}

const syntheticDir = path.join(base, 'assets', 'images', 'social');
if (fs.existsSync(syntheticDir)) fs.rmSync(syntheticDir, { recursive: true, force: true });

const failures = [];
const seenCanonicals = new Set();
let updated = 0;

for (const file of manifest.html) {
  const route = routeFor(file);
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) {
    failures.push(`${file}: missing production route`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const title = pageTitle(route, html).trim();
  const description = pageDescription(route, html).trim();
  const canonical = route === '/' ? `${site}/` : `${site}${route}`;
  const image = realImage(route, html);

  html = removeMeta(html, 'keywords');
  html = removeMeta(html, 'nrs-search-intent');
  html = removeMeta(html, 'og:image:width', 'property');
  html = removeMeta(html, 'og:image:height', 'property');
  html = setTitle(html, title);
  html = setCanonical(html, canonical);
  html = setMeta(html, 'description', description);
  html = setMeta(html, 'robots', 'index, follow, max-image-preview:large');
  html = setMeta(html, 'author', 'Nischhal Raj Subba');
  html = setMeta(html, 'og:site_name', 'Nischhal Raj Subba', 'property');
  html = setMeta(html, 'og:type', route.startsWith('/blog/') && route !== '/blog/' ? 'article' : 'website', 'property');
  html = setMeta(html, 'og:url', canonical, 'property');
  html = setMeta(html, 'og:title', title, 'property');
  html = setMeta(html, 'og:description', description, 'property');
  html = setMeta(html, 'og:image', image, 'property');
  html = setMeta(html, 'og:image:alt', `${h1(html) || 'Nischhal Raj Subba'} — portfolio image`, 'property');
  html = setMeta(html, 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'twitter:title', title);
  html = setMeta(html, 'twitter:description', description);
  html = setMeta(html, 'twitter:image', image);
  html = setMeta(html, 'twitter:image:alt', `${h1(html) || 'Nischhal Raj Subba'} — portfolio image`);
  html = setJsonLd(html, structuredData(route, title, description, image, html));

  if (!title) failures.push(`${file}: empty title`);
  if (!description) failures.push(`${file}: empty description`);
  if (!image || /data:image|assets\/images\/social\//i.test(image)) failures.push(`${file}: non-human preview image`);
  if (/name=["'](?:keywords|nrs-search-intent)["']/i.test(html)) failures.push(`${file}: search-engine-first metadata remains`);
  if (/assets\/images\/social\//i.test(html)) failures.push(`${file}: synthetic social preview reference remains`);
  if (seenCanonicals.has(canonical)) failures.push(`${file}: duplicate canonical ${canonical}`);
  seenCanonicals.add(canonical);

  fs.writeFileSync(filePath, html, 'utf8');
  updated += 1;
}

const retiredProfile = path.join(base, 'nischhal-raj-subba.html');
if (fs.existsSync(retiredProfile)) {
  let html = fs.readFileSync(retiredProfile, 'utf8');
  html = setCanonical(html, `${site}/`);
  html = setMeta(html, 'robots', 'noindex, follow');
  fs.writeFileSync(retiredProfile, html, 'utf8');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/sitemap/0.9">\n${manifest.html.map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file`. Side effects: no direct external side effect beyond invoked dependencies. Returns: boolean predicate/result. */ (file) => {
  const route = routeFor(file);
  return `  <url><loc>${route === '/' ? `${site}/` : `${site}${route}`}</loc></url>`;
}).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(base, 'sitemap.xml'), sitemap, 'utf8');

if (/nischhal-raj-subba/i.test(sitemap)) failures.push('sitemap: duplicate profile route remains');
if (fs.existsSync(syntheticDir)) failures.push('synthetic social preview directory remains');

if (failures.length) throw new Error(`[human-seo-v2] ${failures.length} structural failure(s): ${failures.join('; ')}`);
console.log(`[human-seo-v2] Finalized human titles/descriptions, real imagery, canonical URLs and structured data for ${updated} indexable routes.`);
