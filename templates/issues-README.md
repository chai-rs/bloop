# .bloop/issues

Where this project keeps its work. No external API, no token.

## Folder shape

```
.bloop/issues/
  2026-11-23-add-order-cancel/
    intake.md      do we take this, how risky. written every time
    restate.md     what we agreed to build. written only on ACCEPT
    spec.md        the plan from box 3 Planning
    build.md       the record from box 4 Build
    evidence/      real run output for each slice, plus screenshots on a ui surface
    review/        one folder per review round
    decision.md    the record from box 5 Review
```

The first line of each file is machine-readable state. `intake.md` starts with `DECISION:` · `restate.md` with `CONFIRMED:`, which is a human signature an agent may never set to `yes` itself · `spec.md` with `REVIEWER:` `MODEL:` `APPROVED:` · `build.md` with `STATUS:` · `review-*.md` with `VERDICT:` · `decision.md` with `APPROVE` or `ESCALATE`, then `APPROVED-BY:`, which only a human may fill in.

## Rules

* **The id is `<YYYY-MM-DD>-<slug>`**, usable as a branch name directly, with no counter for parallel sessions to fight over
* **No central index file.** To see what work exists, read the folders. A central index is where parallel sessions overwrite each other
* **An issue's state is the stage of the SDLC it is in**, read from which files exist. There is no separate status field

| Files present | Stage |
| --- | --- |
| nothing | box 2 Issue/Story/Task, not yet triaged |
| `intake.md` saying `NEEDS-INFO` | box 2 Issue/Story/Task, waiting on answers |
| `intake.md` saying `REJECT` | not taken, done |
| `intake.md` saying `ACCEPT` | box 2 Issue/Story/Task, waiting on `restate.md` |
| `restate.md` with `CONFIRMED: no` | box 2 Issue/Story/Task, waiting on a human |
| `restate.md` with `CONFIRMED: yes` | box 2 Issue/Story/Task done, box 3 Planning can start |
| `CONFIRMED: yes` but no `spec.md` | box 3 Planning, waiting for a plan |
| `spec.md` with `APPROVED: no` | box 3 Planning, waiting on approval |
| `spec.md` with `APPROVED: yes` | box 3 Planning done, box 4 Build can start |
| `build.md` with `STATUS: IN-PROGRESS` | box 4 Build, code in progress |
| `build.md` with `STATUS: BLOCKED` | box 4 Build, stuck, a human has to decide |
| `build.md` with `STATUS: READY` | box 4 Build done, box 5 Review can start |
| `review/round-N/` holding a `CHANGES` verdict | box 5 Review sent it back for another round |
| `review/round-N/` all `PASS`, no `decision.md` | box 5 Review, waiting on the approver |
| `decision.md` starting `ESCALATE` | box 5 Review, waiting on a human |
| `decision.md` starting `APPROVE` | box 5 Review done, box 6 Deliver can start |

Run the plugin's `bin/job` to read this table for you instead of walking the folders yourself.

`.bloop/fuzz/` sits beside `issues/` and holds one file per fuzzing run. Those are not issues: a finding worth acting on becomes an issue of its own.
