---
name: create-unit-tests
description: Creates and updates unit tests in src/**/__tests__ using agentlink conventions, MockFs, and focused function-level scenarios. Use when the user asks to add unit coverage, validate pure logic, or test command/core/adapter behavior without real filesystem e2e setup.
---

# Create Unit Tests

Create or update unit tests in `src/**/__tests__/` following the existing project patterns.

## When to use
- Use this skill for pure logic and dependency-injected behavior.
- Use this skill for `@core/*`, `@adapters/*`, and `@commands/*` modules.
- Prefer this skill when tests should be fast, isolated, and deterministic.

## Scope Boundary (Unit vs E2E)
- **Unit tests**: `MockFs`, function-level behavior, error paths, mapping/state logic.
- **E2E tests**: real temp directories and OS filesystem semantics in `test-e2e/`.

If the behavior depends on real symlink/file-system integration, use e2e instead.

## Repository Conventions
1. Place tests next to source module in `__tests__/`.
2. Use `MockFs` from `@test/helpers/mock-fs` for filesystem behavior.
3. Use path aliases (`@core/*`, `@adapters/*`, `@commands/*`, `@test/*`).
4. Group by unit under test:
   - `describe('functionName', () => { ... })`
5. Test names should follow:
   - `it('should ...', ...)`
6. Keep test fixtures minimal and local to each test.

## Workflow

Copy and track progress:

```text
Unit Test Task Progress:
- [ ] Step 1: Confirm unit-test scope
- [ ] Step 2: Identify target module and existing tests
- [ ] Step 3: Build minimal fixture/setup
- [ ] Step 4: Add behavior + edge/error assertions
- [ ] Step 5: Run unit tests and verify
```

### Step 1: Confirm unit-test scope
Add unit tests when validating:
- pure mapping/transform logic
- state comparison and hashing behavior
- command orchestration with mocked dependencies
- adapter registry and adapter mapping contracts

Avoid unit tests for behavior requiring real filesystem semantics.

### Step 2: Identify target module and test file
Follow existing locations:
- `src/core/__tests__/` for core functions (`scanner`, `mapper`, `linker`, `reconciler`, `state`, `scaffold`)
- `src/adapters/__tests__/` for registry and built-in adapter contracts
- `src/commands/__tests__/` for command behavior with dependency injection

Create a new `<module>.test.ts` only when no test file exists for that module.

### Step 3: Build minimal fixture/setup
Default setup pattern:
1. Instantiate `const fs = new MockFs();` when filesystem is needed.
2. Add only required files/dirs/symlinks (`addDir`, `addFile`, `addSymlink`).
3. For command tests, create helper fixture functions (for example `setupProject(fs)`).
4. Use explicit inputs (typed objects for `SourceItems`, `LinkMapping[]`, `StoredMapping[]`) when testing pure functions.

### Step 4: Add behavior, edge, and error assertions
For each function, include a balanced set:
- happy path
- edge case (empty/missing/optional config)
- error handling path (invalid input, unknown target, malformed data)

Assert observable outputs, not implementation details:
- return values and counters
- mapping paths and categories
- state fields/hashes
- existence checks via `fs.exists(...)`
- thrown errors with `rejects.toThrow(...)`

### Step 5: Run and verify
Run:
- `npm test` for unit tests
- optionally `npm run test:all` when command/core behavior overlaps e2e expectations

If failures are brittle, simplify fixtures and assert only stable outcomes.

## Module-Specific Patterns

### Core (`src/core/__tests__`)
- `scanner`: category discovery, recursion, dotfile ignore, missing directories.
- `mapper`: category mapping, unsupported-category skipping, transform behavior.
- `linker`: symlink creation/replacement, non-symlink protection, parent dir creation.
- `reconciler`: stale link cleanup only for removed mappings.
- `state`: load/save defaults, invalid JSON fallback, hash consistency, change detection.
- `scaffold`: initial structure creation, idempotency, non-overwrite behavior.

### Adapters (`src/adapters/__tests__`)
- `registry`: built-ins present, list/ids behavior, custom register path, unknown lookup.
- `builtins`: required fields and valid mappings for each adapter; key target-path expectations for specific IDEs.

### Commands (`src/commands/__tests__`)
- Use `MockFs` + `AdapterRegistry`.
- Validate structured command results (`skipped`, `created`, `removed`, `errors`).
- Include `unknown target` and custom `source` option scenarios.

## Preferred Test Template

```ts
import { MockFs } from '@test/helpers/mock-fs';
import { targetFunction } from '@core/target-module';

describe('targetFunction', () => {
  it('should <expected behavior>', async () => {
    const fs = new MockFs();
    // minimal fixture setup

    const result = await targetFunction(/* inputs */);

    expect(result).toEqual(/* expected */);
  });
});
```

## Quality Checklist
- test file is in the correct `__tests__/` location
- uses path aliases and `MockFs` where appropriate
- includes at least one edge or error scenario
- assertions validate contract/output, not internals
- naming follows `describe('...')` and `it('should ...')`

## Output format
- Result:
- Tests added/updated:
- Behaviors covered:
- Validation run:
- Remaining risks:
