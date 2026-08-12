# Portfolio QA Completion Release Plan

This document is the acceptance contract for the single integration pull request that resolves every non-Done item on the Portfolio QA Delivery Board.

## Merge standard

The pull request must not be merged until all applicable automated checks are green and every task below has implementation evidence. External configuration that cannot be exercised automatically must be documented with an exact manual verification procedure and must not be described as verified until that procedure succeeds.

## Pending task matrix

### P0

- Add Turnstile and first-party form handling
  - Server-side validation, Turnstile verification, abuse controls, safe error states, and successful delivery verification.
- Add production security headers
  - CSP, HSTS, nosniff, referrer policy, permissions policy, and COOP pass production checks.
- Align production legacy redirects with the canonical route manifest
  - Every listed legacy route performs one permanent redirect to the expected canonical route.
- Resolve Cloudflare Web Analytics CSP conflict
  - No CSP console error from the Cloudflare beacon.
- Verify all clean routes on the custom production domain
  - All canonical routes return 200 without loops, wrong destinations, or unexpected 404 responses.
- Localize the external portrait asset
  - No critical portrait or social preview depends on a third-party image host.

### P1

- Add visual regression coverage
  - Reviewed baselines cover representative routes and viewports with documented tolerance.
- Make builds deterministic and non-mutating
  - `npm run build` writes only generated output, generation is explicit, repeated builds are byte-stable, and CI runs `git diff --exit-code`.
- Reduce CSS importance and override debt
  - Stable cascade ownership exists, unnecessary `!important` declarations and runtime style injection are removed, and a debt threshold is enforced.
- Replace generic case-study copy with project evidence
  - Priority case studies include truthful constraints, decisions, alternatives, edge cases, collaboration context, evidence, and outcomes.

### P2

- Consolidate shared page chrome into maintainable components
  - Header, navigation, footer, metadata, theme bootstrap, and detail navigation have one maintainable source of truth.
- Reduce portfolio to the strongest hiring stories
  - The homepage prioritizes the strongest projects and preserves discovery through a compact archive or index.

## Required release gates

1. Dependency installation and audit review.
2. Syntax, lint, build, SEO, accessibility, route, content, and structured-data validation.
3. `git diff --exit-code` after validation.
4. Deterministic repeated-build comparison.
5. Browser QA across canonical routes and representative viewports.
6. Contact-form validation and API tests.
7. Visual regression review with approved baselines.
8. Production route, redirect, header, CSP, and runtime verification.
9. No unresolved high-severity review comments.
10. Notion task evidence updated only after the matching verification passes.

## Commit convention

Each commit should contain one coherent change and use a descriptive conventional-commit subject. Commit bodies should explain root cause, implementation, verification, and compatibility considerations when the change is not self-evident.

## Known limitation

No responsible release process can guarantee that software contains literally zero defects. This release instead requires zero known open defects within the audited scope and reproducible evidence for every acceptance criterion.