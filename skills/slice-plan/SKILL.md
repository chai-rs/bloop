---
name: slice-plan
description: Cut the work in box 3 Planning into slices that each end in a check, then write the Slices table into spec.md. Called by plan. Use when breaking work into verifiable steps, or when the user says slice it, split the work, break into commits.
---

# slice-plan

Step 5 of box 3 Planning. You cut the work up until every piece can be proven.

**You may write only `## Slices` in `spec.md`.** The rest has owners.

## What makes a good slice

1. **It ends in a check.** A command or method that shows it works. A slice with no check is not a slice
2. **Small enough for a reviewer to read in one sitting**
3. **Mergeable without breaking what exists**, even if the next slice never lands
4. **Useful on its own**, or at minimum it leaves the system no worse

Item 3 matters most, because the project is set up trunk based. Every slice reaches main on its own. If slice one breaks something and slice two is what fixes it, main is red in between.

Anything unfinished on main sits behind a feature flag. Every flag in `flags.json` needs an `owner` and a `removeWhen`.

## What counts as a check

| Counts | Does not count |
| --- | --- |
| `go test ./pkg/order -run TestCancel` | "run the unit tests" |
| `curl localhost:8080/orders/1/cancel` returning 204 | "test it by hand" |
| Open `/orders` and the cancel button is there | "see whether it works" |
| Typecheck passes after the new type is added | "the code compiles" |

A check has to be specific enough that someone else runs it and gets the same result.

## Ordering slices

Order them so each one proves the next is possible.

* If this work touches a contract, **the first slice is the contract change**, with human approval. Not code first
* If it needs a new type, the type and signatures come before the logic
* Put the riskiest piece early, so a wrong plan shows up fast instead of halfway through

## How many slices

There is no fixed number. But if you end up with more than 7, step back and ask whether this issue is too big to be one PR, then tell `plan` it may need splitting back in box 2 Issue/Story/Task.

If it comes to one slice, leave it at one. Small work does not need to look big.

## Status

Every slice starts at `todo`. Box 4 Build changes it, not you.

## Done when

* Every row has a check that really runs
* If the work touches a contract, the first slice is the contract
* No row would break existing behaviour when merged
