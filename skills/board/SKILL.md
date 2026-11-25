---
name: board
description: Rebuilds the issue board by hand, one folder per state under .bloop/board/, then reports what waits on a person and what is broken. Use when the board looks stale, when no board exists yet, or when the user says board, rebuild the board, show the board, what is waiting on me.
---

# board

**This skill belongs to no box.** It rebuilds the view of every box at once.

The board is a view, never the truth. The truth is the files in `.bloop/issues/`. The hooks already keep an existing board fresh. This skill is for the times they cannot: the first build, or a board that looks out of date.

**Output** `.bloop/board/`, rebuilt · a report of what waits on a person

## Standing rules

1. **Never edit, move or delete anything through the board.** The next rebuild throws away whatever was done there. Change the files in `.bloop/issues/` with the skill that owns them
2. **Never move an issue folder by hand.** A closed issue leaves through `bin/archive`, nothing else
3. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
4. **Language**: talk to the user in the language the user writes in

## Step 1 · Rebuild

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job" --board
```

| What you see | What it means |
| --- | --- |
| `added .bloop/board/ to .gitignore` | The first build. Tell the user to commit `.gitignore`, so another clone never commits the board |
| `board rebuilt in ...` and a count per folder | Done. Go to step 2 |
| `no .bloop/config.json yet` | Box 1 Architecting never ran. Say to run `/bloop:init`, then stop |
| exit code 2 | The provider is not local, so the issues do not live in this repo. Say so, then stop |

## Step 2 · Read what needs a person

```bash
"$CLAUDE_PLUGIN_ROOT/bin/job"
```

The board says where an issue sits. Only this JSON says why. For every issue in `0-waiting` or `1-broken`, take its `next` line.

## Step 3 · Report

**Board rebuilt** `<n>` open issues · `<n>` archived

| Folder | Issues |
| --- | --- |
| `0-waiting` | one line per issue: the id, then its `next` |
| `1-broken` | one line per issue: the id, then its `next` |
| `2-intake` to `6-ship` | the count per folder |
| `7-done` · `8-rejected` | the count. Say they can be archived with `bin/archive`, through `/bloop:retro` for a done issue |

Leave out a folder that is empty. With nothing in `0-waiting` and `1-broken`, say in one line that nothing waits on a person.

**Next** the one issue the user should look at first: the oldest in `0-waiting`, else the oldest in `1-broken`, else none

## Done when

* `bin/job --board` exited 0
* Every issue in `0-waiting` and `1-broken` is in the report with its `next` line
* Nothing under `.bloop/board/` or `.bloop/issues/` was edited by hand
