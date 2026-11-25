---
name: build
description: Opens box 4 Build of bloop. Writes code one slice at a time in its own worktree, passes checks.sh on every slice, records evidence, then opens a draft PR. Use when implementing an approved plan, or when the user says build, start coding, next slice.
---

# build

Box 4 Build. You are the driver. You loop over slices until there are none left.

**Output** code on branch `<type>/<issue-id>` · `build.md` at `STATUS: READY` · `evidence/` · a draft PR

## Standing rules

1. **Work inside the worktree only.** Never edit the main checkout
2. **Never touch protected paths** listed in `.claude/settings.json`. If one genuinely has to change, set `STATUS: BLOCKED` with a reason and stop
3. **One slice, one commit.** The commit message names the slice and the check
4. **Before writing code, read `${CLAUDE_PLUGIN_ROOT}/references/code-rules.md` in full.** That is the whole standard
5. **Read `companions.build` in `.bloop/config.json`.** Each row names a skill, when it applies and why. They are extra depth on top of `code-rules.md`, used before or after you write a slice, **never in place of it**. A skill the session does not have gets reported and skipped, and never blocks
6. **Never push or open a PR without asking.** Those go outside this machine. The user confirms first
7. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
8. **Language**: talk to the user in the language the user writes in. Everything written to disk, including commit messages, is English

## Who owns which part of `build.md`

| Part | Owner |
| --- | --- |
| `STATUS:` and the `## Round N` headings | this skill |
| `## Why the gate missed this` | this skill |
| Table rows, and files under `evidence/` | `evidence-pack` |
| `## Acceptance criteria` | `evidence-pack` |
| `## Notes for reviewers` | this skill |

## Step 0 · Detect

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" <issue-id>
```

| What you find | What to do |
| --- | --- |
| No `spec.md`, or `APPROVED` is not `yes` | Box 3 Planning is unfinished. Say to run `/bloop:plan` first, then stop |
| `state` is `bad-context` | Paths in `## Context` do not exist. Have `/bloop:plan` fix them, then stop |
| `build.md` already exists | Continue from the unfinished slice. Do not start over |

## Step 1 · Open the work

```bash
"$CLAUDE_PLUGIN_ROOT/bin/work" <issue-id>
```

It reads `TYPE` from `intake.md`, names the branch, and refuses a type that is not in `git.branchTypes`.

If it refuses because `TYPE` is missing, go back to `/bloop:restate`. Never guess the kind of work yourself.

Then `cd` into the worktree and stay there.

Copy `templates/build.md` as a starting point if there is none.

## Steps 2 to 6 · The slice loop

Repeat until every row in `## Slices` in `spec.md` is done.

1. **Take the next slice** still marked `todo`, in table order. Never skip ahead
2. **Call `write-check`**, which writes a check that genuinely fails
3. **Write code until it passes**, following `code-rules.md`
4. **Call `bin/gate`**

   ```bash
   "$CLAUDE_PLUGIN_ROOT/bin/gate" --evidence .bloop/issues/<id>/evidence/slice-N.txt
   ```
5. **It fails**: fix what the error says and go back to 3. **No more than `loop.maxRounds` rounds**, which defaults to 3
6. **It passes**: call `clean-comment` first, then commit, then call `evidence-pack` to record it

### The correction ladder

Out of rounds and still red? **Stop.** Do not attempt another.

That many failures mean the problem is not the code, it is a layer below.

| Probably wrong | What to do |
| --- | --- |
| The check is wrong, testing the wrong thing | Fix the check and tell the user why you changed it |
| `spec.md` contradicts the real code | Set `STATUS: BLOCKED` and go back to `/bloop:plan` |
| The project's shape cannot take this work | Set `STATUS: BLOCKED`. This is bigger than one issue and a human decides |
| Nobody can say which of the above it is | Run `/bloop:debug <issue-id>` before setting anything. Its root cause points to one of the rows above. Never guess the row |

In every case, write what happened under `## Notes for reviewers`.

## Coming back from box 5 Review

When `review` sends the work back, you are on a new round. Before fixing anything, **answer one question per `[must]` finding: why did `checks.sh` let this through?**

Write the answer into `## Why the gate missed this` in `build.md`, and with it the step you took so it cannot happen again. Take the most valuable step you can:

| Step | When it is the right one |
| --- | --- |
| **Fix the architecture** | The shape of the code made the mistake easy. The most valuable fix, and the rarest |
| **Add a lint rule or a test** | A machine could have caught it. This is where most findings belong |
| **Add a skill or a rule file** | It needs judgement, but the same judgement every time |
| **Leave it to a human** | Genuinely a one-off judgement call |

**Answering "leave it to a human" often is the signal that the gate is too weak.** It is allowed, but it has to be the reason, not the default. The same record is what box 1 Architecting reads when someone asks to raise `loop.trustLevel`, because a gate that keeps missing things is not ready for more autonomy.

A finding the gate could never have caught, such as a product decision, still gets a line saying so.

## Step 7 · All slices done

1. Run `bin/gate --e2e` over the whole thing once more
2. Have `evidence-pack` tick `## Acceptance criteria`
3. Write `## Notes for reviewers`: what deserves a closer look · decisions made along the way · `MUST KILL` flags left unresolved
4. Set `STATUS: READY`
5. **Ask the user before pushing.** Show which branch and how many commits, then wait
6. On a yes, push and open a **draft** PR

### The PR

The PR title follows the commit convention, `<type>: <subject>`, which CI checks on squash merge.

The body points at `.bloop/issues/<issue-id>/` and summarises `## Notes for reviewers`.

**No `Closes #<n>`.** The MVP keeps issues in folders, there is no GitHub issue number.

Always open it as a draft. Box 5 Review is what marks it ready.

## `STATUS: BLOCKED`

Use it when you cannot continue without a human.

* A protected path has to change
* `spec.md` contradicts the real code
* Three correction rounds and still failing
* You are waiting on something from another system you cannot reach

Write the reason so that someone who was not here understands it, then stop. **Never guess a way out and keep going.**

## Step 8 · Leaving the box

Run `bin/job <issue-id>` again. If it has not moved to box 5 Review, say plainly what is holding it.

**Box 4 Build · done** `<issue-id>` · `<n>` slices · `STATUS: READY`

| Group | What you got |
| --- | --- |
| Code | branch `<type>/<issue-id>`, `<n>` commits |
| Evidence | `evidence/`, `<n>` files |
| Record | `build.md` |

**Left unresolved** `MUST KILL` flags or `shortcut:` markers still there, and the issues opened for them
**Next** box 5 Review

Box 5 Review has no skill yet. Say that plainly rather than inviting the user into an error.
