---
name: review
description: Opens box 5 Review of bloop. Runs the reviewer lenses in parallel against the evidence, collects their verdicts, loops back to Build on changes, then has the approver decide. Use when a built change is ready for review, or when the user says review this, check the PR.
---

# review

Box 5 Review. You are the driver. **You do not review anything yourself.** You open the lenses, collect what they found, hold the rounds, and let the approver decide.

**Output** `.bloop/issues/<id>/review/round-N/review-*.md` · `decision.md` at `APPROVE` · a PR that is no longer a draft

## Standing rules

1. **Never review yourself.** If you form an opinion about the code, it belongs to a lens, not to you
2. **Never edit code.** Changes go back to box 4 Build as a new round
3. **Never set `APPROVED-BY`.** That line is a human signature
4. **Never mark a PR ready without asking.** That goes outside this machine
5. **Issue files live in the main checkout only.** Find the folder with `"$CLAUDE_PLUGIN_ROOT/bin/job" --dir <issue-id>`, which prints an absolute path, and write there even while you work in a worktree. A file written into the worktree's own `.bloop/` is invisible to `bin/job`, the board and `/bloop:auto`. Give every lens and the approver that absolute path in its brief
6. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
7. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Who owns which file

| File | Owner |
| --- | --- |
| `review/round-N/review-code.md` | `reviewer-code` |
| `review/round-N/review-security.md` | `reviewer-security` |
| `review/round-N/review-ux.md` | `reviewer-ux` |
| `review/round-N/review-ui.md` | `reviewer-ui` |
| `decision.md` | `approver` |

You write none of them. You read them and act.

## Step 0 · Detect

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" <issue-id>
```

| What you find | What to do |
| --- | --- |
| No `build.md`, or `STATUS` is not `READY` | Box 4 Build is unfinished. Say to run `/bloop:build`, then stop |
| `STATUS: BLOCKED` | The build is stuck on something a human owns. Show what `build.md` says and stop |
| `decision.md` already says `APPROVE` | This box is done. Say so and stop |
| A `review/round-N/` already exists | Continue at the next round, do not start over |

## Step 1 · The gate comes first

The gate has to be green on the PR before any lens starts.

```bash
"$CLAUDE_PLUGIN_ROOT/bin/gate" --e2e
```

**Red gate means nobody gets woken up.** Send it back to box 4 Build and say which step failed. Reviewer time spent on a change whose tests are red is wasted, and the findings would be about symptoms of the failure.

## Step 2 · Choose the lenses

`reviewer-code` runs every time.

The rest follow `SURFACES` in `intake.md`.

| `SURFACES` | Also run |
| --- | --- |
| `none` | nothing more |
| `ui` | `reviewer-ux` and `reviewer-ui` |
| `security` | `reviewer-security` |
| `ui, security` | all four |

`spec.md` already carries `REVIEWER:` from box 3 Planning. Use it. **Re-route only when `build.md` shows the work touched a surface the plan did not expect**, such as a slice that ended up touching auth. Say so when you do.

## Step 3 · Run them in parallel

Spawn the chosen agents at the same time, no more than `loop.concurrency` at once, and wait for all of them. Give each one the issue id and the round number. **Do not restate their rules**, they read their own references.

A lens that fails to return is not a PASS. Report it and treat the round as incomplete.

## Step 4 · Collect

Read every `review-*.md` in this round. Each one carries `VERDICT:`, findings rated 0 to 4, and `## What I did not cover`.

Reject a report and run that lens again, **once**, when any of these hold.

| What you see | Why it fails |
| --- | --- |
| `VERDICT: CHANGES` with no `[must]` | The scale says CHANGES needs at least one |
| A finding with no file, line or screenshot | Unproven findings are not findings |
| It edited code | A lens reports, it never fixes |
| It reviewed another lens's territory | Costs a round and buries its own findings |
| `## What I did not cover` is empty | Nothing covers everything. An empty answer means it did not look |

On a second bad report, record the lens as unreliable this round, say so in your closing report, and carry on with what the others found.

## Step 5 · All PASS?

**Any `CHANGES`** sends the work back to box 4 Build as the next round. Hand over the `[must]` items with their proof. `[should]` items go along as notes, not blockers.

Tell `build` that every `[must]` needs a line in `## Why the gate missed this`. A finding that reached review is a finding the gate let through, and that is worth more than the fix itself.

**`loop.maxRounds` rounds at most**, which defaults to 3. The same number caps box 4 Build's correction ladder, so there is one thing to remember and one to tune. When they run out, stop and give it to a human: that many rounds of unresolved findings means the problem is in the plan or the shape, not in the code.

**All PASS** goes to step 6.

## Step 6 · The approver

Spawn `approver`. It reads every report and the diff, and **verifies at least one acceptance criterion itself** before deciding.

It writes `decision.md`, beginning `APPROVE` or `ESCALATE`.

## Step 7 · Act on the decision

**`APPROVE`** · show the user `## Spot check` and `## Watch after deploy` from `decision.md`, then **ask before marking the PR ready**. On a yes, take it out of draft. Box 6 Deliver takes it from there.

**`ESCALATE`** · show the user `## Why escalated` along with the lens findings it rests on. The human decides. If they approve, **they** fill in `APPROVED-BY:` in `decision.md`. Never write that line for them, even when they say yes in chat: the line is the record, and it has to be theirs.

## Step 8 · Leaving the box

Run `bin/job <issue-id>` again. If it has not moved to box 6 Deliver, say plainly what is holding it.

**Box 5 Review · done** `<issue-id>` · `APPROVE` · round `<n>` of `<maxRounds>`

| Group | What came back |
| --- | --- |
| Lenses | which ran, and each verdict |
| Findings | how many `[must]` and `[should]`, across all rounds |
| Spot check | what the approver verified, and the result |

**Not covered** what the lenses said they could not reach
**Watch after deploy** from `decision.md`
**Next** box 6 Deliver

Box 6 Deliver has no skill yet. Say that plainly rather than inviting the user into an error.
