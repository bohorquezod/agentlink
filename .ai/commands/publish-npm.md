# /publish-npm

Publish the package to npm using a safe, repeatable release sequence.

## Overview

Use this command when code is merged, versioning is ready, and you want to publish a new npm package version.

## Steps

1. Validate release readiness:
   - `npm run build`
   - `npm run lint`
   - `npm run test:all`
2. Confirm package metadata and version:
   - `npm pkg get name version`
   - Ensure the version has not already been published.
3. Verify npm authentication and target registry:
   - `npm whoami`
   - `npm config get registry`
4. Perform a dry run to inspect publish contents:
   - `npm publish --dry-run`
5. Publish the package:
   - `npm publish --access public`
6. Return published version, dist-tag, and any follow-up actions.

## Checklist

- [ ] Build, lint, and tests pass before publish.
- [ ] Package name and version are correct.
- [ ] npm auth is valid for the intended account.
- [ ] Dry run output was reviewed before final publish.
- [ ] Final publish result (version/tag) is reported.
