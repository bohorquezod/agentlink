# Windsurf Cascade Memories & Rules

Source: https://docs.windsurf.com/windsurf/cascade/memories

## Overview

Windsurf provides persistent context through two mechanisms:

- **Memories**: auto-generated (or user-requested) contextual notes stored per workspace
- **Rules**: user-authored instructions at global/workspace scope, plus enterprise system-level rules

Together, these help Cascade retain guidance across conversations.

## Managing Memories and Rules

Access management from:
- Cascade `Customizations` menu (top-right)
- `Windsurf - Settings`

You can edit existing memories directly from the UI.

## Memories

### How Memories Work

- Cascade may automatically create memories during conversation when context appears reusable
- You can explicitly request memory creation (for example: "create a memory of ...")
- Auto-generated memories are workspace-scoped
- Memories from one workspace are not shared with another workspace
- Creating and using auto-generated memories does **not** consume credits

## Rules

Users can define explicit rules at:
- global level (`global_rules.md`)
- workspace level (`.windsurf/rules`)

Workspace rules can be tied to glob patterns or natural-language descriptions.

## Rule Discovery

Windsurf discovers rules from multiple locations:

- current workspace `.windsurf/rules`
- subdirectories containing `.windsurf/rules`
- parent directories up to git root (in git repositories)

For multi-folder workspaces, rules are deduplicated and displayed with shortest relative paths.

### Where New Rules Are Saved

New rules are saved into the current workspace's `.windsurf/rules` directory (not necessarily git root).

### Rule Size Limit

Each rule file is limited to **12,000 characters**.

## Rule Activation Modes

Windsurf supports 4 activation modes:

1. **Manual**: activate via `@mention`
2. **Always On**: always applied
3. **Model Decision**: model decides based on rule description
4. **Glob**: applies when file paths match configured glob patterns

## Rule Authoring Best Practices

- Keep rules concise, specific, and actionable
- Avoid generic statements already covered by model training
- Prefer markdown structure (bullets/numbered lists) over long prose
- Use grouping tags (for example XML-style tags) when helpful for clarity

Example style:

```markdown
# Coding Guidelines
- My project's programming language is python
- Use early returns when possible
- Always add documentation when creating new functions and classes
```

Optional grouped variant:

```xml
<coding_guidelines>
- My project's programming language is python
- Use early returns when possible
- Always add documentation when creating new functions and classes
</coding_guidelines>
```

## System-Level Rules (Enterprise)

Enterprise teams can enforce org-wide system rules that users cannot modify.

OS-level rule locations:

- macOS: `/Library/Application Support/Windsurf/rules/*.md`
- Linux/WSL: `/etc/windsurf/rules/*.md`
- Windows: `C:\ProgramData\Windsurf\rules\*.md`

All `.md` files in these directories are auto-loaded.

### Merge Behavior

System rules are merged with global/workspace rules as additional context. They provide baseline standards without replacing user-defined local customization.

In UI, these appear with a `System` label and are not deletable by end users.

### Operational Guidance

System rules should be managed by IT/security teams, ideally through controlled deployment pipelines (for example MDM or configuration management tools).

## Practical Recommendations

- Use memories for evolving contextual facts per workspace
- Use workspace rules for project conventions and execution guidance
- Use global rules for personal cross-project preferences
- Keep enterprise system rules focused on compliance/security baselines
- Review and prune stale rules periodically to reduce instruction noise
