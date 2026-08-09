<!-- interactive-readme-standard:start -->

<div align="center">

# nischhalsubba.com.np

**Branch-aware technical guide for [`fix/exact-signal-demo-v17`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17)**

<p><img alt="branch: fix/exact-signal-demo-v17" src="https://img.shields.io/static/v1?label=&message=branch%3A%20fix%2Fexact-signal-demo-v17&color=5965F2&style=flat-square"> <img alt="Vite" src="https://img.shields.io/static/v1?label=&message=Vite&color=24292F&style=flat-square"> <img alt="TypeScript" src="https://img.shields.io/static/v1?label=&message=TypeScript&color=24292F&style=flat-square"> <img alt="WordPress" src="https://img.shields.io/static/v1?label=&message=WordPress&color=24292F&style=flat-square"> <img alt="JavaScript" src="https://img.shields.io/static/v1?label=&message=JavaScript&color=24292F&style=flat-square"> <img alt="HTML" src="https://img.shields.io/static/v1?label=&message=HTML&color=24292F&style=flat-square"> <img alt="PHP" src="https://img.shields.io/static/v1?label=&message=PHP&color=24292F&style=flat-square"> <img alt="docs: branch-aware" src="https://img.shields.io/static/v1?label=&message=docs%3A%20branch-aware&color=8250DF&style=flat-square"></p>

<p>
  <a href="https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17"><strong>Browse source</strong></a> ·
  <a href="https://github.com/Nischhalsubba/nischhalsubba.com.np/issues"><strong>Issues</strong></a> ·
  <a href="https://github.com/Nischhalsubba/nischhalsubba.com.np/codespaces/new?ref=fix%2Fexact-signal-demo-v17"><strong>Open in Codespaces</strong></a>
</p>

</div>

> [!IMPORTANT]
> This guide is generated from the files actually present on `fix/exact-signal-demo-v17`. It links to detected source paths, preserves project-authored notes, and avoids claiming components that were not found.

## At a glance

| Item | Detected value |
|---|---|
| Purpose | Production portfolio for Nischhal Raj Subba, a Nepal-based product designer focused on Web3, SaaS, fintech, UX systems, and developer-ready design handoff. |
| Branch role | Compared with `main` |
| Stack | Vite, TypeScript, WordPress, JavaScript, HTML, PHP, CSS |
| Manifests | package.json |
| Prerequisites | Node.js |
| Delivery | vercel.json, GitHub Actions |
| License | No license file detected |

## Branch scope

No branch-specific file differences were detected against the default branch at generation time.



## Quick start

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

### Configuration surface

- No committed environment example file was detected.

> Never commit secrets, private keys, production credentials, customer data, or unredacted infrastructure details.

## Repository map

```mermaid
flowchart TD
    ROOT["nischhalsubba.com.np / fix/exact-signal-demo-v17"]
    ROOT --> P0[".github/"]
    ROOT --> P1["api/"]
    ROOT --> P2["assets/"]
    ROOT --> P3["blog/"]
    ROOT --> P4["config/"]
    ROOT --> P5["data/"]
    ROOT --> P6["docs/"]
    ROOT --> P7["functions/"]
    ROOT --> P8["public/"]
    ROOT --> P9["scripts/"]
    ROOT --> P10["src/"]
    ROOT --> P11["tests/"]
    ROOT --> P12["wordpress/"]
    ROOT --> P13[".editorconfig"]
    ROOT --> P14[".gitignore"]
    ROOT --> P15["_headers"]
    ROOT --> P16["about.html"]
    ROOT --> P17["AGENTS.md"]
    ROOT --> MORE["+ 76 more top-level entries"]
```

| Responsibility | Detected source paths |
|---|---|
| Interface | [`public`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/public), [`src`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/src) |
| Application logic | [`api`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/api) |
| Data | [`data`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/data) |
| Quality | [`tests`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/tests) |
| Documentation | [`docs`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/docs) |
| Delivery | [`.github`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/.github), [`scripts`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/scripts) |

## Website or application map

