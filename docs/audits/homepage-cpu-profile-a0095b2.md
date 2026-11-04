# Homepage CPU profile — 3 November 2026

Source commit: a0095b2402e160d64613a461ef9f4a45ce6b5dd1. Workflow: https://github.com/Nischhalsubba/nischhalsubba.com.np/actions/runs/41618715299

Chromium sampled startup CPU on the built preview, using normal motion, mobile CPU throttling at 4× and desktop at 1×. These are laboratory samples, not field INP measurements.

The mobile profile attributes 778 ms self time (784 ms inclusive) to `makePen`, which constructs the N outline, queries SVG points and derives its timing geometry. Its containing initialization task lasted 1,102 ms. Desktop `makePen` measured 180 ms self / 182 ms inclusive. The largest remaining named mobile loop accumulated 455 ms inclusive across the recording; this is not one blocking task.

A future optimization should precompute the immutable N geometry or share it between instances, then verify identical path points, timing, canvas output, resize behavior and reduced motion. This diagnosis does not claim that optimization was implemented or that the homepage met the mobile 90 target. Changing the approved animation without a working local browser and output comparison would not provide adequate visual verification.

The measured 00db48e mobile homepage score was 76, LCP 2,758 ms and TBT 681 ms; the five audited inner routes scored 97–99. Runtime availability interrupted further local profiling and extraction. Full profile artifacts are retained in the linked workflow.
