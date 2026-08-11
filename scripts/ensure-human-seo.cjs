/**
 * @fileoverview scripts/ensure-human-seo.cjs
 * Purpose: Apply the ensure human seo production transformation or maintenance step while preserving canonical source/build contracts.
 * Responsibilities:
 * - Operate deterministically on canonical source or build output so repeated runs produce stable results.
 * - Surface invalid input or contract drift as explicit failures instead of silently masking it.
 * - Keep path assumptions synchronized with repository manifests and source-layout ownership.
 * Execution context: Node.js CLI during development, generation, build, CI, or repository maintenance.
 * Connected files:
 * - src/pages/projects/project-designerex.html
 * - src/pages/projects/project-zakra-furniture.html
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
  '/': {
    title: 'Nischhal Raj Subba | Senior Product Designer',
    description: 'Product designer based in Kathmandu. I work on complex SaaS, Web3, fintech and software products, from product structure and interface design to design systems and handoff.',
  },
  '/projects': {
    title: 'Product Design Case Studies | Nischhal Raj Subba',
    description: 'Selected case studies showing the product problems, constraints, design decisions and evidence behind my work across SaaS, Web3, fintech and software.',
  },
  '/services': {
    title: 'Product Design Services | Nischhal Raj Subba',
    description: 'Product design support for teams that need clearer workflows, stronger interfaces, practical design systems, UX audits or better design-to-engineering handoff.',
  },
  '/about': {
    title: 'About Nischhal Raj Subba | Product Designer',
    description: 'I am a product designer based in Kathmandu with 6+ years across product teams, agencies and front-end collaboration. Read about my experience, approach and working style.',
  },
  '/contact': {
    title: 'Contact Nischhal Raj Subba',
    description: 'Get in touch about senior product design roles or focused product work. Share the product, current friction, timeline and any useful links.',
  },
  '/privacy': {
    title: 'Privacy | Nischhal Raj Subba',
    description: 'A plain-language explanation of what this portfolio collects through the contact form, how limited site measurement is used and how to request deletion.',
  },
  '/blog/': {
    title: 'Product Design Notes | Nischhal Raj Subba',
    description: 'Notes from product design work: complex workflows, SaaS dashboards, Web3 UX, design systems, audits, responsive behavior and handoff.',
  },
  '/product-design-nepal': {
    title: 'Product Design for Software Teams in Nepal | Nischhal Raj Subba',
    description: 'Product design support for software teams in Nepal and remote teams that need clearer product structure, polished interfaces and implementation-ready handoff.',
  },
  '/web3-ux-designer': {
    title: 'Web3 Product Design for Wallets & Transactions | Nischhal Raj Subba',
    description: 'Product design for Web3 products where wallet actions, signing, transaction states and technical concepts need to feel understandable and trustworthy.',
  },
  '/saas-ux-designer': {
    title: 'SaaS Product Design for Complex Workflows | Nischhal Raj Subba',
    description: 'Product design for SaaS teams working through dashboards, role-based workflows, tables, filters, permissions, states and reusable interface systems.',
  },
  '/website-ux-design': {
    title: 'Website UX Design for Software & Service Teams | Nischhal Raj Subba',
    description: 'Website UX and interface design for software and service teams that need clearer positioning, information architecture, proof and responsive conversion paths.',
  },
  '/figma-design-systems': {
    title: 'Figma Design Systems for Product Teams | Nischhal Raj Subba',
    description: 'Practical Figma design systems for product teams: reusable components, states, tokens, responsive rules and documentation engineers can actually work from.',
  },
  '/ux-audit': {
    title: 'UX Audits for Software Products | Nischhal Raj Subba',
    description: 'Evidence-led UX audits for software products, focused on task friction, missing states, accessibility, responsive behavior and changes worth prioritizing.',
  },
};

const projectTitles = {
  'project-yarsha.html': 'Yarsha: Web3 Messaging & Wallet UX | Nischhal Raj Subba',
  'project-mokshya.html': 'Mokshya.io: Web3 Protocol Website | Nischhal Raj Subba',
  'project-pihub.html': 'piHub: Fintech Product UX | Nischhal Raj Subba',
  'project-orkest.html': 'Orkest HQ: Modular SaaS Product Design | Nischhal Raj Subba',
  'project-neverwinter-parser.html': 'Neverwinter Live Parser: Data Product Case Study | Nischhal Raj Subba',
  'project-masteriyo.html': 'Masteriyo: LMS Product Design | Nischhal Raj Subba',
  'project-zapp.html': 'Zapp Today: Logistics Product Design | Nischhal Raj Subba',
  'project-designerex.html': 'Designerex: Fashion Marketplace UX | Nischhal Raj Subba',
  'project-hamro-idea.html': 'Hamro Idea: Software Studio Website | Nischhal Raj Subba',
  'project-morajaa.html': 'Morajaa: B2B Consulting Website UX | Nischhal Raj Subba',
  'project-splashnode.html': 'Splashnode: Technical Platform Website | Nischhal Raj Subba',
  'project-grid-labs.html': 'Grid Labs: Hosting Website Design | Nischhal Raj Subba',
  'project-zakra-furniture.html': 'Zakra Furniture: Ecommerce Template UX | Nischhal Raj Subba',
  'project-sassboilerplate.html': 'SassBoilerplate: Front-End Starter System | Nischhal Raj Subba',
};

const serviceProofRoute = {
  '/projects': '/project-yarsha',
  '/services': '/project-orkest',
  '/product-design-nepal': '/project-pihub',
  '/web3-ux-designer': '/project-yarsha',
  '/saas-ux-designer': '/project-orkest',
  '/website-ux-design': '/project-hamro-idea',
  '/figma-design-systems': '/project-masteriyo',
  '/ux-audit': '/project-pihub',
};

/**
 * Function contract: routeFor
 * Purpose: Implements the route for responsibility for this module.
 * Inputs: file.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: routeFor
 * Purpose: Implement the route for responsibility owned by the ensure human seo repository tool.
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
 * Purpose: Implement the file for responsibility owned by the ensure human seo repository tool.
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
 * Purpose: Implement the esc responsibility owned by the ensure human seo repository tool.
 * Inputs: `value`: input value being transformed or evaluated
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/**
 * Function contract: strip
 * Purpose: Remove module behavior without disturbing required surrounding ensure human seo repository tool state.
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
 * Function contract: metaValue
 * Purpose: Implement the meta value responsibility owned by the ensure human seo repository tool.
 * Inputs: `html`: input consumed by this operation; `key`: input consumed by this operation; `attribute`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function metaValue(html, key, attribute = 'name') {
  const tags = [...html.matchAll(/<meta\b[^>]*>/gi)].map(/** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `match`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (match) => match[0]);
  for (const tag of tags) {
    const foundKey = tag.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, 'i'))?.[1];
    if (foundKey?.toLowerCase() !== key.toLowerCase()) continue;
    return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] || '';
  }
  return '';
}

/**
 * Function contract: setMeta
 * Purpose: Applies set meta while preserving the surrounding repository/runtime contract.
 * Inputs: html, key, value, attribute.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: setMeta
 * Purpose: Synchronize meta with the requested state while preserving related ensure human seo repository tool invariants.
 * Inputs: `html`: input consumed by this operation; `key`: input consumed by this operation; `value`: input value being transformed or evaluated; `attribute`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function setMeta(html, key, value, attribute = 'name') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${escapedKey}["'])[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${esc(value)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

/**
 * Function contract: removeMeta
 * Purpose: Removes or cleans remove meta while keeping required outputs intact.
 * Inputs: html, key, attribute.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: removeMeta
 * Purpose: Remove meta without disturbing required surrounding ensure human seo repository tool state.
 * Inputs: `html`: input consumed by this operation; `key`: input consumed by this operation; `attribute`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function removeMeta(html, key, attribute = 'name') {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`\\s*<meta\\b(?=[^>]*\\b${attribute}=["']${escapedKey}["'])[^>]*>`, 'gi');
  return html.replace(pattern, '');
}

/**
 * Function contract: setTitle
 * Purpose: Synchronize title with the requested state while preserving related ensure human seo repository tool invariants.
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
 * Purpose: Synchronize canonical with the requested state while preserving related ensure human seo repository tool invariants.
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
 * Function contract: classText
 * Purpose: Implements the class text responsibility for this module.
 * Inputs: html, className.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: classText
 * Purpose: Implement the class text responsibility owned by the ensure human seo repository tool.
 * Inputs: `html`: input consumed by this operation; `className`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function classText(html, className) {
  const pattern = new RegExp(`<[^>]+class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i');
  return strip(pattern.exec(html)?.[1] || '');
}

/**
 * Function contract: h1Text
 * Purpose: Implement the h1 text responsibility owned by the ensure human seo repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function h1Text(html) {
  return strip(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
}

/**
 * Function contract: absoluteImage
 * Purpose: Implement the absolute image responsibility owned by the ensure human seo repository tool.
 * Inputs: `src`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function absoluteImage(src) {
  if (!src || /^data:/i.test(src)) return '';
  try { return new URL(src, `${site}/`).href; } catch { return ''; }
}

/**
 * Function contract: imagesIn
 * Purpose: Implements the images in responsibility for this module.
 * Inputs: html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: imagesIn
 * Purpose: Implement the images in responsibility owned by the ensure human seo repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function imagesIn(html) {
  const found = [];
  const seen = new Set();
  for (const match of html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)) {
    const src = absoluteImage(match[1]);
    if (!src || seen.has(src) || /favicon|logo|icon|social\//i.test(src)) continue;
    seen.add(src);
    found.push(src);
  }
  return found;
}

/**
 * Function contract: preferredPageImage
 * Purpose: Implements the preferred page image responsibility for this module.
 * Inputs: route, html.
 * Side effects: may read or write repository/filesystem state.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: preferredPageImage
 * Purpose: Implement the preferred page image responsibility owned by the ensure human seo repository tool.
 * Inputs: `route`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: reads repository/filesystem state.
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function preferredPageImage(route, html) {
  if (route === '/' || route === '/about' || route === '/contact' || route === '/blog/' || route.startsWith('/blog/')) return portrait;
  const proofRoute = serviceProofRoute[route];
  if (proofRoute) {
    const proofFile = fileFor(proofRoute);
    if (fs.existsSync(proofFile)) {
      const candidates = imagesIn(fs.readFileSync(proofFile, 'utf8'));
      const raster = candidates.find(/** Callback contract: Processes the callback step for candidates without leaking orchestration details to the caller. Inputs: src. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `src`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (src) => /\.(?:png|jpe?g|webp|avif)(?:[?#]|$)/i.test(src));
      if (raster || candidates[0]) return raster || candidates[0];
    }
  }
  const candidates = imagesIn(html);
  const raster = candidates.find(/** Callback contract: Processes the callback step for candidates without leaking orchestration details to the caller. Inputs: src. Side effects: no obvious external side effect beyond invoked dependencies. No explicit return contract. */ /** Callback contract: Return true for the first collection item matching the lookup condition used by the enclosing operation. Inputs: `src`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Undefined; the function exists for state changes, validation, orchestration, or other documented side effects. */ (src) => /\.(?:png|jpe?g|webp|avif)(?:[?#]|$)/i.test(src));
  return raster || candidates[0] || portrait;
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
 * Purpose: Implement the current title responsibility owned by the ensure human seo repository tool.
 * Inputs: `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function currentTitle(html) {
  return strip(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '');
}

/**
 * Function contract: humanTitle
 * Purpose: Implements the human title responsibility for this module.
 * Inputs: file, route, html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: humanTitle
 * Purpose: Implement the human title responsibility owned by the ensure human seo repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed; `route`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function humanTitle(file, route, html) {
  if (coreMeta[route]) return coreMeta[route].title;
  if (projectTitles[file]) return projectTitles[file];
  if (route.startsWith('/blog/')) {
    const existing = currentTitle(html).replace(/\s*[|–—-]\s*Nischhal Raj Subba\s*$/i, '').trim();
    return existing ? `${existing} | Nischhal Raj Subba` : 'Product Design Notes | Nischhal Raj Subba';
  }
  return currentTitle(html) || 'Nischhal Raj Subba';
}

/**
 * Function contract: humanDescription
 * Purpose: Implements the human description responsibility for this module.
 * Inputs: file, route, html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: humanDescription
 * Purpose: Implement the human description responsibility owned by the ensure human seo repository tool.
 * Inputs: `file`: repository-relative or absolute file path being processed; `route`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function humanDescription(file, route, html) {
  if (coreMeta[route]) return coreMeta[route].description;
  if (projectTitles[file]) {
    return classText(html, 'agent-case-deck') || metaValue(html, 'description') || `A product design case study by Nischhal Raj Subba.`;
  }
  return metaValue(html, 'description') || classText(html, 'agent-page-intro') || 'Product design work and writing by Nischhal Raj Subba.';
}

/**
 * Function contract: breadcrumb
 * Purpose: Implements the breadcrumb responsibility for this module.
 * Inputs: route, name.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: breadcrumb
 * Purpose: Implement the breadcrumb responsibility owned by the ensure human seo repository tool.
 * Inputs: `route`: input consumed by this operation; `name`: stable identifier or label for the current item
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function breadcrumb(route, name) {
  if (route === '/') return null;
  const items = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` }];
  if (route.startsWith('/project-')) items.push({ '@type': 'ListItem', position: 2, name: 'Work', item: `${site}/projects` });
  else if (route.startsWith('/blog/') && route !== '/blog/') items.push({ '@type': 'ListItem', position: 2, name: 'Writing', item: `${site}/blog/` });
  else if (['/product-design-nepal','/web3-ux-designer','/saas-ux-designer','/website-ux-design','/figma-design-systems','/ux-audit'].includes(route)) items.push({ '@type': 'ListItem', position: 2, name: 'Services', item: `${site}/services` });
  items.push({ '@type': 'ListItem', position: items.length + 1, name, item: `${site}${route}` });
  return { '@type': 'BreadcrumbList', itemListElement: items };
}

