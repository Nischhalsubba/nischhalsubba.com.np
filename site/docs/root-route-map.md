# Route and Compatibility Map

The repository no longer treats root-level HTML as the canonical authored source. Canonical pages are organized under `src/pages/`, while repository tooling materializes selected historical root paths when development or build tools still require them.

This distinction matters. A file can appear at repository root during a build without becoming a second source of truth.

## Canonical page source

Pages are grouped by responsibility:

```text
src/pages/
├── core/       # Homepage, About, Contact, Projects, Services, Privacy, and other primary routes
├── projects/   # Project and case-study pages
└── services/   # Focused service and search-intent pages
```

Blog/article source is maintained through the repository's blog and content-generation owners. Route membership itself is controlled centrally rather than inferred from whichever HTML files happen to exist.

## Route source of truth

The authoritative public route and redirect inventory is:

```text
config/canonical-routes.json
```

It defines:

- canonical HTML outputs;
- retired routes;
- legacy redirects;
- the route set used by sitemap generation;
- the route set used by production redirect tooling.

Do not create another manually maintained canonical route list in a script or document.

## Compatibility materialization

The mapping between organized source and temporary root-compatible files is owned by:

```text
scripts/repository/source-layout.cjs
```

Related tooling includes:

```text
scripts/repository/materialize-root-sources.cjs
scripts/repository/sync-root-sources.cjs
scripts/repository/clean-root-sources.cjs
```

These tools allow historical build stages to keep working while the repository itself remains organized.

A compatibility path should exist only when an active consumer requires it. New code should depend on canonical source wherever practical.

## Core route group

Typical core source files live under:

```text
src/pages/core/
```

This group owns primary navigation destinations such as Home, Work, About, Services, Contact, Privacy, and other top-level public pages defined by the canonical route manifest.

## Project route group

Project and case-study pages live under:

```text
src/pages/projects/
```

Examples include routes for Yarsha, Mokshya, Hamro Idea, piHub, Masteriyo, Zapp, Orkest, Splashnode, Grid Labs, Zakra Furniture, Designerex, SassBoilerplate, and the Neverwinter parser project.

The canonical route manifest, not this prose list, determines which pages are currently part of production.

## Service route group

Focused service pages live under:

```text
src/pages/services/
```

Examples include product-design, Web3, SaaS, website UX, design-system, and UX-audit pages.

## Browser runtime

Do not add copies of shared JavaScript directly to each HTML page.

Browser code belongs under:

```text
src/scripts/
├── entrypoints/
├── features/
└── shared/
```

Feature implementation should stay with the domain that owns the behavior. Entrypoints should coordinate initialization rather than become another miscellaneous application file.

## Styles

Canonical styles belong under:

```text
src/styles/
```

`src/styles/style.css` owns the production stylesheet contract. Supporting systems and fragments should remain organized beneath the style source tree rather than accumulating as unrelated root-level patch files.

## Build tooling

Build-only logic belongs under:

```text
scripts/
```

Repository organization and compatibility tooling belongs under:

```text
scripts/repository/
```

Generated output should be repaired at its generator rather than hand-edited in `dist/` or another machine-owned location.

## Static and discovery files

Static assets belong in `assets/` or `public/` according to how the build consumes them.

Canonical crawler, manifest, ownership, and response-header source lives under:

```text
src/discovery/
```

The build materializes or copies these files to the required public locations.

## Safe route cleanup

Before moving, renaming, or deleting a page:

1. Check `config/canonical-routes.json`.
2. Check `scripts/repository/source-layout.cjs` for compatibility mappings.
3. Check `vite.config.ts` and the production build pipeline.
4. Search internal links and structured metadata for the existing route.
5. Check Worker and static redirect consumers.
6. Add a permanent redirect when an existing public route has a replacement.
7. Run search-discovery synchronization.
8. Run the relevant build and validation checks.
9. Verify the route after deployment.

A tidy folder tree is useful. A tidy folder tree that silently deletes public URLs is merely well-organized damage.
