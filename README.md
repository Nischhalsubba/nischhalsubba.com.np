# Nischhal Raj Subba Portfolio

Static, SEO-focused portfolio for **Nischhal Raj Subba**, a Product Designer in Nepal focused on Web3 UX, SaaS interfaces, fintech app experiences, service website UX, design systems, UX audits, and front-end-aware design.

[![Vite](https://img.shields.io/badge/Tooling-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#development)
[![Static HTML](https://img.shields.io/badge/Frontend-HTML%20CSS%20JS-111111?style=for-the-badge)](#structure)
[![SEO](https://img.shields.io/badge/SEO-Sitemap%20%2B%20Robots%20%2B%20Schema-0C8CE9?style=for-the-badge)](#seo-and-ai-discovery)

---

## Overview

This repository powers:

```txt
https://nischhalsubba.com.np/
```

The site is intentionally built as a static multi-page portfolio rather than a framework-heavy app. It includes:

- a canonical homepage at `/`
- project listing and project detail pages
- blog listing and blog detail pages
- service/SEO landing pages
- AI discovery files for agents and LLM crawlers
- sitemap, robots, manifest, and structured data
- Vite build configuration for Cloudflare Pages
- runtime JavaScript split into focused modules under `src/scripts/`

The repository root has many `.html` files because those files are public routes. Messy-looking? A little. Dangerous to move randomly? Absolutely.

---

## Structure

```txt
.
├── index.html                       # Canonical homepage
├── home.html                        # Legacy/home experiment retained in build
├── home-v2.html                     # Legacy/home experiment retained in build
├── about.html                       # About page
├── contact.html                     # Contact and lead page
├── projects.html                    # Project listing page
├── blog.html                        # Blog listing fallback page
├── blog/                            # Canonical blog route and blog detail source pages
├── project-*.html                   # Public project detail routes
├── *-designer.html                  # Service/SEO landing pages
├── ux-audit.html                    # Service/SEO landing page
├── assets/                          # Images, SVG covers, vendor files, project data
├── public/                          # Files Vite copies automatically
├── src/scripts/                     # Modular browser runtime
├── scripts/                         # Build, audit, link, and generation scripts
├── docs/                            # Maintainer documentation
├── script.js                        # Compatibility wrapper for old HTML references
├── style.css                        # Main legacy/global stylesheet
├── seo-ui-enhancements.css          # Shared polish layer loaded across pages
├── robots.txt                       # Root-served crawler instructions
├── sitemap.xml                      # Root-served sitemap
├── llms.txt                         # AI-agent summary
├── ai-profile.json                  # Machine-readable profile
├── site.webmanifest                 # Browser/search identity metadata
├── vite.config.ts                   # Multi-page Vite build config
├── wrangler.toml                    # Cloudflare Pages output config
└── package.json
```

More detailed maps:

- `docs/root-route-map.md`
- `docs/codebase-structure.md`
- `docs/build-pipeline.md`

---

## Why the root has many files

Most root HTML files are route files. For example:

```txt
project-yarsha.html -> /project-yarsha.html
about.html          -> /about.html
```

Moving those files breaks routes unless `vite.config.ts`, internal links, sitemap entries, redirects, and build audits are updated together. So yes, the root has clutter. No, the correct fix is not throwing files into `/pages` and hoping Cloudflare develops empathy.

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

Check local links:

```bash
npm run check:links
```

---

## Build pipeline

`npm run build` runs:

```txt
vite build
node scripts/copy-static-assets.cjs
node scripts/generate-resume-pdf.cjs
node scripts/audit-build.cjs
```

The custom build steps exist because Vite does not automatically place every required root-served runtime, SEO, AI discovery, or generated file exactly where Cloudflare needs it.

Important files copied into `dist/` after the Vite build include:

```txt
robots.txt
sitemap.xml
llms.txt
ai-profile.json
seo-ui-enhancements.css
site.webmanifest
script.js
src/scripts/
assets/
```

---

## Deployment

Recommended Cloudflare Pages settings:

```txt
Build command: npm run build
Output directory: dist
```

This is a Vite static site, not a Next.js app.

---

## SEO and AI discovery

The site includes:

- title tags and meta descriptions
- canonical URLs
- Open Graph/Twitter metadata
- JSON-LD structured data
- sitemap at `/sitemap.xml`
- robots file at `/robots.txt`
- LLM summary at `/llms.txt`
- machine-readable profile at `/ai-profile.json`
- web manifest at `/site.webmanifest`

Primary SEO topics:

- Product Designer in Nepal
- UI UX Designer Nepal
- Web3 UX Designer
- SaaS UX Designer
- Fintech Product Designer
- Website UX Designer
- UX Audit
- Figma Design Systems
- Front-end-aware Product Designer

---

## Runtime architecture

Browser behavior starts at:

```txt
script.js -> src/scripts/main.js
```

Feature modules live in:

```txt
src/scripts/features/
```

Shared DOM helpers live in:

```txt
src/scripts/utils/
```

Add new behavior as a focused feature module and import it from `src/scripts/main.js`. Avoid sprinkling inline scripts across HTML pages unless there is a very good reason and a small apology note.

---

## Content rules

Portfolio copy should stay truthful and specific.

- Do not invent metrics, awards, rankings, or outcomes.
- Mark team contributions clearly.
- Separate designed, developed, contributed, explored, and ongoing work.
- Keep NDA projects private or anonymized.
- Use real prototype links only where they belong.
- Keep each blog and project page focused on its subject.

---

## Maintenance checklist

Before deploying major changes:

- [ ] `npm run build` succeeds.
- [ ] `/` loads the current homepage.
- [ ] `/projects.html` loads.
- [ ] `/about.html` loads.
- [ ] `/contact.html` loads.
- [ ] `/blog/` loads.
- [ ] `/sitemap.xml` loads.
- [ ] `/robots.txt` loads.
- [ ] `/llms.txt` loads.
- [ ] `/ai-profile.json` loads.
- [ ] Project cards link to valid detail pages.
- [ ] Blog cards link to valid detail pages.
- [ ] The resume download points to `/assets/resume.pdf`.

---

## Ownership

Designed, written, and maintained by **Nischhal Raj Subba**.

GitHub: [@Nischhalsubba](https://github.com/Nischhalsubba)
