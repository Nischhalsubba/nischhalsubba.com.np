# Public report follow-up — 2 November 2026

## Independently observed baseline

| Report | Observed result | Interpretation |
| --- | --- | --- |
| PageSpeed `2scrzt6i78`, mobile, 21:35 Nepal | Performance 93; accessibility, best practices, SEO 100; agentic browsing 3/3; LCP 1.5 s; TBT 250 ms; CLS 0 | Synthetic sample. No real-user dataset is available. Remaining diagnostics include render blocking, main-thread work, unused styles and non-composited effects. |
| Supplied GTmetrix `rjPNkIDo`, 09:16 -0700 | Performance 53%; structure 97%; LCP 2.6 s; TBT 911 ms; CLS .02; 594 KB, 27 requests | This is a real remaining performance concern. It uses a different Lighthouse version/location than PageSpeed. Do not dismiss it or promise a fixed score. |
| WAVE live report | Zero errors; zero contrast errors; AIM 9.3/10; 74 alerts | Alerts comprise 14 repeated image alternatives, one redundant link, three PDFs and 56 small-text notices. Zero automated errors does not establish WCAG compliance. |
| Nu live checker v26.11.1 | 30 CSS diagnostics; no non-CSS findings in the returned list | Diagnostics concern @property, container-type/cqw, vector-effect and gradient/mask syntax. Review against current CSS standards and actual browser support; do not delete working design features or hide validation results merely to make a score green. |
| Semrush supplied URL | Public checker form, daily limit shown as 0/0; no domain results rendered | Current visibility cannot be confirmed from this session. Previously recorded zero visibility is an outcome metric, not a deterministic software defect. |

## Change in this release

Inline the homepage's small font-definition and personalization stylesheets at their original cascade positions. Inline its 311-byte discovery rules in the final SEO stage. This removes the three stylesheet requests that PageSpeed explicitly identified as render blocking, without deferring essential styling or introducing a flash of unstyled content. Relative font URLs are rebased to their original assets. Homepage aliases receive identical installation behavior. Readable source assets remain available.

A regression assertion rejects external homepage stylesheets and checks the rebased Doto URL. Existing full build, determinism, content, SEO, contact-security and browser checks remain the release gates. No claim about a new external score is justified until the deployed change is retested.

## Remaining work and limits

- Profile and split startup animation/layout work; PageSpeed attributes a 287 ms task to the smooth-scroll library call stack and identifies repeated geometry reads. Preserve scrolling and keyboard behavior when changing scheduling.
- Review repeated project image alternatives and tiny editor labels with assistive technology and visual design together. PDF links are useful content, not bugs to remove.
- Check field Core Web Vitals when sufficient real-user data exists. Lab scores can vary across servers and throttling configurations.
- Search indexing, citations and brand mentions depend on external systems and useful original evidence. Do not fabricate testimonials, results, links or keyword content to manufacture visibility.
- No finite automated test suite proves that every interaction is bug-free. Report actual passing checks, specific unresolved findings and blockers.

## Local release checks

`npm run validate` passed, including 52 inner routes, 2,528 local links, all 53 SEO records, contact security/provider acceptance, smoke checks and 519 byte-stable generated files. `npm audit --audit-level=low` reported zero vulnerabilities.
