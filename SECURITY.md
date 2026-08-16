# Security Policy

## Supported version

Security fixes are applied to the current `main` branch and the production portfolio release verified from it.

## Reporting a vulnerability

Do not open a public issue for suspected vulnerabilities, exposed credentials, contact-form abuse paths, or privacy-sensitive findings.

Use GitHub's private vulnerability reporting feature when available. If private reporting is unavailable, contact the repository owner privately through the contact information on the GitHub profile.

Do not include real credentials, personal data, or destructive proof-of-concept material in reports.

## Repository security baseline

Maintained releases are expected to pass lockfile-backed dependency installation, an npm audit with no accepted known vulnerabilities, CodeQL analysis, the portfolio's repository/build/SEO/accessibility/provenance audits, deterministic-build checks, browser audits, and production smoke verification. GitHub Actions use least-privilege permissions and immutable third-party Action pins as workflows are modernized. Cloudflare credentials and runtime secrets must remain outside source control.

A passing automated scan reduces known risk but cannot prove that software is risk-free. New findings are treated as defects and remediated through the normal branch, pull-request, validation, and controlled-production-release process.
