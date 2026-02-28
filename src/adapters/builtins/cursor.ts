import type { IdeAdapter } from '@adapters/types';

export const cursorAdapter: IdeAdapter = {
  id: 'cursor',
  name: 'Cursor',
  description: 'Cursor AI IDE',
  rootDocs: [{ source: 'AGENTS.md', target: 'AGENTS.md' }],
  skills: { dir: '.cursor/skills' },
  agents: { dir: '.cursor/agents' },
  commands: { dir: '.cursor/commands' },
};
