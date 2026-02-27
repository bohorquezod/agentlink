import type { IdeAdapter } from '@adapters/types';

export const claudeAdapter: IdeAdapter = {
  id: 'claude',
  name: 'Claude Code',
  description: 'Anthropic Claude Code CLI',
  rootDocs: [{ source: 'AGENTS.md', target: 'CLAUDE.md' }],
  skills: { dir: '.claude/skills' },
  agents: { dir: '.claude/agents' },
  commands: { dir: '.claude/commands' },
};
