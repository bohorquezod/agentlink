import type { IdeAdapter } from '@adapters/types';

export const cursorAdapter: IdeAdapter = {
  id: 'cursor',
  name: 'Cursor',
  description: 'Cursor AI IDE',
  rootDocs: [{ source: 'AGENTS.md', target: '.cursor/rules/AGENTS.md' }],
  skills: { dir: '.cursor/skills' },
};
