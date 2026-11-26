---
name: evidence-pack
description: Capture proof that a slice really passed, from the raw output of bin/gate, into evidence/ and the table in build.md. Called by build. Use when recording proof a slice passed, or when the user says evidence, capture the run.
---

# evidence-pack

Evidence is what box 5 Review reads. **It is not the agent's word for it.**

If the evidence says "tested and it passed", the reviewer has to run it themselves anyway, which means the evidence was worthless.

## What counts as evidence

| Counts | Does not count |
| --- | --- |
| The command that ran, with its whole raw output | "ran the tests, they passed" |
| A real response body with its status code | "the API responded correctly" |
| The path of a screenshot that actually exists | "the screen rendered correctly" |
| The commit sha the result came from | no mention of which commit |
| The exit code | no exit code |

## Steps

1. `bin/gate --evidence "$(bin/job --dir <id>)/evidence/slice-N.md"` runs the gate and writes the report: a title with `PASS` or `FAIL`, a table of when it ran (local time and UTC), the command, the commit and branch, how long it took and the exit code, a summary of what happened, then the raw output in a code block
2. If this slice's check is not part of `checks.sh`, for example a request you fire by hand, run it and add a section to the end of the same file, in the same shape:

   ````markdown
   ## Also ran · <what the check proves>

   | | |
   | --- | --- |
   | Ran | <local time with offset> (<UTC>) |
   | Command | `<the exact command>` |
   | Exit code | <code> |
   | Result | **PASS** or **FAIL** |

   <one sentence: what came back, against what was expected>

   ```text
   <its output, exactly as printed>
   ```
   ````

   Take the time from `date '+%Y-%m-%d %H:%M:%S %z'` when it runs, never from memory. When the output holds a line of three backticks, fence it with four
3. Write the row into the `## Round N` table in `build.md`: `| slice | commit | check | result | evidence |`
4. The `result` column holds what you actually saw, such as `201, 3/3 pass`, never just `passed`

## Screenshots are mandatory on a UI slice

If `intake.md` says `SURFACES: ui`, or `ui, security`, **every slice that changes something a person sees needs a screenshot**, saved beside the raw output at `evidence/slice-N.png`.

Box 5 Review cannot review a screen from a diff. A reviewer reading only code sees the markup, never the result, and several accessibility and layout problems are invisible that way.

The screenshot has to be of the real thing: the app running, the state the slice changed, at the viewport the project targets. A mockup is not evidence. If the slice cannot be rendered yet, say so in the row rather than leaving the cell empty.

The row in `build.md` points at the file, same as any other evidence.

## Never edit the raw file

The code block in each evidence file is what the machine printed. **Never trim it, never tidy it, never drop an ugly line.** A warning in there is information. Never edit the table or summary `bin/gate` wrote either: they describe that run, and only that run.

A run that needs redoing gets a new run and a new file, such as `slice-3-rerun.md`, never an edited old one.

The summary in each file says what one run did. The table in `build.md` says what the slices add up to. The code block exists for the person who believes neither.

## Acceptance criteria

When the last slice passes, tick `## Acceptance criteria` in `build.md`.

**Tick only what you can point evidence at.** Leave the rest unticked and write why there is none. Never tick because you believe it was done.

## Done when

* Every passed slice has a table row and a file in `evidence/`
* Every row carries a commit sha
* Every slice on a `ui` surface has a screenshot
* No acceptance criterion is ticked without evidence
