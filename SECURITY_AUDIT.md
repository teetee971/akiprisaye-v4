# Security Audit – akiprisaye-web

Date: 2026-01-26

## Summary
npm audit reports 10 vulnerabilities:
- 2 high
- 4 moderate
- 4 low

## High severity analysis

### @capacitor/cli → tar
- Scope: development / build tooling only
- Not bundled in production
- Not exposed to browser runtime
- Exploit requires malicious local archive execution

Risk accepted temporarily.

## Moderate severity
- vite / vitest / esbuild
- Fix requires major version upgrades
- Migration planned, not applied to avoid breaking changes

## Conclusion
No known exploitable vulnerabilities in production runtime.