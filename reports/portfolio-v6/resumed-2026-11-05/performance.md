# Final batch performance observations

Three sequential Lighthouse performance samples per mobile/desktop device were taken against the exact final local homepage build using system Chromium, simulated throttling and no parallel browser audit. Native reports are in lighthouse/; full sample distributions and fetch times in performance-summary.json. These are local lab results, not production delivery, Nepal/US field p75, CrUX, RUM or INP evidence.

Mobile scores: 90, 92, 93; median LCP 2910 ms. Desktop scores: 99, 98, 98; median LCP 828 ms. No runtime errors or run warnings. No before/after improvement claim: older samples were not a controlled identical-network baseline. New image previews did not require animation/shell redesign; no performance finding was "fixed" merely to improve a composite score.

native-performance-findings.csv preserves every scored-less-than-one audit in all six reports, including metrics and diagnostics. These are observations requiring source/route-specific diagnosis, not a list of confirmed website defects. Historical tiny audit strips remain TOOL_NOT_IDENTIFIED; fresh reports do not recover their unreadable scores.
