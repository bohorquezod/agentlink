import { AdapterRegistry } from '@adapters/registry';

describe('AdapterRegistry', () => {
  it('should include all built-in adapters', () => {
    const registry = new AdapterRegistry();
    expect(registry.has('claude')).toBe(true);
    expect(registry.has('cursor')).toBe(true);
    expect(registry.has('codex')).toBe(true);
    expect(registry.has('opencode')).toBe(true);
    expect(registry.has('windsurf')).toBe(true);
  });

  it('should list all adapter ids', () => {
    const registry = new AdapterRegistry();
    const ids = registry.ids();
    expect(ids).toContain('claude');
    expect(ids).toContain('cursor');
    expect(ids.length).toBeGreaterThanOrEqual(5);
  });

  it('should register custom adapters', () => {
    const registry = new AdapterRegistry();
    registry.register({
      id: 'custom',
      name: 'Custom IDE',
      description: 'A custom IDE',
      rootDocs: [{ source: 'AGENTS.md', target: 'CUSTOM.md' }],
    });

    expect(registry.has('custom')).toBe(true);
    expect(registry.get('custom')?.name).toBe('Custom IDE');
  });

  it('should return undefined for unknown adapters', () => {
    const registry = new AdapterRegistry();
    expect(registry.get('nonexistent')).toBeUndefined();
  });

  it('should list all adapters as objects', () => {
    const registry = new AdapterRegistry();
    const all = registry.list();
    expect(all.length).toBeGreaterThanOrEqual(5);
    for (const a of all) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.rootDocs.length).toBeGreaterThan(0);
    }
  });
});
