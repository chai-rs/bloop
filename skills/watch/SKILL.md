---
name: watch
description: Checks whether production is behaving after a deploy, against the signals the approver named before the merge. Opens an issue when it is not, and never rolls back on its own. Use after a deploy, or when the user asks is it healthy, did the deploy go well, check production.
---

# watch

Box 6 Deliver, the second half. You answer one question: **is production behaving.**

**Output** `deliver.md` at `STATUS: HEALTHY` or `ROLLED-BACK` · an issue when something broke

## Standing rules

1. **Only the signals in `## Watch after deploy`.** They were written before the merge, when nobody knew what would break. A signal invented now is a signal chosen to pass
2. **Never roll back on your own.** Show `deliver.rollbackCommand` and ask. A rollback changes production as much as a deploy does
3. **Never read production data you were not pointed at.** Read the signal, not the rows behind it
4. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
5. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Step 0 · What am I watching

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" <issue-id>
```

Read `## Watch after deploy` and `## What a rollback would take` from `deliver.md`.

| What you find | What to do |
| --- | --- |
| `DEPLOYED-AT: none` | Nothing shipped, so there is nothing to watch. Say so and stop |
| `## Watch after deploy` is empty | **That is the finding.** Nobody said what good looks like, so nobody can say this is healthy. Report it and ask the user what to look at |
| `STATUS` is already `HEALTHY` | Say when that was decided, then stop |

## Step 1 · Look

For each signal, in order:

1. Say where you are looking
2. Say what you saw, as a number or a line of output
3. Say whether that is normal, and against what

| Kind of signal | How to read it |
| --- | --- |
| An error rate, a latency, a queue depth | The project's own dashboard or command, named in `watchFor` |
| A log line | The command that greps it, with the window you looked at |
| A user-facing flow | The project's `verify` skill from req 16, which drives the real thing |

**A signal you could not reach is not a pass.** Write it down as unchecked, and say what stopped you.

## Step 2 · Decide, with a number

| Verdict | When | What you write |
| --- | --- | --- |
| `HEALTHY` | Every signal was reached and every one is normal | `STATUS: HEALTHY` |
| `ROLLED-BACK` | A signal is bad and the user said to roll back | `STATUS: ROLLED-BACK` plus `ROLLED-BACK-AT` |
| neither yet | A signal could not be reached, or it is too early to tell | Leave `STATUS: DEPLOYED` and say what is still unknown |

**Leaving it undecided is allowed and is sometimes the honest answer.** Guessing `HEALTHY` because nothing exploded is not.

## Step 3 · When it is bad

1. **Say what you saw first**, in one sentence, before any recommendation
2. Show `deliver.rollbackCommand` in full, with the `what it cannot undo` line from `deliver.md` beside it
3. Ask. On a yes, run it, then write `ROLLED-BACK-AT`
4. Open an issue through `/bloop:backlog` with `FR: none`, carrying the signal, the number and the deploy it followed

The new issue goes through boxes 2 to 5 like anything else. **A rollback is not a fix**, and the issue is what remembers that.

## Step 4 · Leaving the box

Hand over to the last step.

```
/bloop:retro <issue-id>
```

**Box 6 Deliver · watched** `<issue-id>` · `STATUS: <status>`

| Group | What you got |
| --- | --- |
| Signals | `<n>` checked, `<n>` unreachable |
| Record | `deliver.md` at `STATUS: <status>` |
| Next | `/bloop:retro <issue-id>` |
