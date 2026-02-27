import * as crypto from 'node:crypto';
import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import type { LinkMapping, StoredMapping, SyncState } from '@core/types';

const STATE_VERSION = 1;

export async function loadState(
  fs: FileSystem,
  statePath: string,
): Promise<SyncState> {
  if (!(await fs.exists(statePath))) {
    return { version: STATE_VERSION, targets: {} };
  }
  try {
    const content = await fs.readFile(statePath);
    return JSON.parse(content) as SyncState;
  } catch {
    return { version: STATE_VERSION, targets: {} };
  }
}

export async function saveState(
  fs: FileSystem,
  statePath: string,
  state: SyncState,
): Promise<void> {
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
}

export async function hashFile(
  fs: FileSystem,
  filePath: string,
): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

export async function computeStoredMappings(
  fs: FileSystem,
  projectRoot: string,
  mappings: LinkMapping[],
): Promise<StoredMapping[]> {
  const stored: StoredMapping[] = [];
  for (const m of mappings) {
    const hash = await hashFile(fs, m.source);
    stored.push({
      source: path.relative(projectRoot, m.source),
      target: path.relative(projectRoot, m.target),
      sourceHash: hash,
    });
  }
  return stored;
}

export function hasChanges(
  previous: StoredMapping[],
  current: StoredMapping[],
): boolean {
  if (previous.length !== current.length) return true;

  const prevMap = new Map<string, string>();
  for (const m of previous) {
    prevMap.set(`${m.source}::${m.target}`, m.sourceHash);
  }

  for (const m of current) {
    const key = `${m.source}::${m.target}`;
    if (prevMap.get(key) !== m.sourceHash) return true;
  }

  return false;
}
