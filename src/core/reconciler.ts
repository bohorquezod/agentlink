import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import type { LinkMapping, StoredMapping } from '@core/types';

export async function reconcileStaleLinks(
  fs: FileSystem,
  projectRoot: string,
  previousMappings: StoredMapping[],
  currentMappings: LinkMapping[],
): Promise<{ removed: string[] }> {
  const currentTargets = new Set(
    currentMappings.map((m) => path.relative(projectRoot, m.target)),
  );

  const removed: string[] = [];

  for (const prev of previousMappings) {
    if (!currentTargets.has(prev.target)) {
      const absTarget = path.resolve(projectRoot, prev.target);
      try {
        if (await fs.exists(absTarget)) {
          const stat = await fs.lstat(absTarget);
          if (stat.isSymbolicLink()) {
            await fs.unlink(absTarget);
            removed.push(prev.target);
          }
        }
      } catch {
        // Ignore cleanup errors for stale links
      }
    }
  }

  return { removed };
}
