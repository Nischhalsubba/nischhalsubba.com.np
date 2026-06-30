# SEO and AI Visibility QA Plan

Last updated: 2026-06-24

## Objective

Increase qualified organic visibility for Nischhal Raj Subba by making the site crawlable, intent-aligned, proof-backed, internally linked, and easy for AI/search systems to summarize without inventing claims.

## Implemented assets

- Search intent metadata per important page.
- Proof-backed AI profile and llms.txt.
- humans.txt for human-readable identity verification.
- Media kit page for backlinks, citations, and profile references.
- Practical articles for hiring/client questions.
- Project-page SEO context sections.
- Analytics event hooks for resume, contact, project, proof, and AI discovery clicks.

## Monthly QA checklist

1. Submit sitemap in Google Search Console and Bing Webmaster Tools.
2. Inspect and request indexing for homepage, About, Projects, Media Kit, top service pages, and new articles.
3. Check queries for: Product Designer Nepal, Web3 UX Designer, SaaS UX Designer, fintech UX designer, developer-ready Figma handoff, UX audit before redesign.
4. Check which pages get impressions but low CTR; improve title and meta description first.
5. Check zero-impression pages; add internal links or rewrite intent.
6. Validate structured data for homepage, About, Media Kit, articles, and project pages.
7. Confirm no unsupported awards, rankings, testimonials, revenue, or conversion metrics appear.
8. Share one article or case study externally each week on LinkedIn, Behance, Uxcel/GitHub profile links, or relevant communities.

## Backlink targets

- LinkedIn profile featured links.
- Behance project descriptions.
- Uxcel profile website link.
- GitHub profile README.
- Nepal design/developer directories.
- Guest posts or community posts around Web3 UX, SaaS dashboard UX, handoff, and website UX.

## Analytics events

Runtime emits CustomEvent('nrs:analytics') and optional dataLayer/gtag/plausible events for:

- resume_download_click
- email_click
- contact_cta_click
- project_case_study_click
- portfolio_click
- ai_discovery_file_click
- external_proof_click

