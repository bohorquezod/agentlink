import { builtinAdapters } from '@adapters/builtins/index';
import { computeMappings } from '@core/mapper';
import type { SourceItems } from '@core/types';

const fullItems: SourceItems = {
  rootDocs: ['AGENTS.md'],
  skills: ['coding.md'],
  agents: ['reviewer.md'],
  commands: ['deploy.md'],
};

describe('built-in adapters', () => {
  for (const adapter of builtinAdapters) {
    describe(adapter.id, () => {
      it('should have required fields', () => {
        expect(adapter.id).toBeTruthy();
        expect(adapter.name).toBeTruthy();
        expect(adapter.description).toBeTruthy();
        expect(adapter.rootDocs.length).toBeGreaterThan(0);
      });

      it('should produce valid mappings', () => {
        const mappings = computeMappings(
          '/project',
          '/project/.ai',
          fullItems,
          adapter,
        );
        expect(mappings.length).toBeGreaterThan(0);

        for (const m of mappings) {
          expect(m.source).toMatch(/^\/project\/.ai\//);
          expect(m.target).toMatch(/^\/project\//);
          expect(m.category).toBeTruthy();
        }
      });
    });
  }

  it('claude should map AGENTS.md to CLAUDE.md and agents to .claude/agents/', () => {
    const claude = builtinAdapters.find((a) => a.id === 'claude')!;
    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      fullItems,
      claude,
    );

    const rootDoc = mappings.find((m) => m.category === 'rootDocs');
    expect(rootDoc?.target).toBe('/project/CLAUDE.md');

    const agent = mappings.find((m) => m.category === 'agents');
    expect(agent?.target).toBe('/project/.claude/agents/reviewer.md');
  });

  it('cursor should map AGENTS.md at root', () => {
    const cursor = builtinAdapters.find((a) => a.id === 'cursor')!;
    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      fullItems,
      cursor,
    );

    const rootDoc = mappings.find((m) => m.category === 'rootDocs');
    expect(rootDoc?.target).toBe('/project/AGENTS.md');

    const agent = mappings.find((m) => m.category === 'agents');
    expect(agent?.target).toBe('/project/.cursor/agents/reviewer.md');

    const command = mappings.find((m) => m.category === 'commands');
    expect(command?.target).toBe('/project/.cursor/commands/deploy.md');
  });

  it('codex should map AGENTS.md at root', () => {
    const codex = builtinAdapters.find((a) => a.id === 'codex')!;
    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      fullItems,
      codex,
    );

    const rootDoc = mappings.find((m) => m.category === 'rootDocs');
    expect(rootDoc?.target).toBe('/project/AGENTS.md');
  });

  it('windsurf should map AGENTS.md into .windsurf/rules/', () => {
    const windsurf = builtinAdapters.find((a) => a.id === 'windsurf')!;
    const mappings = computeMappings(
      '/project',
      '/project/.ai',
      fullItems,
      windsurf,
    );

    const rootDoc = mappings.find((m) => m.category === 'rootDocs');
    expect(rootDoc?.target).toBe('/project/.windsurf/rules/AGENTS.md');
  });
});
