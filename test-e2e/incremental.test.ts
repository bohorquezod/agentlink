import * as fs from 'node:fs/promises';
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

describe('E2E: incremental sync', () => {
  let tmpDir: string;
  const registry = new AdapterRegistry();

  afterEach(async () => {
    if (tmpDir) await cleanupTempDir(tmpDir);
  });

  it('should skip sync when nothing changed', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    const r1 = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r1.skipped).toBe(false);

    const r2 = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r2.skipped).toBe(true);
  });

  it('should detect content changes', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    await fs.writeFile(
      path.join(tmpDir, '.ai', 'AGENTS.md'),
      '# Updated content\n',
    );

    const r2 = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r2.skipped).toBe(false);
  });

  it('should detect new files', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    await fs.writeFile(
      path.join(tmpDir, '.ai', 'skills', 'new-skill.md'),
      '# New Skill\n',
    );

    const r2 = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r2.skipped).toBe(false);
    expect(r2.created).toBeGreaterThan(0);

    expect(
      await isSymlink(
        path.join(tmpDir, '.claude', 'skills', 'new-skill.md'),
      ),
    ).toBe(true);
  });

  it('should detect removed files', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    await fs.unlink(path.join(tmpDir, '.ai', 'skills', 'coding.md'));

    const r2 = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r2.skipped).toBe(false);
    expect(r2.removed).toBeGreaterThan(0);
  });

  it('should persist state across syncs', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );

    const statePath = path.join(
      tmpDir,
      '.ai',
      '.agentlink-state.json',
    );
    const stateContent = await fs.readFile(statePath, 'utf-8');
    const state = JSON.parse(stateContent);

    expect(state.version).toBe(1);
    expect(state.targets.claude).toBeDefined();
    expect(state.targets.claude.mappings.length).toBeGreaterThan(0);
  });

  it('should handle multiple targets independently', async () => {
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

    const r3 = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r3.skipped).toBe(true);

    await fs.writeFile(
      path.join(tmpDir, '.ai', 'AGENTS.md'),
      '# Changed\n',
    );

    const r4 = await syncCommand(
      'claude',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r4.skipped).toBe(false);

    const r5 = await syncCommand(
      'cursor',
      { source: '.ai' },
      tmpDir,
      nodeFs,
      registry,
    );
    expect(r5.skipped).toBe(false);
  });
});
