import { MockFs } from '@test/helpers/mock-fs';
import { createSymlinks, removeSymlinks } from '@core/linker';
import type { LinkMapping } from '@core/types';

describe('createSymlinks', () => {
  it('should create a symlink', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');

    const mappings: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
    ];

    const result = await createSymlinks(fs, mappings);
    expect(result.created).toHaveLength(1);
    expect(result.errors).toHaveLength(0);

    const entry = fs.getEntry('/project/CLAUDE.md');
    expect(entry?.type).toBe('symlink');
  });

  it('should replace existing symlink', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');
    fs.addSymlink('/project/CLAUDE.md', 'old-target');

    const mappings: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
    ];

    const result = await createSymlinks(fs, mappings);
    expect(result.created).toHaveLength(1);
  });

  it('should skip non-symlink existing files', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');
    fs.addFile('/project/CLAUDE.md', '# Existing file');

    const mappings: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
    ];

    const result = await createSymlinks(fs, mappings);
    expect(result.created).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toContain('not a symlink');
  });

  it('should create parent directories', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.ai/skills/react.md', '# React');

    const mappings: LinkMapping[] = [
      {
        source: '/project/.ai/skills/react.md',
        target: '/project/.claude/skills/react.md',
        category: 'skills',
      },
    ];

    const result = await createSymlinks(fs, mappings);
    expect(result.created).toHaveLength(1);
    expect(await fs.exists('/project/.claude/skills')).toBe(true);
  });

  it('should skip if symlink already points to correct source', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');
    fs.addSymlink('/project/CLAUDE.md', '.ai/AGENTS.md');

    const mappings: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
    ];

    const result = await createSymlinks(fs, mappings);
    expect(result.created).toHaveLength(0);
    expect(result.errors).toHaveLength(0);
  });
});

describe('removeSymlinks', () => {
  it('should remove symlinks', async () => {
    const fs = new MockFs();
    fs.addSymlink('/project/CLAUDE.md', '../.ai/AGENTS.md');

    const { removed } = await removeSymlinks(fs, ['/project/CLAUDE.md']);
    expect(removed).toHaveLength(1);
    expect(await fs.exists('/project/CLAUDE.md')).toBe(false);
  });

  it('should skip non-existent targets', async () => {
    const fs = new MockFs();
    const { removed } = await removeSymlinks(fs, ['/project/CLAUDE.md']);
    expect(removed).toHaveLength(0);
  });

  it('should not remove regular files', async () => {
    const fs = new MockFs();
    fs.addFile('/project/CLAUDE.md', '# Real file');

    const { removed } = await removeSymlinks(fs, ['/project/CLAUDE.md']);
    expect(removed).toHaveLength(0);
    expect(await fs.exists('/project/CLAUDE.md')).toBe(true);
  });
});
