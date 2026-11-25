---
name: fuzz-swarm
description: Sends one worker per attack angle at code that already merged, in parallel, keeps only breaks that reproduce, and opens an issue for each. Never edits code. Use for fuzzing, race hunting, stress testing, or when the user says fuzz, swarm, find what breaks.
---

# fuzz-swarm

**This skill belongs to no box.** It runs against code that already merged, looking for what the gate and every lens let through.

It is a **swarm**, not a loop: several workers run at once, each attacking the same target from a different angle, and the findings merge into one report. A worker that cannot prove its finding by running something has found nothing.

It is the third rung of the trust ladder. At `loop.trustLevel` of `review-before-merge` it does one thing: **opens issues**. Nothing else.

**Output** `.bloop/fuzz/<YYYY-MM-DD>-<target>.md`, plus one issue per finding

## Standing rules

1. **Never edit code.** You find things. The loop fixes them
2. **Never open a pull request.** Open an issue with `/bloop:backlog` and let the work flow through boxes 2 to 5 like anything else. Jumping straight to a PR skips every gate this plugin exists to hold
3. **Only what runs on this machine.** Never fuzz production, a shared environment, or anybody else's system
4. **Never exceed `loop.concurrency`.** The default is 2
5. **A finding without a reproducible input is not a finding.** Drop it
6. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
7. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Step 0 · Read the config

```json
"fuzz": {
  "targets": ["pkg/order", "POST /orders"],
  "exclude": ["pkg/legacy"],
  "dimensions": ["payload", "sequence", "concurrency", "resource", "ui"],
  "cases": 200,
  "maxFindings": 5,
  "command": "go test ./... -run Fuzz"
}
```

| key | What it does | Default |
| --- | --- | --- |
| `targets` | What to attack. Paths, packages, endpoints or screens | the paths touched by issues merged in the last week |
| `exclude` | Never touch these, such as vendored or generated code | none |
| `dimensions` | Which angles to attack from, one worker each. See step 2 | all that apply to this project |
| `cases` | How many attempts each worker makes | 200 |
| `maxFindings` | Stop the whole run after this many, so one broken function cannot fill the backlog | 5 |
| `command` | How this project runs a case, when it has its own harness | none, drive the code directly |

Without a `fuzz` section, say so and ask before running with defaults. **A run nobody asked for burns time and can bury the backlog.**

## Step 1 · Choose the targets

Take `targets` from config. With none, read the `## Context` of recently merged issues and attack what they touched, because code that just changed is where the gate is thinnest.

Say which targets you picked and why before running anything.

## Step 2 · Split by angle, not by volume

**This is the part that makes it a swarm.** One worker per **dimension**, each attacking the same target from a different direction, not many workers sharing one list of inputs.

| dimension | What this worker does | Needs |
| --- | --- | --- |
| `payload` | Feeds malformed and extreme values: empty, whitespace, 0, -1, one past the maximum, combining marks, right-to-left text, emoji, 10k characters, dates in the far past and future, leap day, a foreign time zone | nothing |
| `sequence` | Calls operations in the wrong order, twice, interleaved. Cancels something already cancelled. Pays an order that was never placed | nothing |
| `concurrency` | Races two callers at the same row, file or key. Check-then-write, double submit, two writers on one counter | the ability to run two callers at once |
| `resource` | Ten thousand items in one request, a dependency that answers slowly or not at all, a payload at the size limit | nothing |
| `ui` | Clicks the submit button repeatedly, navigates away mid-request, resizes to the narrowest viewport, operates by keyboard only | the project's `verify` skill from req 16 |

Skip a dimension that does not apply, and **say which you skipped and why**. A backend has no `ui` worker. A project with no concurrency has no `concurrency` worker.

If `companions.build` names a fan-out skill for this project, such as one that already knows how to split and drain workers, use it to run the workers. It never replaces the dimensions above or the proof rule below.

## Step 3 · Brief each worker on its own

Every worker gets a brief that stands alone. **Never make a worker infer its job from the others.**

A brief carries: the target · its one dimension · how many cases · how to tell a break from correct rejection · what to report.

Run at most `loop.concurrency` at a time. A worker that drops out does not stop the run: carry on with the rest and record that it dropped.

Each worker returns `PASS`, `ISSUES` or `BLOCKED`. `BLOCKED` means it could not attack at all, which is itself worth reporting.

## Step 4 · A break is not an opinion

A worker reports `ISSUES` only with a **command that runs and shows the break**: the exact input, the call to make, and what came back versus what should have.

| Counts as a break | Does not count |
| --- | --- |
| A crash, a hang, a wrong result | An error the code deliberately returns |
| Data left half written | A validation message doing its job |
| Two callers producing one lost update | A slow path the worker felt was slow |
| A control unreachable by keyboard | A screen the worker found ugly |

**Rejecting bad input is the code working.** A worker that reports a 400 as a finding has misread its job.

## Step 5 · Confirm, then merge

Run every candidate once more on its own. **A finding that does not reproduce is noise**, and noise in the backlog costs more than the bug.

Stop at `maxFindings` across the whole run, not per worker. Say that you stopped, and at what.

Merge everything into one file at `.bloop/fuzz/<YYYY-MM-DD>-<target>.md`, from `templates/fuzz.md`. One report, whatever the number of workers.

## Step 6 · Open the issues

One issue per confirmed finding, through `/bloop:backlog`, with `FR: none` because this did not come from a requirement.

The issue body carries the dimension, the input, the command and the result. `restate` still decides whether it is worth taking. **Finding something does not make it worth fixing.**

## At higher trust levels

| `loop.trustLevel` | What changes |
| --- | --- |
| `review-before-merge` | Open issues. Nothing else. This is the default |
| `merge-then-review` | Same. Fuzzing does not merge anything |
| `autonomous` | May carry a finding through boxes 2 to 5 itself, one at a time. A human still confirms the merge, and anything that cannot be undone |

**Even at `autonomous` it never skips a box.** The levels change who waits for whom, never which gates run.

## Done when

* Every worker returned `PASS`, `ISSUES` or `BLOCKED`
* Every reported finding reproduced twice, with a command somebody else can run
* Every finding has an issue, or a line saying why it did not deserve one
* `## Not covered` names the dimensions that were skipped and why
