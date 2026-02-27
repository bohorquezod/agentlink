import { MockFs } from '@test/helpers/mock-fs';
import { scanSourceDir } from '@core/scanner';

describe('scanSourceDir', () => {
  it('should scan root docs', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.ai');
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');
    fs.addDir('/project/.ai/skills');
    fs.addDir('/project/.ai/agents');
    fs.addDir('/project/.ai/commands');

    const items = await scanSourceDir(fs, '/project/.ai');
    expect(items.rootDocs).toEqual(['AGENTS.md']);
  });

  it('should scan skills', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.ai');
    fs.addDir('/project/.ai/skills');
    fs.addFile('/project/.ai/skills/react.md', '# React');
    fs.addFile('/project/.ai/skills/testing.md', '# Testing');
    fs.addDir('/project/.ai/agents');
    fs.addDir('/project/.ai/commands');

    const items = await scanSourceDir(fs, '/project/.ai');
    expect(items.skills).toEqual(['react.md', 'testing.md']);
  });

  it('should scan recursively within categories', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.ai');
    fs.addDir('/project/.ai/skills');
    fs.addDir('/project/.ai/skills/frontend');
    fs.addFile('/project/.ai/skills/frontend/react.md', '# React');
    fs.addFile('/project/.ai/skills/api.md', '# API');
    fs.addDir('/project/.ai/agents');
    fs.addDir('/project/.ai/commands');

    const items = await scanSourceDir(fs, '/project/.ai');
    expect(items.skills).toEqual(['api.md', 'frontend/react.md']);
  });

  it('should ignore dotfiles', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.ai');
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');
    fs.addFile('/project/.ai/.agentlink-state.json', '{}');
    fs.addDir('/project/.ai/skills');
    fs.addDir('/project/.ai/agents');
    fs.addDir('/project/.ai/commands');

    const items = await scanSourceDir(fs, '/project/.ai');
    expect(items.rootDocs).toEqual(['AGENTS.md']);
  });

  it('should throw if source dir does not exist', async () => {
    const fs = new MockFs();
    await expect(scanSourceDir(fs, '/project/.ai')).rejects.toThrow(
      'Source directory not found',
    );
  });

  it('should handle missing category directories gracefully', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.ai');
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');

    const items = await scanSourceDir(fs, '/project/.ai');
    expect(items.skills).toEqual([]);
    expect(items.agents).toEqual([]);
    expect(items.commands).toEqual([]);
  });

  it('should scan all categories', async () => {
    const fs = new MockFs();
    fs.addDir('/project/.ai');
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');
    fs.addDir('/project/.ai/skills');
    fs.addFile('/project/.ai/skills/coding.md', '# Coding');
    fs.addDir('/project/.ai/agents');
    fs.addFile('/project/.ai/agents/reviewer.md', '# Reviewer');
    fs.addDir('/project/.ai/commands');
    fs.addFile('/project/.ai/commands/deploy.md', '# Deploy');

    const items = await scanSourceDir(fs, '/project/.ai');
    expect(items.rootDocs).toEqual(['AGENTS.md']);
    expect(items.skills).toEqual(['coding.md']);
    expect(items.agents).toEqual(['reviewer.md']);
    expect(items.commands).toEqual(['deploy.md']);
  });
});
