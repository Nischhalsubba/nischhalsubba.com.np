# Repository Deployment Safety Contract

These rules are mandatory for automated and manual changes to this repository.

## Production build safety

1. Never push an incomplete multi-file asset set to any branch connected to a deployment provider.
2. Prefer one atomic Git tree/commit for mutually dependent visual assets and build code. Do not split production binary artwork into hand-transferred text chunks.
3. For the Signal over Noise hero, `npm run build` must begin by running `scripts/verify-signal-demo-source-v14.cjs`. Do not bypass or weaken its exact Git-blob, decoded WebP, container, byte-count, and dimension validation.
4. The authoritative Signal hero source is `assets/images/signal-demo-poster.webp.b64`. It is a single verified source blob. Do not restore the retired `signal-demo-poster-v4.parts` chunk assembly path to the production hero.
5. `scripts/ensure-signal-portrait-asset-v13.cjs` is only a legacy build-stage compatibility shim. The actual production installer is `scripts/ensure-signal-demo-hero-v15.cjs`. Do not route production back through the retired v14 installer.
6. After writing or reusing an asset through the GitHub API, verify the resulting Git blob SHA before promoting it to `main`.
7. Never interpret a successful Git push as a successful deployment. Report production-live status only after the deployment provider confirms success.
8. When recovering failed deployments, fix every root-cause integrity error first, then replay failed logical changes in chronological order. Do not replay a known-broken intermediate state.
9. Push/replay one deployment state at a time. When deployment status is available, wait for the previous build to succeed before triggering the next one.
10. Do not remove checksum or source-integrity guards merely to make CI green. A failed integrity check means the source bytes must be corrected.
11. Do not transfer long Base64 asset data through manual copy/paste when an already verified Git blob can be attached to the tree by SHA.
12. When the approved Signal artwork changes, update the source blob, verifier constants, hero installer, and reviewed visual baseline together as one validated change set.
13. Final build assertions must validate each token in the artifact where it is actually written. For example, an asset URL written to `style.css` must be checked in CSS, not incorrectly searched for in `index.html`.
14. Hero replacement code must use stable section boundaries or parsed structure. Do not use a single non-nesting regular expression to replace a nested HTML figure.

## Signal source invariants

- Source Git blob SHA-1: `0bcb8cd7a4a22584eac808909d1465f0f3922b0b`
- Base64 source byte count: `114860`
- Decoded WebP byte count: `86144`
- Decoded WebP dimensions: `760x950`
- Hero aspect ratio: `4:5`

The uploaded Signal over Noise demo is the visual and interaction specification for this hero. Preserve its portrait composition, ghost/reasoning layer, orbit geometry, Signal/Intent/Logic/State/Decision nodes, insight behavior, Signal Mode, pointer depth, Escape reset, touch behavior, GSAP entrance treatment, reduced-motion behavior, and responsive 4:5 stage when modifying this feature.
