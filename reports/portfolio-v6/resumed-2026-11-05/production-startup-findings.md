# Production startup profile

Headless Chromium on this cloud host, default motion, fresh browser context per run, no CPU/network throttle, proxy network, 10 seconds after DOMContentLoaded. Synthetic lab observations, not field CWV/p75, mobile hardware or causal before/after evidence.

390px: LCP samples [1180, 404, 444] ms; median 444 ms. Final observed elements: [{'tag': 'P', 'id': '', 'className': 'hb-p'}, {'tag': 'P', 'id': '', 'className': 'hb-p'}, {'tag': 'P', 'id': '', 'className': 'hb-p'}]. Long-task counts: [2, 2, 2]. No page errors recorded.
1440px: LCP samples [2036, 2464, 2456] ms; median 2456 ms. Final observed elements: [{'tag': 'B', 'id': 'fgW', 'className': 'fl'}, {'tag': 'B', 'id': 'fgW', 'className': 'fl'}, {'tag': 'B', 'id': 'fgW', 'className': 'fl'}]. Long-task counts: [3, 7, 2]. No page errors recorded.

These observations identify startup behavior of the published baseline, not the new review branch. Existing local simulated-throttling Lighthouse reports are retained in performance-summary.json; different conditions cannot establish a performance improvement. Field CWV/p75 and INP remain unavailable. No speculative animation redesign or score-only fix was made.
