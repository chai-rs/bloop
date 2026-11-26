---
name: deliver
description: Opens box 6 Deliver of bloop. Catches the branch up with the base, re-runs the gate, decides whether the merge may happen without asking, merges, and hands off to the deploy. Never deploys on its own. Use when an issue is approved and ready to land, or when the user says ship it, merge it, deliver.
---

# deliver

Box 6 Deliver, the first half. You take an approved issue from a green review to a commit on the base branch.

**Output** `deliver.md` at `STATUS: MERGED` or `DEPLOYED` · a commit on the base branch · a handoff to `/bloop:watch`

## Standing rules

1. **The gate runs again after the sync, never before it.** The base moved while review was happening. A gate that passed on the old base proves nothing about the new one
2. **Never force-push the base branch.** A rebase force-pushes the issue's own branch and nothing else
3. **Never deploy or roll back without the user saying so in this session.** Not at any `trustLevel`. `deliver.deployCommand` records the command. It does not grant permission
4. **Never write `APPROVED-BY` and never raise `loop.trustLevel`.** Those are a human's signature, the same rule as `CONFIRMED`
5. **Issue files live in the main checkout only.** Find the folder with `"$CLAUDE_PLUGIN_ROOT/bin/job" --dir <issue-id>`, which prints an absolute path, and write there even while you work in a worktree. A file written into the worktree's own `.bloop/` is invisible to `bin/job`, the board and `/bloop:auto`
6. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
7. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Who owns which part of `deliver.md`

| Part | Owner |
| --- | --- |
| The header lines, `## The run`, `## Why this merged without asking` | this skill |
| `## Watch after deploy`, `## What a rollback would take` | this skill, copied from `decision.md` before the merge |
| `STATUS: HEALTHY` or `ROLLED-BACK`, and `ROLLED-BACK-AT` | `watch` |

## Step 0 · Detect

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" <issue-id>
```

| What you find | What to do |
| --- | --- |
| `state` is not `approved` | Box 5 Review is unfinished. Say what is missing, then stop |
| `state` is `escalated` | A human has to sign `decision.md`. Say so, then stop. **Never sign it** |
| `deliver.md` already exists | Continue from its `STATUS`. Do not start the run over |

## Step 1 · Sync and re-gate

```bash
"$CLAUDE_PLUGIN_ROOT/bin/ship" <issue-id>
```

This is local only. It refuses a dirty worktree, catches the branch up with the base the way `deliver.sync` says, and runs `bin/gate --e2e` inside the worktree. Read its JSON, not its sentences.

| In the JSON | What it means |
| --- | --- |
| `synced: false` | The sync was aborted and the worktree is untouched. `conflicts` says how many files. **A person resolves this**, so report it and stop |
| `gate` is not `0` | The base broke this branch. Back to box 4 Build, which already knows how to record why |
| `synced: true` and `gate: 0` | Carry on |

Copy `templates/deliver.md`, set `STATUS: GATED`, and fill the first two rows of `## The run` with what actually ran.

**Before going further, copy `## Watch after deploy` out of `decision.md`** and write `## What a rollback would take`. Both belong here while there is still time to think. After a bad deploy nobody writes a careful list.

An empty rollback section means nobody knows how to undo this. Say that to the user in one sentence rather than leaving the heading blank.

## Step 2 · May this merge without asking?

**All five, or a person merges it.**

| Condition | Where you check it |
| --- | --- |
| `RISK` is a level `deliver.autoMerge` allows | `intake.md`, and the config |
| The gate passed **after** the sync | the `gate` field from step 1 |
| `bin/trust --for autonomous` exits 0 | run it, and quote its numbers |
| Nothing in `## Context` touches a protected path | `spec.md`, against `.claude/settings.json` |
| `loop.trustLevel` is `autonomous` | `.bloop/config.json`. Below it, every merge waits for a person. An old name counts as its new one, see `${CLAUDE_PLUGIN_ROOT}/references/trust-levels.md` |

**`RISK: high` is refused whatever the config says.** It is a floor, not a setting.

Write the four answers into `## Why this merged without asking`. On a no, that heading comes out and the reason goes in the report instead.

## Step 3 · Push, then merge

Both reach outside this machine, so both are separate calls.

```bash
"$CLAUDE_PLUGIN_ROOT/bin/ship" <issue-id> --push
```

**Ask before this one**, unless `/bloop:auto` passes you its trust level's answer as `references/trust-levels.md` allows. Say which branch, how many commits, and, when `deliver.sync` is `rebase`, that the push rewrites the branch and detaches any open review comments from their commits. If the PR has unresolved comments, say so plainly and let the user decide.

```bash
"$CLAUDE_PLUGIN_ROOT/bin/ship" <issue-id> --merge
```

With all five conditions met, run it and report. Otherwise ask first, in one sentence naming the condition that failed.

It uses `gh pr merge` with `git.mergeStyle` when there is an origin and `gh` is installed, and merges locally with `--no-ff` otherwise. A local merge is a normal outcome on a project with no remote, not a fallback to apologise for.

On success, set `STATUS: MERGED`, `MERGE: <short sha>` and `MERGED-AT: <YYYY-MM-DD>`.

### Fuzz what just merged, when the config says so

```bash
"$CLAUDE_PLUGIN_ROOT/bin/fuzz-due" --merged <issue-id>
```

`due: true` means `fuzz.autoRun.afterMerge` names this issue's `RISK`, or enough issues have merged since the last run. Start `/bloop:fuzz-swarm` with that JSON. It only opens issues, so it needs no one's yes. When `/bloop:auto` is driving this run, skip this: it checks the same thing itself, where fuzzing can start the workers it needs.

## Step 4 · The deploy is somebody else's job

| `deliver.deployCommand` | What you do |
| --- | --- |
| `null`, the normal case | Nothing. CI ships on merge. Find the run, link it, and write that row in `## The run` |
| A command | **Show it in full and ask.** On a yes, run it. On a no, say the issue is merged but not shipped, and stop |

Set `DEPLOYED-AT` and `DEPLOYED-BY` only once something really shipped. `DEPLOYED-BY` carries the name of whoever said yes, or `ci` when CI did it on merge. **Never write your own name there.**

With no deploy at all, `STATUS` stays `MERGED`. That is an honest end state, not an unfinished one.

### Refresh the product docs

When the project has product docs, their capabilities, journeys and changelog just changed. Rewrite only the blocks a script owns:

```bash
"$CLAUDE_PLUGIN_ROOT/bin/docs"
```

It exits 1 with "does not exist yet" on a project without docs. That is not a failure: say nothing and carry on. When it names files it refreshed, say which ones, and that they wait to be committed with the next change. Never commit them to the base branch yourself.

Run it after the merge and again after a deploy, because each one moves a capability: merged first, live after.

## Step 5 · Clean up the worktree

Ask before removing `.worktrees/<issue-id>`. A merged branch still holds the only copy of anything that was never committed, and the user may want to look first.

## Step 6 · Leaving the box

Run `bin/job <issue-id>` again, then hand over.

```
/bloop:watch <issue-id>
```

Say in one line that nothing is finished until `watch` has seen production behave and `retro` has turned the lessons into guardrails.

**Box 6 Deliver · merged** `<issue-id>` · `<short sha>` · `RISK: <level>`

| Group | What you got |
| --- | --- |
| Commit | `<sha>` on `<base>`, `<style>` merge |
| Record | `deliver.md` at `STATUS: <status>` |
| Next | `/bloop:watch <issue-id>` |
