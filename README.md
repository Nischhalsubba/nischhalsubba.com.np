# Nischhal Raj Subba Portfolio Website

Designed and developed by **Nischhal Raj Subba**.

This repository contains the full source of my personal portfolio platform: a premium, dark-first, animation-rich website built to showcase product design work, writing, background, and contact channels.  
The codebase supports **two modes**:

1. **Static multi-page portfolio** (direct HTML/CSS/JS)
2. **WordPress theme version** (`wordpress/`) for CMS-driven publishing

---

## 1) Project Vision

This site is intentionally crafted as both a personal brand experience and a design-system-driven product:

- Communicate credibility in enterprise UX, design systems, and Web3 product design
- Keep visual quality high without sacrificing performance
- Preserve editorial clarity for case studies and long-form writing
- Ensure consistent behavior across desktop and mobile
- Maintain a scalable structure that can run as static pages or as a WordPress theme

---

## 2) Design Direction

### Core Principles

- **Clarity over decoration**: strong hierarchy, clean spacing, readable typography
- **Premium motion**: animation is used for storytelling, not just effects
- **System-first styling**: reusable tokens and component-level consistency
- **Dark-first with light-mode parity**: both themes are designed, not inverted
- **Human interaction details**: micro-interactions, cursor states, hover behaviors, smooth transitions

### Visual Language

- Serif + sans pairing for editorial and product-like contrast
- High-contrast headlines with outline-to-fill reveal treatment
- Frosted/glass navigation pill and floating utility controls
- Grid/spotlight background layer for depth
- Refined card system for projects, writing, testimonials, and content modules

### Typography

- Headings: `Playfair Display`
- Body/UI text: `Inter`
- Loaded from Google Fonts in the static version and dynamically via Customizer in WordPress

---

## 3) Experience Architecture (Pages)

The static site includes the following pages:

- `index.html` - home, hero, achievements, selected work, testimonials, insights, CTA
- `projects.html` - full project listing with filters and search
- `project-detail.html` - case study layout with role, process, and outcomes
- `about.html` - background, experience timeline, education, awards, skills
- `blog.html` - writing index
- `blog-detail.html` - article detail
- `products.html` - digital products section
- `contact.html` - contact details + message form UI

WordPress template equivalents are available under `wordpress/` (e.g., `front-page.php`, `page-about.php`, `archive-project.php`, `single-project.php`).

---

## 4) Technical Stack

### Core

- **HTML5**
- **CSS3** (custom properties, responsive layouts, utility patterns)
- **JavaScript (ES2022)** for interactions and UI state

### Motion & Interaction

- **GSAP** (`gsap.min.js`)
- **GSAP ScrollTrigger** for scroll-linked reveals and sequence timing

### Build/Tooling

- **Node.js**
- **Vite** (dev server, build, preview)
- **TypeScript config** present for modern bundler/compiler setup

### CMS Layer

- **WordPress custom theme** implementation in `wordpress/`
- Dynamic menus, custom post types, custom fields, Customizer controls, schema output

---

## 5) Repository Structure

