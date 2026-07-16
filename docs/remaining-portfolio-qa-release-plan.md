# Remaining Portfolio QA Release Plan

This branch completes the remaining portfolio QA tasks from the Notion delivery board while preserving the last known green build on `main`.

## Release principles

1. Production behavior is the source of truth.
2. Validators and the implementations they enforce must ship together.
3. The build must remain deterministic and must not rewrite tracked source files.
4. Visual baselines are updated only after the rendered change is reviewed and accepted.
5. Missing production secrets must fail safely and clearly, never as an unexplained broken interface.
6. The PR remains draft until GitHub validation and the Cloudflare build both succeed.

## Completion scope

- Correct all canonical and legacy production redirects.
- Verify every custom-domain canonical route and redirect.
- Complete first-party contact handling and Turnstile configuration behavior.
- Verify local ownership of portrait and social-preview assets.
- Remove the mobile homepage blank-space regression.
- Make browser QA ignore only known non-product Cloudflare telemetry aborts.
- Review and resolve visual-regression drift.
- Reduce the highest-risk CSS override debt.
- Strengthen evidence in priority case studies.
- Consolidate shared shell behavior where it prevents current regressions.
- Prioritize the strongest hiring stories while preserving archive access.

## Required checks before merge

- `npm run validate`
- deterministic repeated builds
- no tracked-source mutations
- canonical route and redirect verification
- browser QA across canonical routes and supported viewports
- contact validation and configuration tests
- security-header and CSP verification
- reviewed visual snapshots
- successful Cloudflare build for the PR head

## Merge rule

Do not merge this branch while any known P0 or P1 defect remains, while the Cloudflare build is red, or while a new validator is present without the code path that satisfies it.
