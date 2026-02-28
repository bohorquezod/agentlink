# /create-pr

Prepare a high-quality pull request with clear intent, risk notes, and test plan.

## Overview

Use this command after implementation is complete and validated locally.

## Steps

1. Review all commits and changes included in the branch since divergence from base.
2. Draft a concise PR title that explains user impact.
3. Draft PR body with:
   - Summary (what and why)
   - Risk/impact notes
   - Test plan with explicit checks
4. Ensure branch is pushed and open the PR.
5. Return the PR URL and a short reviewer briefing.

## Checklist

- [ ] PR title communicates purpose, not just implementation detail.
- [ ] PR body includes summary, risks, and test plan.
- [ ] Test plan references commands that were actually run.
- [ ] No secrets or environment-specific values are included.
- [ ] PR URL is returned.
