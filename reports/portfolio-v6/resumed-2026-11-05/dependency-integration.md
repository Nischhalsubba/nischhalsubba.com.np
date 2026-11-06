# Dependency integration — 6 November 2026

The owner explicitly authorized merging all PRs into main. This integration preserves the heads of Dependabot PRs #94, #96, #100, #101 and #104, together with the portfolio stack and current main, so the combined result can be tested before it lands.

Actions upload-artifact and setup-node retain the proposed pinned SHA updates. CodeQL init and analyze both use 9b3254085494b55a0f7c4c2b3d2d52cc712ce370 (4.39.1); neither mismatched intermediate state is merged on its own. Development dependencies take Playwright 1.64.1 and @types/node 26.6.6 while retaining Lighthouse 13.5.0. Lighthouse 13.6 introduced five moderate transitive findings through Sentry/glob/minimatch; that proposed upgrade is excluded from the final tree. Prior source-map-js failures in the older action PRs are resolved by current main’s 1.2.2 lock entry.

Local full validate and contact security tests pass. The final npm audit reports zero vulnerabilities. Fresh remote CI, including CodeQL and Cloudflare build, is still required before merging this dependency integration. No field-performance or full-program-completion claim is made.
