# Nischhal Raj Subba Portfolio Website

> A premium personal portfolio platform for **Nischhal Raj Subba** — designed from a product designer's perspective and implemented as both a static front-end website and a WordPress theme system.

[![Static HTML](https://img.shields.io/badge/Static-HTML%20%2B%20CSS%20%2B%20JS-111111?style=for-the-badge)](#technical-stack)
[![Vite](https://img.shields.io/badge/Tooling-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#local-development)
[![WordPress Theme](https://img.shields.io/badge/CMS-WordPress%20Theme-21759B?style=for-the-badge&logo=wordpress&logoColor=white)](#wordpress-theme-capabilities)
[![GSAP](https://img.shields.io/badge/Motion-GSAP-88CE02?style=for-the-badge)](#motion-and-interaction-system)

---

## Table of Contents

- [Overview](#overview)
- [Project Vision](#project-vision)
- [Designer's Perspective](#designers-perspective)
- [Experience Architecture](#experience-architecture)
- [Technical Stack](#technical-stack)
- [Repository Structure](#repository-structure)
- [Static Website Mode](#static-website-mode)
- [WordPress Theme Mode](#wordpress-theme-mode)
- [Design System](#design-system)
- [Motion and Interaction System](#motion-and-interaction-system)
- [Content Strategy](#content-strategy)
- [SEO and Metadata](#seo-and-metadata)
- [Accessibility and UX Notes](#accessibility-and-ux-notes)
- [Local Development](#local-development)
- [WordPress Installation](#wordpress-installation)
- [Deployment Options](#deployment-options)
- [Quality Checklist](#quality-checklist)
- [Roadmap](#roadmap)
- [Ownership](#ownership)

---

## Overview

This repository contains the source code for **Nischhal Raj Subba's personal portfolio website**. The project is not only a simple personal homepage. It is structured as a broader portfolio platform that supports two implementation modes:

1. **Static multi-page portfolio** using direct HTML, CSS, and JavaScript.
2. **WordPress theme version** inside the `wordpress/` directory for CMS-driven publishing.

The site is designed to communicate Nischhal's professional identity as a product designer with strengths in product design, design systems, enterprise UX, Web3 interfaces, fintech problem spaces, visual storytelling, and front-end-aware design execution.

The project uses a premium dark-first visual system, animation-rich interactions, editorial content structure, case-study pages, writing sections, products/digital-offer pages, contact UI, and a WordPress theme layer for dynamic content management.

---

## Project Vision

The vision of this portfolio is to feel like a professional design product, not only a personal web page.

The design direction aims to:

- communicate high visual taste
- show front-end awareness
- support case-study storytelling
- make the portfolio feel credible for international design opportunities
- keep the experience polished on desktop and mobile
- support both static and CMS-managed publishing
- maintain a strong personal brand language
- support long-form writing, selected work, testimonials, and digital products

From a design point of view, the website is built around the idea that a portfolio should show how a designer thinks before the visitor even opens a case study. The layout, spacing, type choices, interaction details, and content structure are all part of the professional signal.

---

## Designer's Perspective

This project is written and maintained from the perspective of a designer who understands code enough to control the final experience.

That means the repository values:

- visual hierarchy
- spacing discipline
- responsive behavior
- content structure
- motion timing
- accessibility considerations
- maintainable CSS tokens
- clear page architecture
- clean handoff between design and development

The static version gives full control over the visual experience. The WordPress version makes the same system more flexible for publishing and content management.

This dual-mode approach is useful because it allows the portfolio to work as a handcrafted static site while also exploring a scalable CMS-driven version for future updates.

---

## Experience Architecture

The static site includes multiple pages that together form a complete personal portfolio system.

| Page | Purpose | UX Role |
|---|---|---|
| `index.html` | Homepage with hero, achievements, selected work, testimonials, insights, and CTA | First impression and conversion path |
| `projects.html` | Full project listing with filters and search | Work discovery |
| `project-detail.html` | Case-study layout with role, process, and outcomes | Deep project storytelling |
| `about.html` | Background, experience timeline, education, awards, and skills | Personal credibility |
| `blog.html` | Writing index | Thought leadership |
| `blog-detail.html` | Article detail page | Long-form reading |
| `products.html` | Digital products or offer section | Business/product expansion |
| `contact.html` | Contact details and message form UI | Lead conversion |

The WordPress theme mirrors this content model using templates such as:

- `front-page.php`
- `page-about.php`
- `archive-project.php`
- `single-project.php`
- `header.php`
- `footer.php`
- `functions.php`

---

## Technical Stack

### Core Frontend

- HTML5
- CSS3
- JavaScript / ES2022
- CSS custom properties
- responsive layout patterns
- static page templates

### Tooling

- Node.js
- Vite
- TypeScript configuration
- npm scripts

### Motion and Interaction

- GSAP
- GSAP ScrollTrigger
- custom JavaScript interactions
- theme toggle behavior
- mobile navigation behavior
- cursor behavior
- scroll-triggered reveals

### CMS Layer

- WordPress custom theme
- custom post types
- custom taxonomy
- custom meta fields
- WordPress Customizer controls
- JSON-LD schema output

---

## Repository Structure

```text
.
├── about.html
├── blog.html
├── blog-detail.html
├── contact.html
├── index.html
├── projects.html
├── project-detail.html
├── products.html
├── style.css
├── script.js
├── assets/
│   ├── resume.pdf
│   ├── images/
│   ├── scripts/
│   └── styles/
├── wordpress/
│   ├── functions.php
│   ├── front-page.php
│   ├── header.php
│   ├── footer.php
│   ├── style.css
│   └── js/main.js
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

This structure shows that the repository is not only a single landing page. It is a full personal website system with static pages, a theme implementation, assets, scripts, styling, and project documentation.

---

## Static Website Mode

The static version is useful for fast deployment, direct control, and portfolio presentation without backend complexity.

### Static Mode Strengths

- simple hosting
- direct HTML editing
- fast page loads
- clear content control
- easy visual QA
- no database dependency
- portable to Netlify, Vercel, Cloudflare Pages, GitHub Pages, or standard hosting

### Main Editable Areas

| Area | File |
|---|---|
| Homepage content | `index.html` |
| About content | `about.html` |
| Project listing | `projects.html` |
| Case-study content | `project-detail.html` |
| Blog listing | `blog.html` |
| Article detail | `blog-detail.html` |
| Product/offer content | `products.html` |
| Contact UI | `contact.html` |
| Global style | `style.css` |
| Main interaction logic | `script.js` |

---

## WordPress Theme Mode

The `wordpress/` directory extends the same design system into a CMS-managed theme.

### WordPress Capabilities

The theme supports:

- custom logo
- thumbnails
- HTML5 features
- responsive embeds
- editor styles
- primary and footer menus
- project content management
- product content management
- testimonial content management
- custom fields
- custom taxonomy
- Customizer controls
- schema output

### Custom Post Types

| Post Type | Purpose |
|---|---|
| `project` | Portfolio and case-study content |
| `product` | Digital product or offer content |
| `testimonial` | Social proof and credibility content |

### Custom Taxonomy

| Taxonomy | Purpose |
|---|---|
| `project_category` | Categorizes portfolio projects |

### Customizer Direction

The WordPress implementation includes or is intended to support Customizer controls for:

- typography
- dark and light color tokens
- hero content
- buttons
- ticker/marquee content
- cursor behavior
- animation speed
- performance mode
- footer content
- social links

This makes the theme more flexible without requiring direct code edits for every content or design change.

---

## Design System

The visual system is dark-first and built around a premium editorial portfolio style.

### Core Principles

- clarity over decoration
- premium motion
- readable long-form content
- strong case-study hierarchy
- personal brand consistency
- reusable design tokens
- light-mode parity, not simple inversion
- responsive behavior across devices

### Visual Language

The site uses:

- serif and sans-serif pairing
- strong heading scale
- dark backgrounds
- glass/frosted navigation styling
- refined card systems
- high-contrast text treatment
- subtle spotlight/grid background layers
- smooth transitions and hover states

### Typography

The static version references:

- `Playfair Display` for expressive headings
- `Inter` for body and UI text

This pairing gives the site a mix of editorial confidence and product-interface readability.

---

## Motion and Interaction System

The portfolio uses interaction and motion as part of the brand experience.

### Key Interactions

- dark/light theme toggle with persistent preference
- dynamic image swapping between themes
- mobile navigation overlay
- active navigation glider
- scroll-triggered reveal animations
- title outline-to-fill transitions
- custom cursor for desktop/fine-pointer devices
- grid spotlight canvas background effect
- project category filtering
- project search UI
- floating resume download CTA

### Motion Philosophy

The motion direction should feel premium but not overwhelming.

Good motion in this project should:

- guide attention
- improve hierarchy
- support storytelling
- feel smooth and intentional
- respect reduced-motion preferences
- avoid slowing down the page

---

## Content Strategy

The portfolio content focuses on Nischhal's professional positioning.

Core themes include:

- Product Design
- Design Systems
- Enterprise UX
- Web3 Interfaces
- Fintech UX
- Website Design
- Branding and Strategy
- Case-study storytelling

The site is designed to work as both:

1. a personal brand website
2. a professional proof-of-work system

This means every page should communicate clearly and truthfully. Case studies should describe actual contribution, design process, decisions, constraints, and outcomes without exaggeration.

---

## SEO and Metadata

The static version includes page-level metadata, while the WordPress version supports more dynamic metadata and schema output.

### Recommended SEO Enhancements

- unique title and meta description per page
- Open Graph images
- Twitter/X card metadata
- structured data for person/profile context
- structured data for blog posts
- sitemap generation
- robots.txt
- canonical URLs
- optimized image alt text
- internal linking between homepage, projects, writing, and contact pages

### Portfolio SEO Focus

Useful keyword themes include:

- Product Designer Nepal
- UX Designer Nepal
- UI/UX Designer Nepal
- Product Design Portfolio
- Web3 Product Designer
- Fintech Product Designer
- Design Systems Designer
- Front-end aware Product Designer

These keywords should be used naturally in page copy, not forced.

---

## Accessibility and UX Notes

The project includes accessibility-minded decisions such as:

- semantic page structure
- theme preference support
- reduced-motion support
- responsive layouts
- mobile-specific interaction handling
- clear hierarchy and contrast-forward design

### Accessibility Checklist

- [ ] All images have meaningful alt text.
- [ ] Navigation works with keyboard.
- [ ] Focus states are visible.
- [ ] Theme toggle is accessible.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Forms have labels and validation messaging.
- [ ] Contrast is tested in both dark and light modes.
- [ ] Hover-only behavior has a non-hover fallback.

---

## Local Development

### Prerequisites

- Node.js LTS
- npm

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Preview static pages quickly

```bash
npm run preview:static
```

### Check links/assets

```bash
npm run check:links
```

### Build and preview

```bash
npm run build
npm run preview
```

---

## WordPress Installation

1. Copy the `wordpress/` directory into `wp-content/themes/`.
2. Rename the folder if needed, for example `nischhal-portfolio`.
3. Activate the theme from WordPress admin.
4. Configure menus.
5. Add project, product, and testimonial content.
6. Update Customizer settings.
7. Confirm assets are correctly referenced.
8. Test pages, archives, and single templates.

Reference file:

```text
wordpress/README.txt
```

---

## Deployment Options

This project can be deployed in two ways.

### Static Hosting

Suitable for:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages
- shared hosting

Typical settings:

```text
Build command: npm run build
Output directory: dist
```

### WordPress Hosting

Suitable for:

- managed WordPress hosting
- self-hosted WordPress
- local WordPress development environment
- staging/production WordPress workflow

---

## Quality Checklist

### Design QA

- [ ] Homepage hero communicates role clearly.
- [ ] Typography feels balanced across pages.
- [ ] Dark and light modes both feel designed.
- [ ] Project cards are scannable.
- [ ] Case-study pages support long-form reading.
- [ ] Contact CTA is visible and clear.
- [ ] Mobile menu works smoothly.

### Content QA

- [ ] All project claims are accurate.
- [ ] Case studies describe real contribution.
- [ ] Social links are correct.
- [ ] Resume file is updated.
- [ ] Contact details are correct.
- [ ] Blog/article content has proper metadata.

### Technical QA

- [ ] `npm install` works.
- [ ] `npm run dev` works.
- [ ] `npm run build` works.
- [ ] No console errors appear.
- [ ] Theme toggle persists correctly.
- [ ] Project filtering works.
- [ ] Search UI behaves as expected.
- [ ] WordPress templates render correctly if using theme mode.

---

## Roadmap

- Add real backend handling for contact form.
- Add image optimization workflow.
- Add WebP/AVIF responsive images.
- Add automated accessibility audits.
- Add performance budget checks.
- Add analytics/event tracking.
- Add CI workflow for link and build checks.
- Expand WordPress documentation.
- Create full project-specific case-study content.
- Improve asset self-hosting and CDN strategy.

---

## Ownership

Designed and developed by **Nischhal Raj Subba**.

GitHub: [@Nischhalsubba](https://github.com/Nischhalsubba)

---

## License and Usage

This repository contains a personal portfolio system. The code may be referenced for learning, but the brand, content, design direction, case-study copy, assets, and identity-specific material should not be reused without permission.
