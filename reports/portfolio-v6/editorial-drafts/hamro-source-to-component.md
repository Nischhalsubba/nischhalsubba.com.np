# A useful image handoff includes the source boundary

Status: unpublished draft for T51. The current Hamro Idea demo is separate from earlier studio work; the example code below is from the present portfolio evidence renderer, not attributed to the historical Hamro implementation.

A screenshot can show what a page looked like and still leave an implementation team with an incomplete handoff. The missing information is often simple: which version is this, where did the image come from, and what is the reader allowed to infer from it?

The current public Hamro Idea demo provides a concrete software-studio website reference. Its retained source capture includes the complete desktop viewport and complete page. The public presentation is not proof that every advertised service was delivered or that an earlier studio design shipped unchanged.

![Actual current Hamro Idea demo](/assets/images/site-captures/hamro-current-demo-69eb816ea462-1440.webp)

Caption: current public Hamro Idea demo, independently captured on 5 November 2026. The committed capture registry links the original PNG, complete page and actual source URL. This is separate from earlier studio work; no business result is inferred from the demo.

The current portfolio renderer uses a source record to keep those relationships together. The selected record supplies the original URL, caption, intrinsic dimensions and responsive variants. An unknown identifier throws rather than silently substituting a decorative image:

```js
const capture = publicCaptures.byId('hamro-current-demo');
const markup = publicCaptures.figure(capture);
```

This is an actual use of the present portfolio component. It is a small pattern, but it makes the handoff reviewable. The caption stays attached to the image, the complete original remains available, and the source can be inspected without reverse-engineering a filename. The build also compares original and derivative hashes; that checks the asset relationship, not the truth of every statement inside the photographed website.

The design-to-code lesson is to specify responsibilities. The source record carries provenance and permission. The component carries accessible rendering and links. The surrounding article carries the contribution and outcome limits. None of those responsibilities should be delegated to an attractive browser frame.

For the original website work, the useful design questions remain the service explanation, section order, responsive hierarchy and path to contact. The present capture demonstrates a current public implementation. It does not establish historical delivery dates, client acquisition or conversion improvement. Those would need their own sources and measurements.

Sources: [current demo](https://hamro-idea-website.vercel.app/), [scoped case](/project-hamro-idea), `site/scripts/public-site-captures.cjs`, `site/src/content/public-site-captures.json` (hamro-current-demo), and the unchanged originals in `reports/portfolio-v6/acquisition/`.

Publication limits: owner editorial review; preserve the explicit distinction between the present portfolio renderer, the current public demo and earlier studio work. No new route is published by this draft.
