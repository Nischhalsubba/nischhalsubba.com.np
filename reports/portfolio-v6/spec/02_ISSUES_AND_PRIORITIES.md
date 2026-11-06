# Issue register and improvement decisions — dated 2026-11-05

**Use this before browser or code work.** Each row is a specific hypothesis or observation; verify the **current checkout + built output + public served site**. Do not mark a recommendation as a reproduced defect. States: `SOURCE` code found; `USER` owner screenshot/feedback; `HIST` previous documented audit; `GSC` connected Google inspection; `DESIRED` quality goal. Prioritize broken functionality and truth over numerical SEO scores.

## A — P0: source, deployment, search appearance, identity

| ID | Evidence/status | Observation / issue | Targeted action and acceptance |
|---|---|---|---|
| A01 | HIST | Site may serve an older Cloudflare build despite updated review branch. | Compare final built SHA, deployed marker, repo branch/PR and served output before making another fix. |
| A02 | SOURCE+GSC | Source manifest had 54 canonical routes but last recorded sitemap had 53; new handoffs article was unknown to Google. | Recompute live manifest and XML, verify 54 vs current, content of new article and indexing state. Do not assume current error. |
| A03 | HIST | `www` host previously returned 503. | Verify canonical host, DNS/TLS, redirects and Worker entry with reproducible HTTP/log evidence. |
| A04 | HIST | Old `.html` aliases used temporary 307; one retired article returned 404. | Confirm production; use permanent 301/308, single canonical route, preserve meaningful old links. |
| A05 | USER | Google shows an orange old N favicon despite new blue/white N in source. | Reuse existing `workspace-icons.cjs` generator; inspect `/favicon.ico`, `/favicon-48.png`, SVG, manifest and rendered page head in dist/live; record Google recrawl uncertainty. |
| A06 | USER+SOURCE | Google About snippet says Kathmandu; historical About source/brand files contain inconsistent current location. | Confirm owner's current preferred public location (Nepal-based remote by default) and update current bio/docs/meta/JSON-LD/test expectations; do not change historical job location. |
| A07 | SOURCE | Multiple `6+` and `7+` experience claims across source versions. | Compare resume dates and owner-approved chronology; make all current claims consistent and date-scoped. |
| A08 | USER+SOURCE | “Ranked #1 Designer globally” risks overstating unverified ranking; Uxcel 2023 recognition may be verifiable separately. | Verify category, placement, year, issuer proof; qualify unsupported rank and use real verified badge/citation. |
| A09 | HIST | Contact path has code tests but end-to-end production delivery not fully verified. | Confirm actual delivery, errors, spam protection and keyboard accessibility; don't send real third-party messages. |
| A10 | SOURCE | Source `site/scripts/audit-final-seo.cjs` still expects Kathmandu wording. | Fix approved content and assertions together after source-of-truth check. |
| A11 | USER | Google Images results mix official portrait with external, possibly irrelevant images. | Improve crawlable approved portrait, Person.image and source captions; external image selection is not directly controllable. |
| A12 | USER | Google AI Overview combines profile/location details. | Check cited sources and correct contradictions on owned pages; do not claim control over generated answers. |

## B — P0/P1: evidence and images

