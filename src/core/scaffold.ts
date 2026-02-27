import * as path from 'node:path';
import type { FileSystem } from '@core/fs';

const DEFAULT_AGENTS_MD = `# Project Agents

Define your AI agent instructions here.
`;

const CATEGORIES = ['skills', 'agents', 'commands'] as const;

export async function scaffoldSourceDir(
  fs: FileSystem,
  sourceDir: string,
): Promise<{ created: string[] }> {
  const created: string[] = [];

  if (!(await fs.exists(sourceDir))) {
    await fs.mkdir(sourceDir);
    created.push(sourceDir);
  }

  const agentsPath = path.join(sourceDir, 'AGENTS.md');
  if (!(await fs.exists(agentsPath))) {
    await fs.writeFile(agentsPath, DEFAULT_AGENTS_MD);
    created.push(agentsPath);
  }

  for (const cat of CATEGORIES) {
    const catDir = path.join(sourceDir, cat);
    if (!(await fs.exists(catDir))) {
      await fs.mkdir(catDir);
      created.push(catDir);
    }
  }

  return { created };
}
