# Baseline — 2026-11-03

Repository base: `5311ce357aaaf64ef21bf90a7efbe3f4b03719e6`. Review branch: `fix/portfolio-seo-figma-2026-11`. Node 24.22.1 / npm 11.9.0 locally; CI declares Node 24 / npm 11.17.0. Cloudflare Worker/static assets are the configured production authority. No deployment or merge was performed.

Facts: all 116 supplied crawl rows and 67 triage rows were parsed. The supplied crawl has 53 HTML 200 pages, existing titles/descriptions/H1/self-canonicals, and 13 historical 307 records. Length flags are review prompts, not Google penalties. Current HTTP crawl made 75 requests: 56 HTTP 200, two 301, fifteen 307, one 404 and one 503, with no timeouts. See URL_INVENTORY.csv and ../audits/live-http-baseline.json. The www host returned 503 on a second independent request; the fault location is unconfirmed. Worker host normalization only helps requests that reach that Worker.

The live sitemap returned HTTP 200, application/xml and 53 page URLs. The old source manifest had 43 routes; the branch reconciles it with the 53 retained final pages. Search Console still reports one sitemap processing error, last downloaded October 30, and 43 submitted URLs. The API does not expose its detailed processing message. A count mismatch alone is not an established error cause.

Fresh URL Inspection covered all 53 canonical routes: 47 Submitted and indexed; three unknown to Google; three crawled, currently not indexed. These are API verdicts at inspection time, not a guarantee of future inclusion. The sitemap-specific indexed:0 field is not sitewide deindexing. Detailed responses are in ../audits/gsc-url-inspections.json.

Finalized Web-search analytics were read for August 1–October 31, separately by page (48 returned rows), query (19), country (53), device (3). Rare queries are withheld; rows are not an exhaustive query export. Small samples do not support confident growth attribution. Ahrefs DR and Nepal/US keyword requests returned Insufficient plan. Public PSI returned HTTP 429 RESOURCE_EXHAUSTED. Local Chromium installation returned truncated/empty ZIP downloads; CI browser evidence is required.