/**
 * Function contract: schema
 * Purpose: Implements the schema responsibility for this module.
 * Inputs: route, title, description, image, html.
 * Side effects: no obvious external side effect beyond invoked dependencies.
 * Returns: a value consumed by the caller; inspect the implementation for the exact shape.
 */
/**
 * Function contract: schema
 * Purpose: Implement the schema responsibility owned by the ensure human seo repository tool.
 * Inputs: `route`: input consumed by this operation; `title`: input consumed by this operation; `description`: input consumed by this operation; `image`: input consumed by this operation; `html`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Computed result consumed by the caller; each early-return branch is intentionally preserved by the implementation.
 */
function schema(route, title, description, image, html) {
  const name = h1Text(html) || title.replace(/\s*[|–—-]\s*Nischhal Raj Subba\s*$/i, '');
  const canonical = route === '/' ? `${site}/` : `${site}${route}`;
  const graph = [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${site}/`,
      name: 'Nischhal Raj Subba',
      alternateName: 'Nischhal Raj Subba Portfolio',
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Nischhal Raj Subba',
      jobTitle: 'Senior Product Designer',
      url: `${site}/`,
      image: portrait,
      address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
      sameAs: [
        'https://www.linkedin.com/in/nischhal/',
        'https://www.behance.net/nischhal',
        'https://github.com/Nischhalsubba',
        'https://app.uxcel.com/ux/nischhal',
      ],
      knowsAbout: ['Product Design', 'SaaS UX', 'Web3 UX', 'Fintech UX', 'Design Systems'],
    },
  ];

  let pageType = 'WebPage';
  if (route === '/') pageType = 'ProfilePage';
  else if (route === '/about') pageType = 'AboutPage';
  else if (route === '/contact') pageType = 'ContactPage';
  else if (route === '/projects' || route === '/services' || route === '/blog/') pageType = 'CollectionPage';

  const page = {
    '@type': pageType,
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': websiteId },
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
  };
  if (route === '/') page.mainEntity = { '@id': personId };
  graph.push(page);

  if (route.startsWith('/project-')) {
    graph.push({
      '@type': 'CreativeWork',
      name,
      url: canonical,
      description,
      image,
      creator: { '@id': personId },
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
    });
  } else if (route.startsWith('/blog/') && route !== '/blog/') {
    graph.push({
      '@type': 'BlogPosting',
      headline: name,
      url: canonical,
      description,
      image,
      author: { '@id': personId },
      mainEntityOfPage: { '@id': `${canonical}#webpage` },
    });
  } else if (['/product-design-nepal','/web3-ux-designer','/saas-ux-designer','/website-ux-design','/figma-design-systems','/ux-audit'].includes(route)) {
    graph.push({
      '@type': 'Service',
      name,
      url: canonical,
      description,
      image,
      provider: { '@id': personId },
      areaServed: ['Nepal', 'Remote'],
    });
  }

  const crumbs = breadcrumb(route, name);
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
 * Purpose: Synchronize json ld with the requested state while preserving related ensure human seo repository tool invariants.
 * Inputs: `html`: input consumed by this operation; `data`: input consumed by this operation
 * Side effects: No obvious external side effect beyond calls to supplied/imported dependencies..
 * Returns: Boolean predicate result consumed by the caller.
 */
