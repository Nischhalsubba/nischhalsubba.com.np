# Performance evidence — 2026-11

Local environment: Node 24.22.1/npm 11.9.0. Pinned axe 4.14.0 and Lighthouse 13.5.0. Public PSI returned HTTP 429 RESOURCE_EXHAUSTED; the owner's prior 78 mobile/93 desktop scores are not current verified measurements. Chromium binary download failed with empty/truncated ZIPs, so local Lighthouse/CrUX numbers are NOT VERIFIED.

The new CI workflow measures homepage, projects, Orkest case, services, blog index and Figma handoff article, three runs per mobile/desktop configuration; it saves full reports, LCP/CLS/TBT and medians. TBT is not INP. These remain lab data, separate from 28-day field metrics. Real-user p75 LCP/INP/CLS is unmeasured unless a field source becomes available. No score target is claimed as achieved.

Five screenshot illustrations use local WebP sources and immutable hashed paths, width/height and lazy loading below the fold. The existing LCP/portrait and approved motion are preserved. New screenshots add no carousel/runtime dependency. Social PNGs are metadata assets, not eager content downloads.

| Illustration | Largest responsive WebP bytes | Native source PNG bytes |
|---|---:|---:|
| orkest-lead-capture | 56308 | 129112 |
| orkest-lead-list | 40794 | 126060 |
| zapp-account-entry | 16020 | 27469 |
| pihub-application-status | 23556 | 59697 |
| yarsha-contact-empty | 15398 | 27950 |

Before/after scores and field measurements remain NOT_VERIFIED until actual reports are collected. A new audit dependency introduced a moderate advisory chain; the version was moved to the npm-audit-recommended 13.5.0 pin and dependency audit rerun. See CI and dependency evidence for the final result.
