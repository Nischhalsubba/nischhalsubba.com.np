## The project and my part in it

Neverwinter Live Parser is a personal tooling project with a Windows-oriented Electron app and a React renderer. I worked on the information model, summary hierarchy and implementation-aware interface.

The challenge is what a total means. A player needs to know which encounter, actor, time range and filters produced the number before drawing a conclusion from it.

### What shaped the design

- A total depends on its encounter, actor, time range and grouping.

- Malformed or incomplete events limit what can be inferred.

- Dense data needs a readable overview and a route into detail.

THE DESIGN CHALLENGE

## How can a combat summary make complex events readable without hiding the assumptions behind its numbers?

I organized the story from the summary back to its supporting data. The public source provides concrete examples of the rules behind that relationship.

01 / Keep the encounter attached to the number

## Keep the encounter attached to the number

One renderer fixture gives a player 999 total damage across the available data, but only 120 within the selected encounter. The expected row uses 120 and derives 12 DPS for the ten-second encounter. These are test-fixture values.

That example makes the interface requirement clear: the selected encounter changes the meaning of the summary. The screen should keep that context available instead of silently substituting a broader total.

A compact total needs a clear scope.

02 / Let the overview lead into a specific question

## Let the overview lead into a specific question

Raw-line parsing, encounter aggregation and renderer rows have different responsibilities in the source. An event’s applied amount, the way events are grouped and the row a player reads are related decisions.

The tests distinguish applied damage from base magnitude and cover grouping player-owned summons and companions. An overview needs enough context for someone to understand those groupings before investigating further.

The summary should stay readable while keeping its underlying assumptions inspectable.

03 / Make incomplete data visible

## Make incomplete data visible

A malformed-line test expects an issue result and an unknown event type. Other fixtures distinguish placeholder encounters from meaningful combat totals.

Those cases give uncertainty a concrete place in the model. The app still needs execution with representative logs to establish how completely these conditions are handled and communicated.

Malformed-input contract from the actual parser test, excerpt

expect(result.kind).toBe("issue"); if (result.kind === "issue") { expect(result.issue.reason).toMatch(/separator|field count/i); expect(result.event.eventType).toBe("unknown"); }

[Read the original source](https://github.com/Nischhalsubba/neverwinter-live-parser/blob/main/app/src/core/parser/parseLine.test.ts)

A precise-looking number should not conceal that the input is incomplete.

## Public browser setup state

![Public browser setup state, captured 6 November 2026 — idle with no player or combat log connected; desktop integration and performance not verified.](https://media.contra.com/image/upload/w_1000/qemo7k5uucgo0lxe5wpy.webp)

Public browser setup state, independently captured on 6 November 2026. This independently captured public browser view is idle, with no player or combat log connected. Recorded-log analysis is offered; live folder monitoring and auto-detect require the Electron desktop app. No gameplay, Windows integration or performance outcome was verified.

- [Open the complete original viewport](https://nischhalsubba.com.np/assets/images/site-captures/neverwinter-public-setup-c017c10b437b-original.png)

- [Open the actual public source](https://neverwinter-live-parser.vercel.app/)

## What I delivered

The public repository exposes parser, aggregation and view-model fixtures. The browser setup reference shows how the tool introduces its log dependency.

- [Inspect real parser cases and malformed-input expectations](https://github.com/Nischhalsubba/neverwinter-live-parser/blob/main/app/src/core/parser/parseLine.test.ts)

- [Inspect encounter aggregation fixture](https://github.com/Nischhalsubba/neverwinter-live-parser/blob/main/app/src/core/aggregation/encounterAggregator.test.ts)

- [Inspect encounter-scoped rows and ownership grouping](https://github.com/Nischhalsubba/neverwinter-live-parser/blob/main/app/src/renderer/analysisViewModel.test.ts)

- [Read the Electron application and runtime manifest](https://github.com/Nischhalsubba/neverwinter-live-parser/blob/main/app/package.json)

## Outcomes and next steps

The design and source explain how encounter context should stay connected to the summary. The Windows app and parser accuracy were not independently executed in this portfolio review.

### What I would test next

- Trace one displayed metric back to known combat events and the documented calculation rule.

- Use empty, malformed and interrupted log fixtures before evaluating parsing correctness, session recovery or speed.

### What I learned

The useful summary is the one a player can question. Keeping its context nearby makes a number easier to interpret.

## About the screens

Personal project, separate from ownership of Neverwinter. Public browser view is an idle setup state; fixture values are examples, not player results or live telemetry.

## Related work and reading

RELATED EXPLORATION

### Gaming and interface clarity

![Related portfolio exploration — gaming and interface clarity.](https://media.contra.com/image/upload/w_1000/pswjaqcjc0psav0o9qpc.webp)

RELATED EXPLORATION

### Reviewing dense dashboards

![Related portfolio exploration — dense dashboards and developer tooling.](https://media.contra.com/image/upload/w_1000/bmytewwyvl0dxzduemow.webp)

RELATED EXPLORATION

### Related developer tooling

## Got a product in mind?