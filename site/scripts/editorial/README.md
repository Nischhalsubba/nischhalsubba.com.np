# Workspace editorial ownership

The final inner installer calls `render.cjs` after historical compatibility transformations. `src/content/portfolio-editorial.json` owns final prose for the fourteen retained cases. `src/content/articles-editorial*.json` owns final prose and distinct intent for the twenty-six retained articles. Do not patch `dist` or an earlier generator to change the final narrative.

The existing title/canonical/publication metadata and external artifact links are retained. The final SEO stage writes current descriptions, matching update dates and image metadata. No source date is invented when original publication metadata is absent.

Figures come only from `portfolio-evidence-images.json`, whose source hash, node and publication-review boundary are explicit. Private originals remain outside deployment and Git. The public renderer never reads private archive labels.

Run `npm run build`, `npm run audit:editorial` and the integrated `npm run validate`. Browser accessibility, layout and performance evidence remains a separate release gate. An automated content contract does not establish the truth of owner-supplied historical claims or certify editorial quality.
