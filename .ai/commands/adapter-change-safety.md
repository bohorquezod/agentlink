# /adapter-change-safety

Apply a safety protocol for changes under `src/adapters/` and related mappings.

## Overview

Use this command before merging any adapter mapping change.

## Steps

1. Review modified adapter files and classify change type:
   - New adapter
   - Path mapping change
   - Category support change (`skills`, `agents`, `commands`)
2. Verify alignment with official platform documentation (no guessed paths).
3. Update adapter tests (at minimum `src/adapters/__tests__/builtins.test.ts` coverage impact).
4. Validate end-to-end behavior with relevant sync/unlink e2e scenarios.
5. Update docs that expose target capabilities (`README.md`, adapter docs, platform docs).

## Checklist

- [ ] Mapping changes are traceable to official docs.
- [ ] Unit tests for adapter behavior are updated.
- [ ] E2E coverage for symlink behavior is updated when needed.
- [ ] Public docs and capability tables are aligned.
- [ ] Backward-compatibility risks are called out.
