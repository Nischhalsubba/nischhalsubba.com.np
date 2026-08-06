<!-- interactive-readme-standard:start -->

<div align="center">

# nischhalsubba.com.np

**Branch-aware technical guide for [`fix/remaining-production-issues`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues)**

<p><img alt="branch: fix/remaining-production-issues" src="https://img.shields.io/static/v1?label=&message=branch%3A%20fix%2Fremaining-production-issues&color=5965F2&style=flat-square"> <img alt="Vite" src="https://img.shields.io/static/v1?label=&message=Vite&color=24292F&style=flat-square"> <img alt="TypeScript" src="https://img.shields.io/static/v1?label=&message=TypeScript&color=24292F&style=flat-square"> <img alt="WordPress" src="https://img.shields.io/static/v1?label=&message=WordPress&color=24292F&style=flat-square"> <img alt="JavaScript" src="https://img.shields.io/static/v1?label=&message=JavaScript&color=24292F&style=flat-square"> <img alt="HTML" src="https://img.shields.io/static/v1?label=&message=HTML&color=24292F&style=flat-square"> <img alt="PHP" src="https://img.shields.io/static/v1?label=&message=PHP&color=24292F&style=flat-square"> <img alt="docs: branch-aware" src="https://img.shields.io/static/v1?label=&message=docs%3A%20branch-aware&color=8250DF&style=flat-square"></p>

<p>
  <a href="https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues"><strong>Browse source</strong></a> ·
  <a href="https://github.com/Nischhalsubba/nischhalsubba.com.np/issues"><strong>Issues</strong></a> ·
  <a href="https://github.com/Nischhalsubba/nischhalsubba.com.np/codespaces/new?ref=fix%2Fremaining-production-issues"><strong>Open in Codespaces</strong></a>
</p>

</div>

> [!IMPORTANT]
> This guide is generated from the files actually present on `fix/remaining-production-issues`. It links to detected source paths, preserves project-authored notes, and avoids claiming components that were not found.

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

This branch differs from the default branch in the following detected paths:

- [`README.md`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/README.md)
- [`src/scripts/features/resume.js`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/src/scripts/features/resume.js)

## Quick start

```bash
npm install
npm run dev
npm run build
npm run preview
```

### Configuration surface

- No committed environment example file was detected.

> Never commit secrets, private keys, production credentials, customer data, or unredacted infrastructure details.

## Repository map

```mermaid
flowchart TD
    ROOT["nischhalsubba.com.np / fix/remaining-production-issues"]
    ROOT --> P0[".github/"]
    ROOT --> P1["assets/"]
    ROOT --> P2["blog/"]
    ROOT --> P3["config/"]
    ROOT --> P4["data/"]
    ROOT --> P5["docs/"]
    ROOT --> P6["functions/"]
    ROOT --> P7["public/"]
    ROOT --> P8["scripts/"]
    ROOT --> P9["src/"]
    ROOT --> P10["tests/"]
    ROOT --> P11["wordpress/"]
    ROOT --> P12[".editorconfig"]
    ROOT --> P13[".gitignore"]
    ROOT --> P14["_headers"]
    ROOT --> P15["_redirects"]
    ROOT --> P16["about.html"]
    ROOT --> P17["ai-profile.json"]
    ROOT --> MORE["+ 74 more top-level entries"]
```

| Responsibility | Detected source paths |
|---|---|
| Interface | [`public`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/public), [`src`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/src) |
| Data | [`data`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/data) |
| Quality | [`tests`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/tests) |
| Documentation | [`docs`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/docs) |
| Delivery | [`.github`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/.github), [`scripts`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/scripts) |

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
    A0 --> A1["Data: data"]
    A1 --> A2["Quality: tests"]
    A2 --> A3["Documentation: docs"]
    A3 --> A4["Delivery: .github, scripts"]
    A4 --> DELIVERY["Delivery: vercel.json, GitHub Actions"]
```

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

Detected data areas: [`data`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/data).

</details>

## Quality, security, and operations

<table>
<tr>
<td width="33%" valign="top">

### Quality

- [`tests`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues/tests)

Detected commands:
- `npm run dev`
- `npm run build`
- `npm run preview`

</td>
<td width="33%" valign="top">

### Security

- No dedicated security policy or automated dependency configuration was detected.

Review authentication, authorization, input validation, dependency updates, secret handling, and failure recovery before release.

</td>
<td width="34%" valign="top">

### Observability

- [`src/scripts/features/analytics-events.js`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/src/scripts/features/analytics-events.js)
- [`assets/analytics-events-Bq4IAYSg.js`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/assets/analytics-events-Bq4IAYSg.js)

Define useful logs, metrics, traces, alerts, and rollback signals for production-facing branches.

</td>
</tr>
</table>

## Delivery flow

```mermaid
flowchart LR
    CHANGE["Change on fix/remaining-production-issues"] --> CHECK["Tests and quality checks"]
    CHECK --> REVIEW["Review architecture and documentation impact"]
    REVIEW --> BUILD["Build or package"]
    BUILD --> DEPLOY["Deploy or release"]
    DEPLOY --> VERIFY["Verify health and rollback readiness"]
