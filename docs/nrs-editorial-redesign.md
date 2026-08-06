# Nischhal Portfolio 2026 - Design Master

## North star

**Complex products, made obvious.**

The portfolio is an authored technical editorial: calm, exact, contemporary, and personal. It demonstrates product thinking before it explains services. Visual drama comes from scale, composition, project evidence, and spatial depth rather than glass cards, novelty cursors, or constant animation.

## Audience

- Product and design leaders hiring a product designer
- Founders and software teams evaluating UX/UI project work
- Engineers assessing implementation awareness and handoff quality
- Web3, SaaS, fintech, and remote product teams

## Visual thesis

- Technical editorial with a Swiss-influenced asymmetric grid
- Local system type stack with strong display scale and monospace metadata
- Mostly neutral palette with one acid-lime signal colour
- Large project imagery and restrained interface annotation
- Kathmandu identity through coordinates, timezone, and precise metadata, not tourism motifs

### Palette

| Token | Dark | Light |
|---|---|---|
| page | `#080A08` | `#F1EFE6` |
| page-alt | `#10130F` | `#E8E5DA` |
| surface | `#141813` | `#FAF8F0` |
| text | `#F2F5EA` | `#11130F` |
| text-muted | `#AEB5A6` | `#50564C` |
| accent | `#D8FF48` | `#A8D400` |
| accent-ink | `#101400` | `#11130F` |

Accent remains below roughly ten percent of the page and marks action, progress, project numbering, and selected states.

### Typography

No remote font dependency. The repository enforces one local font system.

- Display: Arial, Helvetica Neue, system sans; 650-800
- Body: system UI stack; 400-500; 1.55-1.75 line height
- Metadata: ui-monospace, SFMono-Regular, Consolas, monospace
- Desktop line measure: 60-75 characters
- Mobile body minimum: 16px

### Spatial system

- Base rhythm: 8px
- Section rhythm: 80 / 112 / 144px
- Desktop: 12-column grid
- Verification widths: 375 / 768 / 1024 / 1440
- Content width: maximum 1440px with adaptive gutters
- Radii: 10px controls, 18px media, pills only for metadata
- Dividers create rhythm instead of card containers around every paragraph

## Page architecture

### Global shell

- Persistent editorial masthead
- Name and role visible on desktop
- Semantic primary navigation
- Availability and theme controls are secondary
- Mobile navigation remains a focus-trapped dialog
- Footer ends with a large project invitation and practical contact links

### Homepage

1. Hero statement, positioning, work CTA and contact CTA
2. Lightweight Three.js spatial signature with CSS fallback
3. Featured work immediately after hero
4. Asymmetric secondary project grid
5. Editorial capability index
6. Compact proof strip
7. Writing index
8. Closing project invitation

### Case studies

1. Project thesis and facts
2. Large evidence visual
3. Product challenge and constraints
4. Decision chapters with diagrams or annotated evidence
5. System thinking and state coverage
6. Delivered artifacts versus proposed measurement
7. Prototype/resource link
8. Next project

Measured outcomes are never invented. Intended effects, artifacts, and proposed validation remain explicitly distinguished.

## Interaction thesis

### Emotional intent

Calm confidence and technical precision. The work feels considered and alive, never frantic.

### Motion personality

**Premium technical**

- Quick: 120ms
- Standard: 360ms
- Narrative: 680ms
- Entrance: `power3.out` / `cubic-bezier(.2,0,0,1)`
- State: `power2.inOut` / `cubic-bezier(.4,0,.2,1)`
- Exit: `power2.in`
- No bounce or elastic overshoot

### Motion rules

- Hero enters in a compact 55ms stagger, under 700ms total
- Section reveals travel 12-20px using transform and opacity
- Project media receives restrained pointer depth and no layout movement
- Scroll parallax remains under seven percent of media height
- Header condenses with opacity, border, and background changes
- No scroll hijacking or mandatory pinned sequence
- One ambient Three.js field, paused off-screen and while hidden
- Pointer motion only for fine pointers
- Interactions remain interruptible

### Reduced motion

- Content is immediately visible
- Spatial reveals and parallax are removed
- Three.js renders once or falls back to CSS
- Hover states use colour and border without translation
- No ambient loop runs

## Three.js signature

- Decorative transparent canvas in the hero
- Low-poly wireframe plus deterministic points and connection lines
- Monochrome geometry with acid-lime highlights
- DOM remains fully interactive
- Dynamic import from the CSP-approved CDN with complete fallback
- Device pixel ratio capped at 1.5
- Animation pauses outside the viewport
- Renderer, geometry, material, listeners, and observers are disposed
- Save-data, reduced-motion, low-memory, and unsupported WebGL paths skip continuous rendering

## Accessibility contract

- 4.5:1 contrast for normal text
- Visible focus ring on every interactive element
- Touch targets at least 44 by 44 CSS pixels
- Sequential heading hierarchy and descriptive image text
- Skip link and mobile focus trap retained
- No information conveyed by colour or motion alone
- Decorative canvas is `aria-hidden`

## Performance contract

- Static HTML remains the content source
- One compiled stylesheet and one stable runtime entry
- GSAP loads from existing local vendor assets
- Three.js progressively enhances and never blocks content
- No model, HDR environment, texture, or post-processing pipeline
- Images remain lazy outside the hero
- Transform and opacity are the primary animated properties
- No persistent allocation in the render loop

## Implementation rules

- Preserve canonical routes, metadata, structured data, and Cloudflare architecture
- Add CSS through the repository stylesheet compiler
- Scope redesign selectors under `.nrs-editorial-redesign`
- No `!important` in modular CSS
- No external stylesheet or CSS import
- Preserve audit markers until contracts are deliberately updated
- `npm run validate` must pass without generated source drift
