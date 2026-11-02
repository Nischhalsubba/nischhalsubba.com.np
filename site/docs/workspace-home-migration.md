# Workspace homepage — November 2026

The owner approved replacing the homepage with the workspace-style design developed in Sites. The previous production commit is preserved in `backup/pre-workspace-redesign-2026-11-02` at `bce8bf1f1add59cd68e29c23f170247948da2158`.

Canonical new homepage source is `src/workspace-home/`. Its assets are isolated under `/workspace-home/`; existing case studies, writing, service pages and the protected `/contact` endpoint retain their current sources and routes. The homepage brief opens the visitor's mail app; the existing contact route continues to provide first-party submission.

The historical build pipeline still composes and validates retained editorial pages. `install-workspace-home.cjs` is the final homepage owner, after legacy transformations, and is safe to run twice. `write-build-metadata.cjs` runs after installation so production lineage remains verifiable. The new source does not depend on Sites identity or its private gate.

`validate:legacy` preserves the prior full validation suite against the retained baseline. `validate` then installs the new homepage and checks its actual final output with the new homepage audit and route smoke tests. Legacy-only browser theme/menu/button assertions apply to retained pages; the workspace homepage has its own browser contract because it has a different toolbar, motion system and intentionally dark appearance.

This approved design supersedes the earlier hero-only visual invariants in deployment-safety.md. It uses the supplied résumé's 7+ years and Kathmandu wording, the owner's existing portrait, 14 case studies, certifications instead of unverified testimonials, and custom quotes instead of invented prices.
