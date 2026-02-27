# commands

CLI command implementations. Each file exports a single async function that performs one user-facing operation.

> Parent: [src/AGENTS.md](../AGENTS.md) | Project root: [AGENTS.md](../../AGENTS.md)

**See also:**
- [../core/AGENTS.md](../core/AGENTS.md) — Domain logic that commands orchestrate (scanner, mapper, linker, reconciler, state)
- [../adapters/AGENTS.md](../adapters/AGENTS.md) — `AdapterRegistry` used by sync, unlink, and doctor commands
- [../../test-e2e/AGENTS.md](../../test-e2e/AGENTS.md) — E2E tests that exercise these commands end-to-end

## Files

| File | Command | Signature |
|------|---------|-----------|
| `init.ts` | `ag init` | `initCommand(options, projectRoot, fs)` |
| `sync.ts` | `ag sync <target>` / `ag <target>` | `syncCommand(target, options, projectRoot, fs, registry)` |
| `unlink.ts` | `ag unlink <target>` | `unlinkCommand(target, options, projectRoot, fs, registry)` |
| `doctor.ts` | `ag doctor` | `doctorCommand(options, projectRoot, fs, registry)` |

## Design pattern

All commands follow the same pattern:

1. **Parameters via dependency injection** — every command receives [`FileSystem`](../core/AGENTS.md) and [`AdapterRegistry`](../adapters/AGENTS.md) as arguments, never as module-level imports. This makes them fully testable with `MockFs`.
2. **Options as a typed interface** — each command defines its own options interface (`InitOptions`, `SyncOptions`, etc.) with `source: string` as a common field.
3. **Return a result object** — commands return structured data (not just print to console). The CLI layer in `cli.ts` handles formatting output.
4. **Throw on invalid input** — unknown target IDs throw with a list of available targets.

## How `sync` works

`sync.ts` is the most complex command. It orchestrates the full pipeline:

1. Resolve adapter from [registry](../adapters/AGENTS.md)
2. [Scan](../core/AGENTS.md) source directory → `SourceItems`
3. [Compute](../core/AGENTS.md) desired mappings → `LinkMapping[]`
4. Load previous state from `.agentlink-state.json`
5. Compute current stored mappings (with SHA-256 hashes)
6. If no changes and `--force` not set → return `skipped: true`
7. [Reconcile](../core/AGENTS.md) stale links (remove orphaned symlinks from prior syncs)
8. [Create](../core/AGENTS.md) new symlinks
9. [Save](../core/AGENTS.md) updated state

## Rules

- Import domain logic from `@core/*`, adapters from `@adapters/*`. Never reach into another command.
- Keep console output in `cli.ts` when possible. Commands may use `console.log` for user-facing messages but should always return structured results.
- Unit tests go in `__tests__/`. The sync command test uses `MockFs` with `setupProject()` to simulate a full project.
- When adding a new command: create the file here, add the Commander route in `cli.ts`, add it to `KNOWN_COMMANDS` in `cli.ts`, re-export from `index.ts`, and update `README.md`.
