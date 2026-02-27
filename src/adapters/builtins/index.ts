import type { IdeAdapter } from '@adapters/types';
import { claudeAdapter } from '@adapters/builtins/claude';
import { cursorAdapter } from '@adapters/builtins/cursor';
import { codexAdapter } from '@adapters/builtins/codex';
import { opencodeAdapter } from '@adapters/builtins/opencode';
import { windsurfAdapter } from '@adapters/builtins/windsurf';

export const builtinAdapters: IdeAdapter[] = [
  claudeAdapter,
  cursorAdapter,
  codexAdapter,
  opencodeAdapter,
  windsurfAdapter,
];
