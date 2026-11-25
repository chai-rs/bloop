# Which comments live and which die

Used by `clean-comment` and by the agent `comment-cleanser`. Both read this file so both judge by the same standard.

**Source** pstack `no-comments` and `comment-sicko`, MIT <https://github.com/michael-denyer/pstack-claude>, rewritten in our own words.

---

## The core distinction

A comment explaining surprising behaviour in **something we cannot change** stays.

A comment explaining surprising behaviour in **our own code** is evidence that the code is named wrong or shaped wrong. Delete the comment and flag the symbol: rename, extract, add a type, or restructure, so the code states the fact itself without prose.

## Only six exceptions survive

1. A legal or license header
2. Surprising behaviour forced by a dependency, platform, vendor or protocol **we cannot change**
3. A lint suppression whose rule is broken, pedantic, or purely stylistic, such as `// prettier-ignore`
4. A doc comment that defines a public API contract
5. A link to an issue or RFC explaining a constraint code cannot express
6. A complete `shortcut:` marker, per the rules in `code-rules.md`

**The tiebreaker: if you are unsure whether an exception applies, it dies.** That rule is what makes this decidable instead of a matter of taste.

## Lint suppressions are comments too

`@ts-ignore`, `@ts-expect-error`, `eslint-disable` and friends. Look up what the rule actually does.

* The rule catches real bugs, or protects correctness or security → **delete the suppression and flag the symbol**
* The rule is stylistic or pedantic → the suppression survives

## A long justification is a confession

`IMPORTANT`, `do not remove`, `too risky`, `fine for now` and long explanations are a smell, not a reason.

Read the surrounding code first. If the comment's claim is not obvious there, go look at where the symbol is used. Still unsure after looking? It dies.

**Never polish a comment down to a shorter version and keep it.** That is just a shorter excuse.

## Constraint comments get encoded, not kept

Comments like `do not remove`, `do not change this wording`, `talk to X before changing`.

If it genuinely covers something we cannot change, exception 2 applies and it stays. Otherwise propose the cheapest thing that actually enforces it, in this order:

**type → runtime check → test → a lint rule in `checks.sh`**

Ask the user to approve. On approval, encode it first, then delete the comment. Without approval, delete the comment and report that the constraint is now unenforced.

## Separation of powers

**`comment-cleanser` may only touch comments. It never writes application code.** It reports and flags. `clean-comment` decides and acts.

The report from `comment-cleanser` must carry: files touched · how many deleted · `MUST KILL` flags with one line of reasoning each · what it skipped and why.

### When the report is not good enough

`clean-comment` may reject it **once**, rerun it, and say plainly what it got wrong. On a second rejection, report the work as open and treat the step as failed. Do not argue with the agent in a loop.

## Flags you cannot clear in time

**Never bring the comment back.** Pick one:

* Fix it now, if the rename or extract fits inside this slice
* Open a new issue with `/bloop:backlog`, and note it under `## Notes for reviewers` in `build.md`
