# Release verification — 4 November 2026

Full requirement review: [original-request-completion-2026-11-04.md](original-request-completion-2026-11-04.md). The PR description records subsequent CI results; this file records the evidence available when this revision was authored.

Completed code c295423 passed all six workflows, including 12 axe scans with no reported violations, seven-width reflow, image-dialog focus/Escape, normal-motion idle and reverse-navigation checks, build and security checks. Axe incomplete gradient-contrast checks still require manual review; the badge group role is addressed in this follow-up. This revision adds Process/contact visibility guards and corresponding activation regressions. Its own CI must verify those changes.

Latest completed controlled lab home: mobile median 89 / LCP 2746.70 ms, desktop 99 / LCP 623.31 ms. Baseline in the same workflow: mobile 82 / LCP 3695.74 ms. Mobile 90+ and LCP <2500 ms remain open; field CWV/INP unknown. Full measured distributions and artifact source are preserved.

14 reviewed illustrations / 40 derivatives / 37 placements across five cases and 20 articles. All 14 cases and 26 articles have bounded factual writing. Private archive: 3889 native originals; 172 known eligible candidates remain plan limited. Six source links, Masteriyo reuse clearance, real AT/WAVE and authenticated Google sitemap error detail remain external dependencies. Latest selected Google inspections find three formerly unknown articles indexed, with three other routes still crawled/unindexed. No indexing request was performed.

Cloudflare bot reported automatic deployment, but a subsequent browser reload still reported public build 5311ce3. No manual deployment or merge was performed. Production delivery of this PR remains unverified.
