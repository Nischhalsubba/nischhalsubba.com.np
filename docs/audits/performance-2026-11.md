# Performance evidence — 4 November 2026

Completed code c295423438af7a8ceef3bb8bfccb4362fda6f89c passed all six workflows. Evidence: https://github.com/Nischhalsubba/nischhalsubba.com.np/actions/runs/41765628443 . Tested PR merge source: a94365dd85e48f64cf91eb02b7852312a0cc4244. Lighthouse 13.5.0, Chromium, GitHub-hosted Ubuntu, three repetitions per route/device; lab simulation, not field CWV/INP. Baseline is unchanged main 5311ce3, built on a separate localhost port in the same workflow. Full saved distributions: performance-measured-c295423.json.

| Device | Route | Baseline score | Review score | Baseline LCP ms | Review LCP ms |
|---|---|---:|---:|---:|---:|
| mobile | / | 82 | 89 | 3695.74 | 2746.70 |
| mobile | /projects | 90 | 97 | 3093.32 | 2158.10 |
| mobile | /project-orkest | 89 | 99 | 3167.88 | 1971.13 |
| mobile | /services | 95 | 99 | 2591.74 | 1959.14 |
| mobile | /blog/ | 94 | 98 | 2713.70 | 1994.36 |
| mobile | /blog/figma-handoff-notes-for-developers | 97 | 99 | 2291.09 | 1887.43 |
| desktop | / | 99 | 99 | 795.49 | 623.31 |
| desktop | /projects | 100 | 100 | 670.65 | 516.38 |
| desktop | /project-orkest | 100 | 100 | 693.92 | 470.14 |
| desktop | /services | 100 | 100 | 575.33 | 450.03 |
| desktop | /blog/ | 100 | 100 | 615.86 | 466.10 |
| desktop | /blog/figma-handoff-notes-for-developers | 100 | 100 | 571.91 | 428.43 |

Review home mobile: score runs 90/88/89, median 89; LCP median 2746.70 ms, CLS 0, TBT 227 ms. Mobile 90+ and homepage LCP <2500 ms remain OPEN. Home desktop median 99 / LCP 623.31 ms. Historical 91 is not a stable latest pass. Do not compare one favorable score with a different run's baseline; variability exists even for the unchanged main.

The About and unseen-footer guards passed the expanded motion regression, including activation and reverse navigation. CPU profile then identified the still-offscreen Process dial loop (428.70 ms self / 430.59 ms inclusive). Its read occurred before its viewport check. The contact canvas had the same source-confirmed ordering. This next revision adds positive-area visibility guards to both and verifies zero offscreen reads plus activation on navigation. Diagnostics executing the actual prior callbacks each failed with one offscreen read; corrected callbacks pass with zero. Fresh browser CI and lab measurements are required before claiming any improvement from this revision. N geometry and visible drawing algorithms are retained.


## ffa654c checkpoint and stationary-geometry follow-up

All six workflows passed in run 41775665276. Latest full measurements: homepage mobile 88 / LCP 2740.38 ms / TBT 222 ms / CLS 0; desktop 99 / LCP 630.15 ms. The same-run unchanged mobile baseline is 61 / LCP 4056.37 ms, versus 82 in the previous run, so variability is substantial. Do not attribute a score increase to an individual guard. Full distributions: performance-measured-ffa654c.json. Twelve axe scans report no violations; only gradient contrast remains incomplete. Badge semantics warning resolved.

The new profile shifts the largest layout cost to stackTick (423.26 ms self / 426.39 ms inclusive). Both stackTick and fade transitions reread section rectangles even with no scrolling or layout change. The next revision caches stationary geometry, invalidates on scrolling, viewport dimensions, layer resize and font readiness, and batches rectangle reads before style writes. Time-dependent transition types retain per-frame updates. The expanded browser regression checks zero stationary layer reads, all nine chapters forward/backward, visibility and resized navigation. Callback diagnostics failed on old code and pass on the correction, including scroll and layout invalidation. New CI is required before reporting this revision as verified.

The profile job now also emits a three-run-per-device homepage-only diagnostic early. This subset does not replace the existing 108-observation full workflow.
