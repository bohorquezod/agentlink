# Claude Code Subagents

Source: https://code.claude.com/docs/en/sub-agents

## Overview

Subagents are specialized assistants inside Claude Code that run in isolated contexts with their own prompts, tools, and permissions. Claude delegates tasks to them based on each subagent's `description`.

Why they are useful:
- Preserve main-context space by isolating noisy work
- Enforce constraints through tool and permission limits
- Reuse behavior across projects with user-level agents
- Improve cost/performance by routing to lighter models when appropriate

## Built-in Subagents

Claude Code includes built-ins such as:
- `Explore` (fast, read-only codebase exploration; typically Haiku)
- `Plan` (plan-mode research, read-only)
- `general-purpose` (broader multi-step tasks with full capability)
- Other helpers like `Bash` and setup/guide agents

These are usually delegated automatically when task patterns match.

## Quickstart (Create First Subagent)

Recommended path:
1. Run `/agents`
2. Create a new user-level or project-level subagent
3. Generate config with Claude (or edit manually)
4. Select tools, model, and visual color
5. Save and invoke by request

Example invocation:

```text
Use the code-improver agent to suggest improvements in this project
```

## Where Subagents Live (Scope & Priority)

| Location | Scope | Priority |
| --- | --- | --- |
| `--agents` CLI flag | Current session | Highest |
| `.claude/agents/` | Current project | High |
| `~/.claude/agents/` | User-wide | Medium |
| Plugin `agents/` directory | Plugin scope | Lowest |

If names conflict, higher priority wins.

## File Format

Subagents are Markdown files with YAML frontmatter plus prompt body:

```markdown
---
name: code-reviewer
description: Reviews code quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. Provide specific and actionable feedback.
```

`name` and `description` are required.

## Frontmatter Fields

Supported fields include:
- `name`, `description`
- `tools`, `disallowedTools`
- `model` (`sonnet`, `opus`, `haiku`, `inherit`)
- `permissionMode` (`default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, `plan`)
- `maxTurns`
- `skills` (preload skill content at startup)
- `mcpServers`
- `hooks`
- `memory` (`user`, `project`, `local`)
- `background` (`true` to always run as background task)
- `isolation` (`worktree` for temporary git worktree isolation)

## Capability Control

You can constrain subagents by:
- Allowlisting tools with `tools`
- Denylisting with `disallowedTools`
- Setting strict `permissionMode`
- Restricting spawnable subagents using `Task(agent_type)` patterns
- Denying specific subagents in permissions with `Task(name)`

## Skills + Subagents

Two important patterns:

1. **Preload skills into subagents** via `skills:` in subagent frontmatter  
   - Injects full skill content into subagent context at startup

2. **Run skills in subagents** via skill-level `context: fork`  
   - The skill content becomes the delegated task prompt

These are related but not the same configuration direction.

## Memory for Subagents

Use `memory` to persist learning between sessions:
- `user`: global across projects
- `project`: repo-shared memory scope
- `local`: project-specific but not intended for version control

When enabled, Claude adds memory management instructions and includes `MEMORY.md` context (first lines) in the subagent prompt.

## Hooks for Lifecycle and Tool Governance

Subagent hooks can be defined:
- In subagent frontmatter (active only while that subagent runs)
- In `settings.json` for main-session lifecycle events (`SubagentStart`, `SubagentStop`)

Common pattern:
- `PreToolUse` hook to validate/deny risky commands (exit code `2` blocks execution)

## Foreground vs Background

- **Foreground**: blocks main flow; prompts/questions can be routed to user
- **Background**: runs concurrently; pre-approvals are requested upfront

You can explicitly ask Claude to run in background, or disable background tasks globally via environment configuration.

## Working Patterns

- Isolate high-output tasks (tests, logs, large searches)
- Run independent research in parallel
- Chain subagents for staged workflows (review -> fix -> validate)

Use main conversation when frequent back-and-forth is needed. Use subagents for self-contained tasks that can return concise summaries.

## Resume and Context Management

Each invocation starts fresh unless resumed. Resuming restores the subagent's own prior context, tool history, and progress. Subagent transcripts are stored separately from the main conversation and can persist across restarts within session retention settings.

## Example Subagents (from docs)

Common templates shown:
- `code-reviewer` (read-only review workflow)
- `debugger` (analyze + edit + verify)
- `data-scientist` (SQL/analysis-oriented)
- `db-reader` (Bash plus hook validation to allow read-only SQL)

These examples emphasize focused scope, clear descriptions, and minimal necessary tool access.

## Best Practices

- Design narrow, single-purpose subagents
- Write explicit `description` text so delegation is predictable
- Limit tools and permission scope for safety
- Keep project subagents version-controlled for team reuse
- Prefer background only when clarifications are unlikely

## Related Documentation

- Subagents: https://code.claude.com/docs/en/sub-agents
- Skills: https://code.claude.com/docs/en/skills
- Hooks: https://code.claude.com/en/hooks
- Permissions: https://code.claude.com/en/permissions
- Plugins: https://code.claude.com/en/plugins
