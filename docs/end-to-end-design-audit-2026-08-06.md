# End-to-End Portfolio Design Audit

Date: 2026-08-06
Surfaces reviewed: production site, Cloudflare redesign preview, homepage, work index, services, about, contact, writing and project-detail templates.
Viewports reviewed: 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×720, 1440×900 and 1920×1080.

## Executive finding

The production site is structurally capable but visually over-explains the same promise through cards, pills and repeated service copy. The first editorial redesign improved differentiation but introduced a second set of problems: overly compressed typography, excessive page length, a decorative 3D panel with insufficient project evidence, hybrid old/new templates, blocked third-party embeds and browser-audit failures.

The redesign therefore needs fewer sections, stronger evidence hierarchy, larger readable supporting type, one coherent shell across every route and progressive enhancement that never becomes a dependency.

## P0 — release blockers

1. **The redesign browser audit failed on 12 route/viewport combinations.** Yarsha contained a redundant legacy back link at every tested viewport. Several project routes produced 403/404 console errors from third-party embedded previews.
2. **Project-detail pages depend on blocked external embeds.** Figma frames on Masteriyo, piHub and Morajaa can fail or emit console errors. A portfolio must retain useful evidence without asking another application for permission to render.
3. **Mobile production layouts have previously reserved most of the first viewport before the H1.** The live experience still shows excessive initial whitespace and small type at phone sizes.
4. **The contact experience can expose an anti-spam configuration warning.** Operational configuration should not read like a public error state before a visitor submits anything.
5. **The redesign is not visually unified across routes.** Homepage and Yarsha use the new language while Services, About, Contact, Work and most case studies still inherit old card-heavy templates.

## P1 — high-impact design issues

6. **The production homepage delays proof.** Experience and capability cards appear before selected work.
7. **The production hero has too many simultaneous actions.** Work, project inquiry and resume have nearly equal visual weight.
8. **Project hierarchy is weak.** Six similarly sized cards make every project appear equally important.
9. **Card and pill repetition flattens hierarchy.** Services, evidence, metadata, process and calls to action share nearly identical containers.
10. **The first redesign hero wraps awkwardly on desktop.** A narrow `11.2ch` title and very large scale turn a two-part statement into four compressed lines.
11. **Supporting typography is too small.** Navigation, metadata, labels and footer content frequently fall between roughly 10 and 13 pixels.
12. **Heading tracking is too aggressive.** Large negative letter spacing and sub-0.9 line heights reduce readability and create collisions at intermediate widths.
13. **The first redesign is longer than the production desktop homepage.** Large section padding and repeated proof/writing/closing blocks produce an 8,531-pixel page at 1440 pixels wide.
14. **The 3D hero panel does not prove product-design quality.** Empty concentric rings and a wireframe object occupy prime space that should primarily show real work.
15. **Mobile capability descriptions are intentionally hidden.** This removes useful decision-making content from the users most likely to scan quickly.
16. **Case studies remain text-led.** Yarsha has one cover graphic followed by long explanatory sections, with too few annotated flows, state comparisons or interface details.
17. **Generic case-study language repeats across projects.** Several pages use broad phrases such as “clearer hierarchy” without enough project-specific evidence.
18. **Contact details wrap badly.** The email address can break at an arbitrary point, making the most important contact path look broken.
19. **The work-index toolbar retains the previous visual system.** Filters and search appear as a separate design language rather than part of the editorial system.
20. **The light theme needs independent composition tuning.** It currently changes tokens but retains shadows, translucent surfaces and density choices designed primarily for dark mode.

## P2 — quality and maintainability issues

21. **Editorial CSS was placed in one minified foundation file.** The dedicated home, responsive and case-study modules were empty, undermining maintainability and auditability.
22. **The header uses `transition: all`.** This can animate unintended properties and makes performance/debugging less predictable.
23. **GSAP initializes globally.** Pages without editorial sequences still pay initialization and script-loading overhead.
24. **Three.js loads from a remote CDN.** It is safely optional, but the visual should remain complete when the request is blocked, slow or unavailable.
25. **Motion vocabulary is repetitive.** Nearly every section uses the same fade-and-rise reveal, producing animation fatigue rather than meaningful continuity.
26. **Visual-regression baselines are stale after intentional redesign.** New dimensions and screenshots need human review and deliberate baseline approval.
27. **Machine-readable links are visible in the homepage proof section.** `llms.txt` and `ai-profile.json` are useful infrastructure but do not deserve prime visitor-facing space.
28. **Previous-project navigation is not curated.** Moving from Yarsha to Sass Boilerplate weakens narrative continuity between strongest hiring stories.
29. **Footer scale is inverted.** The closing statement is enormous while practical contact and navigation links are comparatively tiny.
30. **The design system lacks explicit content-density tiers.** Marketing pages, case studies and long-form articles need different spacing and type measures rather than one global dramatic scale.

## Redesign acceptance criteria

- Selected work follows the hero immediately.
- Hero copy stays within two strong display lines at common desktop widths.
- Normal supporting text is at least 16px on mobile and approximately 16–20px on desktop.
- Primary navigation targets are at least 44px high.
- Homepage is materially shorter than the previous redesign while preserving work, process, proof, writing and contact paths.
- Three.js remains a subtle optional layer over a complete static project composition.
- No project iframe is required for evidence or navigation.
- All routes use the same header, typography, surfaces, controls and footer language.
- Mobile capability descriptions remain available.
- Case studies include project-specific flows, states and annotated interface evidence.
- Browser audit passes across all sitemap routes and tested viewports.
- Repository validation and Cloudflare build pass without generated-source drift.
- Visual baseline changes are reviewed before approval.
