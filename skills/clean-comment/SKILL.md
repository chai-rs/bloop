---
name: clean-comment
description: Hunt unnecessary comments out of a diff before committing. Calls the comment-cleanser agent, judges its report, then fixes the flagged code. Use before committing, during review, or when the user says clean comments, the comments are noise.
---

# clean-comment

You judge and you act. **The hunting is done by the agent `comment-cleanser`.**

They are separate because whoever just wrote a comment will defend it.

## Before you start

Read `${CLAUDE_PLUGIN_ROOT}/references/comment-rules.md` in full.

## Steps

1. **Spawn the agent `comment-cleanser`.** Give it the scope, a set of files or a diff. Do not restate the rules to it, it reads `comment-rules.md` itself
2. **Read the report and judge it.** Reject what is wrong, see the list below
3. **Fix the easy ones first**: delete a dead path, drop an unused parameter, call the real API instead of wrapping it
4. **Act on the `MUST KILL` flags**: rename, extract, add a type or restructure, whichever is the smallest change that lets the code state the fact itself
5. **Constraint comments**: propose the cheapest thing that enforces it, type → runtime check → test → lint. Get the user's approval, encode it, then delete the comment
6. **Report**: how many deleted · what was fixed · what was encoded · which constraints are now unenforced · which flags were not cleared

## Reject the report when

| What you see | What to do |
| --- | --- |
| It edited application code | Reject. It may only delete comments |
| It went outside the scope you gave | Reject the part that went outside |
| A flag does not name an exact symbol | Reject that item, ask it to point precisely |
| It says "covered by an exception" without naming which | Reject that item |
| It deleted a comment that genuinely matched an exception | Restore it, and say which exception |

**You may reject once.** Rerun it and say plainly what it got wrong. On a second rejection, report the work as open and treat this step as failed. Do not argue in a loop.

## Never

* **Never restore a comment because you are unsure.** The rule is that unsure means delete
* **Never polish a comment down and keep it.** That is a shorter excuse
* Never fix anything outside the scope, however bad it looks

## Flags you cannot clear

Never bring the comment back. Pick one:

* Fix it now, if the rename or extract fits inside this slice
* Open a new issue with `/bloop:backlog` and note it under `## Notes for reviewers` in `build.md`

## Done when

* The report has been reviewed
* Everything accepted has been fixed
* Every flag you could not clear has a home. None of them just vanished
