# Local lab performance

Three samples per device on the unchanged homepage, before the About copy/rubric edits. Native Lighthouse JSON is under lighthouse/. These runs used local preview, system Chromium, simulated throttling and no parallel browser audit. They measure this cloud machine, not production delivery, CrUX/RUM, field INP or country-specific experience. No before/after speed improvement is claimed. Source shell and animation were preserved. External resources may be unavailable under the network policy; consult run warnings.

- mobile: median LCP 2909 ms; scores 0.93, 0.92, 0.81
- desktop: median LCP 868 ms; scores 0.98, 0.99, 0.99

The first mobile native report identifies `section#top > div.hero-bottom > p.hb-p` as the LCP element, with render delay dominating its breakdown. Long-task entries include the homepage and `workspace-runtime-e94fe5107633.js`; the render-blocking-resource table is empty. This supports further profiling of startup scheduling rather than assuming image download is the bottleneck. No animation or runtime optimization was made without a controlled visual/interaction comparison.
