---
name: create-skill
description: Creates portable Agent Skills that work across Cursor, Claude Code, OpenCode, and Windsurf from one canonical definition. Use when the user asks to create a new skill, design a reusable skill workflow, or make one skill compatible with multiple agentic IDEs.
---

# Create Cross IDE Skill

Create skills in the canonical `.ai/skills/` tree so they can be synced and reused across supported IDEs.

## Goal

Given a user request like "create a skill for X", produce a **single portable skill** that works across:

- Cursor
- Claude Code
- OpenCode
- Windsurf

## Compatibility Rules (Strict)

Use the safest cross-IDE contract:

1. Create exactly one folder per skill:
   - `.ai/skills/<skill-name>/`
2. Create `SKILL.md` (uppercase) inside that folder.
3. Use YAML frontmatter with only universally safe fields:
   - `name` (required)
   - `description` (required)
4. Ensure `name` is valid for strict validators:
   - regex: `^[a-z0-9]+(-[a-z0-9]+)*$`
   - 1-64 chars
   - matches folder name exactly
5. Keep `description` specific and concise (1-1024 chars target).
6. Write all body instructions in English.

Avoid vendor-specific frontmatter unless the user explicitly asks for an IDE-specific variant.

## Output Process

When asked to create a new skill, follow this sequence:

1. Infer or ask for:
   - skill purpose
   - trigger scenarios
   - expected output format
2. Choose `skill-name` (lowercase hyphenated).
3. Create `.ai/skills/<skill-name>/SKILL.md`.
4. Write:
   - frontmatter (`name`, `description`)
   - short "When to use"
   - concrete "Instructions"
   - optional "Output format" template
5. If useful, add supporting files next to `SKILL.md`:
   - `examples.md`
   - `reference.md`
   - `scripts/*`
6. Keep `SKILL.md` concise and procedural.

## Default Skill Template

Use this baseline when generating a new skill:

```markdown
---
name: <skill-name>
description: <what it does>. Use when <trigger scenarios>.
---

# <Human Readable Title>

## When to use
- Use this skill when ...
- Also use it when ...

## Instructions
1. Clarify goal and constraints.
2. Inspect relevant files and current state.
3. Execute the workflow step by step.
4. Validate results before finalizing.
5. Return a concise summary and next actions.

## Output format
- Result:
- Changes made:
- Validation:
- Follow-ups:
```

## Quality Checklist

Before finishing, verify:

- `SKILL.md` exists at `.ai/skills/<name>/SKILL.md`
- frontmatter includes both `name` and `description`
- folder name equals `name`
- name passes strict regex and length rules
- instructions are actionable, not vague
- no unnecessary vendor-specific fields

## Optional IDE-Specific Extension Mode

Only if explicitly requested, provide add-on notes for one platform:

- Cursor/OpenCode/Windsurf: keep portable format unless a platform-only feature is needed.
- Claude Code: may add advanced fields (`allowed-tools`, `context`, `agent`, etc.) in a dedicated variant, not in the default portable file.

Default behavior is always to keep one portable skill that works across all.
