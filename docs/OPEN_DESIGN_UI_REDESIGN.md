# Open Design UI/UX Redesign: Blink & Find

## Product classification

Blink & Find is a new-concept number-hunting game. The biggest UX challenge is that players do not instantly know what kind of game it is, so the interface must explain the loop without making the player read a manual. Apparently humans prefer games to teach themselves. Sensible, annoyingly.

## Audience

- First-time players who land from a shared link or search.
- Casual players who want one fast round.
- Friends who want a simple competitive room.
- Younger, older, or lower-confidence players who need a calmer entry point.

## Redesign goals

1. Make the first screen feel welcoming instead of like a settings panel.
2. Explain the core loop in three visible steps: remember, find, improve.
3. Push beginners toward safe modes: Play Now, Tutorial, Comfort, Zen.
4. Group advanced modes behind clear categories.
5. Make online play feel social and understandable.
6. Make the game surface softer, brighter, and less intimidating.
7. Preserve speed for returning players.

## Visual direction

### Theme name

Warm Arcade Classroom

### Tone

Friendly, playful, focused, and calm. The UI should feel like a tiny game coach, not an admin dashboard wearing a hoodie.

### Color strategy

- Background: warm cream instead of pure black.
- Primary: friendly indigo/blue for action.
- Accent: amber and mint for playful mode cards.
- Error: still red, but used sparingly.
- Game tiles: high contrast, rounded, tactile.

### Shape and spacing

- Larger radius: 24-32px for cards.
- Bigger button targets.
- More breathing room on onboarding cards.
- Sectioned layout instead of one dense list of buttons.

## New home hierarchy

1. Hero explanation
   - "A tiny focus game for fast eyes."
   - One sentence rule: remember a number, find it on the board, beat your time.
2. Primary action
   - Start a 30-second intro game / Play Now.
3. Beginner path
   - Learn in 20s
   - Comfort Mode
   - Zen Mode
4. Main game modes
   - Daily Challenge
   - Practice
   - Time Attack
   - Streak
5. Social modes
   - Play with Friend
   - Challenge Link
6. Progress
   - Leaderboard
   - Profile
   - Stats
7. Footer help
   - Modes, Tips, FAQ, History, QA

## Component changes

### GameModeCard

Reusable card for mode navigation with:

- Eyebrow label
- Friendly title
- Short description
- Soft color tone
- CTA button
- Full-card link support

### StartScreen

Convert the old compact card into a welcoming landing screen:

- Hero card with explanation and primary CTA.
- "New here?" starter panel.
- Mode cards grouped by intent.
- Settings moved into a gentler "Customize first game" panel.

### GameScreen next step

Planned pass:

- Add clearer current objective at top.
- Reduce compressed badges.
- Make target/timer feel like game HUD tiles.
- Add beginner copy during preview.
- Keep expert path fast.

## Interaction states

Every new clickable component should include:

- Default: soft card, clear CTA.
- Hover: slight lift and shadow.
- Focus: visible ring.
- Active: pressed scale or stronger shade.
- Disabled: reduced opacity and no hover drama.
- Loading: button label change, no duplicate click.
- Error: plain-language recovery copy.

## Responsive behavior

- Mobile: one-column stacked cards, hero first, compact footer.
- Tablet: two-column mode cards.
- Desktop: hero plus side starter panel, then three-column mode grid.
- Avoid hiding the core rule below the fold.

## Accessibility checks

- Buttons and links need accessible names.
- Mode cards need semantic headings.
- Color cannot be the only category indicator.
- Keep minimum tap targets around 44px.
- Preserve reduced-motion support.

## Current implementation status

- Added `GameModeCard` reusable component.
- Added this redesign direction document.
- Next implementation pass should replace `StartScreen` with the new hierarchy and then soften `GameScreen` HUD.

## Quality critique

### What this improves

- Better onboarding.
- Less intimidating first impression.
- Clearer choice architecture.
- Beginner and advanced players both get obvious routes.

### Risks

- Too many mode cards can still overwhelm new players.
- Visual warmth must not reduce number-grid contrast.
- Game screen redesign must not waste vertical space on mobile.

### Fixes applied in the design direction

- Beginner path appears before advanced modes.
- Primary Play Now remains dominant.
- Help links remain available but secondary.
