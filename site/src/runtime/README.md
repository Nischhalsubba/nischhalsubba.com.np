# `src/runtime/`

Owns the stable browser runtime entry template.

`script.js` is copied to repository root as a git-ignored compatibility file before development/build. The materialized `/script.js` imports the modular browser runtime from `src/scripts/entrypoints/main.js`.

Connected files:

- `src/scripts/entrypoints/main.js` and feature modules;
- `scripts/repository/source-layout.cjs` for materialization;
- `scripts/copy-static-assets.cjs` for production output;
- HTML pages that load `/script.js`.
