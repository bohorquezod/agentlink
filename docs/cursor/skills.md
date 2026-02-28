# Cursor Agent Skills

Source: https://cursor.com/docs/context/skills

## Overview

Agent Skills is an open standard for extending AI agents with specialized, reusable capabilities. A skill bundles domain knowledge, instructions, and optional executable resources so agents can perform specific tasks more reliably.

Core characteristics:
- **Portable**: works across agents that support the Agent Skills standard
- **Version-controlled**: stored as files and tracked in repositories
- **Actionable**: can include scripts/templates/references that agents execute or consult
- **Progressive**: loads resources on demand to reduce context overhead

## What a Skill Is

A skill is a folder that contains a `SKILL.md` file (required), and may also include auxiliary directories such as `scripts/`, `references/`, and `assets/`.

Minimal structure:

```text
.agents/
└── skills/
    └── my-skill/
        └── SKILL.md
```

Extended structure:

```text
.agents/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        │   ├── deploy.sh
        │   └── validate.py
        ├── references/
        │   └── REFERENCE.md
        └── assets/
            └── config-template.json
```

## How Skills Work in Cursor

At startup, Cursor discovers available skills from known skill directories and exposes them to Agent. Agent decides when a skill is relevant and can also be explicitly invoked via `/skill-name`.

## Skill Discovery Directories

Primary directories:

| Location | Scope |
| --- | --- |
| `.agents/skills/` | Project-level |
| `.cursor/skills/` | Project-level |
| `~/.cursor/skills/` | User-level (global) |

Compatibility directories:
- `.claude/skills/`
- `.codex/skills/`
- `~/.claude/skills/`
- `~/.codex/skills/`

## `SKILL.md` Format

Each skill is defined using YAML frontmatter plus Markdown instructions:

```markdown
---
name: my-skill
description: Short description of what this skill does and when to use it.
---

# My Skill

Detailed instructions for the agent.

## When to Use
- Use this skill when...

## Instructions
- Step-by-step guidance
- Domain-specific conventions
- Best practices
```

### Frontmatter Fields

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Skill identifier; lowercase letters, numbers, and hyphens only; must match folder name |
| `description` | Yes | Explains purpose and usage conditions; used for relevance routing |
| `license` | No | License string or reference to bundled license file |
| `compatibility` | No | Runtime/environment requirements |
| `metadata` | No | Arbitrary key-value metadata |
| `disable-model-invocation` | No | If `true`, only loaded on explicit `/skill-name` invocation |

## Automatic vs Explicit Invocation

Default behavior:
- Skills are automatically applied when Agent determines relevance

To disable automatic routing:
- Set `disable-model-invocation: true`
- Skill behaves more like a slash-command-only action

## Using Scripts Inside Skills

Skills can ship executable scripts under `scripts/` and reference them from `SKILL.md` with relative paths.

Example:

```markdown
Run deployment: `scripts/deploy.sh <environment>`
Run validation: `python scripts/validate.py`
```

Implementation guidance:
- Keep scripts self-contained
- Include clear failure messages
- Handle edge cases gracefully

## Optional Skill Directories

| Directory | Purpose |
| --- | --- |
| `scripts/` | Executable logic the agent may run |
| `references/` | Supplemental docs loaded on demand |
| `assets/` | Static resources (templates, data, media) |

Keep `SKILL.md` concise; move heavy details into `references/` to preserve context efficiency.

## Viewing Skills in Cursor

To inspect discovered skills:
1. Open Cursor Settings (`Cmd+Shift+J` on macOS, `Ctrl+Shift+J` on Windows/Linux)
2. Go to `Rules`
3. Check the `Agent Decides` section

## Installing Skills from GitHub

From Cursor Settings:
1. Open `Rules`
2. In `Project Rules`, click `Add Rule`
3. Choose `Remote Rule (Github)`
4. Enter the repository URL

## Migrating Rules and Commands to Skills

Cursor 2.4 includes a built-in `/migrate-to-skills` helper for converting:

- **Dynamic rules** (`alwaysApply: false` or unset, and no `globs`) into standard skills
- **Slash commands** (user/workspace) into skills with `disable-model-invocation: true`

Migration flow:
1. Run `/migrate-to-skills` in Agent chat
2. Let Agent convert eligible rules/commands
3. Review output in `.cursor/skills/`

Not migrated:
- Rules with `alwaysApply: true`
- Rules that use explicit `globs`
- User rules not represented on the filesystem

## Learn More

- Cursor docs: https://cursor.com/docs/context/skills
- Agent Skills standard: https://agentskills.io/
