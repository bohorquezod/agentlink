import * as path from 'node:path';
import type { FileSystem, FsStats } from '@core/fs';

interface FsEntry {
  type: 'file' | 'dir' | 'symlink';
  content?: string;
  symlinkTarget?: string;
}

export class MockFs implements FileSystem {
  private entries = new Map<string, FsEntry>();

  constructor() {
    this.entries.set('/', { type: 'dir' });
  }

  addFile(filePath: string, content: string): void {
    this.ensureParentDirs(filePath);
    this.entries.set(path.resolve(filePath), { type: 'file', content });
  }

  addDir(dirPath: string): void {
    const resolved = path.resolve(dirPath);
    this.entries.set(resolved, { type: 'dir' });
    const parent = path.dirname(resolved);
    if (parent !== resolved && !this.entries.has(parent)) {
      this.addDir(parent);
    }
  }

  addSymlink(linkPath: string, target: string): void {
    this.ensureParentDirs(linkPath);
    this.entries.set(path.resolve(linkPath), {
      type: 'symlink',
      symlinkTarget: target,
    });
  }

  getEntry(filePath: string): FsEntry | undefined {
    return this.entries.get(path.resolve(filePath));
  }

  private ensureParentDirs(filePath: string): void {
    const resolved = path.resolve(filePath);
    const parent = path.dirname(resolved);
    if (parent !== resolved && !this.entries.has(parent)) {
      this.addDir(parent);
    }
  }

  async readFile(filePath: string): Promise<string> {
    const resolved = path.resolve(filePath);
    const entry = this.entries.get(resolved);
    if (!entry) throw new Error(`ENOENT: ${filePath}`);
    if (entry.type === 'symlink') {
      const target = path.resolve(
        path.dirname(resolved),
        entry.symlinkTarget!,
      );
      return this.readFile(target);
    }
    if (entry.type !== 'file') throw new Error(`EISDIR: ${filePath}`);
    return entry.content ?? '';
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    this.ensureParentDirs(filePath);
    this.entries.set(path.resolve(filePath), { type: 'file', content });
  }

  async readdir(dirPath: string): Promise<string[]> {
    const resolved = path.resolve(dirPath);
    const entry = this.entries.get(resolved);
    if (!entry || entry.type !== 'dir')
      throw new Error(`ENOTDIR: ${dirPath}`);

    const prefix = resolved === '/' ? '/' : resolved + '/';
    const results: string[] = [];

    for (const [key] of this.entries) {
      if (key === resolved) continue;
      if (!key.startsWith(prefix)) continue;
      const rest = key.slice(prefix.length);
      if (!rest.includes('/')) {
        results.push(rest);
      }
    }

    return results.sort();
  }

  async lstat(filePath: string): Promise<FsStats> {
    const resolved = path.resolve(filePath);
    const entry = this.entries.get(resolved);
    if (!entry) throw new Error(`ENOENT: ${filePath}`);

    return {
      isFile: () => entry.type === 'file',
      isDirectory: () => entry.type === 'dir',
      isSymbolicLink: () => entry.type === 'symlink',
    };
  }

  async symlink(target: string, linkPath: string): Promise<void> {
    this.ensureParentDirs(linkPath);
    this.entries.set(path.resolve(linkPath), {
      type: 'symlink',
      symlinkTarget: target,
    });
  }

  async readlink(linkPath: string): Promise<string> {
    const resolved = path.resolve(linkPath);
    const entry = this.entries.get(resolved);
    if (!entry || entry.type !== 'symlink')
      throw new Error(`EINVAL: ${linkPath}`);
    return entry.symlinkTarget!;
  }

  async unlink(filePath: string): Promise<void> {
    const resolved = path.resolve(filePath);
    const entry = this.entries.get(resolved);
    if (!entry) throw new Error(`ENOENT: ${filePath}`);
    this.entries.delete(resolved);
  }

  async mkdir(dirPath: string): Promise<void> {
    const resolved = path.resolve(dirPath);
    const parts = resolved.split('/').filter(Boolean);
    let current = '/';
    for (const part of parts) {
      current = path.join(current, part);
      if (!this.entries.has(current)) {
        this.entries.set(current, { type: 'dir' });
      }
    }
  }

  async exists(filePath: string): Promise<boolean> {
    return this.entries.has(path.resolve(filePath));
  }
}
