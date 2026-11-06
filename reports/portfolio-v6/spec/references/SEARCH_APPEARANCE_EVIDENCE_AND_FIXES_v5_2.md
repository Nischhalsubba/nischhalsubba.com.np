# Search appearance reconciliation — November 5, 2026

**Source:** User's Google Search screenshot for “Nischhal raj subba” (Nepal) and connected GitHub/Search Console inspection. **Status:** diagnosis, not a live-code fix.

## Observed result

| Component | User-screenshot observation | Verified source evidence | Desired action | Status |
|---|---|---|---|---|
| Google favicon | Old orange/white circular “N” icon | GitHub main has blue-frame/white-N favicon generator (`site/scripts/workspace-icons.cjs`) publishing root ICO/PNG from `src/workspace-home/assets`; new HTML may not be served/cached by Google | Confirm built and deployed ICO/PNG URLs and Google recrawl separately | LIVE_UNVERIFIED_GOOGLE_OLD |
| Homepage title and snippet | Title Senior Product Designer, “For 7+ years”, “Ranked #1 Designer globally in Uxcel” | `workspace-home/index.html` says 7+; other source references 6+ | Verify current/historical rank, date, category and years; maintain consistent title/description/visible biography | FACT_CHECK |
| About result snippet | Based in Kathmandu, Nepal | Old indexed About has Kathmandu; current source contains inconsistent metadata/docs | Correct approved current location on owner-controlled sources, avoid rewriting historical employment | STALE_GOOGLE_AND_SOURCE |
| AI Overview | Senior designer Nepal; mixed Kathmandu/Biratnagar signals | Search AI responses are generated from multiple sources | Correct owned source discrepancies, monitor citation context, do not guarantee edited AI Overview | GOOGLE_CONTROLLED |
| Images for name query | Real headshot plus Dribbble illustration and SoundCloud event image | Not established whether these third-party assets represent the same person | Make official portrait and professional image discoverable, audit external identities, do not promise control of third-party results | LIMITED_CONTROL |

## Search Console checks

- Homepage: `Submitted and indexed`; last crawled `2026-11-04T19:12:36Z`; self-canonical; robots allowed.
- About: `Submitted and indexed`; last crawled `2026-10-26T17:45:58Z`; self-canonical; robots allowed.
- These facts are from November 5, 2026 connected URL Inspections and do **not** verify that the **currently served deployed version** contains latest favicon or About changes.

## Important repo code and source-of-truth files

- `site/scripts/workspace-icons.cjs`: writes root icon family into built `dist`, adds consistent ICO/PNG/SVG/Apple/manifest links and removes conflicting legacy links in canonical final HTML.
- `site/src/workspace-home/assets/favicon*`: source icon family.
- `site/src/workspace-home/index.html`: current intended homepage identity, 7+ years, branded vector icon in raw source before final transformation.
- `site/src/pages/core/about.html`: raw About metadata still mentions 6+ years; must compare the final built About page.
- `site/scripts/audit-final-seo.cjs`: still asserts Kathmandu in at least two search metadata expectations. Fix those assertions only when the approved truthful bio source is changed.
- `site/src/discovery/humans.txt`, `docs/public-brand-system.md`, resume generator: contain location terminology requiring distinction between current location and dated employment.
- `docs/audits/indexing-and-favicon-2026-11-04.md`: historical report says build installed new blue/white favicon; **not** proof that Google now displays it.

## Acceptance and limitation

1. No stale icons in final compiled pages; icon bytes match approved source, and Googlebot can crawl stable PNG/ICO URL.
2. Current official biography is consistent on homepage, About, structured data and author-controlled profiles. Preserve the historically correct role dates and employers.
3. SEO cards show authoritative portrait and appropriate verified claims; no false testimonial, ranking or experience duration.
4. After approved deployment, request a homepage/About recrawl when authorized and recheck on dated Nepal/US SERPs. Google owns display decisions.
5. Report exact result category: CODE_FIXED_NOT_DEPLOYED / LIVE_FIXED_GOOGLE_STALE / GOOGLE_UPDATED / NEEDS_OWNER_FACT / NOT_VERIFIABLE.

**Official sources:** https://developers.google.com/search/docs/appearance/favicon-in-search ; https://developers.google.com/search/docs/appearance/snippet ; https://developers.google.com/search/docs/appearance/google-images ; https://developers.google.com/search/docs/appearance/ai-features ; https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
