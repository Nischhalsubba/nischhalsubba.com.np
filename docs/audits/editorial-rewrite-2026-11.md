# Editorial rewrite and image integration — 3 November 2026

## Implemented in the review branch

All fourteen retained project bodies and all twenty-six existing articles were rewritten. No new SEO doorway pages or duplicate articles were created. `editorial-intent-map.csv` identifies each route's distinct purpose. The three empty-state posts now separately cover message writing, product-wide taxonomy and recovery acceptance. Audit and handoff posts also have distinct decision scopes.

Case studies state contribution, context, constraints, concrete design choices, delivery boundaries and proposed validation. Historical contribution statements come from the existing owner portfolio; they are not reclassified as independently verified research. No project conversion, revenue, adoption, time saving or usability result was invented. Code projects remain code projects.

Eight privacy-reviewed Figma illustrations appear in 21 placements across five cases and thirteen articles. They are source-matched: Orkest CRM, piHub application status, Zapp account/parcel, Yarsha contact/token and Morajaa service process. Native source hashes, node IDs, crops, redactions and derivatives are recorded in `portfolio-evidence-images.json`; additional recipes are reproducible with `publish-images.py`. There are 24 public derivative files, all local to the review build. Production publication count remains zero.

New Masteriyo team screenshots remain private pending reuse clearance. Reconwithme remains a candidate, not a fifteenth case. Eight existing cases lack a verified matching Figma source or do not require one; existing previews/references are retained without relabeling them as new exports. `project-evidence-matrix.md` and the forty-route screenshot map document each boundary.

## Source owners

- `site/src/content/portfolio-editorial.json`: all fourteen final case narratives.
- `site/src/content/articles-editorial*.json`: all twenty-six final article narratives, distinct intent and primary reference links.
- `site/scripts/editorial/render.cjs`: semantic composition inside the approved workspace shell, with retained artifact links, breadcrumbs and previous/next project navigation.
- `site/src/content/search-metadata.json`: route descriptions; titles and canonical URLs remain intact.
- `site/scripts/finalize-workspace-seo.cjs`: matching modified dates/schema/social cards and image sitemap. Obsolete FAQ schema is removed on rewritten pages without visible FAQ content. Original publication metadata is retained when present; no publication date is invented when absent.
- `site/src/workspace-inner/parity.css`: reading measure, accessible tables and in-page navigation in the homepage palette and typography.

## Quality and verification

The frozen integrated `npm run validate` passed with 570 byte-stable generated files. Focused editorial, image, workspace, SEO, lint and documentation checks passed; the checks cover 53 canonicals, 14 cases, 26 articles, source-matched figures, author/update/schema agreement and semantic tables. Existing contact handling and API behavior were preserved. Fresh browser/axe/Lighthouse CI is still required on this revision. A local Chromium download again returned a truncated ZIP; the cloud browser cannot reach the localhost preview.

The previous code commit `20f99a3` passed all six workflows, including 108 Lighthouse runs over controlled base/review and current production. Those measurements are in `performance-measured-20f99a3.json`. Homepage mobile scores varied materially; do not cherry-pick the earlier 79 run or call the 90+ target met.

Font transfer was profiled before changing it: sixteen source faces total 426,424 bytes. Current English subsets total 140,216 bytes. Every included codepoint retains its original horizontal advance, and unicode-range fallback faces preserve the other original glyphs. New files are content-addressed and preload/CSS references agree. Actual loading and visual parity still need the fresh browser measurements; byte reduction is not claimed as a Lighthouse score.

## Private archive recovery

The execution environment recovered. The working archive contains 886 PNG files, 869 unique hashes, zero decode failures and zero automated near-blank flags. These are screen candidates, not 886 approved production screens. The initial recovered 740-file checkpoint was saved privately; later additions require the final checkpoint update. Full visual QA of the archive is pending. The public five-to-eight-illustration expansion was visually reviewed separately.

The native MCP output probe returned only five images from twenty renders; its non-image TAR probe yielded no recoverable archive bytes. Neither missing outputs nor metadata-only results are counted. The resumable REST exporter now shares the MCP directory layout and recognizes 886 existing files. Dry run reports 3,177 remaining candidates. REST execution requires already authorized private scoped access; no token was available and none was requested in chat. Ten legacy page metadata traversals remain plan-limited. Global file search is unverified; the independent browser file list requires sign-in. No sharing, billing or ownership setting was changed.

## Release boundary

This is a draft PR, not a production release. Content, new public assets and any needed team clearance require review. No merge, deployment, sitemap submission or indexing request occurred. Current Google observations and external follow-up instructions remain in the SEO reports. Manual screen-reader/WAVE/field-CWV and anonymous prototype playback are not verified.

## Follow-up before release

The execution environment became unavailable again during the larger archive checkpoint update. The already-saved 740-file private archive is confirmed; durable retention of the later 886-file working snapshot is not confirmed. The public code and eight curated images are safely committed. Remaining export/curation and local visual work remain blocked by the runtime and source/rights gaps, rather than being reported complete.

A confirmed social-cache mismatch was also repaired: `/assets/*` is cached as immutable for a year, while social cards previously used fixed filenames. Social filenames now include the generated PNG's SHA-256 prefix; the SEO audit checks the name against actual bytes. Complete upstream font licenses and readable editorial review snapshots are included. The snapshots correspond to authored prose at code commit `00db48e`; JSON remains the source of truth. A fresh CI run must verify this final follow-up before release.
