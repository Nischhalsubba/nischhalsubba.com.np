# Repository File Map

This document describes ownership boundaries in the portfolio repository: what belongs at root, what belongs under canonical source folders, and which systems consume each area.

## Root policy

Repository root is reserved for configuration and ecosystem entry files that tools conventionally discover there. Production page source, browser feature source, styles, discovery source, and design documentation should remain in organized folders.

| Root file | Purpose | Connected to |
|---|---|---|
| `.editorconfig` | Shared editor whitespace and formatting defaults. | Editors and IDEs. |
| `.gitignore` | Ignores dependencies, generated output, editor files, and temporary compatibility source. | Repository/build tooling. |
| `README.md` | Maintainer-facing repository overview and operating guide. | Source, build, validation, and deployment documentation. |
| `package.json` | Node dependencies and authoritative development/build/audit command surface. | npm, Vite, scripts, CI. |
| `package-lock.json` | Reproducible npm dependency graph. | `npm ci`, dependency auditing. |
| `tsconfig.json` | TypeScript and editor compiler configuration. | Vite configuration and development tooling. |
| `vercel.json` | Secondary deployment compatibility configuration. | Vercel integration when used. |
| `vite.config.ts` | Vite multi-page build configuration. | Materialized compatibility files and production build tooling. |
| `wrangler.jsonc` | Cloudflare Worker, static-asset, and binding configuration. | `src/worker.js` and Cloudflare deployment. |

The exact root allow-list is enforced by `config/repository/root-policy.json` and `scripts/repository/audit-repository-structure.cjs`.

## Canonical source folders

| Path | Ownership | Connected to |
|---|---|---|
| `src/pages/core/` | Canonical primary-page HTML source. | Canonical route manifest, source materializer, Vite/build pipeline. |
| `src/pages/projects/` | Canonical project and case-study HTML source. | Canonical route manifest, project generation/normalization, build pipeline. |
| `src/pages/services/` | Canonical service and search-intent page source. | Canonical route manifest, SEO/content tooling, build pipeline. |
| `blog/` | Article and blog-index source owned by the writing/content pipeline. | Canonical route manifest, article generators, Vite/build normalization. |
| `src/styles/style.css` | Canonical production stylesheet. | Compatibility materialization, static asset assembly, CSS audits. |
| `src/styles/systems/` | Reusable style-system source. | Canonical stylesheet compilation and design-system audits. |
| `src/styles/fragments/` | Composable style fragments retained by current build tooling. | Stylesheet compilation and historical transformation stages. |
| `src/runtime/script.js` | Stable browser runtime compatibility entry. | Materialized as `/script.js`; loads the organized runtime entrypoint. |
| `src/scripts/entrypoints/` | Route/bootstrap orchestration. | `src/runtime/script.js`, browser feature modules. |
| `src/scripts/features/` | Feature-domain browser behavior. | Entrypoints, page markup, shared helpers. |
| `src/scripts/shared/` | Dependency-light browser helpers. | Multiple feature modules and entrypoints. |
| `src/content/` | Structured project, article, service, and route metadata. | Content generators and validation tooling. |
| `src/discovery/` | Crawler directives, response headers, web manifest, and ownership metadata. | Search generator, source materializer, static asset assembly. |
| `src/compat/legacy-pages/` | Historical page inputs retained only where active build compatibility requires them. | Vite input map, cleanup scripts, source-layout mapping. |
| `src/generated/` | Build-owned source such as generated redirect modules. | Generators and runtime consumers. |
| `src/worker.js` | Cloudflare Worker and API routing entry point. | `wrangler.jsonc`, redirects, contact/API handlers. |

## Supporting folders

| Path | Purpose | Connected to |
|---|---|---|
| `.github/workflows/` | CI, browser QA, production QA, and deployment workflows. | `package.json` commands and deployment configuration. |
| `api/` | Deployment-compatible API surface retained for supported targets. | Contact and server behavior. |
| `functions/api/` | Cloudflare-compatible function handlers. | Contact form and Worker/deployment configuration. |
| `assets/` | Authored images, project media, icons, and downloadable source assets. | Page markup, styles, static asset assembly. |
| `public/` | Static passthrough resources deliberately copied without source compilation. | Vite and static-asset build stages. |
| `config/` | Canonical route definitions and repository/build policy. | Build, redirects, audits, content tooling. |
| `data/` | Structured legacy or supporting data consumed by generators and scripts. | Generation and migration tooling. |
| `docs/` | Architecture, quality, deployment, SEO, and maintenance documentation. | Maintainers and repository checks. |
| `scripts/` | Build stages, generators, normalizers, audits, migrations, and QA utilities. | `package.json`, workflows, production build. |
| `scripts/repository/` | Repository organization, materialization, catalog, and policy tooling. | Root policy, source layout, documentation generation. |
| `tests/` | Browser, responsive, visual-regression, fixture, and smoke-test contracts. | Validation and production QA workflows. |

## Compatibility materialization

The organized source tree is the tracked source of truth. Some established build stages still consume historical root paths, so `scripts/repository/materialize-root-sources.cjs` creates temporary compatibility copies before development or build operations.

The central mapping lives in:

```text
scripts/repository/source-layout.cjs
```

Useful commands:

```bash
npm run prepare:sources
npm run dev
npm run build
npm run generate
npm run audit:repo-structure
npm run clean:sources
```

`npm run generate` is the intentional source-generation workflow. Compatibility files should not become casually edited parallel source.

## Generated output

Generated, bundled, minified, and copied output should be changed through the owning source or generator.

Important examples include:

- `dist/` production output;
- `src/generated/` generated modules;
- generated social previews;
- materialized root compatibility files;
- `docs/repository/file-catalog.md`, which is produced by repository catalog tooling.

Hand-editing generated output may appear to work until the next build politely erases the evidence.

## Historical cleanup policy

Repository cleanup may remove files when all of the following are true:

1. they are not canonical source;
2. no active build/runtime/deployment consumer references them;
3. their public route is absent or safely redirected;
4. their responsibility is already owned elsewhere;
5. repository validation is updated to reflect the removal.

Do not keep obsolete scripts solely because their filenames look important. Equally, do not delete ugly historical stages until their consumers and ordering constraints are understood.

## Naming rules

- Folders use lowercase kebab-case unless an ecosystem convention requires otherwise.
- Canonical page filenames remain aligned with route/build identifiers where that keeps mapping explicit.
- Browser runtime source is grouped by responsibility rather than accumulated as versioned patch files.
- Historical compatibility files live under `src/compat/` and must have a documented reason to exist.
- New root files require an explicit root-policy change.
- New scripts should be named for the behavior they own, not for the temporary project phase that created them.
