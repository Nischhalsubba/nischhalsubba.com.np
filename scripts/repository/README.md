# `scripts/repository/`

Repository-architecture tooling.

- `source-layout.cjs` defines canonical organized source and the temporary compatibility mappings required by historical build stages.
- `materialize-root-sources.cjs` copies canonical source to compatibility paths before development or production builds.
- `sync-root-sources.cjs` copies intentional changes from sync-enabled compatibility files back into canonical source.
- `clean-root-sources.cjs` removes temporary compatibility copies.
- `audit-repository-structure.cjs` enforces the repository-root allow-list and required architecture documentation.
- `audit-code-documentation.cjs` validates the file and function documentation contract for authored source.

Connected configuration:

- `config/repository/root-policy.json`
- `config/repository/code-documentation-policy.json`
- `config/canonical-routes.json`

Human-maintained repository ownership and folder responsibilities are documented in `docs/repository/file-map.md`. The repository deliberately avoids maintaining a generated per-file catalog because the Git tree already provides the inventory and generated catalogs create noisy drift without improving architectural ownership.
