# Baseline — 2026-11-03

Repository base: `5311ce357aaaf64ef21bf90a7efbe3f4b03719e6`. Review branch: `fix/portfolio-seo-figma-2026-11`. Node 24.22.1 / npm 11.9.0 locally; CI declares Node 24 / npm 11.17.0. Cloudflare Worker/static assets are the configured production authority. No deployment or merge was performed.

Facts: all 116 supplied crawl rows and 67 triage rows were parsed. The supplied crawl has 53 HTML 200 pages, existing titles/descriptions/H1/self-canonicals, and 13 historical 307 records. Length flags are review prompts, not Google penalties. Current HTTP crawl made 75 requests: 56 HTTP 200, two 301, fifteen 307, one 404 and one 503, with no timeouts. See URL_INVENTORY.csv and ../audits/live-http-baseline.json. The www host returned 503 on a second independent request; the fault location is unconfirmed. Worker host normalization only helps requests that reach that Worker.

The live sitemap returned HTTP 200, application/xml and 53 page URLs. The old source manifest had 43 routes; the branch reconciles it with the 53 retained final pages. Search Console still reports one sitemap processing error, last downloaded October 30, and 43 submitted URLs. The API does not expose its detailed processing message. A count mismatch alone is not an established error cause.

Fresh URL Inspection covered all 53 canonical routes: 47 Submitted and indexed; three unknown to Google; three crawled, currently not indexed. These are API verdicts at inspection time, not a guarantee of future inclusion. The sitemap-specific indexed:0 field is not sitewide deindexing. Detailed responses are in ../audits/gsc-url-inspections.json.

Finalized Web-search analytics were read for August 1–October 31, separately by page (48 returned rows), query (19), country (53), device (3). Rare queries are withheld; rows are not an exhaustive query export. Small samples do not support confident growth attribution. Ahrefs DR and Nepal/US keyword requests returned Insufficient plan. Public PSI returned HTTP 429 RESOURCE_EXHAUSTED. Local Chromium installation returned truncated/empty ZIP downloads; CI browser evidence is required.

## Fresh Google inspection ledger

