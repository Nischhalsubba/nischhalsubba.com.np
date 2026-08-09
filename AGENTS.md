# Repository Deployment Safety Contract

These rules are mandatory for automated and manual changes to this repository.

## Production build safety

1. Never push an incomplete multi-file asset set to any branch connected to a deployment provider.
2. Binary assets split into transfer chunks must be assembled and checksum-verified before the first remote branch update. Prefer one atomic Git tree/commit for all mutually dependent files.
3. For the Signal over Noise poster, `npm run build` must begin by running `scripts/verify-signal-poster-source.cjs`. Do not bypass or weaken its per-segment and final WebP checksum validation.
4. After writing an asset through the GitHub API, verify the resulting Git blob SHA or refetch every dependent file before promoting or replaying commits. A validator that stops at the first error does not prove later segments are valid; verify the complete set.
5. Never interpret a successful Git push as a successful deployment. Report production-live status only after the deployment provider confirms success.
6. When recovering failed deployments, fix every root-cause integrity error first, then replay the failed logical changes in chronological order. Do not replay a known-broken intermediate state.
7. Push/replay one deployment state at a time. When deployment status is available, wait for the previous build to succeed before triggering the next one.
8. Documentation or automation commits inherit any broken build state beneath them. Repair the application/build source before replaying README or bot-generated commits.
9. Do not remove checksum guards merely to make CI green. A failed integrity check means the source bytes must be corrected.
10. Do not transfer long Base64 asset chunks through manual copy/paste when a verified Git blob can be created and attached to the tree by SHA.

## Signal poster invariants

- Final WebP byte size: `65112`
- Final WebP SHA-256: `0ad9e8d745adb38217dd9c148860e27ef8d118531fd31d96362ce0987513bae6`
- `part-01d.b64part` SHA-256: `ccf74dc825122fe9d1384ce5d541a6df9e30ab6d0a565b15afb0b7190e641d58`
- `part-03c.b64part` SHA-256: `86b4085bf87a3f104508f484f0dfde87c264463497d1da916a9a0bc9cc229861`

The verifier contains the authoritative checksum for every segment. If these values intentionally change because the approved source artwork changes, update the source, verifier, production asset script, and reviewed visual baselines together in one validated atomic change set.
