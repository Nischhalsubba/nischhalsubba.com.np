# `src/pages/`

Canonical source for every top-level production HTML page and project case study listed without a subdirectory in `config/canonical-routes.json`.

These files are connected to:

- `config/canonical-routes.json` for canonical route membership;
- `scripts/repository/materialize-root-sources.cjs`, which copies them to temporary root paths before Vite/build scripts run;
- `vite.config.ts` for multi-page build inputs;
- `scripts/copy-canonical-routes.cjs` and the SEO/build audits for production output.

Do not add retired or redirect-only pages here. Blog source remains under `blog/` because its directory already matches its content/public route grouping.
