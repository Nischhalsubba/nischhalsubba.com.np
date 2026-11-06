# Source ownership and baseline

Base: df8b8c7c48e9e704469e15bb06cb4ba6d03703af, merged PR #110 (Blog toolbar icon). Review branch: review/portfolio-program-v6. PR API access is denied, so open-PR deduplication remains incomplete.

- Routes: site/config/canonical-routes.json (54 HTML routes, 142 redirects).
- Homepage and motion: site/src/workspace-home/index.html; installed by site/scripts/install-workspace-home.cjs.
- Inner shell: site/scripts/install-workspace-inner.cjs; shared visuals: site/scripts/workspace-visuals.cjs.
- Final SEO, social PNGs, image sitemap, Person graph: site/scripts/finalize-workspace-seo.cjs; overrides: site/src/content/search-metadata.json.
- Case prose: site/src/content/portfolio-editorial.json; article prose: site/src/content/articles-editorial*.json; rendering: site/scripts/editorial/.
- Existing genuine media: site/src/content/portfolio-evidence-images.json and public-image-recipes.json; 60 retained public derivatives pass their hash checks, but original private files are absent from this checkout. Source hashes and Figma node IDs remain available. This is not independent re-export verification.
- Favicons: site/scripts/workspace-icons.cjs. Reuse this pipeline; Google appearance is separately pending.
- Recognition: site/src/content/uxcel-recognition.json has dated issuer references and supplied asset hashes. Independent issuer re-verification is network-blocked; preserve existing evidence without extending claims.
- Generated dist is never edited as source. Local build marker says local unless CI supplies a SHA; it does not establish a deployed SHA.

No shell layout, motion, imagery, tenure claim or deployment was changed. The reproduced current About location sentence now follows the program’s Nepal-based remote default; the UX-audit page adds a practical prioritization example using existing section styles. Documentation comments repair a confirmed CI gate; SEO parsing now preserves apostrophes. Integrated validation includes the final workspace SEO contract.
