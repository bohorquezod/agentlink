# test-e2e

End-to-end tests that validate the full agentlink CLI workflow using real filesystem operations. These tests create actual temporary directories, write files, invoke commands, and verify that real symlinks are created, cleaned up, and managed correctly.

> Project root: [AGENTS.md](../AGENTS.md)

**See also:**
- [../src/commands/AGENTS.md](../src/commands/AGENTS.md) — The command implementations these tests exercise
- [../src/core/AGENTS.md](../src/core/AGENTS.md) — Domain logic (scanner, linker, reconciler, state) tested indirectly here
- [../src/adapters/builtins/AGENTS.md](../src/adapters/builtins/AGENTS.md) — Adapter definitions that determine expected symlink paths

## How e2e tests differ from unit tests

Unit tests (in `src/**/__tests__/`) use [`MockFs`](../src/core/AGENTS.md) to simulate filesystem operations in memory. E2E tests here use `node:fs/promises` directly against real temp directories in the OS temp folder. This catches issues that mocks cannot: permission errors, symlink resolution behavior, path normalization, and cross-target state persistence.

## Structure

| File | What it tests |
|------|---------------|
| `helpers.ts` | Shared utilities: `createTempDir`, `cleanupTempDir`, `isSymlink`, `pathExists`, `setupAiDir` |
| `init.test.ts` | `ag init` — scaffolding, custom source name, idempotency |
| `sync.test.ts` | `ag sync <target>` — granular symlinks per IDE, stale link cleanup on rename/delete, custom source dir |
| `incremental.test.ts` | Incremental behavior — skip when unchanged, detect content/file changes, multi-target independence |
| `unlink.test.ts` | `ag unlink <target>` — remove managed symlinks, cross-target isolation, no-op on fresh state |

## Conventions

### Test lifecycle
Every test creates a fresh temp directory via `createTempDir()` and cleans it up in `afterEach` via `cleanupTempDir()`. Tests never share state or directories.

### Setting up a project
Use `setupAiDir(tmpDir)` from `helpers.ts` to create a realistic `.ai/` directory with sample files across all categories (AGENTS.md, skills, agents, commands). Pass a second argument to use a custom source folder name.

### Imports
Use path aliases for project code (`@core/fs`, `@adapters/registry`, `@commands/sync`). Use relative imports (`./helpers.js`) only for the local helpers file within this folder.

### Assertions
- Use `isSymlink(path)` to verify a symlink was created (checks `lstat().isSymbolicLink()`).
- Use `pathExists(path)` to verify a file or symlink exists at a path.
- Read symlink content with `fs.readFile` to verify it resolves to the correct source.
- Check `result.skipped`, `result.created`, `result.removed` from command return values to verify sync behavior.

### When to add a new e2e test
Add an e2e test when:
- A new CLI command is added (create a new `<command>.test.ts`).
- A bug is found that involves real filesystem behavior (symlink resolution, directory creation, state file I/O).
- Adapter changes affect the actual paths where symlinks land.

Do NOT add e2e tests for pure logic (mapping computation, hash comparison, registry lookup) — those belong in unit tests.

## Running

```bash
npm run test:e2e       # Run only e2e tests
npm run test:all       # Run unit + e2e together
```

Config: `jest.e2e.config.ts` (30s timeout, `tsconfig.test.json`).
