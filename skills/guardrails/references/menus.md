# Option menus for req 4 to 14

The printing rules live in `${CLAUDE_PLUGIN_ROOT}/references/report-style.md`. Read that before the first question. In short: menus are markdown tables, never inside a code block, and one question per message.

Every menu lets the user type something else. The recommendation changes when `bin/detect` already found something doing that job: recommend what is already there. guardrails never proposes ripping out something that works.

---

## req 4 · static checks

### TypeScript or JavaScript

**Which lint and format?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **biome** ← recommended | One tool for both lint and format, fast, one config |
| 2 | eslint + prettier | The standard, many plugins, but two configs to maintain |
| 3 | oxlint + prettier | Fastest lint, but the rule set is not yet as complete as eslint |

**Which typecheck?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **`tsc --noEmit`** ← recommended | Matches the types the IDE shows |
| 2 | tsgo | Faster, but still catching up on tsc features |

**Which rule stops layers being crossed?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **dependency-cruiser** ← recommended | Rules are path regexes, which fits hexagonal |
| 2 | eslint-plugin-boundaries | Lives inside eslint. Pick this if eslint was already chosen |
| 3 | Skip | init will warn that nothing enforces the layers |

### Go

**Which lint?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **golangci-lint** ← recommended | Many linters behind one tool and one config |
| 2 | `go vet` only | Ships with the toolchain, but catches far less |

Format is `gofmt`. No need to ask.

**Which rule stops layers being crossed?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **go-arch-lint** ← recommended | Declares layers as yaml, separate from general lint |
| 2 | depguard | Already inside golangci-lint, nothing extra to install |

### Python

**Which lint and format?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **ruff** ← recommended | Lint and format in one, very fast |
| 2 | flake8 + black | The older pairing people know |

**Which typecheck?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **`mypy --strict`** ← recommended | Strictest, forces complete annotations |
| 2 | pyright | Faster, and the same engine the IDE uses |

---

## req 5 · verification

**Which unit test runner?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **vitest** ← recommended | Shares config with vite, runs fast |
| 2 | jest | The standard, many plugins |
| 3 | `node:test` | Ships with node, nothing to install |

**Which backend integration tests?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **Bruno** ← recommended | Requests stored as files in the repo, fired against the real thing, shared with the preview |
| 2 | supertest | Runs in the same process as the unit tests |
| 3 | Skip | Nothing checks that the adapters really connect |

**Which frontend integration tests?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **MSW + testing-library** ← recommended | Mocks generated from the openapi types, so they cannot drift from the contract |
| 2 | Hand-written mocks | Faster to write, and silently drift from the contract |

**Which E2E smoke test?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **Playwright** ← recommended | Several browsers, traces you can read afterwards |
| 2 | Cypress | Widely known, but supports fewer browsers |
| 3 | Skip | Nothing checks a real flow before merging |

---

## req 7 · companion skills

Do not dump the whole catalogue. Read `language` and `kindGuess` from `bin/detect`, list the session's skills, and offer only what fits this stack.

Say plainly that a companion adds depth before or after a step, and never replaces a bloop skill.

**Which companion skills should this project use?**

| # | Skill | When it gets called | Why |
| --- | --- | --- | --- |
| 1 | a skill that fits this stack | a decidable condition | what this project gets out of it |
| 2 | ... | | |
| 3 | None | | bloop uses only its own rules |

Pick several numbers, or name a skill yourself.

Then, for each one picked, ask one short question: **when should it be called?** Offer the obvious condition rather than an empty box, for example "every time a slice touches error paths" or "when SURFACES includes ui".

A skill that is not installed can still be recorded, as long as the user is told. It carries the intent to whoever picks up the repo next. Nothing ever fails because a companion is missing.

---

## req 8 · CI

**Where does CI run?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **GitHub Actions** ← recommended | Pick this if the remote is GitHub |
| 2 | GitLab CI | |
| 3 | Bitbucket Pipelines | |
| 4 | No CI yet | Can be set up later, but `checks.sh` still has to exist |

**Which merge style?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **squash merge** ← recommended | main reads as one commit per slice |
| 2 | merge commit | Keeps every intermediate commit |

With squash, add a job that checks the PR title, because the `commit-msg` hook never sees the message that lands on main during a squash.

