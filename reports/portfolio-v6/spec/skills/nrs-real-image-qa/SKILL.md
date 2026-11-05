---
name: nrs-real-image-qa
description: Audit every sitewide real content image for correct subject, independent provenance, responsive rendering, accessibility and truthful rights.
---
# Nischhal sitewide image verification
1. Read the complete 01_MASTER_CODEX_PROMPT.md, ledgers/MEDIA_COVERAGE_41.csv and references/SITEWIDE_MEDIA_DISCOVERY_AND_CAPTURE_v5.md. Start by building the media inventory from **all published routes and all rendered content placements**.
2. **Require Codex-origin independent capture or independently verified original Figma/local source** for each new published project/article/service/related/media screenshot. Never default to owner-uploaded snapshot or hardcoded old image path.
3. Require real evidence relevant to page, original project/role, permissions, source URL/node, capture time, hash, source-vs-derivative link. Preserve original UI pixels; neutral framing/crops only when full UI retained elsewhere. Reject generic navy diagrams, synthetic interface screenshots, stock mockups, misleading credits or unrelated assets.
4. Treat the Zakra owner image as historical target reference. Codex must find/capture source itself; use reference as fallback ONLY if all source options fail, clearly marked and reviewer-approved.
5. Verify all media in homepage, projects archive, case details, blog archive, all articles, related cards, service/about/credentials areas, galleries, OG/social and meaningful CSS background imagery. Real logos and original portraits are verified as genuine assets, not replaced by arbitrary captures.
6. Inspect `img.decode`, source/derivative dimensions, 320/390/768/1440 breakpoints, lightbox/focus, alternate text, caption, OG image, LCP impact and visual matching; report blocked images without claiming a perfect percentage.
7. Deliver per-placement screenshot diff/contact sheet, accurate source/capture/rights ledger, and signed visual QA.
