# Portfolio audit repair — 2 November 2026

## Evidence reviewed

The user supplied eight public report URLs. Their results are snapshots, not guarantees of current performance or ranking.

| Tool | Observed finding | Response |
| --- | --- | --- |
| PageSpeed desktop | Performance 62; accessibility 89; best practices 100; SEO 100; TBT 740 ms, LCP 1.4 s, CLS 0 | Repair actual ARIA failures, improve contrast, reduce animation initialization and font bytes. |
| PageSpeed mobile | Performance 72; accessibility 88; TBT 420 ms; LCP 3.8 s; speed index 7.1 s; CLS 0 | Same fixes, shorter loading sequence with the same animation stages; preload real LCP image/font resources. |
| GTmetrix archived report | Performance 30%, structure 98%; LCP 5.9 s, TBT 2.7 s, CLS .16. Largest shifts came from the Figma selection rectangle. | Move frame position with transforms, remove geometry transitions, reduce repeated SVG path sampling and canvas readbacks. |
| Catchpoint | LCP 1.861 s, TBT .816 s, CLS 0; layout 593 ms, scripting 547 ms. Static-cache warnings specifically name Cloudflare speculation and its external beacon. | Avoid unnecessary startup layout work; preserve CDN behavior. Zone-managed speculation/beacon settings are outside this repo. |
| Pingdom | Report eventually loaded: B / 87, 766 ms, 855.4 KB, 34 requests; gzip/expires suggestions; fonts 448.2 KB | WOFF2 avoids shipping TTFs to browsers. Separate third-party/zone-controlled cache warnings from first-party asset policies. |
| Security Headers | Grade A; warning: script-src unsafe-inline | Authorize existing HTML scripts with a fresh response nonce; remove script unsafe-inline, retain necessary inline CSS. |
| W3C Nu | Body style placement and heading skips; also reports current container CSS/SVG features as unrecognized | Move style blocks to head and repair heading hierarchy. Keep supported container sizing and SVG styling rather than changing the design to satisfy outdated CSS parsing. |
| WAVE | 5 errors, 43 contrast failures, 78 alerts | Fix list/button roles, dropdown labels/selection state, mobile navigation role, honeypot label; readable frame labels and metadata. Inspect remaining tool-generated-image findings against actual DOM. Alerts include useful PDF links and intentionally small editor chrome. |
| Semrush | AI visibility 0, mentions 0, citations 1 (SaaS dashboard UX checklist); no history/competitors/topics | This is measured search visibility, not a code error. Keep useful authored content, crawlable links, real entity data and canonical URLs; do not invent mentions, evidence or ranking promises. |

## Contact root causes and repair

The homepage only opened a mail client. The Cloudflare API returned 503 because Turnstile was not configured. Its send binding also contained a misspelled destination address. The alternate provider's HTTP status was previously treated as delivery success even when its JSON could reject the submission.

Both forms now use the same provider acceptance parser. Only explicit `ok: true` or `success: true` / `"true"` clears a message. Failed or timed-out submissions retain the visitor's text. The homepage sends its actual project scope, email and collaboration preferences. Backend brief validation does not invent a visitor name. The recipient is fixed to hinischalsubba@gmail.com.

The existing FormSubmit provider was verified with a labeled delivery test; the message appeared in the intended Gmail inbox. Cloudflare delivery still requires a real TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY and verified email destination. Those secrets are neither present in the repository nor bypassed. Its public config endpoint exposes only the public site key. The working provider remains available when that optional route is unconfigured.

## Validation and limits

- Real Request-based contact tests cover fixed recipient, reply-to, brief validation, allowed origin, challenge hostname and unconfigured backend.
- Provider acceptance tests reject false booleans, false strings and unrecognized HTTP 200 bodies.
- Browser regression exercises rejected and accepted homepage submissions, message retention and clearing.
- Existing whole-site build, route, content, SEO, responsive, contrast and production checks remain required.
- WOFF2 fonts contain the same font outlines as the supplied TTFs; TTF originals remain for deterministic social-card rendering.
- Field Core Web Vitals, rankings, inbox placement for every future message and third-party report scores cannot be guaranteed.

## Primary references

- https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/
- https://formsubmit.co/help
- https://formsubmit.co/ajax-documentation
- https://web.dev/learn/performance/optimize-web-fonts
- https://www.w3.org/TR/WOFF2/
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type