| Canonical URL | Google verdict | Last crawl | Google canonical |
|---|---|---|---|
| https://nischhalsubba.com.np/ | Submitted and indexed | 2026-10-24T02:24:45Z | https://nischhalsubba.com.np/ |
| https://nischhalsubba.com.np/about | Submitted and indexed | 2026-10-26T17:45:58Z | https://nischhalsubba.com.np/about |
| https://nischhalsubba.com.np/blog/beautiful-interface-poor-ux | Submitted and indexed | 2026-10-24T01:09:43Z | https://nischhalsubba.com.np/blog/beautiful-interface-poor-ux |
| https://nischhalsubba.com.np/blog/blog-design-systems-front-end | Submitted and indexed | 2026-10-07T21:33:07Z | https://nischhalsubba.com.np/blog/blog-design-systems-front-end |
| https://nischhalsubba.com.np/blog/blog-gaming-interface-clarity | Submitted and indexed | 2026-10-14T07:48:13Z | https://nischhalsubba.com.np/blog/blog-gaming-interface-clarity |
| https://nischhalsubba.com.np/blog/blog-good-handoff | Submitted and indexed | 2026-10-10T23:55:21Z | https://nischhalsubba.com.np/blog/blog-good-handoff |
| https://nischhalsubba.com.np/blog/blog-portfolio-product | Submitted and indexed | 2026-10-18T18:27:05Z | https://nischhalsubba.com.np/blog/blog-portfolio-product |
| https://nischhalsubba.com.np/blog/blog-service-websites | Submitted and indexed | 2026-10-13T22:09:11Z | https://nischhalsubba.com.np/blog/blog-service-websites |
| https://nischhalsubba.com.np/blog/blog-web3-products | Submitted and indexed | 2026-10-26T18:23:28Z | https://nischhalsubba.com.np/blog/blog-web3-products |
| https://nischhalsubba.com.np/blog/design-handoff-checklist-startup-product-teams | Submitted and indexed | 2026-10-22T09:24:11Z | https://nischhalsubba.com.np/blog/design-handoff-checklist-startup-product-teams |
| https://nischhalsubba.com.np/blog/design-systems-small-product-teams | Submitted and indexed | 2026-10-23T13:45:47Z | https://nischhalsubba.com.np/blog/design-systems-small-product-teams |
| https://nischhalsubba.com.np/blog/figma-handoff-notes-for-developers | Submitted and indexed | 2026-10-03T01:53:35Z | https://nischhalsubba.com.np/blog/figma-handoff-notes-for-developers |
| https://nischhalsubba.com.np/blog/hire-product-designer-nepal-saas-web3 | Submitted and indexed | 2026-10-24T13:00:31Z | https://nischhalsubba.com.np/blog/hire-product-designer-nepal-saas-web3 |
| https://nischhalsubba.com.np/blog/ | Submitted and indexed | 2026-10-28T20:55:44Z | https://nischhalsubba.com.np/blog/ |
| https://nischhalsubba.com.np/blog/prioritize-ux-audit-findings-before-redesign | Submitted and indexed | 2026-10-13T20:54:11Z | https://nischhalsubba.com.np/blog/prioritize-ux-audit-findings-before-redesign |
| https://nischhalsubba.com.np/blog/responsive-saas-dashboard-handoff-notes | Submitted and indexed | 2026-10-06T05:02:34Z | https://nischhalsubba.com.np/blog/responsive-saas-dashboard-handoff-notes |
| https://nischhalsubba.com.np/blog/role-based-saas-dashboard-ux | Submitted and indexed | 2026-10-23T15:00:47Z | https://nischhalsubba.com.np/blog/role-based-saas-dashboard-ux |
| https://nischhalsubba.com.np/blog/saas-dashboard-empty-state-ux-guide | URL is unknown to Google | Not reported | Not reported |
| https://nischhalsubba.com.np/blog/saas-dashboard-empty-states-product-clarity | URL is unknown to Google | Not reported | Not reported |
| https://nischhalsubba.com.np/blog/saas-dashboard-empty-states-that-help-users-recover | Submitted and indexed | 2026-10-24T20:03:43Z | https://nischhalsubba.com.np/blog/saas-dashboard-empty-states-that-help-users-recover |
| https://nischhalsubba.com.np/blog/saas-dashboard-filter-ux | Submitted and indexed | 2026-10-08T20:43:08Z | https://nischhalsubba.com.np/blog/saas-dashboard-filter-ux |
| https://nischhalsubba.com.np/blog/saas-dashboard-ux-checklist | Crawled - currently not indexed | 2026-09-28T16:03:17Z | https://nischhalsubba.com.np/blog/saas-dashboard-ux-checklist |
| https://nischhalsubba.com.np/blog/transaction-review-ux-crypto-apps | Submitted and indexed | 2026-09-30T04:18:27Z | https://nischhalsubba.com.np/blog/transaction-review-ux-crypto-apps |
| https://nischhalsubba.com.np/blog/ux-audit-checklist-before-redesign | Submitted and indexed | 2026-10-09T21:52:53Z | https://nischhalsubba.com.np/blog/ux-audit-checklist-before-redesign |
| https://nischhalsubba.com.np/blog/ux-audit-evidence-before-redesign | Submitted and indexed | 2026-10-23T17:00:31Z | https://nischhalsubba.com.np/blog/ux-audit-evidence-before-redesign |
| https://nischhalsubba.com.np/blog/web3-wallet-connection-ux | URL is unknown to Google | Not reported | Not reported |
| https://nischhalsubba.com.np/blog/web3-wallet-ux-checklist | Submitted and indexed | 2026-10-25T19:48:43Z | https://nischhalsubba.com.np/blog/web3-wallet-ux-checklist |
| https://nischhalsubba.com.np/blog/website-ux-checklist-software-companies | Submitted and indexed | 2026-09-29T08:18:14Z | https://nischhalsubba.com.np/blog/website-ux-checklist-software-companies |
| https://nischhalsubba.com.np/blog/when-startup-needs-ux-audit-before-redesign | Submitted and indexed | 2026-10-14T00:18:14Z | https://nischhalsubba.com.np/blog/when-startup-needs-ux-audit-before-redesign |
| https://nischhalsubba.com.np/contact | Submitted and indexed | 2026-10-25T22:33:23Z | https://nischhalsubba.com.np/contact |
| https://nischhalsubba.com.np/figma-design-systems | Submitted and indexed | 2026-10-22T14:24:29Z | https://nischhalsubba.com.np/figma-design-systems |
| https://nischhalsubba.com.np/privacy | Submitted and indexed | 2026-10-24T10:30:32Z | https://nischhalsubba.com.np/privacy |
| https://nischhalsubba.com.np/product-design-nepal | Submitted and indexed | 2026-08-29T20:17:01Z | https://nischhalsubba.com.np/product-design-nepal |
| https://nischhalsubba.com.np/project-designerex | Submitted and indexed | 2026-10-14T02:36:02Z | https://nischhalsubba.com.np/project-designerex |
| https://nischhalsubba.com.np/project-grid-labs | Submitted and indexed | 2026-10-24T09:09:50Z | https://nischhalsubba.com.np/project-grid-labs |
| https://nischhalsubba.com.np/project-hamro-idea | Submitted and indexed | 2026-10-29T03:30:02Z | https://nischhalsubba.com.np/project-hamro-idea |
| https://nischhalsubba.com.np/project-masteriyo | Submitted and indexed | 2026-10-21T10:55:02Z | https://nischhalsubba.com.np/project-masteriyo |
| https://nischhalsubba.com.np/project-mokshya | Submitted and indexed | 2026-10-24T03:02:14Z | https://nischhalsubba.com.np/project-mokshya |
| https://nischhalsubba.com.np/project-morajaa | Submitted and indexed | 2026-10-20T08:00:47Z | https://nischhalsubba.com.np/project-morajaa |
| https://nischhalsubba.com.np/project-neverwinter-parser | Submitted and indexed | 2026-10-18T12:11:33Z | https://nischhalsubba.com.np/project-neverwinter-parser |
| https://nischhalsubba.com.np/project-orkest | Submitted and indexed | 2026-10-28T03:41:32Z | https://nischhalsubba.com.np/project-orkest |
| https://nischhalsubba.com.np/project-pihub | Submitted and indexed | 2026-10-25T18:33:43Z | https://nischhalsubba.com.np/project-pihub |
| https://nischhalsubba.com.np/project-sassboilerplate | Submitted and indexed | 2026-10-26T00:48:43Z | https://nischhalsubba.com.np/project-sassboilerplate |
| https://nischhalsubba.com.np/project-splashnode | Submitted and indexed | 2026-10-25T00:53:23Z | https://nischhalsubba.com.np/project-splashnode |
| https://nischhalsubba.com.np/project-yarsha | Submitted and indexed | 2026-10-28T16:44:37Z | https://nischhalsubba.com.np/project-yarsha |
| https://nischhalsubba.com.np/project-zakra-furniture | Crawled - currently not indexed | 2026-09-02T05:16:08Z | https://nischhalsubba.com.np/project-zakra-furniture |
| https://nischhalsubba.com.np/project-zapp | Submitted and indexed | 2026-10-28T13:41:42Z | https://nischhalsubba.com.np/project-zapp |
| https://nischhalsubba.com.np/projects | Submitted and indexed | 2026-10-23T19:30:32Z | https://nischhalsubba.com.np/projects |
| https://nischhalsubba.com.np/saas-ux-designer | Crawled - currently not indexed | 2026-09-25T23:29:35Z | https://nischhalsubba.com.np/saas-ux-designer |
| https://nischhalsubba.com.np/services | Submitted and indexed | 2026-10-29T04:53:28Z | https://nischhalsubba.com.np/services |
| https://nischhalsubba.com.np/ux-audit | Submitted and indexed | 2026-10-22T16:54:02Z | https://nischhalsubba.com.np/ux-audit |
| https://nischhalsubba.com.np/web3-ux-designer | Submitted and indexed | 2026-10-28T09:56:18Z | https://nischhalsubba.com.np/web3-ux-designer |
| https://nischhalsubba.com.np/website-ux-design | Submitted and indexed | 2026-09-25T20:53:35Z | https://nischhalsubba.com.np/website-ux-design |

