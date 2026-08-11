# SEO, Search Discovery, and AI Discovery Maintenance

This document defines the production contract for search-engine and AI discovery on `nischhalsubba.com.np`.

## One source of truth

`config/canonical-routes.json` is authoritative for:

- indexable HTML routes;
- retired/legacy routes;
- permanent redirects;
- sitemap generation;
- Cloudflare/Worker redirect generation;
- validation of owned URLs in AI discovery files.

Do not hand-maintain a second list of canonical routes.

Run:

```bash
npm run sync:seo-discovery
npm run build
npm run audit:seo-contract
npm run audit:seo-discovery
```

`npm run build` runs the discovery sync automatically through `prebuild`. `npm run validate` includes both SEO audits.

## The eight hardened areas

### 1. Sitemap synchronization

`sitemap.xml` is generated from `config/canonical-routes.json`. It contains only canonical, indexable HTML routes. Machine files and the resume PDF are deliberately excluded.

`lastmod` is omitted until the project has a trustworthy per-page content modification source. Publishing invented or blanket dates is worse than omitting the field.

### 2. Clean URLs in AI files

`scripts/generate-seo-discovery.cjs` normalizes owned URLs in:

- `llms.txt`;
- `llms-full.txt`;
- `ai-profile.json`.

The generator fails when an owned URL cannot be mapped to a canonical route or an explicitly allowed static resource. This prevents stale `.html` and retired URLs from quietly returning.

### 3. Machine files versus traditional search results

`llms.txt`, `llms-full.txt`, and `ai-profile.json` remain crawlable. They are not in the XML sitemap and `_headers` sends `X-Robots-Tag: noindex` for them. This lets compatible agents retrieve the files without asking traditional search engines to rank the raw machine documents.

### 4. Personal entity consolidation

The homepage (`/`) is the canonical owned entity page for Nischhal Raj Subba. The old `/nischhal-raj-subba` and `/nischhal-raj-subba.html` paths permanently redirect to `/`.

`public/nischhal-raj-subba.html` is intentionally deleted. The discovery generator and audit fail if that duplicate source returns.

### 5. Caching policy

Cloudflare Workers Static Assets provides ETag revalidation for mutable static assets by default. HTML and CSS therefore no longer use blanket `no-store`/`no-cache` overrides.

The production runtime is different: this repository intentionally serves stable, unhashed JavaScript module URLs. `/*.js`, `/detail-navigation.js`, and `/seo-enhancements.js` retain the repository's atomic `no-store, no-cache, must-revalidate, proxy-revalidate` policy so a page load cannot combine runtime files from different deployments.

Authored media under `/assets/*` receives a bounded browser cache plus `stale-while-revalidate`. It is intentionally not marked `immutable` because not every authored filename is content-hashed.

Crawler-control files use short cache lifetimes so sitemap/robots changes propagate quickly.

### 6. Resume PDF indexing

`/assets/resume.pdf` remains downloadable and directly accessible, but `_headers` sends `X-Robots-Tag: noindex`. The HTML portfolio owns search visibility while the resume remains useful to people who request it.

### 7. robots.txt

`robots.txt` contains only standard crawler directives:

```text
User-agent: *
Allow: /

Sitemap: https://nischhalsubba.com.np/sitemap.xml
```

Do not add custom `AI-Profile:` or `LLMs:` fields. AI discovery files can still be linked from appropriate HTML metadata/content without pretending those fields are part of the robots standard.

### 8. Social previews

`scripts/generate-social-previews.cjs` generates one deterministic 1200x630 PNG for every canonical route during the production build and rewrites Open Graph/Twitter metadata to that image.

The generator has no image-library dependency. `audit:seo-discovery` verifies PNG signature, dimensions, matching Open Graph/Twitter URLs, and `summary_large_image`.

## Redirect architecture

Do not edit `public/_redirects` or `src/generated/legacy-redirects.js` by hand.

Add or change redirects only in `config/canonical-routes.json`, then run:

```bash
npm run sync:seo-discovery
```

The same redirect data is used by Cloudflare static routing and `src/worker.js`, so both surfaces stay aligned.

## Adding a page or article

1. Create the HTML source.
2. Add the source filename to `config/canonical-routes.json` under `html`.
3. If replacing an old URL, add the old path under `redirects`.
4. Use a clean, extensionless canonical URL in page metadata and structured data.
5. Run `npm run sync:seo-discovery`.
6. Run `npm run validate`.
7. Review the generated sitemap and social preview in the build output.
8. Deploy only after CI passes.

Do not manually add a sitemap row, Worker redirect, static redirect, or AI-file `.html` URL. The generators exist precisely so humans no longer need to remember four synchronized edits.

## Removing a page

1. Remove it from the canonical `html` list.
2. Add a meaningful permanent redirect when a replacement exists.
3. Remove or update references in site content and AI files.
4. Run `npm run sync:seo-discovery` and `npm run validate`.
5. Confirm the retired URL is absent from the sitemap.

## Failure modes caught by CI

`audit:seo-discovery` fails for:

- sitemap drift or extra machine resources;
- `.html` canonical URLs in the sitemap;
- non-standard robots directives;
- unknown or non-canonical owned URLs in AI files;
- invalid `ai-profile.json`;
- reintroduction of the duplicate personal entity page;
- missing `X-Robots-Tag: noindex` on machine files/resume;
- blanket `no-store`/`no-cache` on HTML/CSS or removal of the required atomic JavaScript runtime cache policy;
- missing explicit Cloudflare clean-HTML handling;
- missing, mismatched, non-PNG, or non-1200x630 generated social cards.

## Production verification after deployment

Check these response contracts on the live site:

- canonical HTML routes return `200`;
- `.html` variants redirect to the clean route;
- `/nischhal-raj-subba` redirects to `/`;
- `/sitemap.xml` contains exactly the current canonical routes;
- `/robots.txt` exposes the sitemap and does not block crawling;
- `/assets/resume.pdf`, `/llms.txt`, `/llms-full.txt`, and `/ai-profile.json` return `X-Robots-Tag: noindex`;
- stable JavaScript runtime URLs return the atomic `no-store` policy;
- canonical pages expose matching Open Graph/Twitter PNG preview URLs;
- generated preview images return successfully.

Search engines decide when to recrawl and remove previously indexed documents, so deployment fixes the technical signals immediately but historical search results can take time to disappear.
