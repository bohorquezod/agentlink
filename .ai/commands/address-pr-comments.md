# /address-pr-comments

Resolve pull request comments with traceable changes and clear closure notes.

## Overview

Use this command when a PR has review feedback that needs implementation updates.

## Steps

1. Collect unresolved PR comments and group them by theme or file.
2. For each comment, decide: implement change, partially implement, or justify no change.
3. Apply code/test/doc updates required to address accepted feedback.
4. Re-run relevant validations (`npm test`, `npm run test:e2e`, or targeted tests).
5. Post a response mapping each comment to the exact resolution.

## Checklist

- [ ] Every comment has an explicit resolution status.
- [ ] Code changes are minimal and scoped to feedback intent.
- [ ] Related tests/docs were updated when behavior changed.
- [ ] Validation commands and outcomes are reported.
- [ ] Follow-up questions for reviewers are clearly listed.
