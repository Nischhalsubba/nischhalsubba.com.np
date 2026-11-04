> Current visual/editorial status: see [4 November follow-up review](portfolio-visual-editorial-review-2026-11-04.md). It supersedes the earlier image totals and clearance/source gaps below: 16 images, 50 derivatives, 35 placements in 7 cases and 17 articles; five matching Figma sources are owner-deferred.

# Original execution bundle: completion review, 4 November 2026

PR: https://github.com/Nischhalsubba/nischhalsubba.com.np/pull/103

The full master prompt was compared against the repository and both supplied v2 bundles. This is a partial completion with implemented, verified changes and explicit external blockers; export coverage is not an overall completion percentage. PR remains a review branch, not a deployment.

| Requirement | Current evidence | Remaining work |
|---|---|---|
| Repository discovery and P0 safety | Source-owned production build; route, canonical, metadata, schema and content checks; existing functionality retained | Release verification after deployment |
| Technical SEO and discovery | 53 canonical routes; redirect, GET/HEAD, migration, sitemap, image discovery, social cards and structured-data checks in validation/CI | Google sitemap processing error needs authenticated detail; indexing is Google's decision |
| All existing project and article content | 14 cases and 26 articles rewritten; all reviewed; this revision improves 14 outcome descriptions and adds concrete examples to 10 articles | Owner confirmation of historical role/scope remains useful; no fabricated research, conversion numbers or shipped outcomes added |
| Figma inventory and original export | 10 known files, 103 pages discovered, 93 traversed; 3,889 native PNG originals persisted; 3,554 unique hashes and 335 duplicate-node exports | 172 eligible candidates in plan-limited legacy Project-Iron file remain; 10 pages blocked; account-wide completeness not established |
| Editorial curation and integration | 18 privacy-reviewed illustrations, 56 local derivative files, 42 placements in six cases and 20 articles; meaningful alt/captions, reserved dimensions and responsive WebP | Six case source links missing; Masteriyo team reuse clearance needed; two code-focused projects need no invented Figma screens |
| Source verification this revision | Native Figma exports matched archived bytes for six selected nodes; no temporary Figma URLs used in production code | Remaining private archive has not all been visually reviewed or approved for publication |
| Accessibility | Automated axe/reflow/dialog/motion tests exist; local structural/content validation passes | New CI pending; actual screen-reader and WAVE sessions not completed; no WCAG conformance claim |
| Performance | Latest completed f9b66b1 run: home mobile median 89, LCP 2,724.64 ms; desktop 99; five inner routes 97–99 mobile | Mobile 90+ and home LCP <2.5 s remain open. New offscreen About layout-read guard requires CI measurement; field INP/CWV unverified |
| Search Console | Nov 4 read-only inspections: home, piHub and all three formerly unknown articles indexed, canonical self; sitemap still reports one error | Authenticated sitemap detail unavailable; no submission or indexing request performed |
| Reviewable PR and issue register | Existing draft PR #103 updated; reproducible recipes, public asset provenance and tests included | No merge/deployment performed |

## Public source selection

New selections: Orkest `k2qY1tdrTDdm1iFry9Qq4F` node `160:387`; piHub `HILxD1DKnfALKo4Q5L1IfE` nodes `2:1272`, `2228:545`; Zapp primary `dRPI1NQ1uEFJTgdGKSwoaL` nodes `19:149`, `20:26`; Yarsha `pYismUGSJo9vLjViMjZENz` node `6092:262038`. These six were exported previously and reverified, so they do not increase the 3,889 original count. Orkest selection uses a current-labeled frame; drafts are not treated as approved work. piHub financial values, delivery ID and Yarsha transaction values/addresses are masked. Yarsha crop excludes token artwork.

Full reviewed public attribution is in `site/src/content/portfolio-evidence-images.json`; placements are in `screenshot-to-content-map.csv`. Full private inventory remains in the saved archive, not the public repository. Known missing links: Mokshya, Designerex, Splashnode, GridLabs, HamroIdea, Zakra. Masteriyo primary `hBVZ96hJzIPNvrFwvmY8Wh` has owner-confirmed publication permission with team attribution in this continuation; four authoring screens are now integrated. Legacy Project-Iron `j0HdOWReS3ZxCJf0SgYPci` is plan limited; no billing or sharing changes were made. Sass Boilerplate and Neverwinter Parser are code-focused projects, not missing screenshot deliverables to fabricate.

## Validation and interpretation

`npm run validate` passes locally, including repeat-build determinism across 594 generated files. Six new derivatives were visually checked after masking. Browser/Lighthouse execution locally was unavailable because the Chromium download failed; new CI results must be checked before release. Earlier 91 mobile observations are historical, not a stable latest result. The f9 run measured 89; this revision corrects that report.

The live browser reported build `5311ce357aaaf64ef21bf90a7efbe3f4b03719e6`. Live checks do not prove this PR was deployed. The newly indexed articles predate deployment of this work and is not attributed to this PR. A Figma access-denied design does not prove backend authorization; a simulated completion design does not prove payment or delivery; transaction detail does not prove signing. Article text preserves those distinctions.

## Follow-up verification

Nov 4 URL refresh: the three formerly unknown articles (empty-state guide, product clarity, wallet connection) now report indexed. The SaaS dashboard checklist, Zakra case and SaaS UX service page still report crawled/currently not indexed. The other historical inspection results are not represented as freshly rechecked.

