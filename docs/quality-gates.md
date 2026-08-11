# Production Quality Gates

This document defines the release gates that protect accessibility, dependency security, browser behavior, and CI runtime compatibility for `nischhalsubba.com.np`.

## Principles

- Fix the production defect and the test that allowed it to ship.
- Keep project/runtime upgrades separate from CI action-runtime upgrades.
- Block known high-severity dependency advisories before merge.
- Test interactive UI in a rendered state, not only its hidden/default markup.
- Treat generated production output as the artifact under test.

## Dependency security

The repository exposes:

```bash
npm run audit:dependencies
```

This runs `npm audit --audit-level=high` against the declared dependency graph. The `Validate portfolio` workflow runs it after `npm ci` and before the normal repository validation suite.

A high or critical advisory is therefore a merge-blocking failure. Do not bypass the gate by adding `--force`, suppressing advisories, or excluding development dependencies without documenting why the affected package cannot execute in this project.

For dependency remediation:

1. Prefer the smallest patched version in the current major release.
2. Commit `package.json` and `package-lock.json` together.
3. Run the full validation and browser suites.
4. Only consider a major-version migration as a separate change with its own regression review.

## Theme contrast

`scripts/browser-theme-contrast-audit.mjs` checks text contrast across every sitemap route in both light and dark themes at mobile and desktop viewport sizes.

Visibility is determined through the full ancestor chain. Descendants of `hidden`, `aria-hidden="true"`, `display:none`, `visibility:hidden`, or effectively transparent ancestors are not treated as rendered text.

Interactive text must still be tested in an interactive state. The homepage decision-story readout is intentionally hidden at rest, so the audit focuses a representative story node before evaluating contrast. This prevents both false failures from hidden content and false passes caused by never opening an interactive panel.

The browser audit workflow treats any contrast failure as blocking and uploads `contrast-audit.log` with the other browser evidence.

## Hero story contrast contract

The homepage story readout uses a dedicated light-theme text override for its tiny orange kicker. It must retain at least WCAG AA 4.5:1 contrast for normal text. Decorative orange lines and nodes may use the broader visual accent because they are not conveying text.

The final hero remediation stage owns this override so later build stages cannot silently replace it.

## GitHub Actions runtime policy

The project continues to build and test on Node.js 22. GitHub-maintained JavaScript actions use their Node.js 24-native supported majors.

These are separate concerns:

- `actions/checkout@v6`
- `actions/setup-node@v6`
- `actions/github-script@v8`
- `actions/upload-artifact@v6`

Do not change the application's Node.js runtime merely because an Action changes the Node.js runtime used internally by GitHub Actions.

## Required pre-merge gates

A production-bound pull request should pass, at minimum:

- Validate portfolio
- Browser audit, including theme contrast
- Hero UX audit
- Interface polish audit
- Dependency audit with no high/critical advisory
- Deterministic build / clean generated-output check

## Post-merge production gate

`Production QA` waits until Cloudflare reports the expected `main` lineage before testing the live deployment. It then verifies routes, responsive behavior, mobile navigation, theme contrast, contact accessibility, performance regression guards, visual baselines, and production security headers.

A production QA failure should remain visible as the `[QA] Production website audit` issue until the live deployment passes again.

## Search monitoring

Repository validation can prove crawlability contracts, canonical URLs, redirects, metadata, sitemap parity, and crawler headers. It cannot prove that an external search engine has already recrawled or re-ranked a page.

After search-related releases, verify the submitted sitemap and representative canonical pages in Google Search Console and Bing Webmaster Tools. Treat public search-result checks as supplementary evidence rather than a substitute for those first-party consoles.
