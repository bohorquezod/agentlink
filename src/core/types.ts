export interface LinkMapping {
  source: string;
  target: string;
  category: string;
}

export interface SourceItems {
  rootDocs: string[];
  skills: string[];
  agents: string[];
  commands: string[];
}

export interface StoredMapping {
  source: string;
  target: string;
  sourceHash: string;
}

export interface TargetState {
  lastSync: string;
  mappings: StoredMapping[];
}

export interface SyncState {
  version: number;
  targets: Record<string, TargetState>;
}

export interface SyncResult {
  skipped: boolean;
  created: number;
  removed: number;
  unchanged: number;
  errors: Array<{ path: string; message: string }>;
}