## External actions — NOT EXECUTED

In the discovered domain property, open Indexing → Sitemaps → sitemap.xml and record the exact error text, line/URL and latest fetch. The read-only API exposes the counter, not the detailed reason. Compare the current 53-URL sitemap with that fetch; do not call the 43/53 mismatch the proven cause. After approved deployment and successful live checks, resubmit the existing sitemap once only if appropriate. No submission was made here.

For the six non-indexed URLs above, review distinctive content, internal discovery and live fetch eligibility. Use the owner UI's Test live URL and Request indexing manually where warranted after deployment. The HYPD connector cannot perform either submission or indexing requests. Check again after recrawl; a code test is not an indexing result.

Official guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap ; https://developers.google.com/search/docs/appearance/ai-features ; https://developers.google.com/search/docs/appearance/structured-data/article

## Authenticated sitemap diagnosis — 4 November 2026

Search Console confirms “Incorrect namespace”, one instance, line 2, tag `urlset`; its last read remains 30 October with 43 discovered pages. The live XML was independently opened in the browser: correct `http://www.sitemaps.org/schemas/sitemap/0.9` namespace, 53 URL elements and no parser error. This separates Google's historical processing report from the current live bytes.

Two legacy generators still emitted `http://www.sitemaps.org/sitemap/0.9` (missing `/schemas/`). They are corrected in this continuation; the final generator was already correct. The final audit now checks the namespace declaration on the root element explicitly. Official specification: https://www.sitemaps.org/protocol.html. The historical source defect is consistent with the reported error, but the exact 30 October response bytes were not retained.

Resubmission is NOT EXECUTED. The original user brief explicitly requires approval for GSC writes. Once approved, resubmit the existing `https://nischhalsubba.com.np/sitemap.xml` and recheck processing; do not remove the existing record or claim indexing is guaranteed. The authenticated overview also reports no Core Web Vitals field data for mobile or desktop; lab scores remain separate. Sanitized evidence: `gsc-sitemap-error-2026-11-04.json`.
