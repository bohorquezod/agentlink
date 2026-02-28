# /publish-npm

Publish the package to npm using a safe, repeatable release sequence.

## Overview

Use this command when code is merged, versioning is ready, and you want to publish a new npm package version.

## Steps

1. Load environment variables from `.env` without printing secret values:
   - `set -a && source .env && set +a`
   - Do not read, echo, or log `.env` contents.
2. Validate release readiness:
   - `npm run build`
   - `npm run lint`
   - `npm run test:all`
3. Confirm package metadata and version:
   - `npm pkg get name version`
   - Ensure the version has not already been published.
4. Verify npm authentication and target registry:
   - `npm whoami`
   - `npm config get registry`
5. Perform a dry run to inspect publish contents:
   - `npm publish --dry-run`
6. Publish the package:
   - `npm publish --access public`
7. Return published version, dist-tag, and any follow-up actions.

## Checklist

- [ ] Build, lint, and tests pass before publish.
- [ ] `.env` variables were loaded without exposing secret values.
- [ ] Package name and version are correct.
- [ ] npm auth is valid for the intended account.
- [ ] Dry run output was reviewed before final publish.
- [ ] Final publish result (version/tag) is reported.
