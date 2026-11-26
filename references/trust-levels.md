# Trust levels: what may happen without a person

`loop.trustLevel` in `.bloop/config.json` says how far the loop goes on its own. It is earned with evidence, and only a person raises it.

| Level | What it allows |
| --- | --- |
| `supervised` | The default. Every question a skill has for a person waits for one, the merge included |
| `trusted` | `/bloop:auto` answers the routine questions below itself. The merge still waits for a person |
| `autonomous` | As `trusted`, and the merge happens on its own when every condition in `deliver` holds, which `RISK: high` never does. `fuzz-swarm` may hand what it finds to `/bloop:auto` |

Older configs name the levels `review-before-merge`, `merge-then-review` and `autonomous`. Read them as `supervised`, `trusted` and `autonomous`.

## Raising it

Only a person changes `trustLevel`, outside any run, never an agent. Each level has its own bar in `bin/trust`:

| Going up to | `bin/trust --for <level>` exits 0 when | Why that bar |
| --- | --- | --- |
| `trusted` | the window holds at least `trustMinLandings` landings and its revert rate is under `revertCeiling` | `trusted` never merges on its own. A person still sees every change before `main` does, so one good window is enough |
| `autonomous` | both the window and the previous one do. Rare **and** stable | `autonomous` merges on its own, so a good month has to be followed by another |

The window ends today and is `loop.trustWindowDays` long. The previous one sits right before it and is `loop.trustPreviousDays` long. Both default to 30. A window with fewer landings than `loop.trustMinLandings`, 5 by default, counts as no evidence either way: the minimum is what stops a short window from passing on luck. `--window`, `--previous`, `--days` and `--min` change them for one run.

The recent `## Why the gate missed this` lines in `build.md` must also show box 5 Review has stopped finding what the gate should have caught. **Never raise it because the loop has been quiet for a while.**

## What `trusted` and `autonomous` answer

The answer is yes, or the option the skill marks `← recommended`.

| Skill | Question | What happens |
| --- | --- | --- |
| `restate` | Is this restate right? | `CONFIRMED: yes`, with `CONFIRMED-BY: trustLevel <level>` under it |
| `plan` | Approve this plan? | `APPROVED: yes`, with `APPROVED-BY: trustLevel <level>` under it |
| `build` | Push the branch and open a draft PR? | Pushes and opens the draft PR |
| `review` | Mark the PR ready? | Marks it ready |
| `deliver` | Push the synced branch? | Pushes it, even when the push rewrites the branch |
| `deliver` | Merge? | `autonomous` only, and only when every condition hold. At `trusted` it waits |
| any skill | A menu with an option marked `← recommended` | Takes the recommended option |

Only `/bloop:auto` answers on the level's behalf. A person running a skill by hand is asked as usual, at every level.

## What no level answers

These wait for a person at every level. Inside `/bloop:auto` they become a `WAITING` question in `auto.md`.

| What | Why |
| --- | --- |
| A merge that fails any condition in `deliver`, including any `RISK: high` | The merge is decided by risk and evidence |
| `APPROVED-BY` on a decision the approver escalated | The approver stopped because it found something a person must judge |
| A plan whose `## Assumptions` stars a product decision | Pricing, permissions and business rules are never an agent's call |
| A deploy, or a rollback | They reach production |
| A change to a protected path | `build` sets `BLOCKED` for these |
| Raising `trustLevel` | Only a person raises it |
| A question with no recommended option, or one that asks for information | `NEEDS-INFO` in `restate`, `debug` asking for access. There is no yes to give |

## Record every answer

Every question a level answers gets a row in `## Answered by trust level` in the issue's `auto.md`:

| when | level | skill | question | answer |
| --- | --- | --- | --- | --- |
| 2026-11-26T10:20Z | trusted | restate | Is this restate right? | yes |

A signature line written this way always names the level, never a person, so anyone reading `restate.md` or `spec.md` later can tell a person's yes from the level's.
