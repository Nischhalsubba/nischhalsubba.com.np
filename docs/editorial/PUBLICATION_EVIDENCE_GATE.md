# Portfolio publication evidence and release gate

> Status: contributor review checklist, not a claim that the product has passed an audit. This document introduces review expectations; it does not change application behavior.

## Why this exists

Prevent unsupported case-study outcomes, broken visual evidence, stale profile claims and indexing regressions.

## Review rules

1. Every case study must distinguish the problem, personal contribution, constraints, decisions, iterations, and outcome. Do not invent metrics: label estimates and qualitative observations explicitly.
2. For each screenshot, record the depicted screen, source project, version/date, redactions, permission to publish and descriptive alternative text. Never replace missing application screens with unrelated stock imagery.
3. Maintain canonical page URL, page title, description, internal navigation, social card and structured-data claims as a consistent set. If a claim cannot be substantiated, remove or qualify it.
4. Reference credential issuers and dates accurately; separate earned certifications from rankings, awards and self-assessments.
5. Confirm that article publication dates, visible author, citations and cross-links refer to the same canonical piece.

## Verification

From repository root: `npm run validate` and `npm run build` (as applicable to the touched content). Inspect built navigation, image aspect ratio, keyboard focus, reduced-motion behavior, social preview, canonical tags and sitemap entries in a browser. Search Console indexing and live deployment must be checked separately; local builds cannot prove them.

## Required evidence in a change request

PR description: affected URLs; before/after claims; primary source links; screenshots with permission status; automated command output; manual mobile/desktop checklist; any remaining unknowns.

## Rollback and incident response

Revert the smallest content or metadata change, invalidate any affected caches, and recheck canonical/internal links. Avoid silently rewriting historical project outcomes.

## Acceptance criteria

- [ ] The change addresses a stated user or maintainer risk.
- [ ] Evidence and source-of-truth references are attached or explicitly marked unavailable.
- [ ] Relevant automated checks are reported with actual outcomes; unrun checks are not marked passing.
- [ ] Negative, failure and recovery states are accounted for.
- [ ] A reviewer can understand what changed, remaining risk and how to revert it.

Document owner: repository maintainers. Review this checklist when workflows, dependencies or public claims materially change.
