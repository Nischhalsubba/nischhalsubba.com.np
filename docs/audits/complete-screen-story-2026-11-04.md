# Complete-screen portfolio stories — 4 November 2026

## Owner direction and correction

The owner explicitly confirmed that the Figma design content contains dummy data, no real user information and no NDA restrictions, and authorized complete screenshots. This supersedes the privacy-crop approach in merged PR #105. The narrow status-column and toolbar crops made the product experience harder to understand. This change replaces every published evidence crop with its complete original frame and adds connected source-screen sequences.

## Verified selection

| Case | Complete frames | Story |
|---|---:|---|
| Yarsha | 12 | Contacts and empty search → conversation, profile and search → recipient/token/NFT selection → group creation/detail/invite → transaction detail |
| Orkest HQ | 6 | Lead ownership → filter form/review/confirmation → creation → lead detail and conversion |
| PiHub | 8 | Corporate information → application → submitted status; investor account/product creation/directory/requests; access boundary |
| Zapp Today | 8 | Account entry → registration → verification; home → parcel → service; driver next stop → completion |
| Masteriyo | 8 | Course identity → empty builder → outline → section/lesson editing → quiz → true/false and multiple-choice questions |
| Morajaa | 3 | Homepage → full service page → sector-specific explanation |
| Hamro Idea | 4 | Historical homepage → services → About → contact |
| Mokshya, Designerex, Splashnode, Grid Labs, Zakra Furniture | 0 new | Matching Figma sources remain owner-deferred |
| Neverwinter Live Parser, SassBoilerplate | Code evidence | Source and implementation documentation remain appropriate evidence |

49 complete frames generate 155 responsive/social derivative files and 68 placements across cases and articles. All recipe crops are null and all mask lists are empty. 18 complete renders were retrieved through Figma during this pass; other selected originals came from the previously exported archive. These are not 49 newly discovered Figma screens, and these counts do not revise the separate 3,889-export baseline. A separate archive preserves the 49 selected source renders and exact recipes.

The full-height website renders retain their complete compositions, including placeholder imagery and sample claims. They are identified as historical/design content, not independently verified business achievements. Figma may scale a full-page render: complete frame does not necessarily mean native 1× resolution. Original aspect ratios are preserved in the public derivatives. No temporary Figma URL is used in production.

## Editorial changes

Yarsha now has five connected chapters: finding a person, building conversational context, selecting recipient and asset, forming a shared group, and inspecting transaction detail. The account explains the decision at each transition instead of treating the app as a screenshot gallery or inventing an iteration timeline. The original Blastscan label is retained and identified as a source inconsistency requiring implementation resolution.

The other accessible cases place their additional screens inside their existing journey chapters. Source labels distinguish the current Orkest CRM core from supporting form scenarios, Zapp customer designs from driver demonstrations, historical Hamro Idea pages from current commercial facts, and Masteriyo team work from sole ownership. Existing source-limited cases retain their authored journeys and proposed evaluation tasks. No research results, measured outcomes, chronology or project role is invented.

## Selected Work contrast

The selected card's hover veil used opacity 1 over a 46%-opaque dark layer. Hover now leaves that veil transparent and does not scale the source image. The preview uses contain rather than cover, preserving the whole presentation. The link has a solid dark background; selected labels use readable foregrounds on a dark backing. Focus remains visible. A browser regression exercises the actual hover and checks the computed veil opacity; it saves a hover screenshot for review.

## Validation and limits

Local production build, 53-route SEO checks, editorial/image provenance checks and 14-route smoke checks passed. Every selected source was decoded and its hash recorded. Source documentation and JavaScript syntax checks passed. App-frame variants remain below 100 KB; complete long website renders have a pixel-area budget capped at 650 KB, are responsive and lazy-loaded. This preserves complete screens rather than satisfying the former 100 KB budget through destructive crops.

Browser CI now decodes and captures every case-study image at desktop width, in addition to seven-width reflow and accessibility checks. Repeated production builds produced 710 byte-stable generated files. Final-commit browser results remain pending. This change does not claim deployment, field Core Web Vitals, indexing success or full manual assistive-technology sign-off.
