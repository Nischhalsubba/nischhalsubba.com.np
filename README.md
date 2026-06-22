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

## Deployment note

Cloudflare Pages deploys the latest `main` branch build. Documentation-only commits may be used to trigger a fresh Pages rebuild when the previous deployment failed after a build-script or audit change.

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
