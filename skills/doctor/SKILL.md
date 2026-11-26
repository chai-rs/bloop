---
name: doctor
description: Checks what this project and this machine need for bloop to work as the installed plugin expects - whether the plugin is out of date or shadowed by an older project install, missing tools, config keys that were renamed or added, ARCHITECTURE.md sections newer skills read, .gitignore lines, old issue files, and stale docs. Reports each with its fix, then offers to apply the safe ones. Use after updating bloop, when something behaves oddly, or when the user says doctor, check bloop, what do I need to update, is everything installed.
---

# doctor

**This skill belongs to no box.** It checks that the boxes can run.

**Output** a report of every check, with its fix · the fixes the user said yes to, applied

## Standing rules

1. **`bin/doctor` decides what is wrong.** Report what it found and nothing it did not. Never add a finding from a hunch
2. **Change nothing without a yes**, one group at a time. Every fix reaches outside this skill's own scope: the user's Claude install, their git hooks, their `.gitignore`
3. **Never edit `.bloop/config.json` or `ARCHITECTURE.md` here.** The first is a protected path, and the second needs an interview. Name the skill that owns the change
4. **Report format**: read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` before your first report
5. **Language**: talk to the user in the language the user writes in

## Step 1 · Check

```bash
"$CLAUDE_PLUGIN_ROOT/bin/doctor"
```

It prints one JSON object per check, each with `area`, `level`, `message` and `fix`, and a summary line. It makes one network call, to read the plugin's latest commit from GitHub. Offline, add `--offline` and say that the version check was skipped.

| `level` | Means |
| --- | --- |
| `fail` | bloop cannot run here until this is fixed |
| `warn` | Something works wrongly, or silently does less than it should |
| `info` | Works, but a newer default or field is not in use |
| `ok` | Fine. Count these, do not list them |

## Step 2 · Report

**bloop doctor** `<n>` ok · `<n>` info · `<n>` warn · `<n>` fail

One table per area that has anything above `ok`, most serious first:

| Level | What | Fix |
| --- | --- | --- |
| warn | the `message` | the `fix` |

The areas, in this order: `plugin` · `tools` · `config` · `architecture` · `gitignore` · `issues` · `docs`.

With nothing above `ok`, say in one line that bloop is up to date here, and stop.

## Step 3 · Offer the fixes

Ask once per group, with the commands in full, and apply only what the user says yes to.

| Group | What you may run on a yes |
| --- | --- |
| Plugin out of date or shadowed | `claude plugin update bloop@bloop --scope <scope>` for each scope `bin/doctor` named. Then say the user has to run `/reload-plugins` or start a new session, because a running session keeps the copy it loaded |
| `.gitignore` | Append the missing lines |
| `lefthook` hooks not installed | `lefthook install` |
| Stale docs | `"$CLAUDE_PLUGIN_ROOT/bin/docs"`, then `bin/docs --check` |

These you never run. Name who does it:

| Finding | Who fixes it |
| --- | --- |
| A config key renamed or missing | The user edits `.bloop/config.json`, or `/bloop:guardrails` rewrites that section |
| `ARCHITECTURE.md` lacks a section | `/bloop:docs` or `/bloop:report` ask for it before they write. `/bloop:init` asks on a new project |
| Issues without a `KIND` line | The user, or `/bloop:backlog` when it next touches them. An issue `fuzz-swarm`, `watch` or `debug` opened is `KIND: bug` |
| A tool missing from `PATH` | The user installs it |
| Broken issues, closed issues not archived | `/bloop:board` lists them with what to run · `bin/archive` |

## Step 4 · Check again

After any fix, run `bin/doctor` again and report only what changed. A plugin update shows as fixed only after `/reload-plugins` in a new check, so say that rather than calling it done.

## Done when

* Every check above `ok` was reported with its fix
* Every fix applied had the user's yes, and `bin/doctor` ran again afterwards
* Nothing in `.bloop/config.json` or `ARCHITECTURE.md` was edited
