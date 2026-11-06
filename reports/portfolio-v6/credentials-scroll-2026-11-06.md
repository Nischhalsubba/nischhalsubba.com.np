# Larger, scroll-linked credentials

Request: move credential cards from right to left while scrolling down and make their details easier to read.

Changes: desktop cards grow from 360px to a responsive 420–560px width; minimum height grows from 340px to 420px. Badge artwork grows from 144px to 192px; titles to 21px and summaries to 17px. Short desktop viewports use 360px cards and 160px badges. Phone cards retain viewport-safe sizing.

A small dependency-free controller maps the existing sticky section's vertical progress to native track.scrollLeft. Its spacer is measured from real overflow, so the last card is reachable and upward scrolling reverses the gallery. No wheel/touch event cancellation or global scroll hijack. Arrows, drag, swipe and keyboard remain native. Focused credential links are not moved away. Reduced motion, narrow screens, or content taller than the viewport retain ordinary swipe/arrow navigation with no artificial sticky interval. Resizing and motion-preference changes remeasure the interval; observers/listeners have cleanup.

Validation: isolated execution of the actual controller passed forward/reverse progress, final-card reachability, focused-link protection, reduced-motion change, narrow/short-screen fallback and cleanup checks. Production build and homepage/inner/SEO audits are run before merge. Browser verification remains owner-waived; no rendered screenshot or manual sign-off is claimed. Cloudflare result is recorded in the release PR and Notion after merge.
