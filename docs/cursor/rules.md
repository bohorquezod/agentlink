# Cursor Rules

Source: https://cursor.com/docs/context/rules

## Overview

Rules are system-level instructions for Cursor Agent. They provide persistent, reusable guidance by injecting rule content at the start of model context for each applicable chat session.

Cursor supports four rule types:
- **Project Rules** (`.cursor/rules`)
- **User Rules** (global settings-level rules)
- **Team Rules** (dashboard-managed org rules)
- **`AGENTS.md`** (simple markdown instructions in project directories)

## How Rules Work

Because LLM completions are stateless, rules act as durable prompt context. When a rule applies, its content is prepended to the model context, helping enforce consistent behavior across coding and workflow tasks.

## Project Rules

Project rules are version-controlled files in `.cursor/rules`, scoped by relevance, file patterns, manual mention, or always-apply mode.

Use project rules to:
- Encode domain conventions
- Standardize architecture/style decisions
- Automate common project workflows

### File Structure

Project rules can use `.md` or `.mdc`:

```text
.cursor/rules/
  react-patterns.mdc
  api-guidelines.md
  frontend/
    components.md
```

Use `.mdc` with frontmatter (`description`, `globs`, `alwaysApply`) for finer control.

### Rule Application Types

| Type | Behavior |
| --- | --- |
| `Always Apply` | Included in every chat session |
| `Apply Intelligently` | Included when Agent decides relevance from description |
| `Apply to Specific Files` | Included when file path matches configured patterns |
| `Apply Manually` | Included when referenced with `@rule-name` |

### Minimal Rule Example

```markdown
---
description: "Internal service conventions"
alwaysApply: false
globs:
---

- Use internal RPC pattern for services
- Use snake_case service names

@service-template.ts
```

## Rule Creation

Create rules using:
- `New Cursor Rule` command, or
- `Cursor Settings > Rules, Commands`

This creates files in `.cursor/rules` and lets you manage activation/type metadata.

## Best Practices

- Keep rules focused, specific, and actionable
- Prefer composable small rules over one large monolith
- Keep rules under ~500 lines
- Reference canonical files with `@...` instead of copying long content
- Add concrete examples over vague instructions
- Update rules when repeated mistakes appear in agent output

### Anti-patterns

- Copying entire style guides into rules
- Documenting generic commands the agent already knows
- Optimizing for rare edge cases
- Duplicating codebase truths instead of referencing source files

## Team Rules

Team Rules are available on Team/Enterprise plans and are managed from the Cursor dashboard.

Key behavior:
- Can be enabled immediately or saved as draft
- Can be enforced (users cannot disable) or non-enforced (users may disable)
- Apply across all repositories for that team

Important distinctions:
- Team Rules are plain text (no `.cursor/rules` file structure)
- No `globs`, `alwaysApply`, or type dropdown metadata

### Precedence Order

When conflicts exist, precedence is:
1. Team Rules
2. Project Rules
3. User Rules

All applicable rules are merged, with earlier sources winning on conflict.

## Importing Rules

### Remote Rules from GitHub

You can import public/private remote rules:
1. Open `Cursor Settings → Rules, Commands`
2. `+ Add Rule` under Project Rules
3. Select `Remote Rule (Github)`
4. Paste repository URL

Imported rules stay synchronized with the source repository.

### Agent Skills as Rules

Cursor can import Agent Skills and treat them as agent-decided rules.

Notes:
- Enable/disable in `Cursor Settings → Rules` under Import Settings
- Imported skills are not configurable as always-apply/manual rules

## `AGENTS.md`

`AGENTS.md` is a lightweight markdown alternative to `.cursor/rules` for straightforward instruction sets.

Supported behavior:
- Works in project root and nested subdirectories
- Nested files combine with parent instructions
- More specific directory instructions take precedence

Example layout:

```text
project/
  AGENTS.md
  frontend/
    AGENTS.md
    components/
      AGENTS.md
  backend/
    AGENTS.md
```

## User Rules

User Rules are global preferences in Cursor Settings and apply across projects for Agent chat behavior (e.g., response style, coding preferences).

## Legacy Format

`.cursorrules` is still supported but deprecated. Migrate to Project Rules or `AGENTS.md`.

## FAQ Highlights

- If a rule is not applied, verify type configuration (`description`, `globs`, manual mention, etc.)
- Rules can reference files with `@filename`
- You can ask Agent to create rules from chat
- Rules do not affect Cursor Tab or unrelated AI features
- User Rules do not apply to Inline Edit (`Cmd/Ctrl+K`), only Agent Chat
