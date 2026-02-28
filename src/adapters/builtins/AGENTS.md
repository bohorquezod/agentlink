# builtins

One file per supported IDE. Each exports a single [`IdeAdapter`](../AGENTS.md) constant. All are aggregated in `index.ts` as the `builtinAdapters` array.

> Parent: [adapters/AGENTS.md](../AGENTS.md) | Project root: [AGENTS.md](../../../AGENTS.md)

**See also:**
- [../AGENTS.md](../AGENTS.md) — `IdeAdapter` interface definition and `AdapterRegistry`
- [../../core/AGENTS.md](../../core/AGENTS.md) — `mapper.ts` uses these adapters to compute symlink mappings
- [../../../test-e2e/AGENTS.md](../../../test-e2e/AGENTS.md) — E2E tests validate actual symlinks produced by each adapter

## Current adapters

| File | ID | Root doc target | Skills | Agents | Commands | Source |
|------|----|----------------|--------|--------|----------|--------|
| `claude.ts` | `claude` | `CLAUDE.md` | `.claude/skills/` | `.claude/agents/` | `.claude/commands/` | [Claude Code docs](https://docs.claude.com/en/docs/claude-code/slash-commands) |
| `cursor.ts` | `cursor` | `AGENTS.md` | `.cursor/skills/` | `.cursor/agents/` | `.cursor/commands/` | [Cursor docs](https://cursor.com/docs/context/rules) |
| `codex.ts` | `codex` | `AGENTS.md` | — | — | — | [Codex docs](https://developers.openai.com/codex/guides/agents-md/) |
| `opencode.ts` | `opencode` | `AGENTS.md` | `.opencode/skills/` | `.opencode/agents/` | `.opencode/commands/` | [OpenCode docs](https://open-code.ai/docs/en/config) |
| `windsurf.ts` | `windsurf` | `.windsurf/rules/AGENTS.md` | — | — | — | [Windsurf docs](https://windsurf.com/editor/directory) |

A dash (—) means the adapter does not define that category. The [mapper](../../core/AGENTS.md) skips it silently.

## Adding a new adapter

1. Create `<ide>.ts` in this folder:

```typescript
import type { IdeAdapter } from '@adapters/types';

export const myIdeAdapter: IdeAdapter = {
  id: 'my-ide',
  name: 'My IDE',
  description: 'My IDE description',
  rootDocs: [{ source: 'AGENTS.md', target: '.myide/AGENTS.md' }],
  skills: { dir: '.myide/skills' },
  // omit agents/commands if the IDE doesn't support them
};
```

2. Import and add it to the `builtinAdapters` array in `index.ts`.
3. Add a row to the table above.
4. Add a test case in `src/adapters/__tests__/builtins.test.ts` — the loop test covers required fields automatically, but add a specific test if the adapter has unique mapping behavior.
5. Update `README.md` (available targets table) and `AGENTS.md` at the project root.

## Rules

- Every field must match the IDE's official documentation. Do not guess paths.
- Only define categories (`skills`, `agents`, `commands`) that the IDE actually supports as symlinkable directories.
- `rootDocs` always maps `AGENTS.md` as the source. The target varies per IDE (e.g. `CLAUDE.md`, `AGENTS.md`).
- Keep adapters minimal — a single `const` export with no logic.
