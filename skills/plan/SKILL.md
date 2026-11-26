---
name: plan
description: Opens box 3 Planning of bloop. Turns a confirmed restate into a plan that can be proven piece by piece, driving plan-route, write-spec, prototyping, external-contract and slice-plan, then asking for approval. Use when starting to plan an accepted issue, or when the user says plan this, how should we do it.
---

# plan

Box 3 Planning. You are the driver. **You do not write the content yourself.** You call the others in order, hold the loops, and decide whether the plan is through.

**Output** `.bloop/issues/<id>/spec.md` at `APPROVED: yes`

## Standing rules

1. **You may write only the `APPROVED:` line.** Every other part of `spec.md` has an owner, see the table below
2. **Never skip a step silently.** If a step does not apply, say why it does not
3. **Never approve a plan you wrote.** If `RISK` is anything but `low`, a human approves. **At `trusted` or `autonomous`, `/bloop:auto` may answer this for the person.** `${CLAUDE_PLUGIN_ROOT}/references/trust-levels.md` says when, and how the answer is recorded. Nobody else may: then write `APPROVED: yes` with `APPROVED-BY: trustLevel <level>` under it. A starred product decision still waits for a person at every level
4. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
5. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Who owns which part of `spec.md`

| Part | Owner |
| --- | --- |
| `REVIEWER:` `MODEL:` | `plan-route` |
| `APPROVED:` | this skill |
| `## Summary` `## Context` `## Acceptance criteria` `## Risks` `## Assumptions` | `write-spec` |
| `## Prototype` | `prototyping` |
| `## Slices` | `slice-plan` |

This table is what keeps six skills from overwriting each other. If one of them asks to edit a part that is not its own, refuse and call the real owner instead.

## Step 0 · Detect

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" <issue-id>
```

| What you find | What to do |
| --- | --- |
| No `restate.md`, or `CONFIRMED` is not `yes` | Box 2 Issue/Story/Task is unfinished. Say to run `/bloop:restate`, then stop |
| `intake.md` is not `ACCEPT` | This work was not taken. Say so plainly and stop |
| `spec.md` already exists | Enter edit mode. Read what is there, then ask which part to change |

With no `spec.md`, copy `templates/spec.md` as a starting point.

## Step 1 · Route

Call `plan-route`.

If `restate.md` changed scope after an earlier routing, route again, because the new scope may touch `security` where the old one did not.

## Step 2 · Write the plan

Call `write-spec`.

## Step 3 · Is the design clear

Ask yourself two questions.

| Where it is stuck | What to do |
| --- | --- |
| Unsure whether **it can be done** | Call `prototyping` |
| Unsure **what shape it should take** | Sketch types and signatures and typecheck them yourself. If `companions.build` names a skill for this and the session has it, run it afterwards for a second opinion, never in place of your own sketch |
| Clear already | Skip to step 4 and say you skipped because it was clear |

**This step is a loop.** If the result changes the plan, go back and have `write-spec` redo `## Context`, then come back and ask this question again.

At most three loops. Beyond that the problem is not clear enough, so stop and tell the user it should go back to box 2 Issue/Story/Task.

## Step 4 · Contracts

Two questions. Both can be yes.

| Question | If yes |
| --- | --- |
| Does this change the contract **we give** others: an endpoint, field, enum or event | Call `/bloop:contract`. The `openapi.yaml` change is always the first slice, tell `slice-plan` so |
| Does this depend on **another system's** contract | Call `external-contract` |

Neither applies? Say this work touches no contract and move on.

## Step 5 · Cut the slices

Call `slice-plan`.

If it reports more than 7 slices, stop and tell the user this issue is probably too big for one PR and should be split back in box 2 Issue/Story/Task.

## Step 6 · Approval

| `RISK` in `intake.md` | Who approves |
| --- | --- |
| `low` | Approves automatically. Set `APPROVED: yes`, but tell the user it passed on its own because risk is low |
| `medium` or `high` | **A human only** |

If `## Assumptions` holds a starred item marked as a product decision, **a human decides regardless**, even at `RISK: low`.

Show the human three things: `## Summary` · `## Slices` · the starred items in `## Assumptions`. Do not make them read the whole file.

If they say no, ask what is wrong, then go back to step 2 for `write-spec` or step 5 for `slice-plan`, whichever they point at.

## Step 7 · Leaving the box

Run `bin/job <issue-id>` again. If it has not moved on to box 4 Build, say plainly what is holding it. Never call it done.

**Box 3 Planning · done** `<issue-id>` · `APPROVED: yes` · reviewer `<...>`

| Group | What you got |
| --- | --- |
| Plan | `spec.md` with a Context pointing at real paths |
| Sliced work | `<n>` slices, each with a check |
| Contract | what was touched, or nothing |

**Assumptions** what was never asked, and what it costs if the guess is wrong
**Next** box 4 Build, one slice at a time
