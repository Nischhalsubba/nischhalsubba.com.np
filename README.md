# Nischhal Raj Subba Portfolio

Production portfolio for Nischhal Raj Subba, a product designer working across SaaS, Web3, fintech, software products, service websites, design systems, UX audits, and developer-ready handoff.

The site is built as a multi-page Vite application and deployed through Cloudflare Workers with static assets. The repository keeps authored source organized under `src/` while compatibility tooling temporarily exposes selected files at historical root paths required by the existing build pipeline.

## Technology

- Vite
- TypeScript and JavaScript
- HTML and CSS
- Cloudflare Workers and static assets
- Node.js build and repository tooling

## Repository structure

```text
.
├── .github/                    # CI, QA, and deployment workflows
├── assets/                     # Authored images and other source assets
├── config/                     # Canonical route and repository policies
├── docs/                       # Architecture, SEO, deployment, and maintenance docs
├── functions/                  # Cloudflare-compatible API handlers
├── public/                     # Static files that bypass source compilation
├── scripts/                    # Build, generation, audit, and maintenance tooling
│   └── repository/             # Repository structure and source-layout tooling
├── src/
│   ├── compat/                 # Historical compatibility source
│   ├── content/                # Structured portfolio and writing data
│   ├── discovery/              # Sitemap, robots, headers, manifest, ownership metadata
│   ├── generated/              # Generated source owned by build tooling
│   ├── pages/
│   │   ├── core/               # Primary site pages
│   │   ├── projects/           # Project and case-study pages
│   │   └── services/           # Service and search-intent pages
│   ├── runtime/                # Stable browser entry compatibility layer
│   ├── scripts/
│   │   ├── entrypoints/        # Browser bootstrap modules
│   │   ├── features/           # Feature-specific browser behavior
│   │   └── shared/             # Reusable browser helpers
│   ├── styles/                 # Canonical stylesheet source and supporting systems
│   └── worker.js               # Cloudflare Worker and API routing entry point
├── tests/                      # Automated and visual quality checks
├── package.json                # Project commands and dependency contract
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite multi-page build configuration
└── wrangler.jsonc              # Cloudflare Worker and static-asset configuration
```

For the detailed source-layout rules, see `docs/codebase-structure.md` and the documentation under `scripts/repository/` and `src/`.

## Canonical source and compatibility files

Authored page, runtime, style, and discovery source belongs under `src/`.

Some historical build stages still expect selected files at repository root. `scripts/repository/source-layout.cjs` owns the mapping between canonical source and those temporary compatibility paths.

The standard flow is:

1. Materialize compatibility files from canonical source.
2. Run source generation and normalization.
3. Synchronize approved source changes where the mapping explicitly permits it.
4. Build production output into `dist/`.
5. Remove or ignore temporary compatibility files according to repository policy.

Do not move a root compatibility file or change one of these mappings without checking every build, audit, routing, and deployment consumer first.

## Development

Install the locked dependency tree:

```bash
npm ci
```

Start the local development server:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run the full repository validation suite:

```bash
npm run validate
```

Useful focused checks include:

```bash
npm run lint
npm run audit:repo-structure
npm run audit:code-docs
npm run audit:seo
npm run audit:seo-contract
npm run audit:seo-discovery
npm run test:smoke
```

## Browser runtime

Browser behavior is organized by responsibility under `src/scripts/`.

- `entrypoints/` decides which features load on a route.
- `features/` owns behavior for one domain such as navigation, forms, accessibility, analytics, content, motion, or layout.
- `shared/` contains dependency-light helpers reused by multiple features.
- `src/runtime/script.js` preserves the stable public runtime entry used by existing pages and build tooling.

Entrypoints should orchestrate rather than absorb feature implementation. New browser behavior should normally live in the feature folder that owns it.

## Styles

`src/styles/style.css` is the canonical production stylesheet source. Supporting systems and fragments live beneath `src/styles/`.

Before adding another stylesheet, check whether the rule belongs in the existing design system or component structure. The build and audit pipeline intentionally protects the single production stylesheet contract.

## Routes and SEO

`config/canonical-routes.json` is the source of truth for canonical HTML output and legacy redirects.

The search-discovery pipeline generates and validates:

- clean canonical URLs;
- `sitemap.xml`;
- `robots.txt`;
- static and Worker redirects;
- Open Graph and Twitter metadata;
- structured data;
- deterministic social preview images.

Do not hand-maintain duplicate route lists in unrelated scripts. See `docs/seo-maintenance.md` for the full contract.

## Contact API

The contact page submits to:

```text
POST /api/contact
```

The production flow uses the Cloudflare Worker and contact handler for server-side validation, abuse protection, Turnstile verification, and email delivery.

Required deployment configuration includes:

- `TURNSTILE_SITE_KEY` build variable;
- `TURNSTILE_SECRET_KEY` runtime secret;
- `CONTACT_EMAIL` email binding.

Secrets and account credentials must never be committed to the repository.

## Code documentation standard

Authored source files should begin with a useful file-level description that explains:

- why the file exists;
- what responsibilities it owns;
- where and when it executes;
- which important files or systems depend on it;
- what maintainers should be careful about when changing it.

Functions and meaningful callbacks should explain their purpose, inputs, side effects, and return behavior in plain engineering language. Comments should explain intent and contracts rather than narrating obvious syntax.

Generated, vendored, minified, and machine-owned output should be documented at its generator or owner instead of being manually edited.

The documentation contract is checked by:

```bash
npm run audit:code-docs
```

## Testing and quality

The repository contains build, lint, SEO, structure, accessibility, content, browser, smoke, and visual-regression checks.

Before a production change is considered complete:

1. Run the relevant focused checks while developing.
2. Run `npm run validate` for the integrated repository contract.
3. Review browser or visual changes at representative mobile and desktop sizes.
4. Verify affected production routes after deployment.
5. Confirm account-dependent behavior such as contact delivery in the deployed environment.

## Deployment

Production is deployed through Cloudflare Workers with static assets from `dist/`.

The deployment configuration is owned by `wrangler.jsonc` and the workflows under `.github/workflows/`.

A successful source push is not proof of a successful production deployment. Deployment status and the live site must both be verified before considering a release complete.

Additional production safety rules are documented in `docs/deployment-safety.md`.

## Maintenance principles

- Prefer framework- and platform-native organization over arbitrary folder conventions.
- Keep source ownership obvious and dependencies directional.
- Keep entrypoints thin and feature implementation close to the domain that owns it.
- Remove obsolete generators and compatibility layers only after tracing their consumers.
- Avoid generic dumping grounds such as oversized `utils`, `misc`, or patch folders.
- Preserve public routes and deployment contracts during structural refactors.
- Keep documentation synchronized with actual repository behavior.
- Favor small, reviewable changes over unverified bulk rewrites.
