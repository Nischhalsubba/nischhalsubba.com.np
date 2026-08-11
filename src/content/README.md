# Content Layer

This folder contains structured portfolio content that can be reused by generators and browser code without duplicating the same project, article, service, or route details across unrelated files.

The public site remains a static multi-page build, so HTML pages are still first-class production artifacts. The content layer exists to reduce repetition and give future refactors a reliable structured source instead of forcing build scripts to scrape rendered HTML.

## Files

```text
projects.js   Project metadata and featured project definitions.
posts.js      Writing/article metadata and featured post definitions.
services.js   Service-page metadata and positioning.
routes.js     Shared public route and route-related metadata used by content tooling.
```

## Rules

- Keep these modules data-focused.
- Do not add DOM manipulation or browser lifecycle code here.
- Do not import browser-only feature modules into the content layer.
- Keep public route values aligned with `config/canonical-routes.json`.
- Update the owning content record when project, post, or service positioning changes.
- Prefer reading structured content from this folder over scraping information back out of generated HTML.
- Keep claims factual and consistent with the public page that owns the underlying work.

## Why this exists

Historically, the same information was repeated across homepage cards, project pages, article listings, metadata, and other generated surfaces. That made routine edits easy to miss and encouraged one-off patch scripts.

The content layer provides a clearer path toward deterministic static generation while preserving the existing public URLs and deployment model.
