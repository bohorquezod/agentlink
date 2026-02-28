# OpenCode Agent Skills

Source: https://opencode.ai/docs/es/skills/

## Overview

OpenCode Agent Skills define reusable behavior in `SKILL.md` files. Skills are discovered from configured locations and loaded on demand through the native `skill` tool.

At runtime, agents see a list of available skills (name + description) and can load full content only when needed.

## Skill File Placement

Create one folder per skill and place `SKILL.md` inside:

- Project OpenCode: `.opencode/skills/<name>/SKILL.md`
- Global OpenCode: `~/.config/opencode/skills/<name>/SKILL.md`
- Claude-compatible project: `.claude/skills/<name>/SKILL.md`
- Claude-compatible global: `~/.claude/skills/<name>/SKILL.md`
- Agent Skills project: `.agents/skills/<name>/SKILL.md`
- Agent Skills global: `~/.agents/skills/<name>/SKILL.md`

## Discovery Behavior

For project-local paths, OpenCode walks upward from current working directory to the git worktree root and loads matching skills along the path from:

- `.opencode/skills/*/SKILL.md`
- `.claude/skills/*/SKILL.md`
- `.agents/skills/*/SKILL.md`

Global definitions are also loaded from the corresponding home-directory paths.

## Required Frontmatter

Each `SKILL.md` must start with YAML frontmatter. Recognized fields:

- `name` (required)
- `description` (required)
- `license` (optional)
- `compatibility` (optional)
- `metadata` (optional string-to-string map)

Unknown fields are ignored.

## Name Validation Rules

`name` must:

- be 1–64 characters
- use lowercase alphanumeric tokens separated by single hyphens
- not start/end with `-`
- not contain `--`
- match the containing directory name

Regex equivalent:

```text
^[a-z0-9]+(-[a-z0-9]+)*$
```

## Description Rules

`description` must be 1–1024 characters. Keep it specific so agents can choose the correct skill.

## Example Skill

Path: `.opencode/skills/git-release/SKILL.md`

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do
- Draft release notes from merged PRs
- Propose a version bump
- Provide a copy-pasteable `gh release create` command

## When to use me
Use this when preparing a tagged release.
Ask clarifying questions if the versioning scheme is unclear.
```

## Skill Tool Exposure

Available skills are exposed in the `skill` tool description, typically as name/description pairs:

```text
<available_skills>
  <skill>
    <name>git-release</name>
    <description>Create consistent releases and changelogs</description>
  </skill>
</available_skills>
```

Loading a skill:

```text
skill({ name: "git-release" })
```

## Permission Controls

Control skill access via pattern-based permissions in `opencode.json`:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

Permission behaviors:

- `allow`: load immediately
- `deny`: hidden from agent, access rejected
- `ask`: user approval required before loading

Wildcard patterns are supported (for example, `internal-*`).

## Per-Agent Overrides

You can override global skill permissions per agent.

Custom agent frontmatter:

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

Built-in agent override in `opencode.json`:

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

## Disable Skills Tool

Disable skill usage entirely for specific agents.

Custom agent frontmatter:

```yaml
---
tools:
  skill: false
---
```

Built-in agent config:

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

When disabled, `<available_skills>` is omitted from context.

## Troubleshooting

If a skill does not appear:

1. Confirm filename is exactly `SKILL.md` (uppercase)
2. Ensure frontmatter includes both `name` and `description`
3. Check for duplicate skill names across all discovery locations
4. Verify permission rules (`deny` hides skills)

## Practical Recommendations

- Keep names concise and stable
- Write high-signal descriptions for better routing
- Use global scopes for personal reusable skills, project scopes for repo-specific workflows
- Prefer explicit permission patterns for internal/experimental skills
- Keep `SKILL.md` focused; move long references to companion files when needed
