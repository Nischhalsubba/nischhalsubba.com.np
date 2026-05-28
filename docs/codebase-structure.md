# Codebase Structure

This project is a static, multi-page Vite site deployed to Cloudflare Pages.

## Runtime JavaScript

Browser behavior is organized under `src/scripts/`:

```txt
src/scripts/
├── main.js                     # Runtime entrypoint
├── utils/
│   └── dom.js                  # Shared DOM helpers
└── features/
    ├── contact-form.js         # Contact mailto behavior
    ├── filters.js              # Work/blog filtering and search
    ├── global-styles.js        # Small JS-only runtime style helpers
    ├── grid-canvas.js          # Optional homepage canvas grid
    ├── mobile-menu.js          # Mobile navigation toggle
    ├── navigation.js           # Active nav state
    ├── page-transitions.js     # Lightweight page transition state
    ├── resume.js               # Resume download normalization
    ├── share.js                # Share/copy controls
    └── theme.js                # Light/dark theme handling
```

The root `script.js` file remains as a compatibility entrypoint because existing HTML files already reference it:

```js
import './src/scripts/main.js';
```

This keeps the public site stable while moving maintainable code into `src/`.

## Static Pages

Most routes are static HTML files at the repository root. This is intentional for Cloudflare Pages and SEO stability.

```txt
index.html
home-v2.html
about.html
contact.html
projects.html
blog.html
project-*.html
*-designer.html
ux-audit.html
```

The `/blog/` route has both source pages under `blog/` and Cloudflare/Vite public files under `public/blog/`.

## Public Files

Everything in `public/` is copied directly to the final Vite `dist/` folder.

```txt
public/
├── _redirects
├── robots.txt
├── sitemap.xml
├── detail-navigation.js
├── seo-enhancements.js
└── blog/
```

## Build and Deployment

Use Vite as the source of truth:

```bash
npm run build
```

Cloudflare Pages should ideally use:

```txt
Build command: npm run build
Output directory: dist
```

A temporary compatibility shim exists because Cloudflare was configured to run `npx next build`. The shim redirects `next build` to the real Vite build so deployments do not fail while dashboard settings are corrected.

## Maintenance Rules

- Keep public URLs stable unless redirects are added.
- Put new browser behavior in `src/scripts/features/`.
- Keep shared DOM helpers in `src/scripts/utils/`.
- Keep deployment-only files in `public/` or `scripts/`.
- Run `npm run build` before deploying major changes.
- Run `npm run check:links` before changing page URLs.
