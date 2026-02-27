import * as fs from 'node:fs/promises';
import * as nodePath from 'node:path';

export interface FsStats {
  isFile(): boolean;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
}

export interface FileSystem {
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
  readdir(dirPath: string): Promise<string[]>;
  lstat(filePath: string): Promise<FsStats>;
  symlink(target: string, linkPath: string): Promise<void>;
  readlink(linkPath: string): Promise<string>;
  unlink(filePath: string): Promise<void>;
  mkdir(dirPath: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
}

export const nodeFs: FileSystem = {
  readFile: (p) => fs.readFile(p, 'utf-8'),
  writeFile: async (p, c) => {
    await fs.mkdir(nodePath.dirname(p), { recursive: true });
    await fs.writeFile(p, c, 'utf-8');
  },
  readdir: (p) => fs.readdir(p),
  lstat: (p) => fs.lstat(p),
  symlink: (t, p) => fs.symlink(t, p),
  readlink: (p) => fs.readlink(p),
  unlink: (p) => fs.unlink(p),
  mkdir: (p) => fs.mkdir(p, { recursive: true }).then(() => {}),
  exists: async (p) => {
    try {
      await fs.lstat(p);
      return true;
    } catch {
      return false;
    }
  },
};
