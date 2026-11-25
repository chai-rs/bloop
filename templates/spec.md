REVIEWER: none
MODEL: default
APPROVED: no

# <short title, matching restate.md>

## Summary

3 to 5 bullets a reader can skim to see what this plan builds and how it will be proven.

## Context

The real things in the repo this work touches. Every path is a real path. Never guess a file name.

| path | what it does today | how this work relates |
| --- | --- | --- |
| `<real path>` | <...> | reuse, do not rewrite · or must change · or an example of the shape to follow |

**This change has to reach** callers · tests · fixtures · config · exports. Write "none" where there are none.

## Prototype

Optional. Delete this heading if no prototype was built.

- Question to answer: <...>
- What was tried: <...>
- Result: <...>
- Code thrown away, never merged

## Slices

| # | slice | check that proves it | status |
| --- | --- | --- | --- |
| 1 | <what it does> | <command or method that shows it works> | todo |

## Acceptance criteria

One observable behaviour per item, with how to verify it. Someone holding only the repo must be able to check it.
Never list `./checks.sh`, it runs every round anyway.

1. <behaviour> verified by <method>

## Risks

- <what could break and what that would cost>

## Assumptions

Decisions made because the request did not say, one line of reasoning each.
Star anything that is a product decision. Those have to go to a human.

- <assumption> because <reason>
