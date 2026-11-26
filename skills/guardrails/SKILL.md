---
name: guardrails
description: Set up or change a project's guardrails in bloop. Lint, typecheck, format, boundary rules, unit and integration tests, checks.sh, AGENTS.md, CI, task management, git strategy, commitlint, feature flags, secret scanning, dependency audit, Claude hooks, git hooks and the Handdraw board. Use when setting up linting, tests, CI, git hooks, commit conventions, security scanning or agent rules, or when the user says guardrails, set up lint, set up CI, set up tests, add a hook.
---

# guardrails

The last step of box 1 Architecting, covering req 4 to 14. Called by `init`, or on its own to change something already set up.

**Output** static check config · test config · `checks.sh` · `AGENTS.md` · CI · `.bloop/issues/` · git strategy · security · Claude hooks · git hooks · Handdraw

## Two standing rules

1. **Ask with options.** Every req that picks a tool offers choices that actually run on this stack, names the recommendation and why, and leaves room to type something else. The full menus are in `references/menus.md`. Read that file before the first question
2. **The recommendation follows what is already there.** If `bin/detect` found `eslint.config.js`, the recommendation is eslint, not biome. guardrails never proposes ripping out something that works. If you do want to propose a change, say what is gained and what is lost

## Step 0 · Detect

Run `"$CLAUDE_PLUGIN_ROOT/bin/detect"` and compare it against `.bloop/config.json`.

* Found by detect but not recorded in config: ask to confirm, then record it. Do not set it up again
* Recorded in config but the file is not there: report that config and reality disagree, then ask whether to write the file or drop it from config
* Missing on both sides: that is what this round sets up

Show the user the list of what will be set up before asking anything.

## Writing files so they can be rerun

Before your first question, read `${CLAUDE_PLUGIN_ROOT}/references/report-style.md` in full. In short: menus and reports are markdown tables, never inside a code block.

Before writing any file, read `references/markers.md` in full. In short: what guardrails writes is wrapped in `bloop:managed <key>` markers, a rerun replaces the block between them, and anything without markers is never touched, only reported.

Talk to the user in the language the user writes in. Everything written to disk is English.

## The order

Work in this order. Anything the user skips gets skipped and recorded, with what skipping it costs.

| req | What it sets up | Files produced |
| --- | --- | --- |
| 4 | lint, format, typecheck, boundary rules | config for the chosen tools + `.dependency-cruiser.cjs` |
| 5 | unit tests, integration tests | config for vitest or whatever was chosen + Bruno or MSW |
| 6 | `checks.sh` | `checks.sh` |
| 7 | prose and companions | `AGENTS.md`, `.claude/skills/`, `review.risk` and `companions` in config |
| 8 | CI | `.github/workflows/checks.yml` + a PR title job when squashing |
| 9 | task management | the `taskManagement` section, plus `.bloop/issues/` and `README.md` only when the provider is local |
| 10 | git strategy | the `git` section including `branchTypes` + `commitlint.config.js` + `flags.json` |
| 11 | security | `.gitleaks.toml` + `.github/workflows/audit.yml` |
| 12 | Claude hooks | `.claude/settings.json` |
| 13 | git hooks | `lefthook.yml` |
| 14 | Handdraw | the `handdraw` section |
| 15 | loop limits | the `loop` section |
| 16 | the verify skill | `.claude/skills/verify/SKILL.md`, on a project with an interface |
| 17 | fuzzing | the `fuzz` section, optional |
| 18 | delivery | the `deliver` section |
| 19 | product docs | the `docs` section, optional |

Templates for every file live in the plugin's `templates/`. Copy and adjust to the answers. Never write one from scratch.

### req 6 · `checks.sh` is the local = CI promise

`checks.sh` has to be the one thing both a dev machine and CI call. If CI runs anything that is not in `checks.sh`, the promise is broken.

* `./checks.sh` runs static + unit + component. Used on every slice, must run offline
* `./checks.sh --e2e` also runs the E2E smoke test. Used before merging
* The dependency audit is **not in** `checks.sh`, because it needs the network and its result changes on its own even when the code does not

### req 7 · companion skills

Besides `AGENTS.md` and `review.risk`, this req records which **companion skills** this project wants used, and when.

