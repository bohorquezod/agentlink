# agentlink

Node.js CLI library that generates granular symbolic links from a canonical `.ai/` folder to the configuration directories of multiple agentic IDEs (Claude Code, Cursor, Codex, OpenCode, Windsurf).

## Project overview

- **Language**: TypeScript (strict mode, ES2022 target)
- **Runtime**: Node.js >= 18, ESM (`"type": "module"`)
- **Bundler**: tsup (esbuild-based)
- **Test framework**: Jest with ts-jest (ESM preset)
- **CLI framework**: Commander.js
- **Package manager**: npm

## Related documentation

- [docs/AGENTS.md](docs/AGENTS.md) — Documentation hub conventions for `docs/` indexes and platform guides
- [src/AGENTS.md](src/AGENTS.md) — Source directory overview, module map, and rules
- [src/core/AGENTS.md](src/core/AGENTS.md) — Domain logic: scanner, mapper, linker, reconciler, state, scaffold
- [src/adapters/AGENTS.md](src/adapters/AGENTS.md) — IdeAdapter interface, AdapterRegistry
- [src/adapters/builtins/AGENTS.md](src/adapters/builtins/AGENTS.md) — Per-IDE adapter definitions and how to add new ones
- [src/commands/AGENTS.md](src/commands/AGENTS.md) — CLI command implementations and design pattern
- [test-e2e/AGENTS.md](test-e2e/AGENTS.md) — End-to-end tests, conventions, and when to add them

## Architecture

```
src/
├── cli.ts                     # CLI entry point (Commander setup)
├── index.ts                   # Public library API (re-exports)
├── core/                      # Domain logic (no IDE-specific knowledge)
│   ├── types.ts               # LinkMapping, SourceItems, SyncState, SyncResult
│   ├── fs.ts                  # FileSystem interface + nodeFs implementation
│   ├── scanner.ts             # Recursively scans .ai/ to discover SourceItems
│   ├── mapper.ts              # Converts SourceItems → LinkMapping[] via an adapter
│   ├── linker.ts              # Creates/removes individual symlinks
│   ├── reconciler.ts          # Detects and removes stale symlinks from prior syncs
│   ├── state.ts               # Loads/saves .agentlink-state.json, SHA-256 hashing
│   └── scaffold.ts            # Creates initial .ai/ directory structure
├── adapters/                  # IDE-specific mapping definitions
│   ├── types.ts               # IdeAdapter, RootDocMapping, CategoryTarget interfaces
│   ├── registry.ts            # AdapterRegistry class (lookup by id)
│   └── builtins/              # One file per supported IDE
│       ├── index.ts
│       ├── claude.ts
│       ├── cursor.ts
│       ├── codex.ts
│       ├── opencode.ts
│       └── windsurf.ts
├── commands/                  # CLI command implementations
│   ├── init.ts                # ag init
│   ├── sync.ts                # ag sync <target> (also default for ag <target>)
│   ├── unlink.ts              # ag unlink <target>
│   └── doctor.ts              # ag doctor
└── __tests__/helpers/         # Shared test utilities
    └── mock-fs.ts             # In-memory FileSystem implementation for unit tests
```

Unit tests live in `__tests__/` folders co-located with the code they test (e.g. `src/core/__tests__/scanner.test.ts`). E2E tests live in `test-e2e/` and exercise the full CLI workflow with real filesystem operations.

## Path aliases

All imports use TypeScript path aliases — never deep relative paths like `../../`.

| Alias | Resolves to |
|-------|-------------|
| `@core/*` | `src/core/*` |
| `@adapters/*` | `src/adapters/*` |
| `@commands/*` | `src/commands/*` |
| `@test/*` | `src/__tests__/*` |

Aliases are configured in `tsconfig.json` (paths), `jest.config.ts` (moduleNameMapper), and `tsup.config.ts` (esbuildOptions.alias). When adding a new import, always use the alias form.

## Key design patterns

### FileSystem abstraction
All file operations go through the `FileSystem` interface (`@core/fs`). Production code uses `nodeFs`; unit tests use `MockFs` (`@test/helpers/mock-fs`). Never import `node:fs` directly in core/adapters/commands modules.

### Adapter pattern
Each IDE has a declarative adapter implementing `IdeAdapter`. An adapter declares which categories it supports (rootDocs, skills, agents, commands) and where they map to. Categories the adapter does not define are silently skipped. To add a new IDE, create a file in `src/adapters/builtins/`, export the adapter, and register it in `builtins/index.ts`.

### Incremental sync
The sync pipeline: scan → map → check state → reconcile stale → create links → save state. File hashes (SHA-256) and mappings are persisted in `.agentlink-state.json` so re-runs are no-ops when nothing changed.

### Granular symlinks
Every individual file gets its own symlink. Folders are never symlinked wholesale. This ensures stale links from renamed/deleted files are properly cleaned up.

## Coding conventions

- Use `import type` for type-only imports.
- Always use path aliases (`@core/`, `@adapters/`, `@commands/`, `@test/`), never relative paths that cross module boundaries.
- All async functions return `Promise<T>` — no callbacks.
- Functions that interact with the filesystem take a `FileSystem` parameter (dependency injection), not a global import.
- Keep adapters purely declarative (data, no logic). All linking logic belongs in `@core/`.
- No comments that just narrate what code does. Only document non-obvious intent or constraints.
- All code, documentation, and comments in English.

## Testing guidelines

- **Unit tests**: Co-located in `__tests__/` next to source. Use `MockFs` for filesystem operations. Test names follow `describe('functionName', () => { it('should ...') })`.
- **E2E tests**: In `test-e2e/`. Use real temp directories and `nodeFs`. Validate actual symlink creation, incremental behavior, and stale link cleanup.
- Run `npm test` for unit tests, `npm run test:e2e` for e2e, `npm run test:all` for both.
- When adding a new feature, add unit tests in the corresponding `__tests__/` folder. If it affects CLI behavior, add an e2e test.

## Commands reference

```bash
npm run build          # Bundle with tsup
npm test               # Unit tests (Jest)
npm run test:e2e       # E2E tests (Jest)
npm run test:all       # Both
npm run lint           # TypeScript type check (tsc --noEmit)
```

## Adding a new IDE adapter

1. Create `src/adapters/builtins/<ide>.ts` implementing `IdeAdapter`.
2. Import and add it to the `builtinAdapters` array in `src/adapters/builtins/index.ts`.
3. Add a test case in `src/adapters/__tests__/builtins.test.ts`.
4. Update the CLI help text in `src/cli.ts` (targets list in description).
5. Update `README.md` (available targets table).
