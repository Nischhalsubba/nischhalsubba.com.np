# SEO and Search Discovery Maintenance

This document defines the production contract for search discovery, canonical routing, crawler files, and social metadata on `nischhalsubba.com.np`.

## One source of truth

`config/canonical-routes.json` is authoritative for:

- indexable HTML routes;
- retired and legacy routes;
- permanent redirects;
- sitemap generation;
- Cloudflare and Worker redirect generation.

Do not maintain a second route inventory by hand.

Run:

```bash
npm run sync:seo-discovery
npm run build
npm run audit:seo-contract
npm run audit:seo-discovery
```

`npm run build` runs discovery synchronization through `prebuild`. `npm run validate` includes the SEO audits used for repository validation.

## Production search contracts

### 1. Sitemap synchronization

`sitemap.xml` is generated from `config/canonical-routes.json` and contains only canonical, indexable HTML routes.

`lastmod` is intentionally omitted until the project has a trustworthy per-page modification-date source. A missing date is more accurate than publishing the same invented date for every route.

### 2. Clean public URLs

Canonical metadata, sitemap entries, internal route definitions, and redirects should use the site's clean public URLs rather than build-time `.html` filenames.

The discovery audit rejects `.html` URLs in the sitemap and verifies that the generated sitemap matches the canonical route manifest exactly.

### 3. Personal entity consolidation

The homepage (`/`) is the canonical owned profile page for Nischhal Raj Subba. Historical `/nischhal-raj-subba` routes permanently redirect to `/`.

`public/nischhal-raj-subba.html` is intentionally retired. The discovery generator and audit fail if that duplicate public source returns.

### 4. Caching policy

Cloudflare Workers Static Assets provides normal revalidation for mutable static content. HTML and CSS should not receive blanket `no-store` or `no-cache` rules unless there is a specific production reason.

The browser runtime is different because this repository intentionally serves stable, unhashed JavaScript module URLs. `/*.js`, `/detail-navigation.js`, and `/seo-enhancements.js` use `no-store, no-cache, must-revalidate, proxy-revalidate` so a page load cannot combine JavaScript from different deployments.

Authored media under `/assets/*` receives bounded browser caching with `stale-while-revalidate`. It is not marked globally immutable because not every authored asset filename is content-hashed.

Crawler-control files use short cache lifetimes so sitemap and robots changes propagate promptly.

### 5. Resume PDF indexing

`/assets/resume.pdf` remains directly downloadable, while `_headers` sends `X-Robots-Tag: noindex`. The HTML portfolio owns search visibility and the resume remains available to people who request it.

### 6. `robots.txt`

`robots.txt` contains standard crawler directives only:

```text
User-agent: *
Allow: /

Sitemap: https://nischhalsubba.com.np/sitemap.xml
```

Keep crawler policy standards-based. New directives should be added only when they are supported by the relevant crawler specification and there is a concrete production requirement.

### 7. Social previews

`scripts/generate-social-previews.cjs` generates deterministic 1200x630 PNG previews for canonical routes during the production build and synchronizes Open Graph and Twitter metadata with those files.

`audit:seo-discovery` verifies the PNG signature, dimensions, matching Open Graph/Twitter URLs, and the `summary_large_image` Twitter card contract.

## Redirect architecture

Do not edit `public/_redirects` or `src/generated/legacy-redirects.js` by hand.

Add or change redirects in `config/canonical-routes.json`, then run:

```bash
npm run sync:seo-discovery
```

The same redirect definitions are consumed by Cloudflare static routing and `src/worker.js`, keeping both routing surfaces aligned.

## Adding a page or article

1. Create the canonical HTML source in the appropriate source folder.
2. Add the source filename to `config/canonical-routes.json` under `html`.
3. If the page replaces an older URL, add the old path under `redirects`.
4. Use a clean, extensionless canonical URL in metadata and structured data.
5. Run `npm run sync:seo-discovery`.
6. Run `npm run validate`.
7. Review the generated sitemap and social preview in the build output.
8. Deploy only after the repository checks pass.

Do not manually add parallel sitemap rows, Worker redirects, or static redirects. The generators exist so one route change does not require several fragile synchronized edits.

## Removing a page

1. Remove the page from the canonical `html` list.
2. Add a meaningful permanent redirect when a replacement exists.
3. Remove or update internal links and related metadata.
4. Run `npm run sync:seo-discovery` and `npm run validate`.
5. Confirm the retired URL is absent from the sitemap and production output.

## Failure modes caught by CI

`audit:seo-discovery` is intended to fail for:

- sitemap drift or non-page resources appearing in the sitemap;
- `.html` URLs exposed as canonical sitemap routes;
- reintroduction of the duplicate personal profile page;
- missing `X-Robots-Tag: noindex` on resources such as the resume and `humans.txt` where required;
- blanket `no-store` or `no-cache` rules on HTML/CSS, or removal of the required stable-JavaScript cache policy;
- missing explicit Cloudflare clean-HTML handling;
- missing, mismatched, invalid, or incorrectly sized social preview images.

## Production verification after deployment

Check these contracts on the live site:

- canonical HTML routes return `200`;
- `.html` variants redirect to the intended clean route;
- `/nischhal-raj-subba` redirects to `/`;
- `/sitemap.xml` contains exactly the current canonical routes;
- `/robots.txt` exposes the sitemap and does not unintentionally block public content;
- `/assets/resume.pdf` returns the intended indexing headers;
- stable JavaScript runtime URLs return the required no-cache runtime policy;
- canonical pages expose matching Open Graph and Twitter preview URLs;
- generated social preview images load successfully.

Search engines control their own recrawl schedules, so a deployment can correct the technical signals immediately while previously indexed results may take longer to update.