function setJsonLd(html, data) {
  html = html.replace(/\s*<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');
  const tag = `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  return html.replace('</head>', `  ${tag}\n</head>`);
}

const syntheticDir = path.join(base, 'assets', 'images', 'social');
if (fs.existsSync(syntheticDir)) fs.rmSync(syntheticDir, { recursive: true, force: true });

const seenTitles = new Map();
const seenDescriptions = new Map();
const failures = [];
let updated = 0;

for (const file of manifest.html) {
  const route = routeFor(file);
  const filePath = path.join(base, file);
  if (!fs.existsSync(filePath)) {
    failures.push(`${file}: missing production file`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  const title = humanTitle(file, route, html);
  const description = humanDescription(file, route, html);
  const canonical = route === '/' ? `${site}/` : `${site}${route}`;
  const image = preferredPageImage(route, html);

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
  html = setMeta(html, 'og:image:alt', `${h1Text(html) || 'Nischhal Raj Subba'} — portfolio image`, 'property');
  html = setMeta(html, 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'twitter:title', title);
  html = setMeta(html, 'twitter:description', description);
  html = setMeta(html, 'twitter:image', image);
  html = setMeta(html, 'twitter:image:alt', `${h1Text(html) || 'Nischhal Raj Subba'} — portfolio image`);
  html = setJsonLd(html, schema(route, title, description, image, html));

  if (/assets\/images\/social\//i.test(html)) failures.push(`${file}: synthetic social preview reference remains`);
  if (/name=["'](?:keywords|nrs-search-intent)["']/i.test(html)) failures.push(`${file}: search-engine-first metadata remains`);
  if (!image || /data:image/i.test(image)) failures.push(`${file}: preferred image is not a crawlable real asset`);
  if (title.length > 75) failures.push(`${file}: title is unnecessarily long (${title.length})`);
  if (description.length < 70 || description.length > 190) failures.push(`${file}: description length is ${description.length}`);

  if (seenTitles.has(title)) failures.push(`${file}: duplicates title from ${seenTitles.get(title)}`);
  else seenTitles.set(title, file);
  if (seenDescriptions.has(description)) failures.push(`${file}: duplicates description from ${seenDescriptions.get(description)}`);
  else seenDescriptions.set(description, file);

  fs.writeFileSync(filePath, html, 'utf8');
  updated += 1;
}

/* Keep the retired profile source out of Search even if a host ever serves the file directly. */
const retiredProfile = path.join(base, 'nischhal-raj-subba.html');
if (fs.existsSync(retiredProfile)) {
  let html = fs.readFileSync(retiredProfile, 'utf8');
  html = setCanonical(html, `${site}/`);
  html = setMeta(html, 'robots', 'noindex, follow');
  fs.writeFileSync(retiredProfile, html, 'utf8');
}

const sitemapUrls = manifest.html.map(/** Callback contract: Processes the callback step for manifest.html without leaking orchestration details to the caller. Inputs: file. Side effects: no obvious external side effect beyond invoked dependencies. Returns a value to the invoking API. */ /** Callback contract: Transform the current item into the representation consumed by the enclosing collection operation. Inputs: `file`. Side effects: No obvious external side effect beyond calls to supplied/imported dependencies.. Returns: Boolean predicate result consumed by the caller. */ (file) => {
  const route = routeFor(file);
  return `  <url><loc>${route === '/' ? `${site}/` : `${site}${route}`}</loc></url>`;
}).join('\n');
fs.writeFileSync(
  path.join(base, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
  'utf8',
);

const sitemap = fs.readFileSync(path.join(base, 'sitemap.xml'), 'utf8');
if (/nischhal-raj-subba/i.test(sitemap)) failures.push('sitemap: duplicate professional-profile URL remains');
if (fs.existsSync(syntheticDir)) failures.push('synthetic social preview directory remains');

if (failures.length) {
  throw new Error(`[human-seo] ${failures.length} failure(s): ${failures.join('; ')}`);
}

console.log(`[human-seo] Rebuilt titles, descriptions, canonicals, real-image previews and structured data for ${updated} indexable page(s); duplicate profile consolidated to home.`);
