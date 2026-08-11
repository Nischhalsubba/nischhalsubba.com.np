# Codebase Structure

This project is a static multi-page Vite portfolio deployed through Cloudflare Workers/static assets. Source organization is responsibility-first while compatibility materialization preserves the mature public/build contract.

## Canonical page source

`src/pages/` is grouped by route responsibility:

```txt
src/pages/
├── core/       # Homepage and primary navigation routes
├── projects/   # Individual project/case-study pages
└── services/   # Specialist service/search landing pages
```

The build materializer maps these files to historical root filenames only during development/build. Tracked source does not return to the repository root.

## Browser runtime

`src/scripts/` is grouped by responsibility:

```txt
src/scripts/
├── entrypoints/
├── shared/
└── features/
    ├── accessibility/
    ├── analytics/
    ├── content/
    ├── forms/
    ├── layout/
    ├── motion/
    ├── navigation/
    ├── portfolio/
    └── system/
```

Entrypoints orchestrate. Feature modules own one behavioral domain. Shared helpers remain dependency-light.

## Styles

`src/styles/style.css` remains the canonical production stylesheet because build/audit contracts intentionally enforce one served stylesheet. Supporting authored source is organized under `src/styles/systems/` and `src/styles/fragments/`.

## Build tooling

`scripts/` is an ordered transformation pipeline. Many historical stages compute repository paths relative to their own location, so they are not bulk-moved merely for aesthetics. Existing safe subdomains such as `scripts/repository/` and `scripts/spacious-pages/` remain grouped; new tooling should prefer responsibility folders when it does not depend on historical relative-path behavior.

## Documentation contract

Authored JS/TS/CSS/HTML/workflow files begin with a structured `@fileoverview` comment describing purpose, responsibilities, execution context, connected files, and maintenance constraints. JS/TS functions and callbacks carry function contracts describing purpose, inputs, side effects, and return behavior.

Run:

```bash
npm run audit:code-docs
npm run validate
```

Generated/vendor code is excluded and documented at its source/generator instead of being hand-edited.
