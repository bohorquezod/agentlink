import { MockFs } from '@test/helpers/mock-fs';
import { syncCommand } from '@commands/sync';
import { AdapterRegistry } from '@adapters/registry';

function setupProject(fs: MockFs): void {
  fs.addDir('/project/.ai');
  fs.addFile('/project/.ai/AGENTS.md', '# Agents');
  fs.addDir('/project/.ai/skills');
  fs.addFile('/project/.ai/skills/react.md', '# React');
  fs.addDir('/project/.ai/agents');
  fs.addDir('/project/.ai/commands');
}

describe('syncCommand', () => {
  it('should create symlinks for a target', async () => {
    const fs = new MockFs();
    setupProject(fs);

    const registry = new AdapterRegistry();
    const result = await syncCommand(
      'claude',
      { source: '.ai' },
      '/project',
      fs,
      registry,
    );

    expect(result.skipped).toBe(false);
    expect(result.created).toBeGreaterThan(0);
    expect(result.errors).toHaveLength(0);

    expect(await fs.exists('/project/CLAUDE.md')).toBe(true);
    expect(await fs.exists('/project/.claude/skills/react.md')).toBe(true);
  });

  it('should skip when no changes', async () => {
    const fs = new MockFs();
    setupProject(fs);

    const registry = new AdapterRegistry();

    await syncCommand('claude', { source: '.ai' }, '/project', fs, registry);
    const result2 = await syncCommand(
      'claude',
      { source: '.ai' },
      '/project',
      fs,
      registry,
    );

    expect(result2.skipped).toBe(true);
  });

  it('should force sync even without changes', async () => {
    const fs = new MockFs();
    setupProject(fs);

    const registry = new AdapterRegistry();

    await syncCommand('claude', { source: '.ai' }, '/project', fs, registry);
    const result2 = await syncCommand(
      'claude',
      { source: '.ai', force: true },
      '/project',
      fs,
      registry,
    );

    expect(result2.skipped).toBe(false);
  });

  it('should throw for unknown target', async () => {
    const fs = new MockFs();
    setupProject(fs);

    const registry = new AdapterRegistry();

    await expect(
      syncCommand('unknown', { source: '.ai' }, '/project', fs, registry),
    ).rejects.toThrow('Unknown target');
  });

  it('should clean stale links on re-sync', async () => {
    const fs = new MockFs();
    setupProject(fs);

    const registry = new AdapterRegistry();

    await syncCommand('claude', { source: '.ai' }, '/project', fs, registry);
    expect(await fs.exists('/project/.claude/skills/react.md')).toBe(true);

    await fs.unlink('/project/.ai/skills/react.md');

    const result = await syncCommand(
      'claude',
      { source: '.ai', force: true },
      '/project',
      fs,
      registry,
    );
    expect(result.removed).toBeGreaterThan(0);
    expect(await fs.exists('/project/.claude/skills/react.md')).toBe(false);
  });

  it('should work with custom source dir', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.my-ai');
    fs.addFile('/project/.my-ai/AGENTS.md', '# Agents');
    fs.addDir('/project/.my-ai/skills');
    fs.addDir('/project/.my-ai/agents');
    fs.addDir('/project/.my-ai/commands');

    const registry = new AdapterRegistry();
    const result = await syncCommand(
      'claude',
      { source: '.my-ai' },
      '/project',
      fs,
      registry,
    );

    expect(result.created).toBeGreaterThan(0);
    expect(await fs.exists('/project/CLAUDE.md')).toBe(true);
  });
});
