import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import type { SourceItems } from '@core/types';

async function listFilesRecursive(
  fs: FileSystem,
  dirPath: string,
  prefix = '',
): Promise<string[]> {
  if (!(await fs.exists(dirPath))) return [];

  const entries = await fs.readdir(dirPath);
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry);
    const relativePath = prefix ? path.join(prefix, entry) : entry;
    const stat = await fs.lstat(fullPath);

    if (stat.isFile()) {
      files.push(relativePath);
    } else if (stat.isDirectory()) {
      const nested = await listFilesRecursive(fs, fullPath, relativePath);
      files.push(...nested);
    }
  }

  return files.sort();
}

export async function scanSourceDir(
  fs: FileSystem,
  sourceDir: string,
): Promise<SourceItems> {
  if (!(await fs.exists(sourceDir))) {
    throw new Error(`Source directory not found: ${sourceDir}`);
  }

  const rootEntries = await fs.readdir(sourceDir);
  const rootDocs: string[] = [];
  for (const entry of rootEntries) {
    if (entry.startsWith('.')) continue;
    const fullPath = path.join(sourceDir, entry);
    const stat = await fs.lstat(fullPath);
    if (stat.isFile()) {
      rootDocs.push(entry);
    }
  }

  return {
    rootDocs: rootDocs.sort(),
    skills: await listFilesRecursive(fs, path.join(sourceDir, 'skills')),
    agents: await listFilesRecursive(fs, path.join(sourceDir, 'agents')),
    commands: await listFilesRecursive(fs, path.join(sourceDir, 'commands')),
  };
}
