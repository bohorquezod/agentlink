# /code-review-checklist

Run a focused code review for current changes with a risk-first mindset.

## Overview

Use this command when you need a quick but high-signal review before commit or PR.

## Steps

1. Inspect the current git diff (staged and unstaged) and identify the scope of change.
2. Prioritize findings by severity: correctness bugs, regressions, data loss risks, security, and test gaps.
3. Verify that changed behavior is covered by unit or e2e tests where relevant.
4. Check docs consistency when public behavior or developer workflows changed.
5. Return findings first, then open questions, then a short change summary.

## Checklist

- [ ] Findings are listed first and ordered by severity.
- [ ] Each finding references a concrete file path.
- [ ] Potential regressions and edge cases are explicitly called out.
- [ ] Missing tests are identified for critical paths.
- [ ] If no findings exist, residual risks/testing gaps are still stated.
