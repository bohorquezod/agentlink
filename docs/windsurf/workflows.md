# Windsurf Cascade Workflows

Source: https://docs.windsurf.com/windsurf/cascade/workflows

## Overview

Workflows in Windsurf Cascade automate repetitive multi-step tasks through reusable Markdown definitions. They are invoked as slash commands in Cascade using:

```text
/[workflow-name]
```

Workflows are ideal for repeatable processes such as PR review, test/fix loops, deployment, and dependency management.

## How Workflows Differ from Rules

- **Rules**: provide persistent guidance and preferences at prompt/context level
- **Workflows**: define a step-by-step execution trajectory for concrete task automation

Use workflows when you need procedural execution, not just behavioral guidance.

## Invocation and Execution

- Invoke with `/workflow-name`
- Cascade processes workflow steps sequentially
- Workflows can call other workflows (for modular composition)

Example composition pattern:
- `/workflow-1` can include instructions to run `/workflow-2` and `/workflow-3`

## Creating Workflows

### From the UI

1. Open Cascade `Customizations`
2. Go to `Workflows`
3. Click `+ Workflow`
4. Define title, description, and steps

### With Cascade Assistance

You can ask Cascade to generate workflows, especially useful for CLI-oriented, multi-step flows.

## Storage and Discovery

Workflows are stored as Markdown files under `.windsurf/workflows/`.

Discovery includes:
- current workspace `.windsurf/workflows/`
- subdirectories containing `.windsurf/workflows/`
- parent directories up to git root (for git repos)

Multi-folder workspaces:
- workflows are deduplicated
- shortest relative path is shown in UI

### Where New Workflows Are Saved

New workflows are saved in the current workspace `.windsurf/workflows/` directory (not necessarily git root).

### File Size Limit

Each workflow file has a **12,000 character** limit.

## Example Workflow Ideas

Common use cases from the docs:

- `/address-pr-comments`
- `/git-workflows`
- `/dependency-management`
- `/code-formatting`
- `/run-tests-and-fix`
- `/deployment`
- `/security-scan`

## Example Structure (Conceptual)

Typical workflow content includes:

1. Context/setup steps
2. Tool or command execution steps
3. Per-item processing loop instructions
4. Final summary and escalation paths for unclear items

This structure keeps automation predictable and reviewable.

## System-Level Workflows (Enterprise)

Enterprise organizations can deploy immutable, org-wide workflows.

System workflow directories:

- macOS: `/Library/Application Support/Windsurf/workflows/*.md`
- Linux/WSL: `/etc/windsurf/workflows/*.md`
- Windows: `C:\ProgramData\Windsurf\workflows\*.md`

All `.md` files in those directories are auto-loaded.

### Precedence

When duplicate names exist, precedence is:

1. **System** (highest)
2. **Workspace**
3. **Global**
4. **Built-in**

System workflows override same-name definitions from lower levels.

### UI Behavior

System workflows are labeled `System` and cannot be deleted by end users.

## Operational Recommendations

- Keep workflows focused and single-purpose
- Use clear, ordered, testable steps
- Chain workflows for larger processes rather than creating giant files
- Standardize naming for team discoverability (`run-tests-and-fix`, `security-scan`)
- For enterprise deployments, manage lifecycle through IT/security tooling (MDM/config management)
