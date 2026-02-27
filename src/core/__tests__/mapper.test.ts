import { computeMappings } from '@core/mapper';
import type { IdeAdapter } from '@adapters/types';
import type { SourceItems } from '@core/types';

const testAdapter: IdeAdapter = {
  id: 'test',
  name: 'Test IDE',
  description: 'Test adapter',
  rootDocs: [{ source: 'AGENTS.md', target: 'TEST.md' }],
  skills: { dir: '.test/skills' },
  agents: { dir: '.test/agents' },
  commands: { dir: '.test/commands' },
};

describe('computeMappings', () => {
  it('should map root docs', () => {
    const items: SourceItems = {
      rootDocs: ['AGENTS.md'],
      skills: [],
      agents: [],
      commands: [],
    };

    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      items,
      testAdapter,
    );
    expect(mappings).toHaveLength(1);
    expect(mappings[0].source).toBe('/project/.ai/AGENTS.md');
    expect(mappings[0].target).toBe('/project/TEST.md');
    expect(mappings[0].category).toBe('rootDocs');
  });

  it('should map skills', () => {
    const items: SourceItems = {
      rootDocs: [],
      skills: ['react.md', 'testing.md'],
      agents: [],
      commands: [],
    };

    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      items,
      testAdapter,
    );
    expect(mappings).toHaveLength(2);
    expect(mappings[0].target).toBe('/project/.test/skills/react.md');
    expect(mappings[1].target).toBe('/project/.test/skills/testing.md');
  });

  it('should map all categories', () => {
    const items: SourceItems = {
      rootDocs: ['AGENTS.md'],
      skills: ['s1.md'],
      agents: ['a1.md'],
      commands: ['c1.md'],
    };

    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      items,
      testAdapter,
    );
    expect(mappings).toHaveLength(4);
  });

  it('should skip missing root docs', () => {
    const items: SourceItems = {
      rootDocs: ['OTHER.md'],
      skills: [],
      agents: [],
      commands: [],
    };

    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      items,
      testAdapter,
    );
    expect(mappings).toHaveLength(0);
  });

  it('should apply filename transform', () => {
    const adapter: IdeAdapter = {
      ...testAdapter,
      skills: {
        dir: '.test/skills',
        transform: (f) => f.replace('.md', '.mdc'),
      },
    };
    const items: SourceItems = {
      rootDocs: [],
      skills: ['react.md'],
      agents: [],
      commands: [],
    };

    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      items,
      adapter,
    );
    expect(mappings[0].target).toBe('/project/.test/skills/react.mdc');
  });

  it('should handle nested files in categories', () => {
    const items: SourceItems = {
      rootDocs: [],
      skills: ['frontend/react.md'],
      agents: [],
      commands: [],
    };

    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      items,
      testAdapter,
    );
    expect(mappings[0].source).toBe('/project/.ai/skills/frontend/react.md');
    expect(mappings[0].target).toBe(
      '/project/.test/skills/frontend/react.md',
    );
  });

  it('should skip categories not supported by adapter', () => {
    const adapter: IdeAdapter = {
      id: 'minimal',
      name: 'Minimal',
      description: 'Minimal adapter',
      rootDocs: [{ source: 'AGENTS.md', target: 'AGENTS.md' }],
    };
    const items: SourceItems = {
      rootDocs: ['AGENTS.md'],
      skills: ['s1.md'],
      agents: ['a1.md'],
      commands: ['c1.md'],
    };

    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      items,
      adapter,
    );
    expect(mappings).toHaveLength(1);
    expect(mappings[0].category).toBe('rootDocs');
  });
});