```text
.
|-- about.html
|-- blog.html
|-- blog-detail.html
|-- contact.html
|-- index.html
|-- projects.html
|-- project-detail.html
|-- products.html
|-- style.css
|-- script.js
|-- assets/
|   |-- resume.pdf
|   |-- images/
|   |-- scripts/
|   `-- styles/
|-- wordpress/
|   |-- functions.php
|   |-- front-page.php
|   |-- header.php
|   |-- footer.php
|   |-- style.css
|   `-- js/main.js
|-- package.json
|-- vite.config.ts
`-- tsconfig.json
```

---

## 6) Key Frontend Features

- Theme toggle (dark/light) with persistent preference (`localStorage`)
- Dynamic image swapping per theme for portrait assets
- Animated mobile navigation overlay
- Active navigation glider behavior
- Scroll-triggered reveal animations
- Title outline-to-fill transition
- Interactive custom cursor (desktop/fine pointer only)
- Grid spotlight canvas background effect
- Category filtering for projects
- Search UI in work listing
- Floating resume download CTA

Performance safeguards:

- Reduced effects on touch devices
- `prefers-reduced-motion` support
- Conditional activation of heavier interactions

---

## 7) WordPress Theme Capabilities

The `wordpress/` folder extends the same design language into a CMS-managed theme with:

- Theme supports: thumbnails, custom logo, HTML5 features, responsive embeds, editor styles
- Registered menus: primary + footer
- Custom post types:
  - `project`
  - `product`
  - `testimonial`
- Custom taxonomy:
  - `project_category`
- Custom meta fields for project, product, writing, and testimonial content
- Extensive **Customizer** controls for:
  - Typography
  - Dark/light color tokens
  - Hero text/buttons/ticker
  - Interaction settings (cursor, animation speed, performance mode)
  - Footer content and social links
- JSON-LD schema output (Person / BlogPosting context)

---

## 8) Design System Notes

Main design tokens live in CSS variables (`:root` and `[data-theme="light"]`) and cover:

- Color palette (backgrounds, text tiers, borders, accents)
- Typography families
- Layer/z-index strategy
- Motion easings
- Spacing, container sizes, and responsive clamps

This creates consistent visual behavior across static and WordPress implementations.

---

## 9) Personal Branding & Content Focus

The portfolio emphasizes:

- Product Design
- Design Systems
- Enterprise UX
- Web3 interfaces
- Fintech problem spaces

Public-facing channels integrated in the website:

- LinkedIn
- Behance
- Uxcel
- Dribbble
- Figma
- X (Twitter)
- Email contact

---

## 10) Local Development

### Prerequisites

- Node.js (LTS recommended)
- npm

### Run in development

```bash
npm install
npm run dev
```

### Build and preview

```bash
npm run build
npm run preview
```

### Available scripts

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build locally

---

## 11) WordPress Installation (Theme Mode)

1. Copy the `wordpress/` directory into `wp-content/themes/`
2. Rename folder if needed (example: `nischhal-portfolio`)
3. Ensure `assets/` resources are present and correctly referenced
4. Activate theme in **Appearance > Themes**
5. Configure content through:
   - Projects / Products / Testimonials post types
   - Posts (writing/blog)
   - Customizer sections for design and homepage controls
   - Menus for navigation

Reference: `wordpress/README.txt`

---

## 12) Content Editing Guide (Static Mode)

- Homepage hero and featured areas: `index.html`
- About timeline and profile narrative: `about.html`
- Work cards/filters: `projects.html`
- Case-study detail content: `project-detail.html`
- Writing archive and article detail: `blog.html`, `blog-detail.html`
- Contact info and form UI: `contact.html`
- Global styling: `style.css`
- Interaction/motion logic: `script.js`

---

## 13) Asset Notes

- Resume file: `assets/resume.pdf`
- Local image assets are in `assets/images/`
- Some demo visuals are remote-hosted image URLs (Unsplash / Imgur) in HTML content

If you move to full self-hosting/CDN, replace external URLs with local or managed asset paths.

---

## 14) SEO & Metadata

Static version includes page-level titles/descriptions.  
WordPress version adds structured data output via `nischhal_seo_schema()` and customizable content through theme options.

---

## 15) Accessibility & UX Considerations

- Semantic HTML structure and descriptive links
- Theme toggle for user preference
- Motion reduction path for accessibility/performance
- Mobile-specific interaction handling
- Clear text hierarchy and contrast-forward palette

---

## 16) Deployment Options

This project can be deployed as:

1. **Static website** (Netlify, Vercel, GitHub Pages, traditional hosting)
2. **WordPress theme** on managed or self-hosted WordPress infrastructure

---

## 17) Roadmap (Practical Next Enhancements)

- Form backend integration for `contact.html`
- Image optimization pipeline (WebP/AVIF + responsive `srcset`)
- Optional analytics/events instrumentation
- Internationalization-ready content structure
- Automated accessibility and performance audits in CI

---

## 18) Ownership

This website and its portfolio system are designed and developed by **Nischhal Raj Subba**.