Code f58bb76 passed build/validation, security and Hero UX. The expanded motion assertion failed with 13 About layout reads in 250 ms. About starts exactly at the viewport boundary; the IntersectionObserver standard allows isIntersecting to be true for a zero-area boundary. Follow-up code 2588e2d requires positive intersection area and a tiny additional threshold so entering from that boundary still triggers observation. Both the zero-read assertion and reverse-navigation assertion remain enabled. Reference: https://www.w3.org/TR/intersection-observer/ . New CI must verify this fix.

Local environment: Node v24.22.1 / npm 11.9.0. `npm ci`, `npm run validate`, `node scripts/lint-project.cjs` and `git diff --check` exited 0. Local `npx playwright install chromium` exited 1 (empty/truncated download); browser measurements are therefore performed in GitHub Actions. The validation aggregate covers build, lint, links, SEO contracts/discovery/workspace, smoke, contact security, routing, editorial and repeat-build determinism.

Keyword/market ledger: `docs/seo/KEYWORD_MAP.csv`; unvalidated seeds remain CANDIDATE_UNVALIDATED, with Nepal/international targeting retained from the supplied seeds. No guessed volume/KD/CPC. URL/robots/canonical live baseline: `docs/seo/URL_INVENTORY.csv` and `docs/audits/live-http-baseline.json` (dated Nov 3), distinct from built-preview validation. After an approved release, verify the new build, live redirects/robots/sitemap, then inspect the three still-unindexed routes and compare Search Console query/page/country trends against the saved baseline; no guaranteed ranking or indexing claims.

A subsequent profile of 2588e2d passed native N geometry verification and identified the unseen footer loop as the next largest named startup cost (492 ms self / 494 ms inclusive in the sampled mobile recording). Its visibility guard ran after getBoundingClientRect. The guard now runs first. A diagnostic executing the actual footer callback failed on the previous source (one unseen layout read) and passed on the revision (zero). The browser suite also counts unseen footer reads. New final-commit CI remains required; sampled CPU cost is not a Lighthouse score or INP.

Cloudflare's repository bot reports automatic deployment of 2588e2d, but a subsequent public browser reload still reported build 5311ce3. These signals are recorded separately: the public host has not been verified to serve the PR, and no manual deployment or merge was performed.

## External backlog and ownership

| Task | Owner / dependency | Estimated impact (qualitative, not a promised result) |
|---|---|---|
| Remaining 172 originals / blocked pages | Nischhal; authorized Figma plan capability | Completes known-source archive coverage; no direct ranking gain established |
| Six source links and team reuse clearance | Nischhal and relevant rights holders | Enables honest visual coverage for additional cases |
| Detailed sitemap error | Nischhal; authenticated Search Console dashboard | Resolves uncertainty about Google's sitemap processing; indexing effect unknown |
| Manual AT/WAVE and device checks | Accessibility reviewer; real assistive technology | May reveal interaction barriers automated checks miss |
| Field CWV/INP and post-release live checks | Maintainer; verified served build and sufficient real-user data | Establishes actual delivery and real-user experience |
| Keyword validation / authority roadmap | Nischhal; available research data and editorial outreach decisions | Tests Nepal/international intent hypotheses; no ranking guarantee |

Known-candidate export calculation: 3,889 / 4,061 × 100 = 95.76% (rounded). This is only original export coverage, not task completion or editorial approval coverage. No numeric overall completion rate is defensible across these different gates.


## Completed CI checkpoint and final follow-up

All six workflows passed on c295423. Fresh controlled medians are preserved in performance-measured-c295423.json: mobile home 82 baseline / 89 review, LCP 3695.74 / 2746.70 ms; desktop home 99 / 99, LCP 795.49 / 623.31 ms. Five inner routes score 97–99 mobile and 100 desktop. Twelve axe scans reported no violations, but incomplete gradient-contrast and badge-label checks require separate treatment. The badge semantic role is fixed in the follow-up; gradient contrast still needs manual review. Follow-up Process/contact visibility guards have local failing-before/passing-after diagnostics and await CI. Earlier pending-status statements above are dated checkpoints, superseded by this section.

## Connected case-study continuation

All fourteen cases now have a distinct product question, a connected design path, chapter links, explicit trade-offs and reflection. This describes the design rationale and state sequence; it does not invent a historical research timeline. Masteriyo adds four previously exported source screens and a concrete authoring example in the design-systems article. Six matching Figma links still await the owner. Code projects remain grounded in code artifacts.

Mobile now bypasses the full-screen decorative loading overlay; desktop retains it. The main hero interactions remain. Image expansion now loads the largest approved derivative. Current performance is pending fresh browser evidence: the last completed pre-change homepage median was 88 / LCP 2779.68 ms, not a pass. Local browser installation failed on a truncated Chromium ZIP; CI includes all fourteen case routes for axe, reflow, chapter focus and modal checks.

Authenticated GSC now identifies the exact sitemap error as incorrect namespace (line 2 / urlset, last read 30 October). Current production XML is independently verified correct with 53 URLs; legacy generators are corrected and resubmission remains NOT EXECUTED pending explicit approval. Actual public code sources now support both code cases; SassBoilerplate ownership is corrected to an attributed learning archive.
