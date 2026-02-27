import { MockFs } from '@test/helpers/mock-fs';
import { reconcileStaleLinks } from '@core/reconciler';
import type { LinkMapping, StoredMapping } from '@core/types';

describe('reconcileStaleLinks', () => {
  it('should remove symlinks no longer in current mappings', async () => {
    const fs = new MockFs();
    fs.addSymlink('/project/CLAUDE.md', '.ai/AGENTS.md');
    fs.addSymlink(
      '/project/.claude/skills/old-skill.md',
      '../../.ai/skills/old-skill.md',
    );

    const previous: StoredMapping[] = [
      { source: '.ai/AGENTS.md', target: 'CLAUDE.md', sourceHash: 'aaa' },
      {
        source: '.ai/skills/old-skill.md',
        target: '.claude/skills/old-skill.md',
        sourceHash: 'bbb',
      },
    ];

    const current: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
    ];

    const { removed } = await reconcileStaleLinks(
      fs,
      '/project',
      previous,
      current,
    );
    expect(removed).toEqual(['.claude/skills/old-skill.md']);
    expect(
      await fs.exists('/project/.claude/skills/old-skill.md'),
    ).toBe(false);
  });

  it('should not remove links still in current mappings', async () => {
    const fs = new MockFs();
    fs.addSymlink('/project/CLAUDE.md', '.ai/AGENTS.md');

    const previous: StoredMapping[] = [
      { source: '.ai/AGENTS.md', target: 'CLAUDE.md', sourceHash: 'aaa' },
    ];

    const current: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
    ];

    const { removed } = await reconcileStaleLinks(
      fs,
      '/project',
      previous,
      current,
    );
    expect(removed).toHaveLength(0);
    expect(await fs.exists('/project/CLAUDE.md')).toBe(true);
  });

  it('should not remove non-symlink files', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.claude/skills/manual.md', '# Manual');

    const previous: StoredMapping[] = [
      {
        source: '.ai/skills/manual.md',
        target: '.claude/skills/manual.md',
        sourceHash: 'aaa',
      },
    ];

    const current: LinkMapping[] = [];

    const { removed } = await reconcileStaleLinks(
      fs,
      '/project',
      previous,
      current,
    );
    expect(removed).toHaveLength(0);
    expect(await fs.exists('/project/.claude/skills/manual.md')).toBe(true);
  });

  it('should handle empty previous state', async () => {
    const fs = new MockFs();

    const current: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
    ];

    const { removed } = await reconcileStaleLinks(
      fs,
      '/project',
      [],
      current,
    );
    expect(removed).toHaveLength(0);
  });
});
