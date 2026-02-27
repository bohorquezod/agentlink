# core

IDE-agnostic domain logic. This module knows nothing about specific IDEs — it operates entirely on the [`IdeAdapter`](../adapters/AGENTS.md) interface and the `FileSystem` abstraction.

> Parent: [src/AGENTS.md](../AGENTS.md) | Project root: [AGENTS.md](../../AGENTS.md)

**See also:**
- [../adapters/AGENTS.md](../adapters/AGENTS.md) — The `IdeAdapter` interface that `mapper.ts` consumes
- [../commands/AGENTS.md](../commands/AGENTS.md) — `syncCommand` orchestrates the pipeline defined here
- [../../test-e2e/AGENTS.md](../../test-e2e/AGENTS.md) — E2E tests that validate this logic with real filesystems

## Files

| File | Exports | Purpose |
|------|---------|---------|
| `types.ts` | `LinkMapping`, `SourceItems`, `StoredMapping`, `TargetState`, `SyncState`, `SyncResult` | All shared data contracts. No logic. |
| `fs.ts` | `FileSystem`, `FsStats`, `nodeFs` | Abstraction over `node:fs/promises`. Every file operation in the project goes through `FileSystem`. `nodeFs` is the real implementation; unit tests use `MockFs` from `@test/helpers/mock-fs`. |
| `scanner.ts` | `scanSourceDir(fs, sourceDir)` | Recursively walks the source directory. Returns `SourceItems` with files grouped by category (rootDocs, skills, agents, commands). Ignores dotfiles. Throws if source dir doesn't exist. |
| `mapper.ts` | `computeMappings(projectRoot, sourceDir, items, adapter)` | Transforms `SourceItems` into `LinkMapping[]` using an adapter's target definitions. Iterates `CATEGORY_KEYS` (`skills`, `agents`, `commands`) and skips any the adapter doesn't define. Applies optional `transform` on filenames. |
| `linker.ts` | `createSymlinks(fs, mappings)`, `removeSymlinks(fs, targets)` | Creates individual symlinks with relative paths. Idempotent — if a symlink already points to the correct source, it's skipped. If target exists as a regular file, it's reported as an error (never overwritten). |
| `reconciler.ts` | `reconcileStaleLinks(fs, projectRoot, previousMappings, currentMappings)` | Compares previous stored mappings against current desired mappings. Any target present in previous but absent in current is deleted if it's a symlink. |
| `state.ts` | `loadState`, `saveState`, `hashFile`, `computeStoredMappings`, `hasChanges` | Manages `.agentlink-state.json`. Uses SHA-256 hashes to detect file content changes. `hasChanges` compares two `StoredMapping[]` arrays by source, target, and hash. |
| `scaffold.ts` | `scaffoldSourceDir(fs, sourceDir)` | Creates the initial directory structure (AGENTS.md + category subdirectories). Idempotent — never overwrites existing files. |

## Sync pipeline

The [`syncCommand`](../commands/AGENTS.md#how-sync-works) in `@commands/sync` orchestrates these modules in order:

```
scanSourceDir → computeMappings → loadState → hasChanges?
                                                  │
                                    yes / --force  │  no
                                         ↓         ↓
                              reconcileStaleLinks  return skipped
                                         ↓
                                   createSymlinks
                                         ↓
                                      saveState
```

## Rules

- Never import `node:fs` directly. Use the `FileSystem` parameter.
- Functions are pure pipelines: data in → data out. Side effects (disk I/O) are isolated behind `FileSystem`.
- When adding a new category (beyond skills/agents/commands), update `CATEGORY_KEYS` in `mapper.ts`, `CATEGORIES` in `scaffold.ts`, and `SourceItems` in `types.ts`.
- Unit tests go in `__tests__/` using `MockFs`. Each function has its own `describe` block.
