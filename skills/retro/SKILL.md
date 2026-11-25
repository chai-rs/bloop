---
name: retro
description: Closes box 6 Deliver by turning what went wrong into a permanent guardrail, using the correction ladder, and records the numbers from bin/metrics. Use after a deploy is healthy, or when the user says retro, what did we learn, close the issue.
---

# retro

Box 6 Deliver, the last step, and the only one whose output changes the next issue.

**Output** `retro.md` · an issue for every problem seen twice · a guardrail that exists

## Standing rules

1. **A lesson without a change to a file is not a lesson.** Every row names what was added and where
2. **Take the highest rung that genuinely fixes it**, not the easiest one: fix the architecture > add a lint rule or a test > add a skill > leave it to a human
3. **"Leave it to a human" is allowed, and it is a signal when it keeps happening.** It has to be the reason, never the default
4. **Never close the issue while a repeated problem has no issue of its own.** That is the box's gate
5. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
6. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Step 0 · Gather what already happened

Read, in this order, and do not ask the user anything you can read:

| Source | What it tells you |
| --- | --- |
| `build.md`, `## Why the gate missed this` | Every `[must]` the gate let through, and which rung was taken at the time |
| `review/round-*/` | How many rounds, and what each lens found |
| `deliver.md` | Whether the sync conflicted, whether the merge was asked for, whether it was rolled back |
| `intake.md` and `restate.md` | Whether the scope changed after it was confirmed |

```bash
"$CLAUDE_PLUGIN_ROOT/bin/metrics"
```

It reads the issue folders and prints the numbers. **Never count rounds or lead time by hand**, and never estimate a number this prints.

## Step 1 · One row per problem

Copy `templates/retro.md`. The table is the whole point of the file.

| column | What goes in it |
| --- | --- |
| problem | What went wrong, in a sentence a stranger understands |
| times seen | Across issues, not just this one. `bin/metrics` and the other `retro.md` files are how you know |
| fixed at which rung | architecture, type, lint, test, skill, or human |
| what was added | The file and the thing. `OwnedBy<T> in every handler`, not `better validation` |

**Write the change, then put it in the table.** A row describing something you plan to do is a plan, not a guardrail, and the next issue will hit the same problem.

A problem the gate could never have caught, such as a product decision, still gets a row saying so at the `human` rung.

## Step 2 · Repeated problems get an issue

Seen twice or more, and the fix is bigger than this session?

```
/bloop:backlog
```

`FR: none`, because this came from a retro and not a requirement. Put the id in the table row.

Set `REPEATS` to the number of such rows. **`bin/job` will not close the issue while one of them has no id.**

## Step 3 · Fix the pictures

`ARCHITECTURE.md` is wrong the moment the code lands and nobody redraws it. So is the Handdraw board, when `handdraw.board` is set in config.

List what changed under `## Diagrams to update`, then make the changes. A list nobody acts on is the same as no list.

## Step 4 · Say what was left undone

Anything this issue chose not to do goes under `## What was left undone`, with the reason. Silence reads as completeness to whoever opens this next.

## Step 5 · Close it

| Where the issues live | How it closes |
| --- | --- |
| `local` | The files are the record. Nothing to close |
| A provider | Close it there, then say what you closed and where |

Run `bin/job <issue-id>` one last time. It reports `done` when `retro.md` exists and every `REPEATS` row carries an issue id.

**Box 6 Deliver · done** `<issue-id>` · `<n>` lessons · `<n>` became guardrails

| Group | What you got |
| --- | --- |
| Guardrails | `<what was added, per rung>` |
| Follow-ups | `<n>` issues opened for repeated problems |
| Record | `retro.md` |
| Numbers | lead time `<n>` days · `<n>` review rounds · `<n>` gate misses |