```mermaid
flowchart TD
    APP["nischhalsubba.com.np"]
    APP --> R0["src/app"]
    APP --> R1["public"]
    R0 --> F0["src/app/layout.tsx"]
    R1 --> F1["public/services.html"]
    R1 --> F2["public/nischhal-raj-subba.html"]
    R1 --> F3["public/privacy.html"]
    R1 --> F4["public/blog/prioritize-ux-audit-findings-before-redesign.html"]
    R1 --> F5["public/blog/saas-dashboard-empty-states-that-help-users-recover.html"]
    R1 --> F6["public/blog/responsive-saas-dashboard-handoff-notes.html"]
    R1 --> F7["public/blog/when-startup-needs-ux-audit-before-redesign.html"]
    R1 --> F8["public/blog/figma-handoff-notes-for-developers.html"]
    R1 --> F9["public/blog/web3-wallet-connection-ux.html"]
    R1 --> F10["public/blog/index.html"]
    R1 --> F11["public/blog/role-based-saas-dashboard-ux.html"]
```

## Architecture and responsibility flow

```mermaid
flowchart LR
    USER["User / contributor"]
    USER --> A0["Interface: public, src"]
    A0 --> A1["Application logic: api"]
    A1 --> A2["Data: data"]
    A2 --> A3["Quality: tests"]
    A3 --> A4["Documentation: docs"]
    A4 --> A5["Delivery: .github, scripts"]
    A5 --> DELIVERY["Delivery: vercel.json, GitHub Actions"]
```

<details open>
<summary><strong>Request lifecycle</strong></summary>

```mermaid
sequenceDiagram
    autonumber
    actor U as User / client
    participant I as Interface
    participant A as API / application
    participant D as Data layer
    U->>I: Trigger action
    I->>A: Send validated request
    A->>D: Read or write data
    D-->>A: Return result
    A-->>I: Return response
    I-->>U: Render success or error state
```

Detected API or server areas: [`api`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/api).

</details>
<details>
<summary><strong>Data flow and model surface</strong></summary>

```mermaid
flowchart LR
    INPUT["User or system input"] --> VALIDATE["Validate and normalize"]
    VALIDATE --> LOGIC["Application logic"]
    LOGIC --> STORE["Persistent or local storage"]
    STORE --> READ["Query / retrieval"]
    READ --> OUTPUT["UI, API, report, or export"]
```

Detected data areas: [`data`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/data).

</details>
<details>
<summary><strong>Background jobs and scheduled work</strong></summary>

```mermaid
flowchart LR
    EVENT["Event / schedule"] --> QUEUE["Queue or job definition"]
    QUEUE --> WORKER["Worker / processor"]
    WORKER --> RESULT["Persist result or emit side effect"]
    WORKER -->|failure| RETRY["Retry, alert, or dead-letter path"]
```

Relevant detected files: [`src/worker.js`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/src/worker.js).

</details>

## Quality, security, and operations

<table>
<tr>
<td width="33%" valign="top">

### Quality

- [`tests`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17/tests)

Detected commands:
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

</td>
<td width="33%" valign="top">

### Security

- No dedicated security policy or automated dependency configuration was detected.

Review authentication, authorization, input validation, dependency updates, secret handling, and failure recovery before release.

</td>
<td width="34%" valign="top">

### Observability

- [`src/scripts/features/analytics-events.js`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/src/scripts/features/analytics-events.js)
- [`assets/analytics-events-Bq4IAYSg.js`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/assets/analytics-events-Bq4IAYSg.js)

Define useful logs, metrics, traces, alerts, and rollback signals for production-facing branches.

</td>
</tr>
</table>

## Delivery flow

```mermaid
flowchart LR
    CHANGE["Change on fix/exact-signal-demo-v17"] --> CHECK["Tests and quality checks"]
    CHECK --> REVIEW["Review architecture and documentation impact"]
    REVIEW --> BUILD["Build or package"]
    BUILD --> DEPLOY["Deploy or release"]
    DEPLOY --> VERIFY["Verify health and rollback readiness"]
```

### Automation detected

