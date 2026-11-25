---
name: plan-route
description: Pick the reviewer and model for one piece of work from the RISK and SURFACES lines in intake.md, then write the header lines into spec.md. Called by plan. Use when deciding who reviews a change, or when the user says route, who reviews this.
---

# plan-route

Step 1 of box 3 Planning. You answer who has to look at this work.

**You may write only the `REVIEWER:` and `MODEL:` header lines of `spec.md`.**

## Where the answer comes from

Everything comes from what already exists. You ask nobody.

| Input | Source |
| --- | --- |
| `RISK` | header line of `intake.md` |
| `SURFACES` | header line of `intake.md` |
| The table that maps them to reviewers | `review.risk` in `.bloop/config.json` |

## How to translate

1. `SURFACES` says who has to look. `ui` → whoever reviews screens. `security` → whoever reviews security. Both means both. `none` → a general reviewer
2. `RISK` says how carefully. `high` → the strongest model available, and a human has to look too. `low` → a fast model is enough
3. If `review.risk` in config does not cover this case, **say plainly that config has no rule for it**, then fill in something middling. Never go quiet

Write the result as two lines.

```
REVIEWER: security, backend
MODEL: opus
```

When nobody in particular needs to look, write `REVIEWER: none`.

## When to route again

When `restate.md` changed scope after an earlier routing, because a changed scope may now touch `security` where it did not before.

## One caution

This skill's answer has to be stable. The same input must give the same output every time. If it ever reduces to nothing but a config lookup, collapse it into a `bin/route` script, because a script is more reliably consistent than a model.
