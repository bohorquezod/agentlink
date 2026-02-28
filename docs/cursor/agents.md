# Cursor Subagents

Source: https://cursor.com/docs/context/subagents

## Overview

Subagents are specialized AI assistants that Cursor's main agent can delegate tasks to. Each subagent runs in an isolated context window, handles a focused type of work, and returns a condensed result back to the parent agent.

They are useful for:
- Isolating noisy intermediate output from the main conversation
- Running multiple workstreams in parallel
- Applying specialized prompts and tool configurations
- Reusing domain-specific behavior across projects

## How Subagents Work

When the parent agent detects a complex task, it can delegate to a subagent. The parent provides explicit context because subagents start with clean state and cannot directly access prior conversation history.

### Execution Modes

| Mode | Behavior | Best For |
| --- | --- | --- |
| Foreground | Blocks until the subagent finishes and returns output immediately | Sequential tasks requiring immediate output |
| Background | Returns control immediately while subagent continues independently | Long-running tasks or parallel work |

## Built-in Subagents

Cursor includes three built-in subagents:

| Subagent | Purpose | Why It Is Isolated |
| --- | --- | --- |
| Explore | Search and analyze codebases | Exploration can generate large and noisy intermediate output |
| Bash | Run shell command workflows | Command logs can be verbose and distract from decision-making |
| Browser | Drive browser automation via MCP | DOM snapshots and browser traces are high-volume context |

### Why This Design Exists

- Context isolation keeps the parent conversation concise
- Specialized prompts/tools improve reliability per task type
- Model flexibility can reduce cost for heavy search/exploration workloads
- Parallelization improves throughput on multi-part tasks

## Subagents vs Skills

Use **subagents** when:
- You need context isolation for long research or investigation
- You want parallel execution for multiple independent streams
- The task needs multi-step specialized reasoning
- You want independent validation of completed work

Use **skills** when:
- The task is single-purpose and short
- You need a fast, repeatable one-shot action
- Separate context windows are unnecessary

## Quick Start

You can ask Cursor to create a custom subagent file, for example:

- `Create .cursor/agents/verifier.md with YAML frontmatter and a prompt that validates implementation completeness.`

Agent may also delegate automatically when it detects a fit.

## Custom Subagents

### Supported Locations

Project-level:
- `.cursor/agents/`
- `.claude/agents/`
- `.codex/agents/`

User-level:
- `~/.cursor/agents/`
- `~/.claude/agents/`
- `~/.codex/agents/`

Precedence notes:
- Project subagents override user subagents
- `.cursor/` has precedence over `.claude/` and `.codex/` when names collide

### File Format

Each subagent is a Markdown file with YAML frontmatter:

```markdown
---
name: security-auditor
description: Security specialist. Use when implementing auth, payments, or handling sensitive data.
model: inherit
readonly: true
is_background: false
---

You are a security expert auditing code for vulnerabilities.

When invoked:
1. Identify security-sensitive code paths
2. Check for common vulnerabilities
3. Verify secrets are not hardcoded
4. Review input validation and sanitization
```

### Frontmatter Fields

| Field | Required | Description |
| --- | --- | --- |
| `name` | No | Unique id, defaults to filename without extension |
| `description` | No | Delegation hint used by Agent |
| `model` | No | `fast`, `inherit`, or specific model id |
| `readonly` | No | Restrict write permissions if `true` |
| `is_background` | No | Run in background if `true` |

## Invocation Patterns

### Automatic Delegation

Agent can proactively delegate based on:
- Task complexity and scope
- Subagent descriptions
- Current tool/context fit

Practical tip: include phrases like "use proactively" or "always use for" in descriptions to encourage routing.

### Explicit Invocation

Use slash form:

```text
/verifier confirm the auth flow is complete
/debugger investigate this test failure
```

Or natural language:

```text
Use the verifier subagent to validate this implementation.
```

### Parallel Invocation

```text
Review the API changes and update docs in parallel.
```

## Resuming Subagents

Subagents can be resumed with their returned agent id to continue long-running efforts in the same isolated context.

## Common Patterns

### Verifier Pattern

Goal: independently confirm that "done" work is actually complete and functional.

Typical responsibilities:
- Validate claimed implementation behavior
- Run relevant checks/tests
- Report gaps and edge cases missed

### Orchestrator Pattern

For complex workflows, use staged handoffs such as:
1. Planner defines approach
2. Implementer executes changes
3. Verifier validates outcomes

## Best Practices

- Keep each subagent narrowly focused
- Write clear and specific `description` fields
- Keep prompts concise and actionable
- Store project subagents in version control
- Prefer a small set of high-signal subagents over many generic ones

### Anti-patterns

- Creating many vague "general helper" subagents
- Writing very long prompts with low signal
- Using subagents for simple one-shot tasks better handled by skills/commands
- Duplicating existing slash-command behavior without added value

## Performance and Cost Considerations

Trade-offs:
- Better context isolation vs startup overhead
- Parallel execution vs higher total token usage
- Specialized focus vs potential latency for simple tasks

Subagents are most effective for complex, context-heavy, or parallelizable work.

## FAQ Highlights

- Built-ins are `explore`, `bash`, and `browser`
- Nested subagents are not currently supported
- Subagents inherit parent tools (including MCP tools)
- Background runs can be monitored and resumed
- Legacy request-based plans may ignore custom model selection without Max Mode
