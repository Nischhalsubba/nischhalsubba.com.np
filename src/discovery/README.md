# `src/discovery/`

Source-of-truth files for search engines, AI crawlers, browser install metadata, humans metadata, and static response headers.

Files in this folder are connected to:

- `scripts/generate-seo-discovery.cjs` for sitemap/robots/AI URL normalization;
- `scripts/repository/materialize-root-sources.cjs` for temporary compatibility paths;
- `scripts/copy-static-assets.cjs` for production `dist/` output;
- SEO/discovery audits and production header verification.

Generated or normalized discovery changes belong here, not as tracked root files.
