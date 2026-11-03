# Verified performance evidence — 2026-11-03

Controlled Lighthouse 13.5.0 measurements ran in GitHub Actions: base `5311ce3` and review `2ca1608`, six routes × two devices × three runs × two commits = 72 measured runs. Local Vite previews use the same runner/settings. These are lab results, not deployed PageSpeed or 28-day CrUX field data. Median = the middle value after sorting the three runs.

| Route | Mobile base → review | Desktop base → review | Review mobile LCP (ms) |
|---|---:|---:|---:|
| / | 79 → 79 | 99 → 99 | 3981 |
| /projects | 88 → 88 | 100 → 100 | 3236 |
| /project-orkest | 89 → 89 | 100 → 100 | 3162 |
| /services | 94 → 94 | 100 → 100 | 2706 |
| /blog/ | 94 → 94 | 100 → 100 | 2709 |
| /blog/figma-handoff-notes-for-developers | 96 → 97 | 100 → 100 | 2287 |

The mobile 90+ target is NOT MET on home, projects and Orkest. The new images did not materially regress those routes. Handoff improved from 96 to 97 in this run; small timing differences should not be overinterpreted. CLS stayed below 0.014 on all measured route/device medians. TBT is not INP; real-user INP and field CWV remain unverified.

Lighthouse accessibility and SEO categories were 100 on all measured templates; those scores do not establish WCAG certification, indexing or ranking. Separate axe tests covered 12 template/device combinations and seven-width reflow checks. The public PSI API returned quota 429. Local Chromium downloads failed, so CI supplied the browser measurements.

Further diagnostics are being collected in CI, including LCP/render-blocking/font/compression audit details and a read-only run against current production. The working environment became unavailable during Figma export, so local waterfall inspection, image processing and further original-file verification are blocked. No speculative production performance fix or deployment is claimed.

Evidence: [successful controlled run](https://github.com/Nischhalsubba/nischhalsubba.com.np/actions/runs/41574327021), [full artifacts](https://github.com/Nischhalsubba/nischhalsubba.com.np/actions/runs/41574327021/artifacts/13203815587), and `performance-measured.json`.
