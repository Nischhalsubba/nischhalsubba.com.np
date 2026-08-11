# `src/`

Primary production source tree.

- `pages/` owns canonical HTML grouped into `core/`, `projects/`, and `services/`.
- `styles/` owns the canonical stylesheet plus reusable systems and composable fragments.
- `runtime/` owns the stable compatibility browser entry template.
- `scripts/` owns browser code split into entrypoints, shared helpers, and responsibility-based feature domains.
- `content/` owns structured content used by generators/runtime code.
- `discovery/` owns crawler, SEO, AI-discovery, manifest, and header source files.
- `compat/` contains explicitly documented build-only legacy inputs.
- `worker.js` is the Cloudflare Worker/API router.
- `generated/` contains machine-generated runtime modules and is excluded from hand-documentation.

Every authored code file is governed by `config/repository/code-documentation-policy.json`. See `docs/repository/file-map.md` and `docs/repository/file-catalog.md` for ownership and dependency connections.
