# agentlink

Manage symlinks from a single `.ai` folder to multiple agentic IDE configurations. Write your AI instructions once, link them everywhere.

## Why

Every agentic IDE (Claude Code, Cursor, Codex, OpenCode, Windsurf, ...) expects its configuration in a different location. `agentlink` lets you keep a **single source of truth** in `.ai/` and automatically creates granular symlinks to each IDE's expected paths.

- **Granular linking** -- each file (skill, agent, command, root doc) is linked individually, not as a bulk folder copy.
- **Incremental sync** -- file hashes are tracked so re-running the command is a no-op when nothing changed. Safe for git hooks (e.g. husky).
- **Stale link cleanup** -- renamed or deleted sources automatically remove their old symlinks on the next sync.
- **Extensible** -- built-in adapters for the major IDEs, plus support for custom targets via the programmatic API.

## Install

```bash
# Global install (recommended)
npm install -g agentlink

# Or run without installing
npx agentlink <command>
```

After installing globally, both `agentlink` and `ag` are available as CLI commands.

## Quick Start

```bash
# 1. Initialize the .ai directory
ag init

# 2. Add your content to .ai/
#    (see "Recommended .ai structure" below)

# 3. Sync to your IDE
ag claude          # creates symlinks for Claude Code
ag cursor          # creates symlinks for Cursor
ag codex           # creates symlinks for Codex

# 4. Check health
ag doctor
```

## Commands

| Command | Description |
|---------|-------------|
| `ag init` | Create the `.ai` source directory with the recommended structure |
| `ag <target>` | Full sync: detect changes, clean stale links, create new ones |
| `ag sync <target>` | Same as `ag <target>` (explicit form) |
| `ag unlink <target>` | Remove all managed symlinks for a target |
| `ag doctor` | Validate all managed symlinks (healthy, broken, missing) |

### Global Options

| Option | Description |
|--------|-------------|
| `-s, --source <path>` | Use a custom source folder instead of `.ai` |
| `-f, --force` | Force sync even if no changes detected (sync only) |

### Available Targets

Each adapter only links the categories that the IDE actually supports, based on official documentation.

| Target | IDE | Root doc | Skills | Agents | Commands |
|--------|-----|----------|--------|--------|----------|
| `claude` | Claude Code | `CLAUDE.md` | `.claude/skills/` | `.claude/agents/` | `.claude/commands/` |
| `cursor` | Cursor | `.cursor/rules/AGENTS.md` | `.cursor/skills/` | -- | -- |
| `codex` | Codex CLI | `AGENTS.md` | -- | -- | -- |
| `opencode` | OpenCode | `AGENTS.md` | `.opencode/skills/` | `.opencode/agents/` | `.opencode/commands/` |
| `windsurf` | Windsurf | `.windsurf/rules/AGENTS.md` | -- | -- | -- |

