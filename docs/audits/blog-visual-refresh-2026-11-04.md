# Blog and content discovery refresh — 4 November 2026

## Findings and implementation

The blog archive retained legacy index-item markup without a complete archive layout in the current shared stylesheet. Rebuild it from the source-owned editorial collection: a featured new article and 26 image-led archive links. Screenshot previews use committed original evidence where available; abstract field-note artwork is used for articles without screenshot evidence. Illustrations are decorative within links whose visible titles provide their accessible names. Images use contain rather than destructive crops.

The project renderer retained its legacy breadcrumb inside the case hero while the shared installer also emitted a file-path bar. Replace both with one semantic ordered breadcrumb: home, linked section, current page. Increase type size, contrast and link hit areas, allow wrapping, and retain visible keyboard focus. Both article and project continuations now use screenshot-led frames and homepage colors.

Add a visibly labelled Blog link to the desktop toolbar and the mobile menu without removing the homepage Process section. Use the supplied Grid Labs presentation as the thumbnail in homepage work, project index and related links, and publish the supplied website capture inside its case. Both are compressed local assets; source content is preserved. Add the owner-provided Zakra starter preview, Masteriyo product website and Grid Labs implementation links. Retain Masteriyo's original Figma file reference. Current product sites are references, not claims of sole ownership or current feature authorship.

## New article

“Designing the Handoffs Between People” traces ownership, waiting and recovery through Orkest, piHub and Zapp, with three existing complete Figma screen exports. It distinguishes visible design evidence from proposed evaluation tasks. No new research findings or performance outcomes are invented. Published 4 November 2026; the canonical inventory and sitemap now contain 54 pages and 27 articles.

## Validation

Production build and focused final-stage rebuilds completed. Workspace homepage, inner-page, SEO, editorial provenance, code documentation, canonical routing and smoke checks run locally. Regression checks require exactly one breadcrumb and a visible Blog destination on each inner page, and 27 visual archive cards. Existing CI will run browser and accessibility checks on the PR. Local Chromium installation returned truncated archives, preventing local browser screenshots; desktop/mobile visual sign-off is pending those browser results. No deployment, new Google indexing or Figma export is claimed in this change.
