# Owner-confirmed experience claim

On November 5, 2026 the owner explicitly confirmed **7+ years** and requested cross-checking against the résumé. This resolves the tenure-wording question, not independent verification of employers or external ranking claims.

The résumé at `site/src/workspace-home/assets/resume.pdf` already states 7+ years. Its SHA256 and the transcribed dates are recorded in `site/config/experience-evidence.json`.

| Role | Résumé dates |
|---|---|
| Hamro Idea — Web Designer & Developer Intern | Aug 2018–Mar 2019 |
| Diagonal — User Experience Designer, part-time | Apr 2019–Sep 2020 |
| Gurzu — UI/UX Designer | Jul 2019–Jan 2021 |
| ThemeGrill — Senior UI/UX Designer | Apr–Sep 2021 |
| ESR Tech — Senior UI/UX Designer | Oct 2021–Feb 2023 |
| Tegzy — Lead User Experience Designer | Feb–Nov 2023 |
| Mokshya — Product Designer | Mar 2024–Jul 2025 |
| Idealaya — Product Designer | Aug–Dec 2025 |

The eight records include an internship and a part-time role. Diagonal/Gurzu overlap, as do ESR/Tegzy in February 2023. At month-level resolution, their union covers 84 distinct calendar months through December 2025, approximately seven years. This is not an exact day-based or full-time-equivalent calculation, and elapsed time since August 2018 is not asserted as uninterrupted employment. The résumé separately lists MAS DataHub from October 2025 to Present; it is not added on top of overlapping employment to inflate tenure.

Updated current profile configuration, résumé generator, source metadata, current copy and build-stage templates from 6+ to 7+. Historical résumé PDFs and past audit evidence remain unchanged as dated artifacts; production `/assets/resume.pdf` is rebuilt from the updated profile configuration. The existing owner résumé download already says 7+.

The About page now provides the eight-role date trail and a link to the full résumé. Employment dates/locations, awards, impact metrics and project launch claims were not invented or extended.

Validation: full `npm --prefix site run validate` exited 0 (validation-tenure.log). `verify-tenure.cjs` passed the résumé SHA, eight-role/84-month overlap calculation, both generated PDF claims, the About timeline and absence of 6+ years across 54 final pages. Final browser verification found an indistinguishable inline résumé link. An underline resolved it; all four mobile/desktop changed-page axe, overflow and content checks now pass. After that correction, the production build, tenure verifier, inner-page contract and 54-route SEO contract also pass.
