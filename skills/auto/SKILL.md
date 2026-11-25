---
name: auto
description: Drives issues through bloop on their own, from box 2 Issue/Story/Task to the end of box 6 Deliver, running the skill bin/job names for each state and stopping only where a person must decide. Takes one issue id, or --next to work through the board until nothing runnable is left. Use when the user says auto, run it end to end, take it from here, work the board, or next issue.
---

# auto

**This skill belongs to no box.** It runs the boxes. It holds no rule of any box itself: every decision about the work stays with the skill that owns that box.

**Output** each issue moved as far as it can go without a person · `.bloop/issues/<id>/auto.md`, one per issue it touched

## Two modes

| Command | What it does |
| --- | --- |
| `/bloop:auto <issue-id>` | Runs that one issue. When a skill needs a person, **asks you here** and carries on with your answer |
| `/bloop:auto --next` | Takes the issue `bin/job --next` names, runs it as far as it goes, then takes the next one. **Never stops to ask.** A question goes into `WAITING` in `auto.md`, the issue moves to `0-waiting` on the board, and the run moves on. At the end, you answer the waiting ones |

## Standing rules

1. **Never sign for a person.** `CONFIRMED`, `APPROVED` on a plan that is not low risk, `APPROVED-BY`, a push, a merge that fails any of the four conditions, a deploy, a rollback. These change only after a person said yes **in this session**, and you pass on their exact words. Never answer a question on their behalf, however obvious the answer looks
2. **`bin/job` picks the skill.** Run the one in its `skill` field and nothing else. Never skip a box, never run two boxes at once, never choose a skill yourself
3. **Never trust a report.** After every run, read `bin/job` again. Only a change in `state` counts as progress
4. **One issue at a time**, in both modes
5. **You write only `auto.md`.** Every other file has an owner, and it is the box skill
6. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
7. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Step 0 · Detect

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" --brief
```

Read `loop.autoBudget` from `.bloop/config.json`. It caps how many skill runs one invocation makes, across every issue in `--next` mode. Without it, use 12.

| What you find | What to do |
| --- | --- |
| `no .bloop/config.json yet` | Box 1 Architecting never ran. Say to run `/bloop:init`, then stop |
| exit code 2 | The provider is not local. Say so, then stop |
| An id that `bin/job <id>` cannot find | Say so, then stop. Never open an issue yourself. That is `backlog` |

Copy `templates/auto.md` into the issue folder the first time you touch an issue. Set both header lines to `none` and empty both lists. The template shows a filled example. `bin/job` reads `WAITING`, so a copied example question would put the issue in `0-waiting` by mistake.

## Step 1 · Read the issue

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" <issue-id>
```

| In the JSON | What to do |
| --- | --- |
| `waiting` is set | One-issue mode: ask the person that question first, then go to step 2 with their answer. `--next` never picks these |
| `skill` is set | Step 2 |
| `state` is `done`, `rejected`, or `rolled-back` with no `skill` | Archive it, step 4 |
| Anything else: `blocked`, `escalated`, `bad-decision`, `bad-deliver` | A person has to look. Stop with `waiting`, or `broken` for a `bad-*` state, and quote the `next` line |

## Step 2 · Run the skill

| `skill` | Where it runs |
| --- | --- |
| `debug` · `restate` · `plan` · `deliver` · `watch` · `retro` | A fresh subagent, so this session stays small |
| `build` · `review` | This session. Both start agents of their own, and a subagent cannot start one |

Brief a subagent with exactly this, filling in the two names:

> Run `/bloop:<skill> <issue-id>` in this repository, following the skill exactly.
>
> You cannot talk to the user. When the skill says to ask the user anything, or to wait for a yes, stop at that point and reply with only `QUESTION: <the question, with the options the skill offers>`. You will get the user's own words back, and you continue from there.
>
> When the skill finishes, reply with only `DONE: <one line on what changed>`. When it stops for another reason, reply with only `STOP: <the reason>`.
>
> Never answer a question for the user. Never write a line the skill reserves for a person unless the user's words you were sent say yes to it.

When a skill needs a person, wherever it runs:

| Mode | What to do |
| --- | --- |
| One issue | Ask the person, one question, with the options the skill gave. Pass their exact words back: to the same subagent with `SendMessage`, or straight into the skill running here. A person who says not now: set `WAITING`, stop with `waiting` |
| `--next` | Do not ask. Set `WAITING: <the question>` in `auto.md`, end the skill there, and stop this issue with `waiting` |

## Step 3 · Check the move

Run `bin/job <issue-id>` again. Add a row to `## Runs`: the time, the box, the skill, the state before and after, and the result line.

| What changed | What to do |
| --- | --- |
| `state` moved | Back to step 1, while the budget lasts |
| `state` did not move, the first time | Back to step 1. Some skills need two passes, such as `review` collecting a round before the approver decides |
| `state` did not move, twice in a row | Stop with `stall`. Set `WAITING: stalled at <state> after two runs of <skill>, a person should look` |
| The budget ran out | Stop with `budget`. Say how far it got |

## Step 4 · Archive what is closed

`retro` archives a `done` issue itself. You archive what reaches the end another way, such as a `rejected` issue:

```bash
"$CLAUDE_PLUGIN_ROOT/bin/archive" <issue-id>
"$CLAUDE_PLUGIN_ROOT/bin/archive" <issue-id> --apply
```

It refuses outside the main checkout or off the base branch. Report the refusal and leave the folder where it is. Stop with `done` either way.

## Step 5 · Stop

Set `STOPPED` to the reason, and add one line to `## Stops`. When the stop clears a question, set `WAITING: none`.

**One-issue mode** reports and ends here.

**`--next` mode** asks for the next issue:

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" --next
```

An id: go to step 1 with it. Nothing: the run is over. Then list every issue with `waiting` set, oldest first, and ask once whether to go through them now. On a yes, take each one in one-issue mode.

## Report

**auto · stopped** `<reason>` · `<n>` skill runs of `<budget>`

| Issue | From | To | Stopped because |
| --- | --- | --- | --- |
| `<id>` | `<state before>` | `<state after>` | `<reason>`, with the question when it is `waiting` |

**Waiting on you** each question, with the command that answers it: `/bloop:auto <issue-id>`
**Next** the board, through `/bloop:board`, when more than one issue moved

## Done when

* Every issue touched has an `auto.md` whose last `## Runs` row matches what `bin/job` says now
* Every stop has a reason, and every `waiting` stop has its question in `WAITING`
* No line reserved for a person was written without that person's yes in this session
