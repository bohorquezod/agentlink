# Claude Code Skills

Source: https://code.claude.com/docs/en/skills

## Overview

Skills extend Claude Code with reusable capabilities packaged as files. Each skill is a directory with a `SKILL.md` entrypoint that contains YAML frontmatter and markdown instructions.

Skills can be:
- Auto-invoked by Claude when relevant
- Manually invoked by users via `/skill-name`

Custom slash commands are unified with skills. Legacy `.claude/commands/*.md` still works, but `.claude/skills/*/SKILL.md` is the preferred format.

## Skill Basics

Minimum structure:

```text
.claude/skills/
  my-skill/
    SKILL.md
```

Expanded structure:

```text
my-skill/
├── SKILL.md
├── reference.md
├── examples/
│   └── sample.md
└── scripts/
    └── helper.sh
```

`SKILL.md` is required. Supporting files are optional and should be referenced from `SKILL.md`.

## Where Skills Live

| Scope | Path | Applies To |
| --- | --- | --- |
| Enterprise | Managed settings | Organization-wide |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | Current project |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Plugin-enabled contexts |

Precedence for duplicate names: `enterprise > personal > project`.  
Plugin skills use namespacing (`plugin-name:skill-name`) to avoid collisions.

Claude also auto-discovers nested `.claude/skills/` directories in subfolders (helpful in monorepos).

## Frontmatter Reference

All fields are optional, but `description` is strongly recommended.

| Field | Purpose |
| --- | --- |
| `name` | Skill/slash command name (defaults to directory name) |
| `description` | Helps Claude decide when to load the skill |
| `argument-hint` | Autocomplete hint for expected arguments |
| `disable-model-invocation` | If `true`, Claude cannot auto-invoke |
| `user-invocable` | If `false`, hidden from `/` menu |
| `allowed-tools` | Tool allowlist while skill is active |
| `model` | Model override for skill execution |
| `context` | `fork` runs skill in isolated subagent context |
| `agent` | Subagent type used with `context: fork` |
| `hooks` | Skill-scoped hooks |

## Invocation Control

Default behavior:
- User can invoke
- Claude can invoke

Control options:
- `disable-model-invocation: true` → user-only invocation
- `user-invocable: false` → Claude-only invocation (hidden from slash menu)

## Arguments and Substitutions

Supported placeholders in skill content:
- `$ARGUMENTS` for the full argument string
- `$ARGUMENTS[N]` for positional arguments (0-based)
- `$N` shorthand for positional arguments
- `${CLAUDE_SESSION_ID}` for session-aware paths/logs

If `$ARGUMENTS` is not present, Claude appends arguments at the end as `ARGUMENTS: ...`.

## Skill Types

### Reference Skills (inline context)

Use for conventions, standards, and background knowledge that should influence normal coding behavior.

### Task Skills (explicit workflow)

Use for operational workflows (deploy, commit, release) with clear steps. Commonly paired with:
- `disable-model-invocation: true`
- optional `context: fork` for isolated execution

## Advanced Patterns

### Dynamic Context Injection

Skill content can execute shell snippets using `!`command`` preprocessing. Output is injected before Claude reads the final prompt.

Use for live data gathering, e.g. PR diffs/comments with `gh`.

### Run in Subagent (`context: fork`)

When set, the skill runs in an isolated context:
- No access to main chat history
- Skill content becomes the delegated task prompt
- `agent` selects execution profile (e.g., `Explore`, `Plan`, `general-purpose`)

Use only when the skill contains explicit actionable instructions.

## Tool and Permission Controls

- `allowed-tools` can grant tool usage without per-action prompts during skill execution
- Global permissions still apply for non-allowed tools
- You can block all skill invocation via permission rules (`Skill`)
- You can allow/deny specific skill names with permission patterns

## Sharing Skills

Distribution options:
- Commit project skills in `.claude/skills/`
- Package in plugins (`skills/` directory)
- Roll out organization-wide via managed settings

## Troubleshooting

### Skill Not Triggering

- Improve description keywords for natural user phrasing
- Confirm visibility via "What skills are available?"
- Rephrase prompt to match description intent
- Invoke directly with `/skill-name`

### Skill Triggers Too Often

- Narrow description scope
- Set `disable-model-invocation: true` if manual-only is preferred

### Not All Skills Visible

Skill descriptions have a character budget in context. Use `/context` to check exclusions and adjust `SLASH_COMMAND_TOOL_CHAR_BUDGET` if needed.

## Practical Recommendations

- Keep `SKILL.md` concise (preferably under 500 lines)
- Move heavy detail to supporting docs (`reference.md`, examples)
- Use clear descriptions with intent + trigger phrases
- Reserve auto-invocation for safe, low-risk skills
- Use manual invocation for side-effecting workflows
