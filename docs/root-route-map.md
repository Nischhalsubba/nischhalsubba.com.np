# Root Route Map

This project intentionally keeps many HTML files at the repository root because they are public routes for a static Vite/Cloudflare Pages site.

Moving these files without updating `vite.config.ts`, sitemap entries, redirects, internal links, and build audits can break production URLs. Yes, the root looks crowded. No, that does not mean it is safe to throw files into folders like a digital laundry pile.

## Why root HTML files exist

Vite uses the root HTML files listed in `vite.config.ts` as multi-page build entries. Cloudflare Pages then serves the generated files from `dist/`.

A file such as:

```txt
project-yarsha.html
```

becomes the public route:

```txt
/project-yarsha.html
```

That route is linked from project cards, sitemap entries, AI discovery files, and SEO metadata.

## Route groups

### Core pages

```txt
index.html              # Canonical homepage
home.html               # Legacy/home experiment retained in build
home-v2.html            # Legacy/home experiment retained in build
about.html              # About page
contact.html            # Contact page
projects.html           # Work listing page
blog.html               # Legacy blog listing fallback
blog/index.html         # Canonical folder route for /blog/
```

### Service pages

```txt
product-design-nepal.html
web3-ux-designer.html
saas-ux-designer.html
website-ux-design.html
figma-design-systems.html
ux-audit.html
```

### Blog detail pages built by Vite

```txt
blog/blog-web3-products.html
blog/blog-good-handoff.html
blog/blog-portfolio-product.html
blog/blog-service-websites.html
blog/blog-gaming-interface-clarity.html
blog/blog-design-systems-front-end.html
```

### Project detail pages built by Vite

```txt
project-yarsha.html
project-mokshya.html
project-hamro-idea.html
project-morajaa.html
project-pihub.html
project-masteriyo.html
project-zapp.html
project-neverwinter-parser.html
project-orkest.html
project-splashnode.html
project-grid-labs.html
project-zakra-furniture.html
project-designerex.html
project-sassboilerplate.html
```

## Files that should stay modular

Runtime behavior should not be added as inline scripts inside every HTML file. Put browser behavior here instead:

```txt
src/scripts/features/
```

Shared utilities belong here:

```txt
src/scripts/utils/
```

Build-only logic belongs here:

```txt
scripts/
```

Static assets belong here:

```txt
assets/
```

AI/search/discovery files currently live at the root because they are served as root URLs and copied to `dist/` by `scripts/copy-static-assets.cjs`.

```txt
robots.txt
sitemap.xml
llms.txt
ai-profile.json
site.webmanifest
```

## Safe cleanup rule

Before moving or deleting any root file, check all of these:

1. `vite.config.ts` build input
2. `sitemap.xml`
3. `robots.txt`
4. `llms.txt`
5. `ai-profile.json`
6. internal links in HTML
7. `scripts/audit-build.cjs`
8. Cloudflare redirects

Then run:

```bash
npm run build
```

If the route is public, add a redirect before removing it. Future-you will complain less. Barely.
