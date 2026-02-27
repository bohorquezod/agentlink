import * as path from 'node:path';
import type { FileSystem } from '@core/fs';
import type { AdapterRegistry } from '@adapters/registry';
import { loadState } from '@core/state';

export interface DoctorOptions {
  source: string;
}

export interface TargetReport {
  total: number;
  healthy: number;
  broken: number;
  missing: number;
  issues: string[];
}

export interface DoctorReport {
  sourceExists: boolean;
  stateExists: boolean;
  targets: Record<string, TargetReport>;
}

export async function doctorCommand(
  options: DoctorOptions,
  projectRoot: string,
  fs: FileSystem,
  _registry: AdapterRegistry,
): Promise<DoctorReport> {
  const sourceDir = path.resolve(projectRoot, options.source);
  const statePath = path.join(sourceDir, '.agentlink-state.json');

  const report: DoctorReport = {
    sourceExists: await fs.exists(sourceDir),
    stateExists: await fs.exists(statePath),
    targets: {},
  };

  if (!report.sourceExists) {
    console.log(`Source directory not found: ${options.source}`);
    console.log('Run "ag init" to create it.');
    return report;
  }

  if (!report.stateExists) {
    console.log('No sync state found. Run "ag <target>" to create symlinks.');
    return report;
  }

  const state = await loadState(fs, statePath);

  for (const [targetId, targetState] of Object.entries(state.targets)) {
    const targetReport: TargetReport = {
      total: targetState.mappings.length,
      healthy: 0,
      broken: 0,
      missing: 0,
      issues: [],
    };

    for (const mapping of targetState.mappings) {
      const absTarget = path.resolve(projectRoot, mapping.target);
      const absSource = path.resolve(projectRoot, mapping.source);

      if (!(await fs.exists(absTarget))) {
        targetReport.missing++;
        targetReport.issues.push(`Missing symlink: ${mapping.target}`);
        continue;
      }

      try {
        const stat = await fs.lstat(absTarget);
        if (!stat.isSymbolicLink()) {
          targetReport.broken++;
          targetReport.issues.push(`Not a symlink: ${mapping.target}`);
          continue;
        }

        const linkTarget = await fs.readlink(absTarget);
        const resolved = path.resolve(
          path.dirname(absTarget),
          linkTarget,
        );

        if (resolved !== absSource) {
          targetReport.broken++;
          targetReport.issues.push(
            `Wrong target: ${mapping.target} -> ${linkTarget} (expected source: ${mapping.source})`,
          );
          continue;
        }

        if (!(await fs.exists(absSource))) {
          targetReport.broken++;
          targetReport.issues.push(
            `Dangling symlink: ${mapping.target} (source missing: ${mapping.source})`,
          );
          continue;
        }

        targetReport.healthy++;
      } catch {
        targetReport.broken++;
        targetReport.issues.push(`Error checking: ${mapping.target}`);
      }
    }

    report.targets[targetId] = targetReport;
  }

  for (const [targetId, tr] of Object.entries(report.targets)) {
    console.log(`\n[${targetId}] ${tr.healthy}/${tr.total} healthy`);
    if (tr.missing > 0) console.log(`  ${tr.missing} missing`);
    if (tr.broken > 0) console.log(`  ${tr.broken} broken`);
    for (const issue of tr.issues) {
      console.log(`  - ${issue}`);
    }
  }

  return report;
}
