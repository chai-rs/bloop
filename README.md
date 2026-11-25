# bloop

A six-box SDLC for AI agents, packaged as a Claude Code plugin.

The contract is the real thing · the gate is a machine · review reads evidence · humans approve contracts and merges

| Box | Name | What you get |
| --- | --- | --- |
| 1 | Architecting | `ARCHITECTURE.md`, the contract, guardrails, `checks.sh` |
| 2 | Issue / Story / Task | `.bloop/issues/<issue-id>/restate.md` |
| 3 | Planning | A slice plan, with the contract as the first commit |
| 4 | Build | Code one slice at a time, with evidence |
| 5 | Review | Review that reads evidence, not someone's word for it |
| 6 | Deliver | Merge, watch production, turn lessons into guardrails |

**All six boxes exist.** None of them has run on a real issue yet, so treat it as pre-release.

## Install

```bash
claude
```

Then inside Claude Code

```
/plugin marketplace add chai-rs/bloop
/plugin install bloop@bloop
```

To work on bloop itself, point the marketplace at your own clone instead.

```
/plugin marketplace add ./path/to/your/clone
```

## Update

`plugin.json` carries no `version` on purpose. Claude Code then uses the commit, so every merge to `main` is a new version. A fixed version would hold everyone on the old copy until somebody remembered to bump it.

Claude Code does not update a marketplace like this one on its own unless you turn that on. Turn it on once, in `/plugin` → Marketplaces → bloop → auto-update. Claude Code then checks a few minutes after the first message of a session and tells you to run `/reload-plugins`.

To update now instead, run these inside Claude Code

```
/plugin marketplace update bloop
```

then this in a terminal

```bash
claude plugin update bloop@bloop
```

then `/reload-plugins` in the session.

A clone added with `./path/to/your/clone` loads in place. `git pull` there, then `/reload-plugins`. No update command is needed.

## Use

```
/bloop:init          read the repo, then walk all of box 1 Architecting from the start
/bloop:contract      change openapi, the data model, external contracts
/bloop:guardrails    change lint, tests, checks.sh, CI, git hooks, security
/bloop:backlog       open issues from the functional requirements, or from a new request
/bloop:debug         find and prove the cause of a bug, leave a failing check, never fix it
/bloop:restate       decide whether to take a piece of work, then restate it
/bloop:plan          turn a confirmed restate into a plan that can be proven
/bloop:build         write the code one slice at a time, with evidence
/bloop:review        run the review lenses and decide whether it can merge
/bloop:deliver       sync onto the base, re-gate, then merge
/bloop:watch         check production after a deploy, against the signals written before it
/bloop:retro         turn what went wrong into a guardrail, then close the issue
/bloop:fuzz-swarm    throw generated input at merged code and open issues for what breaks
/bloop:board         rebuild the issue board by hand, and see what waits on you
```

`init` reads the repo before asking anything. If the repo already has something set up, it skips that part and reports what is left.

## What is in here