| ID | Evidence/status | Observation / issue | Targeted action and acceptance |
|---|---|---|---|
| B01 | USER | Blog related-work cards show repeated generic navy arrow/flowchart graphics. | Replace with distinct real article-relevant product/UI/Figma/code screenshots, verified provenance and readable thumbnails. |
| B02 | USER+SOURCE | Some project archive covers are stylized SVGs and do not communicate actual UI. | For all 14 cards, independently capture the strongest real visual evidence; no stale hardcoded owner screenshot as primary source. |
| B03 | HIST | Prior projects displayed gray placeholders, limited screen coverage and destructive crops. | Verify final deployed assets before changing; preserve complete UI with a separately designed thumbnail and original zoom. |
| B04 | USER | Zakra source screenshot supplied only as benchmark, not permanent hardcoded hero. | Find actual approved starter/demo and independently capture current/historic source with correct attribution. Block if no verified source exists. |
| B05 | USER | Zapp site should inform actual product presentation and link to case study. | Capture genuine public site and correct Figma customer/driver/admin frames; do not imply current site proves authored historical UI. Add verified site link. |
| B06 | USER | Designerex current marketplace may be visually useful. | Capture public allowed pages and state that current site differs from historical UI contribution. Add official link. |
| B07 | USER+HIST | Hamro Idea Vercel deployment was READY but visual rendering remained unverified. | Browser-test render, desktop/mobile, assets and link; capture only working real view (or honestly labeled local implementation). |
| B08 | HIST | Figma archive once contained thousands of originals, limited/blocked pages; some frame sequences already committed. | Reuse hashed originals and source nodes, avoid redundant 3,889 exports; verify all screens and rights before publication. |
| B09 | DESIRED | Full 54-route media placement inventory was not yet verified from a live DOM. | Create comprehensive inventory covering homepage, all card types, cases, articles, services, credentials and OG; scope distinct from 41 detail pages. |
| B10 | DESIRED | Publishing third-party screenshots needs accurate provenance and rights. | Each asset gets URL/node, time, scope, permission/attribution, original hash, approved derivative, correct alt/caption, accessible zoom. |
| B11 | DESIRED | Site imagery must work at desktop and mobile without sacrificing loading. | Validate srcset/sizes, intrinsic dimensions, responsive contain/framing, below-fold lazy loading and LCP prioritization. |

## C — P1: content, SEO and page relationships

| ID | Evidence/status | Observation / issue | Targeted action and acceptance |
|---|---|---|---|
| C01 | GSC | 90-day Google Search had 288 impressions and 7 clicks; homepage had 22 impressions, 0 clicks in that window. | Improve relevant search visibility and engagement through real page intent/proof; track trends, not guaranteed ranks. |
| C02 | HIST | `/product-design-nepal` had very few internal links in old crawl. | Link naturally from homepage, services and relevant case studies; re-crawl updated live page. |
| C03 | SOURCE | 14 project raw pages already have basic title/description/H1/canonical; not all final browser versions audited. | Audit actual built/live 14 cases and project listing; strengthen real proof, story, UX and visuals rather than duplicating tags. |
| C04 | SOURCE | Several raw blog posts have ~200–400 total text words and some lack useful original examples. | Review reading value, coverage and task intent; enrich as warranted, no arbitrary word quota. |
| C05 | SOURCE+HIST | Four SaaS empty-state articles overlap in topic; other handoff/audit titles may cannibalize. | Map each intent; expand distinct examples, consolidate only when clearly duplicative with safe permanent redirects. |
| C06 | SOURCE+HIST | New “Designing Handoffs Between People” raw source was a skeleton before build injection. | Verify final built article has full author content, byline/metadata, genuine visual evidence and archive link. |
| C07 | HIST+USER | Blog archive styling/navigation previously broken; Blog icon missing, duplicated/low-contrast breadcrumbs observed. | Recheck deployed page; fix to one accessible breadcrumb, visible blog icon and homepage-consistent card style. |
| C08 | USER | Portfolio case studies should feel like real senior-level narratives, not stock-template lists. | Context/role/problem/constraints/decisions/real screens/trade-offs/outcome; do not invent research or metrics. |
| C09 | DESIRED | Service pages differ by commercial search intent and should not target identical phrases. | One distinct intent for product design Nepal, SaaS UX, Web3 UX, website UX, design systems, UX audit; contextual linking and truth-based copy. |
| C10 | DESIRED | Original article voice and case storytelling must improve. | First-hand, concrete design reasoning, factual examples; Bishal and Niraj as editorial references, no copied wording/design. |
| C11 | DESIRED | Structured data/search metadata may be inconsistent across final generated routes. | Validate 54 final HTML pages for canonical, title, H1, meta, allowed schema, OG and qualified author; no fake reviews/FAQ. |

## D — P1: UX, performance, a11y and measurement

