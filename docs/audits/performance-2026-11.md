# Performance evidence — 4 November 2026

Latest completed evidence run before this revision: https://github.com/Nischhalsubba/nischhalsubba.com.np/actions/runs/41741887235 (workflow head f9b66b17bb2f82ac5cf7d476df8ce91b577ac98a; tested merge source 6d36f4d5ee22ba290423e0a43f3ba0dd3d25119f). 108 lab observations, three repetitions per route/device/build group. Historical 8f712de home score 91 is superseded by this observation; it is not a reliable current pass.

| Route | Review mobile median | Review mobile LCP ms |
|---|---:|---:|
| / | 89 | 2724.64 |
| /projects | 97 | 2135.92 |
| /project-orkest | 98 | 1982.31 |
| /services | 98 | 1957.29 |
| /blog/ | 98 | 1983.99 |
| /blog/figma-handoff-notes-for-developers | 99 | 1886.58 |

Home desktop: 99, LCP 601.05 ms, CLS 0.01404, TBT 0. Home mobile: CLS 0, TBT 195 ms. Baseline main home mobile: 66, LCP 3891.41 ms, TBT 624 ms. This is lab evidence, not field CWV or real-user INP. Mobile score 90+ and homepage LCP below 2.5 seconds remain open.

CPU profile identified repeated offscreen About animation layout reads (loop 475 ms self / 591 ms inclusive). This revision gates the loop on IntersectionObserver visibility and document visibility before geometry reads. The normal-motion regression asserts zero offscreen About reads while retaining bidirectional navigation. This candidate fix has no new measured performance result yet. Exact N geometry and visible animation behavior are retained.
