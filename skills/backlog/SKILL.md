---
name: backlog
description: Open issues for box 2 Issue/Story/Task, from the functional requirements in ARCHITECTURE.md or from a new request the user types in. Shows which FRs nobody has picked up and recommends where to start. Use when deciding what to work on next, opening issues from requirements, or when the user says backlog, what next, I want a feature.
---

# backlog

Box 2 Issue/Story/Task. You are the one who gives work a folder to live in.

**You do not decide whether we take the work.** That belongs to `restate`. You give it a home and tie it to the functional requirement it came from.

**Output** `.bloop/issues/<YYYY-MM-DD>-<slug>/issue.md`, one per piece of work opened

## Standing rules

1. **Never write `ARCHITECTURE.md`.** That file belongs to `init` in box 1 Architecting. To add an FR, hand it over, do not write it yourself
2. **Never write `intake.md` or `restate.md`.** Those belong to `restate`
3. **Never call `restate` yourself.** Opening five issues and confirming them in a row is how people click yes without reading
4. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
5. **Language**: talk to the user in the language the user writes in. Ids and slugs are always English

## Step 0 · Detect

```bash
"$CLAUDE_PLUGIN_ROOT/bin/detect"
"$CLAUDE_PLUGIN_ROOT/bin/job"
```

| What you find | What to do |
| --- | --- |
| No `ARCHITECTURE.md` | Box 1 Architecting is unfinished. Say to run `/bloop:init` first, then stop |
| `ARCHITECTURE.md` exists but has no `## Functional requirements`, or only placeholders | Say there are no FRs to work from. With an intent, go to mode B. Without one, send them back to `/bloop:init` |
| `job` exits with code 2 | The provider is not local. Say so plainly and stop |

## Pick the mode on the first line

Did the user type anything after the command?

* **No** → mode A
* **Yes** → mode B

---

## Mode A · Read the backlog and choose

### A1 · Read the FRs and see which are taken

Pull every line starting with `- FR-` from `## Functional requirements`.

Then grep for `FR:` lines in every file under `.bloop/issues/` and match by **exact string**. `FR-3` matches `FR-3` and nothing else.

Never match by meaning. If an agent starts deciding that two sentences probably mean the same thing, the coverage answer stops being the same between sessions and becomes untrustworthy.

### A2 · Show the table, with a recommendation

**Functional requirements nobody has picked up**

| # | FR | What it says | Notes |
| --- | --- | --- | --- |
| 1 | **FR-3** ← start here | <the FR text> | <why this one> |
| 2 | FR-5 | <the FR text> | <observation> |

Close with: answer with numbers separated by commas, or type what you want if none of these fit.

That last option matters. If the user types something new there, flow straight into mode B without making them run another command.

If every FR is taken, say so plainly and ask whether they want to add something new.

### A3 · How to recommend

In this order.

1. **Nothing else has to come first.** An FR that mentions a capability that does not exist yet has to wait for it
2. **It is the main path others build on.** Do it first and the rest have a contract to use
3. **Lower risk.** Does it touch auth, money or migrations
4. **It unblocks something stuck.** An FR once rejected for depending on another, where that other one is now done

**This ordering is inference.** Nothing anywhere records which FR depends on which. Say in the notes what you inferred it from, so the user can disagree. Never just assert a recommendation.

An FR that was once rejected still appears in the list, with the old reason, because yesterday's reason may have expired.

---

## Mode B · There is an intent

### B1 · Classify first

| The intent is | What to do |
| --- | --- |
| The same as an existing FR | Ask one confirming question that it means `FR-n`, then go to the final step |
| Not a new capability: a bug, a refactor, repair work, configuration | Go straight to the final step with `FR: none`, no interview |
| A new capability not in the FRs | Go to B2 |

Being wrong either way costs the same. If you cannot tell a bug from a new capability, ask one question.

### B2 · Interview

Call bloop's `interview` skill. That is the path, always.

If `companions.build` names an interviewing skill and the session has it, it may run before `interview` to open the question up, or after it to push on what came back. **It never replaces `interview`**, because the block of conclusions `backlog` needs comes from `interview`'s own format.

Give it three things: the intent the user typed · every FR that already exists · what you read in the repo that is relevant.

You get back a block of conclusions, with the assumptions nobody confirmed listed separately.

### B3 · Hand the new FR to `init`

Only for a genuinely new capability. Skip this when `FR: none` or when it matched an existing FR.

Propose the FR text to add, with the next number. **Get human approval first**, because an FR is the origin of every piece of work that follows. If FRs can be added silently, the architecture grows with nobody reviewing it.

Once approved, call `init` and let it write into `ARCHITECTURE.md`. Tell it what to add and where.

If the intent also needs a new endpoint or event, say that `/bloop:contract` has to run too, but **do not run it**. Deciding what the contract change is belongs to box 3 Planning.

---

## Final step · Create the folder

For each piece of work being opened, create `.bloop/issues/<YYYY-MM-DD>-<slug>/issue.md` from `templates/issue.md`.

The date is today. The slug is lowercase English separated by hyphens, short but saying what the work is, usable directly as a branch name.

If a slug collides on the same day, add a distinguishing word. Never add a counter.

Write only this one file. `bin/job` will see it as `state: no-intake`, which is correct: it is waiting for `restate` to decide.

`issue.md` is raw input. **Never add a diagram to it.** If the user pasted mermaid in, keep it as they pasted it. The full rules are in `${CLAUDE_PLUGIN_ROOT}/references/diagram-rules.md`.

## Closing report

**Box 2 Issue/Story/Task · opened** `<n>` items

| issue | from |
| --- | --- |
| `<issue-id>` | `FR-3` |

**Next** run `/bloop:restate <issue-id>`, one at a time

If an FR was added to `ARCHITECTURE.md`, say which. If something has to follow, such as a contract change, say it here.
