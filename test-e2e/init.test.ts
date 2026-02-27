import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { createTempDir, cleanupTempDir } from './helpers.js';
import { nodeFs } from '@core/fs';
import { initCommand } from '@commands/init';

describe('E2E: init', () => {
  let tmpDir: string;

  afterEach(async () => {
    if (tmpDir) await cleanupTempDir(tmpDir);
  });

  it('should create .ai directory with full structure', async () => {
    tmpDir = await createTempDir();

    await initCommand({ source: '.ai' }, tmpDir, nodeFs);

    const aiDir = path.join(tmpDir, '.ai');
    expect((await fs.stat(aiDir)).isDirectory()).toBe(true);
    expect(
      (await fs.stat(path.join(aiDir, 'skills'))).isDirectory(),
    ).toBe(true);
    expect(
      (await fs.stat(path.join(aiDir, 'agents'))).isDirectory(),
    ).toBe(true);
    expect(
      (await fs.stat(path.join(aiDir, 'commands'))).isDirectory(),
    ).toBe(true);

    const agentsMd = await fs.readFile(
      path.join(aiDir, 'AGENTS.md'),
      'utf-8',
    );
    expect(agentsMd).toContain('Agent');
  });

  it('should create with custom source name', async () => {
    tmpDir = await createTempDir();

    await initCommand({ source: '.my-ai' }, tmpDir, nodeFs);

    expect(
      (await fs.stat(path.join(tmpDir, '.my-ai'))).isDirectory(),
    ).toBe(true);
    expect(
      (await fs.stat(path.join(tmpDir, '.my-ai', 'AGENTS.md'))).isFile(),
    ).toBe(true);
  });

  it('should be idempotent and preserve user content', async () => {
    tmpDir = await createTempDir();

    await initCommand({ source: '.ai' }, tmpDir, nodeFs);
    await fs.writeFile(
      path.join(tmpDir, '.ai', 'AGENTS.md'),
      '# Custom',
    );

    await initCommand({ source: '.ai' }, tmpDir, nodeFs);

    const content = await fs.readFile(
      path.join(tmpDir, '.ai', 'AGENTS.md'),
      'utf-8',
    );
    expect(content).toBe('# Custom');
  });
});