```
.claude-plugin/plugin.json       the plugin itself
.claude-plugin/marketplace.json  lets you install it from your own machine
bin/detect                       reads the repo, returns JSON: what exists, what is missing, where to start
bin/job                          reads .bloop/issues/, returns JSON: which box each issue is in. --board builds the board view
bin/work                         creates the worktree and branch <type>/<issue-id>
bin/gate                         runs checks.sh and keeps the raw output as evidence
bin/trust                        measures the revert rate, which is the evidence for raising trustLevel
bin/ship                         box 6 Deliver's lever: sync, re-gate, push, merge
bin/archive                      moves a closed issue into .bloop/archive/, in a commit holding only the move
bin/metrics                      DORA and our own numbers, read from the issue folders
agents/comment-cleanser.md       hunts comments, and may only touch comments
agents/reviewer-code.md          box 5 Review: correctness, simplicity, repo conventions
agents/reviewer-security.md      box 5 Review: auth, untrusted input, secrets, money
agents/reviewer-ux.md            box 5 Review: what a person will hit
agents/reviewer-ui.md            box 5 Review: what is on the screen
agents/approver.md               box 5 Review: decides APPROVE or ESCALATE
hooks/hooks.json                 SessionStart tells the agent where this repo stands · the other hooks keep the board fresh
references/report-style.md       the shape of reports and menus, shared by every skill
references/diagram-rules.md      when to draw mermaid in an issue file, and when not to
references/code-rules.md         how to write code: the smallest change that is still complete
references/comment-rules.md      which comments live and which die
references/ux-review.md          the experience lens, with a 0 to 4 severity scale
references/ui-review.md          the on-screen lens, including accessibility
templates/adr.md                 one architectural decision, append-only
templates/fuzz.md                a fuzzing run and what it found
templates/debug.md               a debugging run: the loop, the hypotheses, the root cause
templates/deliver.md             the delivery run, and what a rollback would take
templates/retro.md               lessons turned into guardrails, with the numbers
skills/init                      box 1 Architecting: detect, business, skeleton
skills/contract                  box 1 Architecting: the contract
skills/guardrails                box 1 Architecting: req 4 to 14
skills/backlog                   box 2 Issue/Story/Task: open issues from FRs or a new request
skills/debug                     box 2 Issue/Story/Task: prove the cause of a bug before anyone fixes it
skills/restate                   box 2 Issue/Story/Task: take the work, then restate it
skills/interview                 interview in rounds to sharpen a request, called by backlog
skills/plan                      box 3 Planning: the driver, holding the loops and the gate
skills/plan-route                box 3 Planning: pick reviewer and model from risk
skills/write-spec                box 3 Planning: read the real code, write the plan body
skills/prototyping               box 3 Planning: throwaway code to answer one question
skills/external-contract         box 3 Planning: record the outside systems we depend on
skills/slice-plan                box 3 Planning: cut the work until every piece has a check
skills/build                     box 4 Build: the driver, looping over slices
skills/write-check               box 4 Build: write the failing check before the code
skills/evidence-pack             box 4 Build: capture proof that it really passed
skills/clean-comment             box 4 Build: hunt comments before committing
skills/review                    box 5 Review: run the lenses, hold the rounds, let the approver decide
skills/deliver                   box 6 Deliver: sync, re-gate, decide the merge, hand off the deploy
skills/watch                     box 6 Deliver: is production behaving, against the signals named earlier
skills/retro                     box 6 Deliver: lessons into guardrails, then close it
skills/fuzz-swarm                outside the boxes: fuzz merged code, open an issue per finding
skills/board                     outside the boxes: rebuild the board, report what waits on a person
templates/                       starting files the skills copy, including external/README.md
docs/                            mermaid diagrams of each bin script
drafts/                          decision records. Read before changing a skill
site/                            a web page explaining box 1 Architecting
```

## What it holds to

* **One checker.** `checks.sh`. Dev machines and CI call the same file. If CI runs anything extra, the local = CI promise is broken
* **Ask with options.** Every question that picks a tool offers choices that actually run, names a recommendation, and gives a reason
* **Never propose ripping out something that works.** The recommendation follows whatever `bin/detect` found in the repo
* **Rerunnable.** Anything written into somebody else's file carries a `bloop:managed` marker, and a rerun replaces that block
* **No central index.** An issue keeps its state in its own folder, because an index file is where parallel sessions overwrite each other
* **Folders never move while work is open.** `bin/job --board` gives one folder per state as gitignored symlinks, rebuilt from the files. Only a closed issue moves, into `.bloop/archive/`, on the base branch

## Licence

GPL-3.0-or-later. See [LICENSE](LICENSE).

The strong copyleft is deliberate. bloop's design draws on the ZazenCodes software factory, which is GPL-3.0, so this is the licence that lets the lineage stay honest rather than the one that is easiest to adopt.

## Where the ideas come from

bloop is prose, not an algorithm, so what matters here is which text was copied and which was written from scratch.

| Source | Licence | What bloop does with it |
| --- | --- | --- |
| [ZazenCodes software factory](https://github.com/zazencodes/zazencodes-season-3) | GPL-3.0 | The six-box shape, the gate before people, scripts owning state. No text copied |
| [ponytail](https://github.com/DietrichGebert/ponytail) | MIT | `references/code-rules.md`, rewritten in our own words. One sentence stayed near-identical and is credited in that file |
| [pstack](https://github.com/michael-denyer/pstack-claude) | MIT | `references/comment-rules.md`, and the poteto principles behind the trust ladder. Credited in those files |
| [Laws of UX](https://lawsofux.com/) | CC BY-NC-ND 4.0 | **Law names only.** That licence forbids both copying and adapting for redistribution, so every rule in `references/ux-review.md` is written from the underlying public research |
| [craft](https://craft.gustavofior.com/) | not stated | Same treatment as above: the idea is named, the rule is ours |
| [impeccable](https://github.com/aiwithankit/impeccable) · [oil-ui](https://github.com/oil-ui/oil-ui) | Apache 2.0 · MIT | Named as optional companion skills in `references/ui-review.md`. Nothing copied, so there is no NOTICE to carry |

If you think a line of ours is closer to a source than the table admits, open an issue. That is a bug.
