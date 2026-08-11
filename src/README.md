# `src/`

Primary production source tree.

- `pages/` owns top-level HTML and project page source.
- `styles/` owns the single production stylesheet source.
- `runtime/` owns the stable browser entry template.
- `scripts/` owns modular browser features.
- `discovery/` owns crawler, SEO, AI-discovery, manifest, and header source files.
- `compat/` contains explicitly documented build-only legacy inputs.
- `worker.js` is the Cloudflare Worker/API router.
- `generated/` contains generated runtime modules.

See `docs/repository/file-map.md` for dependency connections and root materialization behavior.
