# Active portfolio design system

This branch uses the Apple/Open Design system as the active direction for the portfolio.

## Goal

Make the website feel like a senior product designer portfolio, not an SEO/service directory.

The system prioritizes:

- clear hiring conversion
- black/light chapter rhythm
- restrained Apple-style surfaces
- image-first project modules
- generous width and spacing
- consistent subpage/detail page treatment
- minimal shadows and crisp borders
- blue action semantics

## Active style files

The active visual system is layered in this order:

1. `style.css` — legacy base and shared existing components
2. `atelier-zero.css` — Open Design / Atelier structure
3. `atelier-fixes.css` — width and subpage layout fixes
4. `apple-atelier.css` — Apple-inspired neutralization layer
5. `apple-pages.css` — project/detail/subpage treatment
6. `apple-system-final.css` — final Apple system override and project showcase fixes

## Shared runtime

`src/scripts/features/atelier-pages.js` is responsible for applying the shared design chrome and detail-page normalization across subpages that still use older static HTML.

It injects/normalizes:

- top metadata strip
- side rails
- editorial nav
- Roman section rules
- subpage black hero chapters
- project/detail media cards
- article typography
- Apple-style content cards

## Pages that must stay uniform

- `/`
- `/home-v2`
- `/projects.html`
- `/about.html`
- `/contact.html`
- `/blog/`
- all `/project-*.html`
- all `/blog/*.html`

## Deprecated files

These files are from earlier explorations and should not be linked from any HTML page:

- `worldclass.css`
- `open-design-overrides.css`

They should be removed after the branch is approved if deletion is available.

## Footer rule

The footer should only include:

- Home
- Work
- About
- Writing
- Contact
- LinkedIn
- Behance
- GitHub
- Resume

Do not re-add placeholder product links such as UI Kit, System 2.0, or Icons.

## Project section rule

The homepage project section should be a wide black showcase chapter, not a narrow centered card stack.

Required structure:

- wide black chapter
- large heading on the left
- two large image-first cards on the right
- link to all selected work

## Deployment QA

Before merging or deploying, verify:

- `/` shows the Apple/Open Design system
- `/projects.html` uses the wide project catalog
- `/about.html` has the same topbar/nav/hero system
- `/contact.html` has the same topbar/nav/hero system
- `/blog/` has the same page system
- `/project-yarsha.html` has a black case hero and wide media card
- `/blog/blog-web3-products.html` has the article layout and no broken helper blocks
- resume PDF exists and is larger than 10 KB
