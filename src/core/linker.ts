import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import type { LinkMapping } from '@core/types';

export interface LinkResult {
  created: string[];
  errors: Array<{ path: string; message: string }>;
}

export async function createSymlinks(
  fs: FileSystem,
  mappings: LinkMapping[],
): Promise<LinkResult> {
  const created: string[] = [];
  const errors: Array<{ path: string; message: string }> = [];

  for (const mapping of mappings) {
    try {
      const targetDir = path.dirname(mapping.target);
      await fs.mkdir(targetDir);

      if (await fs.exists(mapping.target)) {
        const stat = await fs.lstat(mapping.target);
        if (stat.isSymbolicLink()) {
          const existingTarget = await fs.readlink(mapping.target);
          const resolved = path.resolve(
            path.dirname(mapping.target),
            existingTarget,
          );
          if (resolved === mapping.source) {
            continue;
          }
          await fs.unlink(mapping.target);
        } else {
          errors.push({
            path: mapping.target,
            message: 'Target exists and is not a symlink, skipping',
          });
          continue;
        }
      }

      const relSource = path.relative(targetDir, mapping.source);
      await fs.symlink(relSource, mapping.target);
      created.push(mapping.target);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ path: mapping.target, message });
    }
  }

  return { created, errors };
}

export async function removeSymlinks(
  fs: FileSystem,
  targets: string[],
): Promise<{ removed: string[]; errors: Array<{ path: string; message: string }> }> {
  const removed: string[] = [];
  const errors: Array<{ path: string; message: string }> = [];

  for (const target of targets) {
    try {
      if (!(await fs.exists(target))) continue;

      const stat = await fs.lstat(target);
      if (stat.isSymbolicLink()) {
        await fs.unlink(target);
        removed.push(target);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ path: target, message });
    }
  }

  return { removed, errors };
}
