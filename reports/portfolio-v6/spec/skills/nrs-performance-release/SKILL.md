---
name: nrs-performance-release
description: Measure Lighthouse and deployment integrity before asserting success.
---

# nrs-performance-release

Establish target source branch/commit, build exact production artifact with `cd site && npm ci && npm run build && npm run validate`, inspect CI. Profile homepage first paint, animated intro/scroll loops, image payload, font, runtime scheduling, LCP/TBT/CLS/INP and responsive content. Run at least three comparable Lighthouse lab samples per key route/device, report distributions, differentiate lab from CrUX/RUM field data. Test live apex/www, redirects and sitemap and Cloudflare deployed SHA; Vercel references separately. Never auto-merge, deploy, change DNS, indexing settings or secrets without explicit owner consent. Include rollback plan, screenshots and test logs. Do not promise ranking.

## Deliverables
Write evidence-backed changes or an audit record, including paths, date, validation command/output, actual blockers and clear follow-ups.
