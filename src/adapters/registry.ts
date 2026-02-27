import type { IdeAdapter } from '@adapters/types';
import { builtinAdapters } from '@adapters/builtins/index';

export class AdapterRegistry {
  private adapters = new Map<string, IdeAdapter>();

  constructor() {
    for (const adapter of builtinAdapters) {
      this.register(adapter);
    }
  }

  register(adapter: IdeAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  get(id: string): IdeAdapter | undefined {
    return this.adapters.get(id);
  }

  has(id: string): boolean {
    return this.adapters.has(id);
  }

  list(): IdeAdapter[] {
    return Array.from(this.adapters.values());
  }

  ids(): string[] {
    return Array.from(this.adapters.keys());
  }
}
