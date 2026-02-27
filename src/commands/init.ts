import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import { scaffoldSourceDir } from '@core/scaffold';

export interface InitOptions {
  source: string;
}

export async function initCommand(
  options: InitOptions,
  projectRoot: string,
  fs: FileSystem,
): Promise<{ created: string[] }> {
  const sourceDir = path.resolve(projectRoot, options.source);
  const result = await scaffoldSourceDir(fs, sourceDir);

  if (result.created.length === 0) {
    console.log(`Source directory already initialized: ${options.source}`);
  } else {
    console.log(`Initialized ${options.source} with:`);
    for (const item of result.created) {
      console.log(`  + ${path.relative(projectRoot, item)}`);
    }
  }

  return result;
}