- [`.github/workflows/apply-interactive-readme.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/.github/workflows/apply-interactive-readme.yml)
- [`.github/workflows/browser-audit.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/.github/workflows/browser-audit.yml)
- [`.github/workflows/deploy-cloudflare.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/.github/workflows/deploy-cloudflare.yml)
- [`.github/workflows/interface-polish-audit.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/.github/workflows/interface-polish-audit.yml)
- [`.github/workflows/production-qa.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/.github/workflows/production-qa.yml)
- [`.github/workflows/production-route-audit.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/.github/workflows/production-route-audit.yml)
- [`.github/workflows/validate.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/exact-signal-demo-v17/.github/workflows/validate.yml)

## Contribution flow

```mermaid
flowchart LR
    FORK["Create branch"] --> CHANGE["Make focused change"]
    CHANGE --> TEST["Run relevant checks"]
    TEST --> DOCS["Update README and diagrams"]
    DOCS --> PR["Open pull request"]
    PR --> REVIEW["Review and iterate"]
    REVIEW --> MERGE["Merge when ready"]
```

- Keep changes focused and explain architectural consequences.
- Run the checks relevant to the changed area.
- Update diagrams whenever routes, modules, data models, authentication, jobs, or delivery paths change.
- Add screenshots or recordings for visual behavior changes when useful.
- Use issues for reproducible defects and pull requests for reviewable changes.

## Ownership and support

| Topic | Source |
|---|---|
| Repository | [`Nischhalsubba/nischhalsubba.com.np`](https://github.com/Nischhalsubba/nischhalsubba.com.np) |
| Branch | [`fix/exact-signal-demo-v17`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/exact-signal-demo-v17) |
| Ownership | No CODEOWNERS file detected |
| Contributing | Use the contribution flow above |
| Support | [Open or review issues](https://github.com/Nischhalsubba/nischhalsubba.com.np/issues) |
| License | No license file detected |

<details>
<summary><strong>Documentation maintenance checklist</strong></summary>

- [ ] Purpose and branch scope are accurate.
- [ ] Setup and configuration commands still work.
- [ ] Repository, application, API, data, authentication, job, and deployment diagrams match the code.
- [ ] Tests, security controls, observability, and rollback behavior are documented.
- [ ] Links point to real files on this branch.
- [ ] No secrets or private operational details are exposed.

</details>

<!-- interactive-readme-standard:end -->

<!-- project-authored-notes:start -->
<details>
<summary><strong>Project-authored notes preserved from this branch</strong></summary>

# Nischhal Raj Subba Portfolio

Production portfolio for **Nischhal Raj Subba**, a Nepal-based product designer working across Web3, SaaS, fintech, service websites, design systems, UX audits, and developer-ready handoff.

The site is a static multi-page Vite build deployed through **Cloudflare Workers with static assets**. A Worker handles first-party API routes while Cloudflare serves the generated site from `dist/`.

## Production

- Canonical origin: `https://nischhalsubba.com.np`
- Production branch: `main`
- Deployment project: `portfolio-website-2026`
- Platform: Cloudflare Workers + static assets
- Worker entry point: `src/worker.js`
- Configuration: `wrangler.jsonc`
- Static output: `dist/`

Only `main` is treated as production. Clean URLs such as `/services`, `/contact`, and `/project-yarsha` are canonical; `.html` filenames are build artifacts, not public URL targets.

## Architecture

```text
.
├── index.html                     # Homepage source
├── about.html                     # Canonical page source
├── contact.html                   # Canonical page source
├── projects.html                  # Work index source
├── services.html                  # Services index source
├── privacy.html                   # Privacy page source
├── blog/                          # Blog index and article sources
├── project-*.html                 # Case-study sources
├── *-designer.html                # Search-intent service pages
├── assets/                        # Authored images and project assets
├── public/                        # Static files copied into the build
├── src/
│   ├── scripts/                   # Modular browser runtime
│   └── worker.js                  # Cloudflare Worker/API router
├── functions/api/contact.js       # Cloudflare contact handler
├── scripts/                       # Generation, normalization, audits, and QA
├── config/canonical-routes.json   # Authoritative route and redirect contract
├── tests/visual/                  # Screenshot baseline contract
├── style.css                      # Single authored production stylesheet
├── script.js                      # Stable browser-runtime entry point
├── _headers                       # Production security and cache headers
├── _redirects                     # Legacy URL redirects only
├── sitemap.xml                    # Generated canonical sitemap source
├── robots.txt                     # Crawler directives
├── llms.txt                       # Concise AI-agent summary
├── llms-full.txt                  # Extended AI-agent context
├── ai-profile.json                # Machine-readable profile
├── vite.config.ts                 # Multi-page Vite build
├── wrangler.jsonc                 # Worker, assets, and email binding config
└── package.json
```

There is no Next.js runtime or `.next` compatibility layer in the current repository.

## Routes

`config/canonical-routes.json` is the route source of truth. It defines:

- every canonical HTML output;
- retired HTML files that must not survive production;
- legacy redirects and their expected clean destinations.

The build fails when canonical files are missing, retired outputs survive, or `_redirects` disagrees with the manifest. Live production routes can be checked with:

```bash
npm run test:routes:live
```

## Browser runtime and CSS

- Authored browser features live under `src/scripts/`.
- `script.js` is the stable module entry point used by generated pages.
- `style.css` is the single authored stylesheet contract.
- Build audits reject retired patch stylesheets and unexpected local CSS files.
- Shared navigation, footer, theme behavior, responsive guardrails, resume handling, and contact behavior are normalized and audited during the build.

## Contact API

The contact page posts to:

```text
POST /api/contact
```

The Cloudflare Worker provides:

- origin restrictions;
- server-side field validation;
- a honeypot field;
- Cloudflare Turnstile verification;
- native Cloudflare email delivery.

Required Cloudflare configuration:

- Build variable: `TURNSTILE_SITE_KEY`
- Runtime secret: `TURNSTILE_SECRET_KEY`
- Email binding: `CONTACT_EMAIL`
- Verified destination: `hinischalsubba@gmail.com`

The mail and Turnstile integration must be verified on the live domain after any account-level binding or key change.

## SEO and discovery

The production build maintains:

- clean canonical URLs;
- one title and description per canonical page;
- Open Graph and Twitter metadata;
- parseable JSON-LD;
- exact sitemap parity with the canonical route manifest;
- robots directives;
- raster 1200×630 social previews for priority pages;
- AI discovery files (`llms.txt`, `llms-full.txt`, and `ai-profile.json`).

SEO validation runs across every canonical page:

```bash
npm run audit:seo
npm run audit:seo-contract
```

The full contract rejects duplicate or missing metadata, invalid JSON-LD, sitemap drift, `.html` canonicals, mismatched social metadata, and invalid priority social images.

## Development

Install the locked dependency tree:

```bash
npm ci
```

Run Vite locally:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Preview `dist/`:

```bash
npm run preview
```

Run all repository validation:

```bash
npm run validate
```

The validation suite covers metadata, content structure, internal links, build output, shared shell, CSS architecture, design-system usage, voice, accessibility tokens, build provenance, and smoke behavior.

## Browser and visual QA

GitHub Actions runs browser audits across every sitemap route and eight representative viewport sizes. The audit checks runtime errors, failed same-origin requests, overflow, H1 count, duplicate IDs, broken images, footer presence, CSS count, active navigation, and mobile-menu keyboard behavior.

Priority visual regression screenshots cover Home, Services, Contact, Product Design, Yarsha, and Mokshya at mobile and desktop sizes. Review rules and the 0.5% pixel-difference tolerance are documented in:

```text
tests/visual/README.md
```

## Build behavior and known architecture debt

The current build is reliable but not yet non-mutating. Before Vite runs, legacy generation and normalization scripts update tracked HTML and CSS source files. This behavior is explicit and covered by the delivery board, but it means `npm run build` may dirty a developer's working tree.

The planned migration is:

1. run source generation explicitly;
2. commit canonical generated source;
3. limit `npm run build` to reading source and writing `dist/`;
4. enforce `git diff --exit-code` after validation in CI.

Until that migration is verified, source-generation stages must not be removed casually. They currently prevent stale authored files from reaching production, an inelegant arrangement that is still preferable to deploying archaeological HTML.

## Deployment checks

Before considering a production change complete:

1. confirm the latest `main` commit builds successfully in Cloudflare;
2. run repository validation;
3. verify clean routes on the custom domain;
4. review browser and visual artifacts;
5. test account-dependent functionality, including contact delivery, on production;
6. update the Portfolio QA Delivery Board with evidence.

</details>
<!-- project-authored-notes:end -->
