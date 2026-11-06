# A delivery has one outcome and several different next actions

Status: unpublished working draft for T49. Exact project year remains unverified; do not publish a guessed year. Scope: mobile product design contribution, not ownership of the current Zapp platform.

A customer, a driver and an operations team can all be looking at the same delivery while needing different information. Giving them identical screens would make the interface consistent in appearance and inconsistent in usefulness.

The retained Zapp customer design begins with a simpler distinction: creating an account and signing in are separate routes. The explanation beneath each action tells a person which path fits their situation. That is a visible design decision. It does not establish that account creation succeeded, that a parcel was delivered, or that the design improved conversion.

![Retained Zapp customer account-entry design](/assets/images/evidence/zapp-account-entry-402-008fb155a75b.webp)

Caption: owner-approved retained Zapp 2.0 customer iOS design, complete frame. Sample design content is unchanged. Exact project year and independent original reacquisition remain pending; see the source file and node in the committed portfolio evidence registry.

The more consequential handoff happens after entry. A parcel request, a driver stop and an exception investigation are related tasks, but each needs its own next action. A useful review would first name the state that must be shared, then ask which action each role can take. That avoids using a customer-facing label as a substitute for the driver's operational instruction.

There is also a version boundary. The newer customer file and the older customer and driver prototypes are separate artifacts. They should not be assembled into a fictional approved release. When a review crosses those files, the caption and surrounding explanation need to say which version is being discussed.

The current public Zapp website is a separate reference. Its desktop marketing presentation was inspected on 5 November 2026; an optional Facebook chat resource failed, and the mobile source had overflow and overlap. That supports a limited static desktop reference, not a successful chat, booking or delivery test.

I would evaluate the design with a parcel-entry task and an exception scenario, following what each person knows and can do next. Delivery estimates, routing, payments and cross-role updates would need separate engineering verification. No task-time, dispatch or business result is available to report here.

Sources: [scoped portfolio case](/project-zapp), [current official site](https://zapp.today/), `site/src/content/portfolio-evidence-images.json` (zapp-account-entry), and `resumed-2026-11-05/zapp-static-reference-review.json`.

Publication blockers: verified project year; independent Figma reacquisition if a new original export is required; final owner editorial review. Do not present current website functionality or delivery outcomes as verified.
