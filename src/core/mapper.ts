import * as path from 'node:path';
import type { IdeAdapter } from '@adapters/types';
import type { LinkMapping, SourceItems } from '@core/types';

const CATEGORY_KEYS = ['skills', 'agents', 'commands'] as const;

export function computeMappings(
  projectRoot: string,
  sourceDir: string,
  items: SourceItems,
  adapter: IdeAdapter,
): LinkMapping[] {
  const mappings: LinkMapping[] = [];

  for (const docMap of adapter.rootDocs) {
    if (items.rootDocs.includes(docMap.source)) {
      mappings.push({
        source: path.resolve(sourceDir, docMap.source),
        target: path.resolve(projectRoot, docMap.target),
        category: 'rootDocs',
      });
    }
  }

  for (const key of CATEGORY_KEYS) {
    const catTarget = adapter[key];
    if (!catTarget) continue;

    const files = items[key];
    for (const file of files) {
      const targetName = catTarget.transform?.(file) ?? file;
      mappings.push({
        source: path.resolve(sourceDir, key, file),
        target: path.resolve(projectRoot, catTarget.dir, targetName),
        category: key,
      });
    }
  }

  return mappings;
}
