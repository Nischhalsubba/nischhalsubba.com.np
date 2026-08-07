# Production delivery

The production portfolio is a Cloudflare Worker named `portfolio-website-2026`.

## Source of truth

- Git branch: `main`
- Build system: Cloudflare Workers Builds Git integration
- Runtime entrypoint: `src/worker.js`
- Static assets: `dist/` through the `ASSETS` binding
- Production hostnames: `nischhalsubba.com.np` and `www.nischhalsubba.com.np`
- Production routing: declared in `wrangler.jsonc`

Cloudflare preview builds use version uploads and preview URLs. Production builds use `wrangler deploy`, which applies the Worker routes declared in Wrangler configuration.

## Provenance

`scripts/write-build-metadata.cjs` writes `dist/build-info.json` from Cloudflare Workers Builds variables:

- `WORKERS_CI_COMMIT_SHA`
- `WORKERS_CI_BRANCH`

The production verification workflow accepts a deployment only when the live commit matches the validated `main` commit and the provider is `cloudflare-workers`.

## QA order

1. A change is validated in pull-request CI.
2. Cloudflare produces a preview deployment for non-production branches.
3. After merge, Workers Builds deploys `main` to production.
4. Production verification waits for the exact commit SHA on the live domain.
5. Production QA waits for the same exact SHA before running route, browser, contact, visual, and header audits.

This prevents QA from accidentally testing an older production build while a new deployment is still propagating.
