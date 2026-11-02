# Homepage parity and SEO release — 2 November 2026

## Scope and design decision

The earlier inner-page pass reused colors but disabled the real homepage toolbar, replaced the live file label, omitted its display scale and chamfered-button renderer, and retained editorial Manrope headings. The user's two screenshots are the acceptance reference. This pass reuses the homepage's actual `Decoder` and `chSize` implementations, CSS, SVG icons, frame markup, active tool tile, `--zk` display-scale formula, button flood gradient, Lenis easing and footer spotlight behavior. Content layouts use the same Doto/Geist/Geist Mono/Manrope roles, purple selection frames and dark workspace surfaces. Semantic content remains available before JavaScript.

Legacy article roots are normalized into the same workspace typography and reading frame. Three accidentally published SEO-brief paragraphs (keywords, search intent and editorial instructions) are replaced with reader-facing context; case-study evidence and article guidance are retained. Mobile component tests measure visible buttons rather than the deliberately hidden toolbar CTA.

## Implemented search improvements

- Final HTML SEO pass covers all 53 retained pages, after both visual installers.
- 53 unique 1200×630 PNG social previews use local homepage fonts, actual page headings and project imagery. These replace the homepage SVG preview and generic abstract-bar cards.
- Each page has one clean canonical, consistent OG/Twitter metadata, large-image preview permission, author identity and connected WebSite/Person/page entities. Existing article dates are preserved, never manufactured.
- The final image sitemap includes all 53 public content URLs and their preview images. A real HTML writing index links all 26 retained articles; the homepage and inner pages have an accessible portfolio discovery footer.
- `robots.txt` allows search crawling, including OAI-SearchBot, while excluding API paths. A public `llms.txt` is a convenience index for systems that choose to use it, not a ranking mechanism.

## Verification and limits

| Requirement | Method | Evidence owner |
| --- | --- | --- |
| Homepage implementation reuse | Generated primitive code compared with original source | audit-workspace-seo.cjs |
| All route layouts, fonts, drawn frames and toolbar state | Chromium matrix at 360, 768, 1440px | browser-workspace-inner-audit.mjs |
| Canonicals, PNG dimensions, entity graphs, sitemap and article links | Final built HTML and binary checks across 53 pages | audit-workspace-seo.cjs |
| Content, local dependencies, retained contact API | Existing final workspace and contact audits | audit-workspace-inner.cjs / browser-contact-audit.mjs |
| Repeatability | Rebuild byte comparison | test-build-determinism.cjs |
| Real indexing, ranking and AI citations | Not verified; no connected Search Console or search-result dataset | Site owner / external search platforms |
| Real-user Core Web Vitals | Not verified; field data unavailable | Search Console / CrUX |

The implementation must pass these checks before a completion claim. CI runs and deployment commit identify the final release evidence. Rankings, indexing, rich results and AI citations are platform decisions and are not guaranteed by technical readiness.

## Official guidance used

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.openai.com/api/docs/bots

Google states that AI search features use the same SEO fundamentals and do not require a special AI schema or `llms.txt`. Structured data must match visible, supportable content. OpenAI documents OAI-SearchBot as the search crawler; hosting/WAF eligibility still needs live verification.

## Maintenance and rollback

Keep page content in existing canonical generators. Maintain shared primitives at the homepage source, final inner composition in `install-workspace-inner.cjs`, page layout in `parity.css`, and the final metadata/image pass in `finalize-workspace-seo.cjs`. Preserve the old website at `backup/pre-workspace-redesign-2026-11-02`. A normal revert of the release commit restores the preceding version.
