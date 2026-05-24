# Security Policy

## Reporting a vulnerability

These templates are starting points — they are not, on their own, in scope for
runtime security guarantees. **Runtime / engine vulnerabilities should be
reported against [`objectstack-ai/framework`](https://github.com/objectstack-ai/framework).**

If you find a vulnerability **specific to a template** in this repo (e.g. an
insecure-by-default permission, an exposed admin path, a leaky seed dataset),
report it privately:

- Email: **security@objectstack.ai**
- Or use GitHub's "Report a vulnerability" button on this repo

Please do **not** open a public issue. We'll acknowledge within 3 business days
and aim to ship a fix or mitigation within 14 days for high-severity reports.

## Supported versions

Only `main` is supported. Templates are evergreen scaffolds — fixes ship to
`main` and users re-scaffold.
