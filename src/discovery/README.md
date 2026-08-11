# `src/discovery/`

Canonical source files for crawler directives, browser install metadata, human-readable ownership metadata, and static response headers.

This folder is connected to:

- `scripts/generate-seo-discovery.cjs` for deterministic sitemap, robots, and redirect generation;
- `scripts/ensure-public-identity-assets.cjs` for `humans.txt` and `site.webmanifest`;
- `scripts/repository/materialize-root-sources.cjs` for temporary root compatibility files required by existing build stages;
- `scripts/copy-static-assets.cjs` for final production output;
- SEO/discovery audits and production header verification.

Generated or normalized discovery changes belong here rather than as manually maintained root files.
