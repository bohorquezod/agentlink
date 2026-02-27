import type { IdeAdapter } from '@adapters/types';

export const codexAdapter: IdeAdapter = {
  id: 'codex',
  name: 'Codex',
  description: 'OpenAI Codex CLI',
  rootDocs: [{ source: 'AGENTS.md', target: 'AGENTS.md' }],
};
