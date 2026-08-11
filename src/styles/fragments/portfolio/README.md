# Portfolio style fragments

This folder contains composable CSS source used by the redesigned portfolio shell and final production polish stages.

The fragments are assembled into the repository's single production stylesheet. They are not independent public stylesheets.

Current contents cover the portfolio foundation, components, finishing rules, responsive hardening, sticky/cascade safeguards, visual polish, and compatibility rules retained by the existing build pipeline.

The `.agent-*` selector namespace inside some fragments is a historical DOM compatibility contract. Do not rename individual selectors in isolation. A selector migration must update generated markup, browser runtime modules, stylesheet fragments, and browser/audit checks together.
