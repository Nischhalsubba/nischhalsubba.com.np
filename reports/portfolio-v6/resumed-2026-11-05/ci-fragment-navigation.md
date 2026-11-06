# Native fragment keyboard check

After restoring Process in the mobile menu, CI job 127389503541 passed the complete representative route audit, then failed a case-study assertion reading page.url immediately after Enter: expected #chapter-1, observed an empty fragment. This is separate from the earlier missing mobile link.

The test now waits for native fragment navigation before retaining the unchanged URL and target-focus assertions. A genuine failure to navigate still times out/fails. Per-route logging makes future failures attributable to an exact route and width.

Local verification: all 14 case-study keyboard actions reach #chapter-1 and focus the target; the complete case-study audit passes 98 route/width visits, 28 axe scans, image dialog checks and bidirectional homepage chapter navigation. This was tested against the current review preview, which includes separately staged service/media changes; no case-study chapter behavior was changed. Exact PR-head CI must still be checked after push. No merge or deployment performed.