A companion is a skill that is not part of bloop: `golang-error-handling` on a Go backend, `lawofux` on a frontend, `pstack:architect` anywhere. Recording them in config, rather than hardcoding names inside our skills, means a Go project and a React project ask for different help from the same plugin.

**A companion never replaces a bloop skill.** bloop's own skills are the path, every time. A companion adds depth: it runs before a step to open the question up, after a step to push on the result, or alongside implementation for language-specific detail. The work still flows through `restate`, `plan`, `build` and `review`, and the files they produce keep their own shape.

```json
"companions": {
  "build": [
    {
      "skill": "golang-error-handling",
      "when": "a slice touches error paths or adds a new error type",
      "why": "this project wraps errors with context and never returns a bare err"
    }
  ],
  "review": [
    {
      "skill": "lawofux",
      "lens": "ux",
      "when": "SURFACES includes ui",
      "why": "grounds UX findings in named laws instead of taste"
    }
  ]
}
```

Four fields. `skill` is the exact name. `when` is a condition that can be decided, not a feeling. `why` is what this project gets out of it. `lens` applies to review entries only, and is one of `code`, `security`, `ux`, `ui`.

**Three rules**

1. **A companion is advice, not a requirement.** If the skill is not in the session, report that and carry on with our own rules. **Never fail, and never go quiet.** Different machines have different skills installed, and making one mandatory would mean the same repo works on one machine and breaks on another
2. **`when` has to be decidable.** Write "when SURFACES includes ui", never "when appropriate". A vague condition means the agent either calls it every time or never
3. **Who reads what.** `build` reads `companions.build`. Each reviewer reads only the `companions.review` rows whose `lens` matches it. `approver` reads none, because it has to judge the results rather than review again

**How to ask.** Read `language` and `kindGuess` from `bin/detect`, list the session's skills, and offer only the ones that fit this stack. Never dump the whole catalogue at the user.

| stack | Typical suggestions |
| --- | --- |
| Go backend | `golang-error-handling` · `golang-project-layout` · `go-test` · `go-annotate` |
| TypeScript frontend | `lawofux` · `craft-design-engineering` · `impeccable` · `oil-ui` |
| Rust | `m06-error-handling` · `m07-concurrency` |
| any stack | `pstack:architect` during box 3 Planning · `pstack:interrogate` when risk is high |

Offering a skill that is not installed is fine, as long as the user knows. It records intent for whoever picks the repo up next.

### req 16 · the verify skill

`checks.sh` runs tests. It never opens the app. A project with a user interface needs something that **drives the real thing and comes back with a picture**, because box 4 Build has to attach a screenshot to any slice on a `ui` surface, and box 5 Review refuses to review a screen without one.

Ask whether to set this up. On a backend with no interface, skip it and say why.

What it produces is `.claude/skills/verify/SKILL.md` **inside the project**, not in this plugin, because only this project knows how to start itself.

It has to carry four things.

1. **How to start the app**, as the exact command, and how to tell when it is ready
2. **How to reach a feature**, the route or the steps, for at least one real feature
3. **How to capture**, the command that takes the screenshot and where it lands
4. **How to stop**, so a run does not leave a server behind

Build it with the project's own tools. Many repos already have a dev server command and a browser driver in their E2E setup. **Reuse those rather than adding a dependency.**

If the session has a companion skill for generating one, `companions.build` may name it. It still has to produce the four things above.

**Write one feature, not all of them.** The point is that the path works. Box 4 Build extends it as slices need new screens.

### req 17 · fuzzing

Optional, and off unless the project asks for it. `fuzz-swarm` runs against code that already merged, looking for what the gate let through.

```json
"fuzz": {
  "targets": ["pkg/order"],
  "exclude": ["pkg/legacy"],
  "dimensions": ["payload", "sequence", "concurrency", "resource", "ui"],
  "cases": 200,
  "maxFindings": 5,
  "command": "go test ./... -run Fuzz",
  "autoRun": {
    "afterMerge": ["high"],
    "afterAutoNext": false,
    "everyMerges": 0,
    "schedule": null
  }
}
```

Ask three things and leave the rest at their defaults: **what to aim at**, **what never to touch**, and **whether this project already has a fuzz harness** worth driving instead of poking the code directly.

