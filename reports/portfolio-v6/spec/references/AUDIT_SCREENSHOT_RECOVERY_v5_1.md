# Audit screenshots — extraction and recovery contract (2026-11-05)

The two originally uploaded reports are 49×1320 and 34×1320 PNGs. These images do **not** provide reliable per-issue numeric evidence. No exhaustive extraction is claimed. Treat the images as historical references, not as screenshots of the portfolio for publication.

## Reproduce source reports
- Identify source tool / report URL; don't guess. If source is unavailable, state which first-party or other audit substituted.
- Use recorded test origin/device/date, canonical URL, exact test mode.
- Collect full-resolution PageSpeed/Lighthouse/CrUX evidence, technical SEO crawl, source-to-built-to-live tests, accessibility checks and any other categories actually visible in recovered native reports.
- Inspect every reported finding one by one, matching it to a reproducible route and DOM/source condition.
- Keep audit screenshot (historical), fresh report, code change and post-fix report distinct.
- Store missing or unverified findings with an explicit blocker, not an invented score.

## Mandatory fields
`report_provider,source_url,report_capture_date,test_url,device,metric_or_rule,observed_value,threshold,reproduction_steps,evidence_path,confidence,severity,impacted_route,remediation,repo_owner,source_file,verification_test,status`

## Gate
No claim of **every screenshot issue fixed** until every readable native report finding is reconciled, post-fix compared, and all blocked/unverifiable items are clearly reported. Do not chase a single composite score or overwrite existing visual identity.

## Evidence filenames
- `reports/audit-screenshot-reconciliation.csv`
- `reports/mobile-desktop-audit-evidence.md`
- `reports/audit-recovery-qa.md`
