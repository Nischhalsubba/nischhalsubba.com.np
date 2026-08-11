# `src/pages/`

Canonical static page source grouped by route responsibility.

- `core/`: homepage and primary navigation routes (about, contact, projects, services, privacy).
- `projects/`: individual project/case-study pages.
- `services/`: specialist service and search-intent landing pages.

These files are materialized to historical root filenames by `scripts/repository/source-layout.cjs` so public URLs and the mature build pipeline remain stable. Every HTML file carries an `@fileoverview` source comment near its doctype.
