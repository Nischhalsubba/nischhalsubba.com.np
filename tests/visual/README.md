# Visual regression contract

The browser-audit workflow compares full-page screenshots for the portfolio's highest-risk hiring and conversion routes.

## Covered routes

- Home
- Services index
- Contact
- Product design service
- Yarsha case study
- Mokshya case study

Each route is captured at:

- Mobile: 390 × 844
- Desktop: 1440 × 900

The combination intentionally covers navigation, responsive typography, service content, form layout, case-study media, shared footer behavior, and long-page stacking.

## Stability controls

The harness:

- pins Chromium through Playwright 1.54.1;
- uses dark color scheme, device scale factor 1, and reduced motion;
- disables CSS animations, transitions, caret rendering, and smooth scrolling;
- blocks third-party requests;
- replaces Turnstile with a stable local placeholder;
- hides optional iframes and video before capture;
- waits for document fonts before taking screenshots.

These controls keep the baseline focused on authored layout rather than network timing or third-party UI.

## Review tolerance

A snapshot fails when more than **0.5% of pixels differ** from the committed baseline. Pixelmatch uses a per-pixel threshold of `0.12` and ignores anti-alias-only differences.

The 0.5% limit permits minor renderer noise while still catching meaningful shifts in spacing, typography, overflow, missing media, component dimensions, and responsive layout.

## Updating baselines

Baseline changes must be intentional and reviewed alongside the code that caused them.

1. Run the browser audit with `UPDATE_VISUAL_BASELINES=1`.
2. Inspect every generated image, not only the changed route.
3. Confirm the change is expected at both representative viewports.
4. Commit the updated files under `tests/visual/baselines/` with the related layout change.
5. Never regenerate baselines merely to make CI green.

When no baselines are committed, CI generates them as an artifact and fails. This bootstrapping failure is deliberate: the images must be reviewed before they become the contract.

Failure artifacts include the actual screenshot and a `*-diff.png` image for snapshots exceeding the tolerance.
