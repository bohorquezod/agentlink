import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  createTempDir,
  cleanupTempDir,
  isSymlink,
  pathExists,
  setupAiDir,
} from './helpers.js';
import { nodeFs } from '@core/fs';
import { AdapterRegistry } from '@adapters/registry';
import { syncCommand } from '@commands/sync';

describe('E2E: sync', () => {
  let tmpDir: string;
  const registry = new AdapterRegistry();

  afterEach(async () => {
    if (tmpDir) await cleanupTempDir(tmpDir);
  });

  it('should create granular symlinks for claude', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    const result = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    expect(result.skipped).toBe(false);
    expect(result.created).toBeGreaterThan(0);

    expect(await isSymlink(path.join(tmpDir, 'CLAUDE.md'))).toBe(true);
    expect(
      await isSymlink(path.join(tmpDir, '.claude', 'skills', 'coding.md')),
    ).toBe(true);
    expect(
      await isSymlink(
        path.join(tmpDir, '.claude', 'agents', 'reviewer.md'),
      ),
    ).toBe(true);
    expect(
      await isSymlink(
        path.join(tmpDir, '.claude', 'commands', 'deploy.md'),
      ),
    ).toBe(true);

    const content = await fs.readFile(
      path.join(tmpDir, 'CLAUDE.md'),
      'utf-8',
    );
    expect(content).toContain('Agent');
  });

  it('should create granular symlinks for cursor', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'cursor',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    expect(
      await isSymlink(
        path.join(tmpDir, '.cursor', 'rules', 'AGENTS.md'),
      ),
    ).toBe(true);
    expect(
      await isSymlink(
        path.join(tmpDir, '.cursor', 'skills', 'coding.md'),
      ),
    ).toBe(true);
  });

  it('should create symlinks for all built-in targets', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    for (const id of registry.ids()) {
      const result = await syncCommand(
        id,
        { source: '.ai' },
        tmpDir,
        nodeFs,
        registry,
      );
      expect(result.errors).toHaveLength(0);
    }
  });

  it('should clean stale links when source file is removed', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(
      await isSymlink(path.join(tmpDir, '.claude', 'skills', 'coding.md')),
    ).toBe(true);

    await fs.unlink(path.join(tmpDir, '.ai', 'skills', 'coding.md'));

    await syncCommand(
      'claude',
      { source: '.ai', force: true },
      tmpDir,
      nodeFs,
      registry,
    );

    expect(
      await pathExists(
        path.join(tmpDir, '.claude', 'skills', 'coding.md'),
      ),
    ).toBe(false);
  });

  it('should clean stale links when source file is renamed', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    const oldPath = path.join(tmpDir, '.ai', 'skills', 'coding.md');
    const newPath = path.join(tmpDir, '.ai', 'skills', 'programming.md');
    await fs.rename(oldPath, newPath);

    await syncCommand(
      'claude',
      { source: '.ai', force: true },
      tmpDir,
      nodeFs,
      registry,
    );

    expect(
      await pathExists(
        path.join(tmpDir, '.claude', 'skills', 'coding.md'),
      ),
    ).toBe(false);
    expect(
      await isSymlink(
        path.join(tmpDir, '.claude', 'skills', 'programming.md'),
      ),
    ).toBe(true);
  });

  it('should work with custom source directory', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir, '.my-ai');

    const result = await syncCommand(
      'claude',
      { source: '.my-ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    expect(result.created).toBeGreaterThan(0);
    expect(await isSymlink(path.join(tmpDir, 'CLAUDE.md'))).toBe(true);
  });
});
