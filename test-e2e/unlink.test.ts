import * as path from 'node:path';
import {
  createTempDir,
  cleanupTempDir,
  isSymlink,
  setupAiDir,
} from './helpers.js';
import { nodeFs } from '@core/fs';
import { AdapterRegistry } from '@adapters/registry';
import { syncCommand } from '@commands/sync';
import { unlinkCommand } from '@commands/unlink';

describe('E2E: unlink', () => {
  let tmpDir: string;
  const registry = new AdapterRegistry();

  afterEach(async () => {
    if (tmpDir) await cleanupTempDir(tmpDir);
  });

  it('should remove all managed symlinks for a target', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(await isSymlink(path.join(tmpDir, 'CLAUDE.md'))).toBe(true);

    await unlinkCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(await isSymlink(path.join(tmpDir, 'CLAUDE.md'))).toBe(false);
  });

  it('should not affect other targets', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    await syncCommand(
      'cursor',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    await unlinkCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    expect(await isSymlink(path.join(tmpDir, 'CLAUDE.md'))).toBe(false);
    expect(
      await isSymlink(
        path.join(tmpDir, '.cursor', 'rules', 'AGENTS.md'),
      ),
    ).toBe(true);
  });

  it('should handle unlink with no prior sync', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    const result = await unlinkCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(result.removed).toBe(0);
  });
});
