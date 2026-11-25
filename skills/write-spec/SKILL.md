---
name: write-spec
description: Write the body of the plan in box 3 Planning. Reads the real code, then writes Context, Acceptance criteria, Risks and Assumptions into spec.md. Called by plan. Use when writing the plan for an accepted issue, or when the user says write spec, find the files involved.
---

# write-spec

Step 2 of box 3 Planning. You are the one who goes and reads the real thing, then writes down where it is.

**You may write only these five parts of `spec.md`**: `## Summary` `## Context` `## Acceptance criteria` `## Risks` `## Assumptions`. The rest has owners. Leave them alone.

## Rules

1. **Never guess a file name.** Every path in `## Context` is a path you actually opened
2. **Never write code.** Box 3 Planning does not touch code, except `prototyping`, which is a different skill
3. **`restate.md` is binding.** What the human confirmed is the scope. Anything `intake.md` rescoped away is out of scope
4. **Do not stop to ask.** `restate` already asked the user. Decide the rest yourself and write it under `## Assumptions`
5. **Language**: talk to the user in the language the user writes in. Everything written to disk is English

## Read in this order

1. `intake.md` for `RISK`, `SURFACES` and why the work was taken
2. `restate.md` for the scope the human confirmed
3. `debug.md` when there is one. The paths in `## Root cause` are the first rows of `## Context`, and `REPRO` passing is the first acceptance criterion. The probe it describes is evidence, not the fix. Choose the fix yourself
4. `AGENTS.md` and `ARCHITECTURE.md`, only the parts covering this area
5. `openapi.yaml` if this work involves the API
6. **The real code.** Find the actual files and components, do not guess at names

## `## Context` is the heart of this skill

A table of real paths, each saying how it relates to this work.

**Reuse is binding, not advice.** If the repo already has a helper, component, service or pattern for this, name it and write **reuse, do not rewrite**. Box 4 Build has to follow it.

The order for choosing what to use:

1. Code in this repo
2. What the language or platform provides, unless the project has its own
3. An already installed dependency
4. Writing something new

End `## Context` with a line reading **this change has to reach**, listing the five kinds: callers · tests · fixtures · config · exports. Write "none" where there are none. Never leave a blank.

## `## Acceptance criteria`

One observable behaviour per item, with how to verify it. **Someone holding only the repo must be able to check it**, without asking the author.

Never list `./checks.sh` as an item. It runs every round anyway, so it would always pass.

Never write a criterion that requires editing a protected path from `.claude/settings.json`. The gate will fail it.

## `## Assumptions`

Things you decided because the request did not say, one line of reasoning each.

**Star anything that is a product decision**, such as pricing, user permissions or business rules. An agent cannot decide those. `plan` takes them to a human at the approval step.

## Done when

* Every path in `## Context` really opens
* `## Acceptance criteria` has at least one verifiable item
* The "this change has to reach" line has all five slots filled
