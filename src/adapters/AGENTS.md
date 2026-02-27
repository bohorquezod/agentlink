# adapters

IDE-specific mapping definitions. This module defines the `IdeAdapter` interface and the registry that manages adapters.

> Parent: [src/AGENTS.md](../AGENTS.md) | Project root: [AGENTS.md](../../AGENTS.md)

**See also:**
- [builtins/AGENTS.md](builtins/AGENTS.md) — Per-IDE adapter definitions, current adapter table, and how to add new ones
- [../core/AGENTS.md](../core/AGENTS.md) — `mapper.ts` consumes `IdeAdapter` to produce `LinkMapping[]`
- [../commands/AGENTS.md](../commands/AGENTS.md) — Commands that use `AdapterRegistry` to resolve targets

## Files

| File | Exports | Purpose |
|------|---------|---------|
| `types.ts` | `IdeAdapter`, `RootDocMapping`, `CategoryTarget` | Contracts for adapter definitions. `IdeAdapter` declares which categories an IDE supports and where they map to. |
| `registry.ts` | `AdapterRegistry` | Lookup service for adapters. Auto-registers all builtins on construction. Supports `register()` for custom adapters (programmatic API). |
| `builtins/` | Individual adapter constants | One file per supported IDE. See [builtins/AGENTS.md](builtins/AGENTS.md) for details. |

## The `IdeAdapter` interface

```typescript
interface IdeAdapter {
  id: string;                    // CLI target name (e.g. 'claude')
  name: string;                  // Human-readable name
  description: string;           // Short description
  rootDocs: RootDocMapping[];    // Required — maps source doc to target path
  skills?: CategoryTarget;       // Optional — { dir, transform? }
  agents?: CategoryTarget;       // Optional
  commands?: CategoryTarget;     // Optional
}
```

Key design decisions:
- `rootDocs` is an array of `{ source, target }` pairs, allowing adapters to rename files (e.g. `AGENTS.md` → `CLAUDE.md`).
- Category targets are optional. If an adapter omits `skills`, the [mapper](../core/AGENTS.md) silently skips all skill files for that target.
- `CategoryTarget.transform` is an optional function that renames individual files (e.g. `.md` → `.mdc`). Currently unused but available for future adapters.

## `AdapterRegistry`

- Constructed with all builtins pre-registered.
- `get(id)` returns `IdeAdapter | undefined`.
- `has(id)` checks existence.
- `list()` returns all adapters, `ids()` returns all string IDs.
- Custom adapters can be added via `register(adapter)` for the programmatic API.

## Rules

- Adapters are **purely declarative**. No logic, no conditionals, no side effects. All linking behavior lives in `@core/`.
- Each adapter file exports a single `const` implementing `IdeAdapter`.
- Always verify adapter mappings against official IDE documentation before adding or modifying.
- Unit tests in `__tests__/` validate that every builtin has required fields and produces valid mappings.
