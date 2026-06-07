# Build Pipeline

This repository is a static multi-page Vite site. The build is intentionally more than just `vite build` because the site needs runtime files, SEO files, AI discovery files, and generated assets in the final `dist/` folder.

## Build command

```bash
npm run build
```

Current build sequence:

```txt
vite build
node scripts/copy-static-assets.cjs
node scripts/generate-resume-pdf.cjs
node scripts/audit-build.cjs
```

## Step 1: Vite build

Vite reads all multi-page HTML inputs from `vite.config.ts` and creates the initial `dist/` output.

Important: do not move root HTML files without updating the Vite input map. The build may still pass for some pages while silently dropping others, which is the kind of bug that waits until someone important clicks a link.

## Step 2: Static asset copy

`scripts/copy-static-assets.cjs` copies files that Vite does not naturally emit in the exact public location needed by the site.

It copies:

```txt
assets/
src/scripts/
script.js
robots.txt
sitemap.xml
llms.txt
ai-profile.json
seo-ui-enhancements.css
site.webmanifest
```

It also strips visible static SEO helper sections from generated HTML after schema/context has been injected by the Vite plugin.

## Step 3: Resume generation

`scripts/generate-resume-pdf.cjs` generates:

```txt
dist/assets/resume.pdf
```

The build audit checks that this file exists and is not suspiciously tiny.

## Step 4: Build audit

`scripts/audit-build.cjs` checks the generated `dist/` output for required files and required homepage positioning text.

The audit intentionally fails if SEO helper blocks become visible in final HTML:

```txt
nrs-static-project-context
nrs-static-related-links
nrs-static-faq
```

Those blocks are build-time context and schema helpers, not UI sections.

## Cloudflare Pages

Recommended settings:

```txt
Build command: npm run build
Output directory: dist
```

Do not use Next.js settings. This is not a Next.js project. The internet has suffered enough.

## Before deployment

Run:

```bash
npm run build
```

Then manually check:

```txt
/
/projects.html
/about.html
/contact.html
/blog/
/project-yarsha.html
/blog/blog-web3-products.html
/robots.txt
/sitemap.xml
/llms.txt
/ai-profile.json
```

## When adding a new page

1. Add the HTML file.
2. Add it to `vite.config.ts` build inputs.
3. Add it to `sitemap.xml` if it should be indexed.
4. Add internal links where relevant.
5. Add SEO/schema context if it is a project or blog detail page.
6. Run `npm run build`.
