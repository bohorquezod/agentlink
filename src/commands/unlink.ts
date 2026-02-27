import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import type { AdapterRegistry } from '@adapters/registry';
import { removeSymlinks } from '@core/linker';
import { loadState, saveState } from '@core/state';

export interface UnlinkOptions {
  source: string;
}

export async function unlinkCommand(
  target: string,
  options: UnlinkOptions,
  projectRoot: string,
  fs: FileSystem,
  registry: AdapterRegistry,
): Promise<{ removed: number; errors: number }> {
  if (!registry.has(target)) {
    const available = registry.ids().join(', ');
    throw new Error(`Unknown target "${target}". Available: ${available}`);
  }

  const sourceDir = path.resolve(projectRoot, options.source);
  const statePath = path.join(sourceDir, '.agentlink-state.json');
  const state = await loadState(fs, statePath);
  const targetState = state.targets[target];

  if (!targetState || targetState.mappings.length === 0) {
    console.log(`No managed symlinks found for "${target}".`);
    return { removed: 0, errors: 0 };
  }

  const absPaths = targetState.mappings.map((m) =>
    path.resolve(projectRoot, m.target),
  );
  const { removed, errors } = await removeSymlinks(fs, absPaths);

  delete state.targets[target];
  await saveState(fs, statePath, state);

  console.log(`Removed ${removed.length} symlink(s) for "${target}".`);
  if (errors.length > 0) {
    for (const e of errors) {
      console.error(`  Error: ${e.path} - ${e.message}`);
    }
  }

  return { removed: removed.length, errors: errors.length };
}
