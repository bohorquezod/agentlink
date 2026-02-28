# /create-github-release

Create a GitHub release with clear notes, traceable changes, and correct tag/version alignment.

## Overview

Use this command after publishing to npm (or immediately before, if your flow requires tag-first release management).

## Steps

1. Confirm branch and tag strategy for the release version.
2. Ensure local and remote are synchronized:
   - `git fetch --tags`
   - `git status`
3. Create or verify the release tag (if missing):
   - `git tag -a vX.Y.Z -m "vX.Y.Z"`
   - `git push origin vX.Y.Z`
4. Build release notes from merged PRs and key changes:
   - Features
   - Fixes
   - Breaking changes
   - Migration notes (if any)
5. Create the GitHub release using `gh`:
   - `gh release create vX.Y.Z --title "vX.Y.Z" --notes-file <notes-file>`
6. Return the release URL and a short post-release checklist.

## Checklist

- [ ] Tag matches intended package version.
- [ ] Release notes include user impact, not only implementation details.
- [ ] Breaking changes and migration notes are explicit.
- [ ] Release created successfully in GitHub.
- [ ] Release URL is returned.
