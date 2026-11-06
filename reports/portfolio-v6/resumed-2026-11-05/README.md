# Resumed program evidence — 5 November 2026

This is a bounded, independently reviewed implementation batch, not a claim that the 107-ticket program is complete. The complete ticket matrix is ../progress.json and ../progress.csv. Stale blanket network blockers have been reopened; external approvals/access and Google observations remain distinct from unfinished work.

## Changes
- Align current owned biography, metadata, profile labels and humans.txt with owner-approved 7+ years and Nepal-based remote work; preserve historical employment cities and the dated owner résumé.
- Correct Uxcel 2023 from unsupported third place to issuer-verified Top 10 Product Designer recognition. Five professional certificates individually verified; 39 courses only catalogued, not individually certified by this audit.
- Add official Zapp, Designerex and Hamro links with explicit current/historical and contribution boundaries.
- Publish an independently captured current Hamro demo with immutable original PNGs, SHA-linked uncropped responsive WebP, source/date caption, full-original link and image/social discovery metadata.
- Reuse six unchanged approved retained Figma images for project previews. Fix array-valued evidence decisions and archive hashed-image replacement. These are reused exports, not newly reacquired Figma originals.
- Harden the on-demand capture CLI: immutable run IDs, desktop/mobile viewport support, error rejection, and local-source proxy routing. No external scraping during site build/runtime.

## Verification
Full npm --prefix site run validate: exit 0 (validation-release.log). Final identity/hash contracts pass. Twenty changed-route viewport checks at 320/390/768/1440 pass with axe, decode, overflow and caption/original-control checks (browser-qa.json). Independent review found no remaining Important issues (review.md).

Before-change production: all 54 canonical routes HTTP 200, self-canonical, sitemap exactly 54, deployed SHA 8ac11e4 matches main. Rendered 108 desktop/mobile route checks and 802 media placements recorded. No page errors/overflow/broken decoded images; requestfailed collection does not prove absence of HTTP error responses. Contact configuration failure is separately documented. Legacy article 301 and About alias 301 verified.

## Exact remaining blockers
- Cloudflare token is active but cannot access the correct Worker/account/zone. Contact anti-spam config is missing in the production browser response; no email delivery is claimed. See contact-configuration-plan.md.
- www public DNS has NOERROR/NODATA for A/AAAA/CNAME. Concrete, unapplied proposal in www-dns-proposal.md requires scoped access and explicit DNS approval.
- Secure Figma file_content:read access is needed for independent historical frame reacquisition. Retained verified derivatives remain in use.
- Authorized Search Console/analytics property access is needed for crawl dates, latest sitemap download, field/search/lead evidence. Normal Google query returned a challenge; no SERP/AI Overview/ranking improvement is claimed.
- Zapp, Designerex and Zakra source captures were rejected for resource/render errors. Originals remain local, rejected manifests retained; none published as approved portfolio UI.
- Many media placements and all-ticket acceptance still need work. External profile discrepancies have a concrete draft; no external account was edited.

## Reproduction and rollback
Use audit-live.py for read-only HTTP checks; audit-production-browser.cjs for the baseline inventory; verify-identity.py, verify-captures.cjs and qa-changed-pages.cjs after a complete build. Never browse dist during validate's intermediate legacy rebuild. export-hamro-capture.py reproduces unchanged derivatives from retained capture originals (Pillow required). Existing capture IDs must fail rather than overwrite originals.

If release regression appears, revert this source batch using a normal reviewable revert commit, keep immutable evidence, run validation and verify the new live build marker. Do not force-push or change DNS/secrets as rollback.
