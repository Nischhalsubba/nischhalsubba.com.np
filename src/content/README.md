# Content Layer

This folder is the source-of-truth layer for portfolio content.

The current site still serves static HTML pages for SEO stability and Cloudflare Pages compatibility. These data files exist so the next refactor can generate page cards, related content, sitemap entries, AI discovery files, and eventually full pages without copying the same project/post/service details by hand.

## Files

```txt
projects.js   Project metadata and featured project list.
posts.js      Blog/writing metadata and featured post list.
services.js   SEO/service page metadata.
```

## Rules

- Keep these files data-only.
- Do not put DOM code here.
- Do not import browser-only modules here.
- Keep public routes stable.
- Update these files when project, post, or service positioning changes.
- Future build scripts should read from this folder instead of scraping HTML.

## Why this exists

The old site structure repeated the same information across homepage cards, project pages, sitemap entries, AI files, and blog cards. That makes updates easy to miss. This folder is the first step toward a cleaner generated static site while preserving the current public URLs.