Sources: [Claude Code docs](https://docs.claude.com/en/docs/claude-code/plugins), [Cursor docs](https://cursor.com/docs/context/rules), [Codex docs](https://developers.openai.com/codex/guides/agents-md/), [OpenCode docs](https://open-code.ai/docs/en/config), [Windsurf docs](https://windsurf.com/editor/directory).

## Recommended `.ai` Structure

```
.ai/
├── AGENTS.md                      # Main agent instructions (root doc)
├── skills/                        # Reusable skill definitions
│   ├── coding-standards/          # Each skill is a directory
│   │   ├── SKILL.md               #   with SKILL.md as entrypoint
│   │   └── examples/              #   and optional supporting files
│   │       └── sample.md
│   ├── testing/
│   │   └── SKILL.md
│   └── frontend-react/
│       ├── SKILL.md
│       └── reference.md
├── agents/                        # Custom agent definitions
│   ├── code-reviewer.md
│   └── researcher.md
├── commands/                      # Custom slash commands
│   ├── deploy.md
│   └── test-suite.md
└── .agentlink-state.json          # Auto-generated sync state (do not edit)
```

### What goes where

| Folder | Purpose | Example content |
|--------|---------|-----------------|
| `AGENTS.md` | Main instructions for all AI agents | Project description, coding standards, architecture overview |
| `skills/` | Reusable knowledge/skills that agents can reference | Each skill is a directory with a `SKILL.md` entrypoint and optional supporting files |
| `agents/` | Definitions for specialized agents | Code reviewer instructions, research agent prompts (YAML frontmatter + markdown) |
| `commands/` | Custom slash commands the agent can execute | Deployment scripts, test runners, migration helpers |

Nested folders within any category are fully supported. For example, `.ai/skills/coding-standards/SKILL.md` will be linked to `.claude/skills/coding-standards/SKILL.md` (for the Claude target).

> **Note:** Not every IDE supports every category. For example, Codex and Windsurf only use the root doc (`AGENTS.md`). When you sync to a target that doesn't support a category, those files are simply not linked -- no error, no noise.

## How Linking Works

When you run `ag claude`, `agentlink`:

1. **Scans** `.ai/` to discover all files (root docs, skills, agents, commands).
2. **Computes** the expected symlink mapping using the Claude adapter.
3. **Checks** if anything changed since the last sync (via SHA-256 hashes stored in `.agentlink-state.json`).
4. **Removes** stale symlinks from previous syncs that no longer have a source file.
5. **Creates** new symlinks using relative paths.

### Example: Claude Code mapping

```
.ai/AGENTS.md                            →  CLAUDE.md
.ai/skills/coding-standards/SKILL.md     →  .claude/skills/coding-standards/SKILL.md
.ai/skills/coding-standards/examples/    →  .claude/skills/coding-standards/examples/
.ai/agents/reviewer.md                   →  .claude/agents/reviewer.md
.ai/commands/deploy.md                   →  .claude/commands/deploy.md
```

### Example: Cursor mapping

```
.ai/AGENTS.md                            →  .cursor/rules/AGENTS.md
.ai/skills/coding-standards/SKILL.md     →  .cursor/skills/coding-standards/SKILL.md
```

(Cursor does not support agents or commands, so those are skipped.)

### Example: Codex mapping

```
.ai/AGENTS.md                →  AGENTS.md
```

(Codex reads `AGENTS.md` at the project root. Skills, agents, and commands are not supported.)

## Custom Source Folder

If you prefer a different folder name instead of `.ai`:

```bash
ag init --source .my-ai
ag claude --source .my-ai
ag doctor --source .my-ai
```

## Using with Git Hooks

Since `agentlink` is incremental (no-op when nothing changed), it is safe to run on every commit:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "ag claude && ag cursor"
    }
  }
}
```

## Programmatic API

`agentlink` is also usable as a library:

```typescript
import {
  AdapterRegistry,
  syncCommand,
  nodeFs,
} from 'agentlink';

const registry = new AdapterRegistry();

// Register a custom adapter
registry.register({
  id: 'my-ide',
  name: 'My IDE',
  description: 'Custom IDE adapter',
  rootDocs: [{ source: 'AGENTS.md', target: '.myide/instructions.md' }],
  skills: { dir: '.myide/skills' },
});

const result = await syncCommand(
  'my-ide',
  { source: '.ai' },
  process.cwd(),
  nodeFs,
  registry,
);

console.log(result);
// { skipped: false, created: 3, removed: 0, unchanged: 0, errors: [] }
```

## Troubleshooting

### Symlink permission errors on Windows

Windows requires developer mode or elevated permissions to create symlinks. Enable developer mode in Settings > Update & Security > For developers.

### Target exists and is not a symlink

If a target file already exists as a regular file (not a symlink), `agentlink` will skip it and report an error. Remove or rename the file manually, then re-run.

### Stale symlinks after renaming

`agentlink` automatically cleans up stale symlinks when you rename or delete source files. Just run `ag <target>` again -- the old symlink will be removed and the new one created.

### Category not linked for my IDE

Each adapter only links the categories that the IDE officially supports. If you run `ag codex` and your `.ai/skills/` folder isn't linked, that's expected -- Codex only reads `AGENTS.md`. Check the [target table](#available-targets) to see what each IDE supports.

## Development

```bash
git clone <repo-url>
cd agentlink
npm install

# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Run all tests
npm run test:all

# Build
npm run build

# Type check
npm run lint
```

## License

MIT
