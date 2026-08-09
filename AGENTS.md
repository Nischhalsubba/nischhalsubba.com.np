# Repository Deployment Safety Contract

These rules are mandatory for automated and manual changes to this repository.

## Production build safety

1. Never push an incomplete multi-file asset set to any branch connected to a deployment provider.
2. Prefer one atomic Git tree/commit for mutually dependent visual assets and build code.
3. The Signal over Noise hero must not depend on giant Base64 artwork files, hand-transferred binary chunks, or build-time reconstruction of poster bytes.
4. The uploaded Signal over Noise GSAP demo is the visual and interaction specification. The production implementation recreates that composition with the existing `/assets/images/portrait.png` asset plus HTML, CSS, SVG and JS.
5. `scripts/ensure-signal-portrait-asset-v13.cjs` is only the historical build-stage compatibility shim. It must invoke `scripts/ensure-signal-demo-hero-v16.cjs` unless a later, fully validated installer explicitly supersedes v16.
6. `npm run prebuild` must run syntax/build-script preflight before the production build. Do not add an asset-integrity verifier for a source that production no longer consumes.
7. Never interpret a successful Git push as a successful deployment. Report production-live status only after the deployment provider confirms success.
8. When recovering failed deployments, fix the root cause first and push one complete corrected state. Do not replay known-broken intermediate states merely to reproduce their failures.
9. Final build assertions must validate each token in the artifact where it is actually written. A CSS asset or selector must be checked in CSS, not incorrectly searched for in HTML.
10. Hero replacement code must use stable section boundaries or parsed structure. Do not use a single non-nesting regular expression to replace nested HTML.
11. Every Signal installer must be idempotent: repeated execution must leave exactly one stage, one legend, one runtime block and one CSS block.
12. Before promotion, syntax-check the installer and its generated browser runtime and run it twice against a representative mock page.
13. Do not reintroduce `signal-demo-poster.webp.b64`, `signal-demo-poster-v4.parts`, or any equivalent chunk assembly as a production dependency.
14. If the approved portrait itself changes, add the replacement binary atomically through Git rather than copying long Base64 through text APIs.

## Signal hero invariants

- Hero aspect ratio: `4:5`
- Main portrait source: `/assets/images/portrait.png`
- Required nodes: Signal, Intent, Logic, State, Decision
- Required behavior: GSAP entrance when available, pointer depth on hover-capable devices, touch/click node activation, Signal Mode, insight card, ghost/reasoning layer, Escape reset, and reduced-motion handling
- Required visual language: dark technical grid, halftone/reasoning portrait, orange orbit/feedback geometry, white signal point, product-logic quote and compact experience/domain footer

The uploaded Signal over Noise demo remains the authority for composition, hierarchy, interaction timing and visual semantics. Production must stay functionally faithful while using build-safe local assets.
