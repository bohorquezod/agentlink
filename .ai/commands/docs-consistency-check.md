# /docs-consistency-check

Audit documentation consistency against current implementation and workflows.

## Overview

Use this command when code changes might invalidate docs or when preparing a PR.

## Steps

1. Identify changed behavior, supported targets, or workflow updates in current diff.
2. Verify consistency across:
   - `README.md`
   - Root `AGENTS.md`
   - `docs/` index files and platform-specific docs
3. Ensure docs use repository-relative links and avoid duplicated platform details in indexes.
4. Update stale statements, tables, and examples to match actual behavior.
5. Return a short "docs changed / docs verified" report.

## Checklist

- [ ] User-facing behavior changes are reflected in docs.
- [ ] Supported targets and capabilities are accurate.
- [ ] Navigation/index docs point to correct platform files.
- [ ] Examples/commands are executable as written.
- [ ] No contradictory statements remain across docs.