`dimensions` is what makes this a swarm rather than a loop. One worker per angle, each attacking the same target differently: `payload` for malformed values, `sequence` for operations out of order, `concurrency` for two callers racing, `resource` for size and slow dependencies, `ui` for a person mashing the interface. **Drop the ones this project has no surface for**, such as `ui` on a backend, and say so when you write the section.

`maxFindings` exists so one broken function cannot fill the backlog. Say that when you set it.

**Without this section `fuzz-swarm` asks before running.** That is deliberate: an unrequested run costs time and can bury the backlog.

Then ask a fourth: **when may it run without being asked?** Each trigger is its own setting, so offer them as checkboxes.

| On | Trigger | What it costs |
| --- | --- | --- |
| ✓ | `afterMerge: ["high"]` after a high-risk merge | One run per risky merge, aimed at what it touched. The cheapest useful default |
| ✗ | `afterAutoNext` at the end of `/bloop:auto --next` | One run per backlog run. Fits a project that clears its backlog with `--next` |
| ✗ | `everyMerges: <n>` after n merges | Runs grow with the team's pace, not the calendar |
| ✗ | `schedule: "<cron>"` | A fixed cost every week, whether or not anything merged. A run with nothing new stops at once |

A `schedule` needs something to wake it. Register `/bloop:fuzz-swarm --scheduled` on that cron with the session's scheduler: a local scheduled task when the session has one, so it runs where the issue files live. Otherwise show the user the command to register it, and say the trigger does nothing until they do.

### req 18 · delivery

What box 6 Deliver may do on its own, and what it must always ask about.

```json
"deliver": {
  "sync": "rebase",
  "autoMerge": { "low": true, "medium": false, "high": false },
  "deployCommand": null,
  "rollbackCommand": null,
  "watchFor": ["error rate", "p95 latency"]
}
```

| key | What it controls | Default |
| --- | --- | --- |
| `sync` | How a branch catches up with the base before merging, `rebase` or `merge` | `rebase` |
| `autoMerge` | Which `RISK` levels may merge without asking, read from `intake.md` | low only |
| `deployCommand` | The command that ships, when CI does not do it on merge | `null`, meaning CI owns it |
| `rollbackCommand` | The command that undoes a deploy | `null` |
| `watchFor` | What `watch` looks at after a deploy | the user's own list |

**`autoMerge` for `high` is refused whatever the config says.** A high-risk change always waits for a person. That is a floor, not a setting, so there is no menu option that turns it off.

`sync: rebase` means a force-push to the issue's own branch. Say this out loud when writing the section: **the base branch is never force-pushed**, and a branch with open review comments is asked about first, because the push detaches those comments from their commits.

**`deployCommand` and `rollbackCommand` are never run without the user saying so in that session**, at any `trustLevel`. They go outside this machine and they are hard to undo. The config records the command so nobody has to remember it. It does not grant permission to run it.

With `deployCommand: null`, bloop does not ship. CI does, on merge, and `watch` picks up from there. That is the normal case and the recommended one.

### req 15 · loop limits

Five numbers the whole plugin reads, so nobody hardcodes them.

```json
"loop": {
  "maxRounds": 3,
  "baseBranch": "main",
  "concurrency": 2,
  "trustLevel": "supervised",
  "revertCeiling": 0.05,
  "trustWindowDays": 30,
  "trustPreviousDays": 30,
  "trustMinLandings": 5,
  "autoBudget": 12
}
```

| key | What it controls | Default |
| --- | --- | --- |
| `maxRounds` | How many times box 4 Build may correct, and how many review rounds box 5 Review allows, before a human has to look | 3 |
| `baseBranch` | What `bin/work` cuts a branch from | `main` |
| `concurrency` | How many agents run at once, in box 5 Review's lenses and in `fuzz-swarm` | 2 |
| `trustLevel` | How far the loop may go without a human. See below | `supervised` |
| `revertCeiling` | The share of landings that may be reverts before `bin/trust` says no | `0.05` |
| `trustWindowDays` | How far back `bin/trust`'s window reaches from today | 30 |
| `trustPreviousDays` | How long the window before it is | 30 |
| `trustMinLandings` | How many landings a window needs before it counts at all | 5 |
| `autoBudget` | How many skill runs one `/bloop:auto` call may make, across every issue it takes, before it stops and reports | 12 |

