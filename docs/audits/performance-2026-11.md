# Verified performance evidence — 4 November 2026

Latest verified code: `8f712de661d4554dca6f8dd1a116d54fecd0d055`. All six GitHub Actions workflows completed successfully. SEO evidence run: https://github.com/Nischhalsubba/nischhalsubba.com.np/actions/runs/41684371870 . This run includes 108 laboratory observations across base/review/informational production, six routes, two devices and three repetitions. Medians use the middle of three measurements. These are lab results, not field CWV or proof of deployment.

| Route | Review mobile score | Review desktop score | Review mobile LCP ms |
|---|---:|---:|---:|
| / | 91 | 99 | 2779.8237 |
| /projects | 97 | 100 | 2119.4655 |
| /project-orkest | 98 | 100 | 1989.7297 |
| /services | 98 | 100 | 1954.3081 |
| /blog/ | 98 | 100 | 1985.8945 |
| /blog/figma-handoff-notes-for-developers | 99 | 100 | 1886.2758 |

The requested mobile 90+ score target is met on all six measured routes. Mobile homepage CLS is 0 and TBT 138.5 ms; its median LCP remains above the 2500 ms target. Desktop homepage LCP is 611.066 ms, CLS 0.0133473 and TBT 4.5 ms. TBT is not INP. Field CWV/real-user INP remain unverified.

Verified code changes preserve the exact N geometry, defer diode buffers until needed, avoid layout reads in offscreen Work and experience-board animations, cache atmosphere section geometry, invalidate navigation geometry on actual layout changes, and skip Services geometry until initialization. A normal-motion regression test verifies offscreen reads, painted canvas content and navigation in both directions. Reduced-motion, axe, reflow and dialog checks remain in the passing suite. Automated scores do not establish complete WCAG conformance, indexing or ranking.
