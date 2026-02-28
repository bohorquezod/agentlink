# Cursor Commands

Source: https://cursor.com/docs/context/commands

## Overview

Custom commands in Cursor are reusable Markdown-based workflows triggered with a `/` prefix in Agent chat. They help standardize repeated tasks and improve team consistency.

Status note:
- Commands are currently in **beta**, so behavior and syntax may evolve.

## How Commands Work

Commands are plain `.md` files discovered from multiple locations:

1. Project commands: `.cursor/commands/`
2. Global commands: `~/.cursor/commands/`
3. Team commands: managed by admins in Cursor Dashboard

When a user types `/` in chat, Cursor surfaces available commands from all configured sources.

## Creating Project Commands

1. Create `.cursor/commands` in project root
2. Add descriptive Markdown files (e.g., `review-code.md`)
3. Write clear instructions in plain Markdown
4. Trigger by typing `/` in chat and selecting the command

Example structure:

```text
.cursor/
└── commands/
    ├── address-github-pr-comments.md
    ├── code-review-checklist.md
    ├── create-pr.md
    ├── light-review-existing-diffs.md
    ├── onboard-new-developer.md
    ├── run-all-tests-and-fix.md
    ├── security-audit.md
    └── setup-new-feature.md
```

## Team Commands

Team commands are available on Team/Enterprise plans and are centrally managed by team admins.

Creation flow:
1. Open Team Content dashboard
2. Create command
3. Provide command name, optional description, and Markdown content
4. Save

Benefits:
- Centralized updates
- Consistent workflows across teams
- Easy sharing without manual sync
- Admin-level access control

Dashboard link:
- https://cursor.com/dashboard?tab=team-content&section=commands

## Parameters

Any text typed after a command name is included as additional prompt context.

Example:

```text
/commit and /pr these changes to address DX-523
```

## Recommended Command Content Pattern

A practical command template:

```markdown
# Command Title

## Overview
What the command should achieve.

## Steps
1. First action
2. Second action
3. Verification action

## Checklist
- [ ] Validation item 1
- [ ] Validation item 2
```

This structure keeps prompts actionable and repeatable.

## Built-in Example Themes from Docs

The official docs show common command categories such as:
- Code review checklist
- Security audit
- New feature setup
- Pull request creation
- Run tests and fix failures
- New developer onboarding

## Best Practices

- Use descriptive filenames matching intent (`security-audit.md`, `create-pr.md`)
- Keep commands concise but explicit about expected outputs
- Add checklists for quality gates and completion criteria
- Standardize command format across team-owned commands
- Prefer one command per workflow objective

## Limitations and Notes

- Feature is beta; expect iterative changes
- Team commands require appropriate plan and admin permissions
- Command quality depends on prompt clarity and scope
