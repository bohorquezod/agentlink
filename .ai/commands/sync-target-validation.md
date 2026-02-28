# /sync-target-validation

Validate agentlink sync behavior for one or more targets end-to-end.

## Overview

Use this command when changing adapters, mapping logic, or docs/skills/agents/commands structure.

## Steps

1. Confirm target(s) to validate (for example: `cursor`, `claude`, `opencode`, `windsurf`, `codex`).
2. Run `ag sync <target>` and verify expected symlinks are created in target directories.
3. Re-run `ag sync <target>` to confirm incremental no-op behavior when nothing changed.
4. Modify one source artifact in `.ai/` and run sync again to confirm targeted updates.
5. Run `ag doctor` and report any broken or stale link issues.

## Checklist

- [ ] Initial sync creates expected links.
- [ ] Second sync is no-op when inputs are unchanged.
- [ ] Incremental update modifies only affected mappings.
- [ ] `ag doctor` reports healthy state or actionable errors.
- [ ] Any target-specific deviations are documented.
