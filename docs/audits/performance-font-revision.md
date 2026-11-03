# Measured font/content revision — 3 November 2026

Code commit: `00db48e1e5fe78cf1a902d3fa2dc92291235fdaf`. All six workflows passed. The SEO audit passed twelve representative axe scans, seven-width reflow and image-dialog keyboard/focus checks; it completed 108 Lighthouse runs. Full measurements, including separately observed previous production, are in performance-measured-00db48e.json. Artifact: https://github.com/Nischhalsubba/nischhalsubba.com.np/actions/runs/41614974483/artifacts/13221239081

Three sequential runs per device/route, same-run controlled base and review previews; medians below. Lighthouse 13.5.0, simulated mobile settings. These are laboratory measurements, not field p75, INP or post-deployment outcomes.

| Route | Base mobile score | Review mobile score | Review LCP ms | Review TBT ms |
|---|---:|---:|---:|---:|
| / | 66 | 76 | 2758 | 681 |
| /projects | 91 | 97 | 2120 | 0 |
| /project-orkest | 89 | 98 | 1968 | 0 |
| /services | 95 | 98 | 1956 | 0 |
| /blog/ | 94 | 98 | 1987 | 0 |
| /blog/figma-handoff-notes-for-developers | 97 | 99 | 1888 | 0 |

Review desktop medians: homepage 96; the other five routes 100. The earlier code-run homepage scores varied materially, so do not cherry-pick a prior 79 or describe this as a stable universal score. The five inner-page mobile targets passed in this measured run; homepage 90+ remains unmet.

The measured homepage payload was 344 KiB in the first review mobile audit. Font inventory shrank from 426,424 to 140,216 bytes for the primary English faces; at least one original fallback font still loaded. LCP improved, but substantial homepage main-thread blocking remains. A separate CPU-profile job is added to locate the source work before changing animation/startup behavior.

The follow-up content-hashes social cards under the immutable asset cache and includes complete font licenses/readable copy review documents. It does not claim a homepage TBT fix. Its own CI must pass before release. No merge, deployment, Google submission, real screen-reader/WAVE sign-off or field-CWV result is implied.
