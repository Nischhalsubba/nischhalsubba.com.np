# Repository Deployment Safety Contract

These rules are mandatory for automated and manual changes to this repository.

## Production build safety

1. Never push an incomplete multi-file asset set to any branch connected to a deployment provider.
2. Prefer one atomic Git tree/commit for mutually dependent visual assets and build code.
3. The homepage hero must not depend on giant Base64 artwork files, hand-transferred binary chunks, or build-time reconstruction of poster bytes.
4. The latest user-approved `hero-section-theme-demo` HTML is the authoritative homepage hero specification. Production must preserve its composition, copy, spacing, typography, dark/light palette, seamless portrait fade, thesis placement, and compact experience/domain footer.
5. `scripts/ensure-signal-portrait-asset-v13.cjs` and `scripts/ensure-signal-demo-hero-v16.cjs` are historical compatibility stages only. A later final hero stage may supersede their generated markup as long as it runs last and is independently validated.
6. `npm run prebuild` must run syntax/build-script preflight before the production build. Do not add an asset-integrity verifier for a source that production no longer consumes.
7. Never interpret a successful Git push as a successful deployment. Report production-live status only after the deployment provider confirms success.
8. When recovering failed deployments, fix the root cause first and push one complete corrected state. Do not replay known-broken intermediate states merely to reproduce their failures.
9. Final build assertions must validate each token in the artifact where it is actually written. A CSS asset or selector must be checked in CSS, not incorrectly searched for in HTML.
10. Hero replacement code must use stable section boundaries or parsed structure. Do not use a single non-nesting regular expression to replace nested HTML.
11. Every final hero installer must be idempotent: repeated execution must leave exactly one hero and one CSS contract block.
12. Before promotion, syntax-check the installer and run it twice against a representative mock page.
13. Do not reintroduce `signal-demo-poster.webp.b64`, `signal-demo-poster-v4.parts`, or any equivalent chunk assembly as a production dependency.
14. Keep the production portrait source local and build-safe. If a replacement binary is ever required, add it atomically through Git rather than copying long Base64 through text APIs.

## Current homepage hero invariants

- Approved source: the latest user-uploaded `hero-section-theme-demo` HTML.
- Headline: `I turn complicated product logic into interfaces people can act on.`
- Kicker: `Senior product designer · Kathmandu, Nepal · Remote`.
- Main portrait source remains the local `/assets/images/portrait.png` asset.
- Desktop layout follows the approved two-column `1320px` composition and the visual uses the approved `390 / 590` proportion.
- Dark background: `#0b0c0a`; light background: `#f4f0e8`.
- Required visual language: seamless portrait fade with no rectangular card edge, subtle ghost portrait, technical grid, orange orbit geometry and particles, product-logic thesis, and compact `6+ years / SaaS · Web3 · Fintech / Design · Implementation` footer.
- The older Signal/Intent/Logic/State/Decision interactive node system is no longer a required homepage invariant. If historical stages generate it, the final approved hero stage must replace it before output is considered complete.
- The site's existing global theme control must drive the hero theme. Do not add a second hero-local theme switch to production.

The uploaded hero demo remains the authority for composition and visual hierarchy. Production should not reinterpret it into a framed poster, negative portrait, or interactive node panel unless the user explicitly approves a new direction.