**One number, used in two places.** `maxRounds` caps both the correction ladder in box 4 Build and the review rounds in box 5 Review. Two separate numbers would mean two things to remember and two to tune.

#### `trustLevel`

| Level | What it allows |
| --- | --- |
| `supervised` | The default. Every question waits for a person, the merge included |
| `trusted` | `/bloop:auto` answers the routine questions itself, such as confirming a restate or pushing. The merge still waits for a person |
| `autonomous` | As `trusted`, and a merge happens on its own when every condition in `deliver` holds. `RISK: high` never does |

`${CLAUDE_PLUGIN_ROOT}/references/trust-levels.md` lists exactly which questions each level answers, which none ever does, and how each answer is recorded. Older configs say `review-before-merge`, `merge-then-review` or `autonomous`. Read them as `supervised`, `trusted` and `autonomous`, and write the new name the next time this section is rewritten.

**Only a human moves this up.** An agent may never raise it, the same rule as `CONFIRMED` and `APPROVED-BY`.

Raise it when two things are true at once: reverts are rare and stable, and box 5 Review has stopped finding things the gate should have caught.

**Both conditions are measured, not felt.**

```sh
"$CLAUDE_PLUGIN_ROOT/bin/trust" --for <the level asked for>
```

It reads the base branch and prints the revert rate of two windows, against `revertCeiling`, and whether each level's bar is met. It writes nothing.

| Going up to | `bin/trust --for <level>` exits 0 when | Why that bar |
| --- | --- | --- |
| `trusted` | the window holds at least `trustMinLandings` landings and its revert rate is under `revertCeiling` | `trusted` never merges on its own. A person still sees every change before `main` does, so one good window is enough |
| `autonomous` | both the window and the previous one do. Rare **and** stable | `autonomous` merges on its own, so a good month has to be followed by another |

The window ends today and is `loop.trustWindowDays` long. The previous one sits right before it and is `loop.trustPreviousDays` long. Both default to 30. A window with fewer landings than `loop.trustMinLandings`, 5 by default, counts as no evidence either way: the minimum is what stops a short window from passing on luck. `--window`, `--previous`, `--days` and `--min` change them for one run.

The second condition comes from `## Why the gate missed this` in `build.md`, which records every `[must]` that review caught and the gate let through.

When the user asks to raise `trustLevel`, run `bin/trust --for <that level>`, quote its numbers, and say what the recent `## Why the gate missed this` lines show. **Never raise it because the loop has been quiet for a while**, and never raise it yourself.

### req 9 · task management

**An issue always has exactly one source.** The answer to req 9 is where the real issue lives, not a destination to sync to. Never keep it in two places and hope they agree.

| provider | Where issues live | Create `.bloop/issues/`? |
| --- | --- | --- |
| `local` | `.bloop/issues/<issue-id>/` | Yes, with a `README.md` |
| `github-project` · `linear` · `jira` | At that tracker | **No** |

Write `.bloop/config.json` to match. Never include keys that do not apply.

```json
"taskManagement": { "provider": "local", "issuesDir": ".bloop/issues", "idFormat": "date-slug" }
```

```json
"taskManagement": { "provider": "linear" }
```

**The MVP supports `local` only.** Another provider can be recorded as an intention, but box 2 Issue/Story/Task through box 6 Deliver cannot work with it. Connecting Linear or GitHub is the engine project's job, a separate project, not a `tracker-sync` skill in this plugin. See `drafts/ENGINE.md`.

Do not ask for a team, project number or workspace. Nothing in the MVP reads those.

Rules for `local`

* The id is `<YYYY-MM-DD>-<slug>`, usable as a branch name directly, with no counter for parallel sessions to fight over
* **No central index file.** An issue's state lives in its own folder. A central index is where parallel sessions overwrite each other
* An issue's state is the stage of the SDLC it is in. There is no separate status field

If the user picks a provider other than local, warn them as above. If they confirm, record it and do not create `.bloop/issues/`.

### req 10 · git strategy

**Branch names use the same words as commit types.** Never invent a second vocabulary, or there are two places deciding the same thing and one day they disagree, and the CI job checking PR titles on squash merge has to translate between them.

The branch shape is `<type>/<issue-id>`, where `<issue-id>` is the folder name under `.bloop/issues/` verbatim, such as `feat/2026-11-24-bulk-order`. That lets `bin/work` map a branch back to an issue with no lookup table.

