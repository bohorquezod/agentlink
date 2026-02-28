---
name: create-e2e-tests
description: Creates end-to-end tests for agentlink CLI commands using real filesystem behavior and repository conventions. Use when the user asks to add, update, or review tests in test-e2e, especially for sync, unlink, init, state persistence, and symlink lifecycle behavior.
---

# Create E2E Tests

Create or update tests in `test-e2e/` following the established project pattern and real filesystem semantics.

## When to use
- Use this skill when adding e2e coverage for a CLI behavior change.
- Use this skill when reproducing a filesystem-related bug in an integration test.
- Use this skill when validating symlink creation/removal or incremental sync behavior.

## Constraints
1. E2E tests must use real filesystem operations (`node:fs/promises`) through temp directories.
2. Do not use `MockFs` in `test-e2e/`; that belongs to unit tests.
3. Keep tests isolated: create a fresh temp directory per test and clean it in `afterEach`.
4. Use project import conventions:
   - Relative import only for local helper file: `./helpers.js`
   - Path aliases for project modules: `@core/*`, `@adapters/*`, `@commands/*`
5. Keep all instructions and test code in English.

## Workflow

Copy this checklist and mark progress:

```text
E2E Test Task Progress:
- [ ] Step 1: Confirm scope belongs to e2e
- [ ] Step 2: Choose target e2e file
- [ ] Step 3: Implement isolated scenario
- [ ] Step 4: Add assertions for behavior and outputs
- [ ] Step 5: Run e2e tests and verify
```

### Step 1: Confirm scope belongs to e2e
Add or update `test-e2e` only when behavior depends on real filesystem effects:
- symlink resolution or cleanup
- state file persistence (`.agentlink-state.json`)
- directory creation and path behavior
- cross-target sync/unlink isolation

If the change is pure logic (mapping or hashing algorithms), prefer unit tests.

### Step 2: Choose target e2e file
Use the file that matches behavior:
- `test-e2e/init.test.ts` for scaffold/init behavior
- `test-e2e/sync.test.ts` for sync mapping and stale cleanup
- `test-e2e/incremental.test.ts` for unchanged/changed detection
- `test-e2e/unlink.test.ts` for managed link removal and isolation

Create a new `test-e2e/<command>.test.ts` only when adding a new command or clearly separate behavior.

### Step 3: Implement isolated scenario
Follow the existing structure:
1. `tmpDir = await createTempDir()` inside each `it(...)`.
2. `await setupAiDir(tmpDir)` (or custom source folder when required).
3. Execute command function (`syncCommand`, `unlinkCommand`, etc.) with:
   - target id (for example `claude` or `cursor`)
   - options object with source
   - `tmpDir`
   - `nodeFs`
   - `new AdapterRegistry()` when command requires registry
4. Clean up in `afterEach` using `cleanupTempDir(tmpDir)`.

### Step 4: Add assertions for behavior and outputs
Prefer assertions that validate outcomes, not implementation details:
- command result flags and counters (`skipped`, `created`, `removed`)
- `isSymlink(...)` / `pathExists(...)` helpers
- file content checks via `fs.readFile(...)` when link target correctness matters
- state checks by reading `.agentlink-state.json` for persistence expectations

Include at least one assertion that would fail on regression.

### Step 5: Run e2e tests and verify
Run:
- `npm run test:e2e` for the full e2e suite
- optionally `npm run test:all` when change might affect broader behavior

If flaky behavior appears, remove hidden coupling (shared dirs, reused state, timing assumptions).

## Preferred Test Shape

Use this structure as baseline:

```ts
describe('E2E: <area>', () => {
  let tmpDir: string;

  afterEach(async () => {
    if (tmpDir) await cleanupTempDir(tmpDir);
  });

  it('should <expected behavior>', async () => {
    tmpDir = await createTempDir();
    await setupAiDir(tmpDir);

    const result = await syncCommand('claude', { source: '.ai' }, tmpDir, nodeFs, registry);

    expect(result.skipped).toBe(false);
    expect(await isSymlink(/* target path */)).toBe(true);
  });
});
```

## Output format
- Result:
- Tests added/updated:
- Behaviors covered:
- Validation run:
- Remaining risks:
