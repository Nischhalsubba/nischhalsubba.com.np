# Repository file map

This document is the human-readable ownership and dependency map for the portfolio repository. It explains what each file group does, where its source of truth lives, and which build/runtime files consume it.

## Root policy

The repository root is intentionally reserved for tools that conventionally discover configuration there. Production page source, runtime source, discovery files, and design documentation must not be tracked at root.

| Root file | Purpose | Connected to |
|---|---|---|
| `.editorconfig` | Cross-editor whitespace and formatting defaults. | Editors and IDEs. |
| `.gitignore` | Ignores dependencies, build output, editor files, and materialized compatibility sources. | `scripts/repository/source-layout.cjs`. |
| `AGENTS.md` | Deployment and automated-edit safety contract. | Build/QA workflows and automated contributors. |
| `README.md` | GitHub-facing branch/repository overview. | `.github/workflows/apply-interactive-readme.yml`. |
| `package.json` | Node scripts, dependency declarations, validation entry points. | `scripts/`, Vite, npm, GitHub Actions. |
| `package-lock.json` | Reproducible npm dependency graph. | `npm ci`, dependency audit. |
| `tsconfig.json` | TypeScript tooling defaults. | `vite.config.ts`, editor tooling. |
| `vercel.json` | Secondary Vercel compatibility/deployment configuration. | Vercel integration. |
| `vite.config.ts` | Multi-page Vite build configuration and SEO transforms. | Materialized root page compatibility files, `npm run build`. |
| `wrangler.jsonc` | Cloudflare Worker/static asset bindings and deployment configuration. | `src/worker.js`, Cloudflare deployment workflow. |

The exact allow-list is machine-enforced by `config/repository/root-policy.json` and `scripts/repository/audit-repository-structure.cjs`.

## Source folders

| Path | What lives here | Connected to |
|---|---|---|
| `src/pages/*.html` | Canonical source for top-level site pages and project case studies. | `config/canonical-routes.json`, `scripts/repository/materialize-root-sources.cjs`, Vite. |
| `blog/**/*.html` | Blog index and article source pages. This folder was already correctly grouped and remains at its public content path. | Canonical route manifest, Vite, blog normalization scripts. |
| `src/styles/style.css` | Single authored production stylesheet. | Materialized as `/style.css`, `scripts/copy-static-assets.cjs`, CSS audits. |
| `src/runtime/script.js` | Stable browser-runtime compatibility entry template. | Materialized as `/script.js`, imports `src/scripts/main.js`. |
| `src/scripts/**/*.js` | Modular browser features such as navigation, theme, analytics, interactions, and accessibility behavior. | `src/runtime/script.js`, production HTML. |
| `src/discovery/*` | SEO/AI/crawler and deployment metadata sources: sitemap, robots, llms files, AI profile, manifest, humans, and headers. | `scripts/generate-seo-discovery.cjs`, materializer, `scripts/copy-static-assets.cjs`. |
| `src/compat/legacy-pages/*` | Three retired HTML inputs still required by the current Vite input map. They are built only for compatibility and are removed from production output. | `vite.config.ts`, `scripts/clean-vite-public-output.cjs`. |
| `src/worker.js` | Cloudflare Worker and API router. | `wrangler.jsonc`, contact/API routes. |
| `src/generated/*` | Generated runtime data such as redirect modules. | SEO discovery generator and Worker/runtime code. |

## Supporting folders

| Path | Purpose | Connected to |
|---|---|---|
| `.github/workflows/` | CI, browser QA, production QA, README automation, and deployment workflows. | `package.json` scripts and production deployment. |
| `api/` | Server/API compatibility surface used by supported deployment targets. | Contact/API behavior. |
| `functions/api/` | Cloudflare function-style contact handler compatibility. | Contact form and deployment configuration. |
| `assets/` | Authored images, project media, icons, and downloadable artifacts copied to production. | HTML/CSS and `scripts/copy-static-assets.cjs`. |
| `public/` | Static passthrough assets that are safe to copy directly. HTML/CSS/JS and discovery files are intentionally excluded by the copy audit. | Vite/build copy stage. |
| `config/` | Route contracts and repository/build policy. | Build, SEO, redirects, repository audit. |
| `data/` | Structured content/data consumed by generators and scripts. | Generation and content tooling. |
| `docs/` | Architecture, quality gates, design system, and maintenance documentation. | Human contributors and automation contracts. |
| `scripts/` | Build stages, generators, normalizers, audits, and QA utilities. Existing script names are retained because many stages require each other by stable relative path. | `package.json`, GitHub Actions, build pipeline. |
| `tests/` | Browser, responsive, visual regression, and fixture/test contracts. | Browser/production QA workflows. |

## Compatibility materialization

The organized source tree is the only tracked source of truth. Some mature build scripts still consume historical root paths. `scripts/repository/materialize-root-sources.cjs` copies the organized files to those paths before development/build. Those compatibility copies are ignored by Git and are never the canonical source.

Use:

```bash
npm run prepare:sources
npm run dev
npm run build
npm run generate
npm run audit:repo-structure
npm run clean:sources
```

`npm run generate` synchronizes intentional generated source changes back into the organized source tree.

## Removed material

The cleanup removes material that is not part of the current Cloudflare/Vite production architecture:

- duplicate root WordPress PHP theme files and the legacy `wordpress/` theme directory;
- deprecated `index.tsx` placeholder;
- obsolete deployment zip marker `deploy-version.txt`;
- unused AI-studio-style `metadata.json`;
- retired root blog HTML copies not present in the canonical route contract;
- retired project/media pages already covered by redirects;
- retired root runtime patches (`detail-navigation.js`, `seo-enhancements.js`, `site-polish.js`).

The production site continues to use clean canonical routes and the existing redirect contract. Retired public outputs remain blocked by `config/canonical-routes.json` and `scripts/clean-vite-public-output.cjs`.

## Naming rules

- Folders use lowercase kebab-case or established platform names (`.github`, `src`, `api`).
- Canonical page filenames match their production/build identifiers to keep route mapping explicit.
- Runtime source is grouped by responsibility instead of version suffixes.
- Historical compatibility files live only under `src/compat/` and must include a reason for existing.
- New root files require an explicit root-policy change and CI review.
