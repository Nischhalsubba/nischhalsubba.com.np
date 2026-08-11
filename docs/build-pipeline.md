# Build Pipeline

This repository is a multi-page Vite site with a deliberately explicit production pipeline. Vite creates the initial output, then repository-owned build stages assemble canonical routes, copy static assets, normalize shared behavior and styling, generate supporting assets, and enforce production contracts.

The pipeline is longer than a typical `vite build` because the repository still contains historical transformation stages that must execute in a known order. Removing or reordering them without tracing dependencies can produce a build that looks successful while silently changing pages.

## Primary commands

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Generate or normalize canonical source intentionally:

```bash
npm run generate
```

Build production output:

```bash
npm run build
```

Run the integrated validation suite:

```bash
npm run validate
```

## Source preparation

Canonical authored source lives under `src/`, but several established build tools still consume historical root paths.

Before development and production builds, repository tooling materializes required compatibility files from canonical source. The mapping is owned by:

```text
scripts/repository/source-layout.cjs
```

Do not manually create a second source-of-truth file at repository root. Update the canonical source and the compatibility mapping only when a root path is genuinely required by an active build consumer.

## Production build owner

The production build is orchestrated by:

```text
scripts/build-dist.cjs
```

That file contains the authoritative ordered stage list. The stages can be understood in several phases.

### Phase 1: preflight and base build

The pipeline first checks build-script syntax, runs Vite, cleans unwanted initial public output, and copies canonical HTML routes.

This establishes the baseline `dist/` tree before later transformations operate on it.

### Phase 2: static assets and canonical page composition

The build then copies approved static assets and composes or normalizes core public surfaces such as:

- Home;
- Work / Projects;
- About;
- Contact;
- Services;
- project and article detail pages.

`scripts/copy-static-assets.cjs` owns the approved static-file copy behavior and the shared HTML normalization applied during that stage.

### Phase 3: shared design and responsive contracts

Several stages enforce repository-wide UI contracts such as:

- one production stylesheet;
- typography rules;
- responsive guardrails;
- navigation consistency;
- semantic headings;
- breadcrumbs and detail-page wayfinding;
- mobile layout behavior;
- shared shell structure;
- accessibility-oriented visual fixes.

Many of these scripts are historical compatibility stages. Keep them in the documented order until their responsibilities have been consolidated and validated elsewhere.

### Phase 4: content and case-study refinement

Later build stages refine portfolio content, case-study structure, article presentation, project-specific copy, and final sitewide metadata.

These transforms should operate on production output rather than introduce parallel source ownership. New content systems should prefer the canonical `src/content/` and `src/pages/` layers instead of adding another one-off patch stage.

### Phase 5: production integrations and generated assets

The build also prepares production-specific resources including:

- the resume PDF;
- contact-page protection and Cloudflare integration markup;
- canonical redirects and clean URL handling;
- social preview images;
- stable browser runtime references;
- crawler and platform discovery files.

### Phase 6: final production checks

Repository audits validate required output, route behavior, metadata, shared UI contracts, and other release requirements.

A build should be treated as complete only when the relevant validation steps succeed and affected routes have been reviewed.

## Search discovery

Search and routing files are generated from repository-owned sources rather than manually duplicated route lists.

Important owners include:

```text
config/canonical-routes.json
scripts/generate-seo-discovery.cjs
scripts/seo-discovery-lib.cjs
src/discovery/
```

See `docs/seo-maintenance.md` for canonical routes, sitemap, robots, redirect, cache-header, and social-preview rules.

## Static asset rules

`scripts/copy-static-assets.cjs` copies only approved public resources into `dist/` and then normalizes generated HTML.

The build deliberately distinguishes between:

- authored source assets;
- public files copied without compilation;
- generated output;
- browser runtime modules;
- canonical discovery files.

Do not add a file to a copy list merely because it needs to appear in `dist/`. First determine which source layer should own it.

## Generated output

`dist/` is production output, not authored source.

Generated, bundled, minified, or copied output should be fixed at its source or generator. Hand-editing `dist/` creates changes that disappear on the next build and makes debugging needlessly theatrical.

## Deployment

Production is configured for Cloudflare Workers with static assets.

The relevant configuration and automation live in:

```text
wrangler.jsonc
.github/workflows/
```

The production output directory is:

```text
dist/
```

Do not apply framework deployment settings that do not match this repository. This is a Vite multi-page site with a Cloudflare Worker, not a Next.js application.

## Before deployment

At minimum:

```bash
npm run build
npm run validate
```

Then verify representative routes and production resources, including:

```text
/
/projects
/about
/services
/contact
/blog/
/project-yarsha
/robots.txt
/sitemap.xml
```

Account-dependent behavior such as contact email delivery and Turnstile verification must be tested in an environment with the real Cloudflare bindings.

## Adding or moving a page

1. Put canonical source in the correct folder under `src/pages/`.
2. Update `config/canonical-routes.json` when the public route changes.
3. Update compatibility mappings only when an active tool still requires a historical root path.
4. Update internal links and relevant structured metadata.
5. Add a redirect when retiring an existing public URL.
6. Run search-discovery synchronization.
7. Run the relevant focused checks and the full validation suite.
8. Verify the production route after deployment.

A page move is an architectural change, not just a filesystem operation. Treat it accordingly and the website is much less likely to retaliate.