---

## req 9 · task management

This question is not about where to sync. It asks **where the real issue lives**. One place, never two.

**Where do this project's issues live?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **local** ← recommended | Issues live in the repo at `.bloop/issues/`. No API, no token, works offline |
| 2 | GitHub Projects | Issues live at GitHub. `.bloop/issues/` is not created |
| 3 | Linear | Issues live at Linear. `.bloop/issues/` is not created |
| 4 | Jira | Issues live at Jira. `.bloop/issues/` is not created |

**The MVP supports `local` only.** Choosing 2 to 4 means warning first that box 2 Issue/Story/Task through box 6 Deliver cannot work with that tracker yet. Connecting a tracker belongs to the engine, a separate project, not this plugin. If the user confirms, record only `provider` as an intention.

Do not ask which workspace, team or project number. Nothing in the MVP reads those values, and the config shape the engine will need is not settled, so writing it now means rewriting it later.

---

## req 10 · git strategy

**Which git strategy?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **trunk based** ← recommended | Merge one slice at a time into main, which matches bloop's gate |
| 2 | github flow | A branch per feature, merged into main |
| 3 | git flow | Fights the gate that merges one slice at a time, because slices sit on long-lived branches |

**Which branch types?**

The default is the conventional commits set plus `hotfix`.

| # | Option | Why |
| --- | --- | --- |
| 1 | **The standard set** ← recommended | `feat` `fix` `perf` `refactor` `test` `docs` `build` `ci` `chore` `hotfix`, matching commit types, nothing to translate |
| 2 | Add words of our own | Say which, such as `spike` or `revert` |
| 3 | Do not enforce branch names | `bin/work` checks nothing, and branch names drift |

The shape is `<type>/<issue-id>`, such as `feat/2026-11-24-bulk-order`.

**Which commit convention?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **conventional commits** ← recommended | Changelog tooling can read it |
| 2 | Free form | Nothing enforces a shape |

**Should commitlint enforce it?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **Enforce** ← recommended | Pick this if conventional commits was chosen |
| 2 | Do not enforce | Warn only, let it through |

---

## req 11 · security

**Which secret scanner?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **gitleaks** ← recommended | Fast, fits in pre-commit, needs no network |
| 2 | trufflehog | More thorough, slower |
| 3 | Skip | Nothing catches a token that reaches git |

**Where does the dependency audit run?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **Weekly in CI** ← recommended | Not in `checks.sh`, because it needs the network and its result changes even when the code does not |
| 2 | Every PR | Slower, and fails on things that PR did not cause |
| 3 | Skip | Nobody finds out a dependency has a hole |

---

## req 12 · Claude hooks

**Which hooks should this project's `.claude/settings.json` enable?**

| On | Hook | What it does | Why |
| --- | --- | --- | --- |
| ✓ | `PreToolUse` | Blocks edits to protected paths | Stops edits to generated code, or to a contract that needs review |
| ✓ | `PostToolUse` | Regenerates types when `openapi.yaml` changes | Types and contract can never drift |
| ✗ | `PostToolUse` | Formats the file just edited | Off by default, because it can overwrite what the agent did |
| ✓ | `SessionStart` | Injects the project's rules | A new session knows the architecture without being told |
| ✗ | `Stop` | The plugin owns it, never set it twice | Setting it twice runs the gate twice |

The default protected paths are `openapi.yaml` · `**/migrations/**` · `**/*.gen.*` · `.bloop/config.json`

---

## req 13 · git hooks

**Which git hook runner?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **lefthook** ← recommended | One binary, one config, runs in parallel, not tied to node |
| 2 | husky + lint-staged | The best known option in the node world |
| 3 | pre-commit | The python side's tool |
| 4 | Skip | Broken things die in CI instead |

**What does each hook run?**

| hook | Recommended | Why |
| --- | --- | --- |
| `pre-commit` | format · secret scan | Fast enough not to get in the way of committing |
| `commit-msg` | commitlint | Checks a string, takes under a second |
| `pre-push` | static · unit | The heavy work moves to push, where people accept waiting |

Warn that an overweight hook makes people reach for `--no-verify`, which is the same as having no hook at all.

---

## req 17 · fuzzing

Optional. Skip it on a project that is not ready to act on what fuzzing finds.

