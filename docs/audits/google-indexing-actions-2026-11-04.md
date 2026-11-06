# Google indexing actions — 4 November 2026

The authenticated Page indexing report was last updated 23 October: 48 indexed and 65 excluded URLs. Exclusions comprise 49 redirects, 10 crawled-not-indexed, three 404s, two noindex and one redirect error. This historical report differs from the newer individual inspection baseline of 50/53 canonical pages indexed.

The ten crawled examples include six discovery/support files (humans.txt, feed.xml, sitemap.xml, llms.txt, llms-full.txt and ai-profile.json), one legacy .html article and three current canonical pages. Google accepted individual indexing requests for /project-zakra-furniture, /blog/saas-dashboard-ux-checklist and /saas-ux-designer, displaying “Indexing requested” and priority crawl queue confirmation for each. This verifies receipt, not indexing.

The live sitemap contained 53 URLs with the correct namespace. It was resubmitted successfully today. Its previous incorrect-namespace error refers to the 30 October read; fresh processing remains pending.

The historical redirect-error example /product-design-nepal.html now resolves in the browser to /product-design-nepal. /blog resolves to /blog/. /blog-design-metrics.html resolves to /blog/. The resume PDF has an intentional noindex header; the portfolio canonical HTML pages are the indexing targets.

One historical 404, /blog-design-systems-front-end.html, still failed in the live browser and was missing from the routing manifest. Add its permanent redirect to /blog/blog-design-systems-front-end and regenerate both the static and Worker redirect maps. Canonical routing tests pass for 280 legacy GET/HEAD cases and 53 combined host/path migrations. This repair is pending deployment; do not claim the live 404 is resolved before deployment.
