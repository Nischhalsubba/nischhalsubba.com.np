# Figma discovery and export evidence — 2026-11-03

This is a known-file audit, not an account-wide audit. The available connector exposes known-key reads, not an account-wide document list. No account-wide completeness is claimed. Five supplied primary candidates and five existing/historical files were checked. Page inventory: 103 discovered, 93 traversed; ten historical Project-Iron pages returned the Starter-plan call limit. The page-access CSV records every result.

The private inventory includes full frame/section labels. The public CSV withholds non-public labels/source deep links while retaining source IDs, dimensions, status and traceability. Screen-sized candidates are not all confirmed screens: the classifier excludes layout boards, hidden/archived/QA-only areas, components, section blocks and non-device-sized candidates; editorial and visual review is still required. Draft/staging status never means approved work.

| Project | File key | Priority | Version / publication boundary |
|---|---|---|---|
| Zapp Today | `dRPI1NQ1uEFJTgdGKSwoaL` | PRIMARY | User-provided primary design; metadata successful; share unverified |
| Masteriyo LMS | `hBVZ96hJzIPNvrFwvmY8Wh` | PRIMARY | User-provided primary design; metadata successful; share unverified |
| Morajaa | `E9BBrx6PdFTqoG3YLvqRX6` | PRIMARY | User-provided primary design; metadata successful; prototype in same file |
| Orkest HQ | `k2qY1tdrTDdm1iFry9Qq4F` | PRIMARY | User-provided primary design; metadata successful |
| Reconwithme | `Xka4AxPZgrQz6btZ3MwBvf` | POTENTIAL NEW CASE STUDY | User-provided; metadata successful; absent from current 14 cases |
| piHub | `HILxD1DKnfALKo4Q5L1IfE` | CURRENT | Existing portfolio source; metadata successful |
| Yarsha | `pYismUGSJo9vLjViMjZENz` | CURRENT—STAGING LINK | Site link currently points at staging; final page is 0:1 |
| Zapp Today | `UVuc0LuF7Ykb0yxfPmzOHX` | LEGACY CASE STUDY | Legacy file, not Zapp 2.0 canonical |
| Zapp Today | `j0HdOWReS3ZxCJf0SgYPci` | LEGACY PROTOTYPES | Legacy prototypes, not Zapp 2.0 canonical |
| Masteriyo LMS | `FdQeGFEGG7kP4q4FkDHQYP` | LEGACY COPY | Legacy similar file; do not assume identical to user new primary |

## Actual bytes and remaining work

{
  "known_files": 10,
  "pages_discovered": 103,
  "pages_traversed": 93,
  "pages_blocked": 10,
  "outer_candidates": 6613,
  "private_archive_candidates": 4063,
  "persisted_screen_originals": 147,
  "queued": 3916,
  "excluded": 2550,
  "account_wide_complete": false,
  "persisted_png_files": 147,
  "unique_png_hashes": 147,
  "duplicate_png_files": 0,
  "public_curated_illustrations": 5,
  "public_derivative_files": 16,
  "figure_placements": 10,
  "case_studies_with_new_figma_figures": 4,
  "articles_with_new_figma_figures": 5,
  "production_images_published": 0
}

Counts refer to saved PNG files with signatures and native dimensions checked, not metadata responses or render URLs. Hash-unique images are counted separately from node exports. Five privacy-reviewed illustrations are present in the review branch, in ten figure placements across four cases and five articles. Production publication count is zero: this PR is not merged/deployed.

The temporary download path returned HTTP 202 with empty bodies in this environment. Authenticated inline screenshots recovered long Morajaa pages at 1441×6959 and other natural dimensions; the Plugin API also exported native screen PNGs. A large Plugin API JSON return was rejected by its explicit 48,000-byte limit; no such failed response is counted as a saved image. No temporary asset URL appears in production HTML.

The broader archive queue is incomplete. Rows marked QUEUED_NOT_EXPORTED are not claimed as exported or approved. Ten legacy pages remain plan-blocked. Full account discovery is unavailable. `site/scripts/figma/export.py` offers dry-run planning, native PNG REST batches, bounded 429/5xx retries, resume, dimensions and hash logs when an already authorized scoped credential exists privately. No REST credential was present or requested in chat; authenticated REST export execution is NOT VERIFIED. MCP export evidence and private originals are archived separately.

Masteriyo: preserve multi-designer attribution; public reuse clearance remains required for the newly exported screens. Reconwithme: retain as a candidate, not a fifteenth case; no public derivative or case was added. Morajaa: long-frame originals remain private pending editorial segmentation and imagery-rights review. Orkest Screens are kept separate from Prototype copies; Yarsha's final-mobile page is preferred over the published staging anchor. Historical Zapp prototypes are retained and labeled separately; anonymous interactive loading is not verified.

Missing-file list: Mokshya, Designerex, Splashnode, Grid Labs, Hamro Idea and Zakra Furniture — LINK_NOT_FOUND; Neverwinter Parser and SassBoilerplate — NO_FIGMA_ASSET_REQUIRED unless actual design sources are later supplied. Existing code/live references may be stronger proof. No Figma URLs or screenshots are fabricated for these cases.

No Figma sharing, organization, ownership, billing, export restriction or team-policy setting was changed. View access was not treated as publication rights.

## Archive availability after interruption

The execution environment became unavailable during additional native export batches. The 147 PNGs in this committed inventory were verified in the working filesystem at that snapshot. Their durable retention and current recoverability are now UNVERIFIED. Saving a previously verified original through the file-saving service failed because no primary execution environment was available. Do not interpret `PNG_PERSISTED` in the snapshot as a currently downloadable archive. Additional successful batch exports were observed, but a final total and complete archive could not be verified after the interruption.

The public five-illustration asset set is safely committed on GitHub. Raw originals and the full private frame-label inventory were intentionally excluded from this public repository. Recover and verify the working environment before claiming a complete private archive; otherwise re-export from known source IDs using the resumable workflow. No complete-account, complete-export or complete-publication claim is made.

## Recovered execution checkpoint

The interruption section above describes an earlier state. Execution recovered, and the current working archive has 886 fully decodable PNGs, 869 hash-unique. The recovered 740-file private checkpoint was durably saved, with follow-up checkpoint replacement pending. The current JSON/CSV inventory supersedes the historical 147-file count. Eight reviewed illustrations / 24 derivative files are committed for 21 placements across five cases and thirteen articles; production publication remains zero. All fourteen case bodies and twenty-six existing articles were rewritten. 3,177 candidates remain queued; account-wide completeness and full archive visual QA are not claimed.

A 20-render native output probe returned only five inline images. A data-output TAR probe returned no file bytes and is not counted as an archive. REST export can resume against the same project/file/page/node layout but has not executed without privately authorized scoped credentials. Browser workspace listing redirected to sign-in; known-file connector reads remain available.
