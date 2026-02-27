import { MockFs } from '@test/helpers/mock-fs';
import { scaffoldSourceDir } from '@core/scaffold';

describe('scaffoldSourceDir', () => {
  it('should create full structure in empty state', async () => {
    const fs = new MockFs();

    const result = await scaffoldSourceDir(fs, '/project/.ai');

    expect(result.created.length).toBeGreaterThan(0);
    expect(await fs.exists('/project/.ai')).toBe(true);
    expect(await fs.exists('/project/.ai/AGENTS.md')).toBe(true);
    expect(await fs.exists('/project/.ai/skills')).toBe(true);
    expect(await fs.exists('/project/.ai/agents')).toBe(true);
    expect(await fs.exists('/project/.ai/commands')).toBe(true);
  });

  it('should not overwrite existing AGENTS.md', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.ai');
    fs.addFile('/project/.ai/AGENTS.md', '# Custom content');

    await scaffoldSourceDir(fs, '/project/.ai');

    const content = await fs.readFile('/project/.ai/AGENTS.md');
    expect(content).toBe('# Custom content');
  });

  it('should be idempotent', async () => {
    const fs = new MockFs();

    const r1 = await scaffoldSourceDir(fs, '/project/.ai');
    const r2 = await scaffoldSourceDir(fs, '/project/.ai');

    expect(r1.created.length).toBeGreaterThan(0);
    expect(r2.created.length).toBe(0);
  });

  it('should work with custom source dir name', async () => {
    const fs = new MockFs();

    await scaffoldSourceDir(fs, '/project/.my-ai');

    expect(await fs.exists('/project/.my-ai')).toBe(true);
    expect(await fs.exists('/project/.my-ai/AGENTS.md')).toBe(true);
    expect(await fs.exists('/project/.my-ai/skills')).toBe(true);
  });
});