```

### Automation detected

- [`.github/workflows/browser-audit.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/.github/workflows/browser-audit.yml)
- [`.github/workflows/deploy-cloudflare.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/.github/workflows/deploy-cloudflare.yml)
- [`.github/workflows/production-route-audit.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/.github/workflows/production-route-audit.yml)
- [`.github/workflows/validate.yml`](https://github.com/Nischhalsubba/nischhalsubba.com.np/blob/fix/remaining-production-issues/.github/workflows/validate.yml)

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
| Branch | [`fix/remaining-production-issues`](https://github.com/Nischhalsubba/nischhalsubba.com.np/tree/fix/remaining-production-issues) |
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

Static, SEO-focused portfolio for **Nischhal Raj Subba**, a Product Designer in Nepal focused on Web3 UX, SaaS interfaces, fintech app experiences, service website UX, design systems, UX audits, and front-end-aware design.

[![Vite](https://img.shields.io/badge/Tooling-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#development)
[![Static HTML](https://img.shields.io/badge/Frontend-HTML%20CSS%20JS-111111?style=for-the-badge)](#structure)
[![SEO](https://img.shields.io/badge/SEO-Sitemap%20%2B%20Robots%20%2B%20Schema-0C8CE9?style=for-the-badge)](#seo-and-ai-discovery)

---

## Overview

This repository powers:

```txt
https://nischhalsubba.com.np/
```

The site is intentionally built as a static multi-page portfolio rather than a framework-heavy app. It includes:

- a canonical homepage at `/`
- project listing and project detail pages
- blog listing and blog detail pages
- service/SEO landing pages
- AI discovery files for agents and LLM crawlers
- sitemap, robots, manifest, and structured data
- Vite build configuration for Cloudflare Pages
- runtime JavaScript split into focused modules under `src/scripts/`

The repository root has many `.html` files because those files are public routes. Messy-looking? A little. Dangerous to move randomly? Absolutely.

---

## Deployment note

Cloudflare Pages deploys the latest `main` branch build. Documentation-only commits may be used to trigger a fresh Pages rebuild when the previous deployment failed after a build-script or audit change.

---

## Structure

```txt
.
├── index.html                       # Canonical homepage
├── home.html                        # Legacy/home experiment retained in build
├── home-v2.html                     # Legacy/home experiment retained in build
├── about.html                       # About page
├── contact.html                     # Contact and lead page
├── projects.html                    # Project listing page
├── blog.html                        # Blog listing fallback page
├── blog/                            # Canonical blog route and blog detail source pages
├── project-*.html                   # Public project detail routes
├── *-designer.html                  # Service/SEO landing pages
├── ux-audit.html                    # Service/SEO landing page
├── assets/                          # Images, SVG covers, vendor files, project data
├── public/                          # Files Vite copies automatically
├── src/scripts/                     # Modular browser runtime
├── scripts/                         # Build, audit, link, and generation scripts
├── docs/                            # Maintainer documentation
├── script.js                        # Compatibility wrapper for old HTML references
├── style.css                        # Main legacy/global stylesheet
├── seo-ui-enhancements.css          # Shared polish layer loaded across pages
├── robots.txt                       # Root-served crawler instructions
├── sitemap.xml                      # Root-served sitemap
├── llms.txt                         # AI-agent summary
├── ai-profile.json                  # Machine-readable profile
├── site.webmanifest                 # Browser/search identity metadata
├── vite.config.ts                   # Multi-page Vite build config
├── wrangler.toml                    # Cloudflare Pages output config
└── package.json
```

More detailed maps:

- `docs/root-route-map.md`
- `docs/codebase-structure.md`
- `docs/build-pipeline.md`

---

## Why the root has many files

Most root HTML files are route files. For example:

```txt
project-yarsha.html -> /project-yarsha.html
about.html          -> /about.html
```

Moving those files breaks routes unless `vite.config.ts`, internal links, sitemap entries, redirects, and build audits are updated together. So yes, the root has clutter. No, the correct fix is not throwing files into `/pages` and hoping Cloudflare develops empathy.

---

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Check local links:

```bash
npm run check:links
```

---

</details>
<!-- project-authored-notes:end -->
