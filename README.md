# Nischhal Raj Subba Portfolio

A static, SEO-focused portfolio for **Nischhal Raj Subba**, a Product Designer in Nepal focused on Web3 UX, SaaS interfaces, fintech app experience, service website UX, design systems, and front-end-aware design.

[![Vite](https://img.shields.io/badge/Tooling-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#development)
[![Static HTML](https://img.shields.io/badge/Frontend-HTML%20CSS%20JS-111111?style=for-the-badge)](#structure)
[![SEO](https://img.shields.io/badge/SEO-Sitemap%20%2B%20Robots%20%2B%20Schema-0C8CE9?style=for-the-badge)](#seo)

---

## Overview

This repository powers `nischhalsubba.com.np`.

The website is designed as a product-design portfolio, not only a personal homepage. It includes:

- a homepage with positioning, achievements, selected work, writing, and CTA
- a project listing page with search/filter behavior
- project detail pages for Web3, SaaS, fintech, website, mobile, and front-end work
- a folder-based blog route for SEO-friendly articles
- sitemap, robots, and Cloudflare Pages redirects
- Vite build configuration for multi-page static deployment

The current production route for the homepage is handled by Cloudflare Pages redirects:

```txt
/ → /home-v2.html
```

The current production blog route is handled as a physical public route:

```txt
/blog/ → public/blog/index.html
```

---

## Structure

```txt
.
├── home-v2.html                     # Current homepage used by _redirects
├── index.html                       # Legacy/original homepage kept for reference
├── about.html                       # About page
├── contact.html                     # Contact and lead page
├── projects.html                    # Project listing page
├── blog.html                        # Blog listing fallback page
├── blog/                            # Source blog detail pages included in Vite build
│   ├── index.html
│   ├── blog-web3-products.html
│   ├── blog-good-handoff.html
│   ├── blog-portfolio-product.html
│   ├── blog-service-websites.html
│   ├── blog-gaming-interface-clarity.html
│   └── blog-design-systems-front-end.html
├── project-*.html                   # Project detail pages
├── public/                          # Files copied directly into Vite dist
│   ├── _redirects
│   ├── robots.txt
│   ├── sitemap.xml
│   └── blog/index.html              # Physical /blog/ route for Cloudflare Pages
├── assets/
│   ├── images/
│   └── js/project-data.js
├── script.js
├── style.css
├── vite.config.ts
└── package.json
```

---

## Key Pages

### Main pages

- `/` → routed to `/home-v2.html`
- `/projects.html`
- `/about.html`
- `/blog/`
- `/contact.html`

### Blog pages

- `/blog/blog-web3-products.html`
- `/blog/blog-good-handoff.html`
- `/blog/blog-portfolio-product.html`
- `/blog/blog-service-websites.html`
- `/blog/blog-gaming-interface-clarity.html`
- `/blog/blog-design-systems-front-end.html`

### Featured project pages

- `/project-yarsha.html`
- `/project-mokshya.html`
- `/project-hamro-idea.html`
- `/project-morajaa.html`
- `/project-pihub.html`
- `/project-masteriyo.html`
- `/project-zapp.html`
- `/project-orkest.html`
- `/project-splashnode.html`
- `/project-neverwinter-parser.html`

---

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Deployment

Recommended Cloudflare Pages settings:

```txt
Build command: npm run build
Output directory: dist
```

Important deployment files live in `public/` because Vite copies that folder directly into the final `dist/` build.

```txt
public/_redirects
public/robots.txt
public/sitemap.xml
public/blog/index.html
```

---

## SEO

The site includes:

- page-specific title tags
- meta descriptions
- canonical URLs
- Open Graph metadata
- schema/structured data on key pages
- root-safe internal links
- descriptive image alt text
- sitemap at `/sitemap.xml`
- robots file at `/robots.txt`

Primary SEO topics:

- Product Designer in Nepal
- Web3 UX Designer
- SaaS UX Designer
- Fintech Product Designer
- Website UX Designer
- Front-end-aware Product Designer
- Product Design Portfolio

---

## Content Rules

Portfolio copy should stay truthful and specific.

- Do not invent metrics, awards, or rankings.
- Mark team contributions clearly.
- Separate designed, developed, contributed, explored, and ongoing work.
- Keep NDA projects private or anonymized.
- Use real prototype links only where they belong.
- Keep each blog and project page focused on its subject.

---

## Maintenance Checklist

Before deploying major changes:

- [ ] `npm run build` succeeds.
- [ ] `/` loads the current homepage.
- [ ] `/blog` redirects to `/blog/` or loads the physical blog route.
- [ ] `/blog/` loads correctly.
- [ ] `/sitemap.xml` loads.
- [ ] `/robots.txt` loads.
- [ ] Project cards link to valid detail pages.
- [ ] Blog cards link to valid detail pages.
- [ ] No old links remain: `project-detail.html`, `project-jeweltrek.html`, `blog-detail.html`, `blog-web3-ux.html`.

---

## Ownership

Designed, written, and maintained by **Nischhal Raj Subba**.

GitHub: [@Nischhalsubba](https://github.com/Nischhalsubba)
