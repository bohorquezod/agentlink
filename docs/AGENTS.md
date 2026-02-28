# docs

Documentation hub for cross-platform guidance about agents, rules, and skills.

## Directory purpose

The `docs/` folder centralizes human-readable documentation that explains how agentic IDE concepts map across platforms (Cursor, Claude, OpenCode, Windsurf).

## Structure overview

- `docs/agents.md` — Index for agent/subagent documentation across platforms.
- `docs/rules.md` — Index for rules/memory documentation across platforms.
- `docs/skills.md` — Index for skills documentation across platforms.
- `docs/cursor/*.md` — Cursor-specific references.
- `docs/claude/*.md` — Claude-specific references.
- `docs/opencode/*.md` — OpenCode-specific references.
- `docs/windsurf/*.md` — Windsurf-specific references.

## Documentation conventions

- Keep index files (`agents.md`, `rules.md`, `skills.md`) as navigation entry points only.
- Avoid duplicating platform-specific details in index files; link to platform docs instead.
- Use repository-relative markdown links that remain valid when moved across environments.
- Keep terminology clear when platforms use different names for similar concepts.
- Write docs in English.

## When to update this folder

- Add or update links in index files when a new platform doc is added.
- Keep quick-navigation tables aligned with actual platform capabilities.
- Update platform docs first; then update the corresponding index file.
