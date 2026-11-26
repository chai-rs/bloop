STATUS: SYNCED
MERGE: none
MERGED-AT: none
DEPLOYED-AT: none
DEPLOYED-BY: none
ROLLED-BACK-AT: none

Dates are `YYYY-MM-DD`. They are headers rather than prose because `bin/metrics` reads them, and a date nobody can parse is a date nobody counts.

## The run

One row per step, in order. A step that was skipped says why, because a blank row reads like a step that passed.

| step | what ran | result |
| --- | --- | --- |
| sync | `bin/ship <id>` | rebased onto `origin/main`, 3 commits replayed |
| re-gate | `bin/gate --e2e` | exit 0 |
| merge | `bin/ship <id> --merge` | squashed as `<short sha>` |
| deploy | CI on merge | run `<link or id>` |

## Why this merged without asking

Only when it did. Name the five things that made it allowed, or the line is not an answer.

- `RISK: low` from `intake.md`, and `deliver.autoMerge.low` is true
- the gate passed after the sync, not before it
- `bin/trust` exits 0
- nothing in `## Context` touches a protected path
- `loop.trustLevel` is `autonomous`

Anything less than all five means a person merges it.

## Watch after deploy

Copied from `decision.md`, which wrote these before the merge. `watch` reads this list and nothing else, so a signal that is not here is a signal nobody looks at.

- `<signal, and where to see it>`

## What a rollback would take

Written **before** the deploy, while there is time to think. Empty here means nobody knows how to undo this, which is itself worth saying out loud.

- command: `<from deliver.rollbackCommand, or how CI does it>`
- what it cannot undo: `<migrations, sent mail, money moved>`
