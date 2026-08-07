# Nischhal Raj Subba Portfolio — Design System Master

## North star

**Make complex products feel inevitable.**

This portfolio behaves like a designed product, not a résumé wrapped in cards. It uses a light-first studio canvas, oversized typographic framing, full-width project evidence, precise metadata, and a restrained 3D system that visualizes complexity resolving into structure.

## Audience

- Product and design leaders hiring senior product-design talent
- Founders evaluating a designer for Web3, SaaS, fintech, and software products
- Engineers looking for evidence of implementation awareness and state-complete handoff
- Agencies and product teams evaluating project-based collaboration

## Visual thesis

Warm off-white studio canvas with near-black type, signal-orange action color, oversized grotesk display typography offset by restrained serif italics and monospace metadata, generous asymmetric spacing, and flat editorial components built from rules, media, and typography rather than rounded cards or glass surfaces.

## Interaction thesis

Premium, purposeful motion: 120–180ms control feedback, 320–480ms section transitions, one 620ms hero choreography, restrained 1–2px hover lift, scroll-linked image depth under 7%, and a desktop-only Three.js “complexity → clarity” field; no bounce, no cursor replacement, no smooth-scroll hijacking, no constant marquee, and no motion required to understand content.

## Color tokens

### Light
- page: `#F2EFE7`
- surface: `#FBF8F1`
- ink: `#11110F`
- ink-soft: `#4C4A43`
- ink-faint: `#706C64`
- line: `#C8C1B4`
- line-strong: `#8E887E`
- signal: `#FF4D00`
- signal-ink: `#1A0800`
- inverse: `#11110F`
- inverse-ink: `#F7F2E8`

### Dark
- page: `#0C0C0B`
- surface: `#151512`
- ink: `#F3EFE6`
- ink-soft: `#B8B2A7`
- ink-faint: `#8D877E`
- line: `#34322D`
- line-strong: `#5A554D`
- signal: `#FF6B2C`
- signal-ink: `#180A04`
- inverse: `#F3EFE6`
- inverse-ink: `#11110F`

Signal orange stays under 10% of visible area and is reserved for focus, current state, section indices, and primary calls to action.

## Typography

No remote font dependency.

- Display: `Arial, Helvetica Neue, Helvetica, sans-serif`
- Editorial accent: `Georgia, Times New Roman, serif`
- Body: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`
- Metadata: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

Roles:
- Hero: `clamp(4.4rem, 10vw, 10.5rem)`, 700, 0.84–0.9 line height
- H2: `clamp(2.7rem, 6vw, 6.4rem)`, 650–700
- H3: `clamp(1.6rem, 3vw, 3rem)`, 600–700
- Lead: `clamp(1.15rem, 1.8vw, 1.55rem)`, 1.45 line height
- Body: `1rem–1.125rem`, 1.65 line height
- Meta: `0.72rem–0.82rem`, uppercase where useful, 0.08em tracking

Long-form measure is 62–72 characters. Supporting copy never drops below 16px on mobile.

## Spatial system

Base unit: 4px, with primary rhythm on 8px multiples.

- xs: 8
- sm: 12
- md: 16
- lg: 24
- xl: 32
- 2xl: 48
- 3xl: 64
- section-sm: 80
- section-md: 112
- section-lg: 152

Desktop layout uses a 12-column grid. Large gutters: 32–56px. Mobile gutters: 18–24px.

## Shape and surface

- Default radius: 0
- Media radius: 2px
- Control radius: 999px only for compact controls
- No glass cards
- No drop shadows for ordinary content
- Depth comes from overlap, scale, contrast, and motion
- Hairline rules create grouping and rhythm

## Components

### Navigation
- Fixed or sticky masthead with name/role left, route index center/right, utility controls secondary
- 48px minimum target height
- Current route shown with signal marker and text weight, not a filled pill

### Buttons
- Primary: dark/inverse field with strong text, subtle 1px transform feedback
- Secondary: transparent with rule and arrow
- Focus: 3px signal outline with 3px offset
- Active: `translateY(1px)`
- Disabled: 45% opacity, semantic disabled state

### Project row
- Full-width editorial row, never a floating card
- Number, project title, sector/role/year, image, and one-line decision statement
- Hover shifts media 1–2px and reveals directional mark
- Mobile stacks title before media and keeps all context visible

### Case study
- Thesis header, evidence block, challenge, decisions, state coverage, shipped artifacts, reflection, next project
- Sticky chapter rail only at desktop widths with enough vertical space
- Visual evidence dominates; prose supports it

## Motion tokens

- quick: 120ms
- standard: 180ms
- section: 360ms
- slow: 480ms
- hero: 620ms
- stagger: 45ms
- enter: `cubic-bezier(0.2, 0, 0, 1)`
- emphasized: `cubic-bezier(0.05, 0.7, 0.1, 1)`
- exit: `cubic-bezier(0.3, 0, 1, 1)`
- ambient: `cubic-bezier(0.4, 0, 0.2, 1)`

Reduced motion removes parallax, WebGL animation, staged reveals, and view-transition travel while preserving all content and state feedback.

## 3D system

The Three.js field is not a product mockup and is never required for navigation. It illustrates the portfolio promise: a dispersed field of points and line segments continuously settles toward a structured orthographic grid as the visitor moves through the hero.

- Desktop only, minimum width 900px and fine pointer
- Disabled for reduced motion or Save-Data
- Transparent canvas over CSS background
- DPR clamped to 1.5
- 80–140 particles maximum
- No postprocessing
- Pointer response under 4 degrees camera/group movement
- Pause when offscreen or document hidden
- Dispose geometry, material, renderer, listeners, observers

## Responsive principles

- 375: single-column, 16px+ body text, no WebGL, no hidden project context
- 768: two-column sections where useful, still no pinned horizontal experiences
- 1024: full masthead, optional WebGL, 12-column layout
- 1440+: larger project-media scale and deliberate whitespace, not simply larger type everywhere

## Accessibility

- Text contrast >= 4.5:1
- Focus visible on every interactive control
- Skip link retained
- 44x44 minimum interactive targets
- No hover-only information
- Decorative canvas is `aria-hidden=true`
- All meaningful project images keep useful alt text
- Mobile menu traps focus, closes on Escape, and restores focus
- `prefers-reduced-motion` provides static, immediately readable states