**Should bloop set up fuzzing against merged code?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **Not yet** ← recommended on a new project | Nothing has merged yet, so there is nothing to fuzz |
| 2 | Yes, aimed at specific paths | Say which, and what should never be touched |
| 3 | Yes, using our own harness | Name the command that runs a case |

On yes, ask which angles have a surface in this project.

**Which angles should the workers attack from?**

| # | Angle | Pick it when |
| --- | --- | --- |
| 1 | `payload` | Anything takes input from outside. Almost always |
| 2 | `sequence` | Operations have an order, such as place then pay then ship |
| 3 | `concurrency` | Two callers can reach the same row, file or key |
| 4 | `resource` | Requests carry lists, or a dependency can be slow |
| 5 | `ui` | A person uses this with a mouse or a finger |

Then confirm the stopping point: at most **5** findings per run across all workers, so one broken function cannot fill the backlog.

---

## req 18 · delivery

**How does a branch catch up with the base before it merges?**

| # | Option | What it costs |
| --- | --- | --- |
| 1 | **Rebase** ← recommended | A clean line of history. Needs a force-push to the issue's own branch |
| 2 | Merge the base in | No force-push, so review comments stay put. A merge commit per catch-up |

**Which risk levels may merge without asking a person?**

| # | Option | Fits |
| --- | --- | --- |
| 1 | **Only low** ← recommended | The default everywhere until the project has shipped for a while |
| 2 | Low and medium | A project with a strong gate and a `bin/trust` run that passes |
| 3 | None, a person merges everything | Regulated work, or a team that wants to watch the loop first |

High risk always waits for a person. It is not on this list because it is not a choice.

**Who ships?**

| # | Option | What bloop does |
| --- | --- | --- |
| 1 | **CI, on merge** ← recommended | Nothing. `watch` picks up after the deploy |
| 2 | A command we run by hand | Record it. `deliver` shows it and asks every single time |

Ask what signals say a deploy went wrong, in the user's own words, and store them in `watchFor`. Two or three is enough. Without an answer, write `["errors", "latency"]` and say that is a placeholder.

---

## req 15 · loop limits

Four numbers, asked as one question with sensible defaults rather than four prompts.

**How far may the loop go on its own?**

| # | Option | What it means |
| --- | --- | --- |
| 1 | **Review before merge** ← recommended | Everything passes box 5 Review before it merges |
| 2 | Merge, then review | The agent may merge, and main is reviewed afterwards |
| 3 | Autonomous | `fuzz-swarm` may run the whole loop. A human still confirms anything irreversible |

Start at 1 on any project that has not shipped yet. Moving up later needs evidence from `bin/trust`, not a feeling, and only the user may do it.

**What share of landings may be reverts before the loop stops earning more autonomy?**

| # | Ceiling | Fits |
| --- | --- | --- |
| 1 | **0.05** ← recommended | One revert in twenty landings. A normal healthy project |
| 2 | 0.02 | Code where a revert is expensive, such as a payment path |
| 3 | 0.10 | An early project that still moves fast on purpose |

Only pick 2 or 3 on a project that has been running the loop for a while with few reverts. Say that plainly, and that a human is the only one who may raise it later.

Then confirm three numbers in one line, offering the defaults: correction and review rounds **3**, base branch **main**, agents at once **2**.

---

## req 16 · the verify skill

Skip this on a project with no interface, and say why.

**Should bloop set up a verify skill that drives the real app?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **Yes** ← recommended on anything with a UI | box 4 Build has to attach a screenshot on a `ui` surface, and box 5 Review will not review a screen without one |
| 2 | Not yet | UI slices will come back from review unreviewed until there is one |
| 3 | No interface here | Correct answer on a pure backend |

On yes, ask what starts the app and what already drives a browser in this repo. **Reuse what is there rather than adding a dependency.**

---

## req 14 · Handdraw

Never make the user type a board id. Pull the real list from the Handdraw MCP and let them pick a number.

**Which Handdraw board does this project connect to?**

| # | board | |
| --- | --- | --- |
| 1 | a real board name from the MCP | |
| 2 | a real board name from the MCP | |
| 3 | Do not connect | handdraw-sync will say plainly that there is no board |

With no Handdraw MCP in this session, say so plainly and skip. Never guess an id.
