# `scripts/repository/`

Repository-architecture tooling.

- `source-layout.cjs` defines canonical organized sources and temporary compatibility mappings.
- `materialize-root-sources.cjs` copies organized source to legacy root paths before dev/build.
- `sync-root-sources.cjs` copies intentional generated changes back into organized source.
- `clean-root-sources.cjs` removes local compatibility copies.
- `audit-repository-structure.cjs` enforces the root allow-list and required documentation in CI.

Connected configuration: `config/repository/root-policy.json` and `config/canonical-routes.json`.
