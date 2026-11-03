# Recovery checkpoint — 4 November 2026

Code is safely on PR #103 at 8f712de; six workflows passed. The mobile homepage score is 91, desktop 99; inner routes are 97–99 mobile and 100 desktop. See release-verification.md for measured limits and remaining release gates.

The private base archive v3 contains 1482 original PNGs. Continuation v4 contains another 1198: 1482 + 1198 = 2680 originals. SHA-256 hashes give 2481 unique images and 199 duplicate node exports. Both durable archives were restored, ZIP integrity checked and all 2680 PNG hashes and complete decodes reverified. Extract the base first and continuation second; continuation metadata supersedes base metadata. Neither archive confers publication clearance.

Of 6613 inventoried outer candidates, 2550 are non-screen/reference exclusions and two are non-renderable 1×1 source outputs. Eligible candidates: 6613 - 2550 - 2 = 4061. Remaining: 4061 - 2680 = 1381. Account-wide discovery is not available; ten known files contain 103 discovered pages, with 93 traversed and ten legacy pages plan-limited. Thirteen primary frames returned no image attachments after bounded retries. A legacy copy timed out. Keep these separate from successful exports.

Orkest Screens (323) and Prototype (663) are complete in the known inventory. Yarsha Final Mobile Design (265), the remaining piHub Admin and Zapp Web Operations batches are complete. Broader Yarsha prototypes/staging are private and still incomplete. Masteriyo originals remain private pending explicit reuse clearance.

Public review-branch content remains eight curated Figma illustrations / 24 responsive derivatives / 21 placements, separate from three Uxcel badges. Zero newly added images have been deployed. All 14 case studies and 26 articles have been rewritten; missing or confidential evidence is not replaced by invented research or results.

The runtime recovered after an interruption and a clean worktree was created from the remote code while preserving the older checkout. Resumption is based on actual validated PNG paths and source identities, never solely on a saved cursor. Partial base64 writes and temporary attachment URLs do not count. Each new bounded export batch must retain source/render-bound proof and update an atomic progress log. This document records the durable checkpoint, not unsaved work after it.
