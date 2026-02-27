import type { IdeAdapter } from '@adapters/types';

export const windsurfAdapter: IdeAdapter = {
  id: 'windsurf',
  name: 'Windsurf',
  description: 'Codeium Windsurf IDE',
  rootDocs: [{ source: 'AGENTS.md', target: '.windsurf/rules/AGENTS.md' }],
};
