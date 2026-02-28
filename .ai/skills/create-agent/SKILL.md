---
name: create-agent
description: Creates portable agent definitions for OpenCode, Cursor, and Claude Code from one canonical `.ai/agents/*.md` file. Use when the user asks to create a new agent or subagent, define agent behavior, or configure agent capabilities.
---

# Create Cross IDE Agent

Create agents in the canonical `.ai/agents/` directory so they can be synced to supported IDEs from one source file.

## Goal

Given a request like "create an agent for X", produce a focused, reusable agent file that works across:

- OpenCode agents
- Cursor subagents
- Claude Code subagents

Use `docs/agents.md` as the entrypoint and follow platform-specific docs only when needed.

## Compatibility Rules (Strict)

Use the safest cross-IDE baseline by default:

1. Create one file per agent:
   - `.ai/agents/<agent-name>.md`
2. Use a lowercase hyphenated filename:
   - regex target: `^[a-z0-9]+(-[a-z0-9]+)*$`
3. Start with minimal YAML frontmatter that is broadly compatible:
   - `name` (required)
   - `description` (required)
4. Keep the prompt body concise, procedural, and single-purpose.
5. Avoid platform-specific frontmatter fields unless explicitly requested.
6. Write all agent instructions and comments in English.

## Output Process

When creating a new agent, follow this sequence:

1. Clarify or infer:
   - primary task and scope
   - execution style (analysis-only vs implementation)
   - constraints (tools, safety, output style)
2. Choose `agent-name` using lowercase hyphenated tokens.
3. Create `.ai/agents/<agent-name>.md`.
4. Write:
   - frontmatter (`name`, `description`)
   - role and objective
   - operating instructions (ordered steps)
   - output expectations
   - guardrails and boundaries
5. Validate that the agent stays narrow and does not overlap heavily with general agents.

## Default Agent Template

Use this baseline template when generating agents:

```markdown
---
name: <agent-name>
description: <what this agent does and when to use it>.
---

# <Human Readable Agent Title>

## Mission
You are a specialized agent for <domain>.

## When to use
- Use this agent when ...
- Prefer this agent over the default assistant when ...

## Instructions
1. Confirm the goal, constraints, and expected output.
2. Inspect relevant context before proposing or applying changes.
3. Execute a focused workflow for this domain.
4. Validate the result with the appropriate checks.
5. Return a concise report with outcomes and follow-ups.

## Output format
- Result:
- Files changed:
- Validation:
- Risks/Notes:
```

## Quality Checklist

Before finishing, verify:

- file exists at `.ai/agents/<name>.md`
- frontmatter includes `name` and `description`
- filename matches the `name` value
- instructions are actionable and domain-specific
- prompt avoids vague generic behavior
- no unnecessary platform-specific fields were added

## Optional Platform-Specific Extension Mode

Only if explicitly requested, add platform-specific fields:

- OpenCode: `mode`, `tools`, `permission`, provider-specific options
- Cursor: `readonly`, `is_background`, `model`
- Claude Code: `tools`, `disallowedTools`, `permissionMode`, `memory`, `background`, `isolation`

When extensions are requested, keep the shared baseline intact and add only the minimum extra fields necessary for the requested platform behavior.