`hotfix` is the one exception that is not a commit type. It is a statement about process, that this work jumps the queue. The commits inside are still `fix`.

Trunk based is the recommendation. If the user picks git flow, warn that it fights the gate that merges one slice at a time, because slices sit on long-lived branches.

Store the merge style the menu asks about, because `bin/ship` reads it and otherwise has to guess.

```json
"git": { "branchTypes": ["feat", "fix"], "mergeStyle": "squash" }
```

Anything unfinished on main sits behind a feature flag. Every flag in `flags.json` needs an `owner` and a `removeWhen`. A flag without both is litter nobody dares delete.

### req 12 · Claude hooks

This is the project's `.claude/settings.json`, not the `bloop` plugin's own hooks.

* `PreToolUse` blocks Write and Edit on protected paths, such as `openapi.yaml`, migrations, generated code and `.bloop/config.json`
* `PostToolUse` regenerates types when `openapi.yaml` changes, on by default. Formatting the file just edited is off by default, because formatting every time can overwrite what the agent did
* `SessionStart` injects the project's rules and a summary of `ARCHITECTURE.md`
* `Stop` **must never be set here.** The plugin owns it. Setting it twice runs the gate twice

Warn the user in one sentence that `.claude/settings.json` is code that runs on the machine of everyone who clones this repo, so what goes in has to be readable and must never fetch anything from the network.

### req 13 · git hooks

The weight of each hook matters more than which runner. Trunk based means committing often. A heavy `pre-commit` makes people reach for `--no-verify`, and then everything fails at once.

* `pre-commit` only fast things that need no network: format and secret scan
* `commit-msg` runs commitlint
* `pre-push` runs static and unit
* CI runs everything

### req 14 · Handdraw

Optional, skippable. To connect it, pull the real board list from the Handdraw MCP and let the user choose. Never make them type an id. With no MCP, say so plainly and skip.

Store only `board`.

```json
"handdraw": { "board": "brd_..." }
```

### req 19 · product docs

Optional. `/bloop:docs` writes the product documentation as Fumadocs-ready MDX, and `--serve` previews it. Without this section it uses the defaults below.

```json
"docs": {
  "dir": "docs/product",
  "baseUrl": "/docs",
  "port": 4000,
  "serveCommand": null,
  "language": "en"
}
```

| key | What it controls | Default |
| --- | --- | --- |
| `dir` | Where the MDX pages live | `docs/product` |
| `baseUrl` | The path the project's Fumadocs site serves the docs at. Links between pages use it | `/docs` |
| `port` | The port of the preview `--serve` starts | `4000` |
| `serveCommand` | The project's own Fumadocs dev command. When set, `--serve` runs it instead of the preview | `null`, use the preview |
| `language` | The language the pages are written in | `en` |

Ask one thing: **does this project already have a Fumadocs site, or want one?**

| # | Option | Why |
| --- | --- | --- |
| 1 | **The preview only** ← recommended | `--serve` builds one in `.bloop/docs-site/`, gitignored. Nothing to maintain. Good until the docs need to be public |
| 2 | Point at the project's own site | Set `serveCommand`, and point its `source.config.ts` at `dir` with `defineDocs({ dir: 'docs/product' })`. Mermaid needs `remarkMdxMermaid` and a `Mermaid` component, and the API reference needs `fumadocs-openapi` with `staticSource({ baseDir: 'openapi', groupBy: 'tag', meta: true })` in the loader. The preview's `lib/` and `components/` show both |
| 3 | Create a site in the repo | `npm create fumadocs-app`, then option 2. Only when the docs will be deployed |

## Done when

1. `./checks.sh` actually ran and passed on this machine. Never report done without running it
1. If req 16 was set up, the verify skill drove the app and produced one real screenshot. A skill that has never run is not a gate
2. `.bloop/config.json` has every section for the reqs that were not skipped
3. `bin/detect` returns `stage` as `ready`

Close with a table in the shape from `${CLAUDE_PLUGIN_ROOT}/references/report-style.md`, under reporting at the end of a box. Never inside a code block.

The table groups by purpose, saying what was set up, then three closing lines.

**Skipped** what was skipped, and what skipping it costs
**Run these yourself** any commands the user has to run, such as `pnpm install` or `lefthook install`
**Next** the step that follows
