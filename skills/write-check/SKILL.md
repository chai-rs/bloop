---
name: write-check
description: Write the check for a slice, failing first, before any code is written in box 4 Build. Called by build. Use when starting a slice, writing a failing test first, or when the user says write check, test first, red green.
---

# write-check

The first step of every slice. **The check always comes before the code.**

This is not ceremony. A check written after the code describes what the code does rather than what it should do, so it passes forever, including while the code is wrong.

## Steps

1. Read this slice's row in `## Slices` in `spec.md`. The `check that proves it` column already says what has to be proven
2. Write the check accordingly
3. **Run it and watch it fail.** A check that passes before any code exists is not checking anything
4. Report the failure message back to `build`

Step 3 is the one people skip. **You have to see the failure with your own eyes**, not assume it would fail.

## What counts as a check

| Counts | Does not count |
| --- | --- |
| A test asserting the value that must come back | A test asserting nothing throws |
| A real request compared against the contract | A mock returning what we told it to return |
| A typecheck failing because the type does not exist yet | The code compiles |
| A command someone else runs and gets the same result | "I looked at it and it works" |

## Where to write it

Wherever `.bloop/config.json` says. The `verification` section records what this project uses: unit tests go to the chosen runner, backend integration tests go to Bruno when that was chosen.

**Follow the shape of the tests already in the repo.** Read a neighbouring test before writing a new one. Never invent your own convention.

## Scope

* You may write only this slice's check file
* **Never touch application code.** That is the next step
* Never edit an earlier slice's check to make it pass. If it is red, earlier work broke. Report it

## Done when

* The check is written
* It has been run, it failed, and you know what the failure looks like
* Nobody has touched application code yet
