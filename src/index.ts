export type {
  IdeAdapter,
  RootDocMapping,
  CategoryTarget,
} from '@adapters/types';
export type {
  LinkMapping,
  SourceItems,
  SyncState,
  SyncResult,
  StoredMapping,
  TargetState,
} from '@core/types';
export type { FileSystem, FsStats } from '@core/fs';

export { AdapterRegistry } from '@adapters/registry';
export { builtinAdapters } from '@adapters/builtins/index';
export { scanSourceDir } from '@core/scanner';
export { computeMappings } from '@core/mapper';
export { createSymlinks, removeSymlinks } from '@core/linker';
export { reconcileStaleLinks } from '@core/reconciler';
export {
  loadState,
  saveState,
  hasChanges,
  computeStoredMappings,
} from '@core/state';
export { scaffoldSourceDir } from '@core/scaffold';
export { syncCommand } from '@commands/sync';
export { initCommand } from '@commands/init';
export { unlinkCommand } from '@commands/unlink';
export { doctorCommand } from '@commands/doctor';
export { nodeFs } from '@core/fs';
