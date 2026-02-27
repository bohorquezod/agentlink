import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import type { AdapterRegistry } from '@adapters/registry';
import type { SyncResult } from '@core/types';
import { scanSourceDir } from '@core/scanner';
import { computeMappings } from '@core/mapper';
import { createSymlinks } from '@core/linker';
import { reconcileStaleLinks } from '@core/reconciler';
import {
  loadState,
  saveState,
  computeStoredMappings,
  hasChanges,
} from '@core/state';

export interface SyncOptions {
  source: string;
  force?: boolean;
}

export async function syncCommand(
  target: string,
  options: SyncOptions,
  projectRoot: string,
  fs: FileSystem,
  registry: AdapterRegistry,
): Promise<SyncResult> {
  const adapter = registry.get(target);
  if (!adapter) {
    const available = registry.ids().join(', ');
    throw new Error(`Unknown target "${target}". Available: ${available}`);
  }

  const sourceDir = path.resolve(projectRoot, options.source);
  const statePath = path.join(sourceDir, '.agentlink-state.json');

  const items = await scanSourceDir(fs, sourceDir);
  const mappings = computeMappings(projectRoot, sourceDir, items, adapter);
  const state = await loadState(fs, statePath);
  const prevTarget = state.targets[target];
  const currentStored = await computeStoredMappings(
    fs,
    projectRoot,
    mappings,
  );

  if (
    !options.force &&
    prevTarget &&
    !hasChanges(prevTarget.mappings, currentStored)
  ) {
    return {
      skipped: true,
      created: 0,
      removed: 0,
      unchanged: mappings.length,
      errors: [],
    };
  }

  const { removed } = await reconcileStaleLinks(
    fs,
    projectRoot,
    prevTarget?.mappings ?? [],
    mappings,
  );

  const linkResult = await createSymlinks(fs, mappings);

  state.targets[target] = {
    lastSync: new Date().toISOString(),
    mappings: currentStored,
  };
  await saveState(fs, statePath, state);

  return {
    skipped: false,
    created: linkResult.created.length,
    removed: removed.length,
    unchanged: mappings.length - linkResult.created.length,
    errors: linkResult.errors,
  };
}
