# Style Architecture

The live site currently keeps its main CSS at the repository root for compatibility with existing static HTML pages:

```txt
style.css
seo-ui-enhancements.css
```

This folder documents the target design-system structure. The next safe refactor should move CSS into these modules and keep a small root compatibility file that imports the bundled output.

## Target structure

```txt
src/styles/
├── tokens.css        Design tokens: colors, spacing, type scale, radii, shadows, z-index.
├── base.css          Reset, document defaults, typography defaults, selection styles.
├── layout.css        Containers, grids, sections, page shells, article layout.
├── components.css    Buttons, cards, nav, footer, chips, forms, filters.
├── pages.css         Homepage, projects, about, contact, blog, project-detail overrides.
├── effects.css       Cursor, motion, grid, ambient background, focus states.
└── index.css         Import order for the full style system.
```

## Import order

CSS should be layered from foundation to specific rules:

```css
@import './tokens.css';
@import './base.css';
@import './layout.css';
@import './components.css';
@import './pages.css';
@import './effects.css';
```

## Rules

- Put reusable values in `tokens.css` before adding one-off values elsewhere.
- Put generic UI patterns in `components.css`.
- Put route-specific rules in `pages.css`.
- Put animated or decorative behavior in `effects.css`.
- Do not add new visual rules directly to HTML inline styles unless unavoidable.
- Keep reduced-motion and focus-visible states with the component/effect they belong to.
- Prefer CSS custom properties over repeated hard-coded values.

## Compatibility plan

1. Keep `style.css` and `seo-ui-enhancements.css` live while refactoring.
2. Move tokens and low-risk shared rules into `src/styles/` first.
3. Build a generated or manually imported root stylesheet.
4. Update one page category at a time.
5. Run `npm run build` after every slice.

The goal is boring stability. Websites should be dramatic in the interface, not in the deployment logs.
