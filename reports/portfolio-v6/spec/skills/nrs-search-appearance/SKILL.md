---
name: nrs-search-appearance
description: Verify branded Google Search result appearance against the real site, inspect icon and person-profile sources, and separate site fixes from Google-owned SERP updates.
---

# Search Appearance and Personal Brand Consistency

Use for T90–T98 and when search snippets, favicons, identity cards, Google Images or AI Overview show stale material.

1. Read `references/SEARCH_APPEARANCE_EVIDENCE_AND_FIXES_v5_2.md` and screenshot evidence; log query locale/date and never generalize from a personalized SERP.
2. Inspect main GitHub source, generated dist, deployed Cloudflare SHA and actual HTTP requests separately. `site/scripts/workspace-icons.cjs` already installs ICO+PNG+SVG at stable root paths; do not duplicate work or claim a missing format until comparing final build and production.
3. Probe favicon.ico and favicon-48.png with real decoded pixel/crawl MIME/HTTP/cache checks. Verify 54-route head consistency, 1:1 shape, 48px+ asset and one branded icon family.
4. Audit factual biography from owned sources and owner-approved career chronology: current Nepal location vs historical job location; 6+/7+ years; source/date/category of Uxcel rank. Update raw sources and associated tests in tandem.
5. Verify current About/home headings, descriptions, canonical links, Person/ProfilePage schema, image URLs, OG, CV generator, humans.txt, public branding docs, and relevant external profiles if authorized.
6. Google Search snippets, image results, favicon and AI Overview are Google-controlled and may update after recrawl; no API sets their visible text or images. Use Google Search Console Inspection for crawl facts and request reindex only after owner-approved deployment.
7. Test with captured desktop/mobile and image assets; report `CODE_FIXED_NOT_DEPLOYED`, `LIVE_FIXED_GOOGLE_STALE`, `GOOGLE_UPDATED`, `NEEDS_OWNER_FACT`, or `NOT_VERIFIABLE`.
8. Always record exact branch/commit, canonical URLs, tool dates, screenshots, test logs and unresolved risks. Do not auto merge/deploy.

Primary docs:
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/snippet
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