| ID | Evidence/status | Observation / issue | Targeted action and acceptance |
|---|---|---|---|
| D01 | HIST | Mobile homepage Lighthouse score around 88, lab LCP ~2.74 s in one completed CI run; field CWV unavailable. | Repeat 3+ representative runs and read field RUM where available; profile animation startup, hero, image/font tasks. No unjustified “performance fixed” status. |
| D02 | HIST | Offscreen animation callbacks/layout reads and reverse navigation had regressions during past review. | Test complete forward/back navigation, stationary pages, reduced motion, focus and responsive animation before/after optimizations. |
| D03 | HIST | Automated axe detected no final counted violations in a sampled run, but contrast and AT manual review were incomplete. | Audit WCAG 2.2 AA, contrast, keyboard, image dialogs, zoom and screen readers; no certificate from axe alone. |
| D04 | USER | Selected work cards had poor hover readability and some screenshot containers cropped images. | Test exact final route/card states; retain full real screens and accessible readable headings. |
| D05 | DESIRED | Contact and profile credibility/conversion flows need measurement. | Measure click-to-contact, valid submission success and legitimate lead events only, with privacy-safe analytics and approval. |
| D06 | DESIRED | Need reproducible technical reporting, not unreadable tiny scroll screenshots. | Recover original audit URLs/reports or rerun high-resolution pages; never OCR-infer scores from low-res uploaded strips. |
| D07 | DESIRED | Organic/AI visibility lacks sustained baseline. | Compare GSC by Nepal/USA + brand/non-brand + landing page; report 28/90-day windows and actual inquiries, no invented keyword volume. |

## E — P1/P2: social, authority and release

| ID | Evidence/status | Observation / issue | Targeted action and acceptance |
|---|---|---|---|
| E01 | USER | Linktree contains social destinations, some not suited to a professional portfolio. | Extract full final redirect URLs, verify ownership and public visibility; curate relevant professional ones. |
| E02 | USER | Uxcel profile contains skills/credentials; details may need authenticated verification. | Confirm 2023 award category and individual certificate scores/badges with issuer-level proof; avoid inventing numerical placement. |
| E03 | SOURCE+DESIRED | `Person.sameAs` and About/credentials proof may omit or overinclude profiles. | Add only verified owner professional accounts, accurate images, working keyboard links and provenance. |
| E04 | DESIRED | Legitimate links/mentions could improve discoverability. | Obtain consented references from actual employers/project partners, useful case/code/technical posts; no paid link manipulation. |
| E05 | DESIRED | Previous PR work and image coverage may not have been merged/deployed. | Resolve review branch, run CI, create reviewable PR; report source/code/live/indexing separately. Never auto-merge/deploy. |

## Known controlled links and artifact rules

- `https://nischhalsubba.com.np/projects`: source inventory of 14 projects; recalculate and click all cards.
- `https://zapp.today/`, `https://designerex.com.au/`, `https://hamro-idea-website.vercel.app/`: publicly given candidate URLs; verify screenshot and link destination before production use.
- Zakra: no verified live URL supplied. Find the real starter/demo; user screenshot is only a benchmark.
- `https://linktr.ee/nischhalsubba`, `https://app.uxcel.com/ux/nischhal`: owner-supplied identity source leads. Do not publish all Linktree networks by default.
- Google Search appearance: Google owns displayed favicon/snippet/AI Overview/image carousel and may delay after site fixes; distinguish site-controlled changes from Google's independent output.

**Do not assign percentages complete from image-export counts or number of new tickets.** Track actual implemented+tested requirements only. All issues in this register should be reflected in the relevant T01–T107 row or the consolidated batch evidence.

## F — Screaming Frog Nov 5 direct crawl reconciliation (v6.1)

**New evidence, NOT 36 fresh confirmed errors.** The user-provided `internal_all(3).csv` lists 154/154 HTTP 200 and 54/54 HTML indexable, with no missing HTML title/H1/description/canonical. Confirmed two publicly crawlable PDF URLs have divergent noindex policies. Candidate improvements: 27 long descriptions; 7 wide title renders; six brief specialized services; four blogs with only two unique linking pages; large 351 KB homepage markup. See the authoritative `SCREAMING_FROG_FINDINGS_AND_CODEX_ACTIONS_v6_1.md` and per-page CSV for exact affected URLs. Execute within **existing** T21, T25, T45, T48, T66, T67, T72, T74, T87 and the identity/performance batches. Do not add tasks or bulk rewrite metadata based solely on cosmetic length thresholds.
