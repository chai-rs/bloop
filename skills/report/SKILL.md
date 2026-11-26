---
name: report
description: Writes a status report on how the work is going - goals, progress against requirements, capacity, competency, and what the agents did - from bin/metrics --report and bin/status, never from an impression. --proposal adds the decisions a person has to make, with options and a recommendation. Use when the user says report, status, how are we doing, progress report, weekly update, or write a proposal.
---

# report

**This skill belongs to no box.** It reads what every box recorded and says how the work is going.

`/bloop:docs` says what the product is and what it can do. This says how the work on it is going. They share `bin/status`, and nothing else.

**Output** `.bloop/reports/<YYYY-MM-DD>-status.md`, or `-proposal.md`

## Two modes

| Command | What you get |
| --- | --- |
| `/bloop:report` | A status report, one to two pages |
| `/bloop:report --proposal` | The status report plus `## Asks`: each decision a person has to make, its options, what each costs, and a recommendation. Six pages at most |
| `--days <n>` on either | A window other than 30 days |

## Standing rules

1. **Every number comes from a script.** `bin/metrics --report` and `bin/status`. Never count, estimate or round a number yourself, and never write one the scripts did not print
2. **Health is the script's.** Copy `health` and every line of `reasons`. You may explain a reason, never overrule it. A report that says on track when the rules say at risk is the failure this skill exists to prevent
3. **Every rate shows its count.** `20%` alone is not allowed. Write `20% (1 of 5)`. When the count behind a rate is under 5, write "insufficient data" instead of the rate
4. **Speed and stability go together.** Never show delivered or lead time without change failure rate beside it, or the reverse. Either one alone is easy to game
5. **Never invent a goal's current value.** A key result measured outside the repo, such as analytics, is asked for once, or written as "not measured in this repo"
6. **Write for the person who decides.** Plain words. No bloop jargon such as box, slice or gate in the bottom line
7. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first message to the user
8. **Language**: talk to the user in the language the user writes in. The report on disk is English

## Step 0 · Gather

```bash
"$CLAUDE_PLUGIN_ROOT/bin/metrics" --report
"$CLAUDE_PLUGIN_ROOT/bin/status"
"$CLAUDE_PLUGIN_ROOT/bin/job" --brief
```

| What you find | What to do |
| --- | --- |
| `bin/metrics` says there are no issues | There is nothing to report yet. Say so, then stop |
| `## Goals` missing from `ARCHITECTURE.md` | Write the report without it, and say in the bottom line that health is judged on delivery only until goals exist. Suggest `/bloop:init` to add them |
| A key result measured outside the repo | Ask the user for its current value, once, for all such results together. No answer means "not measured in this repo" |

Also read every `retro.md` written in the window, for the lessons, and `bin/job` for the issues waiting on a person.

## Step 1 · Write it

Copy `${CLAUDE_PLUGIN_ROOT}/templates/report.md`. Its header lines are machine-readable: `REPORT`, `PERIOD`, `HEALTH`, `GENERATED`.

| Section | From |
| --- | --- |
| Bottom line | `health`, its `reasons`, and the requirement pace. Two or three sentences: health, what changed since the last report, whether a decision is needed |
| Goals | `## Goals` in `ARCHITECTURE.md`, with the current values from step 0 |
| Progress against requirements | `bin/status`: every requirement with its status, and `orphans` as work nobody asked for |
| Waiting on a person | every issue in `0-waiting` on the board, with its `next` line |
| Capacity | `report.n`, `report.previous`, `report.wip`, and `dora` |
| Competency | `dora.changeFailureRate`, `dora.timeToRestoreDaysMedian`, `ours` |
| Agents | `report.agents`. Leave the section out when `issues` is 0, and say /bloop:auto has not run |
| Lessons | the `retro.md` rows of the window, each with the guardrail that now exists |
| Next window | the open issues nearest done, and what is deliberately left out |

A previous report in `.bloop/reports/` is the baseline for "what changed". Without one, say this is the first.

## Step 2 · `--proposal` only: the asks

Add `## Asks` after the bottom line. One decision each:

| # | Option | Cost | Effect |
| --- | --- | --- | --- |
| 1 | **The recommended option** ← recommended | what it gives up | what it does to the goals, in the scripts' numbers |

* Every option's effect cites a number from the report above it, such as the pace or the projected date
* An option the numbers cannot support says so: "no evidence it can"
* Typical asks: cut or move a requirement to land the goal date · approve a plan that waits on a person · raise `loop.trustLevel`, which needs `bin/trust` and its revert rate beside the change failure rate, never throughput alone

## Step 3 · Check it

Before saving, compare every number in the report with the script output it came from. One mismatch means the report is wrong, so fix it rather than rounding it away.

Save to `.bloop/reports/<YYYY-MM-DD>-<status|proposal>.md`. A second report on the same day replaces the first.

## Report

Tell the user in three lines: the health with its reasons, the one decision needed if any, and where the file is. Offer to publish it as a page when it is meant for someone else to read.

## Done when

* Every number traces to a line of script output
* Every rate carries its count, or says insufficient data
* `HEALTH` matches `bin/metrics --report`
* In `--proposal`, every ask has options, costs, effects and a recommendation
