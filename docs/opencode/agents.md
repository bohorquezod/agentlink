# OpenCode Agents

Source: https://opencode.ai/docs/es/agents/

## Overview

OpenCode agents are specialized AI assistants configured for specific workflows using custom prompts, models, tools, and permissions.

You can:
- switch primary agents during a session
- invoke subagents with `@mention`
- customize built-ins or create your own agents

## Agent Types

OpenCode defines two main categories:

- **Primary agents**: main assistants for direct interaction
- **Subagents**: specialized agents invoked by primary agents or manually with `@`

## Built-in Agents

### Primary

- `build` (default): full tool access for implementation work
- `plan`: restricted agent for analysis/planning without direct changes

### Subagents

- `general`: general-purpose multi-step execution
- `explore`: fast read-only codebase exploration

### Hidden System Agents

- `compact`: context compaction
- `title`: session title generation
- `summary`: session summary generation

These run automatically and are not user-selectable.

## Usage

- Switch primary agents with `Tab` (or configured `switch_agent` keybinding)
- Invoke subagents by `@name`, e.g. `@general help me search for this function`
- Navigate parent/child sessions with configured session-cycle shortcuts

## Configuration Methods

Agents can be configured via:

1. `opencode.json`
2. Markdown files
   - global: `~/.config/opencode/agents/`
   - project: `.opencode/agents/`

For Markdown-based agents, filename becomes agent name (e.g., `review.md` -> `review`).

## JSON Configuration Example

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "tools": { "write": true, "edit": true, "bash": true }
    },
    "plan": {
      "mode": "primary",
      "tools": { "write": false, "edit": false, "bash": false }
    },
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "mode": "subagent",
      "tools": { "write": false, "edit": false }
    }
  }
}
```

## Markdown Configuration Example

```markdown
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
---

You are in code review mode. Focus on:
- code quality and best practices
- bugs and edge cases
- performance implications
- security considerations
```

## Key Agent Options

### Required

- `description` (mandatory)

### Behavior and Quality

- `prompt`: system prompt (or prompt file reference)
- `model`: override model (`provider/model-id`)
- `temperature`: creativity/determinism control
- `top_p`: diversity control
- `steps`: max agentic iterations (`maxSteps` deprecated)

### Visibility and Role

- `mode`: `primary`, `subagent`, or `all` (default `all`)
- `disable`: disable the agent
- `hidden`: hide subagent from `@` autocomplete (still invocable programmatically if allowed)

### Tools and Permissions

- `tools`: enable/disable specific tools (supports wildcards)
- `permission`: control `edit`, `bash`, `webfetch` with:
  - `ask`
  - `allow`
  - `deny`
- command-level `bash` permission rules with wildcard matching
- rule precedence: last matching permission rule wins

### Task Delegation Control

- `permission.task`: allow/ask/deny which subagents an agent can invoke through Task
- denied task agents can be removed from Task tool description
- users can still manually `@mention` subagents

### UI and Provider Extras

- `color`: hex or theme token (`primary`, `accent`, etc.)
- extra provider-specific fields pass through to model provider
  - example: `reasoningEffort`, `textVerbosity`

## Permission Patterns

Examples:

- deny all bash, allow specific command patterns afterward
- allow harmless read commands (`git status`, `grep *`)
- ask before sensitive actions (`git push`)

Because matching is ordered, place broad wildcard rules first and specific exceptions after.

## Create Agents via CLI

Use:

```bash
opencode agent create
```

Interactive flow covers:
- global vs project scope
- description and prompt generation
- tool access selection
- markdown file creation

## Common Use Cases

- `build`: full implementation work
- `plan`: safe analysis without edits
- `review`: read-only code review workflows
- `debug`: investigation with read+bash emphasis
- `docs`: documentation authoring without shell commands

## Example Agent Profiles

- Documentation writer (`tools.bash: false`)
- Security auditor (`tools.write/edit: false`)

These patterns demonstrate scoped tool access with focused prompts.

## Practical Recommendations

- keep agents narrow and purpose-specific
- define precise `description` text for better invocation routing
- use restrictive permissions by default, then relax where needed
- separate planning and execution agents to reduce accidental changes
- standardize agent files in project repos for team consistency
