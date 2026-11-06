---
name: nrs-repo-inventory
description: Inventory production routes, project/blog content and build source ownership before editing.
---

# nrs-repo-inventory

Inspect `site/config/canonical-routes.json` as the route authority, `site/src/content/projects.js`, `site/src/content/search-metadata.json`, `site/package.json`, `site/src/workspace-home/index.html`, and the workspace install/final SEO scripts. Generate a dated inventory with 54 canonical pages (14 projects, 27 articles, 6 services, 7 core) as the verified 2026-11-05 baseline and recalculate from the current checkout. Discover unpublished/legacy blog files, never delete without checking incoming links and redirects. Distinguish raw source, built HTML, served production and Google index status. Record actual deployed git SHA. Do not edit dist or generated assets.

## Deliverables
Write evidence-backed changes or an audit record, including paths, date, validation command/output, actual blockers and clear follow-ups.
