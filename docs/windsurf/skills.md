# Windsurf Cascade Skills

Source: https://docs.windsurf.com/windsurf/cascade/skills

## Overview

Skills in Windsurf Cascade package reusable, multi-step workflows with supporting resources (scripts, templates, checklists, configs) inside a folder. Cascade can automatically invoke skills when relevant or you can invoke them manually.

Cascade uses progressive disclosure, loading skills contextually instead of injecting everything up front.

## Why Use Skills

Use skills when tasks need more than a single prompt, for example:
- deployment runbooks
- code review playbooks
- testing procedures
- repeatable operational workflows

## Create a Skill

### UI Method (Recommended)

1. Open Cascade panel
2. Open the customizations menu (three-dot menu)
3. Go to `Skills`
4. Click `+ Workspace` (project skill) or `+ Global` (global skill)
5. Enter a valid name (lowercase letters, numbers, hyphens)

### Manual Method

Workspace skill:
- `.windsurf/skills/<skill-name>/SKILL.md`

Global skill:
- `~/.codeium/windsurf/skills/<skill-name>/SKILL.md`

## `SKILL.md` Format

Every skill must include `SKILL.md` with YAML frontmatter:

```markdown
---
name: deploy-to-production
description: Guides the deployment process to production with safety checks
---

## Pre-deployment Checklist
1. Run all tests
2. Check for uncommitted changes
3. Verify environment variables

## Deployment Steps
Follow these steps to deploy safely...
```

### Required Frontmatter Fields

- `name`: unique skill id used in UI and `@mentions`
- `description`: routing hint so Cascade knows when to invoke it

Naming guidance: use lowercase letters, numbers, and hyphens (for example `deploy-to-staging`).

## Supporting Resources

Place supporting files next to `SKILL.md` in the same skill folder:

```text
.windsurf/skills/deploy-to-production/
├── SKILL.md
├── deployment-checklist.md
├── rollback-procedure.md
└── config-template.yaml
```

Cascade can access these files when the skill is invoked.

## Invocation Modes

### Automatic Invocation

Cascade auto-invokes a skill when your request matches the skill `description`.

### Manual Invocation

Use `@skill-name` in Cascade input to force skill activation.

## Skill Scopes

| Scope | Location | Availability |
| --- | --- | --- |
| Workspace | `.windsurf/skills/` | Current project/workspace only |
| Global | `~/.codeium/windsurf/skills/` | All projects/workspaces |

## Example Use Cases

### Deployment Workflow

```text
.windsurf/skills/deploy-staging/
├── SKILL.md
├── pre-deploy-checks.sh
├── environment-template.env
└── rollback-steps.md
```

### Code Review Workflow

```text
.windsurf/skills/code-review/
├── SKILL.md
├── style-guide.md
├── security-checklist.md
└── review-template.md
```

### Testing Workflow

```text
.windsurf/skills/run-tests/
├── SKILL.md
├── test-template.py
├── coverage-config.json
└── ci-workflow.yaml
```

## Best Practices

- Write precise descriptions with clear invocation intent
- Use descriptive names (`deploy-to-staging` > `deploy1`)
- Include practical supporting assets (templates, checklists, examples)
- Keep instructions procedural and outcome-oriented

## Skills vs Rules

| Dimension | Skills | Rules |
| --- | --- | --- |
| Purpose | Multi-step task workflows | Behavioral guidance/preferences |
| Structure | Folder (`SKILL.md` + resources) | Single markdown file |
| Invocation | Auto (progressive) or `@mention` | Trigger-based (always, globs, manual) |
| Best fit | Procedures and playbooks | Style, conventions, response behavior |

Use skills for process execution; use rules for consistent behavioral guidance.

## Related Docs

- Skills: https://docs.windsurf.com/windsurf/cascade/skills
- Workflows: https://docs.windsurf.com/windsurf/cascade/workflows
- AGENTS.md: https://docs.windsurf.com/windsurf/cascade/agents-md
- Memories & Rules: https://docs.windsurf.com/windsurf/cascade/memories
