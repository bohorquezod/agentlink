# /run-all-tests-and-fix

Run the full test suite, diagnose failures, and implement minimal safe fixes.

## Overview

Use this command to stabilize the branch before creating a PR or release.

## Steps

1. Run `npm run test:all` and capture failing suites and error messages.
2. Group failures by root cause and identify the smallest safe fix for each group.
3. Apply fixes without broad refactors unless required to restore correctness.
4. Re-run targeted tests first, then run `npm run test:all` again.
5. Report what was fixed, what remains, and any flaky-test suspicion.

## Checklist

- [ ] Full test run executed at least once before edits.
- [ ] Fixes are limited to failing behavior and nearby impact.
- [ ] Targeted re-runs confirm each fix.
- [ ] Final `npm run test:all` result is reported.
- [ ] Remaining known failures (if any) are clearly listed.
