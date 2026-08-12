# SEO & Content Quality Checklist

This checklist keeps the portfolio clean, searchable, and truthful.

## Core SEO

- [ ] Every page has one clear H1.
- [ ] Every page has a unique title tag.
- [ ] Every page has a focused meta description.
- [ ] Canonical URLs point to the preferred live URL.
- [ ] Open Graph title, description, and image are present.
- [ ] Important pages are included in `public/sitemap.xml`.
- [ ] `public/robots.txt` points to the sitemap.
- [ ] Internal links connect homepage, projects, writing, about, and contact.

## Project Detail Pages

- [ ] The project title matches the real project.
- [ ] The role is accurate and does not overclaim ownership.
- [ ] The page explains the problem, users, scope, design decisions, and constraints.
- [ ] Figma/prototype links are placed only where relevant.
- [ ] NDA or confidential work is not exposed.
- [ ] Images have descriptive alt text.
- [ ] Related writing or contact CTA is included naturally.

## Blog Detail Pages

- [ ] The article stays focused on one subject.
- [ ] The title matches the article content.
- [ ] H2/H3 headings are specific and useful.
- [ ] Content reflects product design thinking, not generic filler.
- [ ] Related project links are added when they genuinely fit.
- [ ] The article includes a clear takeaway.

## Portfolio Truth Rules

- [ ] Do not invent metrics, awards, rankings, or competition results.
- [ ] Mark team contributions clearly.
- [ ] Separate designed, developed, contributed, explored, and ongoing work.
- [ ] Use measured results only when verified.
- [ ] Keep NDA projects private or anonymized.

## Deployment Checks

- [ ] `npm run build` succeeds.
- [ ] `/sitemap.xml` loads after deploy.
- [ ] `/robots.txt` loads after deploy.
- [ ] `/blog` and `/blog/` both load.
- [ ] All project cards link to valid detail pages.
- [ ] All blog cards link to valid detail pages.
