import { MockFs } from '@test/helpers/mock-fs';
import {
  loadState,
  saveState,
  hashFile,
  hasChanges,
  computeStoredMappings,
} from '@core/state';
import type { StoredMapping, LinkMapping } from '@core/types';

describe('loadState', () => {
  it('should return default state when file does not exist', async () => {
    const fs = new MockFs();
    const state = await loadState(
      fs,
      '/project/.ai/.agentlink-state.json',
    );
    expect(state.version).toBe(1);
    expect(state.targets).toEqual({});
  });

  it('should load existing state', async () => {
    const fs = new MockFs();
    fs.addFile(
      '/project/.ai/.agentlink-state.json',
      JSON.stringify({
        version: 1,
        targets: {
          claude: { lastSync: '2024-01-01T00:00:00Z', mappings: [] },
        },
      }),
    );

    const state = await loadState(
      fs,
      '/project/.ai/.agentlink-state.json',
    );
    expect(state.targets.claude).toBeDefined();
  });

  it('should return default state on invalid JSON', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.ai/.agentlink-state.json', 'invalid json');

    const state = await loadState(
      fs,
      '/project/.ai/.agentlink-state.json',
    );
    expect(state.version).toBe(1);
    expect(state.targets).toEqual({});
  });
});

describe('saveState', () => {
  it('should persist state', async () => {
    const fs = new MockFs();
    const state = {
      version: 1,
      targets: { claude: { lastSync: 'now', mappings: [] as StoredMapping[] } },
    };

    await saveState(fs, '/project/.ai/.agentlink-state.json', state);

    const content = await fs.readFile(
      '/project/.ai/.agentlink-state.json',
    );
    expect(JSON.parse(content)).toEqual(state);
  });
});

describe('hashFile', () => {
  it('should return consistent hash', async () => {
    const fs = new MockFs();
    fs.addFile('/file.md', '# Hello');

    const h1 = await hashFile(fs, '/file.md');
    const h2 = await hashFile(fs, '/file.md');
    expect(h1).toBe(h2);
    expect(h1).toHaveLength(64);
  });

  it('should return different hash for different content', async () => {
    const fs = new MockFs();
    fs.addFile('/a.md', 'aaa');
    fs.addFile('/b.md', 'bbb');

    const ha = await hashFile(fs, '/a.md');
    const hb = await hashFile(fs, '/b.md');
    expect(ha).not.toBe(hb);
  });
});

describe('hasChanges', () => {
  it('should return false for identical mappings', () => {
    const a: StoredMapping[] = [
      { source: '.ai/AGENTS.md', target: 'CLAUDE.md', sourceHash: 'aaa' },
    ];
    expect(hasChanges(a, [...a])).toBe(false);
  });

  it('should return true for different hashes', () => {
    const prev: StoredMapping[] = [
      { source: '.ai/AGENTS.md', target: 'CLAUDE.md', sourceHash: 'aaa' },
    ];
    const curr: StoredMapping[] = [
      { source: '.ai/AGENTS.md', target: 'CLAUDE.md', sourceHash: 'bbb' },
    ];
    expect(hasChanges(prev, curr)).toBe(true);
  });

  it('should return true for different lengths', () => {
    const prev: StoredMapping[] = [
      { source: '.ai/AGENTS.md', target: 'CLAUDE.md', sourceHash: 'aaa' },
    ];
    expect(hasChanges(prev, [])).toBe(true);
  });

  it('should return true for different mappings', () => {
    const prev: StoredMapping[] = [
      {
        source: '.ai/skills/old.md',
        target: '.claude/skills/old.md',
        sourceHash: 'aaa',
      },
    ];
    const curr: StoredMapping[] = [
      {
        source: '.ai/skills/new.md',
        target: '.claude/skills/new.md',
        sourceHash: 'aaa',
      },
    ];
    expect(hasChanges(prev, curr)).toBe(true);
  });
});

describe('computeStoredMappings', () => {
  it('should compute hashes for all mappings', async () => {
    const fs = new MockFs();
    fs.addFile('/project/.ai/AGENTS.md', '# Agents');
    fs.addFile('/project/.ai/skills/react.md', '# React');

    const mappings: LinkMapping[] = [
      {
        source: '/project/.ai/AGENTS.md',
        target: '/project/CLAUDE.md',
        category: 'rootDocs',
      },
      {
        source: '/project/.ai/skills/react.md',
        target: '/project/.claude/skills/react.md',
        category: 'skills',
      },
    ];

    const stored = await computeStoredMappings(fs, '/project', mappings);
    expect(stored).toHaveLength(2);
    expect(stored[0].source).toBe('.ai/AGENTS.md');
    expect(stored[0].target).toBe('CLAUDE.md');
    expect(stored[0].sourceHash).toHaveLength(64);
  });
});
