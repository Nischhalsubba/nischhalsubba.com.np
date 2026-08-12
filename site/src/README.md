# `src/`

Primary production source tree for the portfolio.

## Structure

- `pages/` owns canonical HTML grouped into `core/`, `projects/`, and `services/`.
- `styles/` owns the canonical production stylesheet and supporting style systems/fragments.
- `runtime/` owns the stable browser-entry compatibility source used by existing page/build contracts.
- `scripts/` owns browser code split into entrypoints, shared helpers, and responsibility-based feature domains.
- `content/` owns structured portfolio, article, service, and route-related content used by generators or runtime code.
- `discovery/` owns crawler directives, response headers, browser manifest data, and human-readable ownership metadata.
- `compat/` contains explicitly documented historical inputs retained for build compatibility.
- `generated/` contains build-owned source that should be changed through its generator rather than by hand.
- `worker.js` is the Cloudflare Worker and API routing entry point.

## Source ownership

New authored production code should normally live under `src/` rather than at repository root.

Some historical tools still require temporary root-level files. Those paths are materialized from canonical source by the repository tooling in `scripts/repository/`. A compatibility copy is not a second source of truth.

## Documentation

Authored code files are governed by `config/repository/code-documentation-policy.json`.

File-level documentation should explain the file's purpose, responsibilities, execution context, important connections, and maintenance constraints. Function comments should explain purpose, inputs, side effects, and return behavior in plain engineering language.

Generated, vendored, bundled, or minified output should be documented at its source or generator instead of being manually annotated.

See:

- `docs/codebase-structure.md`
- `docs/repository/file-map.md`
- `scripts/repository/README.md`
