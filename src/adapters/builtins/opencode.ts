import type { IdeAdapter } from '@adapters/types';

export const opencodeAdapter: IdeAdapter = {
  id: 'opencode',
  name: 'OpenCode',
  description: 'OpenCode AI editor',
  rootDocs: [{ source: 'AGENTS.md', target: 'AGENTS.md' }],
  skills: { dir: '.opencode/skills' },
  agents: { dir: '.opencode/agents' },
  commands: { dir: '.opencode/commands' },
};
