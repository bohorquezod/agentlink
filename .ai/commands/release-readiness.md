# /release-readiness

Run a pre-release readiness check for quality, risk, and documentation completeness.

## Overview

Use this command before tagging or publishing a new version.

## Steps

1. Confirm working tree is intentional and review pending changes.
2. Run validation suite:
   - `npm run build`
   - `npm run lint`
   - `npm run test:all`
3. Review release impact:
   - Breaking changes
   - New features
   - Migration notes
4. Verify versioning/changelog strategy for the release.
5. Produce a go/no-go recommendation with explicit blockers.

## Checklist

- [ ] Build, lint, and full tests pass.
- [ ] Breaking changes are identified and documented.
- [ ] Changelog/release notes are prepared or updated.
- [ ] Docs are aligned with shipped behavior.
- [ ] Final recommendation is explicit: go or no-go.
