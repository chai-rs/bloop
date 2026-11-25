REPEATS: 1

## What happened

Short. The record is the table below, not this part.

- review rounds: 2, code asked for a change to access control
- the gate missed: 1 `[must]`
- lead time: 4 days from `ACCEPT` to merge

## Lessons into guardrails

One row per problem. **A row with no `what was added` is not a lesson, it is a complaint.**

The ladder, in order of value: fix the architecture > add a lint rule or a test > add a skill > leave it to a human.

| problem | times seen | fixed at which rung | what was added |
| --- | --- | --- | --- |
| forgot to check who owns the resource | 2 | type | `OwnedBy<T>`, required in every handler |
| flaky test on the order list | 1 | test | waits on the request, not on a timer |

A problem seen twice or more gets an issue of its own through `/bloop:backlog`, and the row says its id. `REPEATS` counts those rows, and box 6 does not close while one of them has no issue.

## Numbers

From `bin/metrics`, not counted by hand.

| metric | this issue | last 30 days |
| --- | --- | --- |
| lead time | 4 days | 6 days median |
| review rounds | 2 | 1.4 mean |
| escalate rate | no | 8% |
| change failure rate | no | 4% |

## Diagrams to update

The picture is wrong the moment the code lands and nobody redraws it.

- `ARCHITECTURE.md`: the payments service now calls the ledger directly
- Handdraw board `<id>`, page Architecture: same change

## What was left undone

Anything this issue chose not to do, so the next person does not read the silence as completeness.

- `<the thing, and why it was left>`
