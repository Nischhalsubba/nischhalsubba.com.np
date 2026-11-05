# Sitewide autonomous media discovery and capture — v5

## Scope
Codex audits **all 54 canonical routes** plus reusable renderers and images appearing on every route, including media produced dynamically by JS/CSS. The 41 project/blog detail pages are a subset, not the total sitewide media audit. Capture images *from their actual product/site/Figma/code source*, not from a fixed user-supplied file.

## Crawl and capture protocol
1. Read site/config/canonical-routes.json and built output; enumerate page route. Read source content manifest and image generation scripts.
2. Launch browser and observe each route after stable load; collect DOM image URLs, picture srcsets, meaningful background images, CSS cards, OG/twitter images, galleries, lightbox references, icons/logos/portraits (provenance audit), responsive variants and lazy-loaded regions. Scroll to load images; record 320,390,768,1440 breakpoints.
3. Build per-placement inventory, classify as **content screenshot**, **genuine portrait/photo**, **brand mark/issuer badge**, **decorative component** or **rendered UI asset**. Only genuine screenshots must follow new capture workflow. Original photos/marks require provenance, not screenshot substitution.
4. Discover source for each content item. Open candidate public sites and subpages; compare dated behavior to owner design contribution, or export correct original Figma frame, or capture real local implementation. Verify page loading, source rights, relevance, correct screen state and no sensitive data.
5. Capture immutable original screenshots and record run metadata/hash. Keep original bytes unchanged. Select purpose-specific screens, produce pretty but truthful derivatives that retain a full original view.
6. Update build-owned source and media mappings, not dist output directly. Verify all placements, related-content cards, project/blog covers, services, homepage, galleries, OG/previews, mobile sizing and alt/captions.
7. Generate comprehensive contact-sheet QA and per-placement status. Block missing sources explicitly, never invent.

## Source examples
- Zapp: zapp.today public official site plus relevant historical Figma app frames (captured by Codex).
- Designerex: designerex.com.au public site; distinguish historical contribution.
- Hamro Idea: hamro-idea-website.vercel.app actual working deployment; if broken use labeled local build capture.
- Zakra: discover original project/starter/demo URL or Figma/node and capture independently. The supplied Zakra screenshot is ONLY a historical framing reference, not final production content.
- Web3 article: capture appropriate actual wallet/transaction UI in project's own authorized Figma/screens.
- Design-system blog: capture real components/tokens/hand-off details from authorized original Figma or code, not a generic chart.

## Absolute restrictions
Do not screenshot authenticated third-party customer profiles, bypass blocks/robots/access controls, forge product screens, impersonate original authorship, hotlink unstable URLs or claim publication authorization without checking source rights. Do not replace honest photographs, logos, icons or badges with arbitrary website screenshots. Do not edit external products or publish unpublished private Figma frames without authorization.

## Completion gates
All route placements inventoried; 100% of published screenshot-derived assets have valid original capture or independently authenticated original Figma evidence, reviewer status and relationship to project/article; screenshots decode and render responsively; no unsupported fabricated evidence; unknown-source placements explicitly blocked. Report incomplete separately from success.
