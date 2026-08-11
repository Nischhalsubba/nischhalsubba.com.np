# Deployment Safety

This document records the repository's production-safety rules for manual changes, maintenance scripts, and automated workflows.

## Production build safety

1. Never publish an incomplete multi-file asset set to a branch connected to a deployment provider.
2. Keep mutually dependent visual assets and build code in the same reviewed change whenever possible.
3. The homepage hero must not depend on very large Base64 artwork, hand-transferred binary chunks, or build-time reconstruction of poster bytes.
4. The latest approved `hero-section-theme-demo` HTML is the authoritative homepage hero specification. Production should preserve its composition, copy, spacing, typography, dark/light palette, portrait treatment, thesis placement, and compact experience/domain footer unless a newer design is approved.
5. `scripts/ensure-signal-portrait-asset-v13.cjs` and `scripts/ensure-signal-demo-hero-v16.cjs` are historical compatibility stages. A later final hero stage may supersede their generated markup when it runs after them and is independently validated.
6. `npm run prebuild` must syntax-check build scripts before the production build. Do not add integrity checks for assets that production no longer consumes.
7. A successful Git push is not proof of a successful deployment. Treat production as live only after the deployment provider reports success and the site is verified.
8. When recovering a failed deployment, fix the underlying cause and publish one complete corrected state rather than replaying known-broken intermediate states.
9. Build assertions must validate a token in the artifact that actually owns it. CSS selectors and declarations belong to CSS validation rather than HTML string checks.
10. Hero replacement logic must use stable section boundaries or parsed structure. Avoid single non-nesting regular expressions for nested HTML replacement.
11. Final hero installers must be idempotent. Running the installer repeatedly should leave one hero and one corresponding CSS contract block.
12. Before promotion, syntax-check an installer and run it twice against representative input to confirm idempotence.
13. Do not reintroduce `signal-demo-poster.webp.b64`, `signal-demo-poster-v4.parts`, or equivalent chunk-assembly files as production dependencies.
14. Keep the production portrait source local and build-safe. If a replacement binary is required, add it atomically through Git rather than transferring large encoded payloads through text files.

## Current homepage hero invariants

- Approved source: the latest approved `hero-section-theme-demo` HTML.
- Headline: `I turn complicated product logic into interfaces people can act on.`
- Kicker: `Senior product designer · Kathmandu, Nepal · Remote`.
- Main portrait source: `/assets/images/portrait.png`.
- Desktop layout follows the approved two-column `1320px` composition with the established `390 / 590` visual proportion.
- Dark background: `#0b0c0a`.
- Light background: `#f4f0e8`.
- Preserve the seamless portrait fade, subtle ghost portrait, technical grid, orange orbit geometry and particles, product-logic thesis, and compact `6+ years / SaaS · Web3 · Fintech / Design · Implementation` footer.
- The older Signal/Intent/Logic/State/Decision interactive node system is not a required homepage invariant. If historical stages generate it, the final approved hero stage must replace it.
- The global site theme control owns the hero theme. Do not introduce a second hero-only theme switch.

The approved hero source remains authoritative for composition and visual hierarchy until a newer direction is explicitly adopted.
