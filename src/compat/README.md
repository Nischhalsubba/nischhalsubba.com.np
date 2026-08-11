# `src/compat/`

Compatibility-only source that exists because a current tool still references a historical path.

`legacy-pages/` contains `home.html`, `home-v2.html`, and `blog.html`. They remain inputs in `vite.config.ts`, are materialized only for build compatibility, and are removed from production output by `scripts/clean-vite-public-output.cjs` according to `config/canonical-routes.json`.

Do not add new files here as a shortcut. New compatibility entries require a documented consumer and should be removed when that consumer is modernized.
