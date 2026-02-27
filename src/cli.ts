import { Command } from 'commander';
import { nodeFs } from '@core/fs';
import { AdapterRegistry } from '@adapters/registry';
import { initCommand } from '@commands/init';
import { syncCommand } from '@commands/sync';
import { unlinkCommand } from '@commands/unlink';
import { doctorCommand } from '@commands/doctor';

const KNOWN_COMMANDS = ['init', 'sync', 'unlink', 'doctor', 'help'];

const firstArg = process.argv[2];
if (
  firstArg &&
  !firstArg.startsWith('-') &&
  !KNOWN_COMMANDS.includes(firstArg)
) {
  process.argv.splice(2, 0, 'sync');
}

const registry = new AdapterRegistry();
const projectRoot = process.cwd();

const program = new Command();

program
  .name('ag')
  .description(
    'Manage symlinks from .ai to agentic IDE configurations.\n\n' +
      `Available targets: ${registry.ids().join(', ')}`,
  )
  .version('0.1.0');

program
  .command('init')
  .description('Initialize the source directory structure')
  .option('-s, --source <path>', 'Source directory name', '.ai')
  .action(async (opts) => {
    try {
      await initCommand(opts, projectRoot, nodeFs);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

program
  .command('sync <target>')
  .description(
    'Sync symlinks for a target IDE (detect changes, clean stale, relink)',
  )
  .option('-s, --source <path>', 'Source directory name', '.ai')
  .option('-f, --force', 'Force sync even if no changes detected')
  .action(async (target, opts) => {
    try {
      const result = await syncCommand(
        target,
        opts,
        projectRoot,
        nodeFs,
        registry,
      );
      if (result.skipped) {
        console.log('Already up to date.');
      } else {
        console.log(
          `Sync complete: ${result.created} created, ${result.removed} removed, ${result.unchanged} unchanged.`,
        );
        if (result.errors.length > 0) {
          for (const e of result.errors) {
            console.error(`  Error: ${e.path} - ${e.message}`);
          }
          process.exitCode = 1;
        }
      }
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

program
  .command('unlink <target>')
  .description('Remove all managed symlinks for a target IDE')
  .option('-s, --source <path>', 'Source directory name', '.ai')
  .action(async (target, opts) => {
    try {
      await unlinkCommand(target, opts, projectRoot, nodeFs, registry);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

program
  .command('doctor')
  .description('Check health of managed symlinks')
  .option('-s, --source <path>', 'Source directory name', '.ai')
  .action(async (opts) => {
    try {
      await doctorCommand(opts, projectRoot, nodeFs, registry);
    } catch (err: unknown) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exitCode = 1;
    }
  });

program.parse();
