# Legacy design files

The active redesign now uses one primary design file:

```txt
assets/styles/portfolio-system.css
```

Older exploratory CSS files are kept in the repository history and may still appear in branch diffs, but they should not be linked, copied, or used by runtime code.

Deprecated design files:

```txt
atelier-zero.css
atelier-fixes.css
apple-atelier.css
apple-pages.css
apple-system-final.css
contrast-qa.css
site-qa-fixes.css
final-polish.css
worldclass.css
open-design-overrides.css
```

The current runtime only loads:

```txt
/assets/styles/portfolio-system.css
```

Before merging this branch, these deprecated files can be deleted from the repo if GitHub file deletion is available. Until then, `scripts/audit-build.cjs` prevents old CSS references from being used in final HTML.
