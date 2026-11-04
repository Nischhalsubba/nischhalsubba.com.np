# Recovery checkpoint — 4 November 2026

PR #103 remains draft. Existing head f9b66b1 has six successful GitHub workflows, rechecked during this continuation. This continuation performed no merge or deployment.

## Durable archive

Base checkpoint v3 contains 1,482 native originals. Saved continuation v9 contains 2,407 more: 1,482 + 2,407 = 3,889 originals. There are 3,554 unique SHA-256 hashes and 335 duplicate node exports. Every original was fully decoded and hashed; all base originals are unchanged. The rebuilt continuation ZIP passed its CRC check and was saved as version 9 of the existing continuation file.

The restored continuation v8 actually contained 3,681 total originals. This run recovered all 208 accessible missing candidates: 170 Android staging screens and 38 difficult source renders. Earlier conversation progress beyond v8 was not treated as durable evidence. Lossless multipart transport preserved exact original bytes, source identity, source CRC and native frame/render dimensions where ordinary attachments failed. Resized downloads were rejected and do not contribute to the count.

Eligible known candidates: 6,613 outer candidates - 2,550 non-screen/reference exclusions - two non-renderable source outputs = 4,061. Remaining: 4,061 - 3,889 = 172. All remaining candidates belong to the plan-limited legacy Project-Iron source. No plan-limit bypass was attempted. Accessible inventory coverage is complete; overall known export coverage is 3,889 / 4,061 × 100 = 95.76%. This is an export percentage, not overall release completion.

Ten known files contain 103 discovered pages; 93 were traversed and ten legacy pages remain plan-limited. Account-wide discovery remains unavailable. Previous no-byte/timeout records are historical attempts; current inventory.json and continuation-checkpoint.json supersede their pending status. Zero accessible attachment exceptions remain.

Extract base v3 first and continuation v9 second. Continuation metadata supersedes base metadata. Originals remain private. Export recovery does not grant publication rights. Masteriyo team-material reuse still requires explicit clearance.

## Publication and release boundaries

The review branch retains eight privacy-reviewed Figma illustrations, 24 responsive derivatives and 21 placements across five cases and 13 articles, separate from three Uxcel badges. No newly recovered original was published by this continuation. All 14 case studies and 26 articles remain rewritten; missing evidence is not replaced with invented research or results.

Earlier laboratory evidence remains historical: homepage 91 mobile / 99 desktop and five inner routes 97–99 mobile / 100 desktop. Homepage median mobile LCP was 2,779.8237 ms; the 2.5-second target remains open. Real assistive-technology review, WAVE, field CWV/INP and post-release Search Console observations remain unverified. See release-verification.md.

Cloudflare's PR bot reports a successful deployment of f9b66b1. This is not independent verification of which version the public domain serves. This continuation does not certify zero production publication.

Full local `npm run validate` passed in the isolated checkout on 4 November, including repeated-build determinism (578 generated files). Final SEO acceptance passed for 53 routes; evidence acceptance passed for eight curated originals and 21 placements; editorial acceptance passed for 14 projects and 26 articles. No new browser or performance measurement is implied.

The updated per-frame inventory remains in the private v9 archive. The public CSV retains its earlier 2,680-original checkpoint; aggregate counts in figma-export-summary.json describe the current verified archive. No new per-frame source metadata is included in this documentation update.
