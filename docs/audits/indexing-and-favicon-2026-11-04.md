# Indexing inspection and favicon update — 4 November 2026

Source: Google URL Inspection API and sitemap records through Google Search Console by HYPD. Exact connected property: sc-domain:nischhalsubba.com.np. The inspection covered all 53 canonical URLs, including all 14 project cases and 26 articles. One initial /services request returned INVALID_ARGUMENT; a bounded retry returned Submitted and indexed.

| Group | Indexed | Not indexed |
|---|---:|---:|
| Projects | 13 | 1 |
| Articles | 25 | 1 |
| Other canonical pages, including home | 12 | 1 |
| Total | 50 | 3 |

| Not indexed URL | Google coverage | Last crawl (UTC) |
|---|---|---|
| /project-zakra-furniture | Crawled - currently not indexed | 2026-09-02T05:16:08Z |
| /blog/saas-dashboard-ux-checklist | Crawled - currently not indexed | 2026-09-28T16:03:17Z |
| /saas-ux-designer | Crawled - currently not indexed | 2026-09-25T23:29:35Z |

All three report robots allowed, indexing allowed, successful fetching, and matching Google/user canonicals. This does not establish a technical block or explain Google's quality decision. Their stored crawls precede the recent content revisions. Review the current content and internal links, then request a fresh inspection after deployment; recrawl and inclusion remain Google's decisions. No indexing request or sitemap resubmission was executed.

The sitemap record still reports one error, 43 submitted URLs and last download 30 October. Its indexed count of zero must not be interpreted as the whole site's index coverage: individual inspection confirms 50 indexed canonical URLs. Earlier authenticated investigation identified an incorrect-namespace report; the current generator uses the correct namespace. This read-only connector does not clear the historical processing report.

The new favicon uses the homepage's dark background, blue frame, clipped corner and white N. One shared vector design supplies SVG, 16/32/48 PNGs, ICO fallback, 180-pixel Apple icon and 192/512-pixel application icons. The final build replaces conflicting legacy favicon links on all 53 canonicals. The manifest uses Nepal without the former incorrect Kathmandu location. Stable public icon paths and square assets follow Google's guidance: https://developers.google.com/search/docs/appearance/favicon-in-search/ . Google display and recrawl are not guaranteed.
