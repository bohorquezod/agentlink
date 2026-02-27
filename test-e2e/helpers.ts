import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

export async function createTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), 'agentlink-e2e-'));
}

export async function cleanupTempDir(dir: string): Promise<void> {
  await fs.rm(dir, { recursive: true, force: true });
}

export async function isSymlink(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.lstat(filePath);
    return stat.isSymbolicLink();
  } catch {
    return false;
  }
}

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.lstat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function setupAiDir(
  projectDir: string,
  source = '.ai',
): Promise<void> {
  const aiDir = path.join(projectDir, source);
  await fs.mkdir(path.join(aiDir, 'skills'), { recursive: true });
  await fs.mkdir(path.join(aiDir, 'agents'), { recursive: true });
  await fs.mkdir(path.join(aiDir, 'commands'), { recursive: true });
  await fs.writeFile(
    path.join(aiDir, 'AGENTS.md'),
    '# Project Agents\n',
  );
  await fs.writeFile(
    path.join(aiDir, 'skills', 'coding.md'),
    '# Coding Skill\n',
  );
  await fs.writeFile(
    path.join(aiDir, 'agents', 'reviewer.md'),
    '# Code Reviewer\n',
  );
  await fs.writeFile(
    path.join(aiDir, 'commands', 'deploy.md'),
    '# Deploy Command\n',
  );
}
