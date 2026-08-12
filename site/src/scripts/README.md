# Browser runtime

The browser runtime is split by responsibility rather than one catch-all features directory.

- `entrypoints/`: runtime bootstraps only.
- `shared/`: dependency-light helpers shared across domains.
- `features/accessibility/`: accessibility and audit remediation behavior.
- `features/analytics/`: analytics/event instrumentation.
- `features/content/`: article, blog, filtering, copy, and content presentation behavior.
- `features/forms/`: form interaction and submission behavior.
- `features/layout/`: layout, typography, responsive, shell, and spacing behavior.
- `features/motion/`: animation, pointer, canvas, and portrait interaction behavior.
- `features/navigation/`: navigation, menu, theme, transitions, share, and resume controls.
- `features/portfolio/`: project/case-study presentation and portfolio upgrades.
- `features/system/`: cross-cutting design/experience contracts.

Every authored JS module has an `@fileoverview` header and every function/callback has a function contract enforced by `npm run audit:code-docs`.
