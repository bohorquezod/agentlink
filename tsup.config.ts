import { defineConfig } from 'tsup';
import * as path from 'node:path';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm'],
  dts: { entry: ['src/index.ts'] },
  clean: true,
  target: 'node18',
  esbuildOptions(options) {
    options.alias = {
      '@core': path.resolve('src/core'),
      '@adapters': path.resolve('src/adapters'),
      '@commands': path.resolve('src/commands'),
    };
  },
});
