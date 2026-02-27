# src

All production source code for agentlink. This directory is the `rootDir` for TypeScript compilation and the entry point for tsup bundling.

> Parent: [AGENTS.md](../AGENTS.md) — Project-wide overview, aliases, and coding conventions

## Detailed module docs

- [core/AGENTS.md](core/AGENTS.md) — Domain logic files, sync pipeline, and rules
- [adapters/AGENTS.md](adapters/AGENTS.md) — IdeAdapter interface, AdapterRegistry, design decisions
- [adapters/builtins/AGENTS.md](adapters/builtins/AGENTS.md) — Per-IDE adapter table and how to add new ones
- [commands/AGENTS.md](commands/AGENTS.md) — Command design pattern, sync flow, and how to add new commands
- [../test-e2e/AGENTS.md](../test-e2e/AGENTS.md) — E2E tests (real filesystem operations)

## Module map

```
src/
├── cli.ts              # CLI entry point — Commander.js setup, argument routing
├── index.ts            # Public library API — re-exports everything consumers need
├── core/               # Domain logic (IDE-agnostic)
├── adapters/           # IDE-specific mapping definitions
├── commands/           # CLI command implementations
└── __tests__/helpers/  # Shared test utilities (MockFs)
```

## Modules in detail

### `core/` — Domain logic

The core module contains all business logic. It has zero knowledge of specific IDEs — it only operates on the `IdeAdapter` interface.

| File | Responsibility |
|------|---------------|
| `types.ts` | Data contracts: `LinkMapping`, `SourceItems`, `SyncState`, `SyncResult`, `StoredMapping` |
| `fs.ts` | `FileSystem` interface (abstraction over `node:fs`) and `nodeFs` (real implementation). All file I/O across the codebase goes through this interface. |
| `scanner.ts` | Recursively walks the `.ai/` directory and returns `SourceItems` — lists of files per category (rootDocs, skills, agents, commands). Ignores dotfiles. |
| `mapper.ts` | Takes `SourceItems` + an `IdeAdapter` and produces `LinkMapping[]` — the exact source→target pairs for symlink creation. Iterates `CATEGORY_KEYS` and skips categories the adapter doesn't support. |
| `linker.ts` | `createSymlinks()` — creates individual symlinks with relative paths, idempotent (skips if symlink already points to the right source). `removeSymlinks()` — safely removes symlinks by path. |
| `reconciler.ts` | Compares previous `StoredMapping[]` against current `LinkMapping[]` to find targets that no longer have a source, then removes those stale symlinks. |
| `state.ts` | Manages `.agentlink-state.json`: load/save, SHA-256 file hashing (`hashFile`), mapping comparison (`hasChanges`), and `computeStoredMappings` for converting absolute mappings to relative+hashed form. |
| `scaffold.ts` | Creates the initial `.ai/` directory structure (`AGENTS.md`, `skills/`, `agents/`, `commands/`). Idempotent — never overwrites existing files. |

#### Sync pipeline (executed by `commands/sync.ts`)

```
scanSourceDir → computeMappings → loadState → hasChanges?
    ↓ (if changed or --force)
reconcileStaleLinks → createSymlinks → saveState
```

### `adapters/` — IDE-specific configuration

Adapters are purely declarative — they define data, not behavior. All linking logic lives in `core/`.

| File | Responsibility |
|------|---------------|
| `types.ts` | `IdeAdapter`, `RootDocMapping`, `CategoryTarget` interfaces. An adapter declares `rootDocs` (required) and optional category targets (`skills`, `agents`, `commands`). |
| `registry.ts` | `AdapterRegistry` class — a `Map<string, IdeAdapter>` that auto-registers all builtins on construction. Supports `register()` for custom adapters. |
| `builtins/index.ts` | Aggregates and exports the `builtinAdapters` array. |
| `builtins/<ide>.ts` | One file per IDE. Each exports a single `IdeAdapter` constant. |

To add a new IDE: create a new file in `builtins/`, define the adapter, import it in `builtins/index.ts`, and add it to the array.

### `commands/` — CLI command logic

Each command is an async function that receives its options, `projectRoot`, `FileSystem`, and `AdapterRegistry` as parameters (dependency injection). The CLI layer in `cli.ts` handles argument parsing and wiring.

| File | Command | What it does |
|------|---------|-------------|
| `init.ts` | `ag init` | Scaffolds the source directory via `scaffoldSourceDir` |
| `sync.ts` | `ag sync <target>` / `ag <target>` | Full pipeline: scan → map → check state → reconcile → link → save |
| `unlink.ts` | `ag unlink <target>` | Loads state, removes all managed symlinks for the target, clears state |
| `doctor.ts` | `ag doctor` | Iterates stored mappings and checks each symlink's health (exists, is symlink, points to correct source) |

### `cli.ts` — Entry point

Commander.js setup. Routes unknown first arguments to `sync` (so `ag claude` works as `ag sync claude`). Each command delegates to a function from `commands/`, passing `nodeFs` and a fresh `AdapterRegistry`.

### `index.ts` — Public API

Re-exports everything that external consumers of the `agentlink` npm package need: all types, all core functions, all commands, `AdapterRegistry`, `builtinAdapters`, and `nodeFs`.

## Rules for this directory

- **Always use path aliases** (`@core/`, `@adapters/`, `@commands/`). Never use relative paths that cross module boundaries.
- **Use `import type`** for type-only imports.
- **All filesystem access goes through `FileSystem`**. Never import `node:fs` directly in core/adapters/commands (only `fs.ts` and `cli.ts` touch Node APIs).
- **Adapters are data only**. No logic, no conditionals, no functions beyond optional `transform`.
- **Commands receive dependencies as parameters**. No module-level singletons (enables testing).
- **Tests live in `__tests__/`** next to the code they test. Shared test helpers go in `src/__tests__/helpers/`.
- **Exclude `__tests__/` from production builds**. The tsconfig and tsup configs already handle this.
