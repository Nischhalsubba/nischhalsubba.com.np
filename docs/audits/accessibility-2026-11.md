# Accessibility evidence — 2026-11

Fixed a source-confirmed WCAG 2.1.4 concern: global single-character navigation now requires Alt+letter, with matching tooltips and aria-keyshortcuts. The same rule applies to homepage and inner routes; text entry remains protected.

New images have meaningful alt text, visible source/presentation captions, intrinsic dimensions, responsive sources, deferred below-fold loading and the existing native image dialog. Redactions are visible and described. Static text explains the decision rather than requiring a reader to decipher rasterized UI.

Repository validation includes accessibility-token, semantics, link and secure-contact contracts. `scripts/seo/browser-evidence.mjs` adds axe WCAG A/AA scans at 390/1440, reflow checks at 320/375/390/768/1024/1440/1920, and image-dialog Escape/focus-restoration checks. Existing browser workflows retain all-route typography/overflow and contact coverage.

Local Chromium installation failed with empty/truncated ZIP downloads. CI browser results must be read before reporting any passing axe count. WAVE browser extension/licensed API was unavailable: exact WAVE counts are NOT VERIFIED. A real screen-reader session, mobile keyboard, landscape, 200/400% zoom and AT shortcut behavior remain NOT VERIFIED. No WCAG certification or zero-error blanket claim is made.

Manual reviewer checklist: use Tab/Shift+Tab through nav and image controls; open/close mobile menu and native image dialog; confirm focus restoration and no obscured focus; inspect captions/alt with NVDA/VoiceOver; test reduced motion, form errors and reflow. Record assistive technology/version and observed outcomes.

Reference: https://www.w3.org/WAI/WCAG22/quickref/


## Verified c295423 CI and follow-up

Run 41765628443 completed 12 representative axe scans with zero reported violations and no recorded browser assertion failures; reflow, image-dialog and normal-motion checks passed. This does not mean every accessibility concern passed: axe marked two aria-prohibited-attr occurrences on the award-badge containers and twelve color-contrast occurrences as incomplete (manual review required). This revision gives the badge containers a group role so their accessible labels have a supported semantic role. Gradient contrast remains unverified manually. No WAVE or real screen-reader session was completed. Follow-up commit CI must verify the new markup.
