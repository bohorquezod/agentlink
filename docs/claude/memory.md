# Claude Code Memory

Source: https://code.claude.com/docs/en/memory

## Overview

Claude Code has two persistent memory systems:

- **Auto memory**: Claude-managed notes saved per project
- **`CLAUDE.md` files**: user/team-authored instructions and conventions

Both are loaded across sessions, with scope and priority rules.

## Memory Types and Scope

| Memory Type | Location | Scope |
| --- | --- | --- |
| Managed policy | System-managed `CLAUDE.md` path | Organization-wide |
| Project memory | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team/project |
| Project rules | `./.claude/rules/*.md` | Team/project, modular |
| User memory | `~/.claude/CLAUDE.md` | Personal, all projects |
| Project local memory | `./CLAUDE.local.md` | Personal, current project |
| Auto memory | `~/.claude/projects/<project>/memory/` | Personal, per project |

More specific memory overrides broader memory.

## Auto Memory

Auto memory stores reusable context discovered by Claude during work, such as:

- project commands and patterns
- debugging insights
- architecture notes
- personal workflow preferences

Typical structure:

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md
├── debugging.md
└── ...
```

Notes:
- Claude automatically loads only the first 200 lines of `MEMORY.md`
- Topic files are loaded on demand
- Auto memory can be toggled with `/memory`, `settings.json`, or `CLAUDE_CODE_DISABLE_AUTO_MEMORY`

## `CLAUDE.md` Imports

`CLAUDE.md` supports file imports with `@path/to/file`.

- Relative paths resolve from the importing file location
- Imports can nest recursively (up to max depth)
- Imports are not evaluated inside code blocks or inline code

Use `CLAUDE.local.md` for private project-specific preferences that should not be committed.

## Memory Loading Behavior

- Claude recursively loads `CLAUDE.md` and `CLAUDE.local.md` from the current directory upward
- Nested memory files in child directories are loaded when files in those subtrees are accessed
- Additional directories (`--add-dir`) can also load memory when enabled by environment configuration

## Modular Rules with `.claude/rules/`

Use `.claude/rules/` for topic-specific rule files instead of one large memory file.

- Supports recursive subdirectories
- Supports `paths` glob filters in YAML frontmatter
- Supports symlinks for shared rules
- User-level rules are available in `~/.claude/rules/`

## Best Practices

- Be specific and actionable
- Organize instructions by topic and headings
- Keep entrypoint memory concise; move details to focused files
- Review and refresh memory as the project evolves

## Related Docs

- Claude Skills: [`docs/claude/skills.md`](./skills.md)
- Claude Agents: [`docs/claude/agents.md`](./agents.md)
- Memory best practices: https://code.claude.com/docs/en/memory#memory-best-practices
