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


## Navigation regression exposed by expanded coverage

The actual mobile-control regression confirmed reverse Credentials navigation could land on the still-visible Project scope sheet. On failure, scrollY was 30724, Credentials top -338/hidden and Project scope remained active. The handler passed a sticky element's current visual position to Lenis. The follow-up resolves document-flow destinations from the stack's unpinned origin and preceding layer heights, preserving in-layer offsets. The same resolver covers menu links, keyboard shortcuts and Contact jumps. A callback diagnostic failed before (element argument) and passes after (correct document coordinate). The complete 17-action forward/reverse control sequence, visibility checks and resize test remain enabled. Earlier Home/Contact test-selector errors were corrected separately; the real reverse-navigation defect is not waived.


## First-paint experiment

After the corrected navigation passes the complete actual-control and resize regression, the remaining LCP target is addressed separately: schedule the existing interaction initializer after a rendering opportunity, with native performance marks and a browser assertion that first contentful paint precedes initialization. Drawing geometry, intro implementation and scene algorithms are retained. This is a candidate until fresh Lighthouse and browser/intro checks pass; moving work does not establish field INP. Background: https://web.dev/articles/optimize-inp and https://web.dev/articles/optimize-long-tasks . The About page also uses Nepal rather than an unverified Kathmandu location claim, consistent with the homepage.

## Critical-document separation candidate

The single-frame scheduling candidate measured 92 mobile / TBT 48.42 ms in the early diagnostic, but LCP remained 2710.53 ms and the stricter native paint-order assertion failed. It is not a signed-off release result. The next candidate separates the unchanged source-owned runtime into a content-hashed deferred local script, preloads it at low priority, and awaits native content paint before initialization with a bounded compatibility fallback. The build audit checks exact source/runtime byte parity and syntax, keeping contact/security assertions against the combined owned code. Native paint timings are included in any assertion failure.

Local final HTML: 348198 bytes / 65986 bytes gzip; runtime: 219676 bytes / 71622 bytes gzip (analysis compression, not a field transfer measurement). The earlier full report's combined HTML transfer was 137763 bytes. Runtime separation reduces the critical document path while retaining all authored content. Local npm run validate passes with 595 byte-stable generated files. Fresh browser, intro and Lighthouse verification remains required. Old runtime hashes are cleaned only from owned generated output.


The final bootstrap waits for a native first-contentful-paint entry when supported, starting immediately if that entry already exists. It schedules initialization once, disconnects the observer, and has a 500 ms deadline plus a frame-based compatibility path. The strict native paint-order assertion remains enabled. A separate reduced-motion context removes optional paint APIs and verifies initialization plus Contact/Credentials/Home navigation.

The execution environment disconnected after a successful 595-file deterministic local validation of the native-paint bootstrap. The additional fallback test's documentation check found one missing contract on an object-property arrow; it is now a named documented function. These recovered changes require CI verification; no new local execution is claimed after the environment became unavailable.
