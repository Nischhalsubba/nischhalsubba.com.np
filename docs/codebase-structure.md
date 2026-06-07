# Codebase Structure

This project is a static, multi-page Vite site deployed to Cloudflare Pages.

The codebase has two competing needs:

1. Public URLs must remain stable for SEO, portfolio links, and Cloudflare.
2. The repository must stay understandable for maintenance.

The result is a hybrid structure: public route files remain where Vite and Cloudflare expect them, while behavior, build logic, documentation, and assets are organized into clear folders.

## Top-level folders

```txt
assets/          Images, SVG covers, local vendor files, and project data.
blog/            Canonical blog route and blog detail source pages.
docs/            Maintainer documentation and architecture notes.
public/          Files copied directly by Vite into dist.
scripts/         Build, audit, generation, and maintenance scripts.
src/scripts/     Modular browser runtime used by static pages.
wordpress/       Archived WordPress/theme material kept out of the static build.
```

## Root files

Root files are limited to files that are one of these:

- public HTML routes
- root-served discovery files
- build/tooling config
- compatibility entrypoints
- repository documentation

Examples:

```txt
index.html                Canonical homepage route.
projects.html             Public work route.
about.html                Public about route.
contact.html              Public contact route.
project-*.html            Public project detail routes.
*-designer.html           Public service/SEO routes.
robots.txt                Root-served crawler file.
sitemap.xml               Root-served sitemap.
llms.txt                  Root-served AI agent summary.
ai-profile.json           Root-served machine-readable profile.
script.js                 Compatibility wrapper that imports src/scripts/main.js.
style.css                 Main global stylesheet.
seo-ui-enhancements.css   Shared polish layer loaded across pages.
vite.config.ts            Multi-page Vite build configuration.
```

## Runtime JavaScript

Browser behavior is organized under `src/scripts/`:

```txt
src/scripts/
├── main.js                     # Runtime entrypoint
├── utils/
│   └── dom.js                  # Shared DOM helpers
└── features/
    ├── article-layout.js       # Detail/article page layout normalization
    ├── contact-form.js         # Contact mailto behavior
    ├── filters.js              # Work/blog filtering and search
    ├── global-styles.js        # Runtime visual compatibility layer
    ├── mobile-menu.js          # Mobile navigation toggle
    ├── motion.js               # Progressive reveal/motion enhancements
    ├── navigation.js           # Active nav state
    ├── pointer-glow.js         # Premium custom cursor behavior
    ├── project-images.js       # Project/detail image helpers
    ├── resume.js               # Resume download normalization
    ├── site-footer.js          # Shared footer fallback
    └── theme.js                # Light/dark theme handling
```

The root `script.js` file remains as a compatibility entrypoint because existing HTML files reference it:

```js
import './src/scripts/main.js';
```

This keeps the public site stable while maintainable code lives in `src/`.

## Static pages

Most public routes are static HTML. Active build inputs are declared in `vite.config.ts`, not guessed by folder shape.

Core routes:

```txt
index.html
home.html
home-v2.html
about.html
contact.html
projects.html
blog.html
blog/index.html
```

Service routes:

```txt
product-design-nepal.html
web3-ux-designer.html
saas-ux-designer.html
website-ux-design.html
figma-design-systems.html
ux-audit.html
```

Project routes:

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

Blog details belong under `blog/`. Old root blog duplicates should be removed only when redirects exist in `public/_redirects`.

## Build scripts

```txt
scripts/copy-static-assets.cjs      Copies root-served and runtime files into dist.
scripts/generate-resume-pdf.cjs     Generates dist/assets/resume.pdf.
scripts/audit-build.cjs             Fails the build if required outputs are missing.
scripts/check-links.js              Checks local links/assets in root HTML files.
```

## Public files

Everything in `public/` is copied directly to the final Vite `dist/` folder.

```txt
public/
├── _redirects
├── detail-navigation.js
├── seo-enhancements.js
└── blog/
```

Root-served SEO/AI files currently live at repository root and are copied by `scripts/copy-static-assets.cjs` because they must be served as `/robots.txt`, `/sitemap.xml`, `/llms.txt`, and `/ai-profile.json`.

## Maintenance rules

- Keep public URLs stable unless redirects are added.
- Put new browser behavior in `src/scripts/features/`.
- Keep shared DOM helpers in `src/scripts/utils/`.
- Keep build-only logic in `scripts/`.
- Keep route documentation in `docs/root-route-map.md`.
- Do not add new root files unless they are public routes, root-served metadata, or build/tooling config.
- Run `npm run build` before merging cleanup work.
- Run `npm run check:links` before changing page URLs.

A clean repository is useful. A clean repository that breaks SEO routes is just expensive decoration.
