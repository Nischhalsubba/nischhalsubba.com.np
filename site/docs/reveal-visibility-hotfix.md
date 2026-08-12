# Reveal visibility hotfix

## Root cause

The portfolio reveal system used a persistent root class, `agent-motion-ready`, to set every `[data-agent-reveal]` element to `opacity: 0`.

GSAP then animated those elements to visible and finished with `clearProps: 'transform,opacity,visibility'`. Once those inline styles were cleared, the persistent CSS rule became authoritative again and immediately returned the content to `opacity: 0`.

The behavior became visible in production after the Content Security Policy allowed the jsDelivr GSAP imports to load successfully.

## Contract

- Portfolio content is visible by default.
- Progressive animation may temporarily animate an element, but animation cleanup must always return to a visible CSS state.
- No root-level motion class may globally hide all reveal targets.
- Reduced motion, network failures, blocked CDN imports, and delayed module loading must leave content readable.

`scripts/ensure-reveal-visibility.cjs` enforces this contract in canonical source generation and the production dist build.
