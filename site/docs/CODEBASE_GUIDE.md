# Codebase Guide

This portfolio is a Vite-powered static website for Nischhal Raj Subba. The goal of this codebase is to keep the site easy to maintain, SEO-friendly, and truthful to the actual project work shown in the portfolio.

## Current Architecture

```txt
.
├── home-v2.html                 # Current homepage served through public/_redirects
├── projects.html                # Main project listing page
├── about.html                   # About / credibility page
├── blog.html                    # Stable blog listing route used for /blog
├── contact.html                 # Lead/contact page
├── project-*.html               # Individual project detail pages
├── blog/
│   ├── index.html               # Folder blog index fallback
│   └── blog-*.html              # Folder-based blog detail pages
├── assets/
│   ├── images/                  # Project thumbnails, blog covers, favicon, avatars
│   └── js/project-data.js       # Project source-of-truth data for future dynamic rendering
├── public/
│   ├── _redirects               # Cloudflare Pages routing rules
│   ├── robots.txt               # Search crawler rules
│   └── sitemap.xml              # Public sitemap copied by Vite
├── style.css                    # Global design system and page styles
├── script.js                    # Global interactions, filters, search, theme, motion
└── vite.config.ts               # Multi-page Vite build inputs
```

## Deployment Notes

The project is deployed through Vite, so static deployment assets must live in `public/` to appear in the final `dist/` output.

Important public files:

- `public/_redirects`
- `public/robots.txt`
- `public/sitemap.xml`

If a new standalone page is added, also add it to `vite.config.ts` under `build.rollupOptions.input`. Otherwise Vite may not emit it into the production build.

## Routing Rules

The current homepage is served by:

```txt
/ /home-v2.html 200
```

The blog listing is served by:

```txt
/blog /blog.html 200
/blog/ /blog.html 200
```

The blog detail pages use the folder route pattern:

```txt
/blog/blog-web3-products.html
/blog/blog-good-handoff.html
/blog/blog-portfolio-product.html
/blog/blog-service-websites.html
/blog/blog-gaming-interface-clarity.html
/blog/blog-design-systems-front-end.html
```

## Content Rules

- Do not add exaggerated impact metrics.
- Do not mention NDA/confidential projects.
- Keep MAS DataHub out of public portfolio pages.
- Use “contribution” wording when the work was part of a team.
- Use “designed and built” only when Nischhal actually handled both design and front-end implementation.
- Use project-specific language on detail pages. Avoid generic filler.
- All images need descriptive `alt` text.
- All external links should use `target="_blank" rel="noopener noreferrer"`.

## SEO Rules

Every public page should include:

- unique `<title>`
- unique meta description
- canonical URL
- Open Graph title/description/image
- descriptive H1
- internal links to relevant project/blog/contact pages
- schema where useful

## Design System Rules

- Reuse existing classes before adding new CSS.
- Keep dark/light theme compatibility.
- Keep motion subtle and preserve reduced-motion support.
- Keep project cards consistent across homepage and project listing.
- Avoid one-off inline styles when a pattern repeats across pages.

## Maintenance Checklist

Before pushing major changes:

```bash
npm install
npm run build
```

After deployment, test:

```txt
/
/projects.html
/about.html
/blog
/blog/blog-web3-products.html
/contact.html
/sitemap.xml
/robots.txt
```

If Cloudflare shows old pages, purge cache.
