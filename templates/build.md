STATUS: READY

## Round 1

| slice | commit | check | result | evidence |
| --- | --- | --- | --- | --- |
| 1 | `<short sha>` | `<command that ran>` | `<what came back>` | `evidence/slice-1.txt` |

On a `ui` surface, every row also points at a screenshot, such as `evidence/slice-1.png`. Box 5 Review cannot review a screen from a diff.

## Acceptance criteria

Copied from `spec.md`. Tick only when real evidence backs it. Never tick because you believe it is done.

- [ ] `<criterion from spec.md>` evidence `<file or command>`

## Why the gate missed this

Only from round 2 onwards. One line per `[must]` that box 5 Review sent back, saying why `checks.sh` let it through, and which step was taken so it cannot happen again.

The order of value: fix the architecture > add a lint rule or a test > add a skill > have a human review it.

- `[must]` <the finding> — the gate had no rule for this. Added <what> at <where>
- `[must]` <the finding> — only a person can judge this. Left to review, because <reason>

## Notes for reviewers

- Worth a closer look `<...>`
- Decisions made along the way and why `<...>`
- `MUST KILL` flags left unresolved, and the issues opened for them `<...>`
