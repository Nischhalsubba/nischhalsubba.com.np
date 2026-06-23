# ClearPlay Design System

ClearPlay is the design system for Blink & Find, a new-concept casual number-memory game for ages 10 to 60. It is designed for solo play, same-device play, challenge links, and online matches.

## 1. Design principles

- Teach the game before showing every mode.
- Use simple language: watch, find, compare.
- Make the first action obvious.
- Keep number tiles high contrast and readable.
- Make social play easy to understand: nearby players and online players are different paths.
- Use friendly visuals without making the product feel childish.

## 2. Audience

Primary age range: 10 to 60.

This means:

- Body text should stay at 16px or larger where possible.
- Helper text should avoid tiny gray styling.
- Buttons and tiles need comfortable tap targets.
- Color should support meaning, not carry it alone.
- The flow should work for players who have never seen this type of game before.

## 3. Product promise

> Memorize the number. Find it faster.

Supporting explanation:

> Blink & Find shows you a number, hides it, then challenges you to find the match on the board. Play solo, on one device, or online with someone far away.

## 4. Typography

- Display font: Nunito Sans.
- Body font: Inter.
- Fallbacks: SF Pro, Segoe UI, system-ui, sans-serif.

Usage:

- Hero: Nunito Sans Black, large, friendly, tight but readable.
- Page headings: Nunito Sans ExtraBold.
- Card titles: Nunito Sans ExtraBold.
- Body and helper text: Inter Regular or Medium.
- Number tiles: Nunito Sans Black for strong digit recognition.

## 5. Color palette

| Token | Hex | Use |
|---|---:|---|
| Background | #f7faff | app background |
| Surface | #ffffff | cards and panels |
| Surface soft | #eef6ff | secondary panels |
| Text primary | #172033 | main text |
| Text muted | #667085 | helper copy |
| Primary blue | #2563eb | main actions and focus |
| Friendly teal | #14b8a6 | calm/social accents |
| Play yellow | #fbbf24 | fun/reward accent |
| Success green | #22c55e | correct and completed states |
| Error red | #ef4444 | wrong taps and destructive actions |
| Border | #d9e4f2 | structure and separation |
| Tile text | #1e293b | number tile digits |

## 6. Flow model

The main UX flow is:

1. Understand.
2. Try.
3. Improve.
4. Invite.

The home page should prioritize three play choices:

- Play solo: learn and beat your own time.
- Play together: same-device local play.
- Play online: create a room and play with someone away from you.

## 7. Component rules

### Buttons

Primary buttons are for the next best action: Play first round, Start game, Create room, Continue, Play again.

Secondary buttons are for learning or navigation: Learn how it works, Customize, Back, View modes.

### Mode cards

Every mode card needs:

- category label
- mode name
- one-sentence description
- clear CTA

### Number tiles

Number tiles must be the clearest elements in the product:

- high contrast
- large digits
- visible focus state
- minimum comfortable tap target
- correct and wrong states with both color and motion/shape feedback

### Target and timer cards

Target and timer panels must explain themselves:

- Target visible: Remember this number.
- Target hidden: Find the number.
- Timer: Lower is better.

## 8. Accessibility

- Minimum tap target: 44px.
- Body text: 16px preferred.
- Visible focus rings on all controls.
- Reduced-motion support must remain.
- Do not use color alone for correctness, errors, or mode categories.
- Keep online-match copy plain and recoverable.

## 9. Anti-patterns

Avoid:

- showing too many modes before explaining the game
- decorative gradients behind number tiles
- tiny helper text
- dark-only interfaces
- playful copy in serious errors
- unlabeled icons
- using padding hacks inside lists to fix section spacing
